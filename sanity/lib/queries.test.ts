import { describe, expect, it } from "vitest";
import { runQuery } from "@/test/run-query";
import {
  categoriesQuery,
  categoryPageQuery,
  categorySlugsQuery,
  latestPostsQuery,
  postQuery,
  postSlugsQuery,
  postsQuery,
  settingsQuery,
  workPageQuery,
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
  it("lists every post newest first with the fields a post summary needs", async () => {
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

describe("postQuery", () => {
  it("returns a post with its author, categories, cover and body", async () => {
    const post = await runQuery<
      Record<string, unknown> & { body: { _type: string }[] }
    >(postQuery, {
      params: { slug: "hello-world" },
    });

    expect(post).toMatchObject({
      title: "Hello, world",
      slug: "hello-world",
      excerpt:
        "The first post on the rebuilt site: what changed, and why the stack is Next.js 16 with Sanity.",
      publishedAt: "2026-10-20T09:00:00Z",
      author: { name: "Sample Author" },
      categories: [
        { title: "Next.js", slug: "nextjs" },
        { title: "Sanity", slug: "sanity" },
      ],
      coverImage: { alt: "Blue gradient with the words Hello, world" },
    });
    expect(post.body.map((block) => block._type)).toContain("code");
  });

  it("returns null for a slug no post has", async () => {
    expect(
      await runQuery(postQuery, { params: { slug: "missing" } }),
    ).toBeNull();
  });
});

describe("postSlugsQuery", () => {
  it("returns one route param per post", async () => {
    const params = await runQuery<{ slug: string }[]>(postSlugsQuery);
    expect(params.map(({ slug }) => slug).sort()).toEqual([
      "caching-with-use-cache",
      "designing-for-reading",
      "hello-world",
    ]);
  });
});

describe("workPageQuery", () => {
  it("lists experiences with the current role first, then by start date, newest first", async () => {
    const work = await runQuery<{ experiences: { company: string }[] }>(
      workPageQuery,
    );
    expect(work.experiences.map((experience) => experience.company)).toEqual([
      "Acme Corp",
      "Globex",
      "Initech",
    ]);
  });

  it("puts the current role first even when it started before a past role", async () => {
    const work = await runQuery<{ experiences: { company: string }[] }>(
      workPageQuery,
      {
        documents: [
          {
            _id: "e1",
            _type: "experience",
            company: "Later past role",
            startDate: "2023-01-01",
            isCurrent: false,
          },
          {
            _id: "e2",
            _type: "experience",
            company: "Long-running current role",
            startDate: "2020-01-01",
            isCurrent: true,
          },
        ],
      },
    );
    expect(work.experiences.map((experience) => experience.company)).toEqual([
      "Long-running current role",
      "Later past role",
    ]);
  });

  it("returns the tech stack from settings", async () => {
    const work = await runQuery<{
      techStack: { name: string; category: string }[];
    }>(workPageQuery);
    expect(work.techStack.slice(0, 2)).toEqual([
      { name: "TypeScript", category: "Languages" },
      { name: "GROQ", category: "Languages" },
    ]);
  });

  it("returns empty lists when nothing has been added yet", async () => {
    expect(await runQuery(workPageQuery, { documents: [] })).toEqual({
      experiences: [],
      techStack: null,
    });
  });
});
