"""YOLOX nano CPU, COCO person only; no identity or intent inference.

Pre/post processing follows Megvii YOLOX (Apache-2.0). Procedencia y hash: backend/MODEL.md.
Boxes emitted as normalized [x, y, width, height] matching v1 fixtures.
"""

import hashlib
from pathlib import Path

import numpy as np
import onnxruntime as ort
from PIL import Image

WEIGHTS_SHA256 = "c789161ed43c8269fcd4e67c67eeeb4e80c622da2eb296a20bc6007bd18a0b7d"
DETECTOR = {"name": "YOLOX-Nano COCO", "version": "0.1.1rc0", "weights_sha256": WEIGHTS_SHA256}


class Detector:
    def __init__(self, path: Path):
        if hashlib.sha256(path.read_bytes()).hexdigest() != WEIGHTS_SHA256:
            raise ValueError("Pesos ausentes o alterados")
        options = ort.SessionOptions()
        options.intra_op_num_threads = 1
        options.inter_op_num_threads = 1
        self.session = ort.InferenceSession(str(path), options, providers=["CPUExecutionProvider"])
        self.input = self.session.get_inputs()[0].name
        grids, strides = [], []
        for stride in (8, 16, 32):
            y, x = np.meshgrid(np.arange(416 // stride), np.arange(416 // stride), indexing="ij")
            grids.append(np.stack((x, y), axis=-1).reshape(-1, 2))
            strides.append(np.full((x.size, 1), stride))
        self.grid = np.concatenate(grids)
        self.strides = np.concatenate(strides)

    def people(self, image: Image.Image, threshold: float):
        width, height = image.size
        ratio = min(416 / width, 416 / height)
        resized = image.resize((int(width * ratio), int(height * ratio)), Image.Resampling.BILINEAR)
        padded = np.full((416, 416, 3), 114, dtype=np.float32)
        padded[: resized.height, : resized.width] = np.asarray(resized)[:, :, ::-1]  # RGB→BGR
        tensor = np.ascontiguousarray(padded.transpose(2, 0, 1)[None])
        output = self.session.run(None, {self.input: tensor})[0][0]
        if output.shape != (3549, 85) or not np.isfinite(output).all():
            raise ValueError("Salida de detector inválida")
        scores = output[:, 4] * output[:, 5]
        keep = scores >= threshold
        center = (output[keep, :2] + self.grid[keep]) * self.strides[keep]
        size = np.exp(np.clip(output[keep, 2:4], -20, 20)) * self.strides[keep]
        boxes = np.concatenate((center - size / 2, center + size / 2), axis=1) / ratio
        boxes[:, (0, 2)] = np.clip(boxes[:, (0, 2)], 0, width)
        boxes[:, (1, 3)] = np.clip(boxes[:, (1, 3)], 0, height)
        order = scores[keep].argsort()[::-1]
        result = []
        while len(order) and len(result) < 50:
            i = order[0]
            x1, y1, x2, y2 = boxes[i]
            if x2 > x1 and y2 > y1:
                result.append(
                    (
                        [
                            float(x1 / width),
                            float(y1 / height),
                            float((x2 - x1) / width),
                            float((y2 - y1) / height),
                        ],
                        float(scores[keep][i]),
                    )
                )
            rest = order[1:]
            inter = np.maximum(
                0,
                np.minimum(boxes[i, 2:], boxes[rest, 2:])
                - np.maximum(boxes[i, :2], boxes[rest, :2]),
            ).prod(axis=1)
            areas = np.maximum(0, boxes[:, 2:] - boxes[:, :2]).prod(axis=1)
            iou = inter / np.maximum(areas[i] + areas[rest] - inter, 1e-9)
            order = rest[iou <= 0.45]
        return result
