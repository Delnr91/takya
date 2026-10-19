# OpenCode + modelos libres — tareas mecánicas con prueba objetiva

Worktree: /home/dani/proyectos/takya-wt/oc · rama: agent/oc/fixtures-bench. Pega primero 00_comun.md.
Datos SOLO sintéticos: los modelos gratuitos pueden retener lo que envías. Nada de claves, rutas privadas ni video real.

Eres dueño de: scripts/gen-synthetic-media.py, contracts/v1/fixtures/** (solo AÑADIR casos; no cambies los existentes ni los esquemas), backend/tests/fixtures/**, backend/tests/conformance/**, scripts/bench/**, docs/demo-run/**. No tocas cripto, worker, contratos, UI ni nada de seguridad.

TAREA 1 · Video sintético (FFmpeg disponible 6.1.1; sin dependencias nuevas)
Script que genera MP4/H.264 cortos (≤30 s, ≤1280×720, ≤32 MiB) con una figura rectangular que se mueve: (a) entra a una zona y permanece >2,5 s, (b) cruce breve <1 s, (c) sin objeto, (d) dos «personas» sucesivas, (e) corte de plano, (f) VFR/GOP largo, (g) archivo truncado y (h) códec/duración fuera de límites. Salida fuera del árbol (`/tmp`-like dado por argumento), con un JSON de verdad-terreno por clip (intervalos esperados). Ejecuta con `scripts/orch/heavy.sh`.

TAREA 2 · Arnés de conformidad de contratos
Pruebas pytest en backend/tests/conformance que recorran contracts/v1/fixtures: valid⇒acepta, invalid⇒rechaza, semantic-invalid⇒rechaza en dominio. Quedan listas para que Astra conecte sus modelos Pydantic (adaptador por una función `parse(kind, data)`). Añade más fixtures semánticas útiles (p. ej. NaN, enteros enormes, referencias de otra fuente).

TAREA 3 · Arnés de medición
Script que, dado un detector y un clip, registra tiempo (RTF), RAM pico, frío/caliente y escribe CSV/JSON; todavía sin detector real: usa un doble rotulado «doble-de-prueba». No presentes sus cifras como resultados del producto.

TAREA 4 · docs/demo-run: guía de arranque local reproducible (sin instalar nada global).
