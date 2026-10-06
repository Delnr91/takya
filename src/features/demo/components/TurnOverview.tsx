import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Camera,
  Check,
  Eye,
  Flag,
  History,
  Layers3,
  Lightbulb,
  MapPin,
  Send,
  ShieldCheck,
} from "lucide-react";
import type { Simulation } from "../schemas/simulation";
import { getMetrics } from "../model/simulation";
import { nextIncident } from "../model/selectors";
import { scenarios } from "../data/scenarios";
import { localAssessment } from "../model/cognitive";
import type { DemoView } from "../hooks/useDemoNavigation";
import { IncidentPoster } from "./IncidentPoster";
import { EmptyState, Pictogram, StatusBadge } from "./DemoPrimitives";

export function TurnOverview({
  state,
  onOpen,
  navigate,
  onSources,
}: {
  state: Simulation;
  onOpen: (id: string) => void;
  navigate: (view: DemoView) => void;
  onSources: (id?: string) => void;
}) {
  const metrics = getMetrics(state);
  const next = nextIncident(state.incidents);
  const nextAssessment = next ? localAssessment(next) : null;
  const supervisor = state.profile.role === "SUPERVISOR";
  const waiting = state.incidents.filter(
    (incident) =>
      incident.status === "ESCALATED" && incident.receivedAt === null,
  );
  return (
    <>
      <div className="demo-section-heading">
        <div>
          <p className="demo-eyebrow">Centro de operación · Antofagasta</p>
          <h1>
            {supervisor
              ? "Cada derivación, con contexto."
              : "Tu turno, con más claridad."}
          </h1>
          <p>
            {supervisor
              ? "Recibe los casos revisados por el operador y consulta sus motivos."
              : "Empieza por un caso. TAKYA reúne las señales para ayudarte a decidir."}
          </p>
        </div>
        <span className="demo-session-label">
          <span />
          Práctica activa
        </span>
      </div>
      <div className="demo-metrics">
        <div className="demo-panel demo-metric">
          <Pictogram icon={Layers3} small />
          <div>
            <span>Avisos recibidos</span>
            <strong>
              {metrics.raw}
              <small> → {metrics.grouped} casos</small>
            </strong>
          </div>
        </div>
        <div className="demo-panel demo-metric">
          <Pictogram icon={Eye} small />
          <div>
            <span>Por revisar</span>
            <strong>
              {metrics.pending}
              <small>
                {metrics.urgent > 0
                  ? ` · ${metrics.urgent} de prioridad alta`
                  : " · a tu ritmo"}
              </small>
            </strong>
          </div>
        </div>
        <div className="demo-panel demo-metric">
          <Pictogram icon={supervisor ? Send : BadgeCheck} small />
          <div>
            <span>{supervisor ? "Por recibir" : "Decisiones registradas"}</span>
            <strong>
              {supervisor ? metrics.waiting : metrics.resolved}
              <small>en esta práctica</small>
            </strong>
          </div>
        </div>
      </div>
      {!supervisor && next && nextAssessment ? (
        <section
          className="demo-panel demo-cognitive-brief"
          aria-label="Lectura asistida del siguiente caso"
        >
          <Pictogram icon={BrainCircuit} tone="orange" small />
          <div>
            <p className="demo-eyebrow">Copiloto · lectura del caso</p>
            <h2>Por qué conviene revisar este caso</h2>
            <p>{nextAssessment.explanation}</p>
            <small>Pendiente de confirmar: {nextAssessment.unknown}</small>
          </div>
          <button
            type="button"
            className="demo-button demo-button-secondary"
            onClick={() => onOpen(next.id)}
          >
            Revisar evidencia <ArrowRight aria-hidden="true" />
          </button>
        </section>
      ) : null}
      {supervisor ? (
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
      ) : (
        <div className="demo-overview-grid">
          <section className="demo-panel demo-next-case">
            {next ? (
              <>
                <div className="demo-next-copy">
                  <p className="demo-eyebrow">Siguiente revisión</p>
                  <StatusBadge incident={next} />
                  <h2>{scenarios[next.scenario].title}</h2>
                  <p>{scenarios[next.scenario].summary}</p>
                  <span className="demo-location">
                    <MapPin size={16} aria-hidden="true" />
                    {scenarios[next.scenario].place}
                  </span>
                  <button
                    type="button"
                    className="demo-button demo-button-primary"
                    onClick={() => onOpen(next.id)}
                  >
                    {next.status === "IN_REVIEW"
                      ? "Continuar revisión"
                      : "Comenzar revisión"}
                    <ArrowRight aria-hidden="true" />
                  </button>
                </div>
                <div className="demo-next-scene">
                  <IncidentPoster scenario={next.scenario} />
                  <span>Evidencia del caso · {next.id}</span>
                </div>
              </>
            ) : (
              <EmptyState title="Todos los casos tienen una decisión.">
                Consulta el historial o genera un nuevo caso para seguir
                practicando.
              </EmptyState>
            )}
          </section>
          <section className="demo-panel demo-practice-card">
            <Pictogram icon={Flag} tone="orange" />
            <p className="demo-eyebrow">Tu recorrido</p>
            <h2>
              Tres casos. <br />
              Más criterio.
            </h2>
            <p>
              Revisa fuego, material y un registro que necesita más contexto.
            </p>
            <div className="demo-progress-label">
              <strong>{metrics.practiceCompleted} de 3</strong>
              <span>revisiones completas</span>
            </div>
            <progress
              value={metrics.practiceCompleted}
              max={3}
              aria-label="Progreso de los tres casos iniciales"
            />
            <span className="demo-practice-award">
              <BadgeCheck aria-hidden="true" />
              {metrics.practiceCompleted === 3
                ? "Recorrido completado"
                : metrics.practiceCompleted > 0
                  ? "Primera revisión lograda"
                  : "Cada paso cuenta"}
            </span>
          </section>
        </div>
      )}
      <div className="demo-quick-actions">
        <button
          type="button"
          className="demo-panel"
          onClick={() => navigate("cases")}
        >
          <Pictogram icon={Eye} small />
          <span>
            <strong>Revisar casos</strong>
            <small>Encuentra lo que necesita atención.</small>
          </span>
          <ArrowRight aria-hidden="true" />
        </button>
        <button
          type="button"
          className="demo-panel"
          onClick={() => onSources(supervisor ? undefined : next?.id)}
        >
          <Pictogram icon={Camera} small />
          <span>
            <strong>Comparar fuentes</strong>
            <small>Explora los registros disponibles del caso.</small>
          </span>
          <ArrowRight aria-hidden="true" />
        </button>
        <button
          type="button"
          className="demo-panel"
          onClick={() => navigate("history")}
        >
          <Pictogram icon={History} small />
          <span>
            <strong>Ver el historial</strong>
            <small>Cada decisión conserva su motivo.</small>
          </span>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
      <div className="demo-grouping-strip">
        <Layers3 aria-hidden="true" />
        <p>
          <strong>
            {metrics.raw} avisos se reúnen en {metrics.grouped} casos.
          </strong>{" "}
          {metrics.reduction}% menos elementos por revisar en esta simulación.
        </p>
        <span>
          {metrics.averageSeconds === null
            ? "Tu primera decisión inicia el registro"
            : `Tiempo medio de revisión: ${metrics.averageSeconds} s`}
        </span>
      </div>
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
          <p className="demo-eyebrow">Aprender haciendo</p>
          <h1>Un paso a la vez.</h1>
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
