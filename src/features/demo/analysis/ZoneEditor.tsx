"use client";

import { useState } from "react";
import { RotateCcw, X } from "@/components/icons";
import { evidenceUrl, type Source } from "./contracts";
import { polygonProblem, rectangle, type Point } from "./zone";

type Mode = "draw" | "rect";

const DEFAULT_RECT = [20, 20, 80, 90];
const round = (v: number) =>
  Math.round(Math.min(1, Math.max(0, v)) * 10000) / 10000;

function evaluate(mode: Mode, points: Point[], rect: number[]) {
  const polygon: Point[] =
    mode === "draw"
      ? points
      : rectangle(
          rect[0]! / 100,
          rect[1]! / 100,
          rect[2]! / 100,
          rect[3]! / 100,
        );
  const rectOk =
    rect.every((v) => Number.isFinite(v) && v >= 0 && v <= 100) &&
    rect[0]! < rect[2]! &&
    rect[1]! < rect[3]!;
  const problem =
    mode === "rect" && !rectOk
      ? "La zona debe tener ancho y alto positivos, dentro de la imagen."
      : polygonProblem(polygon);
  return { polygon, problem };
}

/** Zona válida inicial, igual a la que muestra el editor al abrirse. */
export const defaultZone = (): Point[] =>
  rectangle(
    DEFAULT_RECT[0]! / 100,
    DEFAULT_RECT[1]! / 100,
    DEFAULT_RECT[2]! / 100,
    DEFAULT_RECT[3]! / 100,
  );

/** Zona dibujada tocando esquinas sobre el video, con alternativa por porcentajes. */
export function ZoneEditor({
  source,
  onChange,
}: {
  source: Source;
  onChange: (polygon: Point[] | null) => void;
}) {
  const [mode, setMode] = useState<Mode>("draw");
  const [points, setPoints] = useState<Point[]>(defaultZone);
  const [drawing, setDrawing] = useState(true);
  const [rect, setRect] = useState(DEFAULT_RECT);
  const { polygon, problem } = evaluate(mode, points, rect);

  // El padre recibe la zona solo cuando es válida (null si no).
  function update(next: { mode?: Mode; points?: Point[]; rect?: number[] }) {
    const m = next.mode ?? mode;
    const p = next.points ?? points;
    const r = next.rect ?? rect;
    if (next.mode) setMode(m);
    if (next.points) setPoints(p);
    if (next.rect) setRect(r);
    const result = evaluate(m, p, r);
    onChange(result.problem ? null : result.polygon);
  }

  function addPoint(e: React.PointerEvent<SVGSVGElement>) {
    if (!drawing || mode !== "draw" || points.length >= 32) return;
    const box = e.currentTarget.getBoundingClientRect();
    const p: Point = [
      round((e.clientX - box.left) / box.width),
      round((e.clientY - box.top) / box.height),
    ];
    update({ points: [...points, p] });
  }

  const path = polygon.map((p) => `${p[0] * 100},${p[1] * 100}`).join(" ");

  return (
    <div className="analysis-zone-editor">
      <div
        className="analysis-segmented"
        role="radiogroup"
        aria-label="Forma de marcar la zona"
      >
        <button
          type="button"
          role="radio"
          aria-checked={mode === "draw"}
          onClick={() => update({ mode: "draw" })}
        >
          Dibujar sobre el video
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === "rect"}
          onClick={() => update({ mode: "rect" })}
        >
          Rectángulo por porcentajes
        </button>
      </div>

      <div
        className="analysis-zone-video"
        style={{ aspectRatio: `${source.width} / ${source.height}` }}
      >
        <video
          controls={mode === "rect" || !drawing}
          preload="metadata"
          src={evidenceUrl(source.id)}
          aria-label="Vista de la fuente para definir la zona"
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={mode === "draw" && drawing ? "is-drawing" : undefined}
          onPointerDown={addPoint}
          aria-hidden="true"
        >
          {polygon.length >= 3 ? (
            <polygon
              points={path}
              className={problem ? "is-invalid" : undefined}
            />
          ) : null}
          {polygon.length > 0 && polygon.length < 3 ? (
            <polyline points={path} />
          ) : null}
          {mode === "draw"
            ? points.map((p, i) => (
                <circle
                  key={`${p[0]}-${p[1]}-${i}`}
                  cx={p[0] * 100}
                  cy={p[1] * 100}
                  r={1.6}
                />
              ))
            : null}
        </svg>
      </div>

      {mode === "draw" ? (
        <>
          <p>
            {drawing
              ? "Toca las esquinas de la zona en orden (3 a 32 puntos). La zona se cierra sola."
              : "Dibujo en pausa: puedes reproducir el video para elegir mejor."}{" "}
            Esquinas marcadas: {points.length}.
          </p>
          <div className="analysis-zone-actions">
            <button type="button" onClick={() => setDrawing((d) => !d)}>
              {drawing ? "Pausar dibujo y ver el video" : "Seguir dibujando"}
            </button>
            <button
              type="button"
              disabled={points.length === 0}
              onClick={() => update({ points: points.slice(0, -1) })}
            >
              <RotateCcw aria-hidden="true" /> Deshacer esquina
            </button>
            <button
              type="button"
              disabled={points.length === 0}
              onClick={() => {
                update({ points: [] });
                setDrawing(true);
              }}
            >
              <X aria-hidden="true" /> Borrar zona
            </button>
          </div>
          <p className="analysis-muted">
            Sin mouse ni pantalla táctil, usa «Rectángulo por porcentajes» con
            el teclado.
          </p>
        </>
      ) : (
        <>
          <p>
            Define un rectángulo con porcentajes de la imagen. Puedes usar Tab y
            las flechas del teclado.
          </p>
          <div className="analysis-fields">
            {["Izquierda (%)", "Arriba (%)", "Derecha (%)", "Abajo (%)"].map(
              (label, i) => (
                <label key={label}>
                  {label}
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={rect[i]}
                    onChange={(e) =>
                      update({
                        rect: rect.map((v, j) =>
                          j === i ? Number(e.target.value) : v,
                        ),
                      })
                    }
                  />
                </label>
              ),
            )}
          </div>
        </>
      )}
      {problem ? <p role="alert">{problem}</p> : null}
    </div>
  );
}
