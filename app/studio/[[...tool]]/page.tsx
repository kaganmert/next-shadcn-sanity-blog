/**
 * Embedded Sanity Studio. Every route under /studio is handled client-side by
 * the Studio's own router.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export { metadata, viewport } from "next-sanity/studio";

/**
 * Prerender the Studio shell at /studio. Every deeper Studio URL renders the
 * same client-side app, so nothing about the page depends on the request.
 */
export function generateStaticParams() {
  return [{ tool: [] }];
}

export default function StudioPage() {
  return <NextStudio config={config} />;
}
