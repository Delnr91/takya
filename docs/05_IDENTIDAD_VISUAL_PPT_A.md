# Identidad Visual y Marca - Prototipo A (Extraído del PPT Oficial)

Este documento reemplaza la necesidad de leer la presentación `.pptx`. Contiene todas las directrices de marca, tono y concepto visual de TAKYA extraídas de la última revisión.

## 1. Concepto Central: "Silencio Estructural"
La interfaz de TAKYA está diseñada para combatir la fatiga cognitiva del operador de CCTV. 
- **Menos es más:** No usamos colores saturados para adornar, solo para alertar.
- **Grillas Rígidas:** Uso extensivo del patrón *Bento Grid* (módulos cuadrados/rectangulares bien definidos, con bordes sutiles).
- **Glassmorphism Funcional:** Transparencias con desenfoque (`backdrop-blur`) solo para capas flotantes (modales o XAI).

## 2. Paleta de Colores (Tokens)
- **Fondo General (Root):** `#060A08` (Dark Deep - negro con levísimo tinte verde).
- **Fondo de Componentes:** `#0C1410` (Dark Surface).
- **Color Principal (Institucional):** `#1B3B2B` (Verde Bosque). Transmite calma y autoridad.
- **Color de Texto/Contraste:** `#F4F1EA` (Marfil). Evitamos el blanco puro en los textos para reducir el cansancio visual. *Nota del equipo: Sin embargo, debes tomar las imágenes con fondo blanco que están en la carpeta de referencias como tu guía y ancla visual.*
- **Color Secundario/Bordes:** `#7D9B8A` (Salvia).

## 3. Tipografía
El PPT dicta una dupla tipográfica estricta:
1. **Sora:** Para grandes titulares, métricas destacadas y el logotipo. Da un aspecto tecnológico y geométrico.
2. **Plus Jakarta Sans:** Para el cuerpo de texto, menús y párrafos. Excelente legibilidad en densidades altas de información.
*(Opcional: JetBrains Mono para datos puros como IDs, timestamps o IPs).*

## 4. Logotipos y Assets
Todos los vectores (`.svg`) están ubicados en la carpeta `public/brand/` del proyecto.
- Se debe priorizar la versión `simbolo-marfil.svg` o `logotipo-marfil.svg` sobre fondos oscuros.

## 5. El "Tono" de Voz
Institucional, directo, seguro y pedagógico. TAKYA no es una red social, es una herramienta operativa de grado militar/municipal. El copy debe ser conciso.
