import io
import json
import os
import socket
import stat
import zipfile

import pytest
from cryptography.exceptions import InvalidSignature, InvalidTag
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
from support import export, upload

from takya.evidence.verify import inspect_package, verify_package


@pytest.mark.parametrize("level", ["E1", "E2"])
def test_download_offline_verification_restore_and_wrong_keys(client, video, tmp_path, level):
    c, coordinator, sid = client
    source = upload(c, video).json()
    item = export(c, "/sources/" + source["id"], level)
    downloaded = c.get(f"/exports/{item['export_id']}?download=1")
    path = tmp_path / "download.takya"
    path.write_bytes(downloaded.content)
    manager = c.app.state.exports
    _, key = manager.keys[item["export_id"]]
    manifest, files = inspect_package(path, trusted_public_key=manager.signer.public, recovery_key=key)
    assert files["sources/source.mp4"] == video
    assert manifest["review_status"] == "SOURCE_RECEIVED_NO_HUMAN_REVIEW"
    assert "decision.json" not in files
    assert not list(coordinator.sessions[sid].root.rglob("*.part"))
    other = coordinator.create_session()
    assert c.get(f"/exports/{item['export_id']}?download=1", headers={"X-Takya-Session": other.id}).status_code == 404
    with pytest.raises(InvalidSignature):
        verify_package(path, trusted_public_key=Ed25519PrivateKey.generate().public_key().public_bytes_raw(), recovery_key=key)
    if level == "E2":
        with pytest.raises(InvalidTag):
            verify_package(path, trusted_public_key=manager.signer.public, recovery_key=os.urandom(32))
        for position in (9, 21, len(downloaded.content) - 1):
            modified = bytearray(downloaded.content)
            modified[position] ^= 1
            bad = tmp_path / "bad.takya"
            bad.write_bytes(modified)
            with pytest.raises((InvalidTag, ValueError)):
                verify_package(bad, trusted_public_key=manager.signer.public, recovery_key=key)


@pytest.mark.parametrize("mutation", ["missing", "extra", "traversal", "absolute", "duplicate", "symlink", "source", "manifest", "signature"])
def test_archive_attacks(client, video, tmp_path, mutation):
    c, _, _ = client
    source = upload(c, video).json()
    item = export(c, "/sources/" + source["id"], "E1")
    raw = c.get(f"/exports/{item['export_id']}?download=1").content
    with zipfile.ZipFile(io.BytesIO(raw)) as original:
        entries = {name: original.read(name) for name in original.namelist()}
    path = tmp_path / "tampered.zip"
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_STORED) as archive:
        for name, data in entries.items():
            if mutation == "missing" and name == "sources/source.mp4":
                continue
            if (mutation == "source" and name == "sources/source.mp4") or (mutation == "manifest" and name == "manifest.json") or (mutation == "signature" and name == "manifest.sig"):
                data += b"altered"
            archive.writestr(name, data)
        if mutation in ("extra", "traversal", "absolute", "duplicate"):
            name = {"extra": "extra.txt", "traversal": "../escape", "absolute": "/escape", "duplicate": "manifest.json"}[mutation]
            archive.writestr(name, b"unexpected")
        if mutation == "symlink":
            info = zipfile.ZipInfo("link")
            info.external_attr = (stat.S_IFLNK | 0o777) << 16
            archive.writestr(info, b"/etc/passwd")
    with pytest.raises((ValueError, InvalidSignature, KeyError)):
        verify_package(path, trusted_public_key=c.app.state.exports.signer.public)


def test_local_recovery_socket_and_expired_session(client, video):
    c, coordinator, sid = client
    source = upload(c, video).json()
    item = export(c, "/sources/" + source["id"], "E2")
    path = coordinator.root / "recovery.sock"
    assert stat.S_IMODE(path.stat().st_mode) == 0o600
    def recover():
        with socket.socket(socket.AF_UNIX) as sock:
            sock.connect(str(path))
            sock.sendall(item["export_id"].encode() + b"\n")
            return json.loads(sock.makefile("rb").readline())
    data = recover()
    assert len(bytes.fromhex(data["key"])) == 32
    coordinator.sessions[sid].touched -= 1801
    assert "error" in recover()
