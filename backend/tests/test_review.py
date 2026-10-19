from copy import deepcopy
import hashlib
import json

import pytest
from PIL import Image

from takya.application.coordinator import ident
from takya.detection.zone import group
from test_backend import client, config, upload, video
from test_evidence import export
from takya.evidence.verify import inspect_package


def candidate_fixture(coordinator, sid, source):
    """Explicit detector double for API review tests; NEVER wired to production analysis."""
    s = coordinator.sessions[sid]
    cfg = config(source)
    cfg["rule"]["dwell_ms"] = 2000
    jid = ident("job")
    work = s.root / jid
    work.mkdir()
    samples = [{"pts_ms": t, "bbox_norm": [0.2, 0.2, 0.2, 0.5], "score": 0.9, "inside_zone": True}
               for t in range(0, 3001, 500)]
    image = work / "still-0-0.png"
    Image.new("RGB", (32, 32), "gray").save(image)
    output = {"tracks": [{"track_id": 1, "samples": samples, "stills": [{"file": image.name,
        "pts_ms": 0, "pts": 0, "sha256": hashlib.sha256(image.read_bytes()).hexdigest(),
        "bbox_norm": samples[0]["bbox_norm"]}]}], "fixture": "synthetic_detector_double_not_inference"}
    (work / "config.json").write_text(json.dumps(cfg))
    (work / "result.json").write_text(json.dumps(output))
    job = {"id": jid, "source_id": source["id"]}
    ids = coordinator.ingest_result(s, job, cfg, output, work)
    return s.incidents[ids[0]]


@pytest.mark.parametrize("outcome", ["VERIFY", "DISMISS", "ESCALATE"])
def test_review_decision_revision_replay_and_snapshot(client, video, tmp_path, outcome):
    c, coordinator, sid = client
    source = upload(c, video).json()
    item = candidate_fixture(coordinator, sid, source)
    iid = item["id"]
    decision = {"expected_revision": 1, "type": outcome, "reason_code": "SEEN_IN_VIDEO", "reason_text": "Ejercicio sintético para validar flujo, no una detección real."}
    assert c.post(f"/incidents/{iid}/decisions", json=decision).status_code == 409
    marks = {"expected_revision": 1, "viewed_clip": True, "viewed_stills": [], "acknowledged_unknowns": True}
    assert c.post(f"/incidents/{iid}/review", json=marks).status_code == 409
    marks["viewed_stills"] = [item["stills"][0]["id"]]
    assert c.post(f"/incidents/{iid}/review", json=marks).json()["revision"] == 2
    assert c.post(f"/incidents/{iid}/review", json=marks).json()["revision"] == 2
    decision["expected_revision"] = 2
    response = c.post(f"/incidents/{iid}/decisions", json=decision)
    assert response.status_code == 201, response.text
    assert c.post(f"/incidents/{iid}/decisions", json=decision).json()["id"] == response.json()["id"]
    conflicting = deepcopy(decision)
    conflicting["reason_text"] = "Intento de sobrescribir la decisión"
    assert c.post(f"/incidents/{iid}/decisions", json=conflicting).status_code == 409
    item = export(c, "/incidents/" + iid, "E2", 3)
    path = tmp_path / "human-reviewed.takya"
    path.write_bytes(c.get(f"/exports/{item['export_id']}?download=1").content)
    manager = c.app.state.exports
    manifest, contents = inspect_package(path, trusted_public_key=manager.signer.public, recovery_key=manager.keys[item["export_id"]][1])
    assert manifest["review_status"] == "HUMAN_REVIEWED"
    assert json.loads(contents["decision.json"])["type"] == outcome
    assert contents["sources/source.mp4"] == video


def test_zone_positive_negative_interruption_and_ambiguous_tracking():
    cfg = {"polygon": [[0, 0], [1, 0], [1, 1], [0, 1]], "sample_fps": 2, "rule": {"dwell_ms": 2000}}
    detections = [([0.1, 0.1, 0.2, 0.5], 0.9)]
    frames = [(t, detections) for t in range(0, 3001, 500)]
    assert len(group(frames, cfg)) == 1
    assert group([(t, []) for t, _ in frames], cfg) == []
    interrupted = frames.copy()
    interrupted[3] = (1500, [])
    assert group(interrupted, cfg) == []
    assert group([(t, detections * 2) for t, _ in frames], cfg) == []
