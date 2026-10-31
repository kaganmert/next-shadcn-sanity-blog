import type { MetadataRoute } from "next";
import { routes } from "@/lib/routes";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: [routes.studio, "/api/"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
