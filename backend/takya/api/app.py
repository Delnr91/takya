import asyncio
import hashlib
import os
import re
import secrets
from contextlib import asynccontextmanager, suppress
from copy import deepcopy
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response, StreamingResponse

from takya.adapters.exports import Exports
from takya.application.coordinator import MAX_SOURCE, Coordinator, Failure, ident, now
from takya.domain.contracts import LIMITS, Decision, Review, ZoneConfig, validate
from takya.video.probe import probe


def create_app(root: Path, model: Path, service_token: str):
    coordinator = Coordinator(root, model)
    exports = Exports(coordinator)

    @asynccontextmanager
    async def lifespan(app):
        await exports.start()
        reaper = asyncio.create_task(coordinator.reap())
        yield
        reaper.cancel()
        with suppress(asyncio.CancelledError):
            await reaper
        await exports.stop()
        await coordinator.shutdown()

    app = FastAPI(lifespan=lifespan, docs_url=None, redoc_url=None, openapi_url=None)
    app.state.coordinator = coordinator
    app.state.exports = exports

    @app.middleware("http")
    async def boundary(request, call_next):
        token = request.headers.get("authorization", "")
        if not secrets.compare_digest(token, "Bearer " + service_token):
            return JSONResponse(
                {"code": "UNAUTHENTICATED_SESSION", "message": "Acceso local requerido."}, 401
            )
        try:
            response = await call_next(request)
        except Exception:
            return JSONResponse(
                {"code": "INTERNAL", "message": "No se pudo completar la operación."}, 500
            )
        response.headers.update({"Cache-Control": "no-store", "X-Content-Type-Options": "nosniff"})
        return response

    @app.exception_handler(Failure)
    async def failure(request, exc):
        return JSONResponse({"code": exc.code, "message": exc.message}, exc.status)

    @app.exception_handler(RequestValidationError)
    async def validation_error(request, exc):
        return JSONResponse(
            {"code": "BAD_REQUEST", "message": "Solicitud fuera del contrato permitido."}, 422
        )

    def session(request, touch=False):
        return coordinator.session(request.headers.get("x-takya-session", ""), touch)

    async def body(request, cls):
        raw = bytearray()
        async with asyncio.timeout(10):
            async for chunk in request.stream():
                raw.extend(chunk)
                if len(raw) > 16384:
                    raise Failure("PAYLOAD_TOO_LARGE", "Solicitud demasiado grande.", 413)
        try:
            return cls.model_validate_json(raw).root
        except ValueError:
            raise Failure(
                "INVALID_ZONE" if cls is ZoneConfig else "BAD_REQUEST",
                "Revisa los valores y campos de la solicitud.",
                422,
            ) from None

    @app.post("/sessions")
    async def new_session(request: Request):
        # An existing cookie resumes its session without extending it by polling.
        sid = request.headers.get("x-takya-session")
        s = coordinator.session(sid) if sid else coordinator.create_session()
        return JSONResponse(
            {"session_id": s.id, "limits": LIMITS, "expires_in_s": 1800, "max_s": 7200}, 201
        )

    @app.get("/sessions/{sid}")
    async def get_session(sid: str, request: Request):
        import time

        s = session(request)
        if sid != s.id:
            raise Failure("NOT_FOUND", "Sesión no disponible.", 404)
        return {
            "session_id": s.id,
            "expires_in_s": max(
                0,
                int(
                    min(
                        1800 - (time.monotonic() - s.touched), 7200 - (time.monotonic() - s.created)
                    )
                ),
            ),
            "sources": list(s.sources.values()),
            "jobs": list(s.jobs.values()),
        }

    @app.post("/sessions/{sid}/close")
    async def close_session(sid: str, request: Request):
        s = session(request)
        if sid != s.id:
            raise Failure("NOT_FOUND", "Sesión no disponible.", 404)
        await coordinator.close(s)
        return Response(status_code=204)

    @app.post("/uploads")
    async def upload(request: Request):
        s = session(request, True)
        if request.headers.get("x-takya-authorization-ack") != "true":
            raise Failure("BAD_REQUEST", "Confirma autorización y límites antes de cargar.")
        if request.headers.get("content-type") != "video/mp4":
            raise Failure("UNSUPPORTED_MEDIA", "Solo video MP4.", 415)
        name = request.headers.get("x-takya-filename", "archivo.mp4")
        from urllib.parse import unquote

        name = unquote(name)
        if (
            not 1 <= len(name) <= 120
            or any(ord(c) < 32 for c in name)
            or "/" in name
            or "\\" in name
        ):
            raise Failure("BAD_REQUEST", "Nombre de archivo inválido.")
        coordinator.reserve_upload(s)
        sid = ident("src")
        part = s.root / (sid + ".part")
        path = s.root / (sid + ".mp4")
        probe_dir = s.root / (sid + "-probe")
        probe_dir.mkdir(mode=0o700)
        size, sha = 0, hashlib.sha256()
        try:
            async with asyncio.timeout(45):
                with part.open("xb") as f:
                    os.chmod(part, 0o600)
                    async for chunk in request.stream():
                        size += len(chunk)
                        if size > MAX_SOURCE:
                            raise Failure("PAYLOAD_TOO_LARGE", "Máximo 32 MiB por fuente.", 413)
                        sha.update(chunk)
                        f.write(chunk)
                    f.flush()
                    os.fsync(f.fileno())
                if size == 0:
                    raise ValueError("Archivo vacío")
                metadata = await probe(part, probe_dir)
                source = dict(
                    id=sid,
                    session_id=s.id,
                    sha256=sha.hexdigest(),
                    size_bytes=size,
                    display_name=name,
                    **metadata,
                    received_at=now(),
                    capture_time=None,
                    capture_time_provenance="unknown",
                    authorization_acknowledged=True,
                )
                validate("source", source)
                os.chmod(part, 0o400)
                part.replace(path)
                s.sources[sid] = source
                s.evidence[sid] = path
                s.audit("source_received", sid)
                return JSONResponse(source, 201)
        except (ValueError, TimeoutError):
            raise Failure(
                "INVALID_SOURCE",
                "No se pudo validar MP4/H.264, 60 s, 1280 × 720 e inicio cero.",
                422,
            ) from None
        finally:
            part.unlink(missing_ok=True)
            probe_dir.rmdir()
            coordinator.uploads -= 1
            coordinator.disk_reserved -= MAX_SOURCE
            s.leases -= 1

    @app.post("/jobs")
    async def jobs(request: Request):
        s = session(request, True)
        config = await body(request, ZoneConfig)
        if exports.active:
            raise Failure("AT_CAPACITY", "Espera a que termine la exportación.", 429)
        return JSONResponse(
            coordinator.create_job(s, config, request.headers.get("idempotency-key")), 202
        )

    @app.get("/jobs/{jid}")
    async def job(jid: str, request: Request):
        return coordinator.resource(session(request).jobs, jid)

    @app.post("/jobs/{jid}/cancel")
    async def cancel(jid: str, request: Request):
        return await coordinator.cancel(session(request, True), jid)

    @app.get("/incidents/{iid}")
    async def incident(iid: str, request: Request):
        return coordinator.resource(session(request).incidents, iid)

    @app.post("/incidents/{iid}/review")
    async def review(iid: str, request: Request):
        s = session(request, True)
        data = await body(request, Review)
        item = coordinator.resource(s.incidents, iid)
        if data == s.reviews.get(iid):
            return item  # Exact replay cannot increment the revision twice.
        if data["expected_revision"] != item["revision"] or item["review_state"] not in (
            "PENDING",
            "IN_REVIEW",
        ):
            raise Failure("REVISION_CONFLICT", "El caso cambió. Recarga su revisión.", 409)
        expected_stills = {still["id"] for still in item["stills"]}
        if (
            not data["viewed_clip"]
            or not data["acknowledged_unknowns"]
            or set(data["viewed_stills"]) != expected_stills
        ):
            raise Failure(
                "NOT_REVIEWED", "Revisa fuente, imágenes y límites antes de decidir.", 409
            )
        item.update(review_state="IN_REVIEW", revision=item["revision"] + 1)
        s.reviews[iid] = data
        s.audit("review_acknowledged", iid)
        return item

    @app.post("/incidents/{iid}/decisions")
    async def decide(iid: str, request: Request):
        s = session(request, True)
        data = await body(request, Decision)
        key = (
            request.headers.get("idempotency-key") or f"revision-{iid}-{data['expected_revision']}"
        )
        prior = coordinator.replay_get(s, "decision:" + iid, key, data)
        if prior:
            return JSONResponse(prior, 201)
        item = coordinator.resource(s.incidents, iid)
        if data["expected_revision"] != item["revision"]:
            raise Failure("REVISION_CONFLICT", "El caso cambió. Recarga su revisión.", 409)
        if item["review_state"] != "IN_REVIEW" and not (
            item["review_state"] == "VERIFIED" and data["type"] == "ESCALATE"
        ):
            raise Failure("NOT_REVIEWED", "Esta transición requiere revisión humana previa.", 409)
        item.update(
            review_state={"VERIFY": "VERIFIED", "DISMISS": "DISMISSED", "ESCALATE": "ESCALATED"}[
                data["type"]
            ],
            revision=item["revision"] + 1,
        )
        record = {
            "id": ident("dec"),
            "incident_id": iid,
            "incident_revision": item["revision"],
            "type": data["type"],
            "reason_code": data["reason_code"],
            "reason_text": data["reason_text"],
            "decided_at": now(),
            "actor_scope": "exercise_session_not_verified_identity",
            "identity_scope": "none",
            "simulated_scope": "no_dispatch_no_institutional_receipt",
            "review_marks": deepcopy(s.reviews[iid]),
        }
        validate("decision-record", record)
        s.decisions.setdefault(iid, []).append(record)
        s.audit("decision_" + data["type"].lower(), iid)
        coordinator.replay_save(s, "decision:" + iid, key, data, record)
        return JSONResponse(record, 201)

    async def stream(s, path, request, mime, attachment=None):
        size = path.stat().st_size
        start, end, status = 0, size - 1, 200
        headers = {"Accept-Ranges": "bytes", "Cache-Control": "no-store"}
        if attachment:
            headers["Content-Disposition"] = f'attachment; filename="{attachment}"'
        value = request.headers.get("range")
        if value:
            match = re.fullmatch(r"bytes=(\d{1,12})-(\d{0,12})", value)
            if not match:
                return Response(status_code=416, headers={"Content-Range": f"bytes */{size}"})
            start = int(match[1])
            end = min(int(match[2]), size - 1) if match[2] else size - 1
            if start > end or start >= size:
                return Response(status_code=416, headers={"Content-Range": f"bytes */{size}"})
            status = 206
            headers["Content-Range"] = f"bytes {start}-{end}/{size}"
        headers["Content-Length"] = str(end - start + 1)
        s.leases += 1

        async def chunks():
            try:
                with path.open("rb") as f:
                    f.seek(start)
                    remaining = end - start + 1
                    while remaining:
                        data = f.read(min(65536, remaining))
                        if not data:
                            raise OSError("Archivo incompleto")
                        remaining -= len(data)
                        yield data
                        await asyncio.sleep(0)
            finally:
                s.leases -= 1

        return StreamingResponse(chunks(), status_code=status, media_type=mime, headers=headers)

    @app.get("/evidence/{eid}")
    async def evidence(eid: str, request: Request):
        s = session(request)
        path = coordinator.resource(s.evidence, eid)
        return await stream(s, path, request, "video/mp4" if path.suffix == ".mp4" else "image/png")

    # Export routes are attached through the evidence adapter, keeping worker and crypto independent.
    app.state.stream = stream
    exports.attach(app)
    return app
