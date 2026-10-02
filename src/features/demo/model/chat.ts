import { z } from "zod";

export const chatMessageSchema = z
  .object({
    role: z.enum(["user", "assistant"]),
    content: z.string().trim().min(1).max(2000),
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
