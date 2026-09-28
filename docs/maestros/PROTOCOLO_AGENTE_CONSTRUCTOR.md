---
tipo: protocolo_operativo
nombre: Protocolo del Agente Constructor Lattice & TAKYA
version: 1.0.0
actualizado: 2026-09-28
origen: "C:\\Users\\invde\\Desktop\\Personal\\03_SOFTWARE_ENGINEERING"
proposito: "Instrucción maestra y manual de ingeniería para el agente constructor al diseñar, programar y desplegar software"
---

# Protocolo del Agente Constructor · Sistema Operativo de Software Lattice

> **Propósito para el Agente Constructor:**  
> Este documento condensa el conocimiento del Segundo Cerebro del autor (`03_SOFTWARE_ENGINEERING` y `02_STARTUP`). Funciona como el estándar rector de cómo se diseña, programa, prueba y despliega software: **disciplina grado Silicon Valley siendo un único desarrollador (Solo-Dev)**.

---

## 1. Instrucción Maestra para el Asistente / Agente Constructor

1. **Criterio antes que código:** Comprende a fondo el problema de negocio y los requisitos antes de proponer arquitectura o teclear código.
2. **Menor complejidad suficiente:** Construye el entregable solicitado con el menor nivel de complejidad que satisfaga el caso (KISS + YAGNI extremo).
3. **No inventar entorno:** Trabaja sobre el código, dependencias y repositorios existentes en el proyecto; no inventes dependencias ni despliegues fantasma.
4. **Verificación con evidencia:** Cada cambio debe tener pruebas demostrables. Un checklist marcado sin evidencia no demuestra funcionamiento ni seguridad.
5. **Persistencia del aprendizaje:** Si una tarea arroja una lección generalizable, documéntala en el ADR o playbook correspondiente.

---

## 2. Filosofía y Estética: "Structural Silence"

* **El software es topología y sistema, no decoración:** Espacio calculado, cuadrícula rigurosa, sustracción sobre adición. Quitar todo lo superfluo.
* **UI/UX Moderna:**
  * Bento Grids y layout modular.
  * Dark glassmorphism, micro-interacciones sutiles con propósito.
  * Mobile-first y dark mode natural.
  * Tipografía clínica/técnica (Inter, Plus Jakarta Sans, JetBrains Mono, Sora).
  * Paleta con propósito: Fondo profundo (#0A0A0A / #0C1410), superficies marfil/cálidas (#F4F1EA), acento sobrio (cyan calibrado #00A3C4 o verde bosque #1B3B2B). El color no se "aplica", se **coloca**.

---

## 3. Flujo End-to-End de Construcción

```
Problema / Cliente
   ↓
[01. Discovery & Validación] ──► Regla de oro: 0 líneas de código sin validación
   ↓
[00. Roles & Cadencia]       ──► Trinidad PO - Tech Lead - Scrum Master en 1 persona
   ↓
[08. Decisiones ADR]         ──► Registrar elecciones técnicas en docs/adr/
   ↓
[02. Frontend] + [03. Backend]──► Next.js 14+ TS estricto + FastAPI / DDD
   ↓
[06. Observabilidad]         ──► Traces, métricas RED y logs JSON estructurados desde día 1
   ↓
[04. Seguridad & Compliance] ──► STRIDE, OWASP, JWT+Refresh+2FA, RLS, Ley 19.628 / GDPR
   ↓
[05. QA & CI/CD]             ──► Pirámide 70/20/10 + Docker multi-stage + Pre-Launch Check
   ↓
[09. Feature Flags]          ──► Deploy continuo ≠ Release gradual (Canary + Kill switches)
   ↓
[10. FinOps & Costos]        ──► Tagging total + seguimiento de costo por feature y LLM
```

---

## 4. Estándares Técnicos por Disciplina

### A. Discovery y Definición de Producto (Playbook 01)
* **Regla sagrada:** Ninguna línea de código antes de validar el dolor con usuarios reales.
* **Formulación del problema (YC):** *"El [Usuario] pierde [Tiempo/Dinero] al intentar [Tarea] debido a [Obstáculo]"*.
* **Scope MVP estricto (Máximo 3 features):**
  1. *Feature 1 (Core):* Resuelve el dolor principal.
  2. *Feature 2 (Diferencial):* Por qué eligen esta solución.
  3. *Feature 3 (Gancho):* Elemento interactivo / "wow" visual.
  * Toda feature 4+ queda diferida a *Fase 2 (Out of Scope)*.
* **Entregable:** PRD (Product Requirements Document) de 1 página.

### B. Roles y Cadencia Solo-Dev (Playbook 00)
* **Trinidad:** Escribe la voz del cliente como si fueras un PO externo; actúa como Tech Lead defendiendo calidad y como Scrum Master protegiendo el tiempo.
* **Cadencia:**
  * Dailies de 10 min en checklist individual.
  * Auto-review con 24 horas de reposo mental entre push y merge para features no urgentes.
  * **20% del sprint reservado para refactor y mitigación de deuda técnica**.

### C. Registro de Decisiones de Arquitectura — ADRs (Playbook 08)
* Ubicación: `docs/adr/NNNN-[titulo-en-kebab-case].md`.
* **Inmutabilidad:** Un ADR aceptado (`accepted`) jamás se sobrescribe. Si la tecnología o el enfoque cambian, se redacta un nuevo ADR marcando el anterior como `superseded by ADR-XXXX`.
* Aplica a: Frameworks, bases de datos, patrones estructurales, estrategia de auth, deploy targets y dependencias críticas.

### D. Frontend Architecture (Playbook 02)
* **Stack:** Next.js 14+ (App Router, Server/Client components), React 18+, TypeScript en modo estricto.
* **TypeScript no negociable:**
  * `"strict": true`, `"noUncheckedIndexedAccess": true`.
  * **Prohibido el uso de `any`**. Usar `unknown` con type guards o validación Zod.
* **Estructura por Features (Colocación por dominio):**
  ```text
  src/
  ├── features/
  │   ├── [nombre-feature]/
  │   │   ├── components/
  │   │   ├── hooks/
  │   │   ├── api/
  │   │   └── schemas/
  ├── components/ui/       # Primitivas reutilizables (Shadcn/ui)
  ├── lib/
  └── app/                 # Rutas App Router Next.js
  ```
* **Jerarquía de Estado:**
  1. *URL state* primero (`useSearchParams`).
  2. *Server state* (TanStack React Query con `useQuery`/`useMutation`).
  3. *Local state* (`useState` puntual).
  4. *Global state* (Zustand únicamente si 2 o más componentes desconectados lo comparten).
* **Validación en Frontera:** Zod parseando contratos de API antes de entrar a la UI; inferencia de tipos TS desde Zod. Formularios con React Hook Form + Zod resolver.
* **Performance Web Vitals:** LCP <2.5s, FID/INP <200ms, CLS <0.1. Uso exclusivo de `next/image` y `next/font`.

### E. Backend Architecture & Datos (Playbook 03)
* **Stack:** FastAPI (Python 3.11+) como opción principal, o SpringBoot (Java 17+).
* **Domain-Driven Design (DDD / Clean Architecture):**
  * `domain/`: Entidades, Value Objects, interfaces de repositorios. **Sin dependencias externas ni de framework**.
  * `application/`: Casos de uso, DTOs, servicios de aplicación.
  * `infrastructure/`: Implementaciones concretas (SQLAlchemy 2.0, Alembic, Redis, S3/R2, APIs externas).
  * `interfaces/`: Routers HTTP / WebSockets de FastAPI.
  * **Regla de oro:** Las dependencias siempre apuntan hacia adentro; el dominio no sabe de HTTP ni de bases de datos.
* **Base de Datos:** PostgreSQL 16 + extensión PostGIS (datos geoespaciales y telemetría). Migraciones con Alembic (compatibles hacia atrás). Soft-deletes con triggers de auditoría (`created_at`, `updated_at`, `created_by`).
* **Cache & Asincronía:** Redis 7 para rate limiting, locks distribuidos y colas de trabajo con Celery/Bull (con exponential backoff y Dead Letter Queue).
* **API RESTful:** Versionado en URL (`/v1/`), contratos OpenAPI automáticos, paginación basada en cursor y soporte de cabecera `Idempotency-Key` en endpoints POST.

### F. Seguridad y Compliance (Playbook 04)
* **Threat Modeling:** Aplicar STRIDE antes de codear features que toquen datos sensibles.
* **Autenticación:**
  * JWT access tokens de corta vida (15–30 min).
  * Refresh tokens (7 días) alojados en cookies `httpOnly`, `Secure`, `SameSite=Strict`.
  * Hashing de contraseñas con `bcrypt` (≥12 salt rounds) o `argon2id`.
  * Rate limiting estricto en `/login` (máx. 5 intentos / 15 min).
* **Autorización:** RBAC a nivel middleware y **Row-Level Security (RLS)** directamente en la base de datos PostgreSQL.
* **Infraestructura segura:** TLS 1.3, WAF activo (Cloudflare), WAF/DDoS, variables de entorno jamás commiteadas.
* **Compliance:**
  * GDPR / CCPA y Ley 19.628 de Protección de Datos de Chile.
  * Endpoints de derechos ARCO obligatorios: `GET /api/user/export` y `DELETE /api/user`.
  * Registro de auditoría inmutable (append-only) retenido mínimo 2 años.

### G. QA, Testing y Despliegue (Playbook 05 & Web-Deployment)
* **Pirámide de Testing:**
  * **70% Unit tests:** Vitest / pytest (componentes, custom hooks, use cases, domain entities, schemas Zod).
  * **20% Integration tests:** Componente + API mockeada (msw), endpoint completo contra Postgres real en testcontainers.
  * **10% E2E tests:** Playwright (flujos críticos de punta a punta: auth, flujos principales, mobile viewports).
* **Contenedores Docker:**
  * Multi-stage build (deps → builder → runner).
  * Imagen base Alpine, usuario no-root (`USER node` o `USER appuser`).
  * `.dockerignore` estricto; sin secretos en las capas.
* **Deploy canónico:** Vercel (Frontend Next.js) + Railway/Render/AWS ECS (Backend) + Cloudflare (DNS, SSL Full-Strict, WAF).

### H. Observabilidad Día 1 (Playbook 06)
* **3 Pilares Innegociables:**
  1. *Logs estructurados:* Formato JSON siempre (con `structlog` o equivalente). Obligatorio: `timestamp`, `level`, `service`, `trace_id`, `span_id`, `user_id`. **Prohibido loguear PII, tokens o passwords**.
  2. *Métricas:* Método RED (Rate, Errors, Duration) para servicios web y USE para infraestructura.
  3. *Trazas distribuidas:* OpenTelemetry propagando `X-Request-Id` cross-service.
* **Alertas:** Solo alertas accionables con enlace a runbook operativo. Alertas basadas en quema de presupuesto de error (Error Budget de SLOs).

### I. Feature Flags & Rollouts (Playbook 09)
* **Deploy ≠ Release:** El código entra a producción de forma continua; la activación de features está gobernada por banderas de características.
* **Rollout Progresivo:** 1% (equipo / beta testers) → 5% → 25% → 50% → 100%. Auto-rollback automático si el error rate se eleva.
* **Higiene de Flags:** Todo flag temporal lleva comentario con fecha de expiración (`FLAG_EXPIRES: YYYY-MM-DD`). Tras 14 días al 100%, se elimina el código alternativo y la bandera.
* **Kill Switches Obligatorios en Producción:**
  * `kill_switch.payment_processing`
  * `kill_switch.email_sending`
  * `kill_switch.ai_features`
  * `kill_switch.signup`

### J. AI & LLM Engineering (Playbook 07)
* **Tratamiento Formal de LLMs:**
  * Prompts versionados en archivos independientes con estructura estricta (`<system>`, `<context>`, `<task>`, `<output>`).
  * Forzar salida mediante esquemas JSON validados con Pydantic / Zod.
* **Evaluaciones (Evals) en CI:**
  * Datasets de prueba: Golden set (50–200 casos reales) + adversarial set (intentos de rotura/inyección).
  * No deployear cambios de prompt o modelo sin superar el baseline del benchmark.
* **RAG Canónico:**
  * Chunking de 512 tokens con 50 de overlap.
  * Búsqueda híbrida (vectorial con `pgvector` + BM25 por palabras clave).
  * Re-ranking de los 20 mejores a los 5 finales mediante cross-encoder.
  * Inyección forzada de citas y respuesta "no sé" ante falta de contexto.
* **Routing de Modelos:**
  * Claude Sonnet / GPT-4 para razonamiento profundo y generación final.
  * Claude Haiku / GPT-4o-mini para clasificación, filtrado, extracción rápida y guardrails económicos.

### K. FinOps y Control Económico (Playbook 10)
* **Visibilidad antes que optimización:** Etiquetado obligatorio en todo recurso cloud y llamada LLM (`project`, `env`, `service`, `feature`, `owner`).
* **Seguimiento de Costo LLM:** Registrar tokens de entrada, tokens de salida y USD consumidos por feature y por usuario.
* **Regla de Margen:** Si el costo de inferencia LLM de una feature supera el 20% del valor percibido/cobrado por ese módulo, se bloquea el despliegue hasta optimizar (caching de prompts de Anthropic, compresión de contexto o uso de modelo menor).

---

## 5. Anti-Patrones Estrictamente Prohibidos (Poder de Veto)

El agente constructor debe vetar activamente las siguientes prácticas:
1. ❌ Escribir código de features sin validación previa del problema o sin PRD.
2. ❌ Usar `any` en TypeScript para "arreglarlo después".
3. ❌ Poner lógica de negocio en componentes React o en controllers de FastAPI.
4. ❌ Subir secrets, API keys o archivos `.env` a git o dentro de bundles frontend.
5. ❌ Ejecutar llamadas a LLM en caliente sin cache, sin límite de tokens o sin timeout.
6. ❌ Crear banderas de características (feature flags) eternas sin fecha de retiro.
7. ❌ Dejar `console.log` o `print()` en producción en lugar de logs estructurados JSON con correlation ID.
8. ❌ Mezclar bases de datos de Staging con Producción.
