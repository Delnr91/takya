"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/leaf.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface LeafIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const LEAF_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    y: 0,
    x: 0,
  },
  animate: {
    rotate: [0, -8, 4, -3, 0],
    y: [0, -4, -2, -1, 0],
    x: [0, 2, -2, 1, 0],
    transition: {
      duration: 1.6,
      ease: "easeInOut",
    },
  },
};

const LeafIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<LeafIconHandle>(null);
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
      <motion.svg
        ref={svgRef}
        className={className}
        animate={controls}
        fill="none"
        height={size}
        initial="normal"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        style={{ overflow: "visible" }}
        variants={LEAF_VARIANTS}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"

        {...(props as object)}
      >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
      </motion.svg>
    );
  },
);

LeafIcon.displayName = "LeafIcon";

export { LeafIcon };
