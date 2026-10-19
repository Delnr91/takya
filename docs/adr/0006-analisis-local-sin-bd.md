# ADR 0006 · Análisis local de archivo sin base de datos, con backend Python

- Estado: **propuesto** (pasa a aceptado cuando el fundador lo confirme). Fecha: 2026-10-19.
- Contexto: la demo debe analizar un archivo autorizado nuevo y exportar evidencia verificable. Plan en `docs/maestros/PLAN_MAESTRO_DEMO_FINAL.md`; reparto en `docs/maestros/PLAN_ORQUESTACION_MULTIAGENTE.md`.
- Decisión: Next.js 16 como BFF + FastAPI (monolito modular) con un worker aislado; estado en memoria y temporales privados 0700/0600; FFmpeg/ffprobe, ONNX Runtime CPU y `cryptography`. Sin BD, Redis, S3 ni nube nueva. Contratos en `contracts/v1`.
- Consecuencias: reinicio pierde sesiones, mapas e idempotencia (se informa); no hay custodia institucional (E3 fuera); la práctica existente permanece intacta y rotulada; el despliegue en Vercel (home/landing/login) no cambia.
- No reemplaza ADR 0001–0005; si alguno queda en conflicto, se redactará un ADR que lo marque `superseded`.
