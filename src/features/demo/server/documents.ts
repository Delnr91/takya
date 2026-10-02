import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseDocument, type CuratedDocument } from "../model/chat";

const files = [
  "01-conocer-takya",
  "02-revisar-un-caso",
  "03-decisiones-y-prioridad",
  "04-accesibilidad",
  "05-datos-y-limites",
] as const;
let corpus: Promise<CuratedDocument[]> | undefined;
export function getCuratedDocuments(): Promise<CuratedDocument[]> {
  corpus ??= Promise.all(
    files.map(async (id) =>
      parseDocument(
        id,
        await readFile(
          path.join(process.cwd(), "docs", "knowledge", `${id}.md`),
          "utf8",
        ),
      ),
    ),
  ).catch((error: unknown) => {
    corpus = undefined;
    throw error;
  });
  return corpus;
}
