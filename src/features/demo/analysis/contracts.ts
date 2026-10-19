import { z } from "zod";
import { polygonProblem } from "./zone";

const interval = z.object({
  start_ms: z.number().int().nonnegative(),
  end_ms: z.number().int().positive(),
});
export const sourceSchema = z.object({
  id: z.string().regex(/^src_[\w-]+$/),
  session_id: z.string(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  size_bytes: z.number().int().positive().max(33554432),
  display_name: z.string(),
  width: z.number().int().max(1280),
  height: z.number().int().max(720),
  duration_ms: z.number().int().max(60000),
  capture_time: z.string().nullable(),
  received_at: z.string(),
});
export const jobSchema = z
  .object({
    id: z.string(),
    source_id: z.string(),
    state: z.enum([
      "RECEIVING",
      "VALIDATING",
      "READY",
      "QUEUED",
      "ANALYZING",
      "COMPLETED",
      "FAILED",
      "CANCELLED",
      "EXPIRED",
    ]),
    progress: z.object({
      stage: z.string(),
      elapsed_ms: z.number(),
      percent: z.number().nullable(),
    }),
    error: z.object({ code: z.string(), message: z.string() }).nullable(),
    result: z
      .object({
        candidate_count: z.number().int(),
        incident_ids: z.array(z.string()),
        analyzed_interval: interval,
      })
      .nullable(),
  })
  .superRefine((job, ctx) => {
    if (
      (job.state === "COMPLETED") !== (job.result !== null) ||
      (job.state === "FAILED") !== (job.error !== null)
    )
      ctx.addIssue({
        code: "custom",
        message: "Estado de análisis inconsistente",
      });
  });
export const incidentSchema = z.object({
  id: z.string(),
  job_id: z.string(),
  source_id: z.string(),
  revision: z.number().int(),
  review_state: z.enum([
    "PENDING",
    "IN_REVIEW",
    "VERIFIED",
    "DISMISSED",
    "ESCALATED",
  ]),
  reasons: z.array(z.object({ code: z.string(), text: z.string() })),
  unknowns: z.array(z.string()),
  context: z.object({
    requested: interval,
    effective: interval,
    truncated_start: z.boolean(),
    truncated_end: z.boolean(),
    clip_available: z.boolean(),
    derivative_mapping_proven: z.boolean(),
  }),
  stills: z
    .array(
      z.object({
        id: z.string(),
        pts_ms: z.number(),
        sha256: z.string(),
        bbox_norm: z.array(z.number()),
      }),
    )
    .max(3),
});
export const exportSchema = z.object({
  export_id: z.string(),
  state: z.enum(["PREPARING", "VERIFYING", "READY", "DOWNLOADED", "FAILED"]),
  level: z.enum(["E1", "E2"]),
  fingerprint_public_key: z.string(),
});
// Solicitud de análisis (contracts/v1/schemas/zone-config.json + reglas semánticas).
const unit = z.number().finite().min(0).max(1);
export const zoneConfigSchema = z
  .strictObject({
    source_id: z.string().regex(/^src_[A-Za-z0-9_-]{16,64}$/),
    polygon: z
      .array(z.tuple([unit, unit]))
      .min(3)
      .max(32),
    fixed_camera_declared: z.literal(true),
    rule: z.strictObject({
      type: z.literal("dwell_in_zone"),
      reference_point: z.literal("bottom_center"),
      dwell_ms: z.number().int().min(500).max(10000),
      rule_version: z.literal("zone-rule-v1"),
    }),
    sample_fps: z.union([z.literal(1), z.literal(2)]),
    min_detector_score: unit,
    zone_version: z.number().int().min(1).max(1000),
  })
  .superRefine((zone, ctx) => {
    const problem = polygonProblem(zone.polygon);
    if (problem)
      ctx.addIssue({ code: "custom", path: ["polygon"], message: problem });
  });
export type ZoneConfig = z.infer<typeof zoneConfigSchema>;
export type Source = z.infer<typeof sourceSchema>;
export type Job = z.infer<typeof jobSchema>;
export type Incident = z.infer<typeof incidentSchema>;
export type Export = z.infer<typeof exportSchema>;

export async function api<T>(
  path: string,
  schema: z.ZodType<T>,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/analysis/${path}`, {
    ...options,
    cache: "no-store",
  });
  const data: unknown = response.status === 204 ? {} : await response.json();
  if (!response.ok) {
    const error = z.object({ message: z.string() }).safeParse(data);
    throw new Error(
      error.success ? error.data.message : "No se pudo completar la solicitud.",
    );
  }
  return schema.parse(data);
}

export function post(data: unknown, key?: string): RequestInit {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(key ? { "Idempotency-Key": key } : {}),
    },
    body: JSON.stringify(data),
  };
}

export const terminal = (job: Job) =>
  ["COMPLETED", "FAILED", "CANCELLED", "EXPIRED"].includes(job.state);
export const evidenceUrl = (id: string) =>
  `/api/analysis/evidence/${encodeURIComponent(id)}`;
