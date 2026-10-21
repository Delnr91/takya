"use client";

import { motion, type Variants } from "framer-motion";
import { ContourLines, SectionDivider } from "./HandDrawn";
import { type } from "./typography";
import { SectionTitle } from "./SectionTitle";

// Colores oficiales de los ODS; el número va en el tono que da contraste AA.
const GOALS = [
  {
    number: 16,
    color: "#00689D",
    ink: "#FFFFFF",
    title: "Paz, justicia e instituciones sólidas",
    text: "Evidencia trazable y decisiones humanas que se pueden reconstruir.",
    status: "Principal",
  },
  {
    number: 9,
    color: "#FD6925",
    ink: "#1B1B1B",
    title: "Industria, innovación e infraestructura",
    text: "Innovación local y reproducible que reutiliza las cámaras instaladas.",
    status: "Principal",
  },
  {
    number: 11,
    color: "#FD9D24",
    ink: "#1B1B1B",
    title: "Ciudades y comunidades sostenibles",
    text: "Espacios públicos más seguros.",
    status: "Por validar en piloto",
  },
  {
    number: 8,
    color: "#A21942",
    ink: "#FFFFFF",
    title: "Trabajo decente",
    text: "Menos carga para el operador, sin vigilarlo.",
    status: "Por validar en piloto",
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/** Sección «Impacto»: Agenda 2030 y origen del proyecto. */
export function ImpactODS() {
  return (
    <section
      id="impacto"
      className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-28 scroll-mt-28"
    >
      <ContourLines className="pointer-events-none absolute inset-x-0 top-24 -z-10 h-[420px] w-full text-[#7D9B8A]/35" />

      <SectionDivider />

      <motion.div
        initial="hidden"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-end gap-8"
      >
        <div className="flex-1">
          <span className={type.eyebrow}>IMPACTO · AGENDA 2030</span>
          <SectionTitle
            lead="Hecho en el norte, con impacto que"
            accent="se mide"
            after="."
          />
        </div>
        <div className="flex-1 max-w-md">
          <p
            className={`flex flex-wrap items-center gap-x-5 gap-y-2 ${type.label} text-[#1B3B2B]`}
          >
            <span>Antofagasta, Chile</span>
            <span>Programa Nómada UCN</span>
          </p>
          <p className={`mt-4 ${type.lead}`}>
            Una alineación propuesta y medible con los Objetivos de Desarrollo
            Sostenible. No es una certificación.
          </p>
        </div>
      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          whileInView: { transition: { staggerChildren: 0.12 } },
        }}
        className="max-w-6xl mx-auto mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {GOALS.map(({ number, color, ink, title, text, status }) => (
          <motion.li
            key={number}
            variants={fadeUp}
            className="flex flex-col pt-6"
          >
            <span
              className="grid size-16 place-items-center rounded-2xl font-display text-3xl font-extrabold"
              style={{ backgroundColor: color, color: ink }}
            >
              <span className="sr-only">ODS </span>
              {number}
            </span>
            <span className={`mt-5 ${type.label} text-[#1B3B2B]/80`}>
              {status}
            </span>
            <h3 className={`mt-2 ${type.h3} text-[#1B3B2B]`}>{title}</h3>
            <p className={`mt-2 ${type.body} text-[#1B3B2B]`}>{text}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
