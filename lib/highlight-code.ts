import { type BundledLanguage, bundledLanguages, codeToHtml } from "shiki";

/**
 * Highlights code with Shiki. Colours for both themes are emitted as CSS
 * variables (`--shiki-light` / `--shiki-dark`) and picked by the active theme
 * in CSS, so no highlighter ships to the browser. Unknown languages render as
 * plain text instead of failing the page.
 */
export async function highlightCode(
  code: string,
  language: string | null | undefined,
): Promise<string> {
  const lang =
    language && language in bundledLanguages
      ? (language as BundledLanguage)
      : "text";
  return codeToHtml(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
