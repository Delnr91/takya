# Reglas comunes (pegar al inicio de cada agente, antes de su prompt propio)

Comunica avances y resultados en español. No inventes pruebas, resultados ni capacidades.

REPOSITORIO Y DESPLIEGUE
- El repositorio original es github.com/delnr91/takya y `main` está desplegado en Vercel. **Nunca** hagas push, ni `git remote`, ni pull/fetch, ni toques `main`, ni abras PR. Solo **commits locales en tu propia rama**. El orquestador y Dani deciden qué llega a `origin/main`.
- Trabajas SOLO en tu worktree: /home/dani/proyectos/takya-wt/<tu-agente>. No salgas de ahí salvo para leer/escribir el bus.

ANTES DE EDITAR
1. Lee AGENTS.md (y CLAUDE.md si existe), docs/maestros/PLAN_MAESTRO_DEMO_FINAL.md (qué construir), docs/maestros/PLAN_ORQUESTACION_MULTIAGENTE.md (quién hace qué) y contracts/v1/README.md.
2. Antes de escribir código Next.js, lee las guías pertinentes en node_modules/next/dist/docs/ (esta versión tiene cambios incompatibles).
3. Lee /home/dani/proyectos/takya-wt/_bus/BOARD.md y tu inbox: /home/dani/proyectos/takya-wt/_bus/inbox/<tu-agente>/.

FRONTERAS
- Solo editas los archivos de tu propiedad (tabla en el plan §3). Para cualquier otra cosa, deja un mensaje en el inbox del dueño. `contracts/` es del orquestador: pide cambios por mensaje a `orquestador`.
- Congelados (no tocar): src/app/page.tsx, home, landing, login, layout.tsx, globals.css, src/components/ui/**, src/features/shared/**, tailwind.config.ts, next.config.mjs, public/**. Verifica con `scripts/orch/check-frozen.sh`.
- package.json, lockfile, .gitignore y ENGRAM.md: solo el orquestador (pídelo por el bus).
- Sin subagentes, sin servicios externos, sin instalaciones globales, sin claves, sin datos reales: solo video sintético.
- Procesos pesados (next build, inferencia, FFmpeg largo, pytest pesado): `scripts/orch/heavy.sh <comando>` (uno a la vez en esta máquina de 3,7 GiB).

INVARIANTES (de contracts/v1 y del plan maestro)
- Fuente preservada intacta antes de cualquier derivado. Un fixture nunca se presenta como salida del archivo cargado. Fallido/cancelado/expirado ≠ completado sin candidatos. Un detector produce candidatos, no identidades ni delitos. Sin hora de captura inventada. Descarga ≠ recepción institucional.
- Pruebas del comportamiento nuevo, de los límites y de los fallos; no pruebas que solo repitan el texto de un documento.

CIERRE DE CADA TAREA
- Commits pequeños en tu rama, un propósito cada uno.
- Informe en /home/dani/proyectos/takya-wt/_bus/reports/<agente>-<tarea>.md: archivos tocados, comandos EXACTOS ejecutados con su salida real (pasa/falla), límites y pendientes. Un informe sin salidas no cuenta. Actualiza tu fila de BOARD.md a `review`.
- Un revisor de otro modelo lo evaluará; acepta solo observaciones ligadas a una prueba que falla o a una invariante violada.
