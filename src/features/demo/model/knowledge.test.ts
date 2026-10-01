import assert from "node:assert/strict";
import test from "node:test";
import { retrieveKnowledge } from "./knowledge";

test("K8 responde desde documentos curados y muestra la fuente", () => {
  const result = retrieveKnowledge("¿Cómo reviso un caso?");
  assert.equal(result.found, true);
  assert.match(result.answer, /compara las dos vistas/i);
  assert.match(
    result.sources[0]?.source ?? "",
    /docs\/06_DEMO_OPERATOR_FLOW\.md/,
  );
});

test("K8 se abstiene cuando no hay material relevante", () => {
  const result = retrieveKnowledge("¿Cuál es el clima mañana en Marte?");
  assert.equal(result.found, false);
  assert.equal(result.sources.length, 0);
  assert.match(result.answer, /no voy a inventar/i);
});

test("la entrada tiene límite y no ejecuta instrucciones", () => {
  const result = retrieveKnowledge("x".repeat(221));
  assert.equal(result.found, false);
  assert.equal(result.sources.length, 0);
});
