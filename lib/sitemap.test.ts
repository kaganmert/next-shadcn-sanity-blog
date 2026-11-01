import { describe, expect, it } from "vitest";
import { buildSitemap } from "./sitemap";

describe("buildSitemap", () => {
  it("lists the static pages, every post, category, project and standalone page with absolute URLs", () => {
    const entries = buildSitemap({
      siteUrl: "https://example.com",
      posts: [{ slug: "hello-world", updatedAt: "2026-10-21T00:00:00Z" }],
      categories: [{ slug: "nextjs", updatedAt: "2026-10-01T00:00:00Z" }],
      projects: [{ slug: "guessy", updatedAt: "2026-08-30T00:00:00Z" }],
      pages: [{ slug: "privacy", updatedAt: "2026-09-06T00:00:00Z" }],
    });

    expect(entries).toEqual([
      { url: "https://example.com/", lastModified: "2026-10-21T00:00:00Z" },
      { url: "https://example.com/blog", lastModified: "2026-10-21T00:00:00Z" },
      { url: "https://example.com/work" },
      {
        url: "https://example.com/blog/hello-world",
        lastModified: "2026-10-21T00:00:00Z",
      },
      {
        url: "https://example.com/blog/category/nextjs",
        lastModified: "2026-10-01T00:00:00Z",
      },
      {
        url: "https://example.com/work/guessy",
        lastModified: "2026-08-30T00:00:00Z",
      },
      {
        url: "https://example.com/privacy",
        lastModified: "2026-09-06T00:00:00Z",
      },
    ]);
  });

  it("dates the home and blog pages by the most recently updated post", () => {
    const entries = buildSitemap({
      siteUrl: "https://example.com",
      posts: [
        { slug: "a", updatedAt: "2026-01-01T00:00:00Z" },
        { slug: "b", updatedAt: "2026-06-01T00:00:00Z" },
      ],
      categories: [],
      projects: [],
      pages: [],
    });
    expect(
      entries.find((entry) => entry.url === "https://example.com/blog")
        ?.lastModified,
    ).toBe("2026-06-01T00:00:00Z");
  });

  it("leaves the home and blog dates out when there are no posts", () => {
    const entries = buildSitemap({
      siteUrl: "https://example.com",
      posts: [],
      categories: [],
      projects: [],
      pages: [],
    });
    expect(entries).toEqual([
      { url: "https://example.com/" },
      { url: "https://example.com/blog" },
      { url: "https://example.com/work" },
    ]);
  });
});
