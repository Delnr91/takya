import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseDocument, type CuratedDocument } from "../model/chat";
import { knowledgeFiles } from "../data/knowledge";

let corpus: Promise<CuratedDocument[]> | undefined;
export function getCuratedDocuments(): Promise<CuratedDocument[]> {
  corpus ??= Promise.all(
    knowledgeFiles.map(async (id) =>
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
