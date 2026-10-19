import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextRequest } from "next/server";
import { isSameOriginRequest } from "@/features/demo/model/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function failure(code: string, message: string, status: number) {
  return Response.json(
    { code, message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (request.method !== "GET" && !isSameOriginRequest(request))
    return failure("BAD_REQUEST", "Abre el análisis desde TAKYA.", 403);
  const { path } = await context.params;
  if (path.length > 3 || path.some((p) => !/^[A-Za-z0-9_-]{1,90}$/.test(p)))
    return failure("NOT_FOUND", "Recurso no disponible.", 404);
  try {
    const config = JSON.parse(
      await readFile(
        join(process.cwd(), "backend/.tmp/connection.json"),
        "utf8",
      ),
    );
    if (
      !/^http:\/\/127\.0\.0\.1:\d{4,5}$/.test(config.url) ||
      typeof config.token !== "string"
    )
      throw new Error("Invalid local endpoint");
    const headers = new Headers({ Authorization: `Bearer ${config.token}` });
    const session = request.cookies.get("takya_session")?.value;
    if (session) headers.set("X-Takya-Session", session);
    for (const key of [
      "content-type",
      "range",
      "idempotency-key",
      "x-takya-authorization-ack",
      "x-takya-filename",
    ])
      if (request.headers.has(key)) headers.set(key, request.headers.get(key)!);
    // Preserve backpressure; both hops enforce actual streamed size. Never buffer a video.
    let bytes = 0;
    const cap = path[0] === "uploads" ? 33554432 : 16384;
    const body = request.body?.pipeThrough(
      new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          bytes += chunk.byteLength;
          if (bytes > cap) throw new Error("PAYLOAD_TOO_LARGE");
          controller.enqueue(chunk);
        },
      }),
    );
    const upstream = await fetch(
      `${config.url}/${path.join("/")}${request.nextUrl.search}`,
      {
        method: request.method,
        headers,
        body: request.method === "GET" ? undefined : body,
        duplex: "half",
        redirect: "error",
        cache: "no-store",
        signal: AbortSignal.any([request.signal, AbortSignal.timeout(60000)]),
      } as RequestInit & { duplex: "half" },
    );
    const outgoing = new Headers({
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    for (const key of [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "content-disposition",
    ])
      if (upstream.headers.has(key))
        outgoing.set(key, upstream.headers.get(key)!);
    if (
      path.length === 1 &&
      path[0] === "sessions" &&
      upstream.status === 201
    ) {
      const result = await upstream.json();
      outgoing.delete("content-length");
      outgoing.set(
        "Set-Cookie",
        `takya_session=${result.session_id}; HttpOnly; SameSite=Strict; Path=/api/analysis; Max-Age=7200${request.nextUrl.protocol === "https:" ? "; Secure" : ""}`,
      );
      return Response.json(result, { status: 201, headers: outgoing });
    }
    if (upstream.status === 410 || (path[2] === "close" && upstream.ok))
      outgoing.set(
        "Set-Cookie",
        "takya_session=; HttpOnly; SameSite=Strict; Path=/api/analysis; Max-Age=0",
      );
    return new Response(upstream.body, {
      status: upstream.status,
      headers: outgoing,
    });
  } catch {
    return failure(
      "BACKEND_UNAVAILABLE",
      "El análisis local no está disponible. La práctica preparada sigue funcionando.",
      503,
    );
  }
}

export const GET = proxy;
export const POST = proxy;
