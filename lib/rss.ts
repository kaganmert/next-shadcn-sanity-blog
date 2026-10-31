import { routes } from "@/lib/routes";

type FeedPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
};

type FeedSite = { title: string; description: string; url: string };

/** An RSS 2.0 feed of posts. Links are absolute, dates are RFC 822 (UTC). */
export function buildRssFeed({
  site,
  feedPath,
  posts,
}: {
  site: FeedSite;
  feedPath: string;
  posts: FeedPost[];
}) {
  const items = posts.map((post) => {
    const url = `${site.url}${routes.post(post.slug)}`;
    return [
      "<item>",
      `<title>${escapeXml(post.title)}</title>`,
      `<link>${escapeXml(url)}</link>`,
      `<guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `<description>${escapeXml(post.excerpt)}</description>`,
      `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>`,
      "</item>",
    ].join("");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(site.title)}</title>`,
    `<link>${escapeXml(site.url)}</link>`,
    `<description>${escapeXml(site.description)}</description>`,
    "<language>en</language>",
    `<atom:link href="${escapeXml(`${site.url}${feedPath}`)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    "</channel>",
    "</rss>",
  ].join("\n");
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
