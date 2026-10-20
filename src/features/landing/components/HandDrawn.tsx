"use client";

import { motion } from "framer-motion";

// Trazos a mano que se dibujan al aparecer (técnica de svgartista: pathLength).
// Dan un gesto humano a la página; son decorativos y no se anuncian.

const draw = (delay: number, duration = 0.9) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, margin: "-40px" },
  transition: {
    pathLength: { duration, delay, ease: "easeInOut" as const },
    opacity: { duration: 0.01, delay },
  },
});

export function ScribbleUnderline({
  className,
  delay = 0.3,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <svg
      viewBox="0 0 300 26"
      preserveAspectRatio="none"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d="M5 17C48 9 92 7 140 10c38 2 70 6 104 3 20-2 36-5 51-4"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        {...draw(delay)}
      />
      <motion.path
        d="M40 22c52-4 118-6 180-3"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.55"
        {...draw(delay + 0.45, 0.6)}
      />
    </svg>
  );
}

export function SketchArrow({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <svg
      viewBox="0 0 72 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <motion.path
        d="M4 27c13-14 31-20 56-12"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        {...draw(delay, 0.6)}
      />
      <motion.path
        d="M50 7l12 8-11 10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(delay + 0.5, 0.3)}
      />
    </svg>
  );
}

// Curvas de nivel: el terreno del norte como textura, no como ilustración.
const CONTOURS = Array.from({ length: 9 }, (_, index) => {
  const y = 40 + index * 34;
  const a = 18 + (index % 3) * 9;
  const b = 26 - (index % 4) * 5;
  return `M-20 ${y}C120 ${y - a} 240 ${y + b} 380 ${y - 6}S640 ${y - b} 760 ${y + a / 2}S1000 ${y - a} 1220 ${y + 4}`;
});

export function ContourLines({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 360"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {CONTOURS.map((d, index) => (
        <motion.path
          key={d}
          d={d}
          stroke="currentColor"
          strokeWidth="1.2"
          {...draw(index * 0.12, 2.2)}
        />
      ))}
    </svg>
  );
}

/** Separador entre secciones: una onda corta trazada a mano, no una línea. */
export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto mb-10 flex w-full max-w-6xl justify-center ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 140 24" fill="none" className="h-6 w-36">
        <motion.path
          d="M4 14c10-9 20-9 30 0s20 9 30 0 20-9 30 0 20 9 30 0 6-4 8-4"
          stroke="#E05D44"
          strokeWidth="3"
          strokeLinecap="round"
          {...draw(0, 1.1)}
        />
        <motion.circle
          cx="70"
          cy="14"
          r="3.5"
          fill="#7D9B8A"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.9,
            type: "spring",
            stiffness: 300,
            damping: 14,
          }}
        />
      </svg>
    </div>
  );
}
