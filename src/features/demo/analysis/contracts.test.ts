import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import {
  incidentSchema,
  jobSchema,
  sourceSchema,
  zoneConfigSchema,
} from "./contracts";
import { polygonProblem, rectangle } from "./zone";

// Las mismas fixtures que valida el backend (backend/tests/test_contracts.py).
const fixtures = path.join(process.cwd(), "contracts", "v1", "fixtures");
const load = (dir: string, name: string): unknown =>
  JSON.parse(readFileSync(path.join(fixtures, dir, name), "utf8"));
const names = (dir: string, prefix: string) =>
  readdirSync(path.join(fixtures, dir)).filter((n) => n.startsWith(prefix));

test("las fixtures válidas pasan los esquemas Zod de la consola", () => {
  assert.ok(
    zoneConfigSchema.safeParse(load("valid", "zone-config.json")).success,
  );
  assert.ok(sourceSchema.safeParse(load("valid", "source.json")).success);
  assert.ok(
    incidentSchema.safeParse(load("valid", "analysis-incident.json")).success,
  );
  for (const name of names("valid", "job-"))
    assert.ok(jobSchema.safeParse(load("valid", name)).success, name);
});

test("toda fixture inválida de zona se rechaza antes de enviarla", () => {
  const invalid = names("invalid", "zone-");
  assert.ok(invalid.length >= 4);
  for (const name of invalid)
    assert.equal(
      zoneConfigSchema.safeParse(load("invalid", name)).success,
      false,
      name,
    );
});

test("las zonas semánticamente inválidas también se rechazan", () => {
  const semantic = names("semantic-invalid", "zone-");
  assert.ok(semantic.length >= 2);
  for (const name of semantic)
    assert.equal(
      zoneConfigSchema.safeParse(load("semantic-invalid", name)).success,
      false,
      name,
    );
});

test("un trabajo terminado sin resultado o fallido sin error es inconsistente", () => {
  for (const name of names("semantic-invalid", "job-"))
    assert.equal(
      jobSchema.safeParse(load("semantic-invalid", name)).success,
      false,
      name,
    );
});

test("geometría de la zona: tipos y polígonos dudosos", () => {
  const base = load("valid", "zone-config.json") as Record<string, unknown>;
  const withPolygon = (polygon: unknown) => ({ ...base, polygon });
  assert.equal(
    zoneConfigSchema.safeParse(
      withPolygon([
        [0, 0],
        [1, 0],
        [1, true],
        [0, 1],
      ]),
    ).success,
    false,
  );
  assert.equal(
    zoneConfigSchema.safeParse({ ...base, sample_fps: true }).success,
    false,
  );
  assert.equal(
    zoneConfigSchema.safeParse({ ...base, extra: 1 }).success,
    false,
  );
  assert.equal(polygonProblem(rectangle(0.2, 0.2, 0.8, 0.9)), null);
  assert.equal(
    polygonProblem([
      [0.1, 0.1],
      [0.5, 0.5],
      [0.9, 0.9],
    ]),
    "Los bordes de la zona no pueden cruzarse.",
  );
  assert.equal(
    polygonProblem([
      [0, 0],
      [0.01, 0],
      [0, 0.01],
    ]),
    "La zona es demasiado pequeña.",
  );
  assert.equal(
    polygonProblem([
      [0.1, 0.1],
      [0.9, 0.1],
      [0.1, 0.1],
      [0.5, 0.9],
    ]),
    "Hay dos esquinas en el mismo punto.",
  );
  assert.equal(
    polygonProblem([
      [0.1, 0.1],
      [0.8, 0.6],
      [0.9, 0.1],
      [0.2, 0.7],
    ]),
    "Los bordes de la zona no pueden cruzarse.",
  );
  // Zona cóncava en L: válida.
  assert.equal(
    polygonProblem([
      [0.1, 0.1],
      [0.9, 0.1],
      [0.9, 0.4],
      [0.4, 0.4],
      [0.4, 0.9],
      [0.1, 0.9],
    ]),
    null,
  );
});
