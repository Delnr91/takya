import { Flag, Lightbulb } from "lucide-react";
import { ArrowRight, Check, Eye, Send, ShieldCheck } from "@/components/icons";
import type { Simulation } from "../schemas/simulation";
import type { DemoView } from "../hooks/useDemoNavigation";
import { scenarios } from "../data/scenarios";
import { EmptyState, Pictogram } from "./DemoPrimitives";
import { StartOverview } from "./StartOverview";

export function TurnOverview({
  state,
  onOpen,
  navigate,
}: {
  state: Simulation;
  onOpen: (id: string) => void;
  navigate: (view: DemoView) => void;
}) {
  if (state.profile.role !== "SUPERVISOR") {
    return <StartOverview state={state} onOpen={onOpen} navigate={navigate} />;
  }
  const waiting = state.incidents.filter(
    (incident) =>
      incident.status === "ESCALATED" && incident.receivedAt === null,
  );
  return (
    <>
      <div className="demo-section-heading">
        <div>
          <p className="demo-eyebrow">Centro de operación · Antofagasta</p>
          <h1>Cada derivación, con contexto.</h1>
          <p>
            Recibe los casos revisados por el operador y consulta sus motivos.
          </p>
        </div>
        <span className="demo-session-label">
          <span />
          Práctica activa
        </span>
      </div>
      <section className="demo-panel demo-supervisor">
        <Pictogram icon={ShieldCheck} />
        <div>
          <p className="demo-eyebrow">Bandeja de supervisión</p>
          <h2>Derivaciones del operador</h2>
          <p>
            Recibir confirma que viste la solicitud; no representa un despacho
            real.
          </p>
        </div>
        {waiting.length ? (
          <div className="demo-supervisor-list">
            {waiting.map((incident) => (
              <button
                type="button"
                key={incident.id}
                className="demo-case-row"
                onClick={() => onOpen(incident.id)}
              >
                <Send aria-hidden="true" />
                <span>
                  <strong>{scenarios[incident.scenario].title}</strong>
                  <small>
                    {incident.id} · {incident.decision?.reason}
                  </small>
                </span>
                <ArrowRight aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : (
          <EmptyState title="Aún no hay derivaciones pendientes.">
            Cambia a Operador para practicar una revisión y solicitar apoyo.
          </EmptyState>
        )}
      </section>
    </>
  );
}

export function PracticeGuide({
  completed,
  onStart,
}: {
  completed: number;
  onStart: () => void;
}) {
  const steps = [
    {
      icon: Eye,
      title: "Observa",
      copy: "Mira los clips disponibles. Marca cada uno cuando lo hayas revisado.",
    },
    {
      icon: Lightbulb,
      title: "Comprende",
      copy: "Revisa por qué se agruparon los avisos y qué falta confirmar.",
    },
    {
      icon: Check,
      title: "Decide",
      copy: "Verifica, solicita apoyo o descarta. Deja el motivo de tu decisión.",
    },
  ];
  return (
    <>
      <div className="demo-section-heading">
        <div>
          <h1>Guía</h1>
          <p>
            Puedes volver a mirar y repetir el ejercicio cuando lo necesites.
          </p>
        </div>
        <Pictogram icon={Flag} />
      </div>
      <div className="demo-guide-grid">
        {steps.map((step, index) => (
          <article className="demo-panel" key={step.title}>
            <span className="demo-eyebrow">Paso 0{index + 1}</span>
            <Pictogram icon={step.icon} />
            <h2>{step.title}</h2>
            <p>{step.copy}</p>
          </article>
        ))}
      </div>
      <section className="demo-panel demo-guide-bottom">
        <div>
          <h2>El control sigue en tus manos.</h2>
          <p>
            La sugerencia de TAKYA no confirma un hecho. Describe lo que ves,
            conserva lo que no sabes y elige una acción con fundamento.
          </p>
          <p>
            <strong>{completed} de 3 casos iniciales completados.</strong> El
            progreso reconoce la revisión completa, no la rapidez ni el tipo de
            decisión.
          </p>
        </div>
        <button
          type="button"
          className="demo-button demo-button-primary"
          onClick={onStart}
        >
          Ir a la práctica <ArrowRight aria-hidden="true" />
        </button>
      </section>
      <div className="demo-role-guide">
        <p>
          <strong>Operador</strong> · observa las fuentes, interpreta el
          contexto y registra la decisión.
        </p>
        <p>
          <strong>Supervisión</strong> · consulta la decisión y confirma la
          recepción de una derivación.
        </p>
        <p>
          <strong>TAKYA</strong> · agrupa y explica señales de ejemplo. No toma
          decisiones ni envía recursos.
        </p>
      </div>
    </>
  );
}
