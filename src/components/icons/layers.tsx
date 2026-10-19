"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/layers.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Transition } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface LayersIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const DEFAULT_TRANSITION: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 14,
  mass: 1,
};

const LayersIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<LayersIconHandle>(null);
    const svgRef = useIconTrigger(ref, handleRef);
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(handleRef, () => {
      isControlledRef.current = true;

      return {
        startAnimation: async () => {
          await controls.start("firstState");
          await controls.start("secondState");
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
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
        <motion.path
          animate={controls}
          d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"
          transition={DEFAULT_TRANSITION}
          variants={{
            normal: { y: 0 },
            firstState: { y: -9 },
            secondState: { y: 0 },
          }}
        />
        <motion.path
          animate={controls}
          d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
          transition={DEFAULT_TRANSITION}
          variants={{
            normal: { y: 0 },
            firstState: { y: -5 },
            secondState: { y: 0 },
          }}
        />
      </svg>
    );
  },
);

LayersIcon.displayName = "LayersIcon";

export { LayersIcon };
