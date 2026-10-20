"use client";

import { motion, type Variants } from "framer-motion";
import { ScribbleUnderline } from "./HandDrawn";
import { type } from "./typography";

// Títulos de sección con el mismo gesto del titular principal: verde bosque,
// la idea clave en naranjo con subrayado a mano y aparición palabra por
// palabra al entrar en pantalla.

const word: Variants = {
  hidden: { opacity: 0, y: "0.3em", filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function Words({ text }: { text: string }) {
  const parts = text.split(" ");
  return parts.map((part, index) => (
    <motion.span
      key={`${part}-${index}`}
      variants={word}
      className="inline-block"
    >
      {part}
      {index < parts.length - 1 ? " " : null}
    </motion.span>
  ));
}

export function SectionTitle({
  lead,
  accent,
  after = "",
  className = "",
}: {
  /** Parte en verde bosque. */
  lead: string;
  /** Idea clave en naranjo, subrayada a mano. */
  accent: string;
  /** Texto final opcional (por ejemplo, un punto). */
  after?: string;
  className?: string;
}) {
  return (
    <motion.h2
      aria-label={`${lead} ${accent}${after}`.trim()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
      className={`${type.h2} ${className}`}
    >
      <span aria-hidden="true">
        {lead ? (
          <>
            <Words text={lead} />{" "}
          </>
        ) : null}
        <span className="relative inline-block text-[#E05D44]">
          <Words text={accent} />
          <ScribbleUnderline
            delay={0.6}
            className="absolute -bottom-2 left-0 h-[0.16em] w-full text-[#E05D44]/70"
          />
        </span>
        {after}
      </span>
    </motion.h2>
  );
}
