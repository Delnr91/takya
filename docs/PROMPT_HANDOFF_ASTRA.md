# TAKYA · Prompt para construir la demo final con Astra

Fecha: 19-10-2026. Reemplaza el handoff antiguo que pedía inicializar el proyecto y construir cuatro rutas. La aplicación existe; el alcance nuevo es solo la demo.

Selecciona Astra en tu cliente si está disponible y pega este bloque en el proyecto. El prompt no cambia automáticamente el modelo ni configura servicios. El [plan maestro de la demo final](maestros/PLAN_MAESTRO_DEMO_FINAL.md) contiene las decisiones y los criterios completos.

```text
Construye la demo final de TAKYA según
docs/maestros/PLAN_MAESTRO_DEMO_FINAL.md.

Tienes autorización para implementar y verificar los incrementos locales
reversibles H0–H6 dentro de este alcance. Completa el flujo real, no entregues
solo otro plan. Comunica avances y resultados en español. No inventes
pruebas, integraciones, autorizaciones ni capacidades.

RESTRICCIÓN PRINCIPAL
Solo la demo y su soporte técnico. Home, landing y login ya están bien:
no los rediseñes, reformatees ni modifiques. Conserva sus textos, enlaces,
marca, fuentes, fondos, animaciones y comportamiento.

PROYECTO Y ESTADO
Esta entrega está en /home/dani/proyectos/takya-main. Verifica raíz por
package.json y src/features/demo. No uses rutas Windows históricas ni
crees otra aplicación. Ya existen Next/React/TypeScript, práctica, seis
clips, revisión, decisiones, historial y K8 documental. No existe backend
nuevo ni inferencia sobre archivos subidos. Esta descarga no tenía .git:
compruébalo y no lo inicialices por iniciativa propia.

ANTES DE EDITAR
1. Lee AGENTS.md/AGENTS.override.md aplicables y conserva cambios ajenos.
2. Lee el plan completo, ENGRAM.md, docs/10_ESTADO_LOCAL.md y el índice
   docs/estrategia/00_INDICE_Y_ESTADO.md; usa los documentos 02, 03, 04,
   05 y 11 para los hitos correspondientes. Aplica takya-build/takya-cto.
3. Contrasta la fuente nueva, si existe:
   /home/dani/proyectos/invdes takya/DOCUMENTO_MAESTRO_TAKYA.md.
   El apartado 3 del plan resuelve sus propuestas no demostradas. No
   copies promesas de 2 GB, tiempos, legalidad o compatibilidad universal.
4. La documentación restante está clasificada en el apartado 2 del plan.
   Consulta la pertinente; los sprints antiguos de home/landing y la
   preferencia genérica por BD/cloud no gobiernan este encargo.
5. Antes de escribir Next, lee las guías pertinentes instaladas en
   node_modules/next/dist/docs/, incluidas Backend for Frontend y Route
   Handlers. Usa APIs de la versión instalada.
6. Genera snapshot SHA-256/inventario fuera del árbol público, ejecuta
   checks iniciales, registra deuda previa y define aceptación por hito.

FRONTERA DE ARCHIVOS
Trabaja en src/app/demo/**, src/features/demo/**,
src/app/api/analysis/**, backend/** y scripts/tests/docs propios del demo.
Solo ajusta package.json/lockfile, configuración de pruebas y .gitignore
si es indispensable para el backend/checks; justifica cada cambio.
Congela src/app/page.tsx, home, landing, login, layout.tsx, globals.css,
src/components/ui/**, src/features/shared/**, tailwind.config.ts,
next.config.mjs y assets públicos existentes. Crea estilos/componentes
exclusivos de la demo para evitar efectos transversales. No regeneres clips.
Si una dependencia esencial exige salir de esta frontera, presenta el
cambio concreto y solicita ampliación mientras avanzas tareas independientes.

RESULTADO
En /demo ofrece Analizar archivo y Práctica preparada, separados. Conserva
sesiones antiguas y no sumes cifras de simulación a análisis real.
Construye: archivo autorizado → carga acotada → fuente intacta/hash → zona
→ trabajo cancelable → candidato real → contexto → Observar/Comprender/
Decidir con motivo validado por servidor → paquete E1/E2 → verificador offline.
Backend caído muestra indisponibilidad, sin romper la práctica rotulada.

ARQUITECTURA Y RECURSOS
Conserva stack web y separación por feature. Añade FastAPI/Pydantic en
.venv local, coordinador único en memoria y worker aislado. FFmpeg/ffprobe,
detector ONNX CPU pequeño y cryptography; sin BD, Redis, S3, microservicios,
vector store, entrenamiento o nube nueva. Fija versiones estables y verifica
fuente/licencia/hash de pesos. No introduzcas dependencias innecesarias.
Perfil inicial: MP4/H.264, hasta 60 s, 1280x720 y 32 MiB; paquete en claro
hasta 64 MiB; un trabajo activo y uno esperando, con cuota global de cargas
y disco. Son límites a comprobar. No habilites una hora/2 GB antes de las
puertas del apartado 12. No ejecutes build e inferencia simultáneamente.

INVARIANTES
- Preserva bytes recibidos antes de remux, corte o reducción.
- Nunca presentes un fixture como salida del archivo cargado.
- Una fuente es válida. El esquema antiguo exige cameras.min(2): crea
  contrato/adaptador separado; no inventes cámaras ni debilites la práctica.
- La navegación antigua acepta IDs DEMO-...: resuelve IDs nuevos sin romper
  filtros, Atrás/Adelante o recuperación de sesiones.
- Análisis, evidencia y decisiones nuevas son autoridad del servidor y
  no pasan por localStorage/useDemoSession de la práctica.
- La cookie efímera aísla ejercicios, sin acreditar identidad laboral.
  Autoriza cada fuente, trabajo, video, decisión y paquete por sesión.
- Valida tipos estrictos, polígonos, tiempos, referencias y revisión
  esperada; idempotencia solo durante la vida del coordinador.
- Streaming/hash sin cargar todo el video en RAM en Next.
- Worker sin red, privilegios extra o shell; cuotas/timeouts aplicados.
  Prueba aislamiento real y que cancelar termina/recoge descendientes.
- Fallido/cancelado/expirado son distintos de completado sin candidatos.
- Detector y regla producen candidatos, no identidades ni delitos.
  FPS, permanencia, tracking y agrupación requieren pruebas locales.
- Precontexto 15 s/postcontexto 20 s propuestos, limitados a fuente real.
  Registra pedido/efectivo, PTS y contexto faltante. -c copy no garantiza
  corte exacto; no inventes continuidad ni fecha de captura.
- Hasta tres PNG limpios con procedencia si existen; overlays separados,
  sin reconstrucción generativa de detalles.
- E1: inventario/hash/firma y referencia pública confiable por otro canal.
  E2: AES-256-GCM local, nonce nuevo y claves separadas. No imprimas claves
  ni las guardes en navegador/logs/paquete; utilidad local y archivo privado
  de recuperación según el plan. No crees criptografía propia.
- Exportación completa, atómica y de una revisión; verificador separado
  sobre descarga real que rechaza alteración, faltantes y sustitución.
- Descarga no equivale a recepción policial ni borra automáticamente.
  Declara TTL/pérdida por reinicio antes de aceptar el ejercicio.
- K8 opcional: conserva ayuda actual y límite de no ver caso/video. Sin
  video/datos privados al proveedor ni herramientas de decisión/despacho/
  borrado. H7 se pospone hasta H1–H6; no lo necesitas para cerrar el núcleo.

ORDEN
H0: snapshot, línea base y ADR local sin BD.
H1: contratos, sesión, ingesta/preservación y verificador inicial.
H2: cola, worker aislado, progreso/cancelación, cuotas y fallos.
H3: detector real, zona/regla y evaluación positivo/negativo.
H4: revisión de una fuente y decisión de servidor en la consola.
H5: paquete E1/E2, restauración y verificación de descarga.
H6: regresión, recursos, accesibilidad, medición y dos ensayos completos.
Prueba cada incremento. Continúa sin pedir confirmación rutinaria dentro
del alcance; no te detengas en un scaffold. Si falta corpus autorizado o
pesos accesibles, avanza tareas independientes con sintéticos/dobles
rotulados y declara la puerta pendiente. No anuncies inferencia real con
un doble ni uses clips periodísticos como prueba de precisión.

VERIFICACIÓN Y CIERRE
Ejecuta typecheck, lint, test:demo, format:check y build, más pytest y
verificaciones del backend. No reformatees congelados por deuda previa.
Prueba ingesta válida/inválida, otra sesión, conflicto/replay, positivo,
negativo, GOP/tiempo, cancelación con hijos, cuota/disco, proveedor caído y
paquete/clave/tag/manifiesto alterados. Recorre UI con navegador, teclado,
zoom y tamaños móvil/iPad; distingue emulación de dispositivo físico.
Comprueba práctica anterior, hashes congelados y home/landing/login por
regresiones indirectas. Revisa secretos y cambios ajenos.
Actualiza ENGRAM.md al cerrar implementación como registro del proyecto.
Devuelve funciones/archivos, comandos/resultados, arranque local,
verificador, tabla G0–G5 y pendientes externos. No declares validación
comercial/UX ni difusión autorizada sin haberlas realizado.

No hagas commits, push, publicaciones, despliegues, compras, túneles,
instalaciones globales, cambios del host o acceso a credenciales.
No crees subagentes sin autorización posterior. No modifiques memoria
global de Codex. Construir con Astra no cambia el proveedor/modelo de K8.

Empieza inspeccionando la base y ejecutando H0 → H1. Después continúa
H2–H6 hasta completar lo verificable con alcance y recursos reales.
```
