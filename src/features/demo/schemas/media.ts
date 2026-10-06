import { z } from "zod";

export const clipIdSchema = z.enum([
  "residuos-descarga",
  "residuos-salida",
  "fuego-foco",
  "fuego-respuesta",
  "fuego-humo",
  "camino-camion",
]);
export const mediaClipSchema = z
  .object({
    id: clipIdSchema,
    title: z.string().min(1),
    src: z.string().startsWith("/videos/incidents/"),
    poster: z.string().startsWith("/videos/incidents/"),
    duration: z.number().positive().max(30),
    width: z.number().positive(),
    height: z.number().positive(),
    description: z.string().min(1),
    sourceLabel: z.string().min(1),
    cues: z
      .array(
        z.object({
          second: z.number().nonnegative(),
          label: z.string().min(1),
          detail: z.string().min(1),
          region: z.tuple([
            z.number().min(0).max(100),
            z.number().min(0).max(100),
            z.number().positive().max(100),
            z.number().positive().max(100),
          ]),
        }),
      )
      .min(1),
  })
  .superRefine((clip, ctx) => {
    for (const [index, cue] of clip.cues.entries()) {
      if (
        cue.second >= clip.duration ||
        cue.region[0] + cue.region[2] > 100 ||
        cue.region[1] + cue.region[3] > 100
      )
        ctx.addIssue({
          code: "custom",
          path: ["cues", index],
          message: "La señal debe pertenecer al tramo y al encuadre.",
        });
    }
  });
export type ClipId = z.infer<typeof clipIdSchema>;
export type MediaClip = z.infer<typeof mediaClipSchema>;
