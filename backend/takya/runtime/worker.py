"""Executed ONLY inside sandbox; input config and outputs are bounded local files."""

import base64
import hashlib
import json
import re
import resource
import subprocess
import time
from pathlib import Path

from PIL import Image

from takya.detection.yolox import Detector
from takya.detection.zone import group


def main():
    started = time.monotonic()
    config = json.loads(Path("/work/config.json").read_text())
    source = json.loads(Path("/work/source.json").read_text())
    detector = Detector(Path("/model.onnx"))
    ratio = min(416 / source["width"], 416 / source["height"], 1)
    width, height = int(source["width"] * ratio), int(source["height"] * ratio)
    fps = config["sample_fps"]
    frames, images = [], []
    # showinfo precedes scaling and records the ORIGINAL input PTS for each selected frame.
    vf = f"select='isnan(prev_selected_t)+gte(t-prev_selected_t,{1 / fps})',showinfo,scale={width}:{height}"
    with Path("decode.log").open("wb") as log:
        proc = subprocess.Popen(
            [
                "/usr/bin/ffmpeg",
                "-nostdin",
                "-hide_banner",
                "-noautorotate",
                "-threads",
                "1",
                "-protocol_whitelist",
                "file",
                "-i",
                "/input/source.mp4",
                "-an",
                "-sn",
                "-dn",
                "-vf",
                vf,
                "-fps_mode",
                "passthrough",
                "-threads",
                "1",
                "-f",
                "rawvideo",
                "-pix_fmt",
                "rgb24",
                "pipe:1",
            ],
            stdout=subprocess.PIPE,
            stderr=log,
        )
        try:
            while True:
                raw = proc.stdout.read(width * height * 3)
                if not raw:
                    break
                if len(raw) != width * height * 3 or len(frames) >= 121:
                    raise ValueError("Fotograma truncado o límite excedido")
                img = Image.frombytes("RGB", (width, height), raw)
                images.append(img)
                frames.append(detector.people(img, config["min_detector_score"]))
                print(
                    json.dumps(
                        {
                            "stage": "detect",
                            "samples": len(frames),
                            "elapsed_ms": int((time.monotonic() - started) * 1000),
                        }
                    ),
                    flush=True,
                )
            if proc.wait() != 0:
                raise ValueError("Decodificación falló")
        finally:
            if proc.poll() is None:
                proc.kill()
                proc.wait()
    log_text = Path("decode.log").read_text(errors="replace")
    pts = [int(m) for m in re.findall(r"\bn:\s*\d+\s+pts:\s*(-?\d+)\s+pts_time:", log_text)]
    num, den = map(int, source["time_base"].split("/"))
    times = [round(t * num / den * 1000) for t in pts]
    if len(times) != len(frames) or not times or times != sorted(set(times)) or times[0] < 0:
        raise ValueError("No se pudo demostrar el mapeo PTS")
    tracks = group(list(zip(times, frames)), config)
    output_bytes = 0
    for index, track in enumerate(tracks):
        samples = track["samples"]
        chosen = sorted({0, len(samples) // 2, len(samples) - 1})
        track["stills"] = []
        for j in chosen:
            position = times.index(samples[j]["pts_ms"])
            name = f"still-{index}-{j}.png"
            images[position].save(name)
            encoded = Path(name).read_bytes()
            output_bytes += len(encoded)
            if output_bytes > 8 * 1024 * 1024:
                raise ValueError("Cuota de derivados excedida")
            track["stills"].append(
                {
                    "file": name,
                    "pts_ms": times[position],
                    "pts": pts[position],
                    "sha256": hashlib.sha256(Path(name).read_bytes()).hexdigest(),
                    "bbox_norm": samples[j]["bbox_norm"],
                }
            )
            print(
                json.dumps({"file": name, "data": base64.b64encode(encoded).decode()}), flush=True
            )
            Path(name).unlink()
    result = {
        "tracks": tracks,
        "sample_count": len(frames),
        "pts": pts,
        "sample_dimensions": [width, height],
        "elapsed_ms": int((time.monotonic() - started) * 1000),
        "peak_rss_kib": resource.getrusage(resource.RUSAGE_SELF).ru_maxrss,
    }
    print(json.dumps({"result": result}, allow_nan=False), flush=True)


if __name__ == "__main__":
    main()
