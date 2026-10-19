"use client";

// Adaptado de lucide-animated (MIT, pqoqubbw · https://lucide-animated.com/r/volume.json):
// raíz <svg> drop-in de lucide-react; la animación la activa el control que lo contiene.

import { AnimatePresence, motion } from "framer-motion";
import {
  Fragment,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { type AnimatedIconProps, useIconTrigger } from "./use-icon-trigger";

export interface VolumeIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

const VolumeIcon = forwardRef<SVGSVGElement, AnimatedIconProps>(
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
    const handleRef = useRef<VolumeIconHandle>(null);
    const svgRef = useIconTrigger(ref, handleRef);
    const [isHovered, setIsHovered] = useState(false);
    const isControlledRef = useRef(false);

    useImperativeHandle(handleRef, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => setIsHovered(true),
        stopAnimation: () => setIsHovered(false),
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
        <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
        <AnimatePresence initial={false} mode="wait">
          {isHovered ? (
            <Fragment key="volume-icon-active">
              <motion.path
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                d="M16 9a5 5 0 0 1 0 6"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              />
              <motion.path
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
                d="M19.364 18.364a9 9 0 0 0 0-12.728"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              />
            </Fragment>
          ) : (
            <Fragment key="volume-icon-inactive">
              <motion.line
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 1],
                  transition: { delay: 0.1 },
                }}
                exit={{ pathLength: 1, opacity: 1 }}
                initial={{ pathLength: 1, opacity: 1 }}
                x1="22"
                x2="16"
                y1="9"
                y2="15"
              />
              <motion.line
                animate={{
                  pathLength: [0, 1],
                  opacity: [0, 1],
                  transition: { delay: 0.2 },
                }}
                exit={{ pathLength: 1, opacity: 1 }}
                initial={{ pathLength: 1, opacity: 1 }}
                x1="16"
                x2="22"
                y1="9"
                y2="15"
              />
            </Fragment>
          )}
        </AnimatePresence>
      </svg>
    );
  },
);

VolumeIcon.displayName = "VolumeIcon";

export { VolumeIcon };
