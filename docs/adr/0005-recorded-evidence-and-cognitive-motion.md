# ADR 0005 — Evidencia grabada y movimiento cognitivo

Estado: aceptado para demo funcional local. Fecha: 6 de octubre de 2026.

## Decisión

Reemplazar los escenarios iniciales ilustrados por seis extractos grabados, agrupados en tres ejercicios. Mantener sesiones antiguas y motor puro. Cada señal apunta a un clip permitido y a un momento curado verificable; no se introduce visión artificial.

El operador reproduce un clip, revisa momentos, comprende contexto y registra su decisión. Las reglas dependen del número de fuentes disponibles, sin asumir dos. La recuperación rechaza medios/señales ajenos al catálogo. No se inventan probabilidades de detección.

Motion gratuito (paquete existente `framer-motion`) aporta entradas/salidas, reorganización `layout`, gestos, profundidad del carrusel y una cortina propia al navegar desde Home. No depende de Carousel/useCurtains comerciales de Motion+. El carrusel no avanza solo. Sin movimiento solicitado por persona o dispositivo, las transiciones espaciales desaparecen. Botones y pictogramas con palabras son la vía principal; arrastrar es opcional.

Ayuda lateral y mascota pueden ocultarse. Evidencia, pasos, estado y acciones se mantienen disponibles. K8 abre un diálogo breve en la pantalla actual. El diálogo nativo mantiene Escape y foco.

## Chat

Zod, límite del cuerpo, origen, cuota y contrato de salida permanecen en servidor. Antes de Groq, un filtro de ámbito redirige compras, recetas, entretenimiento y patrones de inyección. Intercambios rechazados y claves reconocibles no se reenvían en turnos posteriores. Las instrucciones conservan el ámbito y prohíben evadir vigilancia, identificar personas o inventar protocolos. El filtro léxico reduce abuso conocido; no garantiza protección universal ni sustituye límites distribuidos y autenticación operativa.

## Consecuencias

La demo completa un flujo con evidencia grabada y registro local. Llegadas/recepción son simuladas; no hay despacho; K8 no analiza video ni ve el caso abierto. Revisar derechos del material y datos visibles antes de difusión pública.

## Referencias de interacción

- [Genetec Security Desk](https://techdocs.genetec.com/r/en-US/Security-Center-User-Guide-5.12/About-Security-Desk): recorrido consistente por tareas, eventos y video.
- [Milestone XProtect Smart Client](https://doc.milestonesys.com/xprotect/xprotect-smart-client/2026r1/en/what-is-xprotect-smart-client-): seguimiento de eventos e investigación de evidencia.
- [Motion: layout](https://motion.dev/docs/react-layout-animations), [gestos](https://motion.dev/docs/react-drag), [accesibilidad](https://motion.dev/docs/react-accessibility): primitivas para una interacción propia.

Son referencias de diseño, no equivalencia funcional o certificación. La comprensión y carga cognitiva requieren validación con operadores.
