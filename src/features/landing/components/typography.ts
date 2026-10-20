// Escala tipográfica única de la landing: cada nivel se escribe una sola vez
// para que rótulos, títulos, textos y notas se vean iguales en todas las
// secciones. El color va aparte cuando cambia según el fondo.
export const type = {
  /** Rótulo de sección, sobre el título. */
  eyebrow:
    "mb-4 block font-mono text-xs font-extrabold uppercase tracking-[0.25em] text-[#E05D44]",
  /** Título de sección. */
  h2: "font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-[#1B3B2B] sm:text-5xl lg:text-6xl",
  /** Bajada junto al título. */
  lead: "text-lg font-bold leading-relaxed text-[#1B3B2B] sm:text-xl",
  /** Título de cada elemento (pilar, paso, principio, objetivo). */
  h3: "font-display text-2xl font-extrabold leading-tight tracking-tight",
  /** Texto corrido. */
  body: "text-base font-semibold leading-relaxed",
  /** Etiqueta corta en mayúsculas (número de paso, estado, categoría). */
  label: "font-mono text-xs font-bold uppercase tracking-[0.2em]",
  /** Nota al pie o aclaración de fuentes. */
  note: "font-mono text-xs leading-relaxed tracking-wide text-[#1B3B2B]/80",
  /** Cifra destacada. */
  stat: "font-display text-[clamp(4rem,8vw,6.5rem)] font-semibold leading-none tracking-[-0.08em]",
  /** Texto de botones y enlaces de acción. */
  button: "font-mono text-xs font-bold uppercase tracking-wider",
} as const;
