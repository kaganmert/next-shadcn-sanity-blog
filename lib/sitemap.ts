import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-url";

type Dated = { slug: string; updatedAt: string };

/**
 * Sitemap entries: the static pages, every post and every category, with
 * absolute URLs. Home and blog are dated by the most recently updated post.
 */
export function buildSitemap({
  siteUrl,
  posts,
  categories,
}: {
  siteUrl: string;
  posts: Dated[];
  categories: Dated[];
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
  ];
}
