import { createHash } from "node:crypto";
import {
  chatRequestSchema,
  createChatLimiter,
  selectDocuments,
} from "@/features/demo/model/chat";
import { getCuratedDocuments } from "@/features/demo/server/documents";
import { generateAnswer } from "@/features/demo/server/groq";

export const runtime = "nodejs";
export const maxDuration = 30;
const allowRequest = createChatLimiter();
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
function failure(error: string, status: number) {
  return Response.json({ error }, { status, headers });
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return failure("Abre el chat desde TAKYA para continuar.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return failure("No pude leer ese mensaje.", 415);
  const ip =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    "local";
  const client = createHash("sha256").update(ip.slice(0, 200)).digest("hex");
  if (!allowRequest(client))
    return failure(
      "Hagamos una pausa. Puedes volver a preguntar en unos minutos.",
      429,
    );
  try {
    // Count actual bytes, including chunked bodies; never trust Content-Length alone.
    const reader = request.body?.getReader();
    if (!reader) return failure("Escribe una pregunta para comenzar.", 400);
    let bytes = 0,
      body = "";
    const decoder = new TextDecoder();
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > 20000) {
        await reader.cancel();
        return failure(
          "Ese mensaje es muy largo. Prueba con una pregunta más corta.",
          413,
        );
      }
      body += decoder.decode(chunk.value, { stream: true });
    }
    body += decoder.decode();
    let json: unknown;
    try {
      json = JSON.parse(body);
    } catch {
      return failure("No pude leer ese mensaje.", 400);
    }
    const parsed = chatRequestSchema.safeParse(json);
    if (!parsed.success)
      return failure("Escribe una pregunta de hasta 600 caracteres.", 400);
    const documents = selectDocuments(
      await getCuratedDocuments(),
      parsed.data.messages,
    );
    const answer = await generateAnswer(
      parsed.data.messages,
      documents,
      AbortSignal.any([request.signal, AbortSignal.timeout(20000)]),
    );
    return Response.json(answer, { headers });
  } catch {
    // Do not return provider payloads, credentials, prompts or conversation logs.
    return failure(
      "No pude responder en este momento. Inténtalo de nuevo; tu pregunta sigue aquí.",
      503,
    );
  }
}
