"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/eye.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface EyeIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const EyeIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<EyeIconHandle>(null);
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
        <motion.path
          animate={controls}
          d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
          style={{ originY: "50%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          variants={{
            normal: { scaleY: 1, opacity: 1 },
            animate: { scaleY: [1, 0.1, 1], opacity: [1, 0.3, 1] },
          }}
        />
        <motion.circle
          animate={controls}
          cx="12"
          cy="12"
          r="3"
          transition={{ duration: 0.4, ease: "easeInOut" }}
          variants={{
            normal: { scale: 1, opacity: 1 },
            animate: { scale: [1, 0.3, 1], opacity: [1, 0.3, 1] },
          }}
        />
      </svg>
    );
  },
);

EyeIcon.displayName = "EyeIcon";

export { EyeIcon };
