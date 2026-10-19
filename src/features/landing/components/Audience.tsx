"use client";

import { motion, type Variants } from "framer-motion";
import {
  FileCheck,
  Layers3,
  RadioTower,
  ShieldCheck,
} from "@/components/icons";
import { type } from "./typography";

const AUDIENCES = [
  {
    icon: RadioTower,
    title: "Centrales municipales",
    text: "Más cámaras sin más carga para quien las mira.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad privada y condominios",
    text: "Encontrar y entregar el video justo después de un hecho.",
  },
  {
    icon: Layers3,
    title: "Comercio, industria y minería",
    text: "Revisar largas grabaciones con foco en lo que importa.",
  },
  {
    icon: FileCheck,
    title: "Policías y fiscalía",
    text: "Recibir evidencia ordenada, explicada y verificable.",
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

/** «Pensado para»: a quién sirve TAKYA, en una línea por público. */
export function Audience() {
  return (
    <motion.div
      initial="hidden"
      whileInView="whileInView"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        whileInView: { transition: { staggerChildren: 0.1 } },
      }}
      className="max-w-6xl mx-auto mt-20"
    >
      <motion.h3 variants={fadeUp} className={`${type.label} text-[#7D9B8A]`}>
        Pensado para
      </motion.h3>
      <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map(({ icon: Icon, title, text }) => (
          <motion.li
            key={title}
            variants={fadeUp}
            data-icon-trigger=""
            className="group flex flex-col border-t border-[#1B3B2B]/30 pt-5"
          >
            <Icon
              size={26}
              aria-hidden="true"
              className="text-[#1B3B2B] transition-colors group-hover:text-[#E05D44]"
            />
            <strong className={`mt-4 ${type.h3} text-[#1B3B2B]`}>
              {title}
            </strong>
            <span className={`mt-2 ${type.body} text-[#1B3B2B]`}>{text}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
