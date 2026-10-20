"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const format = (value: number) => Math.round(value).toLocaleString("es-CL");

/**
 * Cifra que cuenta desde cero al entrar en pantalla (idea de «Animated Number»
 * de motion-primitives). El lector de pantalla recibe solo el valor final.
 */
export function AnimatedNumber({
  value,
  duration = 1.6,
}: {
  value: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();

  // Parte en cero antes de verse, para que el conteo no salte.
  useEffect(() => {
    if (!reduceMotion && ref.current && !inView) ref.current.textContent = "0";
  }, [reduceMotion, inView]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
