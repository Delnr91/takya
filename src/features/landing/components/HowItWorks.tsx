"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  Cpu,
  Frame,
  Lock,
  Upload,
  UserCheck,
} from "@/components/icons";
import { SketchArrow } from "./HandDrawn";
import { type } from "./typography";

const STEPS = [
  {
    icon: Upload,
    title: "Cargar",
    text: "Subes la grabación. El original queda intacto, con su huella digital.",
  },
  {
    icon: Frame,
    title: "Delimitar",
    text: "Marcas la zona que importa. TAKYA solo mira ahí.",
  },
  {
    icon: Cpu,
    title: "Analizar",
    text: "Un detector local revisa una copia, sin internet, y propone candidatos.",
  },
  {
    icon: UserCheck,
    title: "Revisar",
    text: "Ves qué se observó y qué no se sabe. Tú decides, con un motivo.",
  },
  {
    icon: Lock,
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
      <motion.div
        initial="hidden"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="max-w-6xl mx-auto border-t-2 border-[#1B3B2B] pt-16 flex flex-col md:flex-row justify-between items-end gap-8 mb-16"
      >
        <div className="flex-1">
          <span className={type.eyebrow}>CÓMO FUNCIONA</span>
          <h2 className={type.h2}>De la grabación a una decisión explicada.</h2>
        </div>
        <p className={`flex-1 max-w-md ${type.lead}`}>
          Cinco pasos en un solo recorrido. La inteligencia artificial propone;
          la persona siempre decide.
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
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <motion.li
            key={title}
            variants={fadeUp}
            data-icon-trigger=""
            className="group relative flex flex-col border-t border-[#1B3B2B]/30 pt-6"
          >
            <span className={`${type.label} text-[#7D9B8A]`}>
              {String(index + 1).padStart(2, "0")} /
            </span>
            <span className="mt-4 grid size-14 place-items-center rounded-full border-[1.5px] border-[#1B3B2B]/35 text-[#1B3B2B] transition-colors group-hover:border-[#E05D44] group-hover:text-[#E05D44]">
              <Icon size={26} aria-hidden="true" />
            </span>
            <h3 className={`mt-5 ${type.h3} text-[#1B3B2B]`}>{title}</h3>
            <p className={`mt-2 ${type.body} text-[#1B3B2B]`}>{text}</p>
            {index < STEPS.length - 1 ? (
              <SketchArrow
                delay={0.4 + index * 0.15}
                className="pointer-events-none absolute -right-7 top-16 hidden w-12 text-[#E05D44] md:block"
              />
            ) : null}
          </motion.li>
        ))}
      </motion.ol>

      <motion.div
        initial="hidden"
        whileInView="whileInView"
        viewport={{ once: true }}
        variants={fadeUp}
        className="max-w-6xl mx-auto mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className={type.note}>
          Hoy trabaja con grabaciones exportadas. Las cámaras en vivo llegan con
          el piloto.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 self-start rounded-full border border-[#1B3B2B] px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-[#1B3B2B] transition-colors hover:bg-[#1B3B2B] hover:text-white sm:self-auto"
        >
          Recorrerlo en la demo
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
