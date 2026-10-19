---
name: takya-cognitivo
description: Diseñar y evaluar la capa cognitiva, factores humanos (MIT, Stanford, Europa, Rusia, China), semiótica pictográfica (ISOTYPE/ISO 7010) y jugabilidad táctil de TAKYA para operadores con baja alfabetización digital, manteniendo rigor técnico en el backend. Usar para decisiones de UI/UX, ergonomía cognitiva, gamificación seria y accesibilidad; no convierte análisis en permiso de programar.
---

# Criterio de Ingeniería Cognitiva y Factores Humanos de TAKYA

Lee `docs/estrategia/12_CAPA_COGNITIVA_FACTORES_HUMANOS_UX.md`, `docs/03_DESIGN_SYSTEM.md` y `docs/06_DEMO_OPERATOR_FLOW.md`. Respeta AGENTS, rutas congeladas (`scripts/orch/frozen-paths.txt`) y los invariantes de `docs/estrategia/07_CTO_CRITERIO.md`.

## Principio rector: «Juguete táctil por fuera, motor profundo por dentro»

1. **Módulos Profundos (Stanford / Ousterhout):** Oculta toda la jerga de video, criptografía y subprocesos (`PTS`, `GOP`, `SHA-256`, `Ed25519`, `AES-256-GCM`, `bwrap`) detrás de controles tangibles, reversibles y comprensibles en menos de un segundo. La simplicidad superficial nunca debilita los invariantes del servidor.
2. **Doble Codificación y Señalética Universal (ISOTYPE / ISO 7010 / W3C / MIIT China):**
   - Prohibidos los iconos huérfanos y los bloques de texto denso.
   - Todo control operativo combina 4 capas: **Forma/Contorno + Color Semántico + Pictograma de Silueta + Verbo/Sustantivo de 1 a 3 palabras (≥ 18 px)**.
   - Objetivos táctiles **≥ 48 × 48 px** (Ley de Fitts) y máximo **3 decisiones principales por paso** (`Verificar`, `Escalar`, `Descartar`; Ley de Hick-Hyman).
3. **Control Supervisorio y Actividad Activa (MIT Sheridan / Europa Rasmussen / Rusia Lomov-Leontiev):**
   - El operador no es un espectador pasivo: el carrusel no avanza solo y las decisiones no se toman automáticamente.
   - El flujo guía mediante **andamiaje desbloqueable** (`Observar → Comprender → Decidir`), bajando la carga del nivel *Knowledge* al nivel *Skill/Rule*.
   - Siempre explicita tres bloques separados en la comprensión: **Qué se observa**, **Qué NO se sabe (incertidumbre)** y **Siguiente paso sugerido**, sin inventar porcentajes de probabilidad de delito.
4. **Gamificación Seria y Jugabilidad Táctil (sin Ley de Goodhart):**
   - **Permitido y buscado:** Sensación táctil de «juguete robusto» (cero miedo a romper el sistema, modo *Práctica preparada* como caja de arena segura, desbloqueo paso a paso, confirmación visual inmediata y progreso por completitud tranquila).
   - **Prohibido:** Puntuar rapidez, cronómetros de presión, rachas por escalar alertas, sonidos estridentes o tono infantil/condescendiente.
5. **Rigor epistémico:**
   - Diseñar para baja alfabetización digital y adultos mayores es un criterio de accesibilidad universal; no declares censos demográficos ni diagnósticos clínicos no medidos.
   - «Grado militar» en el backend significa **controles verificables** (fuente intacta, worker sin red/shell, autoridad de servidor y verificador offline que rechaza alteraciones), nunca eslóganes sin pruebas.
   - Si el usuario pide análisis o documentación (`.md`), no edites código de producto.

## Salida esperada en revisiones o diseños cognitivos

- **Fricción cognitiva detectada:** qué exige leer demasiado, recordar entre pantallas o entender jerga técnica.
- **Traducción pictográfica y lúdica:** cómo reducirlo a pictograma + etiqueta breve + paso desbloqueable (4 capas).
- **Costura con el backend:** qué invariante técnico protege al operador por debajo sin exponerle la complejidad.
- **Prueba observable:** cómo medir comprensión (ISO 9186), tiempo de tarea y calibración de confianza sin inventar métricas.
