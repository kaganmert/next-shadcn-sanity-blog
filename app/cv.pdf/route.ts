import { fetchSanity, publishedFetchOptions } from "@/sanity/lib/live";
import { resumeQuery } from "@/sanity/lib/queries";

/**
 * /cv.pdf: a stable address for the resume uploaded in Settings. Redirects to
 * the file on the Sanity CDN, so a new upload never needs a new link.
 */
export async function GET() {
  const { data: url } = await fetchSanity({
    query: resumeQuery,
    ...publishedFetchOptions,
  });
  if (!url) return new Response("Not found", { status: 404 });
  return Response.redirect(url, 307);
}
