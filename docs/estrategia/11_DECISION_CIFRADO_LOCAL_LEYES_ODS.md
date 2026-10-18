# TAKYA · Decisión técnica: procesamiento y cifrado local

Fecha: 18-10-2026. Estado: **diseño elegido para construir**, no backend implementado. [Índice](00_INDICE_Y_ESTADO.md) · [Arquitectura detallada](02_BACKEND_DATOS_ARQUITECTURA.md).

## 1. La decisión

**Procesar localmente, preservar la fuente y exportar evidencia cifrada verificable. Sin Amazon, S3 ni nube obligatoria. Sin BD en el demo.** Las consultas a documentación cloud fueron investigación sobre controles, no contratación, configuración ni decisión de alojar datos allí.

Prioridad económica: reutilizar equipo y frontend, un solo worker y un detector pequeño. No entrenar un modelo fundacional ni instalar infraestructura distribuida. Medir costo total y omisiones antes de anunciar ventaja frente a otra solución.

## 2. Tecnología elegida y pendiente

| Parte | Decisión |
| --- | --- |
| Frontend | Conservar Next.js 16 / React 19 / TypeScript / Zod / Tailwind / Lucide / Motion. K8 Three.js ocultable. |
| API | Python 3.12 + FastAPI/Pydantic y BFF de Next; permisos de sesión y contratos en servidor. |
| Engine | Un worker local separado: FFmpeg/ffprobe → muestras → detector → regla de zona/tiempo → candidato → contexto. |
| Modelo | Comparar una variante pequeña exportable de RT-DETR con una alternativa ligera en ONNX Runtime CPU. Pesos y variante final pendientes de medir/licenciar. |
| Seguimiento | ByteTrack solo si mejora estabilidad de la regla; no requisito por prestigio tecnológico. |
| Datos del demo | Mapa en memoria y archivos temporales privados acotados. Sin PostgreSQL, SQLite, Redis o almacenamiento de objetos. |
| Protección | `hashlib` para SHA-256; `cryptography` para AES-256-GCM y, cuando se implemente autenticación pública del paquete, firma Ed25519. |
| IA de ayuda | K8 documental; Groq textual existente opcional, sin video ni datos sensibles por defecto. La revisión central funciona sin proveedor externo. |

El detector no está implementado ni medido. Una persona dentro de una zona genera un candidato, no una afirmación de delito. Un LLM textual no reemplaza un detector ni una revisión del video.

## 3. Cómo procesaremos el video

1. **Recibir:** archivo propio/autorizado, streaming con límite y cancelación. Perfil inicial propuesto: MP4/H.264, hasta 60 segundos, 720p y 32 MiB.
2. **Validar:** ffprobe y límites de bytes, duración, pistas y píxeles. Rechazar corruptos o excesivos sin devolver éxito vacío.
3. **Preservar:** completar recepción, calcular SHA-256 y mantener intacta la fuente privada. Registrar fecha de carga; no inventar fecha de captura.
4. **Analizar una copia:** comparar 1/2 FPS y resolución reducida para el detector. Contar decodificación y preparación dentro del tiempo total. No usar ZIP como acelerador de MP4.
5. **Aplicar regla:** zona y permanencia versionadas; agrupar observaciones sin ocultar eventos distintos. Generar clip con contexto y vínculo temporal comprobado a la fuente.
6. **Revisar:** pictograma con etiqueta, video, motivo de prioridad y lo desconocido. El operador decide y aporta motivo.
7. **Empaquetar y verificar:** fuente, derivados, manifiesto, análisis separado y decisión. Verificador independiente antes de presentar exportación lista.

El corte `-c copy` puede evitar recodificación, pero no garantiza un intervalo exacto; registrar la correspondencia efectiva con la fuente. Muestrear menos puede omitir acciones breves: el criterio de elección incluye recall y falsos avisos, además de rapidez.

## 4. Cifrado local: qué protegemos

**Confidencialidad:** AES-256-GCM mediante biblioteca mantenida, con clave aleatoria y nonce nuevo según su contrato. **Integridad:** hashes frente a una referencia protegida y validación del tag. **Procedencia/trazabilidad:** manifiesto y registro de transformaciones/decisión. Ninguna propiedad demuestra por sí sola autenticidad previa a la recepción o admisibilidad judicial.

El paquete contiene los metadatos sensibles dentro del cifrado. No confundir AAD con secreto: AAD se autentica, pero no se cifra. Nunca poner clave en Git, navegador, logs o junto al archivo en claro.

Para el ensayo efímero, generar clave en memoria y definir explícitamente cómo la persona la conserva por un canal separado. Si se pierde, el paquete puede quedar irrecuperable. Para uso durable en Linux Mint/XFCE, evaluar el servicio de secretos/keyring realmente disponible, sin asumir GNOME; probar apertura, bloqueo, recuperación y respaldo. No guardar una clave maestra en `.env` como sustituto de esa política.

Si se firma el manifiesto, el verificador necesita una clave pública de confianza obtenida por otro canal. Incluir una clave pública reemplazable dentro del mismo paquete no autentica al emisor.

El original puede existir descifrado en el directorio privado mientras el worker lo analiza. Cifrar la exportación no cifra automáticamente temporales, swap ni disco. Solo usar material de demo autorizado para este perfil. Una futura custodia de datos sensibles exige evaluar cifrado de volumen, swap y respaldos; no se cambia la configuración del equipo en esta entrega.

## 5. Dos perfiles de almacenamiento, sin contradicciones

| Perfil | Qué permite | Qué no se promete |
| --- | --- | --- |
| Demo de bajo costo | Temporales privados, cuota, caducidad informada y exportación local cifrada. Un trabajo activo. | Recuperación durable, identidad laboral verificada o custodia institucional completa. |
| Piloto con evidencia real, futuro | Repositorio local dedicado cifrado, identidad individual, permisos, registro durable protegido, respaldo separado y recuperación ensayada. | Borrado automático tras enviar, retención cero o inmunidad ante ransomware. |

**Decisión actual:** construir el primer perfil. Si un cliente necesita conservar evidencia real, no usar el TTL del demo: acordar antes el segundo perfil y su persistencia. La selección de BD y soporte físico del piloto permanece pendiente; no obliga a contratar nube.

Para custodia futura: almacenamiento local bajo cuenta de servicio sin acceso interactivo; acceso de lectura/exportación separado de administración y eliminación; registro protegido; copia cifrada de respaldo separada y periódicamente desconectada; prueba de restauración. Un SSD/USB puede servir para respaldo según el riesgo, pero no basta con conectarlo permanentemente al mismo equipo. La inmutabilidad requiere un mecanismo ensayado; un archivo de solo lectura o `chattr` no resiste por sí solo a un administrador comprometido.

No se fija un plazo universal de 30/120 días. La política depende de actividad, finalidad, contrato y obligaciones aplicables; bloqueos de conservación prevalecen sobre limpieza ordinaria. Una descarga no acredita recepción de una autoridad. Borrar lógicamente no garantiza sanitización física de SSD o copias.

## 6. Qué significa el rigor solicitado como “militar”

Usaremos una especificación comprobable: mínimo privilegio, autenticación y permisos por recurso, cifrado autenticado, separación de claves, integridad verificable, registro protegido y recuperación. Referencia pública de arquitectura: [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final). No implica certificación militar, aprobación de FBI/CIA ni invulnerabilidad.

Pruebas mínimas: archivo alterado, manifiesto sustituido, otra sesión, clave/tag incorrectos, disco lleno, caída del worker, proveedor caído y restauración de un paquete válido. Si falla una comprobación, la UI no muestra «evidencia protegida».

## 7. Leyes chilenas: alcance que condiciona el diseño

Fuentes oficiales consultadas el 18-10-2026; la matriz orienta requisitos y no determina por sí sola el cumplimiento de un servicio concreto.

| Referencia | Consecuencia de diseño y revisión necesaria |
| --- | --- |
| [Ley 19.628](https://www.bcn.cl/leychile/navegar?idNorma=141599) | Definir finalidad, fundamento del tratamiento, responsables y accesos para imágenes/datos personales. No asumir que todo tratamiento requiere exactamente el mismo consentimiento. |
| [Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272) | Preparar la transición de protección de datos: su vigencia está indicada para **1 de diciembre de 2026**. No afirmar que toda la reforma ya rige al 18 de octubre. |
| [Ley 21.659](https://www.bcn.cl/leychile/navegar?idNorma=1202067) | Seguridad privada y servicios electrónicos tienen alcance regulado; revisar encuadre y autorizaciones. Su artículo 4 contempla conservación de antecedentes/pruebas para sujetos regulados: descartar “enviar y borrar” como regla universal. |
| [Decreto 209](https://www.bcn.cl/leychile/navegar?idNorma=1213672) | Revisar exigencias por actividad y tipo de dispositivo. La página no entregó texto completo utilizable en esta sesión: no se adopta una obligación universal de AES-256 ni un plazo CCTV a partir de extractos sobre cámaras corporales. |
| [Ley 21.663](https://www.bcn.cl/leychile/navegar?idNorma=1202434) | Revisar si el servicio/cliente entra en el régimen aplicable de ciberseguridad; no declarar automáticamente OIV a TAKYA o a cualquier condominio. Preparar responsabilidades, respuesta y evidencias. |

Antes de un piloto real: matriz de aplicabilidad con artículos vigentes, categoría de cliente, responsable/encargado, retención y bloqueo de conservación, transferencias, acceso y entrega. La fase efímera de demo no sustituye esos requisitos. Ni un hash ni AES-GCM otorgan validez judicial automática.

## 8. Agenda 2030 y ODS: relación voluntaria y medible

Se interpreta la solicitud como identificar dónde podría aportar TAKYA, separándolo de obligaciones legales. La Agenda 2030 no selecciona proveedor, algoritmo de cifrado ni arquitectura de almacenamiento. No se presenta como una certificación de producto.

| ODS | Relación propuesta | Qué medir antes de afirmar contribución |
| --- | --- | --- |
| [ODS 16 · Paz, justicia e instituciones](https://sdgs.un.org/goals/goal16) | Trazabilidad y revisión responsable; metas 16.3/16.6 como referencia, especialmente en un futuro piloto institucional. | Paquetes verificables, decisiones reconstruibles y procedimiento de entrega; no afirmar impacto judicial o reducción del delito desde un demo. |
| [ODS 9 · Innovación e infraestructura](https://sdgs.un.org/goals/goal9) | Desarrollo tecnológico y evaluación local; relación con investigación/innovación de la meta 9.5. | Experimentos reproducibles, recursos y desempeño bajo carga. No es el indicador nacional oficial del ODS. |
| [ODS 11 · Ciudades sostenibles](https://sdgs.un.org/goals/goal11) | Contribución potencial a seguridad de espacios públicos, meta 11.7, solo si existe y se valida ese uso. | En condominios privados la relación es indirecta; no anunciar una mejora urbana ya demostrada. |
| [ODS 8 · Trabajo decente](https://sdgs.un.org/goals/goal8) | Meta 8.8: considerar condiciones de trabajo del operador, sin vigilancia biométrica laboral. | Errores, ayudas, carga percibida y condiciones de uso. No afirmar alivio clínico o cumplimiento laboral por diseño. |

Para el pitch: priorizar ODS 16 y 9 como **alineación propuesta**; mencionar 11 y 8 con su condición de validación. Minimizar vigilancia, sesgos, exposición de personas y presión por decidir rápido. La seguridad física no justifica recolectar todo ni conservarlo indefinidamente.

## 9. Costos y siguiente paso

No habrá factura cloud de almacenamiento en este alcance. Sí existen disco, energía, desgaste, desarrollo, soporte y posibles llamadas opcionales de K8; no prometer costo cero total. Mantener modo sin proveedor para el ensayo y medir RAM/CPU y tiempo completo.

Siguiente incremento: fuente validada → paquete verificable/cifrado local → trabajo cancelable → detector/regla → UI. Los controles y librerías descritos aún necesitan implementación y pruebas; esta decisión no los da por existentes.
