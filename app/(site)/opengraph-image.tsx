import { renderOgImage } from "@/lib/og-image";
import { getSiteSettings } from "@/lib/site-settings";

export { ogImageSize as size } from "@/lib/og-image";
export const contentType = "image/png";
export const alt = "Site preview";

/** The default OG image for every page without its own. */
export default async function OpengraphImage() {
  const site = await getSiteSettings();
  return renderOgImage({
    eyebrow: site.title,
    title: site.description,
    footer: "",
  });
}
