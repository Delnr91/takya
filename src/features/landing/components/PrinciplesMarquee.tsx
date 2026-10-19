import {
  CircleHelp,
  Cpu,
  EyeOff,
  FileCheck,
  Lock,
  UserCheck,
} from "@/components/icons";

const PRINCIPLES = [
  { icon: UserCheck, label: "Humano al mando" },
  { icon: EyeOff, label: "Sin biometría" },
  { icon: Cpu, label: "Local primero" },
  { icon: Lock, label: "Evidencia sellada" },
  { icon: CircleHelp, label: "Muestra lo que no sabe" },
  { icon: FileCheck, label: "Verificable sin internet" },
];

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="takya-marquee-track" aria-hidden={hidden || undefined}>
      {PRINCIPLES.map(({ icon: Icon, label }) => (
        <li key={label} data-icon-trigger="">
          <Icon size={18} aria-hidden="true" />
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
      className="takya-marquee relative z-10 border-y border-[#1B3B2B]/15 py-5"
    >
      <div className="takya-marquee-rail">
        <Track />
        <Track hidden />
      </div>
    </section>
  );
}
