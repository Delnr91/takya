import test from "node:test";
import assert from "node:assert/strict";
import {
  createSimulation,
  createIncident,
  transition,
  restoreSimulation,
  getMetrics,
  MAX_INCIDENTS,
  type DemoCommand,
} from "./simulation";
import { reasons } from "../data/scenarios";
import { clipsForScenario } from "../data/media";
import { localAssessment, validateAssessment } from "./cognitive";
import type { Decision, Simulation } from "../schemas/simulation";
import { selectedIncident } from "./selectors";
import { getQuickGuidance } from "../data/quickGuidance";

const initial = () => createSimulation(100000, "test-session");
test("quick guidance respects supervision and the end of the practice", () => {
  for (const options of [{ supervisor: true }, { hasNextCase: false }]) {
    const answer = getQuickGuidance("Inicio", options).answer;
    assert.doesNotMatch(answer, /Comenzar revisión|Continuar revisión/);
    assert.match(answer, /Historial/);
  }
  assert.match(
    getQuickGuidance("Inicio", { supervisor: true, hasPendingReferral: true })
      .answer,
    /derivación pendiente/,
  );
});
test("camera and history context defaults to the same priority case as Inicio", () => {
  const state = initial();
  assert.equal(selectedIncident(state.incidents, null, null)?.scenario, "fire");
});
test("navigation restores the URL case before the last saved selection and rejects missing cases", () => {
  const state = initial();
  assert.equal(
    selectedIncident(state.incidents, "DEMO-003", "DEMO-001")?.id,
    "DEMO-003",
  );
  assert.equal(
    selectedIncident(state.incidents, "DEMO-999", "DEMO-001")?.id,
    "DEMO-001",
  );
  assert.equal(
    selectedIncident(state.incidents, "DEMO-999", "DEMO-999")?.scenario,
    "fire",
  );
  assert.equal(selectedIncident([], "DEMO-001", null), undefined);
});
test("recorded cases point only to curated moments inside their own clips", () => {
  for (const incident of initial().incidents) {
    const clips = clipsForScenario(incident.scenario);
    assert.ok(clips.length);
    for (const alert of incident.alerts) {
      const source = incident.cameras.find(
        (camera) => camera.id === alert.cameraId,
      );
      const clip = clips.find((item) => item.id === source?.clipId);
      assert.ok(clip);
      assert.ok(alert.second < clip.duration);
      assert.ok(
        clip.cues.some(
          (cue) => cue.second === alert.second && cue.label === alert.signal,
        ),
      );
    }
  }
});
test("one and three clip cases gate decisions on every available source", () => {
  for (const id of ["DEMO-002", "DEMO-003"]) {
    let state = run(initial(), { type: "OPEN", incidentId: id }).state;
    const incident = state.incidents.find((item) => item.id === id)!;
    for (const camera of incident.cameras.filter((item) => item.available)) {
      assert.ok(run(state, { type: "READ_EXPLANATION", incidentId: id }).error);
      state = run(state, {
        type: "VIEW_EVIDENCE",
        incidentId: id,
        cameraId: camera.id,
      }).state;
    }
    const understood = run(state, { type: "READ_EXPLANATION", incidentId: id });
    assert.equal(understood.error, null);
    const decided = run(understood.state, {
      type: "DECIDE",
      incidentId: id,
      decision: decision("VERIFIED"),
    });
    assert.equal(decided.error, null);
    assert.ok(restoreSimulation(JSON.stringify(decided.state)));
  }
});
test("restore rejects foreign clips and modified evidence, while preserving illustrated sessions", () => {
  const edited = initial();
  edited.incidents[0]!.cameras[0]!.clipId = "fuego-foco";
  assert.equal(restoreSimulation(JSON.stringify(edited)), null);
  const wrongTime = initial();
  wrongTime.incidents[0]!.alerts[0]!.second = 29;
  assert.equal(restoreSimulation(JSON.stringify(wrongTime)), null);
  const old = initial();
  old.incidents = (["smoke", "rubble", "movement"] as const).map(
    (scenario, index) => createIncident(scenario, index + 1, 100000),
  );
  const json = JSON.parse(JSON.stringify(old)) as {
    incidents: { cameras: Record<string, unknown>[] }[];
  };
  json.incidents.forEach((incident) =>
    incident.cameras.forEach((camera) => delete camera.clipId),
  );
  const legacy = restoreSimulation(JSON.stringify(json));
  assert.ok(legacy);
  assert.equal(legacy.incidents[0]?.cameras[0]?.clipId, null);
  assert.equal(localAssessment(legacy.incidents[0]!).origin, "LOCAL_SCENARIO");
});
test("older local preferences gain accessible defaults on restore", () => {
  const old = initial();
  const legacy = JSON.parse(JSON.stringify(old)) as Record<string, unknown>;
  legacy.preferences = { largeText: false, solid: false };
  const restored = restoreSimulation(JSON.stringify(legacy));
  assert.ok(restored);
  assert.equal(restored.preferences.motionOff, false);
  assert.equal(restored.preferences.highContrast, false);
  assert.equal(restored.preferences.backgroundOff, false);
});
let sequence = 0;
function run(state: Simulation, command: DemoCommand) {
  return transition(state, {
    ...command,
    id: `action-${++sequence}`,
    at: 120000 + sequence * 1000,
  });
}
const decision = (outcome: Decision["outcome"]): Decision => ({
  outcome,
  reason: reasons[outcome][0] ?? "Motivo de práctica",
  notes: "Observación de ejemplo",
  destination: outcome === "ESCALATED" ? "Supervisión municipal" : null,
});
function reviewed() {
  let state = run(initial(), { type: "OPEN", incidentId: "DEMO-001" }).state;
  for (const cameraId of ["DEMO-001-C1", "DEMO-001-C2"])
    state = run(state, {
      type: "VIEW_EVIDENCE",
      incidentId: "DEMO-001",
      cameraId,
    }).state;
  return run(state, { type: "READ_EXPLANATION", incidentId: "DEMO-001" }).state;
}
test("a decision cannot skip review, cameras or explanation", () => {
  let state = initial();
  assert.ok(
    run(state, {
      type: "DECIDE",
      incidentId: "DEMO-001",
      decision: decision("ESCALATED"),
    }).error,
  );
  state = run(state, { type: "OPEN", incidentId: "DEMO-001" }).state;
  assert.ok(
    run(state, { type: "READ_EXPLANATION", incidentId: "DEMO-001" }).error,
  );
  assert.ok(
    run(state, {
      type: "VIEW_EVIDENCE",
      incidentId: "DEMO-001",
      cameraId: "DEMO-001-C3",
    }).error,
  );
  assert.ok(
    run(state, {
      type: "DECIDE",
      incidentId: "DEMO-001",
      decision: decision("VERIFIED"),
    }).error,
  );
});
test("all three decisions record an immutable audit entry and survive reload", () => {
  for (const outcome of ["VERIFIED", "ESCALATED", "DISMISSED"] as const) {
    const before = reviewed();
    const snapshot = JSON.stringify(before);
    const result = run(before, {
      type: "DECIDE",
      incidentId: "DEMO-001",
      decision: decision(outcome),
    });
    assert.equal(result.error, null);
    assert.equal(result.state.incidents[0]?.status, outcome);
    assert.equal(result.state.audit.at(-1)?.action, outcome);
    assert.equal(JSON.stringify(before), snapshot);
    assert.deepEqual(
      restoreSimulation(JSON.stringify(result.state)),
      result.state,
    );
    assert.equal(getMetrics(result.state).resolved, 1);
  }
});
test("roles cannot impersonate operator decisions or supervisor receipts", () => {
  let state = reviewed();
  assert.ok(run(state, { type: "RECEIVE", incidentId: "DEMO-001" }).error);
  state = run(state, {
    type: "PROFILE",
    profile: { name: "Supervisión", role: "SUPERVISOR" },
  }).state;
  assert.ok(
    run(state, {
      type: "DECIDE",
      incidentId: "DEMO-001",
      decision: decision("ESCALATED"),
    }).error,
  );
  assert.equal(
    run(state, { type: "OPEN", incidentId: "DEMO-002" }).state.incidents[1]
      ?.status,
    "PENDING",
  );
});
test("verified can escalate later and supervision can receive exactly once", () => {
  let state = run(reviewed(), {
    type: "DECIDE",
    incidentId: "DEMO-001",
    decision: decision("VERIFIED"),
  }).state;
  state = run(state, {
    type: "DECIDE",
    incidentId: "DEMO-001",
    decision: decision("ESCALATED"),
  }).state;
  assert.equal(getMetrics(state).waiting, 1);
  state = run(state, {
    type: "PROFILE",
    profile: { name: "Supervisión", role: "SUPERVISOR" },
  }).state;
  state = run(state, { type: "RECEIVE", incidentId: "DEMO-001" }).state;
  assert.equal(getMetrics(state).waiting, 0);
  assert.strictEqual(
    run(state, { type: "RECEIVE", incidentId: "DEMO-001" }).state,
    state,
  );
});
test("duplicate and terminal actions cannot rewrite decisions", () => {
  let state = reviewed();
  assert.strictEqual(
    run(state, {
      type: "VIEW_EVIDENCE",
      incidentId: "DEMO-001",
      cameraId: "DEMO-001-C1",
    }).state,
    state,
  );
  state = run(state, {
    type: "DECIDE",
    incidentId: "DEMO-001",
    decision: decision("DISMISSED"),
  }).state;
  assert.ok(
    run(state, {
      type: "DECIDE",
      incidentId: "DEMO-001",
      decision: decision("VERIFIED"),
    }).error,
  );
});
test("boundary validation rejects corruption, invalid decisions and unknown cameras", () => {
  assert.equal(restoreSimulation("{broken"), null);
  assert.equal(
    restoreSimulation(JSON.stringify({ ...initial(), version: 2 })),
    null,
  );
  const invalid = initial();
  if (invalid.incidents[0]) invalid.incidents[0].status = "ESCALATED";
  assert.equal(restoreSimulation(JSON.stringify(invalid)), null);
  assert.ok(
    run(reviewed(), {
      type: "DECIDE",
      incidentId: "DEMO-001",
      decision: { ...decision("ESCALATED"), destination: null },
    }).error,
  );
  assert.ok(
    run(reviewed(), {
      type: "DECIDE",
      incidentId: "DEMO-001",
      decision: { ...decision("VERIFIED"), reason: "inventado" },
    }).error,
  );
  const pendingWithEvidence = initial();
  pendingWithEvidence.incidents[0]?.viewedCameraIds.push("DEMO-001-C1");
  assert.equal(restoreSimulation(JSON.stringify(pendingWithEvidence)), null);
  const badSource = initial();
  if (badSource.incidents[0]?.cameras[1])
    badSource.incidents[0].cameras[1].available = false;
  assert.equal(restoreSimulation(JSON.stringify(badSource)), null);
  const badDecision: Decision = {
    ...decision("VERIFIED"),
    destination: "Equipo en terreno",
  };
  assert.ok(
    run(reviewed(), {
      type: "DECIDE",
      incidentId: "DEMO-001",
      decision: badDecision,
    }).error,
  );
});
test("generated events have unique IDs, coherent metrics and a bounded queue", () => {
  let state = initial();
  for (let index = 3; index < MAX_INCIDENTS; index++)
    state = run(state, { type: "ADD_INCIDENT", scenario: "rubble" }).state;
  assert.equal(
    new Set(state.incidents.map((incident) => incident.id)).size,
    MAX_INCIDENTS,
  );
  assert.equal(getMetrics(state).raw, 90);
  assert.equal(getMetrics(state).grouped, 30);
  assert.ok(run(state, { type: "ADD_INCIDENT", scenario: "smoke" }).error);
  assert.ok(restoreSimulation(JSON.stringify(state)));
});

test("cognitive output cites alerts belonging to its incident", () => {
  const incident = initial().incidents[0];
  assert.ok(incident);
  const assessment = localAssessment(incident);
  assert.equal(assessment.origin, "CURATED_VIDEO");
  assert.equal(assessment.score, null);
  assert.deepEqual(
    assessment.evidence.map((item) => item.alertId),
    incident.alerts.map((alert) => alert.id),
  );
  assert.deepEqual(validateAssessment(incident, assessment), assessment);
  assert.equal(
    validateAssessment(incident, { ...assessment, incidentId: "DEMO-999" }),
    null,
  );
  assert.equal(
    validateAssessment(incident, {
      ...assessment,
      evidence: [{ alertId: "unknown", label: "Inventado" }],
    }),
    null,
  );
});

test("renaming the practice records a profile update without changing roles", () => {
  const result = run(initial(), {
    type: "PROFILE",
    profile: { name: "Operadora Norte", role: "OPERATOR" },
  });
  assert.equal(result.state.profile.name, "Operadora Norte");
  assert.equal(result.state.audit.at(-1)?.action, "PROFILE_UPDATED");
  assert.equal(result.state.audit.at(-1)?.role, "OPERATOR");
});
