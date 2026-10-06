import { z } from "zod";
import { clipIdSchema } from "./media";

export const roleSchema = z.enum(["OPERATOR", "SUPERVISOR"]);
export const profileSchema = z.object({
  name: z.string().trim().min(1).max(32),
  role: roleSchema,
});
export const severitySchema = z.enum(["HIGH", "MEDIUM", "INFO"]);
export const scenarioSchema = z.enum([
  "smoke",
  "rubble",
  "movement",
  "dumping",
  "fire",
  "uncertain",
]);
export const outcomeSchema = z.enum(["VERIFIED", "ESCALATED", "DISMISSED"]);
export const statusSchema = z.enum([
  "PENDING",
  "IN_REVIEW",
  "VERIFIED",
  "ESCALATED",
  "DISMISSED",
]);
export const decisionSchema = z
  .object({
    outcome: outcomeSchema,
    reason: z
      .string()
      .trim()
      .min(5, "Elige un motivo para continuar.")
      .max(120),
    notes: z
      .string()
      .trim()
      .max(240, "La nota puede tener hasta 240 caracteres."),
    destination: z
      .enum(["Supervisión municipal", "Equipo en terreno"])
      .nullable(),
  })
  .refine(
    (value) => (value.outcome === "ESCALATED") === (value.destination !== null),
    {
      message: "Elige quién recibirá la derivación.",
      path: ["destination"],
    },
  );
export const alertSchema = z.object({
  id: z.string(),
  cameraId: z.string(),
  timestamp: z.number().finite(),
  signal: z.string(),
  second: z.number().min(0).max(30),
});
export const cameraSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(["fixed", "vehicle", "drone"]),
  available: z.boolean(),
  clipId: clipIdSchema.nullable().default(null),
});
export const incidentSchema = z
  .object({
    id: z.string(),
    scenario: scenarioSchema,
    severity: severitySchema,
    status: statusSchema,
    createdAt: z.number().finite(),
    cameras: z.array(cameraSchema).min(2),
    alerts: z.array(alertSchema).min(1),
    viewedCameraIds: z.array(z.string()),
    explanationRead: z.boolean(),
    reviewStartedAt: z.number().finite().nullable(),
    decidedAt: z.number().finite().nullable(),
    decision: decisionSchema.nullable(),
    receivedAt: z.number().finite().nullable(),
  })
  .superRefine((value, ctx) => {
    const available = value.cameras
      .filter((camera) => camera.available)
      .map((camera) => camera.id);
    const cameraIds = value.cameras.map((camera) => camera.id);
    if (
      available.length < 1 ||
      new Set(cameraIds).size !== cameraIds.length ||
      value.alerts.some((alert) => !available.includes(alert.cameraId))
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Las fuentes del caso son inconsistentes.",
      });
    }
    if (
      new Set(value.viewedCameraIds).size !== value.viewedCameraIds.length ||
      value.viewedCameraIds.some((id) => !available.includes(id))
    ) {
      ctx.addIssue({ code: "custom", message: "Evidencia no válida." });
    }
    if (value.status !== "PENDING" && value.reviewStartedAt === null) {
      ctx.addIssue({ code: "custom", message: "Falta inicio de revisión." });
    }
    if (
      value.status === "PENDING" &&
      (value.reviewStartedAt !== null ||
        value.viewedCameraIds.length > 0 ||
        value.explanationRead ||
        value.decision !== null ||
        value.decidedAt !== null ||
        value.receivedAt !== null)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Un caso pendiente no puede contener acciones de revisión.",
      });
    }
    if (
      value.status === "IN_REVIEW" &&
      (value.decision !== null ||
        value.decidedAt !== null ||
        value.receivedAt !== null)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Un caso en revisión no puede tener una decisión.",
      });
    }
    const evidenceComplete = available.every((id) =>
      value.viewedCameraIds.includes(id),
    );
    if (value.explanationRead && !evidenceComplete) {
      ctx.addIssue({
        code: "custom",
        message: "Falta evidencia para la explicación.",
      });
    }
    if (
      ["VERIFIED", "ESCALATED", "DISMISSED"].includes(value.status) &&
      (!value.decision ||
        value.decision.outcome !== value.status ||
        value.decidedAt === null ||
        !value.explanationRead ||
        !evidenceComplete)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "La decisión requiere una revisión completa.",
      });
    }
    if (value.receivedAt !== null && value.status !== "ESCALATED") {
      ctx.addIssue({
        code: "custom",
        message: "Solo una derivación puede recibirse.",
      });
    }
    if (
      (value.decidedAt !== null &&
        value.reviewStartedAt !== null &&
        value.decidedAt < value.reviewStartedAt) ||
      (value.receivedAt !== null &&
        value.decidedAt !== null &&
        value.receivedAt < value.decidedAt)
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Las acciones del caso están fuera de orden.",
      });
    }
  });
export const auditActionSchema = z.enum([
  "INCIDENT_RECEIVED",
  "REVIEW_STARTED",
  "EVIDENCE_VIEWED",
  "EXPLANATION_READ",
  "VERIFIED",
  "ESCALATED",
  "DISMISSED",
  "RECEIVED",
  "ROLE_CHANGED",
  "PROFILE_UPDATED",
]);
export const auditSchema = z.object({
  id: z.string(),
  timestamp: z.number().finite(),
  incidentId: z.string().nullable(),
  action: auditActionSchema,
  actor: z.string(),
  role: z.enum(["OPERATOR", "SUPERVISOR", "SYSTEM"]),
  detail: z.string(),
});
export const simulationSchema = z
  .object({
    version: z.literal(1),
    sessionId: z.string(),
    profile: profileSchema,
    incidents: z.array(incidentSchema).min(3).max(30),
    audit: z.array(auditSchema),
    selectedId: z.string().nullable(),
    nextSequence: z.number().int().min(4).max(31),
    preferences: z.object({
      largeText: z.boolean(),
      solid: z.boolean(),
      highContrast: z.boolean().default(false),
      motionOff: z.boolean().default(false),
      backgroundOff: z.boolean().default(false),
      mascotHidden: z.boolean().default(false),
    }),
  })
  .superRefine((value, ctx) => {
    const ids = value.incidents.map((incident) => incident.id);
    if (
      new Set(ids).size !== ids.length ||
      (value.selectedId !== null && !ids.includes(value.selectedId)) ||
      value.audit.some(
        (entry) => entry.incidentId !== null && !ids.includes(entry.incidentId),
      )
    ) {
      ctx.addIssue({
        code: "custom",
        message: "La sesión contiene referencias inconsistentes.",
      });
    }
  });

export type Role = z.infer<typeof roleSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type Severity = z.infer<typeof severitySchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Outcome = z.infer<typeof outcomeSchema>;
export type Decision = z.infer<typeof decisionSchema>;
export type Incident = z.infer<typeof incidentSchema>;
export type Camera = z.infer<typeof cameraSchema>;
export type AuditEntry = z.infer<typeof auditSchema>;
export type Simulation = z.infer<typeof simulationSchema>;
