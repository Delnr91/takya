---
name: takya-build
description: Implementar incrementos autorizados del demo TAKYA con ingesta de video, revisión humana y evidencia verificable. Usar al construir o corregir TAKYA; no convierte pedidos de análisis en permiso de implementación.
---

# Construir TAKYA

Localiza la raíz de TAKYA por `package.json` y `src/features/demo`. Lee AGENTS aplicables y el índice `docs/estrategia/00_INDICE_Y_ESTADO.md`. Lee solo el documento técnico pertinente al incremento; para backend usa 02, para evidencia 03 y para K8 04.

Define resultado observable y prueba de aceptación antes de editar. Conserva cambios existentes. Si no hay Git, usa un inventario de archivos; no inicialices ni publiques por iniciativa propia. Lee la guía instalada de Next antes de escribir Next.js.

Mantén el alcance del demo: un archivo autorizado, una zona, un candidato definido, sin BD. Usa fuente preservada y derivados distintos, estado efímero explícito y recursos acotados. Conserva la práctica existente; su esquema exige dos cámaras y no debe forzarse inventando una segunda fuente para el nuevo análisis.

Valida permisos por recurso y contratos en servidor. Aísla decodificación/inferencia en worker sin privilegios ni red; comandos por argumentos sin shell. Modela cancelación, fallos y revisión esperada. No conviertas error de análisis en «sin candidatos».

Prueba el comportamiento nuevo, límites y regresión relevante. Para evidencia, incluye paquete alterado o incompleto y referencia confiable; para IA, indisponibilidad y afirmaciones sin soporte. No uses llamadas reales ni datos privados como fixture sin autorización.

K8 orienta y no ejecuta decisiones, borrados o despacho. Un score de detector no es probabilidad de delito. Un hash no acredita autenticidad anterior a la recepción. No anuncies custodia durable con estado temporal.

Cierra con cambios, comandos/resultados y límites pendientes. Si el alcance es solo documentación, entrega documentación. Esta skill no concede permisos de instalación, publicación o acceso a servicios externos.
