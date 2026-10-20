"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleCheck,
  CircleHelp,
  Clock3,
  FolderOpen,
  MapPin,
  RadioTower,
  RotateCcw,
  ScanSearch,
  Trash2,
  X,
} from "lucide-react";
import { mediaClips } from "../data/media";
import { EvidenceProtection } from "./EvidenceProtection";
import "./analysis-sim.css";

type Mode = "senal" | "archivo";
type SourceId = "vigilancia" | "basura";
type Phase =
  | "fuente"
  | "camara"
  | "conectando"
  | "analizando"
  | "resultado"
  | "decidir"
  | "proteger";
type Outcome = "VERIFIED" | "ESCALATED" | "DISMISSED";

const basura = mediaClips["residuos-descarga"];

// Videos ya cargados: la señal y el análisis se simulan; la protección es real.
const SOURCES: Record<
  SourceId,
  {
    camera: string;
    place: string;
    src: string;
    poster: string;
    file: string;
    duration: string;
    finding: boolean;
  }
> = {
  vigilancia: {
    camera: "Cámara 07 · Portón norte",
    place: "Acceso norte · Antofagasta",
    src: "/videos/incidents/demo.mp4",
    poster: "/videos/incidents/demo.jpg",
    file: "camara-07-porton-norte.mp4",
    duration: "1 min 43 s",
    finding: false,
  },
  basura: {
    camera: "Cámara 12 · Calle de servicio",
    place: "Calle de servicio · Antofagasta",
    src: basura.src,
    poster: basura.poster,
    file: "camara-12-calle-servicio.mp4",
    duration: `${basura.duration} s`,
    finding: true,
  },
};

const CHECKS = [
  "Personas en la zona",
  "Vehículos detenidos",
  "Objetos o material",
];

const OUTCOMES: Record<
  Outcome,
  { label: string; detail: string; icon: typeof Check; reasons: string[] }
> = {
  VERIFIED: {
    label: "Verificar",
    detail: "Confirmo lo que veo",
    icon: CircleCheck,
    reasons: [
      "Se ve la descarga de residuos",
      "Coincide con un reporte vecinal",
    ],
  },
  ESCALATED: {
    label: "Derivar",
    detail: "Pido apoyo",
    icon: ArrowUpRight,
    reasons: [
      "Requiere fiscalización municipal",
      "Hay que identificar el vehículo",
    ],
  },
  DISMISSED: {
    label: "Descartar",
    detail: "No corresponde",
    icon: X,
    reasons: ["Es un retiro autorizado", "No se ve una infracción"],
  },
};

function clock() {
  return new Date().toLocaleTimeString("es-CL", { hour12: false });
}

/**
 * «Analizar»: demostración de punta a punta con videos ya cargados. La señal
 * transmitida y el análisis se simulan (para usarla desde un iPad, sin subir
 * archivos); la protección de la evidencia es criptografía real.
 */
export function AnalysisSimulator({
  operator,
  motionOff,
}: {
  operator: string;
  motionOff: boolean;
}) {
  const reduce = Boolean(useReducedMotion()) || motionOff;
  const [phase, setPhase] = useState<Phase>("fuente");
  const [mode, setMode] = useState<Mode>("senal");
  const [sourceId, setSourceId] = useState<SourceId>("vigilancia");
  const [progress, setProgress] = useState(0);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [reason, setReason] = useState("");
  const [now, setNow] = useState(clock);
  const [caseId] = useState(
    () => `AN-${new Date().toISOString().slice(11, 19).replaceAll(":", "")}`,
  );
  const video = useRef<HTMLVideoElement>(null);
  const source = SOURCES[sourceId];
  const live = mode === "senal";

  // Reloj de la señal «en vivo».
  useEffect(() => {
    if (!live || phase === "fuente" || phase === "camara") return;
    const timer = window.setInterval(() => setNow(clock()), 1000);
    return () => window.clearInterval(timer);
  }, [live, phase]);

  // Conexión y análisis simulados con tiempos legibles.
  useEffect(() => {
    if (phase === "conectando") {
      const timer = window.setTimeout(() => setPhase("analizando"), 1600);
      return () => window.clearTimeout(timer);
    }
    if (phase !== "analizando") return;
    const started = performance.now();
    const total = reduce ? 1500 : 6500;
    const timer = window.setInterval(() => {
      const value = Math.min(1, (performance.now() - started) / total);
      setProgress(value);
      if (value >= 1) {
        window.clearInterval(timer);
        setPhase("resultado");
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [phase, reduce]);

  useEffect(() => {
    if (phase === "analizando" || phase === "conectando")
      void video.current?.play().catch(() => undefined);
  }, [phase]);

  function restart() {
    setPhase("fuente");
    setOutcome(null);
    setReason("");
    setProgress(0);
  }

  const stepIndex = {
    fuente: 0,
    camara: 0,
    conectando: 1,
    analizando: 1,
    resultado: 2,
    decidir: 3,
    proteger: 4,
  }[phase];
  const steps = ["Fuente", "Análisis", "Resultado", "Decisión", "Evidencia"];
  const cuesShown = source.finding
    ? basura.cues.filter((_, index) => progress >= (index + 1) * 0.35)
    : [];

  return (
    <div className="analysis-sim">
      <header className="analysis-sim-heading">
        <div>
          <p className="demo-eyebrow">Analizar</p>
          <h1>De la cámara a la evidencia protegida.</h1>
          <p>
            Elige una fuente. TAKYA busca lo relevante, tú decides y la
            evidencia queda sellada.
          </p>
        </div>
        {phase !== "fuente" ? (
          <button
            type="button"
            className="demo-button demo-button-secondary"
            onClick={restart}
          >
            <RotateCcw aria-hidden="true" /> Empezar de nuevo
          </button>
        ) : null}
      </header>

      <ol className="analysis-sim-steps" aria-label="Recorrido">
        {steps.map((label, index) => (
          <li
            key={label}
            data-state={
              index < stepIndex
                ? "done"
                : index === stepIndex
                  ? "current"
                  : "wait"
            }
            aria-current={index === stepIndex ? "step" : undefined}
          >
            <span aria-hidden="true">
              {index < stepIndex ? <Check /> : index + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={phase === "conectando" ? "analizando" : phase}
          className="analysis-sim-panel demo-panel"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
        >
          {phase === "fuente" ? (
            <>
              <h2>¿De dónde viene el video?</h2>
              <div className="analysis-sim-choices">
                <button
                  type="button"
                  className="analysis-sim-choice"
                  onClick={() => {
                    setMode("senal");
                    setPhase("camara");
                  }}
                >
                  <span className="analysis-sim-choice-icon is-live">
                    <RadioTower aria-hidden="true" />
                  </span>
                  <strong>Señal transmitida</strong>
                  <small>Conecta una cámara en vivo</small>
                </button>
                <button
                  type="button"
                  className="analysis-sim-choice"
                  onClick={() => {
                    setMode("archivo");
                    setPhase("camara");
                  }}
                >
                  <span className="analysis-sim-choice-icon">
                    <FolderOpen aria-hidden="true" />
                  </span>
                  <strong>Abrir archivo</strong>
                  <small>Una grabación exportada del grabador</small>
                </button>
              </div>
            </>
          ) : null}

          {phase === "camara" ? (
            <>
              <button
                type="button"
                className="analysis-sim-back"
                onClick={() => setPhase("fuente")}
              >
                <ArrowLeft aria-hidden="true" /> Cambiar fuente
              </button>
              <h2>{live ? "Elige la cámara" : "Elige la grabación"}</h2>
              <div className="analysis-sim-sources">
                {(Object.keys(SOURCES) as SourceId[]).map((id) => (
                  <button
                    type="button"
                    key={id}
                    className="analysis-sim-source"
                    onClick={() => {
                      setSourceId(id);
                      setProgress(0);
                      setPhase("conectando");
                    }}
                  >
                    <span className="analysis-sim-thumb">
                      <Image
                        src={SOURCES[id].poster}
                        alt=""
                        fill
                        sizes="(max-width: 700px) 90vw, 360px"
                      />
                      {live ? (
                        <span className="analysis-sim-live">
                          <i /> EN VIVO
                        </span>
                      ) : null}
                    </span>
                    <strong>{SOURCES[id].camera}</strong>
                    <small>
                      {live
                        ? SOURCES[id].place
                        : `Grabación · ${SOURCES[id].duration}`}
                    </small>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {phase === "conectando" || phase === "analizando" ? (
            <>
              <div className="analysis-stage">
                <video
                  ref={video}
                  src={source.src}
                  poster={source.poster}
                  muted
                  playsInline
                  loop
                  preload="auto"
                  aria-label={`Video de ${source.camera}`}
                />
                <div className="analysis-stage-top">
                  <span>
                    {live ? (
                      <span className="analysis-sim-live">
                        <i /> EN VIVO
                      </span>
                    ) : (
                      "GRABACIÓN"
                    )}{" "}
                    {source.camera}
                  </span>
                  {live ? <span className="analysis-clock">{now}</span> : null}
                </div>
                {phase === "analizando" && !reduce ? (
                  <motion.span
                    className="analysis-scan"
                    aria-hidden="true"
                    initial={{ top: "6%" }}
                    animate={{ top: ["6%", "92%", "6%"] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                ) : null}
                {cuesShown.map((cue) => (
                  <motion.span
                    key={cue.label}
                    className="analysis-box"
                    initial={reduce ? false : { opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{
                      left: `${cue.region[0]}%`,
                      top: `${cue.region[1]}%`,
                      width: `${cue.region[2]}%`,
                      height: `${cue.region[3]}%`,
                    }}
                  >
                    <em>{cue.label}</em>
                  </motion.span>
                ))}
              </div>
              <div className="analysis-progress" role="status">
                <ScanSearch aria-hidden="true" />
                <span>
                  <strong>
                    {phase === "conectando"
                      ? live
                        ? "Conectando con la señal…"
                        : "Guardando el original intacto…"
                      : "TAKYA revisa el video…"}
                  </strong>
                  <span className="analysis-bar">
                    <i style={{ width: `${Math.round(progress * 100)}%` }} />
                  </span>
                </span>
              </div>
              <ul className="analysis-checks">
                {CHECKS.map((label, index) => (
                  <li
                    key={label}
                    data-done={progress >= (index + 1) / (CHECKS.length + 0.5)}
                  >
                    <Check aria-hidden="true" /> {label}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {phase === "resultado" && !source.finding ? (
            <div className="analysis-result is-clear">
              <span className="analysis-result-icon" aria-hidden="true">
                <CircleCheck />
              </span>
              <div>
                <p className="demo-eyebrow">{source.camera}</p>
                <h2>Sin incidentes. Descartado.</h2>
                <p>
                  TAKYA revisó la señal y no encontró nada que requiera tu
                  atención. No hay evidencia que conservar: no pierdes tiempo
                  mirando lo que no importa.
                </p>
                <div className="analysis-actions">
                  <button
                    type="button"
                    className="demo-button demo-button-primary"
                    onClick={() => {
                      setSourceId("basura");
                      setProgress(0);
                      setPhase("conectando");
                    }}
                  >
                    <RadioTower aria-hidden="true" /> Probar con la Cámara 12
                  </button>
                  <button
                    type="button"
                    className="demo-button demo-button-secondary"
                    onClick={restart}
                  >
                    <RotateCcw aria-hidden="true" /> Elegir otra fuente
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {phase === "resultado" && source.finding ? (
            <article className="analysis-incident">
              <div className="analysis-incident-head">
                <span className="analysis-incident-icon" aria-hidden="true">
                  <Trash2 />
                </span>
                <div>
                  <p className="demo-eyebrow">Incidente detectado · {caseId}</p>
                  <h2>Descarga de residuos</h2>
                  <p className="analysis-incident-meta">
                    <span>
                      <MapPin aria-hidden="true" /> {source.place}
                    </span>
                    <span>
                      <Clock3 aria-hidden="true" /> Hoy {now.slice(0, 5)}
                    </span>
                  </p>
                </div>
                <span className="analysis-priority">Prioridad media</span>
              </div>
              <div className="analysis-incident-frame">
                <Image
                  src={source.poster}
                  alt="Fotograma del momento detectado"
                  fill
                  sizes="(max-width: 900px) 90vw, 560px"
                />
                {basura.cues.map((cue) => (
                  <span
                    key={cue.label}
                    className="analysis-box"
                    style={{
                      left: `${cue.region[0]}%`,
                      top: `${cue.region[1]}%`,
                      width: `${cue.region[2]}%`,
                      height: `${cue.region[3]}%`,
                    }}
                  >
                    <em>{cue.label}</em>
                  </span>
                ))}
              </div>
              <div className="analysis-incident-grid">
                <div>
                  <h3>
                    <ScanSearch aria-hidden="true" /> Lo que vio TAKYA
                  </h3>
                  <ul>
                    {basura.cues.map((cue) => (
                      <li key={cue.label}>
                        <strong>{cue.label}.</strong> {cue.detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3>
                    <CircleHelp aria-hidden="true" /> Lo que no sabe
                  </h3>
                  <ul>
                    <li>Quiénes son las personas.</li>
                    <li>Si el retiro tiene permiso.</li>
                    <li>La hora exacta de la grabación original.</li>
                  </ul>
                </div>
              </div>
              <button
                type="button"
                className="demo-button demo-button-primary analysis-next"
                onClick={() => setPhase("decidir")}
              >
                <Check aria-hidden="true" /> Decidir qué hacer
              </button>
            </article>
          ) : null}

          {phase === "decidir" ? (
            <>
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
                      className="analysis-outcome"
                      data-outcome={key}
                      onClick={() => {
                        setOutcome(key);
                        setReason("");
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
                  {OUTCOMES[outcome].reasons.map((item) => (
                    <label key={item}>
                      <input
                        type="radio"
                        name="analysis-reason"
                        checked={reason === item}
                        onChange={() => setReason(item)}
                      />
                      {item}
                    </label>
                  ))}
                </fieldset>
              ) : null}
              <button
                type="button"
                className="demo-button demo-button-primary analysis-next"
                disabled={!outcome || !reason}
                onClick={() => setPhase("proteger")}
              >
                <Check aria-hidden="true" /> Registrar decisión
              </button>
            </>
          ) : null}

          {phase === "proteger" && outcome ? (
            <>
              <p className="analysis-decided">
                <CircleCheck aria-hidden="true" />
                Decisión registrada: <strong>
                  {OUTCOMES[outcome].label}
                </strong>{" "}
                · {reason}
              </p>
              <EvidenceProtection
                input={{
                  caseId,
                  title: "Descarga de residuos",
                  operator,
                  decision: { outcome: OUTCOMES[outcome].label, reason },
                  clips: [{ name: source.file, src: source.src }],
                }}
              />
            </>
          ) : null}
        </motion.section>
      </AnimatePresence>

      <p className="analysis-sim-note">
        Demo: la señal y el análisis se simulan con videos ya cargados. La
        protección de la evidencia es real y ocurre en este navegador.
      </p>
    </div>
  );
}
