# TAKYA · Plan de acción por rol y puertas de aceptación

Estado: plan de ejecución, sin fechas comprometidas hasta conocer plazo/equipo. [Índice](00_INDICE_Y_ESTADO.md).

## 1. Resultado del primer demo automático

Una persona carga un video autorizado de cámara fija, delimita una zona, ve el progreso, revisa un candidato y su contexto, toma una decisión con motivo y descarga un paquete que un verificador separado comprueba. Fallos y cancelación se distinguen de «sin candidatos». Todo ocurre sin BD; los límites temporales y de identidad se declaran.

Alcance inicial: un archivo, una zona, un tipo de candidato y un trabajo activo. Los seis clips curados de la práctica siguen disponibles como recorrido de respaldo claramente rotulado. Un fallback curado nunca se presenta como resultado del archivo recién cargado.

## 2. Equipo de expertos: responsabilidad, entrega y refutación

Una persona puede cubrir varios roles; asignar nombres antes de comenzar. No implica contratación ni ejecución de agentes paralelos.

| Rol | Acción concreta | Entrega / aceptación | Debe cuestionar |
| --- | --- | --- | --- |
| CEO / producto | Elegir segmento y dolor; conseguir piloto autorizado y validar comprador | Ficha de problema, propuesta y compromiso comercial verificable | ¿Hay uso real o solo aprobación verbal? |
| Investigación UX / operaciones | Recuperar entrevistas y observar tareas actuales con consentimiento | Registro anonimizado de tareas, errores e interrupciones; 5 pruebas exploratorias | ¿La sencillez ayuda o infantiliza/confunde? |
| CTO / arquitectura | Congelar alcance y contratos; resolver sesión efímera y compatibilidad | ADR del alcance sin BD y mapa de interfaces | ¿Hay garantías que los datos temporales no pueden cumplir? |
| Data engineer | Definir procedencia, etiquetas, corpus y métricas por evento | Inventario con hashes/autorización y partición ajuste/evaluación | ¿Hay fuga entre videos vecinos o selección de solo casos fáciles? |
| ML / visión | Probar detector pequeño, regla y FPS | Reporte de recall/FP/RTF/RAM en hardware real | ¿El ahorro oculta eventos críticos o depende del VLM? |
| Backend engineer | Implementar ingesta, cola, proceso, estado e idempotencia efímera | API integrada, cancelación y fallos ensayados | ¿Una caída o reintento duplica o pierde decisiones sin avisar? |
| Frontend / accesibilidad | Adaptar práctica a una fuente y nuevas respuestas | Flujo completo con teclado, zoom y móvil; pictogramas con etiquetas | ¿La UI presenta como certeza una sugerencia? |
| Ciberseguridad / evidencia | Diseñar límites, verificador, firma/cifrado según nivel | E1 comprobado; E2 si se anuncia, con pruebas negativas | ¿Un atacante puede cambiar archivo y manifiesto juntos? |
| Cloud / plataforma / FinOps | Definir equipo de demo, cuotas y operación local | Arranque repetible, medición de recursos y procedimiento de cierre | ¿La UI cloud puede llegar al worker y cuánto cuesta realmente? |
| QA / fiabilidad | Ejecutar escenarios y comparación contra referencia | Informe con comandos, resultados, fallos y límites | ¿Se verificó el recorrido o solo unidades aisladas? |
| Asesor jurídico/privacidad | Revisar material, roles de datos y alcance de entrega | Autorizaciones y reglas concretas para piloto/difusión | ¿Se promete cumplimiento o entrega institucional inexistente? |
| Comité crítico | Revisar una propuesta concreta y sus evidencias | Objeciones con severidad, prueba y criterio de resolución | ¿Qué dato cambiaría la decisión? |

## 3. Secuencia de construcción

Estimación orientativa: **10–16 días-persona** de ingeniería y QA más acceso a operadores y material. No es plazo calendario ni compromiso; recalibrar al medir el detector y cerrar el alcance. La ausencia de video autorizado o permisos es dependencia externa.

| Paso | Trabajo y responsable | Resultado que habilita el siguiente |
| --- | --- | --- |
| 0 · Delimitar | Producto + CTO: caso, usuario, archivo, zona, hardware, límites y materiales | Criterios previos firmados por el equipo; corpus mínimo disponible |
| 1 · Proteger antes de inferir | Backend + seguridad: cargar, validar, preservar y exportar fuente con verificador | Hash sin cambios; manipulación rechazada; errores de archivo visibles |
| 2 · Trabajo acotado | Backend: cola, progreso, cancelación, sesión e idempotencia | No bloquear web; no dejar procesos huérfanos; recursos medidos |
| 3 · Candidato real | ML + data: detector/regla y evaluación | Un nuevo video produce observaciones versionadas, positivos y negativos ensayados |
| 4 · Caso comprensible | Frontend: adaptar contratos, revisar, decidir y descargar | Recorrido completo nuevo sin alterar práctica antigua |
| 5 · Sello y medición | Seguridad + QA: paquete completo, firma/cifrado si corresponde y benchmark | Verificador independiente y comparación reproducible |
| 6 · Ayuda contextual | IA + UX: contexto autorizado y K8 opcional | Flujo funciona con proveedor caído; no inventa hechos de caso |
| 7 · Preparar defensa | CEO + QA: ensayo y actualizar datos del pitch | Puertas G0–G5 con evidencia y límites |

No condicionar pasos 1–5 a un chat generativo. Si el tiempo obliga a recortar, retirar VLM, K8 contextual y animaciones nuevas; conservar autorización, fuente, revisión humana y verificación. Si falta inferencia real, presentar el resultado como práctica curada y no como demo automático.

## 4. Puertas para declarar el demo listo

| Puerta | Evidencia necesaria | Estado al crear el dossier |
| --- | --- | --- |
| G0 · Datos y alcance | Video autorizado, caso definido, política temporal, fecha/pauta del pitch y hardware | Pendiente; existen clips de práctica cuya licencia de difusión no está comprobada |
| G1 · Ingesta y control | Archivo nuevo, validación, permiso por sesión, hash, cancelación y límites | Pendiente; no hay API de carga/análisis |
| G2 · Candidato real | Detector/regla sobre positivo y negativo; informe de omisiones y errores | Pendiente; señales actuales curadas |
| G3 · Decisión y evidencia | Una fuente real revisada, motivo, exportación y verificación de manipulación | Pendiente; historial actual local, sin paquete de custodia |
| G4 · Medición y UX | Comparación reproducible y tareas observadas, sin incremento de errores | Pendiente; opiniones cualitativas sin línea base |
| G5 · Ensayo y relato | Dos ensayos completos, fallback rotulado, fuentes de cifras y alcance honesto | Pendiente; duración y pauta desconocidas |

Regla de liberación: CEO valida afirmaciones y petición comercial; CTO valida capacidades; QA adjunta evidencia. Ningún rol cierra una puerta solo por haber escrito su implementación. Las comprobaciones actuales de TypeScript/dominio/chat son línea base y no completan G1–G5.

## 5. Guion de demostración de 90 segundos, a ensayar

El tiempo es propuesta escénica, no promesa de latencia del producto. Elegir clip corto autorizado y ensayado en el equipo real.

| Momento | Acción | Lo que debe quedar claro |
| --- | --- | --- |
| 0–15 s | Mostrar fuente, duración y zona; cargar archivo | Archivo nuevo, autorización y límites temporales |
| 15–35 s | Ejecutar análisis con progreso | Tiempo real medido; no animación con espera fija ni inferencia ficticia |
| 35–60 s | Abrir candidato, reproducir contexto y explicación | Posible ingreso, lo observado y lo desconocido; persona decide |
| 60–75 s | Registrar decisión y motivo | Confirmar/escalar/descartar son acciones humanas; despacho simulado |
| 75–90 s | Descargar y verificar paquete; mostrar prueba negativa preparada | Fuente y derivados trazables; una alteración se rechaza |

Si el análisis dura más, comunicarlo y ajustar el guion. No acelerar reproducción ni ocultar el tiempo de carga para anunciar rapidez total. La prueba negativa puede usar una copia alterada de material sintético identificada; nunca modificar el original.

## 6. Ensayo y contingencias

- Probar arranque local sin instalaciones pendientes, navegadores y resolución reales. Evitar varios servidores/compilaciones simultáneos en el notebook de 4 GB.
- Llevar un clip positivo y otro negativo autorizados, con copias de respaldo del material de demo fuera del estado temporal.
- Si cae K8/proveedor, usar guía curada visible; la revisión continúa.
- Si cae el detector/worker, mostrar error y continuar con la práctica preparada identificándola como tal. No sustituir la salida del archivo por un fixture silenciosamente.
- No conectar cámaras reales, enviar datos a proveedores, despachar recursos ni usar un receptor institucional sin acuerdos y autorización específicos.
- Tener informe y captura/video del ensayo con fecha; una grabación de respaldo se presenta como grabación del ensayo, sin aparentar ejecución en vivo.

## 7. Plan de evaluación mínimo

**Smoke test:** 10 eventos positivos y 10 negativos de material autorizado para descubrir errores. No usarlo como prueba de fiabilidad. **Evaluación preliminar:** ampliar y congelar al menos 50 positivos y 50 negativos de escenas separadas, más metraje continuo normal para FP/h; el tamaño definitivo depende de tolerancias y variabilidad.

Definir correspondencia de eventos antes del ensayo: misma zona, solapamiento temporal mínimo acordado y un match por evento real. Candidatos adicionales cuentan como duplicados o FP según regla predefinida. Si no hay positivos o negativos suficientes, informar que recall o precisión no son calculables. No calcular p95 como cifra robusta con unos pocos ensayos sin informar n.

Para UX, cinco participantes iniciales ayudan a encontrar problemas, sin estimar prevalencias nacionales. Tareas equivalentes y orden contrabalanceado; medir inicio/fin, aciertos, errores, ayudas y percepción antes/después. Mayor confianza con más errores es una señal de riesgo, no éxito.

## 8. Lo que falta pedir al fundador

1. Fecha, duración, formato y pauta de evaluación; si habrá Internet y equipo disponible.
2. Número de entrevistados, fechas, entorno, tareas y palabras exactas; autorización para citar y nivel de anonimización.
3. Video propio/autorizado de cámara fija con ingreso a zona, ejemplos negativos y permisos para mostrarlo a jueces.
4. Personas del equipo, horas disponibles, presupuesto y responsable de operación del demo.
5. Primer comprador, acceso a sitio piloto, necesidad de exportación y destinatario autorizado.
6. Si «no almacenar» permite temporales privados con caducidad declarada; si exige solo RAM, rediseñar límites y protección con esa restricción.

Hasta disponer de respuestas, el plan asume demo local con temporales limitados, un evento, sin BD ni envío de videos al LLM. Las preguntas abiertas no se convierten en permisos por transcurso del tiempo.
