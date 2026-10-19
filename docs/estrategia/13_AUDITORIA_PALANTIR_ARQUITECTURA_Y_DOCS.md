# TAKYA · Auditoría Integral de Sistemas, Documentación y Arquitectura (Criterio Forward-Deployed / Grado Defensa)

**Fecha de auditoría:** 19 de octubre de 2026 · **Alcance:** Auditoría de solo lectura (sin eliminar ni modificar código de producto).  
**Enfoque:** Ingeniería de sistemas críticos de misión (inspirado en estándares de plataformas operativas como Palantir Gotham / Foundry y NIST SP 800-207 / IR 8387): *ontología única de verdad, trazabilidad de linaje (provenance), control de acceso por recurso, aislamiento de fallos y eliminación de deuda documental*.

---

## 1. Veredicto Ejecutivo (Resumen de Estado Real)

El proyecto **TAKYA** ha atravesado **cuatro eras evolutivas** en menos de cuatro semanas (septiembre → 19 de octubre de 2026):
1. **Era 1 (28 sept):** Simulación pura en cliente con escenas SVG ilustradas (`localStorage`).
2. **Era 2 (30 sept – 6 oct):** Consola de práctica con 6 extractos de video pre-cortados, mascota 3D **K8** (Three.js/WebGL), voz Web Speech y chat documental con Groq.
3. **Era 3 (18 oct):** Dossier estratégico de 11 documentos + 4 skills y rediseño hacia análisis sin base de datos.
4. **Era 4 (19 oct — Actual):** Implementación real del pipeline local **`Analizar archivo`** (`/demo?mode=analysis`) con BFF en Next.js 16, coordinador FastAPI en memoria, sandbox Linux (`bwrap` + `prlimit`), inferencia ONNX en CPU (`YOLOX-Nano`), máquina de revisión/decisión en servidor, paquetes criptográficos `E1/E2` (`Ed25519` + `AES-256-GCM`) y verificador offline independiente.

### 1.1. Pruebas ejecutadas en vivo durante esta auditoría

| Verificación ejecutada | Resultado observado | Hallazgos técnicos |
| --- | --- | --- |
| `node contracts/v1/validate-fixtures.mjs` | **PASE (33/33 fixtures)** | Esquemas JSON draft-07 coherentes entre casos válidos, inválidos y semánticos. |
| `npm run typecheck` (`tsc --noEmit`) | **PASE (0 errores)** | TypeScript estricto (`strict: true`, `noUncheckedIndexedAccess: true`) cumplido. |
| `npm run lint` (`eslint .`) | **PASE (0 errores)** | Reglas de Next.js 16 y React 19 cumplidas en `src/`. |
| `npm run test:demo` | **PASE (31/31 tests)** | 16 tests del motor de práctica + 15 tests de frontera/seguridad del chat K8. |
| `backend/.venv/bin/pytest -q backend/tests` | **PASE (62/62 tests en 9,08 s)** | 2 *warnings* (`StarletteDeprecationWarning: httpx` y warning esperado de ZIP duplicado en test adversarial). |
| `backend/.venv/bin/ruff check backend` | **FALLO (25 errores de lint)** | 18 errores en `backend/tests/` por importar fixtures (`client`, `video`) como funciones normales en vez de usar `conftest.py` (`F811`/`F401`/`I001`), más 6 `BLE001` (`except Exception:`) y 1 `SIM102`. |
| `./scripts/orch/check-frozen.sh` | **PASE (`FROZEN OK`)** | Las 15 rutas congeladas de `home`, `landing`, `login` y `ui` mantienen su hash intacto. |

---

## 2. Auditoría Documental: Qué está obsoleto, qué es redundante y qué es Fuente de Verdad (SSOT)

El principal problema de escalabilidad hoy no está en el código, sino en la **inflación documental**: existen **más de 50 archivos Markdown** que mezclan cuatro arquitecturas distintas. Si un desarrollador o un agente IA lee el archivo equivocado, recibe instrucciones contradictorias (por ejemplo, rutas Windows `C:\Users\invde\Desktop\TAKYA`, prohibición de backend Python, o promesas de PostgreSQL/PostGIS/Redis).

### 2.1. Clasificación completa de archivos de documentación (Sin borrar nada)

#### 🔴 CATEGORÍA A — OBSOLETOS / SUPERADOS (Conservar solo como archivo histórico; NO usar para construir ni defender el pitch)

| Archivo | Por qué es obsoleto o peligroso si se toma como vigente |
| --- | --- |
| [`docs/01_PRD_TAKYA.md`](file:///home/dani/proyectos/takya-main/docs/01_PRD_TAKYA.md) | Declara que `❌ Backend real` y `❌ Modelos de inferencia IA` están fuera de alcance y usa cifras sin filtrar (1.245 cámaras / 50%). |
| [`docs/02_ARCHITECTURE_TRD.md`](file:///home/dani/proyectos/takya-main/docs/02_ARCHITECTURE_TRD.md) | Describe únicamente la simulación en cliente (`Next.js 14+`) y afirma que usa `Shadcn UI / Radix UI` (que **no están instalados** en `package.json`). |
| [`docs/04_IMPLEMENTATION_PLAN.md`](file:///home/dani/proyectos/takya-main/docs/04_IMPLEMENTATION_PLAN.md) | Checklist de los Sprints 0–4 de septiembre (ya terminados). |
| [`docs/09_K8_CONOCIMIENTO_Y_ACCESIBILIDAD.md`](file:///home/dani/proyectos/takya-main/docs/09_K8_CONOCIMIENTO_Y_ACCESIBILIDAD.md) | El propio archivo advierte en su línea 3 que describe la versión histórica sin API ni voz. |
| [`docs/maestros/MEMORY.md`](file:///home/dani/proyectos/takya-main/docs/maestros/MEMORY.md) | Fechado 28-09-2026. Contiene rutas de Windows (`C:\Users\invde\Desktop\TAKYA`), cifras no auditadas como hechos y desconoce el backend Python y E1/E2. |
| [`docs/maestros/PLAN_MAESTRO_CONSTRUCCION_TAKYA.md`](file:///home/dani/proyectos/takya-main/docs/maestros/PLAN_MAESTRO_CONSTRUCCION_TAKYA.md) | Plan de septiembre con rutas Windows, KPIs harcodeados (`184 alertas → 23 incidentes`, `89% de confianza`) que contradicen la prohibición actual de inventar porcentajes de certeza. |
| [`docs/maestros/PROTOCOLO_AGENTE_CONSTRUCTOR.md`](file:///home/dani/proyectos/takya-main/docs/maestros/PROTOCOLO_AGENTE_CONSTRUCTOR.md) | Playbook genérico («Lattice») que pide Docker multi-stage, JWT+2FA, RLS, PostgreSQL y CI/CD que no aplican al demo local sin BD. |

#### 🟡 CATEGORÍA B — TRANSICIONALES / PARCIALMENTE DESFASADOS (Útiles como contexto, pero superados por la implementación del 19-10)

| Archivo | Qué desfase presenta frente al código actual |
| --- | --- |
| [`README.md`](file:///home/dani/proyectos/takya-main/README.md) | En su línea 13 todavía dice: *«No hay cámaras conectadas, análisis automático del video ni despacho real»*. No documenta cómo arrancar el backend Python (`takya.runtime.serve`) ni la ruta `/demo?mode=analysis`. |
| [`docs/10_ESTADO_LOCAL.md`](file:///home/dani/proyectos/takya-main/docs/10_ESTADO_LOCAL.md) | Fotografía del 18-10-2026: dice que «esta carpeta es una descarga sin `.git`» y que «no hay análisis automático del video», cuando hoy sí hay `.git` y `backend/`. |
| [`docs/07_ARQUITECTURA_IA_FIRST.md`](file:///home/dani/proyectos/takya-main/docs/07_ARQUITECTURA_IA_FIRST.md) y [`docs/08_REVISION_SEGURIDAD.md`](file:///home/dani/proyectos/takya-main/docs/08_REVISION_SEGURIDAD.md) | Cubren bien la **Práctica preparada**, pero aún no incluyen la revisión de seguridad del nuevo backend (`bwrap`, `recovery.sock`, `takya_session` HttpOnly). |
| [`docs/PROMPT_HANDOFF_ASTRA.md`](file:///home/dani/proyectos/takya-main/docs/PROMPT_HANDOFF_ASTRA.md) y [`docs/orquestacion/prompts/*.md`](file:///home/dani/proyectos/takya-main/docs/orquestacion/prompts/00_comun.md) | Fueron los prompts de ejecución para construir H1–H5. Como H1–H5 ya están construidos en `backend/` y `src/features/demo/analysis/`, hoy sirven como registro de cómo se orquestó, no como tarea pendiente desde cero. |
| [`docs/estrategia/00_INDICE_Y_ESTADO.md`](file:///home/dani/proyectos/takya-main/docs/estrategia/00_INDICE_Y_ESTADO.md) a [`05_PLAN_ROLES_Y_DEMO.md`](file:///home/dani/proyectos/takya-main/docs/estrategia/05_PLAN_ROLES_Y_DEMO.md) | Excelentes en criterio y diseño, pero figuran con estado *«propuesto / aún no implementado»* del 18-10, mientras que el código del 19-10 ya implementó gran parte de H1–H5. |

#### 🟢 CATEGORÍA C — VIGENTES Y FUENTE ÚNICA DE VERDAD (Lo que realmente sirve hoy)

| Archivo | Rol activo en la versión actual |
| --- | --- |
| [`docs/maestros/DOCUMENTO_MAESTRO_TAKYA_E2E.md`](file:///home/dani/proyectos/takya-main/docs/maestros/DOCUMENTO_MAESTRO_TAKYA_E2E.md) | **Documento rector vigente (19-10-2026).** Resume todo el proyecto con etiquetas `[O]/[F]/[R]/[P]/[M]` y refleja el backend y verificador reales. |
| [`docs/maestros/PLAN_MAESTRO_DEMO_FINAL.md`](file:///home/dani/proyectos/takya-main/docs/maestros/PLAN_MAESTRO_DEMO_FINAL.md) | Especificación técnica vigente del modo `Analizar archivo` (H0–H6 y puertas G0–G5). |
| [`contracts/v1/README.md`](file:///home/dani/proyectos/takya-main/contracts/v1/README.md), [`openapi.yaml`](file:///home/dani/proyectos/takya-main/contracts/v1/openapi.yaml), [`schemas/*.json`](file:///home/dani/proyectos/takya-main/contracts/v1/schemas/source.json), [`states.json`](file:///home/dani/proyectos/takya-main/contracts/v1/states.json) | **Contrato formal congelado (Wire Contract)** que une Python, Next.js y los tests. |
| [`ENGRAM.md`](file:///home/dani/proyectos/takya-main/ENGRAM.md) | Bitácora cronológica real de ingeniería (actualizada al 19-10-2026). |
| [`docs/03_DESIGN_SYSTEM.md`](file:///home/dani/proyectos/takya-main/docs/03_DESIGN_SYSTEM.md) y [`docs/06_DEMO_OPERATOR_FLOW.md`](file:///home/dani/proyectos/takya-main/docs/06_DEMO_OPERATOR_FLOW.md) | Identidad visual *"Structural Silence"* y flujo vigente del modo **Práctica preparada**. |
| [`docs/estrategia/06_CEO_CRITERIO.md`](file:///home/dani/proyectos/takya-main/docs/estrategia/06_CEO_CRITERIO.md), [`07_CTO_CRITERIO.md`](file:///home/dani/proyectos/takya-main/docs/estrategia/07_CTO_CRITERIO.md), [`09_FUENTES_Y_AUDITORIA.md`](file:///home/dani/proyectos/takya-main/docs/estrategia/09_FUENTES_Y_AUDITORIA.md), [`11_DECISION_CIFRADO_LOCAL_LEYES_ODS.md`](file:///home/dani/proyectos/takya-main/docs/estrategia/11_DECISION_CIFRADO_LOCAL_LEYES_ODS.md), [`12_CAPA_COGNITIVA_FACTORES_HUMANOS_UX.md`](file:///home/dani/proyectos/takya-main/docs/estrategia/12_CAPA_COGNITIVA_FACTORES_HUMANOS_UX.md) | Marcos de decisión ejecutiva, técnica, legal, de auditoría de fuentes y de ingeniería cognitiva/UX. |
| [`docs/knowledge/01-conocer-takya.md`](file:///home/dani/proyectos/takya-main/docs/knowledge/01-conocer-takya.md) a [`06-navegacion-de-la-consola.md`](file:///home/dani/proyectos/takya-main/docs/knowledge/06-navegacion-de-la-consola.md) | **Activos en producción:** son leídos en tiempo de ejecución por [`src/features/demo/server/documents.ts`](file:///home/dani/proyectos/takya-main/src/features/demo/server/documents.ts) para responder en K8. |
| [`docs/skills/*/SKILL.md`](file:///home/dani/proyectos/takya-main/docs/skills/takya-cto/SKILL.md) (5 skills) | Instrucciones modulares activas en `.agents/skills/`. |

---

## 3. Auditoría de Arquitectura, Lógica y Patrones de Diseño (Lente Palantir)

En sistemas de defensa e inteligencia operativa (como Palantir Gotham), una arquitectura se audita en cuatro ejes: **Aislamiento de Dominios, Integridad de Linaje (Data Lineage), Control de Concurrencia/Estado y Superficie de Ataque**.

### 3.1. Qué está extraordinariamente bien diseñado (Fortalezas de Grado Crítico)

1. **Separación Estricta de Dos Mundos en `/demo` ([`DemoExperience.tsx`](file:///home/dani/proyectos/takya-main/src/features/demo/analysis/DemoExperience.tsx)):**
   - `/demo` carga la **Práctica preparada** (`DemoShell`, estado en `localStorage`, 6 clips curados).
   - `/demo?mode=analysis` carga el **Análisis local de archivo** (`AnalysisWorkspace`, autoridad 100% en servidor, cero uso de `localStorage`).
   - Esto evita contaminar métricas reales con datos simulados.
2. **Contrato Único en Disco sin Duplicación Divergente ([`backend/takya/domain/contracts.py`](file:///home/dani/proyectos/takya-main/backend/takya/domain/contracts.py)):**
   - El backend Python no re-escribe los JSON Schemas a mano: carga directamente `contracts/v1/schemas/*.json` en un `Registry` local sin red (`Draft7Validator`) y añade encima las invariantes geométricas y semánticas (polígono sin autointersección, área > 0, números finitos, intervalos coherentes).
3. **Aislamiento de Subprocesos por Capas ([`backend/takya/runtime/sandbox.py`](file:///home/dani/proyectos/takya-main/backend/takya/runtime/sandbox.py)):**
   - Cada llamada a `ffprobe`, `ffmpeg` y `worker.py` corre dentro de `prlimit` (máx. 1,5 GiB AS, 90 s CPU, 64 MiB fsize, 128 descriptores, `core=0`) + `bwrap` (`--unshare-all`, sin red, `--cap-drop ALL`, `--die-with-parent`, `--new-session`, montajes de solo lectura `--ro-bind`).
   - Al cancelar un trabajo, `os.killpg(proc.pid, signal.SIGKILL)` mata al supervisor y a todos los procesos hijos del namespace de PIDs.
4. **Linaje Criptográfico y Canal Separado de Claves ([`evidence/api.py`](file:///home/dani/proyectos/takya-main/backend/takya/evidence/api.py), [`verify.py`](file:///home/dani/proyectos/takya-main/backend/takya/evidence/verify.py), [`recover.py`](file:///home/dani/proyectos/takya-main/backend/takya/evidence/recover.py)):**
   - La fuente se guarda en modo `0o400` (solo lectura) antes de extraer derivados.
   - El paquete se construye de forma atómica (`.part` → verificación completa con `verify_package` → `fsync` → `replace`).
   - Las claves `AES-256-GCM` y la clave pública `Ed25519` **no viajan por HTTP al navegador**: se recuperan localmente por un socket Unix privado `0o600` (`recovery.sock`) mediante `python -m takya.evidence.recover`.

### 3.2. Brechas, Deuda Técnica y Hallazgos de Auditoría en la Lógica Actual

Como auditor técnico, identifico **7 hallazgos concretos** en el código actual (ninguno rompe la demo hoy, pero debes conocerlos y tenerlos controlados):

| ID | Severidad | Componente | Hallazgo técnico auditado | Impacto / Recomendación futura |
| --- | --- | --- | --- | --- |
| **AUD-01** | **Media (UX / Cognitiva)** | [`AnalysisWorkspace.tsx`](file:///home/dani/proyectos/takya-main/src/features/demo/analysis/AnalysisWorkspace.tsx#L461-L485) | **Delimitación de zona por 4 inputs numéricos (`Izquierda %`, `Arriba %`, `Derecha %`, `Abajo %`) en vez de dibujo táctil sobre el video.** Además, solo permite rectángulos alineados a los ejes, aunque el contrato (`contracts/v1/schemas/zone-config.json`) y el backend aceptan polígonos de 3 a 32 vértices. | Para un operador con baja alfabetización digital, escribir porcentajes (`20, 20, 80, 90`) exige abstracción matemática. En la siguiente iteración de UI, permitir tocar las esquinas directamente sobre el video además del teclado. |
| **AUD-02** | **Media (UX / Descubribilidad)** | [`DemoShell.tsx`](file:///home/dani/proyectos/takya-main/src/features/demo/components/DemoShell.tsx) vs [`AnalysisWorkspace.tsx`](file:///home/dani/proyectos/takya-main/src/features/demo/analysis/AnalysisWorkspace.tsx) | `AnalysisWorkspace` tiene un botón claro `← Práctica preparada` (`/demo`), pero verifies cómo el operador descubre `/demo?mode=analysis` desde `/demo`. | Confirmar que el botón de acceso a `/demo?mode=analysis` sea prominente en el inicio de la consola para que el jurado no se quede solo en la práctica curada. |
| **AUD-03** | **Media (Divergencia parcial de esquema en Frontend)** | [`src/features/demo/analysis/contracts.ts`](file:///home/dani/proyectos/takya-main/src/features/demo/analysis/contracts.ts) | Mientras que el backend valida el 100% de `contracts/v1/schemas/*.json` y las 33 fixtures en `test_contracts.py`, el archivo `contracts.ts` del frontend define esquemas Zod resumidos para las respuestas HTTP y **no tiene un test unitario en `npm run test:demo`** que corra las 33 fixtures de `contracts/v1/fixtures/` contra Zod. | Añadir `analysis.test.ts` al script `test:demo` para que tanto Python como TypeScript verifiquen las mismas 33 fixtures. |
| **AUD-04** | **Baja (Calidad de Código Backend)** | `backend/tests/test_evidence.py` y `test_review.py` | **`ruff check backend` falla con 25 errores.** En `test_evidence.py` y `test_review.py` se hace `from test_backend import client, video` y luego se usan `client, video` como argumentos de test, lo que Ruff marca como `F811 Redefinition of unused variable`. | Mover los fixtures compartidos (`video`, `client`, `upload`, `config`) a un archivo `backend/tests/conftest.py` estándar de Pytest. |
| **AUD-05** | **Baja (Fuga menor en disco temporal)** | [`backend/takya/adapters/exports.py`](file:///home/dani/proyectos/takya-main/backend/takya/adapters/exports.py#L140-L142) vs [`evidence/api.py`](file:///home/dani/proyectos/takya-main/backend/takya/evidence/api.py#L68-L70) | Cuando se exporta un paquete, `Exports.prepare` reserva `192 MiB` en `coordinator.disk_reserved` y los libera al terminar `build()`. Sin embargo, el archivo final `.takya` o `.zip` queda guardado en `s.root / "packages"` hasta que expira o se cierra la sesión, y su tamaño **sí** cuenta en `reserve_disk()` (`self.root.rglob("*")`), lo cual es seguro (falla cerrado), pero limitar a 2 exportaciones por sesión significa que si ambas fallan o son grandes consumen cuota hasta cerrar sesión. | Comportamiento seguro (*fail-closed*), bien acotado por el límite `len(s.exports) >= 2`. |
| **AUD-06** | **Baja (Documentación de Pesos ML)** | [`backend/takya/detection/yolox.py`](file:///home/dani/proyectos/takya-main/backend/takya/detection/yolox.py#L3) | El docstring de `yolox.py` dice `See MODEL.md`, y `ENGRAM.md` anota como pendiente crear `MODEL.md` con procedencia/licencia Apache-2.0 del archivo `yolox_nano.onnx` (`3,66 MB`). | Crear `backend/MODEL.md` documentando URL oficial de Megvii YOLOX, licencia Apache-2.0 y el hash SHA-256 `c789161ed43c...`. |
| **AUD-07** | **Informativa (Archivos vacíos `.gitkeep`)** | `src/features/login/.gitkeep`, `backend/tests/security/.gitkeep`, `backend/tests/evidence/.gitkeep`, `backend/tests/fixtures/.gitkeep` | Existen carpetas placeholder vacías porque los tests reales se escribieron en `backend/tests/test_evidence.py` y el login vive en `src/app/login/page.tsx`. | No afectan la ejecución, pero muestran vestigios de estructura previa. |

---

## 4. Auditoría de Librerías, Binarios y Entorno: ¿Qué está instalado y qué falta para probar la Demo al 100%?

### 4.1. Inventario de lo que YA está instalado y operativo en esta máquina

| Capa | Paquete / Binario | Versión instalada | Estado |
| --- | --- | --- | --- |
| **Sistema Linux** | `ffmpeg` / `ffprobe` | `/usr/bin/ffmpeg`, `/usr/bin/ffprobe` | ✅ Instalados y funcionando. |
| **Sandbox Linux** | `bwrap` (Bubblewrap) / `prlimit` | `/usr/bin/bwrap`, `/usr/bin/prlimit` | ✅ Instalados y probados en `pytest`. |
| **Frontend (`node_modules`)** | `next` (`16.3.6`), `react` (`19.3.0`), `framer-motion` (`13.4.4`), `three` (`0.186.1`), `zod` (`4.6.5`), `lucide-react` (`1.48.0`) | Instalados en `/node_modules` | ✅ Completos. |
| **Backend (`backend/.venv`)** | `fastapi` (`0.148.0`), `uvicorn` (`0.54.0`), `pydantic` (`2.14.1`), `cryptography` (`50.0.2`), `jsonschema` (`4.26.0`), `onnxruntime` (`1.31.0`), `numpy` (`2.5.4`), `pillow` (`13.0.0`), `pytest` (`9.1.1`), `ruff`, `httpx` | Instalados en `backend/.venv` | ✅ Completos. |
| **Modelo ONNX** | `backend/.tmp/models/yolox_nano.onnx` | `3.659.407 bytes` (SHA-256 verificado `c789161e...`) | ✅ Presente en `.tmp/models/`. |

### 4.2. ¿Qué librerías o elementos FALTAN o requieren atención para probar y blindar la Demo?

1. **En `backend/pyproject.toml` falta declarar `[project.optional-dependencies]` (`dev` / `test`):**
   - Actualmente `pytest`, `httpx` y `ruff` están instalados dentro de `backend/.venv` y en `requirements.lock`, pero **no figuran en `backend/pyproject.toml`**. Si alguien recrea el entorno usando solo `pip install -e backend/`, le faltarán `pytest`, `httpx` (requerido por `FastAPI TestClient`) y `ruff`.
   - Además, Starlette emite un `StarletteDeprecationWarning` pidiendo `httpx2` en lugar de `httpx` para `TestClient`.
2. **Cuidado con la ubicación del modelo ONNX (`backend/.tmp/models/yolox_nano.onnx`):**
   - El peso `yolox_nano.onnx` vive dentro de `backend/.tmp/models/`. Aunque `serve.py` solo borra su propio subdirectorio `run-*`, tener los pesos dentro de una carpeta llamada `.tmp` es riesgoso si alguien limpia `backend/.tmp/` manualmente antes de una demo sin internet. Conviene tener un script o copia de respaldo local fuera de `.tmp`.
3. **Automatización E2E de Navegador (Playwright / `@playwright/test`):**
   - No está instalado `@playwright/test` en `package.json` (las pruebas previas de navegador se hicieron invocando Brave headless manualmente). No es obligatorio instalarlo para que la app corra, pero si se quiere un test E2E automatizado repetible con un comando (`npm run test:e2e`), faltaría `@playwright/test`.
4. **Variable opcional `GROQ_API_KEY` en `.env.local`:**
   - Solo necesaria si quieres demostrar respuestas generativas abiertas en el chat de **K8**. El botón `Guíame aquí` y todo el análisis de video `YOLOX-Nano` + paquetes `E1/E2` funcionan **100% offline sin claves externas**.
5. **Un script único de arranque coordinado (`dev:all` o similar):**
   - Hoy, para probar la demo completa con análisis de archivos, necesitas **dos procesos simultáneos en dos terminales**:
     - Terminal 1 (Backend Python): `backend/.venv/bin/python -m takya.runtime.serve` (que crea `backend/.tmp/connection.json` y levanta FastAPI en `127.0.0.1:8765`).
     - Terminal 2 (Frontend Next.js): `npm run dev` (en `127.0.0.1:3000`).
   - Si solo corres `npm run dev` sin levantar `takya.runtime.serve`, la ruta `/demo?mode=analysis` devolverá `503 BACKEND_UNAVAILABLE` (*«El análisis local no está disponible. La práctica preparada sigue funcionando»*), porque no existirá `backend/.tmp/connection.json`.

---

## 5. Hoja de Ruta de Saneamiento Recomendada (Sin romper nada)

Si decides autorizar ajustes en el siguiente paso, el orden quirúrgico de un ingeniero de sistemas críticos sería:

1. **No borrar archivos antiguos en caliente antes del pitch**, pero añadir una cabecera de 1 línea `> [HISTÓRICO — SUPERADO POR docs/maestros/DOCUMENTO_MAESTRO_TAKYA_E2E.md]` en los 7 documentos de la **Categoría A** y actualizar `README.md` para incluir el comando de arranque del backend Python.
2. **Corregir los 25 avisos de `ruff check backend`** moviendo los fixtures de prueba a `backend/tests/conftest.py` y añadiendo `backend/MODEL.md`.
3. **Conectar la Capa Cognitiva ([doc. 12](12_CAPA_COGNITIVA_FACTORES_HUMANOS_UX.md)) a `AnalysisWorkspace.tsx`:** sustituir los 4 inputs numéricos de porcentaje por selección visual/táctil de puntos sobre el video + pictogramas animados con las 4 capas perceptivas.

---

## 6. Verificación del orquestador (19-10-2026)

Cada hallazgo se contrastó con el código y comandos reales antes de actuar:

| Afirmación | Resultado |
| --- | --- |
| `ruff check backend` con 25 errores (8 F811, 6 BLE001, 6 F401, 4 I001, 1 SIM102) | Confirmado |
| Límites `prlimit` (1,5 GiB AS, 90 s CPU, 64 MiB fsize, 128 fd, core 0) y `bwrap --unshare-all --cap-drop --die-with-parent --new-session`; `killpg` al cancelar | Confirmado en `runtime/sandbox.py` |
| Reserva de 192 MiB por exportación y máximo 2 exportaciones por sesión | Confirmado en `adapters/exports.py` |
| `yolox_nano.onnx` de 3.659.407 bytes y `MODEL.md` ausente | Confirmado |
| Sin prueba Zod de las fixtures en `test:demo` | Confirmado |
| README línea 13 desactualizada | Confirmado |
| Polígonos «hasta 12 vértices» | **Corregido:** el contrato admite 3 a 32 vértices |

Los hallazgos AUD-01, 03, 04 y 06, la sección 4.2 (dependencias de desarrollo, arranque coordinado) y el paso 1 de la sección 5 se abordan en la rama `build/demo-final`.
