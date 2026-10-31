import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safe-redirect";

describe("safeRedirectPath", () => {
  it("keeps a same-site path with its query string", () => {
    expect(safeRedirectPath("/blog/hello-world?ref=studio")).toBe(
      "/blog/hello-world?ref=studio",
    );
  });

  it("falls back to the home page when no path is given", () => {
    expect(safeRedirectPath(null)).toBe("/");
  });

  it.each([
    ["an absolute URL", "https://evil.example"],
    ["a protocol-relative URL", "//evil.example"],
    [
      "a backslash trick browsers treat as protocol-relative",
      "/\\evil.example",
    ],
    ["a relative path without a leading slash", "blog"],
  ])("refuses %s", (_, input) => {
    expect(safeRedirectPath(input)).toBe("/");
  });
});
