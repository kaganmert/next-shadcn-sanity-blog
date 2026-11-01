import { cacheLife } from "next/cache";
import { highlightCode } from "@/lib/highlight-code";

/**
 * Highlighting runs inside a cache scope so it becomes part of the static
 * prerender: Shiki's tokenizer reads `Date.now()`, which Cache Components
 * rejects outside a cache scope, and the output never changes for the same input.
 */
async function cachedHighlight(
  code: string,
  language: string | null | undefined,
) {
  "use cache";
  cacheLife("max");
  return highlightCode(code, language);
}

/** A server-rendered, Shiki-highlighted code block with an optional filename. */
export async function CodeBlock({
  code,
  language,
  filename,
}: {
  code: string;
  language?: string | null;
  filename?: string | null;
}) {
  const html = await cachedHighlight(code, language);

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-sm border text-[0.85rem]">
      {filename ? (
        <figcaption className="border-b px-5 py-2.5 font-mono text-[0.7rem] text-muted-foreground tracking-wide">
          {filename}
        </figcaption>
      ) : null}
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki escapes the code and only adds highlighting spans (covered by lib/highlight-code.test.ts). */}
      <div className="code-block" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
