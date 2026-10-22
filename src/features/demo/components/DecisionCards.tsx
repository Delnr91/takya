"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUpRight, Check, CircleCheck, X } from "lucide-react";
import { reasons } from "../data/scenarios";
import type { Decision, Outcome } from "../schemas/simulation";
import "./analysis-sim.css";

// Las mismas tres decisiones en toda la consola.
export const OUTCOMES: Record<
  Outcome,
  { label: string; detail: string; icon: typeof Check }
> = {
  VERIFIED: {
    label: "Verificar",
    detail: "Confirmo lo que veo",
    icon: CircleCheck,
  },
  ESCALATED: { label: "Derivar", detail: "Pido apoyo", icon: ArrowUpRight },
  DISMISSED: { label: "Descartar", detail: "No corresponde", icon: X },
};
const DESTINATIONS = ["Supervisión municipal", "Equipo en terreno"] as const;

/**
 * Paso «Decidir»: tarjetas 3D (Verificar, Derivar, Descartar), el motivo y,
 * si se deriva, a quién. Nada se registra hasta «Registrar decisión»; se puede
 * volver al paso anterior sin perder lo elegido.
 */
export function DecisionCards({
  disabled = false,
  onBack,
  onConfirm,
}: {
  disabled?: boolean;
  onBack: () => void;
  onConfirm: (decision: Decision) => void;
}) {
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState<
    (typeof DESTINATIONS)[number] | null
  >(null);

  return (
    <div className="analysis-decide">
      <h2>¿Qué decides?</h2>
      <div
        className="analysis-outcomes"
        role="radiogroup"
        aria-label="Decisión"
      >
        {(Object.keys(OUTCOMES) as Outcome[]).map((key) => {
          const item = OUTCOMES[key];
          const Icon = item.icon;
          return (
            <button
              type="button"
              role="radio"
              aria-checked={outcome === key}
              key={key}
              disabled={disabled}
              className="analysis-outcome"
              data-outcome={key}
              onClick={() => {
                setOutcome(key);
                setReason("");
                setDestination(null);
              }}
            >
              <Icon aria-hidden="true" />
              <strong>{item.label}</strong>
              <small>{item.detail}</small>
            </button>
          );
        })}
      </div>
      {outcome ? (
        <fieldset className="analysis-reasons">
          <legend>¿Por qué?</legend>
          {reasons[outcome].map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="decision-reason"
                checked={reason === item}
                onChange={() => setReason(item)}
              />
              {item}
            </label>
          ))}
        </fieldset>
      ) : null}
      {outcome === "ESCALATED" ? (
        <fieldset className="analysis-reasons">
          <legend>¿A quién derivas?</legend>
          {DESTINATIONS.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="decision-destination"
                checked={destination === item}
                onChange={() => setDestination(item)}
              />
              {item}
            </label>
          ))}
        </fieldset>
      ) : null}
      <div className="analysis-actions">
        <button
          type="button"
          className="demo-button demo-button-secondary"
          onClick={onBack}
        >
          <ArrowLeft aria-hidden="true" /> Volver
        </button>
        <button
          type="button"
          className="demo-button demo-button-primary analysis-next"
          disabled={
            disabled ||
            !outcome ||
            !reason ||
            (outcome === "ESCALATED" && !destination)
          }
          onClick={() =>
            outcome &&
            onConfirm({
              outcome,
              reason,
              notes: "",
              destination: outcome === "ESCALATED" ? destination : null,
            })
          }
        >
          <Check aria-hidden="true" /> Registrar decisión
        </button>
      </div>
    </div>
  );
}
