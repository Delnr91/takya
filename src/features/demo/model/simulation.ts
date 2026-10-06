import {
  decisionSchema,
  profileSchema,
  scenarioSchema,
  simulationSchema,
  type AuditEntry,
  type Decision,
  type Incident,
  type Profile,
  type Scenario,
  type Simulation,
} from "../schemas/simulation";
import { reasons, scenarioOrder, scenarios } from "../data/scenarios";
import { clipsForScenario, evidenceForScenario } from "../data/media";

export const MAX_INCIDENTS = 30;
export const STORAGE_KEY = "takya.demo.v1";
export const DEFAULT_PROFILE: Profile = {
  name: "Operador 03",
  role: "OPERATOR",
};
type EventMeta = { id: string; at: number };
export type DemoCommand =
  | { type: "OPEN"; incidentId: string }
  | { type: "SELECT"; incidentId: string }
  | { type: "VIEW_EVIDENCE"; incidentId: string; cameraId: string }
  | { type: "READ_EXPLANATION"; incidentId: string }
  | { type: "DECIDE"; incidentId: string; decision: Decision }
  | { type: "RECEIVE"; incidentId: string }
  | { type: "ADD_INCIDENT"; scenario: Scenario }
  | { type: "PROFILE"; profile: Profile }
  | { type: "PREFERENCE"; preference: keyof Simulation["preferences"] };
export type DemoEvent = DemoCommand & EventMeta;
export type TransitionResult = { state: Simulation; error: string | null };

export function createIncident(
  scenario: Scenario,
  sequence: number,
  at: number,
): Incident {
  const id = `DEMO-${String(sequence).padStart(3, "0")}`;
  const clips = clipsForScenario(scenario);
  const cameras = clips.length
    ? [
        ...clips.map((clip, index) => ({
          id: `${id}-C${index + 1}`,
          name: clip.title,
          kind: "fixed" as const,
          available: true,
          clipId: clip.id,
        })),
        {
          id: `${id}-C${clips.length + 1}`,
          name: "Otra fuente",
          kind: "drone" as const,
          available: false,
          clipId: null,
        },
      ]
    : [
        {
          id: `${id}-C1`,
          name: "Cámara del acceso",
          kind: "fixed" as const,
          available: true,
          clipId: null,
        },
        {
          id: `${id}-C2`,
          name: "Cámara del móvil",
          kind: "vehicle" as const,
          available: true,
          clipId: null,
        },
        {
          id: `${id}-C3`,
          name: "Vista aérea",
          kind: "drone" as const,
          available: false,
          clipId: null,
        },
      ];
  const content = scenarios[scenario];
  const evidence = evidenceForScenario(scenario);
  return {
    id,
    scenario,
    severity: content.severity,
    status: "PENDING",
    createdAt: at,
    cameras,
    alerts: content.signals.map((signal, index) => ({
      id: `${id}-A${index + 1}`,
      cameraId: `${id}-C${evidence[index] ? evidence[index]!.cameraIndex + 1 : index === 1 ? 2 : 1}`,
      timestamp: at - (2 - index) * 12000,
      signal: evidence[index]?.label ?? signal,
      second: evidence[index]?.second ?? 5 + index * 10,
    })),
    viewedCameraIds: [],
    explanationRead: false,
    reviewStartedAt: null,
    decidedAt: null,
    decision: null,
    receivedAt: null,
  };
}

export function createSimulation(
  at: number,
  sessionId: string,
  profile = DEFAULT_PROFILE,
): Simulation {
  const incidents = scenarioOrder.map((scenario, index) =>
    createIncident(scenario, index + 1, at - index * 45000),
  );
  return {
    version: 1,
    sessionId,
    profile,
    incidents,
    selectedId: null,
    nextSequence: 4,
    preferences: {
      largeText: false,
      solid: false,
      highContrast: false,
      motionOff: false,
      backgroundOff: false,
      mascotHidden: false,
    },
    audit: incidents.map((incident) => ({
      id: `${sessionId}-${incident.id}`,
      timestamp: incident.createdAt,
      incidentId: incident.id,
      action: "INCIDENT_RECEIVED",
      actor: "Simulador TAKYA",
      role: "SYSTEM",
      detail: `${incident.alerts.length} avisos reunidos en un caso de práctica.`,
    })),
  };
}

export function isResolved(incident: Incident) {
  return (
    incident.status === "VERIFIED" ||
    incident.status === "ESCALATED" ||
    incident.status === "DISMISSED"
  );
}
export function evidenceComplete(incident: Incident) {
  return incident.cameras
    .filter((camera) => camera.available)
    .every((camera) => incident.viewedCameraIds.includes(camera.id));
}
export function canDecide(incident: Incident) {
  return (
    incident.status === "IN_REVIEW" &&
    evidenceComplete(incident) &&
    incident.explanationRead
  );
}

function appendAudit(
  state: Simulation,
  event: EventMeta,
  incidentId: string | null,
  action: AuditEntry["action"],
  detail: string,
  system = false,
): Simulation {
  return {
    ...state,
    audit: [
      ...state.audit,
      {
        id: event.id,
        timestamp: event.at,
        incidentId,
        action,
        detail,
        actor: system ? "Simulador TAKYA" : state.profile.name,
        role: system ? "SYSTEM" : state.profile.role,
      },
    ],
  };
}
function replaceIncident(state: Simulation, incident: Incident): Simulation {
  return {
    ...state,
    incidents: state.incidents.map((item) =>
      item.id === incident.id ? incident : item,
    ),
  };
}

/** Pure domain boundary: the UI cannot bypass roles, evidence or lifecycle. */
export function transition(
  state: Simulation,
  event: DemoEvent,
): TransitionResult {
  const ok = (next: Simulation): TransitionResult => ({
    state: next,
    error: null,
  });
  const fail = (error: string): TransitionResult => ({ state, error });
  if (state.audit.some((entry) => entry.id === event.id)) return ok(state);
  if (event.type === "PREFERENCE")
    return ok({
      ...state,
      preferences: {
        ...state.preferences,
        [event.preference]: !state.preferences[event.preference],
      },
    });
  if (event.type === "PROFILE") {
    if (!profileSchema.safeParse(event.profile).success)
      return fail("El perfil de práctica no es válido.");
    if (
      state.profile.role === event.profile.role &&
      state.profile.name === event.profile.name
    )
      return ok(state);
    const roleChanged = state.profile.role !== event.profile.role;
    return ok(
      appendAudit(
        { ...state, profile: event.profile },
        event,
        null,
        roleChanged ? "ROLE_CHANGED" : "PROFILE_UPDATED",
        roleChanged
          ? `Se inició una vista de práctica como ${event.profile.role === "OPERATOR" ? "operador" : "supervisión"}.`
          : "Se actualizó el nombre visible de la práctica.",
      ),
    );
  }
  if (event.type === "ADD_INCIDENT") {
    if (!scenarioSchema.safeParse(event.scenario).success)
      return fail("El escenario no está disponible.");
    if (state.incidents.length >= MAX_INCIDENTS)
      return fail(
        "La práctica llegó a 30 casos. Reiníciala para comenzar otra sesión.",
      );
    const incident = createIncident(
      event.scenario,
      state.nextSequence,
      event.at,
    );
    return ok(
      appendAudit(
        {
          ...state,
          incidents: [...state.incidents, incident],
          nextSequence: state.nextSequence + 1,
        },
        event,
        incident.id,
        "INCIDENT_RECEIVED",
        "Tres avisos simulados agrupados en un nuevo caso.",
        true,
      ),
    );
  }
  const incident = state.incidents.find((item) => item.id === event.incidentId);
  if (!incident) return fail("Este caso ya no está disponible.");
  if (event.type === "SELECT") return ok({ ...state, selectedId: incident.id });
  if (event.type === "OPEN") {
    const selected = { ...state, selectedId: incident.id };
    if (state.profile.role !== "OPERATOR" || incident.status !== "PENDING")
      return ok(selected);
    return ok(
      appendAudit(
        replaceIncident(selected, {
          ...incident,
          status: "IN_REVIEW",
          reviewStartedAt: event.at,
        }),
        event,
        incident.id,
        "REVIEW_STARTED",
        "El operador abrió la evidencia para revisar el caso.",
      ),
    );
  }
  if (event.type === "RECEIVE") {
    if (state.profile.role !== "SUPERVISOR")
      return fail("La recepción corresponde a supervisión.");
    if (incident.status !== "ESCALATED")
      return fail("Solo puedes recibir casos derivados.");
    if (incident.receivedAt !== null) return ok(state);
    return ok(
      appendAudit(
        replaceIncident(state, { ...incident, receivedAt: event.at }),
        event,
        incident.id,
        "RECEIVED",
        "Supervisión recibió la derivación simulada. No se despacharon recursos reales.",
      ),
    );
  }
  if (state.profile.role !== "OPERATOR")
    return fail("La revisión y la decisión corresponden al operador.");
  if (event.type === "VIEW_EVIDENCE") {
    if (incident.status !== "IN_REVIEW")
      return fail("Abre la revisión antes de marcar una vista.");
    const camera = incident.cameras.find((item) => item.id === event.cameraId);
    if (!camera?.available)
      return fail("Esta cámara no tiene una vista disponible.");
    if (incident.viewedCameraIds.includes(camera.id)) return ok(state);
    return ok(
      appendAudit(
        replaceIncident(state, {
          ...incident,
          viewedCameraIds: [...incident.viewedCameraIds, camera.id],
        }),
        event,
        incident.id,
        "EVIDENCE_VIEWED",
        `Vista observada: ${camera.name}.`,
      ),
    );
  }
  if (event.type === "READ_EXPLANATION") {
    if (incident.status !== "IN_REVIEW" || !evidenceComplete(incident))
      return fail("Observa todos los clips disponibles antes de continuar.");
    if (incident.explanationRead) return ok(state);
    return ok(
      appendAudit(
        replaceIncident(state, { ...incident, explanationRead: true }),
        event,
        incident.id,
        "EXPLANATION_READ",
        "El operador revisó las señales y lo que aún falta confirmar.",
      ),
    );
  }
  const decision = decisionSchema.safeParse(event.decision);
  if (!decision.success)
    return fail(decision.error.issues[0]?.message ?? "Revisa la decisión.");
  if (!reasons[decision.data.outcome].includes(decision.data.reason))
    return fail("Elige uno de los motivos disponibles.");
  const laterEscalation =
    incident.status === "VERIFIED" &&
    decision.data.outcome === "ESCALATED" &&
    evidenceComplete(incident) &&
    incident.explanationRead;
  if (!canDecide(incident) && !laterEscalation)
    return fail(
      "Antes de decidir, observa la evidencia disponible y comprende las señales.",
    );
  const next = replaceIncident(state, {
    ...incident,
    status: decision.data.outcome,
    decision: decision.data,
    decidedAt: incident.decidedAt ?? event.at,
  });
  const detail = [
    decision.data.reason,
    decision.data.notes,
    decision.data.destination
      ? `Destino simulado: ${decision.data.destination}.`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");
  return ok(
    appendAudit(next, event, incident.id, decision.data.outcome, detail),
  );
}

export function restoreSimulation(raw: string | null): Simulation | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    const parsed = simulationSchema.safeParse(value);
    if (!parsed.success) return null;
    for (const incident of parsed.data.incidents) {
      const expected = clipsForScenario(incident.scenario);
      if (!expected.length) {
        if (incident.cameras.some((camera) => camera.clipId)) return null;
        continue;
      }
      const available = incident.cameras.filter((camera) => camera.available);
      if (
        available.length !== expected.length ||
        available.some(
          (camera, index) => camera.clipId !== expected[index]?.id,
        ) ||
        incident.cameras.some(
          (camera) => !camera.available && camera.clipId !== null,
        )
      )
        return null;
      if (
        incident.alerts.some((alert) => {
          const camera = incident.cameras.find(
            (item) => item.id === alert.cameraId,
          );
          const clip = expected.find((item) => item.id === camera?.clipId);
          return (
            !clip ||
            !clip.cues.some(
              (cue) =>
                cue.second === alert.second && cue.label === alert.signal,
            )
          );
        })
      )
        return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export function getMetrics(state: Simulation) {
  const resolved = state.incidents.filter(isResolved);
  const raw = state.incidents.reduce(
    (sum, incident) => sum + incident.alerts.length,
    0,
  );
  const durations = resolved.flatMap((incident) =>
    incident.decidedAt !== null && incident.reviewStartedAt !== null
      ? [Math.max(0, incident.decidedAt - incident.reviewStartedAt)]
      : [],
  );
  return {
    raw,
    grouped: state.incidents.length,
    reduction: Math.round((1 - state.incidents.length / raw) * 100),
    pending: state.incidents.length - resolved.length,
    resolved: resolved.length,
    urgent: state.incidents.filter(
      (incident) => incident.severity === "HIGH" && !isResolved(incident),
    ).length,
    waiting: state.incidents.filter(
      (incident) =>
        incident.status === "ESCALATED" && incident.receivedAt === null,
    ).length,
    averageSeconds: durations.length
      ? Math.round(
          durations.reduce((sum, duration) => sum + duration, 0) /
            durations.length /
            1000,
        )
      : null,
    practiceCompleted: state.incidents.slice(0, 3).filter(isResolved).length,
  };
}
