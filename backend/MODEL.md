# Modelo de detección · YOLOX-Nano (COCO)

| Campo | Valor |
| --- | --- |
| Modelo | YOLOX-Nano, entrenado en COCO por Megvii (80 clases); TAKYA usa solo la clase *person* |
| Archivo | `backend/.tmp/models/yolox_nano.onnx` (3.659.407 bytes) |
| Origen oficial | <https://github.com/Megvii-BaseDetection/YOLOX/releases/download/0.1.1rc0/yolox_nano.onnx> |
| SHA-256 | `c789161ed43c8269fcd4e67c67eeeb4e80c622da2eb296a20bc6007bd18a0b7d` |
| Verificación | 19-10-2026: el archivo local coincide byte a byte con el release oficial (mismo SHA-256) |
| Licencia | Apache-2.0 ([LICENSE de YOLOX](https://github.com/Megvii-BaseDetection/YOLOX/blob/main/LICENSE)) |
| Entrada | 416×416, letterbox con relleno 114, BGR, sin normalizar (como `demo/ONNXRuntime` de YOLOX) |
| Ejecución | ONNX Runtime CPU, 1 hilo, dentro del worker aislado sin red |

## Uso en TAKYA

- `takya/detection/yolox.py` fija `WEIGHTS_SHA256`. Si el archivo falta o cambia, el coordinador responde `BACKEND_UNAVAILABLE` y no analiza.
- El detector produce **candidatos de persona**; no identifica personas, intención ni delitos.
- Precisión en CCTV real: **sin medir**. Requiere el corpus autorizado (puerta G2).

## Restaurar el archivo

`.tmp/` no se versiona. Para reponer el modelo sin depender de esta máquina:

```bash
curl -L -o backend/.tmp/models/yolox_nano.onnx https://github.com/Megvii-BaseDetection/YOLOX/releases/download/0.1.1rc0/yolox_nano.onnx
```

```bash
sha256sum backend/.tmp/models/yolox_nano.onnx
```

El hash debe ser idéntico al de la tabla. Para una demo sin internet, guarda una copia del archivo fuera de `.tmp/`.
