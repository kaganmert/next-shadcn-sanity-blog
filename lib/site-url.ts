/** Reads NEXT_PUBLIC_SITE_URL, VERCEL_PROJECT_PRODUCTION_URL and VERCEL_URL. */
type SiteUrlEnv = Record<string, string | undefined>;

/**
 * The site's canonical origin (no trailing slash) for metadata, the sitemap,
 * RSS and OG images. An explicit NEXT_PUBLIC_SITE_URL wins; on Vercel the
 * production domain is used, then the deployment URL; locally, localhost.
 */
export function getSiteUrl(env: SiteUrlEnv = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL)
    return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  if (env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
  return "http://localhost:3000";
}

/** `path` (from `routes`) as an absolute URL on `siteUrl`. */
export function absoluteUrl(
  path: string,
  siteUrl: string = getSiteUrl(),
): string {
  return `${siteUrl}${path}`;
}
