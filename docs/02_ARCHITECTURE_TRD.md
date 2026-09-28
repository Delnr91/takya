# TAKYA - Technical Requirements & Architecture (TRD)

## 1. Stack Tecnológico Base
* **Framework:** Next.js 14+ (App Router).
* **Lenguaje:** TypeScript v5+ (Estricto: `strict: true`, `noUncheckedIndexedAccess: true`). Prohibido el uso de `any`.
* **Estilizado:** Tailwind CSS + Variables semánticas.
* **Componentes UI:** Shadcn UI (basado en Radix UI) + Lucide React.
* **Animaciones:** Framer Motion (uso funcional, respetando `prefers-reduced-motion`).
* **Validación:** Zod.

## 2. Patrones de Arquitectura

### 2.1 Feature-Sliced Design (Colocación por Dominio)
El código se organiza por módulos funcionales dentro de `src/features`, no por tipo de archivo técnico.
```
src/
  features/
    home/         (Componentes, hooks, types específicos de /home)
    landing/      (Componentes, hooks, schemas específicos de /landing)
    demo/         (Lógica de incidentes, visor de video, auditoría, estado)
    shared/       (Navbar, Footer, componentes transversales)
  components/ui/  (Primitivas de UI como botones, inputs, modales)
```

### 2.2 Patrón de Máquina de Estados (State Machine)
El ciclo de vida de un incidente en `/demo` es estricto:
`PENDING` -> `IN_REVIEW` -> `VERIFIED` | `ESCALATED` | `DISMISSED`.
Ninguna acción puede saltarse pasos (ej. no se puede escalar sin antes revisar).

### 2.3 Motor de Simulación Orientado a Eventos (Simulation Ticker)
Para el Demo Day, `features/demo/hooks/useSimulationTicker.ts` generará eventos de alertas e incidentes a intervalos configurables, inyectándolos al estado de React para simular tráfico en vivo.

### 2.4 Audit Trail Pattern
Toda acción del operador despacha una entrada inmutable al logger de auditoría. Se persistirá temporalmente en `localStorage` o `sessionStorage` para mantener contexto tras recargas de página durante las presentaciones.

## 3. Modelos de Datos (Interfaces principales)
* `Alert`: Detección individual de una cámara (ruido).
* `Incident`: Agrupación lógica de varias `Alert` (lo que ve el operador). Atributos: `id`, `severity`, `status`, `xai_reasoning`, `cameras`.
* `AuditLogEntry`: Registro inmutable. Atributos: `id`, `timestamp`, `action_type`, `incident_id`, `operator_notes`.
