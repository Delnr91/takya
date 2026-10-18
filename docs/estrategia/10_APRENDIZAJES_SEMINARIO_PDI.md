# TAKYA · Qué aprovechar del seminario PDI

Fecha: 18-10-2026. [Índice del dossier](00_INDICE_Y_ESTADO.md).

## Alcance real de la revisión

Se consultó el repositorio público [Delnr91/seminariopdi](https://github.com/Delnr91/seminariopdi), su índice audiovisual y sus lecciones/anexos. El commit remoto `21d30df446d56964998a22de0f39189fd28f0b45` coincide con la copia local revisada. El material educativo del repositorio **no es una transcripción de los expositores**.

Se consultaron directamente los metadatos públicos de ambas grabaciones de PDIChile:

| Grabación | Fecha publicada | Duración comprobada | Subtítulos accesibles en esta consulta |
| --- | --- | --- | --- |
| [Día 1](https://www.youtube.com/watch?v=PEqWRTb1idE) | 07-10-2026 | 10:18:59 | Ninguno, tampoco automáticos |
| [Día 2](https://www.youtube.com/watch?v=jLbdG67TqW8) | 08-10-2026 | 07:31:50 | Ninguno, tampoco automáticos |

**No se consiguió una reproducción/transcripción íntegra verificable.** Se intentó un análisis audiovisual automático de ambas URLs, pero las salidas correspondían a anuncios ajenos: 45 segundos de cosmética y 17 segundos de una cafetera. Se descartaron por incompatibilidad de contenido y duración. No constituyen evidencia sobre el seminario. No se han escuchado ni transcrito las casi 18 horas completas.

Por tanto, las aplicaciones siguientes son una **síntesis de las lecciones del repositorio y propuestas propias para TAKYA**, con enlaces al índice para contrastarlas. No son citas ni recomendaciones atribuidas literalmente a los speakers. Los minutos proceden del [índice audiovisual del repositorio](https://github.com/Delnr91/seminariopdi/blob/21d30df446d56964998a22de0f39189fd28f0b45/VIDEOS.md) y son aproximados.

## Conclusión de arquitectura

Lo más útil para TAKYA es combinar **evidencia trazable, permisos limitados y operación comprensible cuando algo falla**. Tener más modelos o generar más alertas no demuestra mayor seguridad. La aplicación debe ayudar a revisar señales y mantener fuera del LLM las decisiones y las operaciones de custodia.

Esto refuerza el backend local del dossier. No justifica instalar un SOC completo, importar inteligencia de amenazas indiscriminadamente o contratar nube para el demo.

## Ocho aplicaciones concretas

| Aprendizaje del material educativo | Aplicación propia a TAKYA | Prueba que necesitamos |
| --- | --- | --- |
| Separar observaciones, hipótesis y acciones | Tres campos distintos: señal observada, explicación sugerida y decisión humana. | La exportación permite reconstruir qué sustentó cada decisión. |
| Una IA con herramientas amplía el riesgo | K8 carece de herramientas para decidir, borrar o despachar. Validar permisos fuera del modelo. | Una instrucción maliciosa en guía o futuro OCR no cambia estados ni revela otro caso. |
| Inteligencia útil comienza por una pregunta | Antes de recolectar datos: «¿qué evidencia falta para revisar esta permanencia?». | Cada dato solicitado cambia una decisión o se elimina del contrato. |
| Ausencia de alertas no prueba ausencia de incidentes | Separar salud del análisis y cantidad de candidatos. | Worker detenido muestra fallo; no un tablero verde con cero eventos. |
| Las dependencias propagan fallos | K8/proveedor opcional y worker aislado. | Caída del proveedor permite revisar, decidir y exportar localmente. |
| Apariencia no autentica identidad ni procedencia | Identidad real en piloto; fuente y huellas contra referencia confiable. | Cambiar video y manifiesto juntos no pasa contra la referencia protegida. |
| Responder incluye recuperar | Procedimiento para cancelar, fallar, cerrar y recuperar según el perfil. | Simular caída y explicar qué se conserva y qué se pierde sin BD. |
| Formación se verifica mediante tareas | Práctica de revisión, descarte y reconocimiento de fallo. | Usuario completa la tarea sin ayuda; no basta con decir que la pantalla es fácil. |

## Recorrido por las dos jornadas

Esta tabla cubre los 17 bloques del índice; E-Virtus aparece una sola vez. La correspondencia temática se toma de la curaduría del repositorio, no de una nueva escucha completa.

| Bloque y acceso aproximado | Qué estudiar | Transferencia a TAKYA |
| --- | --- | --- |
| [D1 · Wong · 01:02:00](https://www.youtube.com/watch?v=PEqWRTb1idE&t=3720s) | IA, amenazas y trazabilidad | Separar inferencia de evidencia; escenarios adversarios del asistente. |
| [D1 · Lama · 02:49:00](https://www.youtube.com/watch?v=PEqWRTb1idE&t=10140s) | Infraestructura de Internet y continuidad | No depender de conectividad externa para revisar un archivo local. |
| [D1 · Manu Fernández · 03:20:20](https://www.youtube.com/watch?v=PEqWRTb1idE&t=12020s) | Suplantación asistida por IA | Una cara/voz convincente no autoriza una operación; no prometer detectar todo deepfake. |
| [D1 · Bordachar · 03:48:40](https://www.youtube.com/watch?v=PEqWRTb1idE&t=13720s) | Gobernanza y ANCI | Dueño por riesgo, control y evidencia. Aplicabilidad legal por revisar, sin autocalificarnos OIV. |
| [D1 · Macías · 04:22:00](https://www.youtube.com/watch?v=PEqWRTb1idE&t=15720s) | Análisis de amenazas y filtraciones | Accesos/exportaciones trazables; minimizar datos que un fallo puede exponer. |
| [D1 · Víctor Fernández · 06:57:20](https://www.youtube.com/watch?v=PEqWRTb1idE&t=25040s) | Dispositivos conectados | Futuras cámaras/NVR son límites de confianza; inventario y credenciales separadas. |
| [D1 · Panel · 07:17:40](https://www.youtube.com/watch?v=PEqWRTb1idE&t=26260s) | Interdependencia de servicios | Ensayar qué ocurre sin red, disco, worker o proveedor. |
| [D1 · Bonnaire · 08:56:40](https://www.youtube.com/watch?v=PEqWRTb1idE&t=32200s) | Agentes de IA | Restringir herramientas, contexto y autoridad de K8. |
| [D1 · Barrera/E-Virtus · 09:26:40](https://www.youtube.com/watch?v=PEqWRTb1idE&t=34000s) | IA, resiliencia y supervisión | Mínimo privilegio y degradación controlada; no una etiqueta de seguridad. |
| [D1 · Nikitin · 09:48:20](https://www.youtube.com/watch?v=PEqWRTb1idE&t=35300s) | Economía del fraude | Considerar robo de cuentas, claves y exportaciones además del detector. |
| [D2 · Cáceres · 00:10:40](https://www.youtube.com/watch?v=jLbdG67TqW8&t=640s) | IA en ciberdefensa | Comparar ayuda al analista con referencia sin IA; medir errores y omisiones. |
| [D2 · Fuentes · 00:33:20](https://www.youtube.com/watch?v=jLbdG67TqW8&t=2000s) | Inteligencia de amenazas | Pregunta → observación → contexto → recomendación verificable. |
| [D2 · Cordero · 02:17:40](https://www.youtube.com/watch?v=jLbdG67TqW8&t=8260s) | Ciberresiliencia | Inventariar equipo y versiones; recuperación local antes de prometer disponibilidad. |
| [D2 · Alli/panel · 02:51:40](https://www.youtube.com/watch?v=jLbdG67TqW8&t=10300s) | Continuidad en salud | Priorizar consecuencia operacional del fallo; no trasladar obligaciones clínicas al demo. |
| [D2 · Albuquerque · 03:24:00](https://www.youtube.com/watch?v=jLbdG67TqW8&t=12240s) | Prevención, detección y respuesta | Procedimiento de fallo y recuperación, no solo alertas. |
| [D2 · Norman · 05:41:40](https://www.youtube.com/watch?v=jLbdG67TqW8&t=20500s) | Amenazas híbridas | Conservar origen y contexto; no inferir coordinación o culpabilidad por coincidencia temporal. |
| [D2 · Abbas · 06:14:40](https://www.youtube.com/watch?v=jLbdG67TqW8&t=22480s) | Desarrollo de capacidades | Evaluar tareas del operador y necesidades de capacitación. |

## 80/20: qué añadir ahora al demo

1. **Salud separada del resultado:** `analysis_state`, progreso, tiempo de última actualización y causa de error. «Completado sin candidatos» solo tras completar realmente el trabajo.
2. **K8 sin autoridad:** guías y resumen autorizado; prueba de contenido adversario en las fuentes. La seguridad no depende de encontrar una palabra prohibida.
3. **Verificador antes que insignia:** inventario, fuente, derivados, huellas y referencia protegida. Probar alteración y archivo faltante.
4. **Ensayo de tres fallos:** proveedor caído, cancelación/worker detenido y paquete modificado. Mostrar al operador el estado y la siguiente acción útil.

Ya estaban propuestos en el dossier; aquí se convierten en un ensayo integrado. Se posponen MISP, OpenCTI, SIEM, EDR, TPM/atestación y laboratorios de infraestructura: no hacen falta para demostrar revisión de un archivo.

## Fuentes primarias de contraste técnico

La inyección puede entrar por datos externos, también multimodales; RAG por sí solo no la elimina. La aplicación debe limitar privilegios y comprobar operaciones fuera del LLM. [OWASP, Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/).

Zero Trust no concede autorización por estar en una red local. [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final). Para TAKYA se traduce en permisos por recurso y procesos limitados, no en una certificación del prototipo.

La respuesta a incidentes forma parte de la gestión del riesgo e incluye preparación, detección, respuesta y recuperación. [NIST SP 800-61 Rev. 3](https://csrc.nist.gov/pubs/sp/800/61/r3/final). El ensayo concreto anterior es una propuesta propia.

## Límite para el pitch

Formulación permitida: «Estudiamos material educativo del seminario PDI y referencias públicas para reforzar supervisión humana, trazabilidad y recuperación». No afirmar colaboración, aprobación PDI, certificación ni recomendaciones personales de los expositores. La reproducción/transcripción íntegra sigue pendiente de una fuente audiovisual fiel.
