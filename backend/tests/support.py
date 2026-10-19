"""Helpers compartidos de las pruebas del backend (material sintético local)."""

import json
import time
from pathlib import Path

from takya.domain.contracts import CONTRACTS

BACKEND = Path(__file__).resolve().parents[1]
MODEL = BACKEND / ".tmp/models/yolox_nano.onnx"


def upload(c, data):
    return c.post(
        "/uploads",
        content=data,
        headers={
            "Content-Type": "video/mp4",
            "X-Takya-Authorization-Ack": "true",
            "X-Takya-Filename": "synthetic.mp4",
        },
    )


def config(source):
    result = json.loads((CONTRACTS / "fixtures/valid/zone-config.json").read_text())
    result.update(source_id=source["id"], polygon=[[0, 0], [1, 0], [1, 1], [0, 1]])
    return result


def export(c, resource, level, revision=1):
    response = c.post(f"{resource}/export", json={"level": level, "expected_revision": revision},
                      headers={"Idempotency-Key": f"export-{level}-0000000000"})
    assert response.status_code == 202, response.text
    item = response.json()
    deadline = time.monotonic() + 10
    while item["state"] in ("PREPARING", "VERIFYING") and time.monotonic() < deadline:
        time.sleep(0.05)
        item = c.get("/exports/" + item["export_id"]).json()
    assert item["state"] == "READY", item
    return item
