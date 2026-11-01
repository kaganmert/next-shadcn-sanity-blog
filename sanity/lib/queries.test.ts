import { describe, expect, it } from "vitest";
import { runQuery } from "@/test/run-query";
import {
  categoriesQuery,
  categoryPageQuery,
  categorySlugsQuery,
  indexableCategoriesQuery,
  indexablePostsQuery,
  indexableProjectsQuery,
  latestPostsQuery,
  postQuery,
  postSlugsQuery,
  postsQuery,
  projectQuery,
  projectSlugsQuery,
  resumeQuery,
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

  it("treats an experience without the current flag as a past role", async () => {
    const work = await runQuery<{ experiences: { company: string }[] }>(
      workPageQuery,
      {
        documents: [
          {
            _id: "e1",
            _type: "experience",
            company: "Imported role",
            startDate: "2024-01-01",
          },
          {
            _id: "e2",
            _type: "experience",
            company: "Current role",
            startDate: "2022-01-01",
            isCurrent: true,
          },
        ],
      },
    );
    expect(work.experiences.map((experience) => experience.company)).toEqual([
      "Current role",
      "Imported role",
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

  it("lists projects newest first and marks the ones with their own page", async () => {
    const work = await runQuery<{
      projects: { name: string; hasPage: boolean }[];
    }>(workPageQuery, {
      documents: [
        {
          _id: "old",
          _type: "project",
          name: "Old",
          slug: { current: "old" },
          startDate: "2020-01-01",
        },
        {
          _id: "new",
          _type: "project",
          name: "New",
          slug: { current: "new" },
          startDate: "2026-01-01",
          gallery: [{ _type: "image", alt: "Screen" }],
        },
      ],
    });
    expect(
      work.projects.map(({ name, hasPage }) => ({ name, hasPage })),
    ).toEqual([
      { name: "New", hasPage: true },
      { name: "Old", hasPage: false },
    ]);
  });

  it("returns the seed's sample project and credential", async () => {
    const work = await runQuery<{
      projects: { slug: string; techStack: string[] }[];
      credentials: { kind: string; title: string; period: string }[];
    }>(workPageQuery);
    expect(work.projects).toMatchObject([
      {
        slug: "next-shadcn-sanity-blog",
        techStack: ["Next.js", "Sanity", "Tailwind CSS", "shadcn/ui"],
      },
    ]);
    expect(work.credentials).toMatchObject([
      {
        kind: "education",
        title: "BSc Computer Science",
        period: "2016 – 2020",
      },
    ]);
  });

  it("lists undated credentials after dated ones", async () => {
    const work = await runQuery<{ credentials: { title: string }[] }>(
      workPageQuery,
      {
        documents: [
          {
            _id: "a",
            _type: "credential",
            kind: "certificate",
            title: "Undated",
          },
          {
            _id: "b",
            _type: "credential",
            kind: "award",
            title: "Dated",
            period: "Mar 2021",
          },
        ],
      },
    );
    expect(work.credentials.map((credential) => credential.title)).toEqual([
      "Dated",
      "Undated",
    ]);
  });

  it("returns the resume URL from the settings file field", async () => {
    const work = await runQuery<{ resumeUrl: string | null }>(workPageQuery, {
      documents: resumeDocuments,
    });
    expect(work.resumeUrl).toBe("https://cdn.sanity.io/files/p/d/cv.pdf");
  });

  it("returns empty lists when nothing has been added yet", async () => {
    expect(await runQuery(workPageQuery, { documents: [] })).toEqual({
      experiences: [],
      projects: [],
      credentials: [],
      resumeUrl: null,
      techStack: [],
    });
  });
});

/** A settings singleton with an uploaded resume, and the file asset it points to. */
const resumeDocuments = [
  {
    _id: "settings",
    _type: "settings",
    title: "Site",
    resume: {
      _type: "file",
      asset: { _type: "reference", _ref: "file-cv-pdf" },
    },
  },
  {
    _id: "file-cv-pdf",
    _type: "sanity.fileAsset",
    url: "https://cdn.sanity.io/files/p/d/cv.pdf",
  },
];

describe("resumeQuery", () => {
  it("returns the uploaded resume's URL", async () => {
    expect(await runQuery(resumeQuery, { documents: resumeDocuments })).toBe(
      "https://cdn.sanity.io/files/p/d/cv.pdf",
    );
  });

  it("returns null when no resume is uploaded", async () => {
    expect(await runQuery(resumeQuery)).toBeNull();
  });
});

describe("projectQuery", () => {
  it("returns the project with the posts in its updates category, newest first", async () => {
    const project = await runQuery<{
      name: string;
      gallery: { alt: string }[];
      updates: { slug: string }[];
    }>(projectQuery, { params: { slug: "next-shadcn-sanity-blog" } });
    expect(project.name).toBe("next-shadcn-sanity-blog");
    expect(project.gallery).toMatchObject([
      { alt: "The home page of the site" },
    ]);
    expect(project.updates.map((post) => post.slug)).toEqual([
      "caching-with-use-cache",
      "hello-world",
    ]);
  });

  it("returns no updates when the project has no category", async () => {
    const project = await runQuery<{ updates: unknown[] }>(projectQuery, {
      params: { slug: "solo" },
      documents: [
        {
          _id: "solo",
          _type: "project",
          name: "Solo",
          slug: { current: "solo" },
          gallery: [{ _type: "image", alt: "Screen" }],
        },
      ],
    });
    expect(project.updates).toEqual([]);
  });

  it("returns null for a project without a gallery, which has no page", async () => {
    const project = await runQuery(projectQuery, {
      params: { slug: "plain" },
      documents: [
        {
          _id: "plain",
          _type: "project",
          name: "Plain",
          slug: { current: "plain" },
        },
      ],
    });
    expect(project).toBeNull();
  });
});

describe("projectSlugsQuery", () => {
  it("lists only projects that have a page", async () => {
    const slugs = await runQuery(projectSlugsQuery, {
      documents: [
        {
          _id: "a",
          _type: "project",
          slug: { current: "with-gallery" },
          gallery: [{ _type: "image" }],
        },
        { _id: "b", _type: "project", slug: { current: "without-gallery" } },
      ],
    });
    expect(slugs).toEqual([{ slug: "with-gallery" }]);
  });
});

describe("indexablePostsQuery", () => {
  it("lists posts newest first with what the feed and sitemap need", async () => {
    const posts = await runQuery<Array<Record<string, unknown>>>(
      indexablePostsQuery,
      {
        documents: [
          {
            _id: "p1",
            _type: "post",
            title: "Old",
            slug: { current: "old" },
            excerpt: "A",
            publishedAt: "2026-01-01T00:00:00Z",
            _updatedAt: "2026-02-01T00:00:00Z",
          },
          {
            _id: "p2",
            _type: "post",
            title: "New",
            slug: { current: "new" },
            excerpt: "B",
            publishedAt: "2026-03-01T00:00:00Z",
            _updatedAt: "2026-03-02T00:00:00Z",
          },
          {
            _id: "p3",
            _type: "post",
            title: "No slug",
            publishedAt: "2026-04-01T00:00:00Z",
          },
        ],
      },
    );
    expect(posts).toEqual([
      {
        title: "New",
        slug: "new",
        excerpt: "B",
        publishedAt: "2026-03-01T00:00:00Z",
        updatedAt: "2026-03-02T00:00:00Z",
      },
      {
        title: "Old",
        slug: "old",
        excerpt: "A",
        publishedAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-02-01T00:00:00Z",
      },
    ]);
  });
});

describe("indexableCategoriesQuery", () => {
  it("lists categories with their slug and last update", async () => {
    const categories = await runQuery(indexableCategoriesQuery, {
      documents: [
        {
          _id: "c1",
          _type: "category",
          title: "Next.js",
          slug: { current: "nextjs" },
          _updatedAt: "2026-05-01T00:00:00Z",
        },
      ],
    });
    expect(categories).toEqual([
      { slug: "nextjs", updatedAt: "2026-05-01T00:00:00Z" },
    ]);
  });
});

describe("indexableProjectsQuery", () => {
  it("lists project pages with their slug and last update", async () => {
    const projects = await runQuery(indexableProjectsQuery, {
      documents: [
        {
          _id: "a",
          _type: "project",
          slug: { current: "guessy" },
          gallery: [{ _type: "image" }],
          _updatedAt: "2026-08-30T00:00:00Z",
        },
        { _id: "b", _type: "project", slug: { current: "cv-only" } },
      ],
    });
    expect(projects).toEqual([
      { slug: "guessy", updatedAt: "2026-08-30T00:00:00Z" },
    ]);
  });
});
