import { ArrowRight, Camera, CarFront, VideoOff } from "lucide-react";
import type { Incident } from "../schemas/simulation";
import { scenarios } from "../data/scenarios";
import { IncidentPoster } from "./IncidentPoster";
import { Pictogram } from "./DemoPrimitives";

export function CameraGallery({
  incident,
  onOpen,
}: {
  incident: Incident;
  onOpen: (id: string) => void;
}) {
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
                    ? "Material de práctica disponible"
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
                  onClick={() => onOpen(incident.id)}
                >
                  Revisar evidencia <ArrowRight aria-hidden="true" />
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
