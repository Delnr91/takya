"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/frame.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import type { Variants } from "framer-motion";
import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface FrameIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const SPRING = {
  type: "spring",
  stiffness: 160,
  damping: 17,
  mass: 1,
} as const;
const edge = (animate: Record<string, number>): Variants => ({
  normal: { translateX: 0, translateY: 0 },
  animate: { ...animate, transition: SPRING },
});
const TOP = edge({ translateY: -4 });
const BOTTOM = edge({ translateY: 4 });
const LEFT = edge({ translateX: -4 });
const RIGHT = edge({ translateX: 4 });

const FrameIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<FrameIconHandle>(null);
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
        <motion.line
          animate={controls}
          variants={TOP}
          x1={22}
          x2={2}
          y1={6}
          y2={6}
        />
        <motion.line
          animate={controls}
          variants={BOTTOM}
          x1={22}
          x2={2}
          y1={18}
          y2={18}
        />
        <motion.line
          animate={controls}
          variants={LEFT}
          x1={6}
          x2={6}
          y1={2}
          y2={22}
        />
        <motion.line
          animate={controls}
          variants={RIGHT}
          x1={18}
          x2={18}
          y1={2}
          y2={22}
        />
      </svg>
    );
  },
);

FrameIcon.displayName = "FrameIcon";

export { FrameIcon };
