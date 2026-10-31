import { cacheLife } from "next/cache";
import { routes } from "@/lib/routes";
import { buildRssFeed } from "@/lib/rss";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";
import { fetchSanity, publishedFetchOptions } from "@/sanity/lib/live";
import { seoPostsQuery } from "@/sanity/lib/queries";

/**
 * Built once and cached. Sanity Live revalidates the posts it reads; the
 * hourly lifetime is a safety net for feed readers between site visits.
 */
async function getFeed() {
  "use cache";
  cacheLife("hours");
  const [site, { data: posts }] = await Promise.all([
    getSiteSettings(),
    fetchSanity({ query: seoPostsQuery, ...publishedFetchOptions }),
  ]);
  return buildRssFeed({
    site: { ...site, url: getSiteUrl() },
    feedPath: routes.rss,
    posts,
  });
}

export async function GET() {
  return new Response(await getFeed(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
