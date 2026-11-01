import { describe, expect, it } from "vitest";
import { reservedPageSlugs, routes } from "./routes";

describe("routes", () => {
  it("builds the URL of a post from its slug", () => {
    expect(routes.post("hello-world")).toBe("/blog/hello-world");
  });

  it("builds the URL of a category page from its slug", () => {
    expect(routes.category("nextjs")).toBe("/blog/category/nextjs");
  });

  it("builds a draft-mode exit link that returns to the current page", () => {
    expect(routes.draftMode.exit("/blog/hello-world")).toBe(
      "/api/draft-mode/disable?redirect=%2Fblog%2Fhello-world",
    );
  });

  it("encodes slug characters that are not URL-safe", () => {
    expect(routes.post("c# tips")).toBe("/blog/c%23%20tips");
  });

  it("builds the URL of a standalone page from its slug", () => {
    expect(routes.page("privacy")).toBe("/privacy");
  });
});

describe("reservedPageSlugs", () => {
  it("reserves the first segment of every fixed route, so a page never shadows one", () => {
    const fixed = [
      routes.blog,
      routes.work,
      routes.studio,
      routes.api,
      routes.rss,
      routes.sitemap,
      routes.resume,
    ];
    for (const path of fixed) {
      expect(reservedPageSlugs).toContain(path.split("/")[1]);
    }
  });
});
