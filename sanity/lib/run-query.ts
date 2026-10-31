import { readFileSync } from "node:fs";
import { evaluate, parse } from "groq-js";

/** Test-only: the documents in sanity/seed/data.ndjson. */
export function loadSeedDocuments(): Record<string, unknown>[] {
  const ndjson = readFileSync(
    new URL("../seed/data.ndjson", import.meta.url),
    "utf8",
  );
  return ndjson
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

/** Test-only: run a GROQ query in memory against documents, like the Content Lake would. */
export async function runQuery<T = unknown>(
  query: string,
  {
    documents = loadSeedDocuments(),
    params = {},
  }: { documents?: unknown[]; params?: Record<string, unknown> } = {},
): Promise<T> {
  const result = await evaluate(parse(query, { params }), {
    dataset: documents,
    params,
  });
  return (await result.get()) as T;
}
