"""Conservative one-to-one IoU continuity; ambiguous matches break a track."""

from takya.domain.contracts import on_segment


def inside(point, polygon):
    x, y = point
    found = False
    for a, b in zip(polygon, polygon[1:] + polygon[:1]):
        if on_segment(a, b, point):
            return True
        if (a[1] > y) != (b[1] > y) and x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]:
            found = not found
    return found


def iou(a, b):
    overlap = max(0, min(a[0] + a[2], b[0] + b[2]) - max(a[0], b[0])) * max(
        0, min(a[1] + a[3], b[1] + b[3]) - max(a[1], b[1])
    )
    return overlap / max(a[2] * a[3] + b[2] * b[3] - overlap, 1e-9)


def group(frames, config):
    active, finished, next_id = [], [], 0
    for pts, detections in frames:
        samples = []
        for box, score in detections:
            if inside((box[0] + box[2] / 2, box[1] + box[3]), config["polygon"]):
                samples.append({"pts_ms": pts, "bbox_norm": box, "score": score, "inside_zone": True})
        edges = [
            (i, j)
            for i, track in enumerate(active)
            for j, s in enumerate(samples)
            if pts - track["samples"][-1]["pts_ms"] <= 1500 / config["sample_fps"]
            and iou(track["samples"][-1]["bbox_norm"], s["bbox_norm"]) >= 0.3
        ]
        matches = [
            (i, j)
            for i, j in edges
            if sum(e[0] == i for e in edges) == 1 and sum(e[1] == j for e in edges) == 1
        ]
        following = []
        for i, track in enumerate(active):
            match = next((j for k, j in matches if k == i), None)
            if match is None:
                finished.append(track)
            else:
                track["samples"].append(samples[match])
                following.append(track)
        for j, sample in enumerate(samples):
            if not any(k == j for _, k in matches):
                next_id += 1
                following.append({"track_id": next_id, "samples": [sample]})
        active = following
    finished.extend(active)
    return [
        t
        for t in finished
        if t["samples"][-1]["pts_ms"] - t["samples"][0]["pts_ms"] >= config["rule"]["dwell_ms"]
    ][:100]
