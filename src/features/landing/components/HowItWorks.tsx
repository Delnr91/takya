"use client";

import { motion, type Variants } from "framer-motion";
import { SketchArrow, SectionDivider } from "./HandDrawn";
import { type } from "./typography";
import { SectionTitle } from "./SectionTitle";

const STEPS = [
  {
    title: "Recibir",
    text: "El video de tus cámaras pasa a TAKYA. El original queda intacto, con su huella digital.",
  },
  {
    title: "Delimitar",
    text: "Marcas la zona que importa. TAKYA solo mira ahí.",
  },
  {
    title: "Analizar",
    text: "Un detector instalado en tu central revisa una copia, sin internet, y propone candidatos.",
  },
  {
    title: "Revisar",
    text: "Ves qué se observó y qué no se sabe. Tú decides, con un motivo.",
  },
  {
    title: "Conservar",
    text: "Exportas un paquete firmado y cifrado que se comprueba sin internet.",
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

/** Sección «Cómo funciona»: el recorrido de cinco pasos del documento maestro. */
export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-28 scroll-mt-28"
    >
      <SectionDivider />
      <motion.div
        initial="hidden"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="max-w-6xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-end gap-8 mb-16"
      >
        <div className="flex-1">
          <span className={type.eyebrow}>CÓMO FUNCIONA</span>
          <SectionTitle
            lead="Tus cámaras vigilan. TAKYA te dice"
            accent="qué mirar"
            after="."
          />
        </div>
        <p className={`flex-1 max-w-md ${type.lead}`}>
          Las cámaras siguen operando como siempre y su video pasa a TAKYA, que
          encuentra lo relevante, lo explica y sella la evidencia. La persona
          siempre decide.
        </p>
      </motion.div>

      <motion.ol
        initial="hidden"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          whileInView: { transition: { staggerChildren: 0.12 } },
        }}
        className="max-w-6xl mx-auto grid gap-10 md:grid-cols-5 md:gap-6"
      >
        {STEPS.map(({ title, text }, index) => (
          <motion.li
            key={title}
            variants={fadeUp}
            className="group relative flex flex-col pt-6"
          >
            <h3
              className={`${type.h3} text-[#1B3B2B] transition-colors group-hover:text-[#E05D44]`}
            >
              {title}
            </h3>
            <p className={`mt-2 ${type.body} text-[#1B3B2B]`}>{text}</p>
            {index < STEPS.length - 1 ? (
              <SketchArrow
                delay={0.4 + index * 0.15}
                className="pointer-events-none absolute -right-6 -top-1 hidden w-12 text-[#E05D44] md:block"
              />
            ) : null}
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
