"""Validate the frozen wire contract without maintaining a divergent copy.

Pydantic supplies API integration; the local JSON Schemas remain authoritative.
No remote references are retrieved. Semantic constraints live here.
"""

import json
import math
from pathlib import Path
from typing import Any, ClassVar

from jsonschema import Draft7Validator, FormatChecker
from pydantic import RootModel, model_validator
from referencing import Registry, Resource

CONTRACTS = Path(__file__).resolve().parents[3] / "contracts" / "v1"
if not CONTRACTS.exists():  # Isolated worker layout
    CONTRACTS = Path("/contracts")
SCHEMAS = {p.stem: json.loads(p.read_text()) for p in (CONTRACTS / "schemas").glob("*.json")}
REGISTRY = Registry().with_resources(
    (s["$id"], Resource.from_contents(s)) for s in SCHEMAS.values()
)
LIMITS = json.loads((CONTRACTS / "limits.json").read_text())


def cross(a, b, c):
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])


def on_segment(a, b, p):
    return abs(cross(a, b, p)) < 1e-12 and all(
        min(a[i], b[i]) - 1e-12 <= p[i] <= max(a[i], b[i]) + 1e-12 for i in (0, 1)
    )


def intersects(a, b, c, d):
    return (cross(a, b, c) * cross(a, b, d) < 0 and cross(c, d, a) * cross(c, d, b) < 0) or any(
        (
            on_segment(a, b, c),
            on_segment(a, b, d),
            on_segment(c, d, a),
            on_segment(c, d, b),
        )
    )


def validate_polygon(poly):
    if len({tuple(p) for p in poly}) != len(poly):
        raise ValueError("Vértices repetidos")
    n = len(poly)
    if abs(sum(cross((0, 0), poly[i], poly[(i + 1) % n]) for i in range(n))) < 1e-10:
        raise ValueError("Zona sin área")
    for i in range(n):
        if abs(cross(poly[i - 1], poly[i], poly[(i + 1) % n])) < 1e-12:
            raise ValueError("Aristas colineales o superpuestas")
        for j in range(i + 1, n):
            if j == i + 1 or (i == 0 and j == n - 1):
                continue
            if intersects(poly[i], poly[(i + 1) % n], poly[j], poly[(j + 1) % n]):
                raise ValueError("Zona autointersectada")


def finite(value):
    if isinstance(value, float) and not math.isfinite(value):
        raise ValueError("Número no finito")
    if isinstance(value, dict):
        for v in value.values():
            finite(v)
        if set(value) == {"start_ms", "end_ms"} and value["start_ms"] >= value["end_ms"]:
            raise ValueError("Intervalo vacío o invertido")
    if isinstance(value, list):
        for v in value:
            finite(v)


def validate(kind: str, data: dict, *, duration_ms: int | None = None):
    finite(data)
    validator = Draft7Validator(SCHEMAS[kind], registry=REGISTRY, format_checker=FormatChecker())
    errors = list(validator.iter_errors(data))
    if errors:
        raise ValueError(f"Contrato {kind} inválido: {errors[0].validator}")
    if kind == "zone-config":
        validate_polygon(data["polygon"])
    if kind == "job":
        completed, failed = data["state"] == "COMPLETED", data["state"] == "FAILED"
        if (data["result"] is not None) != completed or (data["error"] is not None) != failed:
            raise ValueError("Estado y resultado inconsistentes")
        if completed and data["result"]["candidate_count"] != len(data["result"]["incident_ids"]):
            raise ValueError("Cantidad inconsistente")
    if kind == "analysis-incident":
        context = data["context"]
        if duration_ms is not None and any(
            context[k]["end_ms"] > duration_ms for k in ("effective", "requested")
        ):
            raise ValueError("Contexto fuera de la fuente")
    if kind == "source":
        if (data["capture_time"] is None) != (data["capture_time_provenance"] == "unknown"):
            raise ValueError("Procedencia de fecha inconsistente")
    if kind == "observation":
        pts = [s["pts_ms"] for s in data["samples"]]
        if pts != sorted(set(pts)):
            raise ValueError("PTS repetidos o desordenados")
        for sample in data["samples"]:
            x, y, width, height = sample["bbox_norm"]
            if width <= 0 or height <= 0 or x + width > 1.000001 or y + height > 1.000001:
                raise ValueError("Caja vacía")
    return data


class Contract(RootModel[dict[str, Any]]):
    kind: ClassVar[str]

    @model_validator(mode="after")
    def check(self):
        validate(self.kind, self.root)
        return self


class ZoneConfig(Contract):
    kind = "zone-config"


class Review(Contract):
    kind = "review"


class Decision(Contract):
    kind = "decision"

    @model_validator(mode="after")
    def reason(self):
        if not self.root["reason_text"].strip():
            raise ValueError("Motivo vacío")
        return self
