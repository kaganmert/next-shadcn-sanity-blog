import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { buildSitemap } from "@/lib/sitemap";
import { fetchSanity, publishedFetchOptions } from "@/sanity/lib/live";
import {
  indexableCategoriesQuery,
  indexablePostsQuery,
} from "@/sanity/lib/queries";

/** Published content only: the sitemap never sees drafts. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: posts }, { data: categories }] = await Promise.all([
    fetchSanity({ query: indexablePostsQuery, ...publishedFetchOptions }),
    fetchSanity({ query: indexableCategoriesQuery, ...publishedFetchOptions }),
  ]);
  return buildSitemap({ siteUrl: getSiteUrl(), posts, categories });
}
