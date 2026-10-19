import asyncio
import base64
import hashlib
import json
import os
import re
import secrets
import shutil
import time
from copy import deepcopy
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path

from takya.detection.yolox import DETECTOR, WEIGHTS_SHA256
from takya.domain.contracts import validate
from takya.runtime import sandbox

TERMINAL = {"COMPLETED", "FAILED", "CANCELLED", "EXPIRED"}
MAX_SOURCE = 32 * 1024 * 1024
MAX_STORED = 128 * 1024 * 1024


def ident(prefix):
    return prefix + "_" + secrets.token_urlsafe(18)


def now():
    return datetime.now(UTC).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def digest(data):
    return hashlib.sha256(
        json.dumps(data, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()
    ).hexdigest()


class Failure(Exception):
    def __init__(self, code, message, status=400):
        self.code, self.message, self.status = code, message, status


@dataclass
class Session:
    id: str
    root: Path
    created: float = field(default_factory=time.monotonic)
    touched: float = field(default_factory=time.monotonic)
    leases: int = 0
    sources: dict = field(default_factory=dict)
    jobs: dict = field(default_factory=dict)
    incidents: dict = field(default_factory=dict)
    observations: dict = field(default_factory=dict)
    evidence: dict = field(default_factory=dict)
    reviews: dict = field(default_factory=dict)
    decisions: dict = field(default_factory=dict)
    replay: dict = field(default_factory=dict)
    exports: dict = field(default_factory=dict)
    log: list = field(default_factory=list)

    def expired(self):
        return time.monotonic() - self.touched >= 1800 or time.monotonic() - self.created >= 7200

    def audit(self, action, resource):
        self.log.append({"at": now(), "action": action, "resource": resource})


class Coordinator:
    def __init__(self, root: Path, model: Path):
        self.root, self.model = root, model
        root.mkdir(parents=True, mode=0o700, exist_ok=True)
        self.sessions, self.tasks, self.processes = {}, {}, {}
        self.slots = asyncio.Semaphore(1)
        self.uploads = 0
        self.active = 0
        self.disk_reserved = 0

    def reserve_disk(self, size):
        used = sum(p.stat().st_size for p in self.root.rglob("*") if p.is_file())
        if used + self.disk_reserved + size > 512 * 1024 * 1024:
            raise Failure("DISK_QUOTA", "Cuota de 512 MiB del coordinador alcanzada.", 507)
        self.disk_reserved += size

    def session(self, sid, touch=False):
        s = self.sessions.get(sid)
        if s is None or s.expired():
            raise Failure("SESSION_EXPIRED", "La sesión terminó. Crea un ejercicio nuevo.", 410)
        if touch:
            s.touched = time.monotonic()
        return s

    def create_session(self):
        if len(self.sessions) >= 8:
            raise Failure("AT_CAPACITY", "Cierra un ejercicio antes de abrir otro.", 429)
        sid = ident("ses")
        root = self.root / sid
        root.mkdir(mode=0o700)
        s = Session(sid, root)
        self.sessions[sid] = s
        s.audit("session_created", sid)
        return s

    def resource(self, collection, rid):
        if rid not in collection:
            raise Failure("NOT_FOUND", "Recurso no disponible en este ejercicio.", 404)
        return collection[rid]

    def reserve_upload(self, s):
        used = sum(
            src["size_bytes"] for ses in self.sessions.values() for src in ses.sources.values()
        )
        if self.uploads >= 2 or len(s.sources) + s.leases >= 2:
            raise Failure("AT_CAPACITY", "Capacidad de cargas alcanzada.", 429)
        if used + (self.uploads + 1) * MAX_SOURCE > MAX_STORED:
            raise Failure("DISK_QUOTA", "Cuota global de fuentes alcanzada.", 507)
        if shutil.disk_usage(self.root).free < 512 * 1024 * 1024:
            raise Failure("DISK_QUOTA", "Se requieren 512 MiB libres para trabajar.", 507)
        self.reserve_disk(MAX_SOURCE)
        self.uploads += 1
        s.leases += 1

    def replay_get(self, s, operation, key, payload):
        if not key or not 16 <= len(key) <= 80 or not key.isascii():
            raise Failure("BAD_REQUEST", "Falta una clave de idempotencia válida.")
        previous = s.replay.get((operation, key))
        if previous:
            if previous[0] != digest(payload):
                raise Failure("IDEMPOTENCY_CONFLICT", "La clave corresponde a otra solicitud.", 409)
            return deepcopy(previous[1])
        if len(s.replay) >= 128:
            raise Failure("AT_CAPACITY", "Límite de operaciones del ejercicio alcanzado.", 429)
        return None

    def replay_save(self, s, op, key, payload, result):
        s.replay[op, key] = digest(payload), deepcopy(result)

    def create_job(self, s, config, key):
        prior = self.replay_get(s, "job", key, config)
        if prior:
            return s.jobs[prior["id"]]
        source = self.resource(s.sources, config["source_id"])
        if len(s.jobs) >= 4 or self.active >= 2:
            raise Failure("AT_CAPACITY", "Hay un trabajo activo y como máximo uno esperando.", 429)
        if (
            not self.model.is_file()
            or hashlib.sha256(self.model.read_bytes()).hexdigest() != WEIGHTS_SHA256
        ):
            raise Failure(
                "BACKEND_UNAVAILABLE", "Detector local no disponible o pesos alterados.", 503
            )
        jid = ident("job")
        self.reserve_disk(10 * 1024 * 1024)
        job = {
            "id": jid,
            "session_id": s.id,
            "source_id": source["id"],
            "state": "QUEUED",
            "progress": {"mode": "indeterminate", "stage": "queue", "percent": None, "elapsed_ms": 0},
            "error": None,
            "result": None,
            "config_hash": digest(config),
            "revision": 1,
            "created_at": now(),
            "updated_at": now(),
        }
        validate("job", job)
        work = s.root / jid
        work.mkdir(mode=0o700)
        (work / "config.json").write_text(json.dumps(config))
        (work / "source.json").write_text(json.dumps(source))
        s.jobs[jid] = job
        self.active += 1
        s.leases += 1
        self.replay_save(s, "job", key, config, job)
        s.audit("job_queued", jid)
        self.tasks[jid] = asyncio.create_task(self.execute(s, job, config, work))
        return job

    def state(self, job, state, *, error=None, result=None):
        if job["state"] in TERMINAL:
            return
        job.update(
            state=state, error=error, result=result, revision=job["revision"] + 1, updated_at=now()
        )
        validate("job", job)

    async def execute(self, s, job, config, work):
        proc = None
        try:
            async with self.slots:
                if s.expired():
                    self.state(job, "EXPIRED")
                    return
                self.state(job, "ANALYZING")
                source_path = s.evidence[job["source_id"]]
                proc = await sandbox.spawn(
                    work,
                    ["/venv/bin/python", "-m", "takya.runtime.worker"],
                    source_path,
                    self.model,
                )
                self.processes[job["id"]] = proc
                output_bytes = 0
                async with asyncio.timeout(120):
                    while line := await proc.stdout.readline():
                        progress = json.loads(line)
                        if "file" in progress:
                            if not re.fullmatch(r"still-\d{1,3}-\d{1,3}\.png", progress["file"]):
                                raise ValueError("Invalid worker path")
                            data = base64.b64decode(progress["data"], validate=True)
                            output_bytes += len(data)
                            if output_bytes > 8 * 1024 * 1024:
                                raise ValueError("Output quota")
                            target = work / progress["file"]
                            with target.open("xb") as f:
                                os.chmod(target, 0o600)
                                f.write(data)
                            continue
                        if "result" in progress:
                            if len(line) > 2_000_000:
                                raise ValueError("Output quota")
                            (work / "result.json").write_text(json.dumps(progress["result"]))
                            continue
                        job["progress"] = {
                            "mode": "indeterminate",
                            "stage": progress["stage"],
                            "percent": None,
                            "elapsed_ms": progress["elapsed_ms"],
                        }
                    await proc.wait()
                if proc.returncode:
                    raise ValueError("WORKER_DIED")
                output = work / "result.json"
                if output.stat().st_size > 2_000_000:
                    raise ValueError("Output quota")
                result = json.loads(output.read_text())
                incident_ids = self.ingest_result(s, job, config, result, work)
                job["progress"] = {
                    "mode": "determinate", "stage": "done", "percent": 100, "elapsed_ms": result["elapsed_ms"]
                }
                self.state(
                    job,
                    "COMPLETED",
                    result={
                        "candidate_count": len(incident_ids),
                        "incident_ids": incident_ids,
                        "analyzed_interval": {
                            "start_ms": 0, "end_ms": s.sources[job["source_id"]]["duration_ms"]
                        },
                    },
                )
                s.audit("analysis_completed", job["id"])
        except asyncio.CancelledError:
            self.state(job, "CANCELLED")
        except TimeoutError:
            self.state(
                job,
                "FAILED",
                error={"code": "TIMEOUT", "message": "El análisis superó 120 segundos."},
            )
        except Exception:  # noqa: BLE001 - todo fallo del worker es FAILED, nunca «sin candidatos»
            self.state(
                job,
                "FAILED",
                error={"code": "WORKER_DIED", "message": "No se pudo completar el análisis aislado."},
            )
        finally:
            if proc:
                await sandbox.terminate(proc)
            self.processes.pop(job["id"], None)
            self.active -= 1
            self.disk_reserved -= 10 * 1024 * 1024
            s.leases -= 1

    def ingest_result(self, s, job, config, result, work):
        duration = s.sources[job["source_id"]]["duration_ms"]
        staged = []
        for track in result["tracks"]:
            samples = track["samples"]
            start, end = samples[0]["pts_ms"], samples[-1]["pts_ms"]
            if not 0 <= start < end <= duration:
                raise ValueError("Intervalo fuera de la fuente")
            oid, iid = ident("obs"), ident("inc")
            observation = {
                "id": oid,
                "source_id": job["source_id"],
                "job_id": job["id"],
                "track_id": track["track_id"],
                "category": "person_in_declared_zone",
                "interval": {"start_ms": start, "end_ms": end},
                "samples": samples,
                "detector": DETECTOR,
                "rule": {
                    "rule_version": "zone-rule-v1",
                    "zone_version": config["zone_version"],
                    "dwell_ms": config["rule"]["dwell_ms"],
                },
            }
            validate("observation", observation)
            stills, paths = [], {}
            for still in track["stills"]:
                path = work / still["file"]
                if path.parent != work or path.is_symlink() or not path.name.startswith("still-"):
                    raise ValueError("Derivado inválido")
                if hashlib.sha256(path.read_bytes()).hexdigest() != still["sha256"]:
                    raise ValueError("Hash de derivado inválido")
                sid = ident("stl")
                paths[sid] = path
                stills.append(
                    {k: still[k] for k in ("pts_ms", "sha256", "bbox_norm")} | {"id": sid}
                )
            unknowns = [
                "CAPTURE_TIME_UNKNOWN",
                "IDENTITY_NOT_ASSESSED",
                "INTENT_NOT_ASSESSED",
                "AUDIO_NOT_ASSESSED",
                "DERIVATIVE_MAPPING_UNPROVEN",
            ]
            if start < 15000:
                unknowns.append("CONTEXT_INCOMPLETE_START")
            if end + 20000 > duration:
                unknowns.append("CONTEXT_INCOMPLETE_END")
            incident = {
                "id": iid,
                "job_id": job["id"],
                "source_id": job["source_id"],
                "observation_ids": [oid],
                "zone_version": config["zone_version"],
                "reasons": [
                    {
                        "code": "DWELL_IN_ZONE",
                        "text": "Candidato: detecciones compatibles en zona durante "
                        + f"{(end - start) / 1000:g}".replace(".", ",")
                        + " s. Revisa el registro completo.",
                    }
                ],
                "unknowns": unknowns,
                "context": {
                    "requested": {
                        "start_ms": max(0, start - 15000), "end_ms": min(duration, end + 20000)
                    },
                    "effective": {"start_ms": 0, "end_ms": duration},
                    "truncated_start": start < 15000,
                    "truncated_end": end + 20000 > duration,
                    "clip_available": False,
                    "derivative_mapping_proven": False,
                },
                "stills": stills,
                "review_state": "PENDING",
                "revision": 1,
                "origin": "service_analysis",
            }
            validate("analysis-incident", incident, duration_ms=duration)
            staged.append((incident, observation, paths))
        for incident, observation, paths in staged:
            s.incidents[incident["id"]] = incident
            s.observations[observation["id"]] = observation
            s.evidence.update(paths)
        return [incident["id"] for incident, _, _ in staged]

    async def cancel(self, s, jid):
        job = self.resource(s.jobs, jid)
        if job["state"] not in TERMINAL:
            task = self.tasks[jid]
            # Let newly scheduled tasks enter try/finally before cancellation.
            await asyncio.sleep(0)
            task.cancel()
            await task
            s.audit("job_cancelled", jid)
        return job

    async def close(self, s, *, expired=False):
        if s.leases:
            raise Failure("JOB_NOT_TERMINAL", "Hay una carga, análisis o descarga en curso.", 409)
        for jid in s.jobs:
            self.tasks.pop(jid, None)
        self.sessions.pop(s.id, None)
        shutil.rmtree(s.root)

    async def reap(self):
        while True:
            await asyncio.sleep(15)
            for s in list(self.sessions.values()):
                if s.expired():
                    for jid, job in list(s.jobs.items()):
                        if job["state"] not in TERMINAL:
                            self.state(job, "EXPIRED")
                            await self.cancel_task(jid)
                    if not s.leases:
                        await self.close(s, expired=True)

    async def cancel_task(self, jid):
        task = self.tasks[jid]
        await asyncio.sleep(0)
        task.cancel()
        await task

    async def shutdown(self):
        for jid, task in list(self.tasks.items()):
            if not task.done():
                await self.cancel_task(jid)
        for s in list(self.sessions.values()):
            if not s.leases:
                await self.close(s)
