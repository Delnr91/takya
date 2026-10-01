import test from "node:test";
import assert from "node:assert/strict";
import {
  createSimulation,
  transition,
  restoreSimulation,
  getMetrics,
  MAX_INCIDENTS,
  type DemoCommand,
} from "./simulation";
import { reasons } from "../data/scenarios";
import { localAssessment, validateAssessment } from "./cognitive";
import type { Decision, Simulation } from "../schemas/simulation";

const initial = () => createSimulation(100000, "test-session");
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
  assert.equal(assessment.origin, "LOCAL_SCENARIO");
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
