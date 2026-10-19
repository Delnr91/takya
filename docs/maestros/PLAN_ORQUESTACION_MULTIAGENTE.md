# TAKYA · Plan de orquestación multiagente para construir la demo final

**Fecha:** 19-10-2026 · **Estado:** propuesta del orquestador, pendiente de tu aprobación · **Complementa** [PLAN_MAESTRO_DEMO_FINAL.md](PLAN_MAESTRO_DEMO_FINAL.md) (qué construir) con **quién lo construye, en qué orden y cómo se coordinan**.

Todo el estado vive en archivos y ramas, no en este chat. Si cambias el modelo que orquesta, no se pierde nada.

## 1. Respuesta corta

- **¿Desgaste cruzado?** Sí, si dos modelos tocan los mismos archivos o si se «mejoran» entre sí sin criterio. No, si cada agente es dueño de módulos distintos, todos obedecen el mismo contrato y un solo integrador fusiona. La revisión cruzada (un modelo revisa el código de otro) es valiosa; la coedición cruzada es la que desgasta.
- **¿Cuánto se gana?** Menos de lo que sugiere tener cuatro agentes. La ruta crítica es `H1 → H2 → H3` (ingesta → worker → detector) y es secuencial. Lo que corre en paralelo es evidencia/verificador (H5 núcleo), UI (H4) y fixtures/corpus sintético. Estimación honesta: **2–2,5× más rápido que un solo agente, no 4×**.
- **¿Cuántos a la vez?** **Máximo 3 agentes activos.** El equipo tiene ~3,7 GiB de RAM (≈1,2 GiB libres al inspeccionar) y 4 núcleos. Un `next build`, inferencia y FFmpeg no pueden coincidir (el plan maestro ya lo prohíbe).

## 2. Hechos que condicionan el plan

| Hecho | Consecuencia |
| --- | --- |
| `takya-main` era una descarga sin `.git` de **github.com/delnr91/takya**; `origin/main` está **desplegado en Vercel** | Se alineó el historial local con `origin/main` (no hay repo nuevo). `main` local = `origin/main`. **Ningún agente hace push, fetch/pull ni toca `main`**; solo commits en su rama. Lo que llegue a `origin/main` lo decide Dani (idealmente por PR tras revisar el preview de Vercel). |
| El handoff actual pone a Astra en H0→H6 secuencial, «sin subagentes, sin commits» | Este plan lo **sustituye**: se parte por módulos y se permite commit **solo en la rama propia**, nunca push ni `main`. Hay que reemitir el prompt de Astra (versión 2, solo H1–H3). |
| Home, landing, login y compartidos congelados | El chequeo de hashes congelados es **puerta de merge** automática. |
| No hay corpus CCTV autorizado | G0/G2 reales siguen bloqueados. Todos los agentes usan **video sintético**; ningún dato real va a modelos gratuitos. |
| Frontend actual ≈ 7,5 mil líneas; backend es terreno virgen | El backend es la ruta crítica; la UI tiene base que reutilizar. |

**Lectura de documentación para este plan:** leídos completos el plan maestro de la demo, el protocolo del constructor, MEMORY, handoff de Astra, índice `estrategia/00`, `05`, `03`, `11`, `10_ESTADO_LOCAL`, ENGRAM (inicio) y el `DOCUMENTO_MAESTRO_TAKYA` de la carpeta de investigación, más `VERIFICACION.md`. Del resto (informes de cada modelo, `04/06/07/09/10`, ADR, knowledge, el `.docx`) revisé índices y secciones; el plan maestro ya los adjudicó (apartados 2–3) y no los releí línea por línea.

## 3. Roles por modelo

Las asignaciones son **hipótesis de encaje por tipo de tarea**, no benchmarks: no tengo mediciones fiables de estos modelos concretos sobre tu código. Por eso hay un **bake-off de 45 min** (sección 8) antes de comprometer ramas largas.

| Agente | Herramienta | Rol | Es dueño de | Nunca toca |
| --- | --- | --- | --- | --- |
| **Orquestador** | este chat (Sonnet 5.5, intercambiable) | Contratos, integración, merges, puertas, decisiones | `contracts/**`, `docs/orquestacion/**`, `scripts/orch/**`, ADR, `package.json`, lockfile, `.gitignore`, `ENGRAM.md`, `main` | Features largas |
| **Astra** (GPT-6.1-Sol, high) | consola Codex-like | **Ruta crítica backend**: sesión, ingesta/hash, cola, worker aislado, cancelación, luego detector (H1→H2→H3) y BFF | `backend/takya/{api,application,domain,video,detection,runtime,adapters}`, `src/app/api/analysis/**` y sus tests | `evidence/`, UI |
| **Opus 5.5** | Claude Code (consola) | **Evidencia y seguridad**: paquete E1/E2, firma, AES-GCM, verificador offline (H5 núcleo), pruebas adversariales, revisor de seguridad | `backend/takya/evidence/**`, `verifier/**`, `backend/tests/{evidence,security}/**` | Worker, UI |
| **Argon 4** | Antigravity CLI | **Interfaz de Analizar archivo** (H4): contrato Zod, cliente, hook, componentes, accesibilidad, QA visual con capturas | `src/features/demo/**` (parte nueva), `src/app/demo/**` | `backend/`, `src/app/api/**`, congelados |
| **OpenCode + modelos libres** | OpenCode (GLM-4.7-Flash, etc.) | **Trabajo mecánico y acotado**: generador de video sintético, fixtures, pruebas de conformidad de contratos, harness de benchmark, documentación de arranque | `scripts/gen-synthetic-media.py`, `contracts/fixtures/**` (solo añadir), `backend/tests/fixtures/**`, `docs/demo-run/**` | Cripto, worker, contratos, cualquier cosa con seguridad |

Por qué así (hipótesis a validar):
- **Astra** ya tiene el plan y el handoff escritos para ella/él y mostró sesiones autónomas largas (11 min 40 s en tu captura): conviene en el camino largo y secuencial.
- **Opus 5.5** en código donde una invariante rota es grave (cripto, verificador, rechazo de manipulación) y como **revisor** del código de Astra: la revisión cruzada aprovecha puntos ciegos distintos.
- **Argon 4** para UI y verificación visual contra `public/referencias/**`; su ventaja esperada es trabajar con imágenes/capturas.
- **Modelos libres**: barato y paralelo, pero con riesgo de errores sutiles → solo tareas con prueba objetiva y siempre revisadas. Datos solo sintéticos (no sabes qué retención tienen).

## 4. Cómo se comunican (de forma real)

Las CLIs **no pueden hablarse entre sí en vivo**. El bus es el sistema de archivos y tú eres el relevo (o un script, si lo quieres después).

```text
/home/dani/proyectos/takya-wt/
  _bus/                      <- carpeta compartida, FUERA de git
    BOARD.md                 <- tablero: tarea · dueño · rama · estado · bloqueo
    inbox/<agente>/NNN-*.md  <- mensajes dirigidos (petición, respuesta, cambio de contrato)
    reports/<agente>-<tarea>.md  <- informe al cerrar: archivos, comandos y salidas reales, límites
  main/                      <- checkout de integración (solo el orquestador)
  astra/  opus/  argon/  oc/ <- un git worktree por agente
```

Reglas del bus (van en el prompt de cada agente):
1. Al empezar una tarea y tras cada hito: leer `inbox/<yo>/` y `BOARD.md`.
2. Para pedir algo a otro módulo: dejar un mensaje, **no editar su código**.
3. **Cambio de contrato** = mensaje al orquestador, que publica `contracts-vN` (tag). Nadie cambia `contracts/` por su cuenta.
4. Al cerrar una tarea: informe en `reports/` con comandos ejecutados y resultados reales. Un informe sin salidas no cuenta.

Un único `AGENTS.md` (ya existe, `CLAUDE.md` lo importa) sigue siendo la fuente común. **Verificar** que Antigravity y OpenCode lo leen; si no, copiar un shim (`GEMINI.md` o similar) que lo referencie.

## 5. Ramas, worktrees y recursos

```text
main                       = origin/main (Vercel). Nadie la toca salvo Dani, por PR
orquestacion/ola-0         base de integración local; el tag contracts-v1 vive aquí
orquestacion/integracion   (la crea el orquestador) donde se fusionan las ramas de agentes
agent/astra/h1-h2-backend  → luego agent/astra/h3-detector
agent/opus/h5-evidence
agent/argon/h4-ui
agent/oc/fixtures-bench
```

- Cada agente trabaja en su **worktree** (`git worktree add ../takya-wt/<agente> -b <rama> contracts-v1`). Commits solo ahí; **nunca push, nunca `main`**.
- **Candado de procesos pesados:** `flock /tmp/takya-heavy.lock <comando>` para `next build`, inferencia, FFmpeg largo y pytest pesado. Un solo pesado a la vez.
- Solo **Argon** ejecuta `next dev` (puerto 3001); el build de verificación lo hace el integrador al fusionar. `node_modules` se instala una vez en `main/` y los worktrees lo enlazan o reinstalan solo si Argon lo necesita (comprobar disco antes).
- Backend: un `.venv` por worktree de backend (Astra, Opus); pesos de modelo en carpeta compartida **fuera del árbol**, con hash registrado.
- Archivos de alta colisión (`package.json`, lockfile, `.gitignore`, `ENGRAM.md`): **solo el orquestador**. Los agentes piden el cambio por el bus.

## 6. Olas de trabajo y dependencias

```text
OLA 0 (orquestador, antes de paralelizar)
  git base · snapshot SHA-256 · checks base · ADR 0006 sin BD
  contracts/v1: OpenAPI + esquemas JSON + máquinas de estado + fixtures compartidas
  bus + scripts de puertas · bake-off de 45 min
        │  tag contracts-v1
        ▼
OLA 1 (en paralelo, 3 activos + OC bajo demanda)
  Astra : H1 sesión/ingesta/hash/probe → H2 cola/worker/cancelación/cuotas
  Opus  : H5 núcleo: build_package(snapshot)→paquete E1/E2 + verificador offline
          + pruebas adversariales (manipulado, clave/tag mal, faltantes, traversal)
  Argon : H4 UI "Analizar archivo" contra servidor simulado (mock rotulado, solo con flag)
  OC    : corpus sintético, fixtures de contrato, harness de medición
        │  H1+H2 fusionados
        ▼
OLA 2
  Astra : H3 detector ONNX + regla de zona + evaluación positivo/negativo
  Opus  : revisa H1–H2 de Astra (seguridad); conecta export al endpoint vía función pura
  Argon : sustituye el mock por la API real; estados fallo/cancelado/sin candidatos
  OC    : ejecuta harness en hardware real y registra RAM/tiempo
        │  H3 + H4 + H5 fusionados
        ▼
OLA 3 (orquestador dirige, cada dueño corrige lo suyo)
  H6: dos ensayos extremo a extremo · regresión práctica antigua · accesibilidad ·
      informe de medición · tabla G0–G5 · respaldo rotulado
  H7 (K8 contextual): opcional, solo después de H6
```

**Qué NO se paraleliza:** H1→H2→H3 (cada uno necesita el worker/interfaz del anterior) y la fusión de `api/` con `evidence/` (la conecta el orquestador con una función pura `build_package(snapshot) → Path`, para que Opus y Astra no editen el mismo archivo).

## 7. Puertas de merge (automáticas + revisión cruzada)

Un merge a `main` exige, en este orden:
1. `scripts/orch/check-frozen.sh`: hashes de rutas congeladas idénticos al snapshot.
2. `npm run typecheck && npm run lint && npm run test:demo` y `backend/.venv/bin/python -m pytest backend/tests` (con candado pesado). `format:check` solo sobre archivos tocados (hay deuda previa).
3. **Informe del agente** con salidas reales (sección 4, regla 4).
4. **Revisión cruzada por otro modelo**: Opus revisa el backend de Astra; Astra revisa la evidencia de Opus; Opus revisa la UI de Argon. Nadie revisa su propio código. Máximo **1 ronda** de «debe corregirse», y cada hallazgo debe citar una **prueba que falla o una invariante violada**; sin eso se descarta (corta el ciclo de «mejoras» de estilo).
5. El orquestador fusiona con `--no-ff` en `orquestacion/integracion` y etiqueta. **Nada se empuja ni se mezcla en `main`**: al final Dani decide el PR hacia `delnr91/takya`, con home/landing/login intactos (check-frozen) y el preview de Vercel revisado. Todo hito se declara hecho solo con evidencia, no por haberse escrito.

## 8. Contra el desgaste cruzado (reglas)

1. **Un dueño por archivo.** Si necesitas cambiar algo ajeno, mensaje, no edición.
2. **Contrato primero**; los dos lados prueban contra las mismas fixtures JSON.
3. **Mismo formateo/lint:** Prettier/ESLint en web; `ruff` (a fijar por el orquestador) en Python. Nadie reformatea archivos ajenos.
4. **PR chicos**, una responsabilidad; nada de «refactor aprovechando».
5. **Sin segunda opinión estilística**: se corrige lo que rompe una prueba o invariante.
6. **Bake-off previo (45 min):** misma tarea pequeña a cada herramienta en su worktree: validador de `ZoneConfig` (polígono simple, área positiva, coordenadas normalizadas; rechaza booleanos, NaN, infinitos) con tests. Yo escribo pruebas adversariales **ocultas**; puntúo por: pasa/falla, respeto de fronteras, tamaño del diff y tiempo. Esto confirma o corrige la tabla de roles con datos de **tu** repositorio.
7. **Modelos libres:** solo tareas con prueba objetiva; jamás cripto, aislamiento, contratos ni decisiones; y sin datos reales.

## 9. Riesgos del propio plan

| Riesgo | Mitigación |
| --- | --- |
| RAM agotada con varios agentes y servidores | Máx. 3 activos, candado pesado, un solo `next dev`, builds solo al integrar. Revisar swap antes de la Ola 1. |
| Contratos mal definidos producen retrabajo en paralelo | Ola 0 no se salta; los cambios pasan por `contracts-vN`. |
| Mock de UI confundido con salida real | Mock tras flag, con rótulo visible y excluido del build de ensayo; prueba de que sin flag y sin backend se muestra «indisponible» (invariante del plan maestro). |
| Free models introducen errores sutiles | Siempre revisados; solo fixtures y harness. |
| Las CLIs no leen `AGENTS.md` | Comprobación en Ola 0, con shims. |
| Corpus autorizado no llega | G0/G2 reales quedan pendientes y se declaran; el resto avanza con sintéticos rotulados. |

## 10. Decisiones tuyas antes de empezar

1. ~~Autorizar git~~ **Hecho:** historial alineado con `origin/main`; ramas y worktrees bajo `takya-wt/`.
2. **Confirmar el reparto** de la sección 3, o pedir el bake-off antes de comprometerlo.
3. **Quién orquesta al final:** puedes cambiar de modelo en este chat; el estado está en el bus y las ramas.
4. **Corpus:** ¿hay o habrá video CCTV propio/autorizado? Si no, G2 real queda fuera de esta ronda.

## 11. Qué haré en la Ola 0 cuando apruebes

Crear el `git` base y el snapshot, `contracts/v1` (OpenAPI de `/api/analysis`, esquemas de `Source/ZoneConfig/Job/Observation/AnalysisIncident/Review/Decision/EvidencePackage`, máquinas de estado, fixtures), el bus y los scripts de puertas, el ADR 0006 y **un prompt por agente** con su frontera, su primera tarea y el protocolo del bus. Reemitiré el prompt de Astra reducido a H1–H3 y señalaré qué partes de `PROMPT_HANDOFF_ASTRA.md` quedan superadas (sin editar el original hasta que lo confirmes).
