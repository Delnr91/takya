# TAKYA - Product Requirements Document (PRD)

## 1. Propósito y Visión
TAKYA es un asistente inteligente de contexto para operadores de televigilancia (CCTV) municipal. Su objetivo es reducir la fatiga cognitiva agrupando alertas concurrentes, priorizando mediante Inteligencia Artificial Explicable (XAI) y manteniendo la decisión final en manos del operador humano (Human-in-the-Loop).

## 2. Alcance del MVP (Regla de las 3 Features)
El producto a construir en esta fase es un entregable digital de grado profesional destinado a validación comercial y presentación en el Demo Day del Programa Nómada UCN 2026. Consta estrictamente de 3 rutas:

### Feature 1: Entrada Inmersiva (`/home`)
* **Objetivo:** Impacto visual inmediato e invitación a explorar.
* **Componentes:**
  * Background interactivo (video/motion) estético y sobrio ("Structural Silence").
  * Fallback progresivo a imagen estática de alta resolución.
  * Selector dual (Dual Bento CTA): "Conocer el Proyecto" (`/landing`) vs "Probar Consola Interactiva" (`/demo`).

### Feature 2: Vitrina Institucional (`/landing`)
* **Objetivo:** Comunicar el valor comercial y técnico a municipios y aliados.
* **Componentes:**
  * Layout modular en Bento Grid.
  * Storytelling del problema (crecimiento de 130 a 1.245 cámaras en Antofagasta y 50% de eventos no detectados por fatiga).
  * Explicación de la solución en 5 pasos (Detección -> Agrupación -> Priorización XAI -> Verificación Humana -> Auditoría).
  * Presentación del equipo interdisciplinario UCN.
  * Formulario de contacto funcional validado.

### Feature 3: Consola de Operador Simulada (`/demo`)
* **Objetivo:** Demostrar el flujo de trabajo resolutivo del operador.
* **Componentes:**
  * **Pantalla de Login Simulado:** Barrera de entrada visual (sin backend/BD, acepta cualquier credencial) para dar realismo institucional antes de acceder a la consola.
  * Header de métricas RED (Alertas brutas vs Incidentes agrupados).
  * Feed lateral de incidentes filtrable por severidad y estado.
  * Visor central simulando una cámara CCTV con overlay de telemetría y bounding boxes.
  * Panel XAI (Por qué el sistema priorizó el incidente).
  * Barra de acción humana obligatoria: `[Verificar]`, `[Escalar]`, `[Descartar]`.
  * Drawer/Panel de registro de auditoría local (Audit Trail).

## 3. Restricciones y Fuera de Alcance (Out of Scope)
* ❌ Backend real con base de datos (todo correrá en cliente/memoria para la demo).
* ❌ Conexión a cámaras IP reales.
* ❌ Modelos de inferencia IA en vivo (los incidentes del Demo serán mockeados mediante un motor de simulación interno).
