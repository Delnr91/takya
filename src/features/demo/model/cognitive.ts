import { scenarios } from "../data/scenarios";
import {
  cognitiveAssessmentSchema,
  type CognitiveAssessment,
} from "../schemas/cognitive";
import type { Incident } from "../schemas/simulation";

/** Replace this adapter with a validated server response when real inference exists. */
export function localAssessment(incident: Incident): CognitiveAssessment {
  const scenario = scenarios[incident.scenario];
  return cognitiveAssessmentSchema.parse({
    incidentId: incident.id,
    origin: "LOCAL_SCENARIO",
    suggestedPriority: incident.severity,
    explanation: scenario.explanation,
    visible: scenario.visible,
    unknown: scenario.unknown,
    evidence: incident.alerts.map((alert) => ({
      alertId: alert.id,
      label: alert.signal,
    })),
    score: scenario.confidence,
    version: "demo-scenario-v1",
  });
}

/** Boundary for a future service response; never trust free-form model output. */
export function validateAssessment(
  incident: Incident,
  value: unknown,
): CognitiveAssessment | null {
  const parsed = cognitiveAssessmentSchema.safeParse(value);
  if (!parsed.success || parsed.data.incidentId !== incident.id) return null;
  const alertIds = new Set(incident.alerts.map((alert) => alert.id));
  if (parsed.data.evidence.some((item) => !alertIds.has(item.alertId)))
    return null;
  return parsed.data;
}
