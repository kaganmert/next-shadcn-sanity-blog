import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: routes.home,
      disallow: [routes.studio, routes.api],
    },
    sitemap: absoluteUrl(routes.sitemap),
  };
}
