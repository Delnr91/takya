import { z } from "zod";
import { severitySchema } from "./simulation";

export const cognitiveAssessmentSchema = z.object({
  incidentId: z.string().min(1),
  origin: z.enum(["LOCAL_SCENARIO", "MODEL_SERVICE"]),
  suggestedPriority: severitySchema,
  explanation: z.string().trim().min(1).max(1000),
  visible: z.string().trim().min(1).max(500),
  unknown: z.string().trim().min(1).max(500),
  evidence: z
    .array(z.object({ alertId: z.string().min(1), label: z.string().min(1) }))
    .min(1),
  score: z.number().int().min(0).max(100).nullable(),
  version: z.string().min(1),
});

export type CognitiveAssessment = z.infer<typeof cognitiveAssessmentSchema>;
