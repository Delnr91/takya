# TAKYA - Plan de Implementación (Roadmap)

> **Documento histórico (19-10-2026).** Se conserva como registro; no usar para construir ni para el pitch. Fuente vigente: [documento maestro end-to-end](maestros/DOCUMENTO_MAESTRO_TAKYA_E2E.md) y [plan maestro de la demo final](maestros/PLAN_MAESTRO_DEMO_FINAL.md). Clasificación en la [auditoría documental](estrategia/13_AUDITORIA_PALANTIR_ARQUITECTURA_Y_DOCS.md).


## Sprint 0: Scaffolding y Preparación (Fundamentos)
- [ ] Iniciar proyecto Next.js 14 App Router.
- [ ] Limpiar código base, configurar ESLint y Prettier.
- [ ] Configurar TypeScript modo estricto (`noUncheckedIndexedAccess: true`).
- [ ] Configurar variables CSS y Tailwind con los Design Tokens ("Structural Silence").
- [ ] Copiar los logos vectoriales SVG a la carpeta `public/brand/`.
- [ ] Instalar dependencias clave: `lucide-react`, `framer-motion`, `zod`, `clsx`, `tailwind-merge`.

## Sprint 1: Ruta `/home` (Entrada Inmersiva)
- [ ] Desarrollar `InteractiveVideoBg` con video/motion de fondo y fallback a imagen estática.
- [ ] Implementar capa de superposición (overlay) `#0C1410` con gradiente.
- [ ] Construir el `DualBentoCTA` (Tarjetas de bifurcación visuales hacia `/landing` y `/demo`).
- [ ] Testear responsividad y accesibilidad de contrastes.

## Sprint 2: Ruta `/landing` (Vitrina Institucional)
- [ ] Implementar `Navbar` minimalista con logo SVG.
- [ ] Desarrollar `HeroSection` con tipografía Sora y gran impacto.
- [ ] Construir `ProblemBento` (Métricas de Antofagasta y fatiga cognitiva).
- [ ] Construir componente `FiveStepsFlow` para explicar la solución de forma pedagógica.
- [ ] Construir `TeamSection` (Identidad UCN y roles).
- [ ] Formulario de contacto validado con Zod y Footer.

## Sprint 3: Ruta `/demo` (Consola Interactiva)
- [ ] **Data Layer:** Implementar esquemas Zod de `Incident`, `Alert`, y `AuditLog`.
- [ ] **State & Engine:** Crear `useSimulationTicker` (generador de datos simulados) y la máquina de estados.
- [ ] **UI - Layout:** Dashboard layout con `TopBar` (Métricas).
- [ ] **UI - Left Panel:** `IncidentFeed` filtrable y ordenable.
- [ ] **UI - Center Panel:** `VideoSimulator` (Cámara simulada con bounding boxes y timeline).
- [ ] **UI - Right Panel:** `XaiExplainer` (Justificación de IA) + `ActionBar` (Verificar/Escalar/Descartar).
- [ ] **UI - Audit:** Drawer/Modal para visualizar el `AuditTrail`.

## Sprint 4: Pulido Demo Day
- [ ] Pruebas cruzadas (Desktop / Tablet / Mobile).
- [ ] Revisión del checklist de despliegue y limpieza de warnings/errores de consola.
- [ ] Optimización de assets (Next/Image, videos comprimidos).
