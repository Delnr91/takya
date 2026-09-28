# TAKYA · Memoria de Contexto y Base de Conocimiento del Proyecto

> **Archivo de Memoria Viva para el Hilo de Conversación y Desarrollo**  
> **Ubicación:** `Desktop/TAKYA/MEMORY.md`  
> **Fecha de Creación:** 28 de septiembre de 2026  
> **Versión:** 1.0.0  

---

## 1. Identidad del Producto y Visión

* **Nombre del Producto:** **TAKYA** (evolución estratégica de la fase conceptual *Punto Seguro*).
* **Slogan / Promesa:** *"Comprender antes de actuar"*.
* **Propósito Central:** Asistente inteligente de contexto y priorización para salas y centros de televigilancia (CCTV) municipal e institucional.
* **Problema Real que Resuelve:** 
  * Los centros de vigilancia colapsan por **sobrecarga de información y fatiga cognitiva** de los operadores. 
  * En Antofagasta el sistema municipal aumentó de 30 a 130 cámaras activas 24/7 y la región proyecta 1.245 cámaras y 64 lectores de patentes. 
  * Los estudios de campo demuestran que operadores humanos sometidos a cientos de pantallas pierden hasta el 50% de conductas críticas y reciben cientos de falsas alarmas repetitivas.
  * **El problema central no es "la delincuencia en abstracto", sino la saturación del operador humano frente a pantallas dispersas.**
* **Propuesta de Valor:**
  * Agrupación inteligente de alertas redundantes provenientes de múltiples cámaras sobre un mismo evento.
  * Priorización explicable por nivel de criticidad/urgencia.
  * **Control humano absoluto (Human-in-the-loop):** El software asiste y contextualiza; la decisión de verificar, escalar o descartar siempre es del operador.
  * Registro y trazabilidad de cada decisión en una bitácora de auditoría.

---

## 2. Contexto Institucional, Académico y Territorial

* **Marco:** **Programa Nómada 2026** — Ecosistema de Innovación y Emprendimiento de la **Universidad Católica del Norte (UCN)**, a través del centro **USQAI** (Antofagasta, Chile).
* **Fuentes Documentales Clave:**
  * `Downloads/01. takya Mi bitácora nómada.docx.pdf`: Bitácora oficial de 41 páginas con los hitos, rúbricas de competencias transversales, hipótesis de valor, retroalimentación de mentores y definición del prototipo visual y simulado.
  * `Desktop/abrahamquispe/BASES GENERALES NÓMADA 2026.md`: Marco regulatorio, etapas formativas, paradas nómadas, checkpoints y requisitos de Demo Day de USQAI.
  * `Desktop/abrahamquispe/AVANCE_VALIDACION_PUBLICO_OBJETIVO_PUNTO_SEGURO_2026.docx`: Evidencia empírica de entrevistas a operadores y encargados de seguridad pública territorial.
* **Alineación con Objetivos de Desarrollo Sostenible (ODS):**
  * **ODS 11:** Ciudades y comunidades sostenibles.
  * **ODS 9:** Industria, innovación e infraestructura.
  * **ODS 16:** Paz, justicia e instituciones sólidas.

---

## 3. Equipo de Trabajo y Roles

1. **Dev AI / CTO (Usuario):** Liderazgo de arquitectura de software, ingeniería de inteligencia artificial, diseño técnico e implementación del código en `Desktop/TAKYA/takya-app`.
2. **Nehemías Gonzales Vargas (Ingeniería Civil):** Operaciones, análisis de procesos, gestión y validación de infraestructura territorial.
3. **Daniel Núñez Rojas (Ingeniería Civil):** Análisis de flujos de trabajo de vigilancia, modelamiento operativo y validación técnica.
4. **Ariela (Ingeniería Comercial):** Modelo de negocio (Business Model Canvas), estructura de costos/ingresos, validación con compradores institucionales (municipios) y pitch comercial.

---

## 4. Arquitectura del Producto y Rutas Requeridas

Toda la aplicación construible vive exclusivamente dentro de:
📂 **`C:\Users\invde\Desktop\TAKYA\takya-app`**  
*(Todo lo que está en `Desktop/TAKYA/` fuera de `takya-app` es documentación, referencias visuales, logos y activos de consulta).*

### Las 3 Rutas Principales:
1. **`/home` (o `/`): Entrada Inmersiva**
   * Video interactivo de fondo (background audiovisual espacial/tecnológico sobrio).
   * Identidad TAKYA con tipografía y símbolo oficial.
   * Mensaje claro y directo de entrada con call-to-actions bifurcados:
     * **Explorar el Landing (`/landing`)**: Para conocer el proyecto, la visión, el equipo y la propuesta de valor.
     * **Probar la Demo (`/demo`)**: Para ingresar a la simulación interactiva de la consola del operador.
2. **`/landing`: Página Pública Institucional y Comercial**
   * Narrativa orientada al comprador institucional, al programa Nómada UCN y aliados de seguridad.
   * Secciones:
     * *Hero:* Titular claro, valor fundamental y llamada a la acción.
     * *El Problema:* Datos reales de saturación (130 a 1.245 cámaras en Antofagasta, 50% de eventos desatendidos por fatiga).
     * *La Solución en 5 Pasos:* Detección → Agrupación contextual → Priorización explicable → Verificación humana → Trazabilidad.
     * *Diferenciador Étnico/Ético:* Inteligencia Artificial explicable que no reemplaza al operador, sino que lo empodera.
     * *Contexto UCN Nómada & Equipo:* Reconocimiento a la formación en USQAI UCN y perfiles de ingeniería civil y comercial.
     * *Contacto y Conversación Comercial:* Formulario/enlace para solicitar demo institucional o contacto.
3. **`/demo`: Consola de Operador Interactiva (Simulada)**
   * Simulación visual del centro de televigilancia:
     * Panel superior con KPIs de operación: Alertas recibidas (ej. 142), Alertas agrupadas (ej. 38 incidentes), Incidentes activos (ej. 4), Tiempo promedio de resolución.
     * Lista de incidentes priorizados por severidad (Alta, Media, Informativa).
     * Visor de cámara simulada con bounding box y metadatos de detección.
     * Modal explicable: *"¿Por qué se agrupó y priorizó esta alerta?"* (Explicabilidad de IA).
     * Acciones del operador: **[Verificar Incidente]**, **[Escalar a Patrulla]**, **[Descartar como Falsa Alarma]**.
     * Historial y registro de auditoría de decisiones en tiempo real.

---

## 5. Sistema de Marca y Recursos Disponibles

* **Paleta Cromática (Sistema A - Oficial):**
  * `Verde Bosque Profundo`: `#1B3B2B` (confianza, solidez, seguridad institucional).
  * `Marfil / Crema Cálido`: `#F4F1EA` (claridad, calidez humana, legibilidad).
  * `Salvia / Menta Suave`: `#7D9B8A` / `#A3B899` (acento secundario y estados).
  * `Fondo Oscuro Espacial / Monitoreo`: `#0C1410` o `#0F1713` (para contraste del video y salas de control).
* **Tipografías:**
  * Titulares: *Sora* / *Plus Jakarta Sans*.
  * Cuerpo de texto y datos técnicos: *Plus Jakarta Sans* / *Inter* / *JetBrains Mono*.
* **Activos de Identidad Disponibles en `Desktop/TAKYA/imagenes A/`:**
  * `01_maestros_svg/`: Logotipos vectoriales en bosque, marfil y monocromo. Símbolos SVG optimizados.
  * `02_png_transparentes/`: Versiones en alta resolución (1024 a 2048 px).
  * `03_favicon_iconos/`: Favicon completo (16, 32, 48, 180, 192, 512 px) y PWA maskable.
* **Activos de Referencia en `Desktop/TAKYA/referencias/`:**
  * `TAKYA_BACKGROUND_HOME_A_COLOR_v01.png`
  * `blueprint-landing-a.svg`
  * `referencias dmo/`: Capturas de referencia de la interfaz del software para guiar la construcción del dashboard.

---

## 6. Documentación Cruzada de Punto Seguro (`Desktop/ps` y `Desktop/pesu`)

* `Desktop/ps/Final Technical Architecture.md`: Arquitectura técnica previa y flujos de datos.
* `Desktop/ps/02-market-and-business-model.md`: Análisis de mercado y modelos de sostenibilidad económica.
* `Desktop/ps/Punto-Seguro-Startup-Pitch-Deck.pptx`: Estructura del pitch de presentación.
* `Desktop/pesu/AVANCE_VALIDACION_PUBLICO_OBJETIVO_PUNTO_SEGURO_2026.docx`: Validaciones directas con los tomadores de decisiones municipales.

---

---

## 7. Protocolo del Agente Constructor (Lattice & TAKYA)

Se adopta formalmente el estándar de ingeniería definido en `PROTOCOLO_AGENTE_CONSTRUCTOR.md` (origen: Segundo Cerebro del autor `03_SOFTWARE_ENGINEERING` & `02_STARTUP`):

1. **Filosofía "Structural Silence":**
   * El software es topología y sistema, no decoración. Espacio calculado, cuadrícula rigurosa, sustracción sobre adición.
   * Bento Grids, layout modular, dark glassmorphism sutil y micro-interacciones con propósito.
   * Mobile-first, dark mode natural.
   * Tipografía clínica/técnica: *Sora*, *Plus Jakarta Sans*, *Inter*, *JetBrains Mono*.
   * Paleta con propósito: Fondo profundo (`#0A0A0A` / `#0C1410`), superficies marfil/cálidas (`#F4F1EA`), acento sobrio verde bosque (`#1B3B2B`) y salvia (`#7D9B8A`).
2. **Estándares Frontend:**
   * Next.js 14+ (App Router, Server/Client components), React 18+, TypeScript en modo estricto (`"strict": true`, `"noUncheckedIndexedAccess": true`). **Cero uso de `any`**.
   * Estructura por Features (`src/features/[feature]/components`, `hooks`, `schemas`, etc.).
   * Jerarquía de estado: URL state (`useSearchParams`) → Server state → Local state (`useState`) → Global state (Zustand si aplica).
   * Validación en frontera con Zod.
3. **Scope MVP Estricto (Regla de 3 Features):**
   * **Feature 1 (Core):** Agrupación y priorización inteligente de alertas repetidas en consola `/demo`.
   * **Feature 2 (Diferencial):** Explicabilidad de IA y control humano innegociable (Verificar / Escalar / Descartar).
   * **Feature 3 (Gancho):** Entrada inmersiva `/home` con video interactivo de fondo que incita a explorar `/demo` o `/landing`.
4. **Veto Activo a Anti-Patrones:**
   * ❌ Cero `any` en TypeScript.
   * ❌ Cero lógica de negocio en componentes UI.
   * ❌ Cero secrets o tokens en cliente.
   * ❌ Cero `console.log` sueltos.
   * ❌ Cero dependencias inventadas o código sin validación.

---

## 8. Hoja de Ruta de Desarrollo Inmediata

1. ✅ **Fase 0 (Completada):** Lectura e integración total de documentación (Nómada UCN, Bitácora, bases USQAI, Takya docs y Protocolo del Agente Constructor).
2. 🔄 **Fase 1 (Siguiente paso):** Cargar la carpeta de startup del usuario, inicializar la estructura moderna en `Desktop/TAKYA/takya-app` y vincular los assets gráficos.
3. ⏳ **Fase 2:** Implementación del `/home` interactivo con background audiovisual y selector de rutas.
4. ⏳ **Fase 3:** Construcción del `/landing` público, responsivo y adaptado al brief editorial.
5. ⏳ **Fase 4:** Construcción del `/demo` simulado interactivo con el flujo de 5 pasos para el Demo Day de Nómada UCN.
