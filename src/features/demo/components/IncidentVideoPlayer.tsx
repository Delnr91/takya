import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  CircleHelp,
  Focus,
  Pause,
  Play,
  RotateCcw,
  ScanLine,
} from "lucide-react";
import type { MediaClip } from "../schemas/media";

export function clipTime(seconds: number): string {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}
export function IncidentVideoPlayer({
  clip,
  motionOff,
  onReady,
}: {
  clip: MediaClip;
  motionOff: boolean;
  onReady?: (ready: boolean) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [second, setSecond] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showSignals, setShowSignals] = useState(true);
  const systemReduced = useReducedMotion();
  const reduce = motionOff || systemReduced;
  const cue =
    clip.cues.findLast((item) => item.second <= second) ?? clip.cues[0];
  function seek(value: number) {
    if (!video.current || !ready) return;
    video.current.currentTime = Math.min(value, clip.duration - 0.1);
    setSecond(value);
  }
  async function togglePlayback() {
    const player = video.current;
    if (!player) return;
    if (playing) player.pause();
    else {
      if (player.ended) seek(0);
      try {
        await player.play();
      } catch {
        setFailed(true);
        onReady?.(false);
      }
    }
  }
  return (
    <div className="incident-player">
      <div className="incident-player-head">
        <span className="incident-brand">
          <ScanLine aria-hidden="true" /> TAKYA <small>EVIDENCIA</small>
        </span>
        <button
          className="incident-signal-toggle"
          type="button"
          aria-pressed={showSignals}
          onClick={() => setShowSignals(!showSignals)}
        >
          <Focus size={16} aria-hidden="true" /> Señales{" "}
          {showSignals ? "visibles" : "ocultas"}
        </button>
      </div>
      <div className="incident-stage" data-portrait={clip.height > clip.width}>
        <div
          className="incident-picture"
          style={{ aspectRatio: `${clip.width}/${clip.height}` }}
        >
          <video
            ref={video}
            src={clip.src}
            poster={clip.poster}
            controls
            muted
            playsInline
            preload="metadata"
            width={clip.width}
            height={clip.height}
            aria-label={clip.description}
            onLoadedData={() => {
              setReady(true);
              setFailed(false);
              onReady?.(true);
            }}
            onTimeUpdate={(event) => setSecond(event.currentTarget.currentTime)}
            onSeeking={(event) => setSecond(event.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setReady(false);
              setPlaying(false);
              onReady?.(false);
            }}
          >
            Tu navegador no puede reproducir este video.
          </video>
          {showSignals && cue && !failed ? (
            <div className="incident-annotations" aria-hidden="true">
              <motion.div
                className="incident-region"
                initial={false}
                animate={{
                  left: `${cue.region[0]}%`,
                  top: `${cue.region[1]}%`,
                  width: `${cue.region[2]}%`,
                  height: `${cue.region[3]}%`,
                }}
                transition={{ duration: reduce ? 0 : 0.45 }}
              >
                <span>Zona de revisión</span>
                <i />
                <i />
                <i />
                <i />
              </motion.div>
              {playing && !reduce ? <div className="incident-scan" /> : null}
            </div>
          ) : null}
        </div>
        {failed ? (
          <div className="incident-video-error" role="alert">
            <CircleHelp aria-hidden="true" />
            <strong>No pudimos cargar el clip.</strong>
            <button
              className="demo-button demo-button-secondary"
              onClick={() => {
                setFailed(false);
                video.current?.load();
              }}
              type="button"
            >
              <RotateCcw aria-hidden="true" /> Volver a cargar
            </button>
          </div>
        ) : null}
      </div>
      <div className="incident-play-row">
        <button
          className="demo-button demo-button-primary"
          disabled={failed}
          onClick={() => void togglePlayback()}
          type="button"
        >
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          {playing ? "Pausar video" : "Ver el clip"}
        </button>
        <span className="demo-mono">
          {clipTime(second)} / {clipTime(clip.duration)}
        </span>
        <span className="incident-archive-label">Registro grabado</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={cue?.label}
          className="incident-current-cue"
          initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: reduce ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
        >
          <span className="incident-cue-symbol">
            <ScanLine aria-hidden="true" />
          </span>
          <div>
            <small>Señal del momento</small>
            <strong>{cue?.label}</strong>
            <p>{cue?.detail}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="incident-cues" aria-label="Momentos importantes del clip">
        {clip.cues.map((item) => (
          <button
            key={item.second}
            type="button"
            onClick={() => seek(item.second)}
            disabled={!ready}
            aria-pressed={cue?.second === item.second}
          >
            <span>
              {cue?.second === item.second ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Play size={14} aria-hidden="true" />
              )}
              {clipTime(item.second)}
            </span>
            <strong>{item.label}</strong>
          </button>
        ))}
      </div>
      <details className="incident-source-note">
        <summary>Sobre esta evidencia</summary>
        <p>
          {clip.sourceLabel}. Se seleccionó el encuadre y se retiró el audio.
          Las señales y zonas de revisión son anotaciones curadas para la demo,
          no detecciones automáticas. No se alteró el hecho visible.
        </p>
      </details>
    </div>
  );
}
