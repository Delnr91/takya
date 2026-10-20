"use client";

import { useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Layers3, ShieldCheck, UserCheck } from "@/components/icons";
import { GrainGradient } from "@/components/ui/GrainGradient";
import { type } from "./typography";

const PILLARS = [
  {
    icon: Layers3,
    label: "Pilar I · Correlación",
    title: "Encontrar contexto.",
    text: "Agrupamos señales dispersas y cámaras que pertenecen a un mismo hecho, para entregar una historia continua y sin duplicados.",
  },
  {
    icon: ShieldCheck,
    label: "Pilar II · Explicación",
    title: "Entender la prioridad.",
    text: "Explicamos en lenguaje simple el porqué de cada sugerencia antes de actuar. Sin cajas negras.",
  },
  {
    icon: UserCheck,
    label: "Pilar III · Decisión humana",
    title: "Conservar el control.",
    text: "La persona valida, decide y registra su criterio. La inteligencia artificial propone; el operador tiene la última palabra.",
  },
];

/** Pilares en un carrusel 3D con flechas a los costados, arrastre y teclado. */
export function PillarsCarousel() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const count = PILLARS.length;
  const go = (step: number) =>
    setActive((value) => (value + step + count) % count);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -60) go(1);
    else if (info.offset.x > 60) go(-1);
  }

  return (
    <div
      className="takya-pillars takya-gradient-panel"
      role="region"
      aria-roledescription="carrusel"
      aria-label="Pilares de TAKYA"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(1);
        if (event.key === "ArrowLeft") go(-1);
      }}
    >
      <GrainGradient colors={["#E05D44", "#DBBA95", "#A5C8AE"]} />
      <button
        type="button"
        className="takya-pillars-arrow is-left"
        aria-label="Pilar anterior"
        onClick={() => go(-1)}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <div className="takya-pillars-stage">
        {PILLARS.map(({ icon: Icon, label, title, text }, index) => {
          let offset = index - active;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const isActive = offset === 0;
          return (
            <motion.article
              key={title}
              className="takya-pillar"
              aria-hidden={!isActive}
              data-icon-trigger=""
              drag={isActive && !reduce ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={onDragEnd}
              onClick={() => !isActive && setActive(index)}
              animate={
                reduce
                  ? { x: `${offset * 104}%`, opacity: isActive ? 1 : 0.5 }
                  : {
                      x: `${offset * 62}%`,
                      rotateY: offset * -28,
                      scale: isActive ? 1 : 0.84,
                      opacity: isActive ? 1 : 0.62,
                      zIndex: isActive ? 3 : 1,
                    }
              }
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
            >
              <span className="takya-pillar-icon" aria-hidden="true">
                <Icon size={28} />
              </span>
              <span className={`${type.label} text-[#7D9B8A]`}>{label}</span>
              <h3 className={`mt-3 ${type.h3} text-[#1B3B2B]`}>{title}</h3>
              <p className={`mt-3 ${type.body} text-[#1B3B2B]`}>{text}</p>
            </motion.article>
          );
        })}
      </div>
      <button
        type="button"
        className="takya-pillars-arrow is-right"
        aria-label="Pilar siguiente"
        onClick={() => go(1)}
      >
        <ChevronRight aria-hidden="true" />
      </button>
      <div className="takya-pillars-dots" aria-hidden="true">
        {PILLARS.map((pillar, index) => (
          <i key={pillar.title} data-active={index === active} />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {`Pilar ${active + 1} de ${count}: ${PILLARS[active]?.title}`}
      </p>
    </div>
  );
}
