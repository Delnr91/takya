# contracts/v1 — contrato congelado TAKYA (propietario: orquestador)

Fuente única para backend (Pydantic), BFF/UI (Zod) y verificador. **Nadie edita esta carpeta salvo el orquestador**; un cambio se pide por el bus y se publica como `contracts-v2` (tag).

| Archivo | Qué es |
| --- | --- |
| `openapi.yaml` | Rutas `/api/analysis`, códigos de estado, idempotencia, cookie de sesión |
| `schemas/*.json` | JSON Schema draft-07 de Source, ZoneConfig, Job, Observation, AnalysisIncident, Review, Decision, DecisionRecord, EvidenceManifest, Error |
| `states.json` | Máquinas de estado de trabajo, incidente y exportación + invariantes |
| `limits.json` | Perfil inicial propuesto (60 s, 1280×720, 32 MiB, cola 1+1, TTL) — a medir |
| `evidence-snapshot.md` | Interfaz Astra↔Opus: directorio `snapshot/` y `build_package` / `verify_package` |
| `fixtures/valid` · `invalid` | Deben pasar / fallar el esquema |
| `fixtures/semantic-invalid` | **Pasan el esquema a propósito**: cada implementación debe rechazarlas en su capa de dominio |
| `validate-fixtures.mjs` | `node contracts/v1/validate-fixtures.mjs` (usa `ajv` de `node_modules`) |

## Reglas semánticas que el esquema no puede expresar (obligatorias en Pydantic y Zod)
1. `polygon`: simple (sin autointersección), área > 0, vértices distintos.
2. `0 ≤ start_ms < end_ms ≤ duration_ms` en todo intervalo; `effective` ⊆ `[0, duration]`; `requested = [max(0, ini−15 s), min(dur, fin+20 s)]`.
3. Booleanos nunca aceptados como números; NaN/∞ rechazados; campos desconocidos rechazados (`additionalProperties: false`).
4. Referencias (observaciones, stills, fuente) deben pertenecer a la misma fuente y sesión.
5. Job: `COMPLETED` ⇒ `result` no nulo; `FAILED` ⇒ `error` no nulo; los demás ⇒ ambos nulos.
6. Un detector produce candidatos, no identidades ni delitos. `capture_time` es `null` si no se conoce; la hora de carga nunca la sustituye.
7. Un fixture jamás se presenta como salida de un archivo cargado.

Cada lado agrega una prueba de conformidad que recorre `fixtures/` (OpenCode escribe el arnés; cada dueño lo ejecuta).
