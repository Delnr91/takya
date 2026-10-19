"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/radio-tower.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface RadioTowerIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const VARIANTS: Variants = {
  normal: {
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
  fadeOut: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
  fadeIn: (i: number) => ({
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: i * 0.1,
    },
  }),
};

const RadioTowerIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<RadioTowerIconHandle>(null);
    const svgRef = useIconTrigger(ref, handleRef);
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(handleRef, () => {
      isControlledRef.current = true;

      return {
        startAnimation: async () => {
          await controls.start("fadeOut");
          controls.start("fadeIn");
        },
        stopAnimation: () => controls.start("normal"),
      };
    });

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
          custom={1}
          d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9"
          initial={{ opacity: 1 }}
          variants={VARIANTS}
        />
        <motion.path
          animate={controls}
          custom={0}
          d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5"
          initial={{ opacity: 1 }}
          variants={VARIANTS}
        />
        <circle cx="12" cy="9" r="2" />
        <motion.path
          animate={controls}
          custom={0}
          d="M16.2 4.8c2 2 2.26 5.11.8 7.47"
          initial={{ opacity: 1 }}
          variants={VARIANTS}
        />
        <motion.path
          animate={controls}
          custom={1}
          d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1"
          initial={{ opacity: 1 }}
          variants={VARIANTS}
        />
        <path d="M9.5 18h5" />
        <path d="m8 22 4-11 4 11" />
      </svg>
    );
  },
);

RadioTowerIcon.displayName = "RadioTowerIcon";

export { RadioTowerIcon };
