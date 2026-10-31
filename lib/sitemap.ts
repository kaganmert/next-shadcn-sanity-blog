import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";

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
    dated(`${siteUrl}${routes.home}`, latestPost),
    dated(`${siteUrl}${routes.blog}`, latestPost),
    { url: `${siteUrl}${routes.work}` },
    ...posts.map((post) => ({
      url: `${siteUrl}${routes.post(post.slug)}`,
      lastModified: post.updatedAt,
    })),
    ...categories.map((category) => ({
      url: `${siteUrl}${routes.category(category.slug)}`,
      lastModified: category.updatedAt,
    })),
  ];
}
