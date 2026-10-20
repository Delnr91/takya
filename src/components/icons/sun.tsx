"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/sun.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface SunIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const RAY_VARIANTS: Variants = {
  normal: { opacity: 1 },
  animate: (index: number) => ({
    opacity: [0, 1],
    transition: { delay: index * 0.1, duration: 0.3 },
  }),
};

const RAYS = [
  "M12 2v2",
  "m19.07 4.93-1.41 1.41",
  "M20 12h2",
  "m17.66 17.66 1.41 1.41",
  "M12 20v2",
  "m6.34 17.66-1.41 1.41",
  "M2 12h2",
  "m4.93 4.93 1.41 1.41",
];

const SunIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
  (
    {
      className,
      size = 24,
      strokeWidth = 2,
      color = "currentColor",
      absoluteStrokeWidth,
      ...props
    },
    ref,
  ) => {
    void absoluteStrokeWidth;
    const handleRef = useRef<SunIconHandle>(null);
    const svgRef = useIconTrigger(ref, handleRef);
    const controls = useAnimation();

    useImperativeHandle(handleRef, () => ({
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }));

    return (
      <svg
        ref={svgRef}
        className={className}
        fill="none"
        height={size}
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <circle cx="12" cy="12" r="4" />
        {RAYS.map((d, index) => (
          <motion.path
            animate={controls}
            custom={index + 1}
            d={d}
            key={d}
            variants={RAY_VARIANTS}
          />
        ))}
      </svg>
    );
  },
);

SunIcon.displayName = "SunIcon";

export { SunIcon };
