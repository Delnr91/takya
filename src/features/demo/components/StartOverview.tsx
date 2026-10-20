"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Camera,
  Check,
  CircleHelp,
  Clapperboard,
  Eye,
  Flame,
  History,
  Layers3,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Truck,
  Upload,
} from "lucide-react";
import {
  ArrowRight as AnimatedArrow,
  Check as AnimatedCheck,
  Eye as AnimatedEye,
  Flame as AnimatedFlame,
  Truck as AnimatedTruck,
  History as AnimatedHistory,
  Upload as AnimatedUpload,
} from "@/components/icons";
import type { Incident, Scenario, Simulation } from "../schemas/simulation";
import type { DemoView } from "../hooks/useDemoNavigation";
import { filterIncidents, nextIncident } from "../model/selectors";
import { getMetrics, isResolved } from "../model/simulation";
import { clipForId } from "../data/media";
import { scenarios } from "../data/scenarios";
import { IncidentPoster } from "./IncidentPoster";
import "./start-overview.css";

const spring = { type: "spring", stiffness: 380, damping: 30 } as const;
// Motion's installed hook snapshots the preference at mount. Observe changes
// here too so Inicio stops moving immediately when the OS setting changes.
function subscribeReducedMotion(onChange: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}
const readReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedMotion = () => false;
const steps = [
  { label: "Cámara", detail: "Video cargado", icon: Camera },
  { label: "Grabación", detail: "Fragmento guardado", icon: Clapperboard },
  { label: "TAKYA", detail: "Señales reunidas", icon: BrainCircuit },
  { label: "Evidencia", detail: "Tú revisas", icon: Eye },
];
const shortTitles: Record<Scenario, string> = {
  fire: "Fuego y humo",
  dumping: "Material y camión",
  uncertain: "Falta contexto",
  smoke: "Humo en el sector",
  rubble: "Material acumulado",
  movement: "Movimiento en zona",
};

function CaseGlyph({
  scenario,
  still,
}: {
  scenario: Scenario;
  still: boolean;
}) {
  const Icon =
    scenario === "fire"
      ? still
        ? Flame
        : AnimatedFlame
      : scenario === "dumping"
        ? still
          ? Truck
          : AnimatedTruck
        : scenario === "rubble"
          ? Layers3
          : CircleHelp;
  return <Icon aria-hidden="true" strokeWidth={1.7} />;
}

/** ✓ que se dibuja al completar un caso; queda fijo con movimiento reducido. */
function DrawnCheck({ still }: { still: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={still ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
      />
    </svg>
  );
}

/** A preview never marks evidence as reviewed or advances the decision gates. */
function EvidencePreview({
  incident,
  still,
}: {
  incident: Incident;
  still: boolean;
}) {
  const clip = clipForId(
    incident.cameras.find((camera) => camera.available && camera.clipId)
      ?.clipId,
  );
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [phase, setPhase] = useState(3);
  const [replaying, setReplaying] = useState(false);
  // Timers illustrate the prepared demo only; they do not claim analysis results.
  useEffect(() => {
    if (!replaying || phase === 3) return;
    const timer = window.setTimeout(() => setPhase((value) => value + 1), 1800);
    return () => window.clearTimeout(timer);
  }, [replaying, phase]);
  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) video.current?.pause();
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () =>
      document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);
  const toggleVideo = async () => {
    if (!video.current) return;
    if (!video.current.paused) {
      video.current.pause();
      return;
    }
    try {
      await video.current.play();
    } catch {
      setFailed(true);
      setPlaying(false);
    }
  };
  const running = replaying && phase < 3;
  return (
    <div className="start-preview">
      <div className="start-monitor">
        {clip && !failed ? (
          <video
            ref={video}
            src={clip.src}
            poster={clip.poster}
            muted
            playsInline
            preload="metadata"
            aria-label={`Vista previa: ${clip.title}`}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
          />
        ) : (
          <IncidentPoster scenario={incident.scenario} />
        )}
        <div className="start-monitor-top">
          <span>
            <Camera size={16} aria-hidden="true" />{" "}
            {clip ? "Cámara simulada" : "Escena de práctica"}
          </span>
          <span className="start-record-label">
            {!clip
              ? "ESCENA ILUSTRADA"
              : phase === 1 && running
                ? "REC · SIMULADO"
                : "VIDEO PRECARGADO"}
          </span>
        </div>
        {running && phase === 2 && !still ? (
          <motion.div
            className="start-scan"
            aria-hidden="true"
            initial={{ top: "15%" }}
            animate={{ top: "85%" }}
            transition={{ duration: 1.7, ease: "linear" }}
          />
        ) : null}
        <div className="start-monitor-bottom">
          <span className="start-frame-label">
            {clip ? `${clip.duration} s · ${clip.title}` : "Escena ilustrada"}
          </span>
          {clip && !failed ? (
            <button
              type="button"
              onClick={() => void toggleVideo()}
              className="start-play"
            >
              {playing ? (
                <Pause aria-hidden="true" />
              ) : (
                <Play aria-hidden="true" />
              )}
              {playing ? "Pausar" : "Ver video"}
            </button>
          ) : null}
        </div>
        {failed ? (
          <div className="start-video-error" role="alert">
            <span>No se pudo reproducir el video.</span>
            <button type="button" onClick={() => setFailed(false)}>
              Reintentar
            </button>
          </div>
        ) : null}
      </div>
      {clip ? (
        <>
          <div className="start-flow-heading">
            <span>
              Así llega a ti <small>· recorrido simulado</small>
            </span>
            <button
              type="button"
              className="start-text-button"
              onClick={() => {
                setPhase(running ? 3 : 0);
                setReplaying(!running);
              }}
            >
              <RotateCcw size={17} aria-hidden="true" />
              {running ? "Omitir" : "Ver recorrido"}
            </button>
          </div>
          <ol
            className="start-pipeline"
            aria-label="De la cámara a la evidencia"
          >
            {steps.map(({ label, detail, icon: Icon }, index) => (
              <li
                key={label}
                data-state={
                  index < phase
                    ? "done"
                    : index === phase
                      ? "current"
                      : "waiting"
                }
                aria-current={index === phase ? "step" : undefined}
              >
                <span className="start-pipeline-icon">
                  <Icon aria-hidden="true" strokeWidth={1.7} />
                  {index < phase ? (
                    <span className="start-step-check">
                      <Check size={10} aria-hidden="true" />
                    </span>
                  ) : null}
                </span>
                <strong>{label}</strong>
                <small>{detail}</small>
              </li>
            ))}
          </ol>
          <p className="start-flow-status" role="status">
            {running
              ? [
                  "Simulación: la cámara aporta el video.",
                  "Simulación: se guarda un fragmento.",
                  "Simulación: TAKYA reúne las señales.",
                ][phase]
              : "Evidencia preparada. La decisión es tuya."}
          </p>
        </>
      ) : (
        <p className="start-flow-status">
          Práctica ilustrada. Abre el caso para revisar sus vistas.
        </p>
      )}
    </div>
  );
}

export function StartOverview({
  state,
  onOpen,
  navigate,
}: {
  state: Simulation;
  onOpen: (id: string) => void;
  navigate: (view: DemoView) => void;
}) {
  const reduceMotion = useSyncExternalStore(
    subscribeReducedMotion,
    readReducedMotion,
    serverReducedMotion,
  );
  const still = Boolean(reduceMotion || state.preferences.motionOff);
  const [chosenId, setChosenId] = useState<string | null>(null);
  const active = filterIncidents(state.incidents, "ALL", "active", "");
  const recommended = nextIncident(state.incidents);
  const chosen = active.find((item) => item.id === chosenId) ?? recommended;
  const metrics = getMetrics(state);
  const Arrow = still ? ArrowRight : AnimatedArrow;
  const Look = still ? Eye : AnimatedEye;
  const Done = still ? Check : AnimatedCheck;
  const clips =
    chosen?.cameras.filter((camera) => camera.available).length ?? 0;
  const initialCases = state.incidents.slice(0, 3);
  const remaining =
    chosen?.cameras.filter(
      (camera) =>
        camera.available && !chosen.viewedCameraIds.includes(camera.id),
    ).length ?? 0;
  const queue = recommended
    ? [
        recommended,
        ...active.filter((item) => item.id !== recommended.id),
      ].slice(0, 3)
    : [];
  const focusPanel = useRef<HTMLElement>(null);
  const UploadGlyph = still ? Upload : AnimatedUpload;
  const HistoryGlyph = still ? History : AnimatedHistory;
  // Entrada escalonada de los bloques; sin movimiento, aparecen de inmediato.
  const enter = (index: number) => ({
    initial: still ? false : ({ opacity: 0, y: 14 } as const),
    animate: { opacity: 1, y: 0 },
    transition: still
      ? { duration: 0 }
      : {
          duration: 0.45,
          ease: "easeOut" as const,
          delay: 0.06 + index * 0.08,
        },
  });
  return (
    <MotionConfig
      reducedMotion={still ? "always" : "user"}
      transition={still ? { duration: 0 } : spring}
    >
      <div className="start-overview" data-still={still}>
        <header className="start-heading">
          <div>
            <p className="start-kicker">Tu estación de revisión</p>
            <h1>
              {chosen ? "Tu próxima revisión." : "Tu bandeja está al día."}
            </h1>
          </div>
          <span className="start-demo-tag">
            <span /> Demo · evidencia grabada
          </span>
        </header>
        <div className="start-workspace">
          <div className="start-main">
            <motion.section
              ref={focusPanel}
              tabIndex={-1}
              className="start-focus"
              aria-label="Evidencia para revisar"
              {...enter(0)}
            >
              {chosen ? (
                <>
                  <div className="start-focus-heading">
                    <span className="start-ready">
                      <Check size={16} aria-hidden="true" /> Lista para revisar
                    </span>
                    <span className="start-case-id">{chosen.id}</span>
                  </div>
                  <div className="start-case-action">
                    <div className="start-case-identity">
                      <span
                        className="start-case-glyph"
                        data-severity={chosen.severity}
                      >
                        <CaseGlyph scenario={chosen.scenario} still={still} />
                      </span>
                      <div>
                        <h2>{shortTitles[chosen.scenario]}</h2>
                        <p>
                          <MapPin size={15} aria-hidden="true" />
                          {scenarios[chosen.scenario].place}
                        </p>
                      </div>
                    </div>
                    <div className="start-action-row">
                      <span className="start-clip-count">
                        <Clapperboard aria-hidden="true" />
                        {remaining
                          ? `${remaining} de ${clips} registros por observar`
                          : "Evidencia observada"}
                      </span>
                      <motion.button
                        type="button"
                        className="start-primary"
                        whileTap={still ? undefined : { scale: 0.97, y: 2 }}
                        onClick={() => onOpen(chosen.id)}
                      >
                        <Look aria-hidden="true" />
                        {chosen.status === "IN_REVIEW"
                          ? "Continuar revisión"
                          : "Comenzar revisión"}
                        <Arrow aria-hidden="true" />
                      </motion.button>
                    </div>
                  </div>
                  <EvidencePreview
                    key={chosen.id}
                    incident={chosen}
                    still={still}
                  />
                </>
              ) : (
                <div className="start-complete">
                  <span className="start-complete-icon">
                    <Done size={52} aria-hidden="true" />
                  </span>
                  <h2>Todo revisado.</h2>
                  <p>
                    {metrics.resolved} decisiones guardadas en esta práctica.
                  </p>
                  <button
                    type="button"
                    className="start-primary"
                    onClick={() => navigate("history")}
                  >
                    <History aria-hidden="true" /> Ver historial{" "}
                    <Arrow aria-hidden="true" />
                  </button>
                </div>
              )}
            </motion.section>
            <motion.nav
              className="start-shortcuts"
              aria-label="Otras acciones"
              {...enter(3)}
            >
              <button
                type="button"
                className="start-shortcut"
                onClick={() => navigate("analysis")}
              >
                <span className="start-shortcut-icon">
                  <UploadGlyph aria-hidden="true" />
                </span>
                <span>
                  <strong>Analizar una grabación</strong>
                  <small>
                    Señal en vivo o grabación: TAKYA busca lo relevante
                  </small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="start-shortcut"
                onClick={() => navigate("history")}
              >
                <span className="start-shortcut-icon">
                  <HistoryGlyph aria-hidden="true" />
                </span>
                <span>
                  <strong>Historial y decisiones</strong>
                  <small>
                    {metrics.resolved === 1
                      ? "1 decisión guardada"
                      : `${metrics.resolved} decisiones guardadas`}
                  </small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </motion.nav>
          </div>
          <aside className="start-side" aria-label="Bandeja y progreso">
            <motion.section
              className="start-inbox"
              aria-labelledby="start-inbox-title"
              {...enter(1)}
            >
              <div className="start-side-heading">
                <h2 id="start-inbox-title">Por revisar</h2>
                <span>{metrics.pending}</span>
              </div>
              <p className="start-side-hint">Un caso a la vez.</p>
              <div className="start-inbox-list">
                <AnimatePresence initial={false}>
                  {queue.map((incident) => (
                    <motion.button
                      type="button"
                      key={incident.id}
                      layout={still ? false : "position"}
                      exit={still ? undefined : { opacity: 0, scale: 0.97 }}
                      whileTap={still ? undefined : { scale: 0.98 }}
                      className="start-inbox-case"
                      aria-pressed={incident.id === chosen?.id}
                      onClick={() => {
                        setChosenId(incident.id);
                        if (window.matchMedia("(max-width: 900px)").matches) {
                          focusPanel.current?.focus({ preventScroll: true });
                          focusPanel.current?.scrollIntoView({
                            behavior: still ? "instant" : "smooth",
                            block: "start",
                          });
                        }
                      }}
                    >
                      <span
                        className="start-case-glyph"
                        data-severity={incident.severity}
                      >
                        <CaseGlyph scenario={incident.scenario} still={still} />
                      </span>
                      <span>
                        <strong>{shortTitles[incident.scenario]}</strong>
                        <small>
                          {incident.status === "IN_REVIEW"
                            ? "Revisión en curso"
                            : incident.severity === "HIGH"
                              ? "Prioridad alta"
                              : incident.severity === "MEDIUM"
                                ? "Por comprobar"
                                : "Requiere contexto"}
                        </small>
                      </span>
                      {incident.id === chosen?.id ? (
                        <span className="start-selected-mark">
                          <Eye size={16} aria-hidden="true" />
                          <span className="sr-only">En pantalla</span>
                        </span>
                      ) : (
                        <ArrowRight size={17} aria-hidden="true" />
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
                {!active.length ? (
                  <p className="start-inbox-empty">
                    <Check aria-hidden="true" /> Sin pendientes
                  </p>
                ) : null}
              </div>
              {active.length > 3 ? (
                <button
                  type="button"
                  className="start-text-button start-all-cases"
                  onClick={() => navigate("cases")}
                >
                  Ver los {active.length} casos{" "}
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              ) : null}
            </motion.section>
            <motion.section
              className="start-progress"
              aria-labelledby="start-progress-title"
              {...enter(2)}
            >
              <div className="start-side-heading">
                <h2 id="start-progress-title">Tu recorrido</h2>
                <span>
                  {metrics.practiceCompleted}
                  <small> / 3</small>
                </span>
              </div>
              <ol
                className="start-milestones"
                aria-label={`${metrics.practiceCompleted} de 3 casos iniciales completados`}
              >
                {initialCases.map((incident) => (
                  <li key={incident.id} data-complete={isResolved(incident)}>
                    <span>
                      {isResolved(incident) ? (
                        <DrawnCheck still={still} />
                      ) : (
                        <CaseGlyph scenario={incident.scenario} still={still} />
                      )}
                    </span>
                    <strong>
                      {isResolved(incident) ? "Revisado" : "Pendiente"}
                    </strong>
                    <span className="sr-only">
                      {shortTitles[incident.scenario]}
                    </span>
                  </li>
                ))}
              </ol>
              {metrics.practiceCompleted === 3 ? (
                <motion.p
                  className="start-stamp"
                  initial={
                    still ? false : { opacity: 0, scale: 1.35, rotate: -9 }
                  }
                  animate={{ opacity: 1, scale: 1, rotate: -3 }}
                  transition={
                    still
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 320,
                          damping: 14,
                          delay: 0.3,
                        }
                  }
                >
                  <Check size={18} aria-hidden="true" /> Turno completo
                </motion.p>
              ) : (
                <p>Cada revisión completa cuenta.</p>
              )}
            </motion.section>
          </aside>
        </div>
      </div>
    </MotionConfig>
  );
}
