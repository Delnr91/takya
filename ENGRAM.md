# ENGRAM de construcción — TAKYA

> Para quienes continúen el proyecto: lean este archivo antes de modificar la aplicación y actualícenlo al cerrar cada entrega. Registren el estado real y la verificación realizada.

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
