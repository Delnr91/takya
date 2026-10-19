// Valida fixtures contra los esquemas JSON (draft-07, ajv de node_modules del repo).
// valid/            -> deben pasar el esquema
// invalid/          -> deben fallar el esquema
// semantic-invalid/ -> PASAN el esquema a propósito; cada implementación debe rechazarlas en su capa de dominio
import { createRequire } from "node:module";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const require = createRequire(join(root, "package.json"));
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, format: "full" });
const schemaDir = join(here, "schemas");
const byId = {};
for (const f of readdirSync(schemaDir)) {
  const s = JSON.parse(readFileSync(join(schemaDir, f), "utf8"));
  ajv.addSchema(s);
  byId[f.replace(".json", "")] = s.$id;
}
const prefixes = [
  ["decision-record", "decision-record"], ["decision", "decision"], ["source", "source"],
  ["zone", "zone-config"], ["job", "job"], ["observation", "observation"],
  ["incident", "analysis-incident"], ["analysis-incident", "analysis-incident"],
  ["manifest", "evidence-manifest"], ["evidence-manifest", "evidence-manifest"],
  ["review", "review"], ["error", "error"],
];
const schemaFor = (name) => {
  const hit = prefixes.find(([p]) => name.startsWith(p));
  if (!hit) throw new Error(`Sin esquema para fixture ${name}`);
  return byId[hit[1]];
};
let bad = 0, n = 0;
for (const [dir, expectPass] of [["valid", true], ["invalid", false], ["semantic-invalid", true]]) {
  for (const f of readdirSync(join(here, "fixtures", dir)).sort()) {
    const data = JSON.parse(readFileSync(join(here, "fixtures", dir, f), "utf8"));
    const ok = ajv.validate(schemaFor(f), data);
    n++;
    if (ok !== expectPass) {
      bad++;
      console.error(`FALLO ${dir}/${f}: esperado ${expectPass ? "válido" : "inválido"}`, expectPass ? JSON.stringify(ajv.errors) : "");
    }
  }
}
console.log(bad === 0 ? `CONTRATOS OK (${n} fixtures)` : `CONTRATOS FALLAN (${bad}/${n})`);
process.exit(bad === 0 ? 0 : 1);
