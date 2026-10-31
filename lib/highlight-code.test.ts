import { describe, expect, it } from "vitest";
import { highlightCode } from "./highlight-code";

describe("highlightCode", () => {
  it("renders highlighted HTML with colours for both the light and dark theme", async () => {
    const html = await highlightCode('const greeting = "hi";', "typescript");
    expect(html).toMatch(/^<pre class="shiki/);
    expect(html).toContain("--shiki-light:");
    expect(html).toContain("--shiki-dark:");
    expect(html).toContain("greeting");
  });

  it("escapes code so it can't inject markup", async () => {
    const html = await highlightCode("<script>alert(1)</script>", "html");
    expect(html).not.toContain("<script>");
    expect(html).toContain("&#x3C;");
  });

  it("falls back to plain text for a language Shiki doesn't know", async () => {
    const html = await highlightCode("SELECT 1;", "not-a-real-language");
    expect(html).toMatch(/^<pre class="shiki/);
    expect(html).toContain("SELECT 1;");
  });

  it("treats a missing language as plain text", async () => {
    await expect(highlightCode("plain", undefined)).resolves.toContain("plain");
  });
});
