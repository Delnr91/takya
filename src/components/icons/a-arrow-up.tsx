"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/a-arrow-up.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface AArrowUpIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const LETTER_VARIANTS: Variants = {
  normal: { opacity: 1, scale: 1 },
  animate: {
    opacity: [0, 1],
    scale: [0.8, 1],
    transition: { duration: 0.3 },
  },
};

const ARROW_VARIANTS: Variants = {
  normal: { opacity: 1, y: 0 },
  animate: {
    opacity: [0, 1],
    y: [10, 0],
    transition: { duration: 0.3, delay: 0.2 },
  },
};

const AArrowUpIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<AArrowUpIconHandle>(null);
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
        <motion.path
          animate={controls}
          d="M3.5 13h6"
          variants={LETTER_VARIANTS}
        />
        <motion.path
          animate={controls}
          d="m2 16 4.5-9 4.5 9"
          variants={LETTER_VARIANTS}
        />
        <motion.path
          animate={controls}
          d="M18 16V7"
          variants={ARROW_VARIANTS}
        />
        <motion.path
          animate={controls}
          d="m14 11 4-4 4 4"
          variants={ARROW_VARIANTS}
        />
      </svg>
    );
  },
);

AArrowUpIcon.displayName = "AArrowUpIcon";

export { AArrowUpIcon };
