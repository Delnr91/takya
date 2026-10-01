import { useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  CarFront,
  Check,
  Eye,
  Pause,
  Play,
  VideoOff,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import type { Incident } from "../schemas/simulation";
import { evidenceComplete } from "../model/simulation";
import { scenarios } from "../data/scenarios";
import { EvidenceScene } from "./EvidenceScene";
import { Pictogram } from "./DemoPrimitives";

export function EvidenceViewer({
  incident,
  readOnly,
  onViewed,
  onNext,
  motionOff = false,
}: {
  incident: Incident;
  readOnly: boolean;
  onViewed: (cameraId: string) => void;
  onNext: () => void;
  motionOff?: boolean;
}) {
  const [activeId, setActiveId] = useState(incident.cameras[0]?.id ?? "");
  const [second, setSecond] = useState(0);
  const [playing, setPlaying] = useState(false);
  const systemReducedMotion = useReducedMotion();
  const reducedMotion = motionOff || systemReducedMotion;
  const camera =
    incident.cameras.find((item) => item.id === activeId) ??
    incident.cameras[0];
  const complete = evidenceComplete(incident);
  const content = scenarios[incident.scenario];
  useEffect(() => {
    if (!playing || reducedMotion) return;
    const timer = window.setInterval(
      () => setSecond((value) => (value >= 30 ? 0 : value + 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [playing, reducedMotion]);
  return (
    <div className="demo-evidence">
      <div className="demo-camera-tabs" aria-label="Vistas del caso">
        {incident.cameras.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === camera?.id ? "is-selected" : ""}
            aria-pressed={item.id === camera?.id}
            disabled={!item.available}
            onClick={() => setActiveId(item.id)}
          >
            {item.available ? (
              item.kind === "vehicle" ? (
                <CarFront aria-hidden="true" />
              ) : (
                <Camera aria-hidden="true" />
              )
            ) : (
              <VideoOff aria-hidden="true" />
            )}
            <span>
              {item.name}
              <small>
                {item.available
                  ? incident.viewedCameraIds.includes(item.id)
                    ? "Vista observada"
                    : "Lista para observar"
                  : "Sin conexión"}
              </small>
            </span>
            {incident.viewedCameraIds.includes(item.id) ? (
              <Check className="demo-camera-check" aria-hidden="true" />
            ) : null}
          </button>
        ))}
      </div>
      <div className="demo-viewer">
        <div className="demo-viewer-label">
          <Camera size={15} aria-hidden="true" /> Escena ilustrada ·{" "}
          {camera?.name}
        </div>
        <EvidenceScene
          scenario={incident.scenario}
          alternate={camera?.kind === "vehicle"}
          second={second}
        />
        <div className="demo-viewer-caption">
          <span>{content.place}</span>
          <span>{String(second).padStart(2, "0")} / 30 s · práctica</span>
        </div>
      </div>
      <div className="demo-playback">
        <button
          type="button"
          className="demo-icon-button"
          disabled={Boolean(reducedMotion)}
          aria-label={
            playing ? "Pausar secuencia" : "Reproducir secuencia ilustrada"
          }
          onClick={() => setPlaying(!playing)}
        >
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
        </button>
        <label className="demo-timeline">
          {reducedMotion ? "Elige un momento" : "Recorre los 30 segundos"}
          <input
            type="range"
            min="0"
            max="30"
            value={second}
            aria-label="Momento de la secuencia"
            onChange={(event) => setSecond(Number(event.target.value))}
          />
        </label>
        <span className="demo-mono">00:{String(second).padStart(2, "0")}</span>
      </div>
      <div className="demo-alert-timeline" aria-label="Avisos agrupados">
        {incident.alerts.map((alert) => (
          <button
            type="button"
            key={alert.id}
            onClick={() => setSecond(alert.second)}
            aria-pressed={second === alert.second}
          >
            <span>{String(alert.second).padStart(2, "0")} s</span>
            {alert.signal}
          </button>
        ))}
      </div>
      <div className="demo-observation">
        <Pictogram icon={Eye} small />
        <div>
          <strong>Lo que puedes observar</strong>
          <p>{content.visible}</p>
        </div>
      </div>
      {!readOnly ? (
        <div className="demo-action-row">
          <button
            type="button"
            className="demo-button demo-button-secondary"
            disabled={!camera || incident.viewedCameraIds.includes(camera.id)}
            onClick={() => camera && onViewed(camera.id)}
          >
            <Check aria-hidden="true" />
            {camera && incident.viewedCameraIds.includes(camera.id)
              ? "Vista observada"
              : "Ya observé esta vista"}
          </button>
          <button
            type="button"
            className="demo-button demo-button-primary"
            disabled={!complete}
            onClick={onNext}
          >
            Comprender las señales <ArrowRight aria-hidden="true" />
          </button>
        </div>
      ) : null}
      {!complete && !readOnly ? (
        <p className="demo-hint">
          Observa y marca las dos vistas disponibles. La vista aérea no está
          disponible en este ejercicio.
        </p>
      ) : null}
    </div>
  );
}
