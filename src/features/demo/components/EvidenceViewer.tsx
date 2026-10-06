import { useState } from "react";
import { ArrowRight, Check, Film, VideoOff } from "lucide-react";
import type { Incident } from "../schemas/simulation";
import { evidenceComplete } from "../model/simulation";
import { clipForId } from "../data/media";
import { scenarios } from "../data/scenarios";
import { IncidentVideoPlayer } from "./IncidentVideoPlayer";
import { IllustratedEvidenceViewer } from "./IllustratedEvidenceViewer";

type ViewerProps = {
  incident: Incident;
  readOnly: boolean;
  onViewed: (id: string) => void;
  onNext: () => void;
  motionOff?: boolean;
  initialCameraId?: string;
};
export function EvidenceViewer(props: ViewerProps) {
  if (!props.incident.cameras.some((camera) => camera.clipId))
    return <IllustratedEvidenceViewer {...props} />;
  return <RecordedEvidenceViewer key={props.incident.id} {...props} />;
}
function RecordedEvidenceViewer({
  incident,
  readOnly,
  onViewed,
  onNext,
  motionOff = false,
  initialCameraId,
}: ViewerProps) {
  const available = incident.cameras.filter((camera) => camera.available);
  const [activeId, setActiveId] = useState(
    available.find((camera) => camera.id === initialCameraId)?.id ??
      available[0]?.id,
  );
  const [readyId, setReadyId] = useState<string | null>(null);
  const active =
    available.find((camera) => camera.id === activeId) ?? available[0];
  const clip = clipForId(active?.clipId);
  const complete = evidenceComplete(incident);
  const viewed = active ? incident.viewedCameraIds.includes(active.id) : false;
  const content = scenarios[incident.scenario];
  return (
    <div className="demo-evidence">
      <div
        className="incident-clip-tabs"
        aria-label="Clips de evidencia del caso"
      >
        {available.map((camera, index) => (
          <button
            key={camera.id}
            type="button"
            aria-pressed={camera.id === active?.id}
            onClick={() => {
              if (camera.id !== activeId) {
                setActiveId(camera.id);
                setReadyId(null);
              }
            }}
          >
            {incident.viewedCameraIds.includes(camera.id) ? (
              <Check aria-hidden="true" />
            ) : (
              <Film aria-hidden="true" />
            )}
            <span>
              <small>Clip {index + 1}</small>
              <strong>{camera.name}</strong>
            </span>
          </button>
        ))}
      </div>
      {clip && active ? (
        <IncidentVideoPlayer
          key={clip.id}
          clip={clip}
          motionOff={motionOff}
          onReady={(ready) => setReadyId(ready ? active.id : null)}
        />
      ) : null}
      <div className="incident-quick-reading">
        <span>
          <Film aria-hidden="true" /> {available.length}{" "}
          {available.length === 1 ? "clip disponible" : "clips disponibles"}
        </span>
        <strong>{content.verdict}</strong>
        <p>{content.unknown}</p>
      </div>
      {!readOnly ? (
        <div className="demo-action-row incident-review-actions">
          <button
            type="button"
            className="demo-button demo-button-secondary"
            disabled={!active || viewed || readyId !== active.id}
            onClick={() => active && onViewed(active.id)}
          >
            <Check aria-hidden="true" />
            {viewed ? "Clip revisado" : "Ya revisé este clip"}
          </button>
          <button
            type="button"
            className="demo-button demo-button-primary"
            disabled={!complete}
            onClick={onNext}
          >
            Comprender el caso <ArrowRight aria-hidden="true" />
          </button>
        </div>
      ) : null}
      <p className="demo-hint">
        <VideoOff size={15} aria-hidden="true" /> Solo contamos con los
        registros disponibles. Los clips de una misma fuente no son
        confirmaciones independientes.
      </p>
    </div>
  );
}
