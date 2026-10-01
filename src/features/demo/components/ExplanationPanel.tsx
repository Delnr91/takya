import {
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  Eye,
  Layers3,
  Lightbulb,
} from "lucide-react";
import { localAssessment } from "../model/cognitive";
import type { Incident } from "../schemas/simulation";
import { Pictogram } from "./DemoPrimitives";

export function ExplanationPanel({
  incident,
  readOnly,
  onContinue,
}: {
  incident: Incident;
  readOnly: boolean;
  onContinue: () => void;
}) {
  const assessment = localAssessment(incident);
  return (
    <div className="demo-explanation">
      <div className="demo-explanation-title">
        <Pictogram icon={Lightbulb} />
        <div>
          <p className="demo-eyebrow">Copiloto TAKYA</p>
          <h2>Por qué reunimos estos avisos</h2>
        </div>
      </div>
      <p className="demo-lead">{assessment.explanation}</p>
      <div className="demo-signal-grid">
        <div>
          <Pictogram icon={Layers3} small />
          <strong>{incident.alerts.length} avisos, un caso</strong>
          <p>Dos fuentes del mismo sector.</p>
        </div>
        <div>
          <Pictogram icon={Clock3} small />
          <strong>Dentro de 24 segundos</strong>
          <p>Las señales ocurren cerca en el tiempo.</p>
        </div>
        <div>
          <Pictogram icon={Eye} small />
          <strong>Coincidencia de ejemplo: {assessment.score}%</strong>
          <p>Valor ficticio del ejercicio, no certeza sobre lo ocurrido.</p>
        </div>
      </div>
      <div className="demo-fact">
        <Check aria-hidden="true" />
        <div>
          <strong>Lo que se ve</strong>
          <p>{assessment.visible}</p>
        </div>
      </div>
      <div className="demo-unknown">
        <CircleHelp aria-hidden="true" />
        <div>
          <strong>Lo que aún no sabemos</strong>
          <p>{assessment.unknown}</p>
        </div>
      </div>
      {!readOnly ? (
        <button
          type="button"
          className="demo-button demo-button-primary"
          onClick={onContinue}
        >
          Entiendo el contexto. Continuar <ArrowRight aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
