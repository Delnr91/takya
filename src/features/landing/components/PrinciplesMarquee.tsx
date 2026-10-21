const PRINCIPLES = [
  "Humano al mando",
  "Sin biometría",
  "Se instala en tu central",
  "Evidencia sellada",
  "Muestra lo que no sabe",
  "Verificable sin internet",
];

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="takya-marquee-track" aria-hidden={hidden || undefined}>
      {PRINCIPLES.map((label) => (
        <li key={label}>
          <i aria-hidden="true" />
          {label}
        </li>
      ))}
    </ul>
  );
}

/** Franja de principios en movimiento lento (idea de «Infinite Slider»). */
export function PrinciplesMarquee() {
  return (
    <section
      aria-label="Principios de TAKYA"
      className="takya-marquee relative z-10 py-5"
    >
      <div className="takya-marquee-rail">
        <Track />
        <Track hidden />
      </div>
    </section>
  );
}
