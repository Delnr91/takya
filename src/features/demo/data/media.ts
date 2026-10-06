import { mediaClipSchema, type ClipId, type MediaClip } from "../schemas/media";
import type { Scenario } from "../schemas/simulation";

function clip(
  id: ClipId,
  content: Omit<MediaClip, "id" | "src" | "poster">,
): MediaClip {
  return mediaClipSchema.parse({
    id,
    src: `/videos/incidents/${id}.mp4`,
    poster: `/videos/incidents/${id}.jpg`,
    ...content,
  });
}

export const mediaClips: Record<ClipId, MediaClip> = {
  "residuos-descarga": clip("residuos-descarga", {
    title: "Material junto al camión",
    duration: 6,
    width: 960,
    height: 438,
    description:
      "Un camión permanece detenido junto a residuos. Una persona mueve material en la zona de carga.",
    sourceLabel:
      "Extracto de basura.mp4 · 00:00–00:06 · una cámara, montaje de origen",
    cues: [
      {
        second: 0,
        label: "Camión detenido",
        detail: "Vehículo junto a una acumulación de residuos.",
        region: [12, 8, 58, 83],
      },
      {
        second: 3,
        label: "Material en movimiento",
        detail: "Se ve manipulación de material en la zona de carga.",
        region: [24, 10, 68, 74],
      },
    ],
  }),
  "residuos-salida": clip("residuos-salida", {
    title: "Salida y material restante",
    duration: 11,
    width: 960,
    height: 438,
    description:
      "El camión se aleja. El material sigue acumulado junto a la vía y una persona permanece cerca.",
    sourceLabel:
      "Extracto de basura.mp4 · 00:16–00:27 · misma cámara, otro tramo",
    cues: [
      {
        second: 0,
        label: "Material junto a la vía",
        detail: "La acumulación permanece al costado del vehículo.",
        region: [50, 28, 47, 66],
      },
      {
        second: 5,
        label: "Salida del vehículo",
        detail: "El camión se aleja y el material queda en el lugar.",
        region: [4, 8, 90, 86],
      },
    ],
  }),
  "fuego-foco": clip("fuego-foco", {
    title: "Foco de fuego",
    duration: 9,
    width: 800,
    height: 474,
    description:
      "Llamas visibles sobre una acumulación de material. El fuego ocupa una parte amplia del encuadre.",
    sourceLabel:
      "Extracto de sacarclips.mp4 · 09:00–09:09 · registro incluido en reportaje",
    cues: [
      {
        second: 0,
        label: "Llamas visibles",
        detail: "Hay fuego sobre el material acumulado.",
        region: [5, 10, 90, 78],
      },
      {
        second: 4,
        label: "Foco extendido",
        detail: "Las llamas ocupan varias zonas del encuadre.",
        region: [3, 5, 94, 87],
      },
    ],
  }),
  "fuego-respuesta": clip("fuego-respuesta", {
    title: "Personal de respuesta",
    duration: 18,
    width: 800,
    height: 474,
    description:
      "Personal con equipos de protección trabaja junto a las llamas y dirige agua hacia el foco.",
    sourceLabel:
      "Extracto de sacarclips.mp4 · 09:50–10:08 · secuencia del mismo reportaje",
    cues: [
      {
        second: 0,
        label: "Personas próximas al fuego",
        detail: "Se ve personal con equipo de protección junto al foco.",
        region: [10, 15, 80, 80],
      },
      {
        second: 8,
        label: "Trabajo de respuesta",
        detail: "Un chorro de agua se dirige hacia el área de fuego.",
        region: [5, 10, 90, 82],
      },
    ],
  }),
  "fuego-humo": clip("fuego-humo", {
    title: "Humo y focos restantes",
    duration: 28,
    width: 800,
    height: 474,
    description:
      "Humo sobre restos de material y personal de respuesta en el sector. Todavía se ven pequeños focos de fuego.",
    sourceLabel:
      "Extracto de sacarclips.mp4 · 10:25–10:53 · montaje del reportaje; continuidad no comprobada",
    cues: [
      {
        second: 0,
        label: "Humo persistente",
        detail: "El humo limita la visibilidad del sector.",
        region: [5, 10, 90, 77],
      },
      {
        second: 10,
        label: "Restos y focos visibles",
        detail: "Todavía hay material humeante y llamas en el encuadre.",
        region: [3, 30, 94, 64],
      },
    ],
  }),
  "camino-camion": clip("camino-camion", {
    title: "Registro del camino",
    duration: 22,
    width: 324,
    height: 550,
    description:
      "Un registro móvil muestra un camión en un camino con material acumulado a los lados. No se ve una descarga en este tramo.",
    sourceLabel:
      "Extracto de videoplayback.mp4 · 00:06–00:28 · grabación móvil publicada en Antofagasta TV",
    cues: [
      {
        second: 0,
        label: "Material junto al camino",
        detail: "Se ven acumulaciones de material al costado.",
        region: [5, 25, 90, 60],
      },
      {
        second: 6,
        label: "Vehículo en el sector",
        detail: "Un camión aparece en el registro móvil.",
        region: [2, 30, 68, 35],
      },
      {
        second: 14,
        label: "Descarga no visible",
        detail: "El tramo no permite atribuir el material al vehículo.",
        region: [3, 25, 94, 65],
      },
    ],
  }),
};

const caseClips: Partial<Record<Scenario, readonly ClipId[]>> = {
  dumping: ["residuos-descarga", "residuos-salida"],
  fire: ["fuego-foco", "fuego-respuesta", "fuego-humo"],
  uncertain: ["camino-camion"],
};
export function clipsForScenario(scenario: Scenario): readonly MediaClip[] {
  return (caseClips[scenario] ?? []).map((id) => mediaClips[id]);
}
export function clipForId(id: ClipId | null | undefined): MediaClip | null {
  return id ? mediaClips[id] : null;
}

/** Each signal points to an inspected moment, never an inferred timestamp. */
export function evidenceForScenario(scenario: Scenario) {
  const clips = clipsForScenario(scenario);
  if (!clips.length) return [];
  const positions =
    scenario === "dumping"
      ? [
          [0, 0],
          [0, 1],
          [1, 1],
        ]
      : scenario === "fire"
        ? [
            [0, 0],
            [1, 1],
            [2, 0],
          ]
        : [
            [0, 0],
            [0, 1],
            [0, 2],
          ];
  return positions.map(([clipIndex = 0, cueIndex = 0]) => {
    const item = clips[clipIndex]!;
    const cue = item.cues[cueIndex]!;
    return {
      clipId: item.id,
      cameraIndex: clipIndex,
      second: cue.second,
      label: cue.label,
    };
  });
}
