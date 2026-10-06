import { Flame, HelpCircle, Send, Truck } from "lucide-react";
import type { Scenario } from "../schemas/simulation";
import { scenarios } from "../data/scenarios";
import { Pictogram } from "./DemoPrimitives";

export function OperationalBrief({ scenario }: { scenario: Scenario }) {
  const content = scenarios[scenario];
  if (!content.verdict) return null;
  return (
    <div className="incident-brief" data-priority={content.severity}>
      <Pictogram
        icon={
          scenario === "fire"
            ? Flame
            : scenario === "dumping"
              ? Truck
              : HelpCircle
        }
        tone={scenario === "fire" ? "orange" : "neutral"}
      />
      <p className="demo-eyebrow">Lectura del caso</p>
      <h2>{content.verdict}</h2>
      <div className="incident-suggestion">
        <Send size={18} aria-hidden="true" />
        <span>
          <small>Siguiente acción sugerida</small>
          <strong>{content.suggestion}</strong>
        </span>
      </div>
      <ol>
        {content.actionSteps?.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className="incident-human-note">Tú confirmas la acción y el motivo.</p>
    </div>
  );
}
