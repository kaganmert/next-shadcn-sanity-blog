import { cacheLife } from "next/cache";
import { buildRssFeed } from "@/lib/rss";
import { getSiteIdentity } from "@/lib/site-identity";
import { getSiteUrl } from "@/lib/site-url";
import { fetchSanity, publishedFetchOptions } from "@/sanity/lib/live";
import { indexablePostsQuery } from "@/sanity/lib/queries";

/**
 * Built once and cached. Sanity Live revalidates the posts it reads; the
 * hourly lifetime is a safety net for feed readers between site visits.
 */
async function getFeed() {
  "use cache";
  cacheLife("hours");
  const [site, { data: posts }] = await Promise.all([
    getSiteIdentity(),
    fetchSanity({ query: indexablePostsQuery, ...publishedFetchOptions }),
  ]);
  return buildRssFeed({
    site: { ...site, url: getSiteUrl() },
    posts,
  });
}

export async function GET() {
  return new Response(await getFeed(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
