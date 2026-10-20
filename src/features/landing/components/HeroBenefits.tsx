"use client";

import { Activity, FileCheck, Layers3, UserCheck } from "@/components/icons";
import { type } from "./typography";

// Barra del hero: los cuatro conceptos de la marca, cada uno con su beneficio y
// un atajo a la sección que lo explica.
const BENEFITS = [
  {
    icon: Layers3,
    label: "Contexto",
    text: "Une lo que pasó en una sola historia",
    target: "propuesta",
  },
  {
    icon: FileCheck,
    label: "Evidencia",
    text: "Sellada y verificable",
    target: "confianza",
  },
  {
    icon: Activity,
    label: "Prioridad",
    text: "Lo importante, primero",
    target: "como-funciona",
  },
  {
    icon: UserCheck,
    label: "Persona",
    text: "Tú decides, con un motivo",
    target: "confianza",
  },
];

export function HeroBenefits({
  onNavigate,
}: {
  onNavigate: (id: string) => void;
}) {
  return (
    <nav
      aria-label="Lo que hace TAKYA"
      className="grid w-full max-w-5xl grid-cols-2 gap-2 rounded-[28px] border border-white/80 bg-white/70 p-3 shadow-md backdrop-blur-2xl md:grid-cols-4 md:rounded-full md:p-2"
    >
      {BENEFITS.map(({ icon: Icon, label, text, target }, index) => (
        <a
          key={label}
          href={`#${target}`}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(target);
          }}
          className="group flex items-center gap-3 rounded-[20px] px-3 py-2.5 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E05D44] md:rounded-full md:px-4"
        >
          <span
            className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors ${
              index === 3
                ? "bg-[#E05D44] text-white"
                : "bg-[#1B3B2B]/[0.07] text-[#1B3B2B] group-hover:bg-[#1B3B2B] group-hover:text-[#F4F1EA]"
            }`}
          >
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span
              className={`${type.label} block ${index === 3 ? "text-[#E05D44]" : "text-[#1B3B2B]"}`}
            >
              <span className="text-[#7D9B8A]">0{index + 1} /</span> {label}
            </span>
            <span className="hidden text-sm font-semibold leading-snug text-[#1B3B2B]/90 lg:block">
              {text}
            </span>
          </span>
        </a>
      ))}
    </nav>
  );
}
