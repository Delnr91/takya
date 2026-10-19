import json
import math
from copy import deepcopy

import pytest
from takya.domain.contracts import CONTRACTS, Decision, ZoneConfig, validate


def kind_for(name):
    for prefix in (
        "decision-record",
        "analysis-incident",
        "evidence-manifest",
        "observation",
        "zone-config",
        "source",
        "decision",
        "review",
        "error",
        "job",
    ):
        if name.startswith(prefix):
            return prefix
    return {
        "zone": "zone-config",
        "incident": "analysis-incident",
        "manifest": "evidence-manifest",
    }[name.split("-")[0]]


@pytest.mark.parametrize(
    "path", sorted((CONTRACTS / "fixtures/valid").glob("*.json")), ids=lambda p: p.name
)
def test_valid_contract(path):
    validate(kind_for(path.stem), json.loads(path.read_text()), duration_ms=60000)


@pytest.mark.parametrize(
    "path",
    sorted((CONTRACTS / "fixtures/invalid").glob("*.json"))
    + sorted((CONTRACTS / "fixtures/semantic-invalid").glob("*.json")),
    ids=lambda p: p.name,
)
def test_invalid_contract(path):
    with pytest.raises(ValueError):
        validate(kind_for(path.stem), json.loads(path.read_text()), duration_ms=60000)


@pytest.mark.parametrize("bad", [True, False, math.nan, math.inf, -math.inf, "0.5", -0.1, 1.1])
def test_bad_zone_numbers(bad):
    data = json.loads((CONTRACTS / "fixtures/valid/zone-config.json").read_text())
    data["polygon"][0][0] = bad
    with pytest.raises(ValueError):
        ZoneConfig.model_validate(data)


def test_unknown_fields_and_whitespace_reason():
    data = json.loads((CONTRACTS / "fixtures/valid/decision.json").read_text())
    bad = deepcopy(data)
    bad["extra"] = 1
    with pytest.raises(ValueError):
        Decision.model_validate(bad)
    data["reason_text"] = " \n "
    with pytest.raises(ValueError):
        Decision.model_validate(data)
