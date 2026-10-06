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
import { motion, useReducedMotion } from "framer-motion";
import { scenarios } from "../data/scenarios";
import { OperationalBrief } from "./OperationalBrief";

export function ExplanationPanel({
  incident,
  readOnly,
  onContinue,
  motionOff = false,
}: {
  incident: Incident;
  readOnly: boolean;
  onContinue: () => void;
  motionOff?: boolean;
}) {
  const assessment = localAssessment(incident);
  const recorded = assessment.origin === "CURATED_VIDEO";
  const reduce = useReducedMotion() || motionOff;
  return (
    <div className="demo-explanation">
      <div className="demo-explanation-title">
        <Pictogram icon={Lightbulb} />
        <div>
          <p className="demo-eyebrow">Copiloto TAKYA</p>
          <h2>
            {recorded
              ? "Qué ocurre y qué hacer ahora"
              : "Por qué reunimos estos avisos"}
          </h2>
        </div>
      </div>
      <p className="demo-lead">{assessment.explanation}</p>
      {recorded ? (
        <motion.div
          className="incident-analysis-flow"
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        >
          <div>
            <Eye aria-hidden="true" />
            <small>Evidencia</small>
            <strong>{incident.viewedCameraIds.length} clips revisados</strong>
          </div>
          <ArrowRight aria-hidden="true" />
          <div>
            <Layers3 aria-hidden="true" />
            <small>Contexto</small>
            <strong>{incident.alerts.length} señales, un caso</strong>
          </div>
          <ArrowRight aria-hidden="true" />
          <div>
            <Lightbulb aria-hidden="true" />
            <small>Acción</small>
            <strong>Tú confirmas</strong>
          </div>
        </motion.div>
      ) : (
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
      )}
      {recorded ? (
        <div
          className="incident-evidence-list"
          aria-label="Señales que sustentan la lectura"
        >
          <p className="demo-eyebrow">Qué reúne TAKYA</p>
          {assessment.evidence.map((item) => (
            <div key={item.alertId}>
              <Check aria-hidden="true" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div className="demo-fact">
        <Check aria-hidden="true" />
        <div>
          <strong>Lo que se ve</strong>
          <p>{assessment.visible}</p>
        </div>
      </div>
      {recorded ? <OperationalBrief scenario={incident.scenario} /> : null}
      {recorded ? (
        <p className="demo-hint">{scenarios[incident.scenario].feedback}</p>
      ) : null}
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
