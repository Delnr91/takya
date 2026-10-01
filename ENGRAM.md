# ENGRAM de construcción — TAKYA

> Para quienes continúen el proyecto: lean este archivo antes de modificar la aplicación y actualícenlo al cerrar cada entrega. Registren el estado real y la verificación realizada.

## K8 interactivo y consulta documental — 30 de septiembre de 2026

- Se añadió **K8**, un perro robot dibujado con geometría 3D real en WebGL/Three.js dentro de la consola. Su pata delantera tiene un pivote propio y saluda al acercar el cursor, recibir foco y periódicamente. El botón flotante abre un diálogo centrado; el menú también ofrece la sección **K8 IA**. La imagen `public/brand/k8-robot.png` sirve solo de respaldo si WebGL falla.
- El panel de K8 presenta un campo orgánico de movimiento lento y respuestas locales desde seis entradas documentales curadas. Cada respuesta muestra la fuente; las preguntas sin tema cubierto reciben una abstención. No hay modelo generativo, RAG operativo, conexión a API, cámaras ni decisiones automáticas. Contrato Zod, recuperador y pruebas están en `src/features/demo/model/knowledge.ts` y `knowledge.test.ts`; la frontera futura se documentó en `docs/09_K8_CONOCIMIENTO_Y_ACCESIBILIDAD.md`.
- Se adaptaron pictogramas, estado visual orgánico y fondo de profundidad de 000h by Cojeev con atribución MIT conservada en `src/components/ui/COJEEV_NOTICE.txt`. La landing mantiene la composición y paleta V1; solo se añadieron un pictograma y un fondo de profundidad sutil. El dashboard usa vidrio translúcido con texto sólido. Ajustes añade alto contraste, movimiento apagado y fondo simple a los controles anteriores. La sesión vieja migra estas preferencias con valores seguros.
- **Verificación:** 13 pruebas del dominio y recuperación documental pasaron. En navegador se comprobó Landing → Login → Demo, la respuesta de K8 con fuente, el diálogo, la sección IA y el canvas 3D en móvil. A 320 y 390 px no hay desborde horizontal. Un fallo detectado al alternar «Sin movimiento» se corrigió: K8 mantiene el canvas y detiene la animación sin reiniciar WebGL. La ventana de K8 a 320 px se reorganizó para evitar texto recortado. TypeScript, lint y compilación de producción se ejecutan en el cierre de esta entrega.

## Recuperación del recorrido público — 30 de septiembre de 2026

Se aclaró una diferencia entre el repositorio y este espacio de trabajo: `main` aún conservaba `/login` como página provisional y `/demo` como la cuadrícula oscura antigua. La consola guiada ya existía localmente, pero no se había enviado a GitHub. Además, `localhost:3000` había dejado de servir al cerrarse el proceso local; se volvió a iniciar para comprobar el recorrido.

- Se mantuvo el diseño V1 de `/landing` y se añadió en su cabecera un acceso visible a `/login`: «Explorar demo» en escritorio y «Ver demo» en móvil. `/home` ya enlazaba a `/login` mediante «Consola Interactiva».
- El login de práctica ofrece Operador y Supervisión, nombre opcional y envío con Enter. La consola muestra un tablero distinto por rol; el acceso y el almacenamiento siguen siendo simulados en cliente.
- Se comprobó en navegador el recorrido Landing → Login → Demo para ambos perfiles con Enter, Home → Login, cierre de sesión y regreso a Login. A 320 px Landing no presenta desborde horizontal. La versión de producción compiló las cinco rutas; las nueve pruebas originales del motor y TypeScript pasaron. La extensión K8 y sus verificaciones se registran arriba.
- La versión anterior de `main` seguía mostrando el login provisional y el demo oscuro. Esta entrega incorpora el recorrido guiado y K8 en un mismo envío a `main`; el estado remoto se verifica después del push.

## Extensión local del 29 de septiembre de 2026 — dashboard y preparación IA-first

Esta extensión continúa sobre la consola de práctica local; **no se ha enviado a `main` ni desplegado**. El dashboard incorpora una lectura asistida del siguiente caso y una vista **Ajustes** con perfil, texto grande, paneles sólidos, ritmo de llegadas, exportación, reinicio y salida. En móvil, Ajustes está en la cabecera y el menú principal conserva cinco destinos amplios.

- **Salida de práctica:** el acceso inicial crea un marcador de navegación en `sessionStorage`. Cerrar pide confirmación, permite descargar el registro, borra ese marcador, el perfil y `takya.demo.v1`, y vuelve a `/login`. Abrir `/demo` sin marcador vuelve a `/login`. Esto sigue siendo un acceso simulado: los roles y el almacenamiento del navegador no ofrecen autenticación ni autorización real.
- **Frontera cognitiva:** `schemas/cognitive.ts` define una evaluación estructurada. `model/cognitive.ts` genera la versión local y valida que futuras respuestas citen avisos del caso. Los componentes de explicación y lectura asistida usan esa frontera. La arquitectura para un servicio IA real, alternativas y fases están en `docs/07_ARQUITECTURA_IA_FIRST.md`.
- **Seguridad:** `next.config.mjs` añade cabeceras `nosniff`, anti-iframe, política de referencia, restricciones de permisos y una CSP limitada para marcos/objetos/base. `docs/08_REVISION_SEGURIDAD.md` distingue lo protegido ahora de los requisitos para uso operativo: identidad institucional, permisos de servidor, privacidad, auditoría en servidor y evaluación de modelos.
- **Verificación:** la compilación de producción, TypeScript, lint y las nueve pruebas del motor pasan. En navegador se comprobó el acceso desde `/login`, los ajustes, el nombre visible, preferencias, el intervalo, la salida con borrado de los tres valores locales, el retorno de `/demo` a `/login` y las cabeceras HTTP, incluida la ausencia de `X-Powered-By`. A 320 × 568 se corrigió el tamaño de los botones del diálogo de salida y se verificó que caben completos; la vista de Ajustes no tiene desborde horizontal.

Para una plataforma IA-first se recomienda la opción **híbrida**: detección cercana a la fuente, agrupación temporal y explicación fundamentada desde un servicio protegido, con decisión humana final. No se conectaron cámaras, modelos ni servicios externos en esta entrega.

## Estado local al 29 de septiembre de 2026 — consola de práctica

Se construyó una nueva versión local de `/login` y `/demo`, preparada para revisión del equipo. **No se ha publicado ni enviado a `main` en esta entrega**: el commit público `d6e9c61` sigue siendo la V1 de landing. Las rutas `/` y `/landing`, así como el diseño de `/home`, conservan el recorrido público. Esta sección conserva el estado inicial de la consola; la extensión anterior describe el acceso de práctica actualizado.

### Qué hace la consola

- La entrada de `/login` permite elegir **Operador** o **Supervisión** y un nombre opcional, sin contraseña. El selector de rol dentro de la consola es parte de la práctica, no autenticación real.
- El inicio agrupa tres avisos por cada uno de los tres casos iniciales (9 avisos → 3 casos). El operador ve prioridad, escenario ilustrado, progreso de 0 a 3 y un siguiente caso recomendado.
- Cada revisión sigue **Observar → Comprender → Decidir**. Se deben marcar dos vistas disponibles; una tercera aparece sin conexión. La escena SVG tiene una secuencia ilustrada de 30 segundos y avisos asociados. La explicación separa señales, hechos observables e incertidumbre.
- Verificar, Escalar y Descartar requieren un motivo. Supervisión puede consultar evidencia y confirmar la recepción de una derivación; no puede tomar la decisión inicial. Una verificación permite solicitar apoyo después.
- La bandeja admite filtros de prioridad, estado y búsqueda reflejados en la URL. Las llegadas automáticas empiezan en pausa, admiten 15/30/60 segundos y paran en 30 casos. También se pueden crear casos manualmente.
- Los eventos se conservan en un historial local exportable a JSON; la sesión se recupera tras recargar. Hay controles de texto grande y menor transparencia, y la secuencia respeta movimiento reducido. El progreso reconoce tres revisiones completas sin valorar rapidez ni tipo de acción.

### Arquitectura y límites

- `src/features/demo/` separa contratos Zod, datos de escenarios, modelo de transiciones puro, hooks de navegador y componentes. La transición valida rol, estado y evidencia; el registro se agrega sin modificar entradas anteriores.
- Persistencia local versionada en `localStorage` (`takya.demo.v1`) y perfil temporal en `sessionStorage`. Los datos inválidos se descartan con recuperación controlada. No hay backend, CCTV, inferencia de IA ni despacho de recursos reales. Las escenas, alertas, confianza y cifras del tablero son ejemplos de esta práctica.
- Se documentaron el recorrido en `docs/06_DEMO_OPERATOR_FLOW.md` y las decisiones en `docs/adr/0004-demo-guided-practice.md`.

### Verificación de esta entrega

- `npm run build`: correcto con Next.js 16.3.6; `/`, `/home`, `/landing`, `/login` y `/demo` se generan como rutas estáticas.
- `npm run typecheck`: correcto. `npm run lint` y `npm run test:demo`: comprobados al cerrar esta entrega; las pruebas del dominio cubren los tres resultados, roles, derivación, recepción, recuperación y límite de casos.
- Navegador: recorrido de operador desde las dos vistas hasta Escalar con motivo; recepción desde Supervisión y persistencia tras recargar. Acceso simulado y consola revisados a 320 × 568; a 390 × 844 se revisó la bandeja. En producción, 320 px con texto grande mantuvo `scrollWidth` igual a `clientWidth` (305 px disponibles por la barra vertical del navegador). Filtros de la bandeja probados con URL `?view=cases&severity=INFO` y dos resultados coherentes. Un caso nuevo aumentó el total de 3 a 4.
- `git diff --check`: sin errores. `rg` no encontró `any` en la implementación de demo.

### Pendientes de producto

- Esta es una práctica visual para validación conceptual. Antes de tratarla como producto operativo se necesitan pruebas con operadores, fuentes de video reales, control de acceso, backend y evaluación de modelos; ninguno se simula como integración real.
- La V1 pública todavía muestra en su README original que demo es la siguiente entrega. El README local ya explica cómo recorrer la nueva consola. Publicar el nuevo código requiere una decisión de versión aparte para no cambiar inadvertidamente la landing presentada en `main`.

## Estado al 28 de septiembre de 2026

La V1 pública está preparada para presentarse desde `/landing` y para que el equipo la despliegue manualmente en Vercel desde `main`. El proyecto usa Next.js 16 App Router, Tailwind, TypeScript estricto y componentes organizados por feature. No existe backend ni conexión a cámaras reales.

| Ruta | Estado |
| --- | --- |
| `/` | Redirige a `/landing` para la presentación pública. |
| `/landing` | Vitrina institucional V1. |
| `/home` | Entrada audiovisual disponible; adaptada a móvil y horizontal sin desplazamiento. |
| `/login` y `/demo` | Código de simulación existente; el recorrido público de esta entrega no depende de estas rutas. |

## Diseño y contenido entregados

- Se conservó la composición editorial y el glassmorphism de la V1 de GitHub. El titular escalonado «Comprender antes de actuar» usa naranja en «actuar».
- La sección «Más cámaras no significan más claridad» incorpora cuatro tarjetas asimétricas. Los 130 dispositivos corresponden al antecedente municipal; 1.245 es una proyección regional; el 50 % es una cifra de contexto citada en el PRD. Ninguna se presenta como resultado medido por TAKYA.
- La imagen original `/background2.png` tiene un movimiento suave por puntero y parallax al hacer scroll. La capa visual queda recortada para que su desplazamiento no añada espacio después del footer. El fondo exterior de la landing es marfil y su desplazamiento tiene una sola barra, oculta visualmente.
- En móvil, el encabezado de la landing queda en la parte superior del contenido para no cubrir textos al bajar. El botón de WhatsApp se centra verticalmente junto al texto en escritorio y cabe en 320 px.
- `/home` distribuye logo, titular y tarjetas dentro del alto visible. En pantallas horizontales cortas usa dos columnas; mantiene el video de fondo y el diseño original en escritorio.
- `README.md` está en español, muestra el logo, ofrece un recorrido del producto y explica el despliegue manual.

## Verificación de esta entrega

- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm run build`: correcto; `/`, `/landing`, `/home`, `/login` y `/demo` se generan como rutas estáticas.
- Navegador local: `/home` sin scroll ni desborde horizontal en 320 × 480, 320 × 568, 390 × 844, 667 × 375 y 1024 × 600. Landing revisada en 320 × 568 y 1280 × 800; footer y final del documento coinciden después del parallax, sin zona negra adicional.
- `npm run format:check` todavía informa formato heredado en 16 archivos. Es una deuda de estilo existente y no impide la compilación. Evitar reformatear todo el proyecto al hacer cambios visuales puntuales.

## Pendientes conocidos

- El enlace de WhatsApp conserva el número de ejemplo de la V1 (`56900000000`); reemplazarlo por un contacto real antes de usarlo comercialmente.
- El equipo hará el despliegue manual en Vercel desde el commit nuevo de `main`. Si se intentó desplegar antes de este commit, revisar el final de los registros y volver a desplegar el commit actualizado.
- Login y demo quedan para la siguiente entrega funcional; no anunciar integración con cámaras o IA real.
