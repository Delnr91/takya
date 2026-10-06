import { ArrowRight, Camera, CarFront, Check, VideoOff } from "lucide-react";
import type { Incident } from "../schemas/simulation";
import { scenarios } from "../data/scenarios";
import { IncidentPoster } from "./IncidentPoster";
import { Pictogram } from "./DemoPrimitives";

export function CameraGallery({
  incident,
  onOpen,
  incidents,
  onSelect,
}: {
  incident: Incident;
  onOpen: (id: string, cameraId?: string) => void;
  incidents: Incident[];
  onSelect: (id: string) => void;
}) {
  const available = incident.cameras.filter(
    (camera) => camera.available,
  ).length;
  const reviewed = incident.viewedCameraIds.length;
  return (
    <>
      <div className="demo-section-heading">
        <div>
          <p className="demo-eyebrow">Fuentes de evidencia</p>
          <h1>Evidencia para comprender.</h1>
          <p>
            {incident.id} · {scenarios[incident.scenario].title}
          </p>
        </div>
        <Pictogram icon={Camera} />
      </div>
      <div className="demo-panel incident-source-picker">
        <label htmlFor="evidence-case">Elige el caso</label>
        <select
          id="evidence-case"
          value={incident.id}
          onChange={(event) => onSelect(event.target.value)}
        >
          {incidents.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} · {scenarios[item.scenario].title}
            </option>
          ))}
        </select>
        <p>
          {available}{" "}
          {available === 1 ? "registro disponible" : "registros disponibles"} ·{" "}
          {reviewed} {reviewed === 1 ? "revisado" : "revisados"}
        </p>
      </div>
      <div className="demo-camera-gallery">
        {incident.cameras.map((camera) => (
          <article className="demo-panel" key={camera.id}>
            <div className="demo-gallery-heading">
              <Pictogram
                icon={
                  camera.available
                    ? camera.kind === "vehicle"
                      ? CarFront
                      : Camera
                    : VideoOff
                }
                small
              />
              <div>
                <h2>{camera.name}</h2>
                <span className="demo-muted">
                  {camera.available
                    ? incident.viewedCameraIds.includes(camera.id)
                      ? "Registro revisado"
                      : "Listo para revisar"
                    : "Sin conexión en este escenario"}
                </span>
              </div>
            </div>
            {camera.available ? (
              <IncidentPoster
                scenario={incident.scenario}
                clipId={camera.clipId}
              />
            ) : (
              <div className="demo-camera-offline">
                <VideoOff size={54} aria-hidden="true" />
                <strong>Sin imagen disponible</strong>
                <p>No uses esta fuente para confirmar el caso.</p>
              </div>
            )}
            <div className="demo-gallery-footer">
              {camera.available ? (
                <button
                  type="button"
                  className="demo-button demo-button-secondary"
                  onClick={() => onOpen(incident.id, camera.id)}
                >
                  {incident.viewedCameraIds.includes(camera.id) ? (
                    <Check aria-hidden="true" />
                  ) : null}
                  Abrir este registro <ArrowRight aria-hidden="true" />
                </button>
              ) : (
                <p>
                  La revisión continúa con los clips disponibles. No hay
                  conexión a dispositivos reales.
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
      <div className="demo-notice">
        <Camera aria-hidden="true" />
        Los extractos del mismo registro aportan contexto; no son cámaras
        independientes. Cambia de caso para consultar otra evidencia.
      </div>
    </>
  );
}
