import asyncio
import hashlib
import json
import os
import shutil
from copy import deepcopy

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from fastapi import Request
from fastapi.responses import JSONResponse

from takya.application.coordinator import Failure, ident, now
from takya.evidence.api import Signer, build_package


class Exports:
    def __init__(self, coordinator):
        self.coordinator = coordinator
        self.signer = Signer()
        self.keys, self.tasks = {}, []
        self.active = False
        self.socket_server = None

    async def start(self):
        self.socket_server = await asyncio.start_unix_server(
            self.recover, str(self.coordinator.root / "recovery.sock"), limit=512
        )
        os.chmod(self.coordinator.root / "recovery.sock", 0o600)

    async def stop(self):
        await asyncio.gather(*self.tasks, return_exceptions=True)
        if self.socket_server:
            self.socket_server.close()
            await self.socket_server.wait_closed()
        self.keys.clear()

    async def recover(self, reader, writer):
        # Private Unix socket: local UID only, not exposed through HTTP/BFF.
        try:
            package_id = (await asyncio.wait_for(reader.readline(), 3)).decode().strip()
            sid, key = self.keys[package_id]
            s = self.coordinator.session(sid)
            if package_id not in s.exports:
                raise ValueError("Missing export")
            writer.write(
                json.dumps(
                    {"key": key.hex() if key else None, "public_key": self.signer.public.hex()}
                ).encode()
                + b"\n"
            )
            await writer.drain()
        except Exception:
            writer.write(b'{"error":"No disponible"}\n')
        finally:
            writer.close()
            await writer.wait_closed()

    def prepare(self, s, resource_id, level, revision, key, *, is_source=False):
        c = self.coordinator
        payload = {"resource_id": resource_id, "level": level, "expected_revision": revision}
        old = c.replay_get(s, "export", key, payload)
        if old:
            return s.exports[old["export_id"]]
        if level not in ("E1", "E2") or type(revision) is not int:
            raise Failure("BAD_REQUEST", "Nivel o revisión inválidos.", 422)
        incident = None if is_source else c.resource(s.incidents, resource_id)
        if incident and incident["revision"] != revision:
            raise Failure("REVISION_CONFLICT", "El caso cambió antes de exportar.", 409)
        source = c.resource(s.sources, resource_id if is_source else incident["source_id"])
        if self.active or c.active or len(s.exports) >= 2:
            raise Failure(
                "AT_CAPACITY", "Espera el análisis/exportación o cierra este ejercicio.", 429
            )
        if shutil.disk_usage(c.root).free < 512 * 1024 * 1024:
            raise Failure("DISK_QUOTA", "Espacio insuficiente para exportar.", 507)
        pid = ident("pkg")
        c.reserve_disk(192 * 1024 * 1024)
        snapshot = s.root / (pid + "-snapshot")
        snapshot.mkdir(mode=0o700)
        try:
            (snapshot / "sources").mkdir(mode=0o700)
            os.link(s.evidence[source["id"]], snapshot / "sources/source.mp4")
            analysis = {
                "source": deepcopy(source),
                "incident": deepcopy(incident),
                "observations": [],
                "bbox_format": "normalized_xywh",
                "detection_scope": "candidates_not_identity_or_intent",
            }
            transformations = []
            if incident:
                analysis["observations"] = [
                    deepcopy(s.observations[oid]) for oid in incident["observation_ids"]
                ]
                work = s.root / incident["job_id"]
                analysis["zone_config"] = json.loads((work / "config.json").read_text())
                analysis["sampling"] = json.loads((work / "result.json").read_text())
                # Only observations from this incident; sampling provenance stays explicit.
                analysis["sampling"].pop("tracks", None)
                (snapshot / "derivatives").mkdir(mode=0o700)
                for still in incident["stills"]:
                    os.link(s.evidence[still["id"]], snapshot / f"derivatives/{still['id']}.png")
                if s.decisions.get(incident["id"]):
                    (snapshot / "decision.json").write_text(
                        json.dumps(s.decisions[incident["id"]][-1])
                    )
                    analysis["decision_history"] = deepcopy(s.decisions[incident["id"]])
                transformations = [
                    {
                        "tool": "FFmpeg",
                        "tool_version": "system; see runtime report",
                        "operation": "downscale_for_analysis",
                        "audio_removed": True,
                    },
                    {
                        "tool": "Pillow",
                        "tool_version": __import__("PIL").__version__,
                        "operation": "frame_extract_png",
                        "audio_removed": True,
                    },
                ]
            (snapshot / "meta.json").write_text(
                json.dumps(
                    {
                        "package_id": pid,
                        "incident_id": resource_id,
                        "incident_revision": revision,
                        "source_id": source["id"],
                        "created_at": now(),
                        "level_requested": level,
                    }
                )
            )
            (snapshot / "analysis.json").write_text(json.dumps(analysis, allow_nan=False))
            (snapshot / "transformations.json").write_text(json.dumps(transformations))
            (snapshot / "session-log.jsonl").write_text(
                "".join(json.dumps(e) + "\n" for e in s.log)
            )
        except Exception:
            shutil.rmtree(snapshot)
            c.disk_reserved -= 192 * 1024 * 1024
            raise
        export = {
            "export_id": pid,
            "state": "PREPARING",
            "level": level,
            "fingerprint_public_key": hashlib.sha256(self.signer.public).hexdigest(),
            "incident_revision": revision,
            "key_saved": False,
        }
        s.exports[pid] = export
        c.replay_save(s, "export", key, payload, export)
        self.active = True
        s.leases += 1
        self.tasks.append(asyncio.create_task(self.build(s, export, snapshot)))
        return export

    async def build(self, s, export, snapshot):
        pid = export["export_id"]
        key = AESGCM.generate_key(bit_length=256) if export["level"] == "E2" else None
        try:
            export["state"] = "VERIFYING"
            result = await asyncio.to_thread(
                build_package,
                snapshot,
                s.root / "packages",
                signer=self.signer,
                key_provider=lambda: key,
            )
            s.evidence[pid] = result.path
            self.keys[pid] = (s.id, key)
            export["state"] = "READY"
            s.audit("export_verified", pid)
        except Exception:
            export["state"] = "FAILED"
        finally:
            shutil.rmtree(snapshot)
            s.leases -= 1
            self.active = False
            self.coordinator.disk_reserved -= 192 * 1024 * 1024

    def attach(self, app):
        c = self.coordinator

        async def prepare(request, rid, is_source):
            s = c.session(request.headers.get("x-takya-session"), True)
            raw = bytearray()
            async for chunk in request.stream():
                raw.extend(chunk)
                if len(raw) > 1024:
                    raise Failure("PAYLOAD_TOO_LARGE", "Solicitud demasiado grande.", 413)
            try:
                data = json.loads(raw)
                if set(data) != {"level", "expected_revision"}:
                    raise ValueError()
            except (ValueError, TypeError):
                raise Failure("BAD_REQUEST", "Indica nivel y revisión esperada.", 422) from None
            return JSONResponse(
                self.prepare(
                    s,
                    rid,
                    data["level"],
                    data["expected_revision"],
                    request.headers.get("idempotency-key"),
                    is_source=is_source,
                ),
                202,
            )

        @app.post("/incidents/{iid}/export")
        async def incident_export(iid: str, request: Request):
            return await prepare(request, iid, False)

        @app.post("/sources/{sid}/export")
        async def source_export(sid: str, request: Request):
            return await prepare(request, sid, True)

        @app.get("/exports/{pid}")
        async def export(pid: str, request: Request):
            s = c.session(request.headers.get("x-takya-session"))
            item = c.resource(s.exports, pid)
            if request.query_params.get("download") == "1":
                if item["state"] not in ("READY", "DOWNLOADED"):
                    raise Failure(
                        "EXPORT_NOT_READY", "La exportación todavía no está verificada.", 409
                    )
                path = c.resource(s.evidence, pid)
                # Serving is not receipt: record request, never claim completed download/receipt.
                s.audit("download_requested_not_receipt", pid)
                return await app.state.stream(
                    s, path, request, "application/octet-stream", path.name
                )
            return item
