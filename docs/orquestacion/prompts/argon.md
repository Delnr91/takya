# Argon 4 — interfaz «Analizar archivo» (H4)

Worktree: /home/dani/proyectos/takya-wt/argon · rama: agent/argon/h4-ui. Pega primero 00_comun.md.

Eres dueño de: src/features/demo/** (solo lo NUEVO para el flujo de análisis; conserva la práctica existente) y src/app/demo/**. Tu worktree no incluye node_modules: ejecuta `npm ci` en él (hay disco) y SOLO tú corres `next dev` (puerto 3001). No ejecutes `next build`; lo hace el integrador con candado.
No tocas backend/, src/app/api/**, congelados, ni contracts/.

OBJETIVO
En /demo ofrece «Analizar archivo» y «Práctica preparada», separados; no sumes cifras de ambos modos. Reutiliza la identidad de la consola (texto ≥18 px, pictograma+etiqueta, acciones amplias, foco visible, movimiento reducible). Flujo y estados: plan maestro §5 (Preparar → Delimitar → Analizar → Observar → Comprender → Decidir → Exportar → Cerrar), incluidos completado sin candidatos, rechazado, no admitido, capacidad ocupada, fallido, cancelado y sesión perdida.

TRABAJO
1. `src/features/demo/schemas/analysis.ts`: Zod equivalente a contracts/v1/schemas con las reglas semánticas del README; pasa TODAS las fixtures (valid/invalid/semantic-invalid). No debilites schemas/simulation.ts (exige 2 cámaras): contrato y navegación separados con IDs opacos, sin romper filtros, Atrás/Adelante ni recuperación de la práctica.
2. Cliente `src/features/demo/api/` que valida respuestas con Zod; hook propio. Análisis y decisiones NO pasan por localStorage/useDemoSession.
3. Componentes: carga con límites visibles antes de cargar, declaración de autorización, polígono con alternativa por teclado/coordenadas, progreso real con cancelar, visor de candidato (fuente, tiempos relativos, hasta tres PNG, overlays ocultables), «lo desconocido», decisión con motivo, exportación con nivel E1/E2 y TTL.
4. Servidor simulado SOLO para desarrollar: tras flag `NEXT_PUBLIC_TAKYA_MOCK=1`, con rótulo visible «SIMULADO» y prueba de que sin flag y sin backend se muestra «indisponible» y la práctica sigue disponible. Jamás un fixture como salida silenciosa del archivo cargado.
5. Cuando Astra fusione H2, sustituye el mock por la API real (contracts/v1/openapi.yaml).
6. QA visual: capturas en 320/390/768/1024 px, zoom 200%, teclado, contraste, movimiento reducido; compara con public/referencias/**. Distingue emulación de dispositivo físico.

Aceptación: recorrido completo contra el mock; typecheck, lint, test:demo, format:check solo en tus archivos; check-frozen OK; capturas en el informe.
