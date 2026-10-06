import { z } from "zod";

export const chatMessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z
      .string()
      .trim()
      .min(1)
      .max(2000)
      .refine(
        (value) =>
          !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value),
        "Mensaje no válido",
      ),
  })
  .strict();
export const chatRequestSchema = z
  .object({
    messages: z.array(chatMessageSchema).min(1).max(9),
  })
  .strict()
  .superRefine(({ messages }, context) => {
    if (
      messages.at(-1)?.role !== "user" ||
      messages.at(-1)!.content.length > 600
    )
      context.addIssue({ code: "custom", message: "Última pregunta inválida" });
    if (
      messages.some(
        (message, index) =>
          message.role !== (index % 2 === 0 ? "user" : "assistant"),
      )
    )
      context.addIssue({ code: "custom", message: "Orden inválido" });
  });
export const chatResponseSchema = z.object({
  answer: z.string().min(1).max(2000),
  sources: z.array(z.string().max(120)).max(3),
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatAnswer = z.infer<typeof chatResponseSchema>;
export type CuratedDocument = {
  id: string;
  title: string;
  keywords: string[];
  content: string;
};

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const scopeRedirect =
  "Puedo ayudarte con TAKYA, cámaras y revisión de incidentes. ¿Quieres revisar un video o comprender qué hacer después?";
const domain =
  /\b(takya|k8|camar\w*|camra\w*|cctv|vigil\w*|segur\w*|incident\w*|incidnt\w*|casos?|clips?|videos?|evidenci\w*|alert\w*|operador\w*|supervis\w*|consol\w*|prioridad|riesgo\w*|escala\w*|descart\w*|verifica\w*|humo|fuego|incend\w*|residu\w*|escombr\w*|robo\w*|asalt\w*|accesib\w*|ajustes?|letra|leer|lectura|pantalla|pictogram\w*|mascota|historial|sesion|datos|privacidad|ayuda|empez\w*|comenz\w*|movimiento)\b/;
const unrelated =
  /\b(platan\w*|banan\w*|recetas?|cocin\w*|horoscop\w*|futbol|chiste\w*|poemas?|cancion\w*|apuestas?|criptomon\w*|comprar|supermercado)\b/;
const override =
  /(ignora|olvida|ignore|forget|desobedece).{0,60}(instruccion|reglas?|system|sistema|previous|prompt)|\b(jailbreak|developer mode|dan mode)\b|\b(revela|muestra|imprime|dime|reveal|print).{0,40}(prompt|instrucciones internas|api.?key|clave secreta|variables de entorno)|\[inst\]|<\|?(system|im_start|endoftext)/;
const secret = /gsk_[a-z0-9]{10,}|\b(?:sk-proj-|sk_live_)[a-z0-9]{10,}/i;
const harmful =
  /(hacke\w*|desactiv\w*|evad\w*|sabot\w*|bypass).{0,50}(camar\w*|vigil\w*|alarm\w*|segur\w*)/;
const followUp =
  /^(si|no|ok|vale|gracias|hola|buenas|buenos dias|listo|lo encontre|ya|siguiente|continua\w*|otro paso|no entiendo|mas facil|explic\w* mas facil|guiame paso a paso|paso a paso|y despues|como asi|por que|que hago)([\s.,!?¿¡]|$)/;

/** Server-side scope gate, separate from model instructions. It is not a universal jailbreak detector. */
export function chatScopeResponse(messages: ChatMessage[]): ChatAnswer | null {
  const question = messages.at(-1)?.content ?? "";
  const text = normalize(question);
  if (secret.test(question))
    return {
      answer:
        "No compartas claves ni contraseñas. Puedo ayudarte a usar TAKYA sin esos datos.",
      sources: [],
    };
  if (override.test(text) || harmful.test(text) || unrelated.test(text))
    return { answer: scopeRedirect, sources: [] };
  if (
    domain.test(text) ||
    /^(hola|buenas|buenos dias|gracias)[\s.!¿?]*$/.test(text)
  )
    return null;
  const previous = messages
    .filter((message) => message.role === "user")
    .slice(0, -1);
  if (
    followUp.test(text) &&
    previous.some(
      (message) =>
        domain.test(normalize(message.content)) &&
        !unrelated.test(normalize(message.content)) &&
        !override.test(normalize(message.content)),
    )
  )
    return null;
  return { answer: scopeRedirect, sources: [] };
}

/** Discard rejected exchanges so secrets or injection attempts cannot travel in later requests. */
export function providerMessages(messages: ChatMessage[]): ChatMessage[] {
  const safe: ChatMessage[] = [];
  for (let index = 0; index < messages.length - 1; index += 2) {
    const user = messages[index]!;
    const assistant = messages[index + 1]!;
    if (
      chatScopeResponse([...safe, user]) ||
      secret.test(assistant.content) ||
      override.test(normalize(assistant.content))
    )
      continue;
    safe.push(user, assistant);
  }
  const current = messages.at(-1);
  if (current) safe.push(current);
  return safe;
}
const ignored = new Set([
  "que",
  "como",
  "para",
  "con",
  "una",
  "los",
  "las",
  "del",
  "por",
  "esta",
  "este",
  "mas",
  "puedo",
  "quiero",
  "paso",
]);
function words(value: string): string[] {
  return (
    normalize(value)
      .match(/[a-z0-9]{3,}/g)
      ?.filter((word) => !ignored.has(word)) ?? []
  );
}
export function parseDocument(id: string, markdown: string): CuratedDocument {
  const title = markdown.match(/^# (.+)$/m)?.[1];
  const tags = markdown.match(/<!-- temas: (.+) -->/)?.[1];
  if (!title || !tags || markdown.length > 12000)
    throw new Error("Documento curado inválido");
  return {
    id,
    title,
    keywords: words(tags),
    content: markdown
      .replace(/<!--[^]*?-->/g, "")
      .replace(/^Fuente editorial:.*$/gm, "")
      .trim(),
  };
}

/** Current question carries more weight; earlier user turns resolve follow-ups. */
export function selectDocuments(
  documents: CuratedDocument[],
  messages: ChatMessage[],
): CuratedDocument[] {
  const current = words(messages.at(-1)?.content ?? "");
  const previous = words(
    messages
      .filter((message) => message.role === "user")
      .slice(-3, -1)
      .map((message) => message.content)
      .join(" "),
  );
  const score = (document: CuratedDocument, query: string[]) =>
    query.reduce(
      (sum, word) =>
        sum +
        (document.keywords.includes(word)
          ? 6
          : words(document.content).includes(word)
            ? 1
            : 0),
      0,
    );
  const ranked = documents
    .map((document) => ({
      document,
      rank: score(document, current) * 3 + score(document, previous),
    }))
    .filter(({ rank }) => rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 3)
    .map(({ document }) => document);
  return ranked.length ? ranked : documents.slice(0, 1);
}

/** Bound memory and spend per warm instance. Distributed limits belong at the gateway. */
export function createChatLimiter() {
  const buckets = new Map<string, { count: number; until: number }>();
  let globalCount = 0,
    globalUntil = 0;
  return (key: string, now = Date.now()): boolean => {
    if (now >= globalUntil) {
      globalCount = 0;
      globalUntil = now + 3600000;
    }
    if (globalCount >= 150) return false;
    for (const [id, bucket] of buckets)
      if (now >= bucket.until) buckets.delete(id);
    const bucket = buckets.get(key);
    if (bucket && bucket.count >= 12) return false;
    if (!bucket && buckets.size >= 2000) return false;
    buckets.set(key, {
      count: (bucket?.count ?? 0) + 1,
      until: bucket?.until ?? now + 600000,
    });
    globalCount++;
    return true;
  };
}
