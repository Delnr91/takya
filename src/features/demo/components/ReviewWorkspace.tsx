import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  CircleHelp,
  ClipboardCheck,
  Eye,
  History,
  Lightbulb,
  MapPin,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import { scenarios, statusLabels } from "../data/scenarios";
import type { Incident, Outcome, Profile } from "../schemas/simulation";
import {
  canDecide,
  evidenceComplete,
  isResolved,
  type DemoCommand,
} from "../model/simulation";
import { DecisionDialog } from "./DecisionDialog";
import { EvidenceViewer } from "./EvidenceViewer";
import { ExplanationPanel } from "./ExplanationPanel";
import { Pictogram, StatusBadge, timeLabel } from "./DemoPrimitives";

export function ReviewWorkspace({
  incident,
  profile,
  send,
  onBack,
  onHistory,
  onNext,
  motionOff = false,
}: {
  incident: Incident;
  profile: Profile;
  send: (command: DemoCommand) => void;
  onBack: () => void;
  onHistory: () => void;
  onNext: () => void;
  motionOff?: boolean;
}) {
  const [step, setStep] = useState(
    isResolved(incident) || incident.explanationRead
      ? 2
      : evidenceComplete(incident)
        ? 1
        : 0,
  );
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const resolved = isResolved(incident);
  const readOnly = profile.role === "SUPERVISOR" || resolved;
  const content = scenarios[incident.scenario];
  const steps = [
    { title: "Observar", icon: Eye, done: evidenceComplete(incident) },
    { title: "Comprender", icon: Lightbulb, done: incident.explanationRead },
    { title: "Decidir", icon: ClipboardCheck, done: resolved },
  ];
  return (
    <>
      <button type="button" className="demo-back" onClick={onBack}>
        <ArrowLeft size={17} aria-hidden="true" />
        Volver a los casos
      </button>
      <div className="demo-section-heading">
        <div>
          <p className="demo-eyebrow">
            {incident.id} · {statusLabels[incident.status]}
          </p>
          <h1>{content.title}</h1>
          <p className="demo-location">
            <MapPin size={17} aria-hidden="true" />
            {content.place}
          </p>
        </div>
        <StatusBadge incident={incident} />
      </div>
      {profile.role === "SUPERVISOR" ? (
        <div className="demo-notice">
          <ShieldCheck aria-hidden="true" />
          Vista de supervisión. Puedes consultar la evidencia y recibir
          derivaciones; la decisión inicial corresponde al operador.
        </div>
      ) : null}
      <ol className="demo-stepper">
        {steps.map(({ title, icon: Icon, done }, index) => (
          <li key={title}>
            <button
              type="button"
              aria-current={step === index ? "step" : undefined}
              disabled={
                !readOnly &&
                (index === 1
                  ? !evidenceComplete(incident)
                  : index === 2
                    ? !incident.explanationRead
                    : false)
              }
              onClick={() => setStep(index)}
              className={
                step === index ? "is-current" : done ? "is-complete" : ""
              }
            >
              <span>
                {done ? (
                  <Check aria-hidden="true" />
                ) : (
                  <Icon aria-hidden="true" />
                )}
              </span>
              <span>
                <small>Paso {index + 1}</small>
                <strong>{title}</strong>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="demo-review-grid">
        <section
          className="demo-panel demo-review-content"
          aria-label={`Paso ${step + 1}: ${steps[step]?.title}`}
        >
          {step === 0 ? (
            <EvidenceViewer
              incident={incident}
              motionOff={motionOff}
              readOnly={readOnly}
              onViewed={(cameraId) =>
                send({
                  type: "VIEW_EVIDENCE",
                  incidentId: incident.id,
                  cameraId,
                })
              }
              onNext={() => setStep(1)}
            />
          ) : null}
          {step === 1 ? (
            <ExplanationPanel
              incident={incident}
              readOnly={readOnly}
              onContinue={() => {
                send({ type: "READ_EXPLANATION", incidentId: incident.id });
                setStep(2);
              }}
            />
          ) : null}
          {step === 2 && !resolved ? (
            <div className="demo-decisions">
              <p className="demo-eyebrow">Tu criterio cierra la revisión</p>
              <h2>¿Qué corresponde hacer?</h2>
              <p>
                Elige una acción. Después podrás indicar el motivo y confirmar.
              </p>
              <button
                type="button"
                className="demo-decision"
                disabled={!canDecide(incident) || readOnly}
                onClick={() => setOutcome("VERIFIED")}
              >
                <Pictogram icon={CheckCheck} />
                <span>
                  <strong>Verificar</strong>
                  <small>Confirmar lo observado y dejarlo registrado.</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
              <button
                type="button"
                className="demo-decision"
                disabled={!canDecide(incident) || readOnly}
                onClick={() => setOutcome("ESCALATED")}
              >
                <Pictogram icon={Send} tone="orange" />
                <span>
                  <strong>Escalar</strong>
                  <small>Solicitar apoyo para una revisión en terreno.</small>
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
              <button
                type="button"
                className="demo-decision"
                disabled={!canDecide(incident) || readOnly}
                onClick={() => setOutcome("DISMISSED")}
              >
                <Pictogram icon={X} tone="neutral" />
                <span>
                  <strong>Descartar</strong>
                  <small>
                    Explicar por qué el aviso no requiere continuar.
                  </small>
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
              <p className="demo-hint">
                Si falta contexto, puedes volver a observar antes de decidir.
              </p>
            </div>
          ) : null}
          {step === 2 && resolved ? (
            <div className="demo-resolution">
              <Pictogram
                icon={incident.status === "ESCALATED" ? Send : ClipboardCheck}
              />
              <p className="demo-eyebrow">Revisión completada</p>
              <h2>{statusLabels[incident.status]} por el operador.</h2>
              <p className="demo-lead">{incident.decision?.reason}</p>
              {incident.decision?.notes ? (
                <blockquote>{incident.decision.notes}</blockquote>
              ) : null}
              <div className="demo-learning">
                <Lightbulb aria-hidden="true" />
                <p>{content.feedback}</p>
              </div>
              {incident.status === "ESCALATED" ? (
                <div className="demo-fact">
                  <Send aria-hidden="true" />
                  <div>
                    <strong>
                      {incident.receivedAt === null
                        ? "Pendiente de recepción"
                        : "Recibido por supervisión"}
                    </strong>
                    <p>
                      {incident.decision?.destination} ·{" "}
                      {incident.receivedAt
                        ? timeLabel(incident.receivedAt)
                        : "Derivación simulada. No se enviaron recursos reales."}
                    </p>
                  </div>
                </div>
              ) : null}
              <div className="demo-action-row">
                {profile.role === "SUPERVISOR" &&
                incident.status === "ESCALATED" &&
                incident.receivedAt === null ? (
                  <button
                    type="button"
                    className="demo-button demo-button-primary"
                    onClick={() =>
                      send({ type: "RECEIVE", incidentId: incident.id })
                    }
                  >
                    <Check aria-hidden="true" />
                    Marcar derivación recibida
                  </button>
                ) : null}
                {profile.role === "OPERATOR" &&
                incident.status === "VERIFIED" ? (
                  <button
                    type="button"
                    className="demo-button demo-button-secondary"
                    onClick={() => setOutcome("ESCALATED")}
                  >
                    <Send aria-hidden="true" />
                    Solicitar apoyo
                  </button>
                ) : null}
                <button
                  type="button"
                  className="demo-button demo-button-secondary"
                  onClick={onHistory}
                >
                  <History aria-hidden="true" />
                  Ver el registro
                </button>
                <button
                  type="button"
                  className="demo-button demo-button-primary"
                  onClick={onNext}
                >
                  Continuar práctica <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : null}
        </section>
        <aside className="demo-panel demo-coach">
          <Pictogram icon={CircleHelp} />
          <p className="demo-eyebrow">A tu lado, paso a paso</p>
          <h2>
            {step === 0
              ? "Mira antes de interpretar."
              : step === 1
                ? "Una señal no es una certeza."
                : resolved
                  ? "Tu decisión tiene una historia."
                  : "Tú tienes la última palabra."}
          </h2>
          <p>
            {step === 0
              ? "Cambia entre las cámaras. Marca cada vista cuando la hayas observado."
              : step === 1
                ? "Distingue lo visible de aquello que todavía necesita confirmación."
                : resolved
                  ? "Puedes consultar qué revisaste, qué decidiste y el motivo en el historial."
                  : "TAKYA orienta. La acción y el motivo los registras tú."}
          </p>
          <div className="demo-review-checks">
            <span>
              <Check
                data-done={evidenceComplete(incident)}
                aria-hidden="true"
              />
              {incident.viewedCameraIds.length} de 2 vistas observadas
            </span>
            <span>
              <Check data-done={incident.explanationRead} aria-hidden="true" />
              Contexto{" "}
              {incident.explanationRead ? "comprendido" : "por revisar"}
            </span>
            <span>
              <Check data-done={resolved} aria-hidden="true" />
              Decisión {resolved ? "registrada" : "pendiente"}
            </span>
          </div>
          <div className="demo-coach-note">
            Sin prisa. La meta es revisar con fundamento.
          </div>
        </aside>
      </div>
      {outcome ? (
        <DecisionDialog
          incident={incident}
          outcome={outcome}
          onClose={() => setOutcome(null)}
          onConfirm={(decision) => {
            send({ type: "DECIDE", incidentId: incident.id, decision });
            setOutcome(null);
          }}
        />
      ) : null}
    </>
  );
}
