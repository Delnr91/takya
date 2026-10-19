"""Offline verifier: no imports from the producer or application.

Trust comes from the caller's separate public-key file, never from the archive.
"""

import argparse
import hashlib
import io
import json
import stat
import zipfile
from pathlib import Path, PurePosixPath

from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PublicKey
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

MAX_CLEAR = 64 * 1024 * 1024
MAGIC = b"TAKYA-E2\n"


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("Clave JSON duplicada")
        result[key] = value
    return result


def inspect_package(
    package_path: Path, *, trusted_public_key: bytes, recovery_key: bytes | None = None
):
    if package_path.stat().st_size > MAX_CLEAR + 65536:
        raise ValueError("Paquete demasiado grande")
    raw = package_path.read_bytes()
    encrypted = raw.startswith(MAGIC)
    if encrypted:
        if recovery_key is None or len(recovery_key) != 32:
            raise ValueError("Falta clave de recuperación")
        offset = len(MAGIC)
        raw = AESGCM(recovery_key).decrypt(raw[offset : offset + 12], raw[offset + 12 :], MAGIC)
    elif recovery_key is not None:
        raise ValueError("Se esperaba un paquete cifrado")
    if len(raw) > MAX_CLEAR:
        raise ValueError("Cuota en claro excedida")
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        entries = archive.infolist()
        names = [entry.filename for entry in entries]
        if len(names) != len(set(names)) or len(names) > 66:
            raise ValueError("Entradas duplicadas o excesivas")
        if sum(e.file_size for e in entries) > MAX_CLEAR:
            raise ValueError("Expansión excesiva")
        for entry in entries:
            p = PurePosixPath(entry.filename)
            mode = entry.external_attr >> 16
            if (
                p.is_absolute()
                or ".." in p.parts
                or "\\" in entry.filename
                or str(p) != entry.filename
                or entry.is_dir()
                or (stat.S_IFMT(mode) not in (0, stat.S_IFREG))
                or entry.flag_bits & 1
                or entry.compress_type != zipfile.ZIP_STORED
            ):
                raise ValueError("Entrada insegura o formato no admitido")
        manifest_bytes = archive.read("manifest.json")
        Ed25519PublicKey.from_public_bytes(trusted_public_key).verify(
            archive.read("manifest.sig"), manifest_bytes
        )
        manifest = json.loads(manifest_bytes, object_pairs_hook=unique_object)
        if manifest["format"] != "takya-evidence-v1" or manifest["identity_scope"] != "none":
            raise ValueError("Formato no admitido")
        if manifest["level"] != ("E2" if encrypted else "E1"):
            raise ValueError("Nivel de protección inconsistente")
        inventory = manifest["files"]
        paths = [entry["path"] for entry in inventory]
        if len(paths) != len(set(paths)) or set(names) != set(paths) | {
            "manifest.json",
            "manifest.sig",
        }:
            raise ValueError("Inventario incompleto, duplicado o con extras")
        if "manifest.json" in paths or "manifest.sig" in paths:
            raise ValueError("Autorreferencia inválida")
        contents = {}
        for entry in inventory:
            data = archive.read(entry["path"])
            if (
                len(data) != entry["size_bytes"]
                or hashlib.sha256(data).hexdigest() != entry["sha256"]
            ):
                raise ValueError("Archivo alterado")
            contents[entry["path"]] = data
        if manifest["analysis_ref"] not in contents or (
            manifest["decision_ref"] is not None and manifest["decision_ref"] not in contents
        ):
            raise ValueError("Referencia ausente")
        for relation in manifest["relations"]:
            if relation["from"] not in contents or relation["to"] not in contents:
                raise ValueError("Relación incompleta")
    return manifest, contents


def verify_package(
    package_path: Path, *, trusted_public_key: bytes, recovery_key: bytes | None = None
):
    manifest, _ = inspect_package(
        package_path, trusted_public_key=trusted_public_key, recovery_key=recovery_key
    )
    return {
        "verified": True,
        "package_id": manifest["package_id"],
        "level": manifest["level"],
        "file_count": len(manifest["files"]),
        "fingerprint": hashlib.sha256(trusted_public_key).hexdigest(),
    }


def main():
    parser = argparse.ArgumentParser(
        description="Verifica una descarga TAKYA contra una clave pública confiable separada."
    )
    parser.add_argument("package", type=Path)
    parser.add_argument("--public-key", type=Path, required=True)
    parser.add_argument("--recovery-key", type=Path)
    parser.add_argument(
        "--restore", type=Path, help="Directorio NUEVO para restaurar bytes verificados"
    )
    args = parser.parse_args()
    try:
        public = args.public_key.read_bytes()
        key = args.recovery_key.read_bytes() if args.recovery_key else None
        manifest, files = inspect_package(args.package, trusted_public_key=public, recovery_key=key)
        if args.restore:
            args.restore.mkdir(mode=0o700, parents=False, exist_ok=False)
            for name, data in files.items():
                target = args.restore / name
                target.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
                with target.open("xb") as f:
                    import os

                    os.chmod(target, 0o600)
                    f.write(data)
        print(
            json.dumps(
                {
                    "verified": True,
                    "package_id": manifest["package_id"],
                    "files": len(files),
                    "level": manifest["level"],
                }
            )
        )
    except Exception:
        parser.exit(1, "Verificación rechazada: paquete, referencia o clave inválidos.\n")


if __name__ == "__main__":
    main()
