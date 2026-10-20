"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/lock.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface LockIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const BODY_VARIANTS: Variants = {
  normal: { rotate: 0, scale: 1 },
  animate: {
    rotate: [-3, 1, -2, 0],
    scale: [0.95, 1.05, 0.98, 1],
    transition: { duration: 1, ease: [0.4, 0, 0.2, 1] },
  },
};

const SHACKLE_VARIANTS: Variants = {
  normal: { pathLength: 1 },
  animate: {
    pathLength: 0.7,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

const LockIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<LockIconHandle>(null);
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
        <motion.g
          animate={controls}
          initial="normal"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          variants={BODY_VARIANTS}
        >
          <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
          <motion.path
            animate={controls}
            d="M7 11V7a5 5 0 0 1 10 0v4"
            initial="normal"
            variants={SHACKLE_VARIANTS}
          />
        </motion.g>
      </svg>
    );
  },
);

LockIcon.displayName = "LockIcon";

export { LockIcon };
