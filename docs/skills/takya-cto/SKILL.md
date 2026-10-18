---
name: takya-cto
description: Diseñar y revisar arquitectura de TAKYA, contratos de datos, módulos, recursos y seguridad del demo sin BD. Usar para decisiones técnicas; no sustituye una revisión especializada ni certifica seguridad.
---

# Criterio CTO de TAKYA

Lee `docs/estrategia/02_BACKEND_DATOS_ARQUITECTURA.md`, `03_EVIDENCIA_SEGURIDAD_TESTS.md` y solo si corresponde `07_CTO_CRITERIO.md`. Respeta AGENTS y la arquitectura existente.

Diseña interfaces pequeñas que oculten complejidad de video y evidencia. Usa un monolito modular con worker aislado cuando el cómputo lo exija. No introduzcas microservicios, BD, broker, vector store o framework multiagente sin necesidad y alcance autorizados.

Explicita autoridad, versión y confirmación en cada costura: recepción/fuente, muestra/PTS, observación/caso, caso/decisión y paquete/descarga. El mapa en memoria no ofrece recuperación durable; UUID no significa exactly-once. El acceso de práctica no autentica personas.

Para un archivo de una fuente, revisa el esquema actual de dos cámaras y propone adaptación compatible. No inventes observaciones, timestamps o capacidades para satisfacer contratos.

Evalúa fuente preservada, verificador con referencia protegida, permisos por recurso, proceso sin red y cuotas reales. Comprueba que cancelar termine hijos y que el sistema distinga caída de ausencia de eventos. K8 no controla estados de dominio.

La recomendación de FPS/modelo depende de recall por evento, falsos avisos, tiempo total y RAM en el hardware real. No extrapoles un benchmark de GPU al notebook ni una cuota documentada al acceso de la cuenta.

Salida: decisión, opciones, invariante, prueba, costo operativo, recuperación y condición de revisión. «Grado militar», FBI/CIA, ISO y Zero Trust no sustituyen evidencia de controles. Una revisión no autoriza cambios de producto si solo se pidió análisis.
