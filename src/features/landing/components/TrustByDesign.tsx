"use client";

import { motion, type Variants } from "framer-motion";
import {
  CircleHelp,
  Cpu,
  EyeOff,
  FileCheck,
  Layers3,
  UserCheck,
} from "@/components/icons";
import { AnimatedNumber } from "./AnimatedNumber";
import { SectionDivider } from "./HandDrawn";
import { type } from "./typography";
import { SectionTitle } from "./SectionTitle";

const PRINCIPLES = [
  {
    icon: UserCheck,
    title: "Humano al mando",
    text: "La inteligencia artificial sugiere. La persona decide y deja registrado por qué.",
  },
  {
    icon: EyeOff,
    title: "Sin biometría",
    text: "No reconoce rostros ni identidades. Tampoco vigila al operador.",
  },
  {
    icon: Cpu,
    title: "Se instala en tu central",
    text: "El video no sale de ahí: se analiza en un computador de la central, sin enviarlo a la nube.",
  },
  {
    icon: FileCheck,
    title: "Evidencia sellada",
    text: "Cada entrega va firmada y cifrada. Cualquiera puede comprobar, incluso sin internet, que nadie la alteró.",
  },
  {
    icon: CircleHelp,
    title: "Muestra lo que no sabe",
    text: "Si falta la hora real, la identidad o el contexto, lo dice. Sin falsas certezas.",
  },
  {
    icon: Layers3,
    title: "Con lo que ya existe",
    text: "Trabaja con las grabaciones del equipo que ya tienes, sin cambiar cámaras.",
  },
];

const PROOF = [
  {
    value: 3,
    suffix: "/3",
    label:
      "intentos de alterar la evidencia detectados en nuestras pruebas. Si alguien cambia un solo dato, la verificación lo detecta.",
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

/** Sección «Confianza por diseño»: principios, pruebas y marco legal. */
export function TrustByDesign() {
  return (
    <section
      id="confianza"
      className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-28 scroll-mt-28"
    >
      <SectionDivider />
      <motion.div
        initial="hidden"
        whileInView="whileInView"
        viewport={{ once: true, margin: "-60px" }}
        variants={fadeUp}
        className="max-w-6xl mx-auto pt-6"
      >
        <span className={type.eyebrow}>CONFIANZA POR DISEÑO</span>
        <SectionTitle
          lead="Evidencia que se puede"
          accent="comprobar"
          after="."
          className="max-w-3xl"
        />
      </motion.div>

      <div className="max-w-6xl mx-auto mt-16 grid gap-14 lg:grid-cols-12">
        <motion.dl
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            whileInView: { transition: { staggerChildren: 0.15 } },
          }}
          className="grid content-start gap-8 lg:col-span-5"
        >
          {PROOF.map(({ value, suffix, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="flex flex-col-reverse pt-5"
            >
              <dt className={`mt-2 max-w-sm ${type.body} text-[#1B3B2B]`}>
                {label}
              </dt>
              <dd className={`${type.stat} text-[#1B3B2B]`}>
                <AnimatedNumber value={value} />
                {suffix ? (
                  <span className="text-[#E05D44]">{suffix}</span>
                ) : null}
              </dd>
            </motion.div>
          ))}
          <p className={type.note}>
            Resultados de pruebas en laboratorio. El piloto con operadores está
            en preparación.
          </p>
        </motion.dl>

        <motion.ul
          initial="hidden"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            whileInView: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:col-span-7"
        >
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <motion.li
              key={title}
              variants={fadeUp}
              data-icon-trigger=""
              className="group flex gap-4 pt-5"
            >
              <Icon
                size={24}
                aria-hidden="true"
                className="mt-1 shrink-0 text-[#1B3B2B] transition-colors group-hover:text-[#E05D44]"
              />
              <span>
                <strong className={`block ${type.h3} text-[#1B3B2B]`}>
                  {title}
                </strong>
                <span className={`mt-1 block ${type.body} text-[#1B3B2B]`}>
                  {text}
                </span>
              </span>
            </motion.li>
          ))}
          <motion.li
            variants={fadeUp}
            className={`sm:col-span-2 pt-5 ${type.body} text-[#1B3B2B]`}
          >
            Pensado para la{""}
            <a
              href="https://www.bcn.cl/leychile/navegar?idNorma=1209272"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-[#E05D44] decoration-2 underline-offset-4 hover:text-[#E05D44]"
            >
              Ley 21.719
            </a>
            {""}
            de protección de datos personales, vigente desde el 1 de diciembre
            de 2026. Cada implementación se revisa con asesoría legal.
          </motion.li>
        </motion.ul>
      </div>
    </section>
  );
}
