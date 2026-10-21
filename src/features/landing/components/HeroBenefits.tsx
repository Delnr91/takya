"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
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
  const reduce = useReducedMotion();
  // Lente de vidrio que se desliza como líquido al concepto bajo el puntero
  // (o con foco), como las barras de pestañas de iOS.
  const [lens, setLens] = useState<number | null>(null);
  return (
    <nav
      aria-label="Lo que hace TAKYA"
      onPointerLeave={() => setLens(null)}
      className="takya-benefits grid w-full max-w-5xl grid-cols-2 gap-2 rounded-[28px] p-3 md:grid-cols-4 md:rounded-full md:p-2"
    >
      {BENEFITS.map(({ icon: Icon, label, text, target }, index) => (
        <a
          key={label}
          href={`#${target}`}
          onClick={(event) => {
            event.preventDefault();
            onNavigate(target);
          }}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setLens(index);
          }}
          onFocus={() => setLens(index)}
          onBlur={() => setLens(null)}
          className="group relative flex items-center gap-3 rounded-[20px] px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E05D44] md:rounded-full md:px-4"
        >
          {lens === index ? (
            <motion.span
              layoutId="takya-benefit-lens"
              className="takya-benefit-lens"
              aria-hidden="true"
              transition={
                reduce
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 380, damping: 26, mass: 0.9 }
              }
            >
              <motion.span
                key={index}
                className="takya-benefit-lens-body"
                initial={reduce ? false : { scaleY: 0.82, scaleX: 1.08 }}
                animate={{ scaleY: 1, scaleX: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
              />
            </motion.span>
          ) : null}
          <span
            className={`relative grid size-10 shrink-0 place-items-center rounded-full transition-colors ${
              index === 3
                ? "bg-[#E05D44] text-white"
                : "bg-[#1B3B2B]/[0.07] text-[#1B3B2B] group-hover:bg-[#1B3B2B] group-hover:text-[#F4F1EA]"
            }`}
          >
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="relative min-w-0">
            <span
              className={`${type.label} block ${index === 3 ? "text-[#E05D44]" : "text-[#1B3B2B]"}`}
            >
              {label}
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
