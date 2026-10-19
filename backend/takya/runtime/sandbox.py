"""Linux worker boundary. Fail closed if namespaces are unavailable."""

import asyncio
import os
import signal
import sys
from pathlib import Path

BACKEND = Path(__file__).resolve().parents[2]


def command(
    work: Path, args: list[str], source: Path | None = None, model: Path | None = None
) -> list[str]:
    cmd = [
        "/usr/bin/prlimit",
        "--as=1610612736",
        "--cpu=90",
        "--fsize=67108864",
        "--nofile=128",
        "--core=0",
        "--",
        "/usr/bin/bwrap",
        "--unshare-all",
        "--die-with-parent",
        "--new-session",
        "--cap-drop",
        "ALL",
        "--ro-bind",
        "/usr",
        "/usr",
        "--symlink",
        "usr/bin",
        "/bin",
        "--symlink",
        "usr/lib",
        "/lib",
        "--symlink",
        "usr/lib64",
        "/lib64",
        "--proc",
        "/proc",
        "--dev",
        "/dev",
        "--size",
        "8388608",
        "--tmpfs",
        "/tmp",
        "--size",
        "16777216",
        "--tmpfs",
        "/output",
        "--ro-bind",
        "/etc/alternatives",
        "/etc/alternatives",
        "--ro-bind",
        "/etc/ld.so.cache",
        "/etc/ld.so.cache",
        "--ro-bind",
        str(Path(sys.prefix)),
        "/venv",
        "--ro-bind",
        str(BACKEND / "takya"),
        "/app/takya",
        "--ro-bind",
        str(BACKEND.parent / "contracts/v1"),
        "/contracts",
        "--ro-bind",
        str(work),
        "/work",
        "--chdir",
        "/output",
        "--clearenv",
        "--setenv",
        "PATH",
        "/usr/bin:/venv/bin",
        "--setenv",
        "PYTHONPATH",
        "/app",
        "--setenv",
        "OPENBLAS_NUM_THREADS",
        "1",
        "--setenv",
        "OMP_NUM_THREADS",
        "1",
        "--setenv",
        "PYTHONDONTWRITEBYTECODE",
        "1",
    ]
    if source:
        cmd += ["--ro-bind", str(source), "/input/source.mp4"]
    if model:
        cmd += ["--ro-bind", str(model), "/model.onnx"]
    return cmd + args


async def spawn(work, args, source=None, model=None):
    return await asyncio.create_subprocess_exec(
        *command(work, args, source, model),
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.DEVNULL,
        start_new_session=True,
        limit=2_100_000,
    )


async def terminate(proc):
    # Killing the namespace's supervisor also kills every child inside its PID namespace.
    if proc.returncode is None:
        try:
            os.killpg(proc.pid, signal.SIGKILL)
        except ProcessLookupError:
            pass
    await proc.wait()


async def run(work, args, source=None, timeout=20):
    proc = await spawn(work, args, source)
    try:
        out, _ = await asyncio.wait_for(proc.communicate(), timeout)
        if proc.returncode or len(out) > 2_000_000:
            raise ValueError("Proceso aislado rechazó el archivo")
        return out
    finally:
        await terminate(proc)
