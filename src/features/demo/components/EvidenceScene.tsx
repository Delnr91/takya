import { useId } from "react";
import type { Scenario } from "../schemas/simulation";

/** Illustrative scenes drawn for the local simulation; no camera footage or inference. */
export function EvidenceScene({
  scenario,
  alternate = false,
  second = 0,
}: {
  scenario: Scenario;
  alternate?: boolean;
  second?: number;
}) {
  const id = useId().replaceAll(":", "");
  const drift = second / 3;
  return (
    <svg
      className="demo-scene"
      viewBox="0 0 800 440"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Escena ilustrada: ${scenario === "smoke" ? "columna clara junto a un galpón y personas cerca del acceso" : scenario === "rubble" ? "material junto a un camino y un vehículo" : "ramas y sombras junto a un acceso despejado"}. ${alternate ? "Vista desde el móvil." : "Vista desde la cámara fija."}`}
    >
      <defs>
        <linearGradient id={`${id}-sky`} x2="0" y2="1">
          <stop stopColor="#a8c0c6" />
          <stop offset="1" stopColor="#e9e0ce" />
        </linearGradient>
        <linearGradient id={`${id}-road`} x2="0.3" y2="1">
          <stop stopColor="#a5a998" />
          <stop offset="1" stopColor="#707d74" />
        </linearGradient>
        <linearGradient id={`${id}-hill`} x2="1" y2="1">
          <stop stopColor="#ac9780" />
          <stop offset="1" stopColor="#d0b79b" />
        </linearGradient>
      </defs>
      <rect width="800" height="440" fill={`url(#${id}-sky)`} />
      <circle cx="640" cy="65" r="40" fill="#fff3d6" opacity=".65" />
      <path
        d="M0 200 75 139 135 168 240 66 330 144 420 104 536 175 630 91 750 142 800 117V280H0Z"
        fill={`url(#${id}-hill)`}
      />
      <path
        d="m135 168 105-102-42 137 42-67 90 8-60 42 150-82-72 112 188-41-64 50 158-134-60 119 150-68-47 92H0V200Z"
        fill="#8e8575"
        opacity=".32"
      />
      <path d="M0 226 800 205V440H0Z" fill="#cfbba0" />
      <path d="m363 227 83-7 310 220H45Z" fill={`url(#${id}-road)`} />
      <path
        d="m405 246 14 1 34 30-20 0zm59 58 24 0 70 65-36 1zm92 90 38-1 47 47h-51Z"
        fill="#e2dfc7"
        opacity=".65"
      />
      <g transform={alternate ? "translate(60 0)" : "translate(0 0)"}>
        <path d="m30 215 208-43 114 44-198 51Z" fill="#79877c" />
        <path d="m30 215 124 52v114L30 317Z" fill="#c7cabc" />
        <path d="m154 267 198-51v94l-198 71Z" fill="#a6b4a6" />
        <path d="m207 268 88-25v70l-88 30Z" fill="#354f45" />
        <path
          d="m250 254v74m-31-66v70m60-85v70"
          stroke="#8ba193"
          strokeWidth="3"
        />
        <path
          d="m40 237 107 43m-107-20 107 44m-107-20 107 44"
          stroke="#a3ad9c"
          strokeWidth="3"
        />
      </g>
      <g stroke="#5d7466" strokeWidth="3" opacity=".65">
        <path d="M520 245v-60m60 82v-74m72 104v-93m90 132V211" />
        <path d="m520 213 280 62m-280-42 280 83" />
      </g>
      {scenario === "rubble" ? (
        <g transform={alternate ? "translate(40 -7)" : undefined}>
          <ellipse
            cx="325"
            cy="365"
            rx="140"
            ry="31"
            fill="#535c4e"
            opacity=".22"
          />
          <g stroke="#756f5e" strokeWidth="2">
            <path d="m210 356 35-62 53 23 21 57Z" fill="#a39278" />
            <path d="m291 354 49-89 46 39 5 79Z" fill="#c2b398" />
            <path d="m360 375 24-72 63 46-11 40Z" fill="#918975" />
            <path d="m241 379 36-42 63 41-19 29Z" fill="#d6c7ae" />
            <path d="m181 388 28-44 52 34-8 30Z" fill="#b5a489" />
          </g>
          <path d="m258 301 112 66-14 13-111-65Z" fill="#7a7364" />
        </g>
      ) : null}
      {scenario === "smoke" ? (
        <g
          fill="#edf0e3"
          opacity=".8"
          transform={`translate(${drift} ${-drift / 2})`}
        >
          <ellipse cx="283" cy="208" rx="33" ry="47" />
          <ellipse cx="269" cy="158" rx="42" ry="40" />
          <ellipse cx="288" cy="112" rx="45" ry="38" />
          <ellipse cx="315" cy="73" rx="49" ry="30" />
          <ellipse cx="355" cy="43" rx="51" ry="24" />
        </g>
      ) : null}
      {scenario === "movement" ? (
        <g transform={`rotate(${Math.sin(second / 4) * 3} 640 330)`}>
          <path d="m647 198-12 145" stroke="#6f6b52" strokeWidth="12" />
          <path
            d="m639 259-51-55m56 24 54-62"
            stroke="#6f6b52"
            strokeWidth="7"
          />
          <g fill="#557d61">
            <circle cx="630" cy="170" r="50" />
            <circle cx="584" cy="197" r="42" />
            <circle cx="682" cy="173" r="49" />
            <circle cx="633" cy="218" r="39" />
          </g>
          <ellipse
            cx="557"
            cy="368"
            rx="97"
            ry="24"
            fill="#355842"
            opacity=".3"
          />
        </g>
      ) : (
        <g transform={`translate(${alternate ? 10 : 0} 0)`}>
          <path d="m499 285 10-37 70 0 29 36v45H491v-40Z" fill="#ece9dc" />
          <path d="m518 254 51 0 18 26h-78Z" fill="#6f9296" />
          <path d="M493 294h112v22H493" fill="#365d48" />
          <circle cx="515" cy="329" r="15" fill="#283c34" />
          <circle cx="583" cy="329" r="15" fill="#283c34" />
          <g transform={`translate(${second > 15 ? 6 : 0} 0)`} fill="#274936">
            <circle cx="435" cy="277" r="10" />
            <path d="M427 291h17l6 34h-28Z" />
            <path
              d="m430 323-6 32m15-32 6 32"
              stroke="#274936"
              strokeWidth="7"
            />
          </g>
        </g>
      )}
      <rect
        x={scenario === "movement" ? 518 : scenario === "rubble" ? 175 : 231}
        y={scenario === "movement" ? 145 : scenario === "rubble" ? 261 : 70}
        width={scenario === "smoke" ? 142 : 280}
        height={scenario === "smoke" ? 192 : 155}
        rx="5"
        fill="none"
        stroke="#f8cf86"
        strokeWidth="2"
        strokeDasharray="12 7"
      />
      <path
        d="M0 427H800"
        stroke="#102b24"
        strokeWidth="26"
        opacity={alternate ? ".85" : ".15"}
      />
      <rect width="800" height="440" fill="#173b2b" opacity=".04" />
    </svg>
  );
}
