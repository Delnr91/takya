import json
import math
from fractions import Fraction

from takya.runtime.sandbox import run


async def probe(path, work):
    data = json.loads(
        await run(
            work,
            [
                "/usr/bin/ffprobe",
                "-v",
                "error",
                "-threads",
                "1",
                "-protocol_whitelist",
                "file",
                "-show_streams",
                "-show_format",
                "-of",
                "json",
                "/input/source.mp4",
            ],
            source=path,
        )
    )
    streams = data.get("streams", [])
    videos = [s for s in streams if s.get("codec_type") == "video"]
    others = [s for s in streams if s.get("codec_type") != "video"]
    if len(videos) != 1 or len(others) > 2:
        raise ValueError("Debe contener una sola pista de video")
    v = videos[0]
    fmt = data.get("format", {})
    # ffprobe shares a demuxer with MOV; require an actual MP4-compatible ftyp brand too.
    with path.open("rb") as f:
        header = f.read(32)
    if header[4:8] != b"ftyp" or header[8:12] not in (b"isom", b"iso2", b"mp41", b"mp42", b"avc1"):
        raise ValueError("Contenedor MP4 requerido")
    duration = max(float(v.get("duration", 0)), float(fmt.get("duration", 0))) * 1000
    start = float(v.get("start_time", 0))
    if not math.isfinite(duration) or not 0 < duration <= 60000 or abs(start) > 0.001:
        raise ValueError("Duración o inicio no admitido")
    if (
        v.get("codec_name") != "h264"
        or not 16 <= v["width"] <= 1280
        or not 16 <= v["height"] <= 720
    ):
        raise ValueError("H.264 hasta 1280 × 720 requerido")
    if any(s.get("codec_name") != "aac" or s.get("codec_type") != "audio" for s in others):
        raise ValueError("Pistas adicionales no admitidas")
    if any(s.get("rotation", 0) for s in v.get("side_data_list", [])):
        raise ValueError("Rotación no admitida en este perfil")
    if Fraction(v["time_base"]) <= 0:
        raise ValueError("Base de tiempo inválida")
    return {
        "container": "mp4",
        "video_codec": "h264",
        "width": v["width"],
        "height": v["height"],
        "duration_ms": math.ceil(duration),
        "time_base": v["time_base"],
        "video_stream_count": 1,
        "other_streams": ["aac_audio"] * len(others),
    }
