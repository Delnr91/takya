"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

export type CompanionState = "idle" | "searching" | "found" | "unknown";

// Contours adapted from 000h Agent State; TAKYA retains its own colours and copy.
const contours: Record<CompanionState, string> = {
  idle: "M90 24C116 17 151 32 153 60C157 84 139 96 124 116C111 135 81 141 59 126C34 113 22 85 32 61C43 36 65 31 90 24Z",
  searching:
    "M90 18C120 27 132 19 148 51C163 78 141 92 135 116C127 146 94 137 68 129C40 123 18 98 30 70C40 48 66 7 90 18Z",
  found:
    "M90 24C118 24 145 36 150 63C155 91 134 116 112 125C87 137 63 128 47 113C29 95 25 69 40 47C53 28 66 24 90 24Z",
  unknown:
    "M90 27C121 20 147 29 145 61C143 82 162 111 134 125C108 138 91 114 65 127C35 140 28 101 31 76C34 48 62 33 90 27Z",
};

export function CojeevAgentState({
  state = "idle",
  label,
  description,
  motionOff = false,
  compact = false,
}: {
  state?: CompanionState;
  label: string;
  description: string;
  motionOff?: boolean;
  compact?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const systemReducedMotion = useReducedMotion();
  const animate = !motionOff && !systemReducedMotion;
  return (
    <div
      className={`cojeev-agent ${compact ? "cojeev-agent-compact" : ""}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-state={state}
    >
      <motion.svg
        className="cojeev-agent-field"
        viewBox="0 0 180 160"
        fill="none"
        aria-hidden="true"
        focusable="false"
        initial={false}
        animate={
          animate
            ? { scale: [1, 1.035, 1], rotate: [0, 1, 0] }
            : { scale: 1, rotate: 0 }
        }
        transition={
          animate
            ? {
                duration: state === "searching" ? 4.8 : 8,
                repeat: Infinity,
                ease: "easeInOut",
              }
            : { duration: 0 }
        }
      >
        <defs>
          <radialGradient id={`${id}-body`} cx="30%" cy="20%" r="80%">
            <stop stopColor="#C6E1CA" />
            <stop offset="50%" stopColor="#7D9B8A" />
            <stop offset="100%" stopColor="#1B3B2B" />
          </radialGradient>
          <radialGradient id={`${id}-fold`} cx="65%" cy="25%" r="75%">
            <stop stopColor="#F4F1EA" stopOpacity=".88" />
            <stop offset="55%" stopColor="#D5E1D2" stopOpacity=".45" />
            <stop offset="100%" stopColor="#0C1410" stopOpacity=".13" />
          </radialGradient>
          <clipPath id={`${id}-clip`}>
            <path d={contours[state]} />
          </clipPath>
        </defs>
        <ellipse cx="90" cy="143" rx="43" ry="6" fill="#1B3B2B" opacity=".12" />
        <path
          d={contours[state]}
          fill={`url(#${id}-body)`}
          stroke="#F4F1EA"
          strokeWidth="1.8"
        />
        <g clipPath={`url(#${id}-clip)`}>
          <motion.path
            d="M15 61C51 32 81 110 128 89C165 72 142 24 105 14C163 7 181 113 125 142C74 168 20 125 15 61Z"
            fill={`url(#${id}-fold)`}
            initial={false}
            animate={
              animate ? { x: [0, 6, -3, 0], y: [0, -4, 3, 0] } : { x: 0, y: 0 }
            }
            transition={
              animate
                ? { duration: 10, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0 }
            }
          />
          <path
            d="M28 47C66 18 62 139 126 110C149 99 135 67 159 43"
            stroke="#F4F1EA"
            strokeOpacity=".62"
            strokeWidth="1.5"
          />
          <path
            d="M34 43C74 25 67 142 130 108C151 96 142 63 164 39"
            stroke="#F4F1EA"
            strokeOpacity=".35"
          />
        </g>
        {state === "found" ? (
          <path
            d="m77 79 9 9 19-21"
            stroke="#0C1410"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : state === "unknown" ? (
          <path
            d="M85 73a7 7 0 0 1 14 0c0 5-8 6-8 11M91 94h.01"
            stroke="#0C1410"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M78 78v5M102 78v5M84 92q6 4 12 0"
            stroke="#0C1410"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        )}
      </motion.svg>
      <div className="cojeev-agent-copy">
        <strong>{label}</strong>
        <span>{description}</span>
      </div>
    </div>
  );
}
