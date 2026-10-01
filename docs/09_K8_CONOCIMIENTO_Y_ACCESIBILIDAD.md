# K8: acompañante documental de la práctica

## Qué hace hoy

K8 responde preguntas sobre el funcionamiento de TAKYA con contenido curado en `src/features/demo/data/knowledge.ts`. Un recuperador léxico local compara palabras de la pregunta con títulos, términos y resúmenes y muestra la respuesta preescrita y su fuente. Si no existe coincidencia, se abstiene. No usa un modelo generativo, API, búsqueda externa ni video real. No toma decisiones sobre casos.

Las respuestas se derivan de `docs/06_DEMO_OPERATOR_FLOW.md` y `docs/07_ARQUITECTURA_IA_FIRST.md`. Cada entrada lleva un identificador y una referencia legible. Antes de ampliar el corpus, el equipo debe revisar la exactitud de la respuesta y actualizar ambos lugares. La prueba `knowledge.test.ts` cubre fuente, abstención y límite de entrada.

## Cómo convertirlo en RAG operativo

El corpus actual es pequeño y está incluido en el cliente para una demostración sin backend. No debe llamarse RAG con un modelo en producción. Para una futura implementación RAG se necesita un servicio protegido que indexe documentos autorizados y versionados, filtre por rol y municipio, devuelva fragmentos y citas verificables, registre consultas según una política de datos, aplique abstención y evalúe respuestas con operadores. El modelo y la base de vectores permanecerían fuera del navegador. La decisión y el despacho seguirían siendo humanos.

## Personaje e interacción

`K8Mascot.tsx` construye en Three.js un perro robot de geometría WebGL con pata delantera articulada, sensores, ojos y luz de estado. La pata saluda al acercar el puntero, al recibir foco de teclado y de forma discreta en reposo. El botón abre un diálogo centrado con la consulta documental; también existe una sección K8 IA en el menú. La ilustración `public/brand/k8-robot.png` es únicamente respaldo cuando WebGL no está disponible.

## Accesibilidad y rendimiento

- El botón tiene nombre accesible y admite foco/activación con teclado. El diálogo nativo gestiona Escape y retorno de foco.
- En Ajustes: texto grande, paneles sólidos, alto contraste, sin movimiento y fondo simple. Las preferencias locales antiguas reciben valores por defecto al restaurarse.
- Se respeta `prefers-reduced-motion`; en ese caso la animación de K8 y el fondo se detienen. El personaje mantiene su presencia y la consulta funciona sin animación.
- La escena WebGL se carga bajo demanda en el navegador, se pausa cuando la pestaña está oculta y libera geometrías, materiales y contexto al desmontarse. El contenido esencial siempre es texto HTML, nunca depende del canvas.
- Los pictogramas, el estado orgánico y el campo de profundidad se adaptaron de [000h by Cojeev](https://000h.cojeev.com/) con atribución MIT en `src/components/ui/COJEEV_NOTICE.txt`. La landing conserva composición y paleta V1; usa únicamente un campo de profundidad sutil y un pictograma.
