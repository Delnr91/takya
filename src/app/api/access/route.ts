import { scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { NextRequest } from "next/server";
import { z } from "zod";
import {
  ACCESS_COOKIE,
  ACCESS_TTL_SECONDS,
  ACCESS_USER,
  signAccess,
} from "@/lib/access";
import { isSameOriginRequest } from "@/features/demo/model/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const credentials = z
  .object({
    username: z.string().max(64),
    password: z.string().min(1).max(256),
  })
  .strict();

// Límite de intentos por instancia: 5 fallos cada 15 minutos por dirección.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, { count: number; since: number }>();

function client(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"
  );
}

function json(body: object, status: number, headers: HeadersInit = {}) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

// Formato: scrypt:<N>:<r>:<p>:<sal base64url>:<hash base64url> (scripts/access/hash-password.mjs).
async function passwordMatches(password: string) {
  const stored = process.env.TAKYA_DEMO_PASSWORD_HASH ?? "";
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const [, n, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash ?? "", "base64url");
  if (expected.length < 32) return null;
  let actual: Buffer;
  try {
    actual = await scrypt(
      password,
      Buffer.from(salt ?? "", "base64url"),
      expected.length,
      {
        N: Number(n),
        r: Number(r),
        p: Number(p),
        maxmem: 64 * 1024 * 1024,
      },
    );
  } catch {
    return null; // Parámetros inválidos: acceso no configurado.
  }
  return timingSafeEqual(actual, expected);
}

function cookie(value: string, maxAge: number, request: NextRequest) {
  const secure = request.nextUrl.protocol === "https:" ? "; Secure" : "";
  return `${ACCESS_COOKIE}=${value}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${maxAge}${secure}`;
}

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return json(
      { code: "BAD_REQUEST", message: "Abre el acceso desde TAKYA." },
      403,
    );
  const id = client(request);
  const now = Date.now();
  const record = failures.get(id);
  if (record && now - record.since < WINDOW_MS && record.count >= MAX_FAILURES)
    return json(
      {
        code: "TOO_MANY_ATTEMPTS",
        message: "Demasiados intentos. Espera 15 minutos.",
      },
      429,
    );
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ code: "BAD_REQUEST", message: "Solicitud inválida." }, 400);
  }
  const parsed = credentials.safeParse(body);
  if (!parsed.success)
    return json({ code: "BAD_REQUEST", message: "Solicitud inválida." }, 400);
  const matches = await passwordMatches(parsed.data.password);
  const token = matches ? await signAccess(now) : null;
  if (matches === null || (matches && !token))
    return json(
      {
        code: "ACCESS_NOT_CONFIGURED",
        message: "El acceso privado no está configurado.",
      },
      503,
    );
  if (!matches || parsed.data.username.trim().toLowerCase() !== ACCESS_USER) {
    const current =
      record && now - record.since < WINDOW_MS
        ? record
        : { count: 0, since: now };
    failures.set(id, { count: current.count + 1, since: current.since });
    return json(
      {
        code: "INVALID_CREDENTIALS",
        message: "Usuario o contraseña incorrectos.",
      },
      401,
    );
  }
  failures.delete(id);
  return json({ ok: true }, 200, {
    "Set-Cookie": cookie(token ?? "", ACCESS_TTL_SECONDS, request),
  });
}

export async function DELETE(request: NextRequest) {
  if (!isSameOriginRequest(request))
    return json(
      { code: "BAD_REQUEST", message: "Abre el acceso desde TAKYA." },
      403,
    );
  return json({ ok: true }, 200, { "Set-Cookie": cookie("", 0, request) });
}
