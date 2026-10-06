# ENGRAM de construcción — TAKYA

> Para quienes continúen el proyecto: lean este archivo antes de modificar la aplicación y actualícenlo al cerrar cada entrega. Registren el estado real y la verificación realizada.

## K8 rápido, pictogramas y continuidad de la práctica — 6 de octubre de 2026

- La mascota abre `QuickCompanion`, una ventana independiente del chat amplio. Presenta el organismo fluido centrado, una respuesta breve y una línea para consultar. Enviar, Hablar, Guíame y Escuchar combinan pictogramas y palabras. El organismo cambia suavemente con los estados de consulta, escucha y lectura; respeta movimiento reducido. No se muestra una copia en miniatura del dashboard ni archivos MD como respuesta.
- La letra principal de la consola y de la consulta parte de 18 px. Texto grande permite ampliar más. El menú móvil distribuye seis pictogramas con etiquetas legibles; Observar, Comprender y Decidir se apilan. Los controles de K8 tienen al menos 48 px. El foco pasa al contenido al cambiar de paso o registrar un resultado, y Escape devuelve el foco a la mascota.
- Se incorporó dictado mediante Web Speech, activado explícitamente con Hablar y limitado a 20 segundos. Terminar permite revisar el texto antes de Enviar; no hay envío automático de voz ni decisiones por voz. Escuchar/Detener controla la lectura. Cerrar K8 cancela reconocimiento, lectura y solicitud pendientes. El soporte depende del navegador; se conserva escritura cuando falta o falla dictado. No se ha probado transcripción con un micrófono físico ni se afirma una conversación de audio continua con Groq.
- La política del navegador permite micrófono del propio origen solo en `/demo`, sujeto al permiso del usuario. Las rutas públicas lo bloquean; cámara y geolocalización permanecen bloqueadas. La información de privacidad explica que Web Speech puede utilizar el servicio externo del navegador. TAKYA no almacena audio. No se modificaron ni incluyeron claves o archivos de entorno.
- Inicio, Casos, Cámaras e Historial comparten el identificador del caso. Cámaras ofrece Elige el caso y abre exactamente el registro elegido. Volver a la evidencia abre Observar aunque la decisión ya esté registrada, sin reescribirla. Atrás/Adelante recupera el caso de la URL. Comparar fuentes en Inicio sigue el próximo caso recomendado después de completar una revisión. Se conserva el historial y la compatibilidad con sesiones ilustradas.
- Guíame muestra de inmediato un primer paso curado según sección, rol y disponibilidad de casos/derivaciones, con nombres reales de los controles. El paso queda en el contexto de conversación para continuar preguntando. Se añadió una guía MD de navegación para las consultas abiertas; estas siguen usando Groq en servidor y no ven videos ni el caso abierto. Las pruebas cubren recuperación contextual y ayuda de Inicio para Supervisión o práctica completada. README y recorrido funcional explican voz, accesibilidad y navegación.
- Verificación: 28 pruebas de dominio/chat, ESLint y compilación de producción correctos. Se recorrieron tres clips del caso de fuego, comprensión, derivación con motivo, recepción por Supervisión, historial, retorno a Observar y recuperación tras recargar. Atrás restauró el caso anterior después de cambiarlo en Cámaras. Se comprobó una respuesta real de K8 para Historial, controles de lectura, Escape y cabeceras de permisos. Navegador: 320 × 568, 390 × 844, 667 × 375, 768 × 1024 y 1280 × 800; sin desborde horizontal, consulta ajustada a móvil/horizontal y letra principal de 18 px. Las capturas locales quedan en .qa/k8-quick-mobile.jpg y .qa/k8-quick-final.jpg. El dictado físico y la validación con operadores siguen pendientes.

## Demo funcional con evidencia grabada y Motion — 6 de octubre de 2026

- Se prepararon seis extractos de los videos aportados: dos de actividad junto a residuos, tres de fuego/respuesta/humo y uno de un camión en un camino. Se retiraron entrevistas, audio y zonas con gráfica televisiva; los originales permanecen intactos en `.media-source/`, ignorada por Git. Los derivados H.264, 24 fps, con `faststart`, suman aproximadamente 8 MB en `public/videos/incidents/`. Plan, manifiesto y trazabilidad están en `docs/media/`; los scripts permiten reproducir los cortes.
- La consola usa los videos en tres casos y conserva `Observar → Comprender → Decidir`. El reproductor incluye momentos, señales preparadas, controles nativos, pausa y manejo de errores. Cada registro disponible debe revisarse antes de avanzar. El operador decide y registra un motivo; Supervisión recibe derivaciones y el historial conserva el recorrido. Las señales y prioridades son curadas, no detección automática sobre video ni despacho real. Las sesiones ilustradas anteriores siguen funcionando y ofrecen cargar los nuevos casos mediante un reinicio confirmado.
- Se añadió Lista/Carrusel con profundidad, animación, navegación con botones y flechas; el arrastre es opcional. Ocultar ayuda lateral reorganiza el espacio; la cabecera permite ocultar/mostrar K8 y guarda esa preferencia. Las transiciones usan las primitivas gratuitas de Motion ya instaladas. No se incorporaron componentes pagos de Motion+.
- K8 abre una consulta breve y centrada, conservando la sección actual. El chat responde con Groq desde `/api/k8/chat`, recuperando guías curadas de `docs/knowledge/`; los nombres de archivos no forman parte de las respuestas. La clave permanece en variables privadas del servidor, fuera de Git y del navegador. La validación limita tamaño, caracteres, origen y ritmo; redirige consultas ajenas, intentos de cambiar instrucciones y solicitudes para evadir vigilancia. Los intercambios rechazados se excluyen del historial enviado al proveedor. Son controles para esta demo, no garantía absoluta frente a ataques ni autorización operativa.
- Las dos tarjetas de `/home` ejecutan una cortina `wipe` antes de abrir `/landing` o `/login`. Se preservan la composición V1 y los enlaces normales para abrir otra pestaña. La preferencia de movimiento reducido omite la cortina y mantiene acceso directo.
- Accesibilidad: controles con texto y pictogramas, foco visible, diálogo nativo con Escape, ayudas de lectura, texto grande, alto contraste, paneles sólidos y movimiento apagado. Se corrigió y comprobó en producción el retorno de foco a «Conversar con K8» al cerrar con Escape. Video y carrusel se accionan manualmente. El contenido esencial se mantiene en HTML y no depende de WebGL.
- Verificación: 24 pruebas del dominio y del chat, TypeScript, ESLint y compilación de producción aprobados. Se comprobó en navegador la reproducción, saltos de momentos, bloqueo de avance sin revisión, decisión, recepción de Supervisión y persistencia tras recargar. Groq respondió con una instrucción breve y el filtro redirigió una consulta de compras. Se revisaron carrusel, consulta rápida, ocultación de K8, ayuda lateral y las dos cortinas. A 320 × 568, 390 × 844 y 768 × 1024 no se observó desborde horizontal; `/home` ocupa una sola pantalla a 320 × 568. No se afirma certificación WCAG ni análisis visual por IA.
- Documentación actualizada: README en español, flujo del operador, corpus del chat, guía de medios y ADR 0005. `docs/09_K8_CONOCIMIENTO_Y_ACCESIBILIDAD.md` conserva la implementación histórica e indica dónde consultar el estado actual.

## Presencia orgánica sin rostro — V2.0.2 · 1 de octubre de 2026

- Se retiró la carita de `CojeevAgentState` del panel de consulta IA. La presencia visual pasa a ser una sola composición centrada, con tres membranas translúcidas, bordes nacarados y partículas suaves. El título y la explicación tienen su propio espacio debajo del organismo, tanto en la sección como en el diálogo.
- Los shaders locales de `model/fluidShaders.ts` deforman las membranas en GPU y producen luz suave en sus pliegues. La forma respira, rota lentamente y reacciona al puntero. Se eliminó el anillo rígido de la versión anterior. Sin nuevas dependencias, texturas externas ni servicios.
- Se mantiene «Sin movimiento» y la preferencia de movimiento reducido; en ese modo se dibuja una imagen estática. El efecto pausa fuera de pantalla y en pestañas ocultas, limita la resolución y libera geometría y materiales al desmontarse.
- Verificación visual en escritorio y a 320 × 568 px: organismo centrado, sin carita, texto separado, diálogo sin desborde horizontal y cierre con Escape. Sin errores de consola durante la revisión. TypeScript, ESLint de los archivos modificados y build de producción aprobados.

## K8 expresivo — V2.0.1 · 1 de octubre de 2026

- Se modeló una cara más cercana al prototipo: ojos grandes con iris naranja y reflejos, contornos marfil, hocico dividido, nariz brillante y una pequeña sonrisa. Las orejas pasan de conos a piezas redondeadas con panel interior y sensores. Es una interpretación procedural en Three.js, no una réplica detallada del PNG ni un GLB importado.
- Los ojos parpadean durante 240 ms con pausas variables de 2,8 a 5,6 segundos. K8 respira suavemente e inclina la cabeza al saludar. «Sin movimiento» y la preferencia del dispositivo mantienen los ojos abiertos y desactivan los gestos ambientales.
- TypeScript, ESLint del componente y build de producción aprobados. Se revisó la nueva cara en navegador y a 320 × 568 px: botón de 108 px dentro de la pantalla y sin desborde horizontal; no se registraron errores de consola. No se añadieron dependencias ni servicios externos. Se conserva la etiqueta `v2.0.0`; esta mejora se identifica como `v2.0.1`.

## V2 estable — 1 de octubre de 2026

- K8 flota sin tarjeta y aumenta su tamaño, con ajuste específico para móvil. Sigue el puntero con la cabeza, anima orejas, cola y pata. Arrastrar gira el modelo sin abrir accidentalmente el chat; las flechas del teclado también permiten girarlo y Enter abre la consulta.
- La cabecera de la consulta incorpora geometría WebGL que se deforma lentamente, iluminación verde y naranja y un anillo 3D. Responde al puntero y se adapta al tamaño del contenedor. Three.js se carga bajo demanda; la escena libera recursos al desmontarse y pausa cuando está fuera de pantalla o la pestaña está oculta.
- Los efectos respetan «Sin movimiento» y la preferencia del sistema. Se conserva el foco visible, nombre accesible del botón, diálogo con Escape, formulario etiquetado y anuncio de respuestas. La imagen y el fondo CSS sirven de respaldo cuando WebGL no está disponible. Las respuestas siguen siendo una consulta documental local, sin API de IA.
- Verificación: TypeScript, ESLint de los tres componentes y build de producción aprobados. Navegador: login, apertura de K8, respuesta con fuente, arrastre sin apertura, flechas y Enter, Escape y alternancia de «Sin movimiento» sin errores de consola. Diálogo sin desborde horizontal a 320 × 568 y 768 × 1024; revisión visual en escritorio. No se afirma certificación WCAG ni pruebas en todos los dispositivos físicos.
- Entrega identificada con la etiqueta Git `v2.0.0`; corresponde a la V2 estable de demostración.

## K8 interactivo y consulta documental — 30 de septiembre de 2026

- Se añadió **K8**, un perro robot dibujado con geometría 3D real en WebGL/Three.js dentro de la consola. Su pata delantera tiene un pivote propio y saluda al acercar el cursor, recibir foco y periódicamente. El botón flotante abre un diálogo centrado; el menú también ofrece la sección **K8 IA**. La imagen `public/brand/k8-robot.png` sirve solo de respaldo si WebGL falla.
- El panel de K8 presenta un campo orgánico de movimiento lento y respuestas locales desde seis entradas documentales curadas. Cada respuesta muestra la fuente; las preguntas sin tema cubierto reciben una abstención. No hay modelo generativo, RAG operativo, conexión a API, cámaras ni decisiones automáticas. Contrato Zod, recuperador y pruebas están en `src/features/demo/model/knowledge.ts` y `knowledge.test.ts`; la frontera futura se documentó en `docs/09_K8_CONOCIMIENTO_Y_ACCESIBILIDAD.md`.
- Se adaptaron pictogramas, estado visual orgánico y fondo de profundidad de 000h by Cojeev con atribución MIT conservada en `src/components/ui/COJEEV_NOTICE.txt`. La landing mantiene la composición y paleta V1; solo se añadieron un pictograma y un fondo de profundidad sutil. El dashboard usa vidrio translúcido con texto sólido. Ajustes añade alto contraste, movimiento apagado y fondo simple a los controles anteriores. La sesión vieja migra estas preferencias con valores seguros.
- **Verificación:** 13 pruebas del dominio y recuperación documental pasaron. En navegador se comprobó Landing → Login → Demo, la respuesta de K8 con fuente, el diálogo, la sección IA y el canvas 3D en móvil. A 320 y 390 px no hay desborde horizontal. Un fallo detectado al alternar «Sin movimiento» se corrigió: K8 mantiene el canvas y detiene la animación sin reiniciar WebGL. La ventana de K8 a 320 px se reorganizó para evitar texto recortado. TypeScript, ESLint enfocado en los archivos modificados y la compilación de producción pasaron; `git diff --cached --check` no encontró errores.

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

| Ruta               | Estado                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| `/`                | Redirige a `/landing` para la presentación pública.                                             |
| `/landing`         | Vitrina institucional V1.                                                                       |
| `/home`            | Entrada audiovisual disponible; adaptada a móvil y horizontal sin desplazamiento.               |
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
