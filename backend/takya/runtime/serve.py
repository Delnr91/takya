"""Single coordinator, loopback only; connection credential never printed."""

import fcntl
import json
import os
import secrets
import tempfile
from pathlib import Path

import uvicorn

from takya.api.app import create_app


def main():
    os.umask(0o077)
    backend = Path(__file__).resolve().parents[2]
    private = backend / ".tmp"
    private.mkdir(mode=0o700, exist_ok=True)
    lock = (private / "server.lock").open("w")
    fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
    root = Path(tempfile.mkdtemp(prefix="run-", dir=private))
    token = secrets.token_urlsafe(48)
    port = int(os.environ.get("TAKYA_ANALYSIS_PORT", "8765"))
    config = private / "connection.json"
    staged = private / "connection.part"
    staged.write_text(
        json.dumps(
            {
                "url": f"http://127.0.0.1:{port}",
                "token": token,
                "recovery_socket": str(root / "recovery.sock"),
            }
        )
    )
    staged.replace(config)
    app = create_app(root, private / "models/yolox_nano.onnx", token)
    try:
        uvicorn.run(
            app,
            host="127.0.0.1",
            port=port,
            workers=1,
            access_log=False,
            limit_concurrency=16,
            timeout_keep_alive=5,
        )
    finally:
        config.unlink(missing_ok=True)
        # Only this run's directory is owned here; no broad cleanup of earlier runs.
        import shutil

        shutil.rmtree(root, ignore_errors=True)


if __name__ == "__main__":
    main()
