"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/bot.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import { motion, useAnimation } from "framer-motion";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface BotIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const BotIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<BotIconHandle>(null);
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
        <path d="M12 8V4H8" />
        <rect height="12" rx="2" width="16" x="4" y="8" />
        <path d="M2 14h2" />
        <path d="M20 14h2" />

        <motion.line
          animate={controls}
          initial="normal"
          variants={{
            normal: { y1: 13, y2: 15 },
            animate: {
              y1: [13, 14, 13],
              y2: [15, 14, 15],
              transition: {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.2,
              },
            },
          }}
          x1={15}
          x2={15}
        />

        <motion.line
          animate={controls}
          initial="normal"
          variants={{
            normal: { y1: 13, y2: 15 },
            animate: {
              y1: [13, 14, 13],
              y2: [15, 14, 15],
              transition: {
                duration: 0.5,
                ease: "easeInOut",
                delay: 0.2,
              },
            },
          }}
          x1={9}
          x2={9}
        />
      </svg>
    );
  },
);

BotIcon.displayName = "Bot";

export { BotIcon };
