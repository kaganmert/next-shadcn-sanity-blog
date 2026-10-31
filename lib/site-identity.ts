import { strings } from "@/lib/strings";
import { fetchSanity, publishedFetchOptions } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";

/**
 * The site's name and description (its identity) for metadata, the feed and OG images. Always the
 * published settings (metadata is not previewed), with the UI-string fallbacks
 * until an editor fills in Settings.
 */
export async function getSiteIdentity() {
  const { data: settings } = await fetchSanity({
    query: settingsQuery,
    ...publishedFetchOptions,
  });
  return {
    title: settings?.title ?? strings.siteName,
    description: settings?.description ?? strings.siteDescription,
  };
}
