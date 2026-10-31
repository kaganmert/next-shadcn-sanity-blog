import { cookies, draftMode } from "next/headers";
import {
  defineLive,
  type LivePerspective,
  resolvePerspectiveFromCookies,
  resolveVariantFromCookies,
  type StrictDefinedFetchType,
} from "next-sanity/live";
import { client } from "./client";
import { token } from "./token";

/**
 * Sanity Live for Cache Components. `strict: true` makes every fetch state its
 * perspective and stega explicitly, because draftMode() and cookies() must be
 * resolved outside `'use cache'` boundaries.
 *
 * The token stays on the server (`browserToken: false`): published content
 * streams live to everyone, and drafts update live inside the Presentation
 * tool, which supplies its own credentials.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: false,
  strict: true,
});

/**
 * The app's one shared `'use cache'` boundary for Sanity queries.
 * `sanityFetch` tags and sets the cache life internally; this wrapper only
 * creates the boundary, so callers never add their own.
 */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  "use cache";
  return sanityFetch(options);
};

export interface FetchOptions {
  perspective: LivePerspective;
  variant?: string;
  stega: boolean;
}

/** What every visitor outside draft mode sees. */
export const publishedFetchOptions = {
  perspective: "published",
  stega: false,
} as const satisfies FetchOptions;

/**
 * Fetch options for the current request. Call it outside `'use cache'`: in
 * draft mode it reads the perspective chosen in the Presentation tool from cookies.
 */
export async function getFetchOptions(): Promise<FetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode();
  if (!isDraftMode) return publishedFetchOptions;

  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });
  const variant = await resolveVariantFromCookies({ cookies: jar });
  return { perspective: perspective ?? "drafts", variant, stega: true };
}
