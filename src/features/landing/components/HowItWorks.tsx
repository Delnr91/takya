"use client";

import { motion, type Variants } from "framer-motion";
import { SectionDivider } from "./HandDrawn";
import { HowItWorksFlow } from "./HowItWorksFlow";
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

/** Sección «Cómo funciona»: los cinco pasos como una escena animada. */
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

      <motion.div
        initial="hidden"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="max-w-6xl mx-auto"
      >
        <HowItWorksFlow steps={STEPS} />
      </motion.div>
    </section>
  );
}
