import asyncio
import hashlib
import os
import time
from copy import deepcopy

import pytest
from support import MODEL, config, upload

from takya.runtime import sandbox


def test_ingest_hash_range_cross_session_and_cleanup(client, video):
    c, coordinator, sid = client
    response = upload(c, video)
    assert response.status_code == 201, response.text
    source = response.json()
    assert source["sha256"] == hashlib.sha256(video).hexdigest()
    assert c.get("/evidence/" + source["id"]).content == video
    partial = c.get("/evidence/" + source["id"], headers={"Range": "bytes=5-19"})
    assert partial.status_code == 206 and partial.content == video[5:20]
    assert (
        c.get("/evidence/" + source["id"], headers={"Range": "bytes=9999999999-"}).status_code
        == 416
    )
    other = coordinator.create_session()
    assert (
        c.get("/evidence/" + source["id"], headers={"X-Takya-Session": other.id}).status_code == 404
    )
    assert upload(c, b"not a video").status_code == 422
    assert not list(coordinator.sessions[sid].root.glob("*.part"))
    assert coordinator.uploads == 0
    assert c.post(f"/sessions/{sid}/close").status_code == 204
    assert c.get("/evidence/" + source["id"]).status_code == 410


def test_auth_type_size_and_expiry(client):
    c, coordinator, sid = client
    assert c.post("/sessions", headers={"Authorization": "Bearer wrong"}).status_code == 401
    assert c.post("/uploads", content=b"x").status_code == 400
    assert upload(c, b"x" * (33554432 + 1)).status_code == 413
    assert coordinator.uploads == 0
    coordinator.sessions[sid].touched -= 1801
    assert c.get(f"/sessions/{sid}").status_code == 410


@pytest.mark.skipif(not MODEL.exists(), reason="Download pinned model for integration")
def test_real_negative_inference_and_idempotency(client, video):
    c, _coordinator, _sid = client
    source = upload(c, video).json()
    payload = config(source)
    headers = {"Idempotency-Key": "negative-analysis-0001"}
    response = c.post("/jobs", json=payload, headers=headers)
    assert response.status_code == 202, response.text
    jid = response.json()["id"]
    assert c.post("/jobs", json=payload, headers=headers).json()["id"] == jid
    other = deepcopy(payload)
    other["sample_fps"] = 1 if payload["sample_fps"] == 2 else 2
    assert c.post("/jobs", json=other, headers=headers).status_code == 409
    deadline = time.monotonic() + 30
    while time.monotonic() < deadline:
        job = c.get("/jobs/" + jid).json()
        if job["state"] in ("COMPLETED", "FAILED"):
            break
        time.sleep(0.1)
    assert job["state"] == "COMPLETED", job
    assert job["result"]["candidate_count"] == 0
    assert job["progress"]["percent"] == 100
    assert c.post(f"/jobs/{jid}/cancel").json()["state"] == "COMPLETED"


def test_sandbox_no_network_no_host_secrets_and_children(tmp_path):
    async def check():
        script = """import socket, pathlib, os
assert not pathlib.Path('/home/dani').exists()
assert not pathlib.Path('/etc/passwd').exists()
assert pathlib.Path('/proc/self/status').read_text().split('CapEff:')[1].split()[0] == '0000000000000000'
s=socket.socket(); s.settimeout(.2)
try: s.connect(('1.1.1.1',443))
except OSError: print('ISOLATED')
else: raise RuntimeError('network escaped')
"""
        assert b"ISOLATED" in await sandbox.run(tmp_path, ["/venv/bin/python", "-c", script])
        proc = await sandbox.spawn(
            tmp_path,
            [
                "/venv/bin/python",
                "-c",
                "import subprocess,time; subprocess.Popen(['/usr/bin/sleep','60']); print('READY',flush=True); time.sleep(60)",
            ],
        )
        assert await proc.stdout.readline() == b"READY\n"
        await sandbox.terminate(proc)
        assert proc.returncode is not None
        with pytest.raises(ProcessLookupError):
            os.kill(proc.pid, 0)

    asyncio.run(check())
