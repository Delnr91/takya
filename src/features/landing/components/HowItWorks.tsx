"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  ArrowUpRight,
  Cpu,
  Frame,
  Lock,
  RadioTower,
  UserCheck,
} from "@/components/icons";
import { SketchArrow } from "./HandDrawn";
import { type } from "./typography";

const STEPS = [
  {
    icon: RadioTower,
    title: "Recibir",
    text: "El video de tus cámaras pasa a TAKYA. El original queda intacto, con su huella digital.",
  },
  {
    icon: Frame,
    title: "Delimitar",
    text: "Marcas la zona que importa. TAKYA solo mira ahí.",
  },
  {
    icon: Cpu,
    title: "Analizar",
    text: "Un detector instalado en tu central revisa una copia, sin internet, y propone candidatos.",
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
          <h2 className={type.h2}>
            Tus cámaras vigilan. TAKYA te dice qué mirar.
          </h2>
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
            {index === 0 ? (
              <span className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`${type.label} rounded-full bg-[#1B3B2B] px-3 py-1 text-[#F4F1EA]`}
                >
                  Grabación · hoy
                </span>
                <span
                  className={`${type.label} rounded-full border border-[#1B3B2B]/40 px-3 py-1 text-[#1B3B2B]`}
                >
                  En vivo · piloto
                </span>
              </span>
            ) : null}
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
        className="max-w-6xl mx-auto mt-14 grid gap-8 border-t border-[#1B3B2B]/30 pt-8 md:grid-cols-[1fr_1fr_auto] md:items-center"
      >
        <p className={`${type.body} text-[#1B3B2B]`}>
          <span className={`${type.label} mb-2 block text-[#E05D44]`}>
            Disponible hoy
          </span>
          Grabaciones exportadas desde tu grabador: TAKYA encuentra el momento,
          lo explica y sella la evidencia.
        </p>
        <p className={`${type.body} text-[#1B3B2B]`}>
          <span className={`${type.label} mb-2 block text-[#7D9B8A]`}>
            En el piloto
          </span>
          Conexión directa a la señal en vivo de tus cámaras, dentro de la misma
          central.
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
