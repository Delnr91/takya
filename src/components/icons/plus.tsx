"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/plus.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface PlusIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const PlusIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<PlusIconHandle>(null);
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
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        variants={{
          normal: {
            rotate: 0,
          },
          animate: {
            rotate: 180,
          },
        }}
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"

        {...(props as object)}
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </motion.svg>
    );
  },
);

PlusIcon.displayName = "PlusIcon";

export { PlusIcon };
