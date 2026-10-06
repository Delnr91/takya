"""Create timestamped contact sheets; originals are never modified."""
import subprocess
import sys
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / ".qa" / "media"
OUT.mkdir(parents=True, exist_ok=True)
samples = [("basura", 15, 0, 0), ("sacarclips", 60, 0, 0), ("videocamaras", 15, 0, 0), ("videoplayback", 3, 0, 0)]
if "--detail" in sys.argv:
    samples = [("basura", 2, 0, 40), ("sacarclips", 5, 500, 565), ("sacarclips", 5, 590, 665), ("videoplayback", 2, 0, 30)]
for name, interval, start, end in samples:
    source = ROOT / "public" / "videos" / f"{name}.mp4"
    if not source.exists():
        source = ROOT / ".media-source" / f"{name}.mp4"
    duration = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(source)]))
    moments = list(range(start, end or int(duration), interval))
    sheet = Image.new("RGB", (320 * 4, 204 * ((len(moments) + 3) // 4)), "#121a16")
    draw = ImageDraw.Draw(sheet)
    for index, second in enumerate(moments):
        frame = OUT / f"{name}-{second}.jpg"
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", str(second), "-i", str(source), "-frames:v", "1", "-vf", "scale=320:180", str(frame)], check=True)
        x, y = index % 4 * 320, index // 4 * 204
        sheet.paste(Image.open(frame), (x, y))
        draw.text((x + 8, y + 184), f"{name} | {second // 60:02}:{second % 60:02}", fill="white")
    sheet.save(OUT / f"{name}-{start}-sheet.jpg")
    print(name, len(moments), "frames")
