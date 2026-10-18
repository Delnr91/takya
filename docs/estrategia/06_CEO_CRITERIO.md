# TAKYA · Marco de decisión del CEO

Un criterio ejecutivo para TAKYA inspirado en ideas públicas de Jensen Huang, Satya Nadella, Jeff Bezos, Paul Graham y Naval Ravikant. **Es una adaptación para este proyecto, no una imitación personal, una cita atribuida ni un respaldo de esas personas.**

[Índice](00_INDICE_Y_ESTADO.md) · [Skill CEO](../skills/takya-ceo/SKILL.md).

## 1. Mandato

Conseguir evidencia de que un operador y un comprador necesitan el mismo producto que estamos construyendo. Concentrar recursos en un trabajo completo que podamos resolver y cobrar de forma sostenible. Mantener juntas ambición y honestidad sobre lo demostrado.

**Tesis:** TAKYA puede ganar resolviendo la transición entre observar, comprender, decidir y conservar evidencia. Evitar competir únicamente por precio por token, número de modelos o FPS de un detector intercambiable.

## 2. Cinco lentes convertidas en acción

| Lente de inspiración | Aplicación propia a TAKYA | Acción de esta etapa | Qué obliga a reconsiderar |
| --- | --- | --- | --- |
| Huang · plataforma y sistema completo | El valor está en que el recorrido funcione, incluidas sus costuras. | Integrar un caso desde archivo hasta verificador; medir el cuello de botella real. | El supuesto sistema completo añade costo sin mejorar una tarea del operador. |
| Nadella · aprendizaje y crecimiento | Revisar convicciones frente al uso observado. | Registrar errores de usuarios y una hipótesis refutada por ciclo. | Solo recogemos elogios y descartamos señales que contradicen el relato. |
| Bezos · decisiones reversibles y de alto costo | Experimentar rápido donde se puede revertir; revisar consecuencias duraderas. | Probar textos, disposición de UI y detector con un adaptador; tratar datos reales, retención y contratos con revisión explícita. | Un experimento reversible empieza a afectar datos o compromisos reales. |
| Graham · trabajo cercano al primer usuario | Comprender manualmente un sitio antes de escalar la solución. | Observar revisión/exportación, acompañar instalación piloto y resolver una tarea concreta. | Cada sitio requiere un producto distinto y soporte imposible de sostener. |
| Naval · conocimiento específico y apalancamiento | Construir conocimiento operativo y herramientas reproducibles. | Convertir hallazgos autorizados en guías, tests y evaluación mantenida. | El valor depende solo de una API disponible para todos. |

Fuentes de lectura: [Graham, trabajo que no escala](https://paulgraham.com/ds.html), [Bezos, carta de 2015](https://ir.aboutamazon.com/files/doc_financials/annual/2015-Letter-to-Shareholders.PDF), [Microsoft, carta e informe de 2025](https://www.microsoft.com/investor/reports/ar25/index.html) y [Naval, conocimiento específico](https://nav.al/specific-knowledge). La lente de plataforma atribuida a Huang se usa como inspiración estratégica; no como afirmación de que NVIDIA aconseja este producto.

## 3. Salir de la condición de commodity

Usar componentes comunes cuando funcionan: FFmpeg, detector preentrenado, proveedor textual. Invertir diferenciación en la tarea del operador, procedencia verificable, procedimientos y facilidad de instalación. Evitar una reimplementación costosa del VMS existente sin medir la necesidad.

Activos a construir: taxonomía de problemas reales, corpus autorizado con buena anotación, evaluaciones por escena, diseño probado, contratos de evidencia e integraciones mantenidas. Datos de clientes no son automáticamente un activo apropiable; los permisos y acuerdos delimitan uso, retención y entrenamiento.

La primera evidencia de ventaja será que un usuario complete mejor el trabajo y que un comprador acepte un piloto con alcance y costo. El sello visual, la mascota y la cantidad de agentes no demuestran esa ventaja.

## 4. Documento de decisión del CEO

Para cada apuesta importante, registrar en una página:

1. **Decisión:** qué usuario, tarea y resultado buscamos.
2. **Hipótesis:** respuesta provisional y evidencia que nos haría cambiar.
3. **Opciones:** incluyendo proceso manual y producto existente.
4. **Apuesta:** inversión máxima, responsable y plazo para aprender.
5. **Costo de equivocarnos:** reversible, dato expuesto, obligación contractual o conservación.
6. **Resultado:** qué observamos, qué ignoramos y siguiente decisión.

No usar el cargo CEO para aprobar unilateralmente garantías técnicas, legales o de seguridad sin evidencia del responsable.

## 5. Plan de acción

| Horizonte relativo | Acción | Resultado verificable |
| --- | --- | --- |
| Antes de construir | Recuperar entrevistas, definir comprador y conseguir material autorizado. | Ficha anonimizada y permisos; objetivo de demo acordado. |
| Primer ciclo | Completar un caso con el equipo; observar tareas con operadores. | Errores, tiempo y ayudas registrados, incluidos casos negativos. |
| Antes del pitch | Completar puertas G0–G5 y ajustar cada afirmación al resultado. | Guion ensayado, cifras con fuente, petición concreta. |
| Primer piloto | Oferta de un sitio y alcance limitado, con responsable operativo y política de datos. | Acuerdo y criterio de continuidad; precio aún por validar. |

Si el plazo del pitch no permite G1–G4, presentar práctica y hoja de ruta con honestidad. Un pitch más limitado es defendible; afirmar inferencia o custodia que no existe expone la confianza del equipo.

## 6. Métricas del negocio

Medir tareas completas por sesión, errores relevantes, retorno voluntario al producto, horas de instalación/soporte, pilotos calificados y costo por sitio. La satisfacción declarada acompaña esas métricas, sin sustituirlas.

No optimizar solo cantidad de alertas comprimidas: un sistema que omite incidentes también genera menos alertas. No tomar “tiempo hasta decidir” como objetivo aislado: puede incentivar decisiones precipitadas. No inventar un TAM ni ingresos a partir de cámaras proyectadas.

## 7. Comité que puede refutar al CEO

| Objeción | Evidencia que el CEO debe traer |
| --- | --- |
| El problema es exportar, no detectar. | Observación de tareas y costo de cada etapa. |
| El cliente ya tiene analítica local. | Comparación de tarea completa, compatible con su herramienta. |
| El usuario disfruta el demo, pero nadie paga. | Entrevistas con decisor económico y una oferta concreta. |
| El sello de seguridad es marketing. | Informe técnico del nivel E1/E2 realmente verificado. |
| La expansión municipal distrae del primer usuario. | Capacidad de soporte e integración demostrada en el segmento inicial. |

**Criterio de continuidad:** seguir cuando hay mejora observada, riesgo controlado y compromiso de validación; rediseñar cuando solo aumenta la complejidad o la narrativa supera la evidencia.
