"""Atomic E1/E2 producer. Verification implementation is deliberately separate."""

import hashlib
import json
import os
import zipfile
from dataclasses import dataclass
from pathlib import Path

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from takya.domain.contracts import validate
from takya.evidence.verify import verify_package


@dataclass
class PackageResult:
    path: Path
    package_id: str
    fingerprint_public_key: str
    level: str


class Signer:
    def __init__(self):
        self.private = Ed25519PrivateKey.generate()
        self.public = self.private.public_key().public_bytes_raw()


def build_package(snapshot_dir: Path, out_dir: Path, *, signer: Signer, key_provider=None):
    meta = json.loads((snapshot_dir / "meta.json").read_text())
    analysis = json.loads((snapshot_dir / "analysis.json").read_text())
    incident = analysis["incident"]
    context = (
        incident["context"]
        if incident
        else {
            "requested": {"start_ms": 0, "end_ms": analysis["source"]["duration_ms"]},
            "effective": {"start_ms": 0, "end_ms": analysis["source"]["duration_ms"]},
            "derivative_mapping_proven": False,
        }
    )
    paths = [
        p
        for p in snapshot_dir.rglob("*")
        if p.is_file() and p.name not in ("meta.json", "transformations.json")
    ]
    if any(p.is_symlink() for p in snapshot_dir.rglob("*")) or len(paths) > 64:
        raise ValueError("Snapshot inseguro")
    roles = {
        "analysis.json": "analysis",
        "decision.json": "decision",
        "session-log.jsonl": "session_log",
    }
    inventory = []
    for path in sorted(paths):
        name = path.relative_to(snapshot_dir).as_posix()
        role = roles.get(name, "source" if name == "sources/source.mp4" else "still_clean")
        inventory.append(
            {
                "path": name,
                "size_bytes": path.stat().st_size,
                "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
                "role": role,
            }
        )
    if sum(f["size_bytes"] for f in inventory) > 64 * 1024 * 1024 - 65536:
        raise ValueError("Cuota de paquete excedida")
    level = meta["level_requested"]
    decision = "decision.json" if (snapshot_dir / "decision.json").exists() else None
    manifest = {
        "format": "takya-evidence-v1",
        "package_id": meta["package_id"],
        "created_at": meta["created_at"],
        "level": level,
        "source_id": meta["source_id"],
        "files": inventory,
        "relations": [
            {"from": f["path"], "to": "sources/source.mp4", "kind": "derived_from"}
            for f in inventory
            if f["role"] == "still_clean"
        ],
        "transformations": json.loads((snapshot_dir / "transformations.json").read_text()),
        "context": {
            "requested": context["requested"],
            "effective": context["effective"],
            "mapping_proven": context["derivative_mapping_proven"],
        },
        "analysis_ref": "analysis.json",
        "decision_ref": decision,
        "capture_time": None,
        "identity_scope": "none",
        "review_status": "HUMAN_REVIEWED" if decision else "SOURCE_RECEIVED_NO_HUMAN_REVIEW",
    }
    validate("evidence-manifest", manifest)
    encoded = json.dumps(manifest, sort_keys=True, separators=(",", ":"), allow_nan=False).encode()
    out_dir.mkdir(mode=0o700, exist_ok=True)
    clear = out_dir / (meta["package_id"] + ".zip.part")
    final = out_dir / (meta["package_id"] + (".takya" if level == "E2" else ".zip"))
    encrypted = final.with_suffix(".encrypted.part")
    try:
        with zipfile.ZipFile(clear, "x", compression=zipfile.ZIP_STORED) as archive:
            for path in sorted(paths):
                archive.write(path, path.relative_to(snapshot_dir).as_posix())
            archive.writestr("manifest.json", encoded)
            archive.writestr("manifest.sig", signer.private.sign(encoded))
        os.chmod(clear, 0o600)
        recovery_key = None
        staged = clear
        if level == "E2":
            recovery_key = key_provider()
            nonce, aad = os.urandom(12), b"TAKYA-E2\n"
            encrypted.write_bytes(
                aad + nonce + AESGCM(recovery_key).encrypt(nonce, clear.read_bytes(), aad)
            )
            os.chmod(encrypted, 0o600)
            staged = encrypted
        verify_package(staged, trusted_public_key=signer.public, recovery_key=recovery_key)
        with staged.open("rb") as f:
            os.fsync(f.fileno())
        staged.replace(final)
        return PackageResult(
            final, meta["package_id"], hashlib.sha256(signer.public).hexdigest(), level
        )
    finally:
        clear.unlink(missing_ok=True)
        encrypted.unlink(missing_ok=True)
