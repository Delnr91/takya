"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/login.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.
// Se añade el estado «normal» (el original no lo define) para que la flecha vuelva a su lugar.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface LogInIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const PATH_VARIANTS: Variants = {
  normal: { translateX: 0 },
  animate: {
    translateX: [0, 3, 0],
    transition: { duration: 0.4 },
  },
};

const LogInIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<LogInIconHandle>(null);
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
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <motion.polyline
          animate={controls}
          points="10 17 15 12 10 7"
          variants={PATH_VARIANTS}
        />
        <motion.line
          animate={controls}
          variants={PATH_VARIANTS}
          x1="3"
          x2="15"
          y1="12"
          y2="12"
        />
      </svg>
    );
  },
);

LogInIcon.displayName = "LogInIcon";

export { LogInIcon };
