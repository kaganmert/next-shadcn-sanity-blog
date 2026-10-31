import { describe, expect, it } from "vitest";
import { headingIds } from "./heading-ids";

const heading = (key: string, text: string, style = "h2") => ({
  _type: "block",
  _key: key,
  style,
  children: [{ _type: "span", text }],
});

describe("headingIds", () => {
  it("turns heading text into a readable anchor id", () => {
    const ids = headingIds([heading("a", "What is in the stack?")]);
    expect(ids.get("a")).toBe("what-is-in-the-stack");
  });

  it("joins the text of every span in the heading", () => {
    const block = {
      ...heading("a", ""),
      children: [{ text: "Fetching " }, { text: "content" }],
    };
    expect(headingIds([block]).get("a")).toBe("fetching-content");
  });

  it("keeps ids unique when two headings share a title", () => {
    const ids = headingIds([
      heading("a", "Notes"),
      heading("b", "Notes", "h3"),
      heading("c", "Notes"),
    ]);
    expect([ids.get("a"), ids.get("b"), ids.get("c")]).toEqual([
      "notes",
      "notes-2",
      "notes-3",
    ]);
  });

  it("only gives ids to headings", () => {
    const ids = headingIds([
      heading("p", "Just a paragraph", "normal"),
      { _type: "code", _key: "c" },
    ]);
    expect(ids.size).toBe(0);
  });

  it("falls back to a generic id when a heading has no usable text", () => {
    expect(headingIds([heading("a", "🚀")]).get("a")).toBe("section");
  });
});
