// Acceso privado a la demo: token firmado (HMAC-SHA-256) en una cookie HttpOnly.
// Usa Web Crypto para funcionar igual en Proxy y en Route Handlers.

export const ACCESS_COOKIE = "takya_access";
export { ACCESS_USER } from "./access-shared";
export const ACCESS_TTL_SECONDS = 8 * 60 * 60;

const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer) {
  let binary = "";
  for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function key(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

/** Lee una variable tolerando errores comunes al pegarla en el panel:
 * espacios, comillas o el nombre incluido («NOMBRE=valor»). */
export function envValue(name: string) {
  let value = (process.env[name] ?? "").trim();
  if (value.startsWith(`${name}=`)) value = value.slice(name.length + 1);
  return value.replace(/^["']+|["']+$/g, "").trim();
}

function accessSecret() {
  const secret = envValue("TAKYA_ACCESS_SECRET");
  // Sin un secreto suficiente, el acceso queda cerrado.
  return secret.length >= 32 ? secret : null;
}

export async function signAccess(now = Date.now()) {
  const secret = accessSecret();
  if (!secret) return null;
  const expires = Math.floor(now / 1000) + ACCESS_TTL_SECONDS;
  const payload = `takya-access-v1.${expires}`;
  const signature = await crypto.subtle.sign(
    "HMAC",
    await key(secret),
    encoder.encode(payload),
  );
  return `${expires}.${toBase64Url(signature)}`;
}

export async function verifyAccess(
  token: string | undefined,
  now = Date.now(),
) {
  const secret = accessSecret();
  if (!secret || !token) return false;
  const match = /^(\d{10})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return false;
  const expires = Number(match[1]);
  if (expires * 1000 <= now) return false;
  try {
    return await crypto.subtle.verify(
      "HMAC",
      await key(secret),
      fromBase64Url(match[2] ?? ""),
      encoder.encode(`takya-access-v1.${expires}`),
    );
  } catch {
    return false;
  }
}
