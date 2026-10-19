"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/arrow-up-right.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface ArrowUpRightIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const ARROW_VARIANTS: Variants = {
  normal: {
    scale: 1,
    translateX: 0,
    translateY: 0,
  },
  animate: {
    scale: [1, 0.85, 1],
    translateX: [0, -4, 0],
    translateY: [0, 4, 0],
    originX: 1,
    originY: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const ArrowUpRightIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<ArrowUpRightIconHandle>(null);
    const svgRef = useIconTrigger(ref, handleRef);
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(handleRef, () => {
      isControlledRef.current = true;
      return {
        startAnimation: () => controls.start("animate"),
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
        <motion.g animate={controls} variants={ARROW_VARIANTS}>
          <path d="M7 7H17" />
          <path d="M17 7V17" />
          <path d="M7 17L17 7" />
        </motion.g>
      </svg>
    );
  },
);

ArrowUpRightIcon.displayName = "ArrowUpRightIcon";

export { ArrowUpRightIcon };
