"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/cpu.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface CpuIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const TRANSITION = { duration: 0.5, ease: "easeInOut", repeat: 1 } as const;

const Y_VARIANTS: Variants = {
  normal: { scaleY: 1, opacity: 1 },
  animate: {
    scaleY: [1, 1.5, 1],
    opacity: [1, 0.8, 1],
    transition: TRANSITION,
  },
};

const X_VARIANTS: Variants = {
  normal: { scaleX: 1, opacity: 1 },
  animate: {
    scaleX: [1, 1.5, 1],
    opacity: [1, 0.8, 1],
    transition: TRANSITION,
  },
};

const CpuIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<CpuIconHandle>(null);
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
        <rect height="16" rx="2" width="16" x="4" y="4" />
        <rect height="6" rx="1" width="6" x="9" y="9" />
        {["M15 2v2", "M15 20v2", "M9 2v2", "M9 20v2"].map((d) => (
          <motion.path animate={controls} d={d} key={d} variants={Y_VARIANTS} />
        ))}
        {["M2 15h2", "M2 9h2", "M20 15h2", "M20 9h2"].map((d) => (
          <motion.path animate={controls} d={d} key={d} variants={X_VARIANTS} />
        ))}
      </svg>
    );
  },
);

CpuIcon.displayName = "CpuIcon";

export { CpuIcon };
