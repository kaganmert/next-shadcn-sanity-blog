import { renderOgImage } from "@/lib/og-image";
import { getSiteIdentity } from "@/lib/site-identity";
import { strings } from "@/lib/strings";

export { ogImageSize as size } from "@/lib/og-image";
export const contentType = "image/png";
export const alt = strings.og.siteAlt;

/** The default OG image for every page without its own. */
export default async function OpengraphImage() {
  const site = await getSiteIdentity();
  return renderOgImage({
    eyebrow: site.title,
    title: site.description,
  });
}
