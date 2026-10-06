"""Reproducible incident excerpts. Keep source files in the ignored .media-source folder."""
import hashlib
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAN = json.loads((ROOT / "docs/media/demo-media-plan.json").read_text(encoding="utf-8"))
OUT = ROOT / "public/videos/incidents"
OUT.mkdir(parents=True, exist_ok=True)
manifest_path = ROOT / "docs/media/demo-media-manifest.json"
existing = {item["id"]: item for item in json.loads(manifest_path.read_text(encoding="utf-8"))} if manifest_path.exists() else {}
selected = set(sys.argv[1:])
if selected - {item["id"] for item in PLAN["clips"]}:
    raise ValueError("Unknown clip id")
report = []
for clip in PLAN["clips"]:
    if selected and clip["id"] not in selected:
        report.append(existing[clip["id"]])
        continue
    source = ROOT / ".media-source" / clip["source"]
    if not source.exists():
        source = ROOT / "public/videos" / clip["source"]
    w, h, x, y = clip["crop"]
    target = OUT / f'{clip["id"]}.mp4'
    filters = f'crop={w}:{h}:{x}:{y},scale={clip["width"]}:-2,fps=24'
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", str(clip["start"]), "-i", str(source), "-t", str(clip["duration"]), "-vf", filters, "-an", "-c:v", "libx264", "-preset", "medium", "-crf", "25", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(target)], check=True)
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(target), "-frames:v", "1", "-vf", "scale='min(640,iw)':-2", str(OUT / f'{clip["id"]}.jpg')], check=True)
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    report.append({**clip, "sourceSha256": digest, "bytes": target.stat().st_size})
    print(clip["id"], f'{target.stat().st_size / 1024 / 1024:.2f} MB', flush=True)
(ROOT / "docs/media/demo-media-manifest.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
