# TAKYA · Validación en terreno (octubre 2026)

Estado: **relato del fundador sobre reuniones presenciales**. Faltan la ficha de cada reunión (fecha exacta, cargo, autorización para citar) y las palabras textuales. Hasta tenerlas, los datos de abajo se clasifican como **[R] reportado en entrevista**, no como fuente pública. [Documento maestro](../maestros/DOCUMENTO_MAESTRO_TAKYA_E2E.md).

## 1. Qué se validó

| Reunión | Qué se observó o se dijo | Consecuencia para TAKYA |
| --- | --- | --- |
| Central de televigilancia municipal de Antofagasta, con la psicóloga encargada del área de criminología | **1 operador por cada 30 cámaras.** La central ya tiene **160 cámaras** (antes, 130 según la [Municipalidad, 11-05-2026](https://www.municipalidaddeantofagasta.cl/index.php/noticias/4555-con-mas-operarios-y-el-apoyo-de-carabineros-operaran-desde-central-de-camaras-de-televigilancia)). Ella misma calificó la proporción de excesiva, trabaja con KPI y reconoció el dolor y las cargas cognitivas que planteamos | **El dolor está confirmado por quien gestiona la operación.** Es la métrica central del pitch |
| PDI Antofagasta | Dijeron que en Antofagasta no hay una unidad de cibercrimen y que el proyecto se puede consultar en línea con ellos | Buscar apoyo en las unidades especializadas nacionales y en la Fiscalía (§3) |
| Carabineros | Reunión realizada; buena recepción [R] | Registrar los hallazgos concretos en la ficha |

**Pendiente de la reunión municipal:** qué KPI usan (p. ej., eventos detectados por turno, tiempo de respuesta, falsas alarmas), su línea base y si podemos usarlos como referencia para medir TAKYA.

## 2. ¿Qué proporción de cámaras por operador es razonable?

No existe una cifra única aceptada. Lo que sí hay:

| Evidencia | Qué dice | Estado |
| --- | --- | --- |
| Tickner y Poulton (1973), monitoreo de cámaras en una cárcel, citado en [Frontiers in Human Neuroscience, 2013](https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2013.00615/full) | La detección de eventos sospechosos baja al aumentar las pantallas simultáneas: ~83 % con 4, ~84 % con 9 y **~64 % con 16** | [F] fuente secundaria académica; falta leer el original |
| Tickner, Poulton, Copeman y Simmonds (1972), *Monitoring 16 Television Screens Showing Little Movement*, Ergonomics 15(3) | Estudio clásico de monitoreo de 16 pantallas | [F] referencia; resultados por leer |
| Industria de seguridad, p. ej. [Solutec LATAM](https://solutec-latam.com/cuantas-camaras-puede-ver-un-operador-de-monitoreo/) | Entre 10 y 16 cámaras en visualización continua, menos si el riesgo es alto | [R] criterio de industria, no estudio |
| [Ventas de Seguridad](https://www.ventasdeseguridad.com/mas-a-fondo/otros-enfoques/6637-icuantos-monitores-necesitamos-en-un-sistema-de-cctv-i.html), atribuido a la policía británica | Concentración: 74 % con 4 imágenes, 58 % con 6, 53 % con 9 y 41 % con 16; ASIS recomienda relevo cada 2–3 h | [R] sin estudio original verificable; **no citar las cifras** |

**Conclusión [P]:** 1 operador por 30 cámaras **en visualización continua** duplica el techo que suele mencionarse (16) y supera con creces el punto donde la evidencia académica ya muestra caídas de detección. El factor clave no es pedirle al operador que mire 30 pantallas, sino **cambiar la tarea**:

- de «mirar todo» a «revisar excepciones»: TAKYA propone candidatos y el operador revisa episodios;
- de memoria y barra de tiempo a contexto preparado: fuente, fotogramas y «lo que no sabemos»;
- de decisión sin registro a decisión con motivo y evidencia verificable.

**Hipótesis a medir con la central [P]:** con TAKYA, un operador puede cubrir 30 cámaras **en modo excepción** sin perder detecciones frente al proceso actual. Medirlo con sus KPI, en un piloto autorizado, nunca con promesas.

## 3. Con quién contactar para la protección de evidencia

Contactos institucionales encontrados (verificar siempre por el canal oficial; no usar correos recibidos por mensajería, la PDI ha advertido de suplantaciones):

| Institución | Por qué | Cómo contactar |
| --- | --- | --- |
| **PDI · Brigada Investigadora del Cibercrimen Metropolitana** (Santiago; también hay brigadas en Valparaíso y Concepción) | Unidad especializada en delitos informáticos y evidencia digital | Directorio oficial [PDI más cercano](https://www.pdichile.cl/pdi-mas-cercano) y canales de pdichile.cl. Pedir orientación a través de PDI Antofagasta, que ya conoce el proyecto |
| **Fiscalía de Chile · fiscales especializados en cibercrimen** (51 designados a nivel nacional, según prensa) | Define qué formato de entrega y cadena de custodia sirven en una causa | [fiscaliadechile.cl](https://www.fiscaliadechile.cl): pedir a la **Fiscalía Regional de Antofagasta** el contacto de su fiscal de cibercrimen |
| **ANCI · Agencia Nacional de Ciberseguridad** (Ley 21.663) | Buenas prácticas de ciberseguridad y gestión de incidentes | ayuda@anci.gob.cl · [anci.gob.cl](https://anci.gob.cl) |
| **LACRIM PDI / LABOCAR Carabineros** (laboratorios de criminalística) | Peritaje de video; validan qué necesita un perito | No se encontró un contacto público de su sección digital en Antofagasta: preguntar en PDI y Carabineros de la región |
| **UCN / USQAI** (Programa Nómada) | Puede conectar con académicos de informática o derecho para revisar el diseño de evidencia | Mentores del programa |

**Qué pedir en esas reuniones:**
1. ¿Qué formato de entrega de video aceptan hoy?
2. ¿Les sirve un paquete con fuente original, huellas SHA-256, firma y verificador offline?
3. ¿Qué debe incluir un registro de cadena de custodia preliminar?
4. ¿Hay una guía o norma que debamos seguir?

No afirmar colaboración ni aval hasta tenerlos por escrito.

## 4. Decisiones del equipo tomadas a partir de estas reuniones

1. **La demo no será pública.** Se accede solo desde `/home`, con el usuario fijo `centinela` y una contraseña. La valida el servidor, no el navegador.
2. **La landing es pública** y lleva todo el contexto del proyecto, sin botones para probar la demo.
3. La demo se muestra **en presencia del equipo**. Si un cliente necesita probarla, se le autoriza una conexión puntual.
