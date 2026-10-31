import { describe, expect, it } from "vitest";
import { runQuery } from "@/test/run-query";
import {
  categoriesQuery,
  categoryPageQuery,
  categorySlugsQuery,
  latestPostsQuery,
  postsQuery,
  settingsQuery,
} from "./queries";

describe("settingsQuery", () => {
  it("returns the site identity, navigation and social links from the settings singleton", async () => {
    const settings = await runQuery(settingsQuery);

    expect(settings).toEqual({
      title: "next-shadcn-sanity-blog",
      description:
        "A personal blog and portfolio built with Next.js, Sanity and shadcn/ui.",
      intro: "Writing about software, design and the things in between.",
      navigation: [
        { label: "Blog", href: "/blog" },
        { label: "Work", href: "/work" },
      ],
      socialLinks: [
        {
          label: "GitHub",
          url: "https://github.com/kaganmert/next-shadcn-sanity-blog",
        },
        { label: "Email", url: "mailto:hello@example.com" },
      ],
    });
  });

  it("returns null when no settings document exists", async () => {
    expect(await runQuery(settingsQuery, { documents: [] })).toBeNull();
  });
});

describe("postsQuery", () => {
  it("lists every post newest first with the fields a post card needs", async () => {
    const posts =
      await runQuery<
        Array<{ slug: string; title: string; categories: { slug: string }[] }>
      >(postsQuery);

    expect(posts.map((post) => post.slug)).toEqual([
      "designing-for-reading",
      "caching-with-use-cache",
      "hello-world",
    ]);
    expect(posts[2]).toMatchObject({
      title: "Hello, world",
      excerpt:
        "The first post on the rebuilt site: what changed, and why the stack is Next.js 16 with Sanity.",
      publishedAt: "2026-10-20T09:00:00Z",
      categories: [
        { title: "Next.js", slug: "nextjs" },
        { title: "Sanity", slug: "sanity" },
      ],
    });
  });

  it("skips posts that have no slug yet", async () => {
    const posts = await runQuery<unknown[]>(postsQuery, {
      documents: [
        {
          _id: "post-draft-idea",
          _type: "post",
          title: "Idea",
          publishedAt: "2026-10-01T00:00:00Z",
        },
      ],
    });
    expect(posts).toEqual([]);
  });
});

describe("latestPostsQuery", () => {
  it("returns only the newest posts, up to the limit", async () => {
    const posts = await runQuery<Array<{ slug: string }>>(latestPostsQuery, {
      params: { limit: 2 },
    });
    expect(posts.map((post) => post.slug)).toEqual([
      "designing-for-reading",
      "caching-with-use-cache",
    ]);
  });
});

describe("categoriesQuery", () => {
  it("lists categories alphabetically with how many posts each has", async () => {
    expect(await runQuery(categoriesQuery)).toEqual([
      { title: "Design", slug: "design", postCount: 1 },
      { title: "Next.js", slug: "nextjs", postCount: 2 },
      { title: "Sanity", slug: "sanity", postCount: 1 },
    ]);
  });
});

describe("categoryPageQuery", () => {
  it("returns the category with only its own posts, newest first", async () => {
    const category = await runQuery<{
      title: string;
      posts: { slug: string }[];
    }>(categoryPageQuery, {
      params: { slug: "nextjs" },
    });

    expect(category).toMatchObject({
      title: "Next.js",
      slug: "nextjs",
      description: "Notes on the App Router, caching and rendering.",
    });
    expect(category.posts.map((post) => post.slug)).toEqual([
      "caching-with-use-cache",
      "hello-world",
    ]);
  });

  it("returns null for a slug no category has", async () => {
    expect(
      await runQuery(categoryPageQuery, { params: { slug: "does-not-exist" } }),
    ).toBeNull();
  });
});

describe("categorySlugsQuery", () => {
  it("returns one route param per category", async () => {
    expect(await runQuery(categorySlugsQuery)).toEqual(
      expect.arrayContaining([
        { slug: "nextjs" },
        { slug: "sanity" },
        { slug: "design" },
      ]),
    );
    expect(await runQuery<unknown[]>(categorySlugsQuery)).toHaveLength(3);
  });
});
