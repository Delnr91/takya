import { z } from "zod";

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
