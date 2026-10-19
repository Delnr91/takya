# Astra — ruta crítica backend (H1 → H2 → H3)

Worktree: /home/dani/proyectos/takya-wt/astra · rama: agent/astra/h1-h2-backend · (H3 después, en agent/astra/h3-detector).
Pega primero 00_comun.md. Este prompt SUSTITUYE al de docs/PROMPT_HANDOFF_ASTRA.md (que cubría H0–H6 en solitario): tu alcance es solo lo de abajo.

Eres dueña/dueño de: backend/takya/{api,application,domain,video,detection,runtime,adapters}, backend/pyproject.toml, backend/requirements.lock, backend/tests (salvo evidence/ y security/), src/app/api/analysis/** (BFF Next). No tocas backend/takya/evidence/, verifier/ ni la UI.

Todo ya está contractualizado en contracts/v1 (OpenAPI, esquemas, estados, límites, fixtures). Impleméntalo, no lo reinterpretes.

TAREA 1 · H1 — sesión, ingesta y preservación
- Crea .venv local; instala FastAPI/Pydantic/Uvicorn/pytest/ruff y `cryptography`; fija versiones estables y genera backend/requirements.lock. Avisa por el bus a `opus` (inbox) cuando exista para que alinee su entorno. Verifica licencias.
- Modelos Pydantic equivalentes a contracts/v1/schemas con las reglas semánticas del README (polígono simple, intervalos...). Corre todas las fixtures de contracts/v1/fixtures (valid, invalid, semantic-invalid).
- Sesión efímera (cookie HttpOnly/SameSite, Origin validado, TTL de limits.json), coordinador único en memoria con exclusión mutua, `POST /sessions`, `/uploads` por streaming a `.part` con SHA-256 incremental y límites de bytes, ffprobe sin shell, fuente 0600 solo lectura, rechazo de MIME/códec/duración/píxeles/pistas inválidos, limpieza de parciales, 404 sin revelar existencia entre sesiones.
- BFF Next en src/app/api/analysis/**: streaming sin arrayBuffer() del video entero; credencial efímera BFF↔Python en loopback; secretos nunca a React.
- Aceptación H1: fuente descargada/leída idéntica por hash; inválidos y otra sesión rechazados; archivo truncado limpia el parcial. Informe con comandos reales.

TAREA 2 · H2 — trabajo cancelable (tras fusionar H1)
- Cola 1 activo + 1 en espera, cuotas globales también sobre cargas sin trabajo y disco reservado, worker en proceso separado sin red ni privilegios ni shell (evalúa bwrap/prlimit y PRUEBA el aislamiento; si no funciona, no lo declares), progreso real con etapa y tiempo, idempotencia con huella de payload, cancelación que termina el grupo de procesos y recoge hijos, heartbeat vencido ⇒ FAILED (nunca «0 candidatos»).
- Aceptación H2: cancelar con FFmpeg activo recoge hijos; timeout/cola/disco fallan visiblemente; worker muerto ⇒ FAILED; la web sigue disponible.

TAREA 3 · H3 — detector real (solo tras H1+H2 fusionados; coordina con el orquestador)
- Ver plan maestro §7 y §11. Detector ONNX CPU pequeño: verifica fuente, licencia y hash de pesos; registra versión. Compara 1/2 FPS y permanencia 2/2,5 s sobre video SINTÉTICO que entrega OpenCode; reporta recall/FP/RAM/tiempo sin presentarlos como fiabilidad. Sin corpus autorizado no cierras G2: declara la puerta pendiente.

Interfaz con Opus: dejas un directorio snapshot según contracts/v1/evidence-snapshot.md y llamas a build_package; no editas su módulo.
