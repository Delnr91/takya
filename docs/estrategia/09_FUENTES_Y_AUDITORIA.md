# TAKYA · Fuentes, afirmaciones y auditoría de la entrega

Corte: **18 de octubre de 2026**. [Índice](00_INDICE_Y_ESTADO.md).

## 1. Material local revisado

Se inventariaron los documentos y assets de `/home/dani/proyectos/invdes takya/`, sin modificar esa investigación ni inspeccionar su historial interno como parte del análisis de producto. No se enviaron sus archivos privados a servicios externos. Las búsquedas externas usaron términos generales y documentación pública.

| Fuente | Uso en este dossier | Precaución |
| --- | --- | --- |
| `astra.md` | Delimitar caso, separar fuente/análisis y medir frente a referencia | Investigación documental; no prueba de inferencia propia |
| `Argon.md` | Flujo de etapas y planteamiento de ergonomía/evidencia | Corregir promesas universales y cifras sin medición |
| `argon2.docx` | Texto extraído localmente y comparación con Markdown; imágenes originales | Misma investigación, no corroboración independiente |
| `deepseek.md` | Preguntas de usuario, alternativas y adopción | Demografía, turnos y normativa requieren fuentes específicas; vigilancia facial excluida |
| `glm.md` | Inventario de componentes y riesgos | “Capas implementadas” en el texto no acredita una aplicación |
| `gemenisfinal.md` | Estados, contratos y ejemplos Python revisados como documentación | No copiar sus fragmentos como backend endurecido probado |
| `gptoss.md` | Síntesis para contraste | Repite afirmaciones de los otros documentos; no añade medición independiente |
| `README.md`, `VERIFICACION.md` | Síntesis crítica y límites previos | Se verificaron las decisiones con código y fuentes actuales cuando correspondía |
| `assets/argon2/` | Tres imágenes, README y procedencia JSON | Las imágenes contienen cifras que no se adoptan como resultados |
| `takyaexcalidraw.png` de este proyecto | Organización visual de seis bloques | Adaptada en el documento 02 y mapa editable; BD/servicios retirados del alcance inicial |

El Word y el cuerpo de Argon comparten el texto normalizado salvo marcadores de imagen y algunas expresiones numéricas/formato. Se inspeccionaron las tres imágenes extraídas: rueda, infografía de costos/fatiga y fragmento de interfaz. No se adoptan sus porcentajes o latencias como evidencia empírica.

También se inspeccionaron `package.json`, versiones instaladas, contratos, modelo cognitivo, chat, guías/planes existentes y manifiesto multimedia de `takya-main`. No se abrió ningún archivo de claves ni se configuró un proveedor. La carpeta es una descarga sin `.git`; no hay diff de Git disponible.

## 2. Registro de afirmaciones del pitch

| ID | Afirmación | Estado | Uso permitido |
| --- | --- | --- | --- |
| A01 | Operadores entrevistados observan 2–5 cámaras | Reportado por fundador | Hallazgo cualitativo con atribución; falta ficha/muestra |
| A02 | La herramienta parece fácil y podría aliviar su trabajo | Expectativa reportada | No convertir en efecto medido ni porcentaje de satisfacción |
| A03 | La competencia procesa siempre video crudo y tarda más | Generalización no sustentada; existen contraejemplos técnicos | No utilizar; comparar tareas/configuraciones equivalentes |
| A04 | TAKYA carga y analiza automáticamente un video nuevo | No implementado en el código inspeccionado | Objetivo del próximo incremento |
| A05 | La consola permite práctica con clips y decisiones | Código observado; pruebas de dominio pasan | Describir práctica y sus límites, sin atribuir autenticación real |
| A06 | K8 tiene código de recuperación y proveedor textual | Observado en servidor | No afirmar llamada real, visión o acceso al caso en esta sesión |
| A07 | Fuente intacta, firma/cifrado y paquete verificable | Diseño propuesto | Anunciar solo después de pruebas E1/E2 |
| A08 | “Base de datos militar / Zero Trust certificado” | Sin BD ni evidencia de certificación | Sustituir por controles y resultados concretos |
| A09 | 90–98% menos falsas alarmas, <100 ms o decisión en 2 s | No medido por TAKYA | Retirar de resultados; usar únicamente metas explícitas si se evalúan |
| A10 | 2 FPS frente a 25 FPS produce 92% menos muestras de inferencia | Cálculo bajo supuestos | No equivale a 92% menos costo, bytes o errores |
| A11 | Integración policial, recepción institucional o validez judicial | No comprobadas | Escalamiento simulado; acuerdos y revisión posteriores |
| A12 | Videos existentes autorizados para difusión pública | No comprobado; la documentación indica procedencia periodística | Resolver permisos antes de mostrar/publicar; usar material propio/autorizado |

## 3. Contraste público realizado

Fuentes primarias consultadas en esta sesión. Son documentación de capacidades y recomendaciones, no benchmarks comparativos de TAKYA ni certificaciones del prototipo.

| Fuente | Qué establece para esta decisión |
| --- | --- |
| [Axis · Edge analytics](https://newsroom.axis.com/en-us/article/edge-analytics) | Existen análisis locales y metadatos; no generalizar que toda competencia envía video completo a procesamiento central |
| [Frigate · Getting started](https://docs.frigate.video/guides/getting_started/) | Roles de detección y grabación pueden usar señales distintas |
| [FFmpeg · Streamcopy](https://ffmpeg.org/ffmpeg.html#Streamcopy) | Copia de paquetes sin decodificación/filtrado/recodificación; no confundir con corte exacto o archivo original |
| [FastAPI · Background tasks](https://fastapi.tiangolo.com/tutorial/background-tasks/) | Distingue tareas ligeras y cómputo pesado; el worker separado es una propuesta local |
| [RT-DETR · Repositorio oficial](https://github.com/lyuwenyu/RT-DETR) | Implementación y licencia de código; pesos y desempeño local por comprobar |
| [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final) | Zero Trust no concede confianza por ubicación de red |
| [NIST IR 8387](https://nvlpubs.nist.gov/nistpubs/ir/2022/NIST.IR.8387.pdf) | Consideraciones de preservación de evidencia digital |
| [OWASP · File upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html) | Validación por capas, límites y almacenamiento fuera del directorio público |
| [Groq · Vision](https://console.groq.com/docs/vision) | Entrada visual documentada; no acredita acceso de esta cuenta ni una integración con TAKYA |
| [Groq · Your data](https://console.groq.com/docs/your-data) | Distingue datos de cliente, metadatos y opciones de retención/ZDR; cuenta no inspeccionada |
| [W3C · Icons](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o1p07-icons-used/) | Iconos que ayuden a comprender y su relación con texto; comprensión debe probarse |
| [OpenAI · Skills](https://developers.openai.com/codex/skills/) | Estructura SKILL.md y descubrimiento local en `.agents/skills` |
| [BCN · Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272) y [ficha legislativa](https://www.bcn.cl/balance-legislativo/detalle/ficha_LEY_21719_2024-12-13) | Referencias oficiales para revisión jurídica; no certifican al producto |

La página de resumen NIST IR 8387 devolvió un error, por lo que se leyó el PDF oficial. La consulta al Decreto 209 no entregó texto utilizable en esta sesión; no se extraen obligaciones específicas de ese resultado. Tampoco se revalidaron todos los enlaces, estadísticas demográficas, precios o proyectos municipales de las investigaciones: esas cifras no se incorporan como resultados en este dossier.

## 4. Verificaciones ejecutadas sobre la base existente

| Comprobación | Resultado de esta sesión | Qué no prueba |
| --- | --- | --- |
| `npm run typecheck` | Correcto, código de salida 0 | No prueba análisis de video ni interacción en navegador |
| `npm run lint` | Correcto, código de salida 0 | No certifica seguridad |
| `npm run test:demo` | Correcto; este entorno informa dos archivos de prueba aprobados | No son solo dos casos individuales |
| `node .demo-tests/model/chat.test.js` | **15 tests aprobados**, 0 fallos | No realizó una llamada real al proveedor |
| `node .demo-tests/model/simulation.test.js` | **16 tests aprobados**, 0 fallos | Modelo de práctica, sin detector nuevo |

Se ejecutaron los archivos compilados individualmente para observar los 31 tests, porque la salida del comando agregado de este entorno solo enumera los dos archivos. No se modificó el runner.

No se ejecutó build ni navegador para esta entrega documental; las verificaciones históricas del documento `10_ESTADO_LOCAL` no se presentan como comprobaciones nuevas. No hay pruebas backend, inferencia, cifrado, permisos de evidencia o usabilidad real del flujo nuevo porque todavía no existe.

## 5. Verificación de los nuevos artefactos

Las cuatro skills pasaron `quick_validate.py` de `skill-creator`: frontmatter, nombres y formato válidos. Esto no prueba su comportamiento en tareas reales ni una revisión independiente. Los casos de evaluación del documento 08 siguen siendo un plan de prueba conductual.

Comprobaciones de los nuevos artefactos:

- **15 archivos Markdown** del dossier y skills: bloques de código balanceados y **33 enlaces locales** válidos. Revisión por patrones de credenciales sin coincidencias; no equivale a una auditoría exhaustiva de secretos.
- Límites coherentes: fuente de 32 MiB y paquete de 64 MiB, como perfil propuesto aún sin benchmark.
- SVG válido como XML y texto dentro de los límites de los paneles según métricas DejaVu Sans. Excalidraw JSON versión 2 con **23 elementos editables** e IDs únicos. No se abrió en la aplicación Excalidraw ni se renderizaron los Mermaid en navegador; la revisión del mapa es estructural.
- Las tres imágenes de `assets/argon2` coinciden byte por byte con sus entradas del Word; la investigación se conservó sin editar.
- Snapshot antes/después de **119 archivos preexistentes** de código, documentación y configuración principal: únicamente cambió `README.md`, para enlazar el dossier. Se añadieron documentos, diagramas y skills; no se alteraron código de producto ni dependencias.
- Tras el permiso del sandbox, se crearon **cuatro enlaces** en `.agents/skills` y se comprobó que resuelven a `docs/skills` con su `SKILL.md`. No se modificó configuración global ni se comprobó el selector del cliente en una sesión nueva.

La activación de skills no implementa los controles descritos. La validación de frontmatter y enlaces tampoco sustituye una prueba conductual con tareas reales.

## 6. Qué falta para cerrar el documento final del pitch

Respuesta del fundador a los datos del documento 05; video y permiso de difusión; implementación y pruebas G1–G3; mediciones G4; ensayos G5. Hasta entonces, este dossier es una base de decisión y construcción. No sustituir los pendientes por métricas simuladas ni escribir «demo listo».

## 7. Ampliación posterior y preparación para GitHub

Se añadieron el informe del seminario PDI, la decisión de procesamiento/cifrado local y el mapa completo en PNG, SVG y Excalidraw. El PNG de 2800×2240 se generó desde el SVG con el rasterizador librsvg de FFmpeg y se inspeccionó visualmente. No se modificó la ilustración original aportada por el fundador. El mapa completo contiene 78 elementos editables; sus tecnologías pendientes se distinguen de la práctica existente.

Se verificó el commit remoto de `seminariopdi`, los metadatos de ambas jornadas y ausencia de subtítulos accesibles. Los dos análisis audiovisuales automáticos devolvieron contenido ajeno a las grabaciones y se descartaron. El documento 10 no afirma reproducción o transcripción completa ni atribuye las ampliaciones educativas a los expositores.

Se contrastaron referencias oficiales sobre leyes chilenas y ODS. AWS solo se consultó como documentación pública de investigación: no se creó infraestructura, no se accedió a una cuenta AWS y no se enviaron videos allí. La preferencia confirmada es procesamiento, cifrado y custodia local con costo mínimo, sin nube obligatoria.

**`npm run build` se ejecutó correctamente en esta ampliación**, generando las rutas de la aplicación. Esto actualiza el límite de la primera revisión documental, que no había ejecutado una compilación nueva. Los tests de dominio/chat, tipos y lint ya habían pasado en esta sesión; no hay un backend nuevo que evaluar.

La publicación se prepara en un clon separado del repositorio original `Delnr91/takya`, preservando la descarga de trabajo. Se revisaron también las correcciones locales previas de arranque, origen del chat y corpus documental, sin sustituir el frontend por el backend propuesto. Secretos, cachés, dependencias instaladas y archivos de QA quedan fuera de la publicación. El resultado remoto se verifica después del push.
