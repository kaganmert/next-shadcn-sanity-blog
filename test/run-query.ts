import { readFileSync } from "node:fs";
import { evaluate, parse } from "groq-js";

/** The documents in sanity/seed/data.ndjson. */
function loadSeedDocuments(): Record<string, unknown>[] {
  const ndjson = readFileSync(
    new URL("../sanity/seed/data.ndjson", import.meta.url),
    "utf8",
  );
  return ndjson
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

/** Runs a GROQ query in memory against documents (the seed by default), like the Content Lake would. */
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
