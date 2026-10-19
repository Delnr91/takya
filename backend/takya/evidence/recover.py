"""Explicit local recovery utility. Never prints key material."""

import argparse
import json
import os
import socket
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(
        description="Conserva referencia pública y clave por canal local separado."
    )
    parser.add_argument("package_id")
    parser.add_argument(
        "--out", type=Path, required=True, help="Carpeta NUEVA, separada de la descarga"
    )
    args = parser.parse_args()
    config = Path(__file__).resolve().parents[2] / ".tmp/connection.json"
    try:
        connection = json.loads(config.read_text())
        with socket.socket(socket.AF_UNIX) as sock:
            sock.settimeout(5)
            sock.connect(connection["recovery_socket"])
            sock.sendall(args.package_id.encode() + b"\n")
            with sock.makefile("rb") as stream:
                response = json.loads(stream.readline(2048))
        if "error" in response:
            raise ValueError()
        args.out.mkdir(mode=0o700, parents=False, exist_ok=False)
        for name, value in (
            ("trusted.pub", response["public_key"]),
            ("recovery.takya-key", response["key"]),
        ):
            if value is not None:
                fd = os.open(args.out / name, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
                with os.fdopen(fd, "wb") as f:
                    f.write(bytes.fromhex(value))
        print(
            "Referencia y recuperación conservadas en archivos privados. Custódialos por separado."
        )
    except Exception:
        parser.exit(
            1, "No se pudo conservar la recuperación; comprueba sesión, paquete y carpeta nueva.\n"
        )


if __name__ == "__main__":
    main()
