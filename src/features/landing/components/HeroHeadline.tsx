"use client";

import { motion, type Variants } from "framer-motion";
import { ScribbleUnderline } from "./HandDrawn";

// Titular que aparece palabra por palabra, de desenfocado a nítido (idea de
// «Text Effect» de motion-primitives). El lector de pantalla lee la frase
// completa una sola vez.

const word: Variants = {
  hidden: { opacity: 0, y: "0.35em", filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

function Words({ text }: { text: string }) {
  return text.split(" ").map((part, index) => (
    <motion.span
      key={`${part}-${index}`}
      variants={word}
      className="inline-block"
    >
      {part}
      {index < text.split(" ").length - 1 ? " " : null}
    </motion.span>
  ));
}

export function HeroHeadline() {
  return (
    <motion.h1
      aria-label="Comprender antes de actuar."
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
      }}
      className="font-display text-[clamp(2.75rem,14vw,3.75rem)] md:text-[clamp(5rem,8.2vw,7.5rem)] font-extrabold leading-[0.9] tracking-[-0.07em] text-[#1B3B2B] mb-8"
    >
      <span aria-hidden="true" className="block">
        <Words text="Comprender" />
      </span>
      <span aria-hidden="true" className="block pl-[10%] md:pl-[16%]">
        <Words text="antes de" />
      </span>
      <span
        aria-hidden="true"
        className="block pl-[3%] md:pl-[7%] text-[#E05D44]"
      >
        <motion.span variants={word} className="relative inline-block">
          actuar
          <ScribbleUnderline
            delay={1.1}
            className="absolute -bottom-1 left-0 h-[0.18em] w-full text-[#1B3B2B]/80 md:-bottom-2"
          />
        </motion.span>
        <motion.span
          variants={{
            hidden: { opacity: 0, scale: 0 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { type: "spring", stiffness: 420, damping: 14 },
            },
          }}
          className="inline-block text-[#cde467]"
        >
          .
        </motion.span>
      </span>
    </motion.h1>
  );
}
