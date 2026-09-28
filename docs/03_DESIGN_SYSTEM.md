# TAKYA - Design System ("Structural Silence")

## 1. Filosofía
**"Structural Silence":** Topología sobre decoración. Layouts modulares, rígidos y cuadriculados (Bento Grids). Minimalismo clínico que transmite seguridad institucional y control. Sustracción sobre adición.

## 2. Paleta de Colores (Tokens)
Configurar estos tokens en `tailwind.config.ts`:

* **Bosque Profundo (Brand Primary):** `#1B3B2B` (Institucionalidad, calma).
* **Marfil Cálido (Brand Surface/Text):** `#F4F1EA` (Contraste orgánico, menos agresivo que el blanco puro).
* **Salvia (Accent/Secondary):** `#7D9B8A` (Estados informativos, bordes sutiles).
* **Dark Surface (Consola/Fondo):** `#0C1410` (Fondo de sala de monitoreo, baja fatiga visual).
* **Dark Deep (Root Background):** `#060A08`.

**Estados Semánticos:**
* **Critico (Teja):** `#E05D44` (Urgente pero sin sangrado visual, controlado).
* **Medio (Ámbar):** `#D99B26`.
* **Informativo/Confirmación:** `#4A7C59`.

## 3. Tipografía
* **Display / Titulares:** `Sora` (Geométrica, moderna, tecnológica).
* **Cuerpo de texto / UI Regular:** `Plus Jakarta Sans` (Clínica, alta legibilidad en pantallas densas).
* **Telemetría / Metadatos (Data/Logs):** `JetBrains Mono` o `Geist Mono` (Tabular, clara para IPs, coordenadas, timestamps).

## 4. UI Patterns
* **Glassmorphism Sutil:** Fondos translúcidos con blur pesado (ej. `backdrop-blur-xl bg-forest/10`) solo para capas superiores modales.
* **Micro-interacciones:** Hover states sutiles en los botones de acción (`[Verificar]`, `[Escalar]`), sin rebotes excesivos. Framer Motion reservado para revelar contenido o transición de páginas.
* **Densidad:** La consola `/demo` usa una densidad alta (textos `text-sm` y `text-xs`) característica de herramientas operativas Pro (Data-heavy). La ruta `/landing` usa densidad baja (mucho aire, grandes tipografías).
