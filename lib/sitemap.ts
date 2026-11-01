import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-url";

type Dated = { slug: string; updatedAt: string };

/**
 * Sitemap entries: the static pages, every post, category, project page and
 * standalone page, with
 * absolute URLs. Home and blog are dated by the most recently updated post.
 */
export function buildSitemap({
  siteUrl,
  posts,
  categories,
  projects,
  pages,
}: {
  siteUrl: string;
  posts: Dated[];
  categories: Dated[];
  projects: Dated[];
  pages: Dated[];
}): MetadataRoute.Sitemap {
  const latestPost = posts
    .map((post) => post.updatedAt)
    .sort()
    .at(-1);
  const dated = (url: string, lastModified: string | undefined) =>
    lastModified ? { url, lastModified } : { url };

  return [
    dated(absoluteUrl(routes.home, siteUrl), latestPost),
    dated(absoluteUrl(routes.blog, siteUrl), latestPost),
    { url: absoluteUrl(routes.work, siteUrl) },
    ...posts.map((post) => ({
      url: absoluteUrl(routes.post(post.slug), siteUrl),
      lastModified: post.updatedAt,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(routes.category(category.slug), siteUrl),
      lastModified: category.updatedAt,
    })),
    ...projects.map((project) => ({
      url: absoluteUrl(routes.project(project.slug), siteUrl),
      lastModified: project.updatedAt,
    })),
    ...pages.map((page) => ({
      url: absoluteUrl(routes.page(page.slug), siteUrl),
      lastModified: page.updatedAt,
    })),
  ];
}
