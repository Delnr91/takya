"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

type DepthPoint = {
  x: number;
  y: number;
  size: number;
  layer: number;
  angle: number;
  shape: number;
};

// Stable, perspective-based placement adapted from 000h Depth Background.
function depthPoints(seed: string, density: number): DepthPoint[] {
  let hash = 2166136261;
  for (const char of seed)
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  const next = () => {
    hash = (hash + 0x6d2b79f5) | 0;
    let value = Math.imul(hash ^ (hash >>> 15), 1 | hash);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const count = Math.max(5, Math.min(22, Math.round(18 * density)));
  return Array.from({ length: count }, (_, index) => {
    let x = next() * 100;
    const y = next() * 100;
    if (x > 26 && x < 74 && y > 22 && y < 78)
      x = x < 50 ? 4 + next() * 20 : 76 + next() * 20;
    const layer = index % 3;
    return {
      x,
      y,
      layer,
      size: ([24, 37, 55][layer] ?? 24) + next() * 10,
      angle: next() * 360,
      shape: index % 4,
    };
  });
}

function OrbitalGlyph({ shape }: { shape: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      aria-hidden="true"
    >
      {shape === 0 ? (
        <>
          <ellipse
            cx="32"
            cy="32"
            rx="27"
            ry="11"
            transform="rotate(-28 32 32)"
          />
          <ellipse
            cx="32"
            cy="32"
            rx="11"
            ry="27"
            transform="rotate(-28 32 32)"
          />
          <circle cx="32" cy="32" r="4" fill="currentColor" stroke="none" />
        </>
      ) : shape === 1 ? (
        <>
          <circle cx="32" cy="32" r="22" />
          <circle cx="32" cy="32" r="10" />
          <path d="M32 3V11M32 53V61M3 32H11M53 32H61" />
          <circle cx="49" cy="19" r="3" fill="currentColor" stroke="none" />
        </>
      ) : shape === 2 ? (
        <>
          <path d="M32 5Q36 26 59 32Q37 36 32 59Q28 36 5 32Q28 27 32 5Z" />
          <circle cx="32" cy="32" r="9" />
        </>
      ) : (
        <>
          <rect
            x="15"
            y="15"
            width="34"
            height="34"
            rx="9"
            transform="rotate(28 32 32)"
          />
          <path d="M7 24L57 40M24 7L40 57" />
          <circle cx="32" cy="32" r="5" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}

export function CojeevDepthBackground({
  seed = "takya",
  density = 1,
  intensity = 1,
  motionOff = false,
  className = "",
}: {
  seed?: string;
  density?: number;
  intensity?: number;
  motionOff?: boolean;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const points = useMemo(() => depthPoints(seed, density), [seed, density]);

  useEffect(() => {
    const element = host.current;
    if (!element || motionOff) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reduced.matches) return;
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX / window.innerWidth - 0.5) * 22 * intensity;
        const y = (event.clientY / window.innerHeight - 0.5) * 16 * intensity;
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          element.style.setProperty("--cojeev-pointer-x", `${x.toFixed(1)}px`);
          element.style.setProperty("--cojeev-pointer-y", `${y.toFixed(1)}px`);
        }
        frame = 0;
      });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [intensity, motionOff]);

  return (
    <div
      ref={host}
      className={`cojeev-depth-field ${className}`}
      data-motion-off={motionOff || undefined}
      aria-hidden="true"
    >
      <div className="cojeev-depth-scene">
        {points.map((point, index) => {
          const layerOpacity =
            ([0.23, 0.35, 0.46][point.layer] ?? 0.23) * intensity;
          const style = {
            left: `${point.x}%`,
            top: `${point.y}%`,
            width: point.size,
            opacity: layerOpacity,
            color:
              index % 5 === 0 ? "#E05D44" : index % 2 ? "#7D9B8A" : "#1B3B2B",
            animationDelay: `${-index * 1.7}s`,
            "--cojeev-z": `${[-260, -75, 120][point.layer]}px`,
            "--cojeev-angle": `${point.angle}deg`,
            "--cojeev-speed": String([0.35, 0.65, 1][point.layer]),
          } as CSSProperties;
          return (
            <span
              className="cojeev-depth-piece"
              style={style}
              key={`${seed}-${index}`}
            >
              <OrbitalGlyph shape={point.shape} />
            </span>
          );
        })}
      </div>
    </div>
  );
}
