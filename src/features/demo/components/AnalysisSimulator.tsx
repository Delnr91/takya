"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CircleCheck,
  CircleHelp,
  Clock3,
  Eye,
  FolderOpen,
  MapPin,
  RadioTower,
  RotateCcw,
  ScanSearch,
  Trash2,
} from "lucide-react";
import { mediaClips } from "../data/media";
import type { DemoCommand } from "../model/simulation";
import "./analysis-sim.css";

type Mode = "senal" | "archivo";
type SourceId = "vigilancia" | "basura";
type Phase = "fuente" | "camara" | "conectando" | "analizando" | "resultado";

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

const STEP_ICONS = [
  { label: "Fuente", icon: RadioTower },
  { label: "Análisis", icon: ScanSearch },
  { label: "Resultado", icon: Eye },
];

function clock() {
  return new Date().toLocaleTimeString("es-CL", { hour12: false });
}

/**
 * «Analizar»: demostración de punta a punta con videos ya cargados. La señal
 * transmitida y el análisis se simulan (para usarla desde un iPad, sin subir
 * archivos); la protección de la evidencia es criptografía real. Lo que
 * resulta queda en la bandeja y en el historial de la práctica.
 */
export function AnalysisSimulator({
  motionOff,
  nextSequence,
  send,
  onOpenCase,
}: {
  operator: string;
  motionOff: boolean;
  nextSequence: number;
  send: (command: DemoCommand) => void;
  onOpenCase: (id: string) => void;
  onHistory: () => void;
}) {
  const reduce = Boolean(useReducedMotion()) || motionOff;
  const [phase, setPhase] = useState<Phase>("fuente");
  const [mode, setMode] = useState<Mode>("senal");
  const [sourceId, setSourceId] = useState<SourceId>("vigilancia");
  const [progress, setProgress] = useState(0);
  const [now, setNow] = useState(clock);
  const clearLogged = useRef(false);
  const video = useRef<HTMLVideoElement>(null);
  const source = SOURCES[sourceId];
  const live = mode === "senal";
  const caseId = `DEMO-${String(nextSequence).padStart(3, "0")}`;

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

  // Una señal sin hallazgos también queda anotada en el historial.
  useEffect(() => {
    if (phase !== "resultado" || source.finding || clearLogged.current) return;
    clearLogged.current = true;
    send({ type: "ANALYSIS_CLEAR", camera: source.camera });
  }, [phase, source, send]);

  function analyze(id: SourceId) {
    setSourceId(id);
    setProgress(0);
    clearLogged.current = false;
    setPhase("conectando");
  }

  function restart() {
    clearLogged.current = false;
    setProgress(0);
    setPhase("fuente");
  }

  // Lo detectado pasa a Casos y se revisa ahí, con el mismo flujo que
  // cualquier caso: Observar, Comprender, Decidir y Proteger.
  function openDetected() {
    send({
      type: "ANALYSIS_DETECT",
      scenario: "dumping",
      camera: source.camera,
    });
    onOpenCase(caseId);
  }

  const stepIndex = {
    fuente: 0,
    camara: 0,
    conectando: 1,
    analizando: 1,
    resultado: 2,
  }[phase];
  const cuesShown = source.finding
    ? basura.cues.filter((_, index) => progress >= (index + 1) * 0.35)
    : [];

  return (
    <div className="analysis-sim">
      <header className="analysis-sim-heading">
        <span className="analysis-sim-mark" aria-hidden="true">
          <ScanSearch />
        </span>
        <h1>Analizar</h1>
        {phase !== "fuente" ? (
          <button
            type="button"
            className="demo-button demo-button-secondary analysis-sim-restart"
            onClick={restart}
          >
            <RotateCcw aria-hidden="true" /> Empezar de nuevo
          </button>
        ) : null}
      </header>

      {/* Camino de pictogramas: el tramo recorrido se llena. */}
      <ol className="analysis-path" aria-label="Recorrido">
        <motion.span
          className="analysis-path-fill"
          aria-hidden="true"
          initial={false}
          animate={{ scaleX: stepIndex / (STEP_ICONS.length - 1) }}
          transition={
            reduce
              ? { duration: 0 }
              : { type: "spring", stiffness: 120, damping: 20 }
          }
        />
        {STEP_ICONS.map(({ label, icon: StepIcon }, index) => (
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
            <motion.span
              className="analysis-path-icon"
              aria-hidden="true"
              animate={
                index === stepIndex && !reduce
                  ? { scale: [1, 1.12, 1] }
                  : { scale: 1 }
              }
              transition={{
                duration: 1.4,
                repeat: index === stepIndex ? Infinity : 0,
              }}
            >
              {index < stepIndex ? <Check /> : <StepIcon />}
            </motion.span>
            <span>{label}</span>
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
            <div className="analysis-tiles">
              <motion.button
                type="button"
                className="analysis-tile is-live"
                whileHover={reduce ? undefined : { y: -6 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                onClick={() => {
                  setMode("senal");
                  setPhase("camara");
                }}
              >
                <span className="analysis-tile-art" aria-hidden="true">
                  <i />
                  <i />
                  <RadioTower />
                </span>
                <strong>En vivo</strong>
                <small>Señal de una cámara</small>
              </motion.button>
              <motion.button
                type="button"
                className="analysis-tile"
                whileHover={reduce ? undefined : { y: -6 }}
                whileTap={reduce ? undefined : { scale: 0.97 }}
                onClick={() => {
                  setMode("archivo");
                  setPhase("camara");
                }}
              >
                <span className="analysis-tile-art" aria-hidden="true">
                  <FolderOpen />
                </span>
                <strong>Archivo</strong>
                <small>Grabación del grabador</small>
              </motion.button>
            </div>
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
                    onClick={() => analyze(id)}
                  >
                    <span className="analysis-sim-thumb">
                      {/* Señal simulada: el video corre en bucle, sin sonido. */}
                      <video
                        src={SOURCES[id].src}
                        poster={SOURCES[id].poster}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
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
                  mirando lo que no importa. Quedó anotado en tu historial.
                </p>
                <div className="analysis-actions">
                  <button
                    type="button"
                    className="demo-button demo-button-primary"
                    onClick={() => analyze("basura")}
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
                onClick={openDetected}
              >
                <Eye aria-hidden="true" /> Revisar el caso
              </button>
            </article>
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
