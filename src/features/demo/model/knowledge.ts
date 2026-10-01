import { z } from "zod";
import { knowledge, type KnowledgeEntry } from "../data/knowledge";

export const questionSchema = z.string().trim().min(3).max(220);
export const retrievalResultSchema = z.object({
  answer: z.string(),
  sources: z
    .array(z.object({ id: z.string(), title: z.string(), source: z.string() }))
    .max(3),
  found: z.boolean(),
});
export type RetrievalResult = z.infer<typeof retrievalResultSchema>;

const stopwords = new Set([
  "que",
  "como",
  "para",
  "con",
  "una",
  "las",
  "los",
  "del",
  "por",
  "este",
  "esta",
  "hace",
  "puedo",
  "tengo",
  "sobre",
  "cual",
  "desde",
  "cuando",
  "en",
  "el",
  "la",
  "es",
  "un",
  "al",
  "se",
  "de",
  "mi",
]);
function terms(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .match(/[a-z0-9]{2,}/g)
      ?.filter((term) => !stopwords.has(term)) ?? []
  );
}
function score(entry: KnowledgeEntry, query: string[]) {
  const title = terms(entry.title);
  const keywords: string[] = [...entry.keywords];
  const body = terms(entry.summary);
  return query.reduce(
    (total, token) =>
      total +
      (keywords.includes(token) ? 6 : 0) +
      (title.includes(token) ? 4 : 0) +
      (body.includes(token) ? 1 : 0),
    0,
  );
}

/** Transparent lexical retrieval. No model, network call or generated answer. */
export function retrieveKnowledge(question: string): RetrievalResult {
  const parsed = questionSchema.safeParse(question);
  if (!parsed.success)
    return {
      found: false,
      answer: "Escribe una pregunta de al menos tres caracteres.",
      sources: [],
    };
  const query = terms(parsed.data);
  const ranked = knowledge
    .map((entry) => ({
      entry,
      score: score(entry, query),
      hasTopic: query.some((term) =>
        (entry.keywords as readonly string[]).includes(term),
      ),
    }))
    .filter((item) => item.hasTopic)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);
  if (ranked.length === 0)
    return {
      found: false,
      answer:
        "No encuentro esa respuesta en los documentos curados de esta versión. Consulta la Guía de práctica o pregunta al equipo TAKYA; no voy a inventar una respuesta.",
      sources: [],
    };
  return retrievalResultSchema.parse({
    found: true,
    answer: ranked.map(({ entry }) => entry.summary).join(" "),
    sources: ranked.map(({ entry }) => ({
      id: entry.id,
      title: entry.title,
      source: entry.source,
    })),
  });
}
