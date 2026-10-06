import Image from "next/image";
import type { Scenario } from "../schemas/simulation";
import { clipsForScenario } from "../data/media";
import { EvidenceScene } from "./EvidenceScene";

export function IncidentPoster({
  scenario,
  clipId,
}: {
  scenario: Scenario;
  clipId?: string | null;
}) {
  const clips = clipsForScenario(scenario);
  const clip = clips.find((item) => item.id === clipId) ?? clips[0];
  if (!clip) return <EvidenceScene scenario={scenario} />;
  return (
    <div className="incident-poster" data-portrait={clip.height > clip.width}>
      <Image
        src={clip.poster}
        alt={clip.description}
        fill
        sizes="(max-width: 768px) 100vw, 480px"
      />
      <span>Video del caso · {clip.duration} s</span>
    </div>
  );
}
