#!/usr/bin/env node
// Genera la contraseña de la demo privada y los valores para .env.local o Vercel.
// Uso: node scripts/access/hash-password.mjs <archivo-de-salida-privado>
// Para fijar una contraseña elegida: TAKYA_PASSWORD='…' node scripts/access/hash-password.mjs <archivo>
// Escribe la contraseña y las variables en ese archivo (permisos 0600); no las imprime.
import { randomBytes, scryptSync } from "node:crypto";
import { writeFileSync } from "node:fs";

const out = process.argv[2];
if (!out) {
  console.error("Indica un archivo de salida privado, fuera del repositorio.");
  process.exit(1);
}
const words = randomBytes(18).toString("base64url");
const password =
  process.env.TAKYA_PASSWORD ||
  `${words.slice(0, 6)}-${words.slice(6, 12)}-${words.slice(12, 18)}`;
const salt = randomBytes(16);
const [N, r, p] = [16384, 8, 1];
const hash = scryptSync(password, salt, 32, {
  N,
  r,
  p,
  maxmem: 64 * 1024 * 1024,
});
const secret = randomBytes(48).toString("base64url");
const content = [
  "# TAKYA · acceso privado a la demo. No compartir ni subir a git.",
  "usuario=centinela",
  `contraseña=${password}`,
  "",
  "# Variables de entorno (.env.local y Vercel → Settings → Environment Variables):",
  `TAKYA_DEMO_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("base64url")}:${hash.toString("base64url")}`,
  `TAKYA_ACCESS_SECRET=${secret}`,
  "",
].join("\n");
writeFileSync(out, content, { mode: 0o600, flag: "wx" });
console.log(`Acceso generado en ${out} (permisos 0600).`);
