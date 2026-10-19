"""Fixtures de pytest compartidas: video sintético y cliente con sesión efímera."""

import subprocess

import pytest
from fastapi.testclient import TestClient
from support import MODEL

from takya.api.app import create_app


@pytest.fixture(scope="session")
def video(tmp_path_factory):
    path = tmp_path_factory.mktemp("media") / "synthetic-empty.mp4"
    subprocess.run(
        [
            "ffmpeg",
            "-nostdin",
            "-v",
            "error",
            "-f",
            "lavfi",
            "-i",
            "color=c=gray:s=320x240:r=12:d=4",
            "-c:v",
            "libx264",
            "-threads",
            "1",
            "-pix_fmt",
            "yuv420p",
            str(path),
        ],
        check=True,
    )
    return path.read_bytes()


@pytest.fixture
def client(tmp_path):
    app = create_app(tmp_path / "run", MODEL, "test-service-token")
    with TestClient(app, headers={"Authorization": "Bearer test-service-token"}) as c:
        sid = c.post("/sessions").json()["session_id"]
        c.headers["X-Takya-Session"] = sid
        yield c, app.state.coordinator, sid
