# TAKYA

MVP interactivo para el Demo Day del Programa Nómada UCN. El proyecto usa Next.js App Router, React, TypeScript estricto y Tailwind CSS. En esta fase, la consola y el acceso serán simulados en el cliente, sin backend ni cámaras reales.

## Estado

Sprint 0 completo. Sprint 1 incluye el enrutamiento físico de `/home`, `/landing`, `/login` y `/demo`, la redirección de `/` a `/home` y el splash con video local, poster, control de reproducción y dos accesos. Las otras tres rutas contienen páginas base identificadas como en construcción; sus funciones se implementarán en los siguientes sprints.

El PRD agrupa el producto en tres features: entrada, vitrina y consola. La experiencia tendrá cuatro rutas: `/home`, `/landing`, `/login` y `/demo`; `/login` es la barrera visual de acceso a la consola.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Verificación

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Organización

- `docs/`: PRD, arquitectura, diseño, ADR y Plan Maestro.
- `public/brand/`: identidad oficial SVG, PNG y favicons.
- `public/referencias/`: referencias visuales; las propuestas de fondo blanco guían la landing.
- `src/app/`: rutas y layout de Next.js.
- `src/features/`: dominios `home`, `landing`, `login`, `demo` y `shared`.
- `src/components/ui/`: primitivas reutilizables.
- `src/lib/`: utilidades transversales.

La implementación seguirá el ciclo estricto de incidentes y registrará las decisiones del operador en auditoría local. Todo dato de la consola se presentará como simulación para validación conceptual.
