import {
  defineDocuments,
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";
import { routes } from "@/lib/routes";

/**
 * Tells the Presentation tool which document a route shows (mainDocuments)
 * and where each document is used (locations). The route patterns mirror
 * `routes` in lib/routes.ts.
 */
export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: defineDocuments([
    {
      route: "/blog/category/:slug",
      filter: `_type == "category" && slug.current == $slug`,
    },
    {
      route: "/blog/:slug",
      filter: `_type == "post" && slug.current == $slug`,
    },
    {
      route: "/work/:slug",
      filter: `_type == "project" && slug.current == $slug`,
    },
    // Last: it matches any single segment, so the more specific routes go first.
    {
      route: "/:slug",
      filter: `_type == "page" && slug.current == $slug`,
    },
  ]),
  locations: {
    settings: defineLocations({
      message: "Used on every page",
      tone: "positive",
      locations: [{ title: "Home", href: routes.home }],
    }),
    post: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              { title: doc.title || "Untitled", href: routes.post(doc.slug) },
              { title: "Blog", href: routes.blog },
            ]
          : [],
      }),
    }),
    category: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [
              {
                title: doc.title || "Untitled",
                href: routes.category(doc.slug),
              },
            ]
          : [],
      }),
    }),
    experience: defineLocations({
      locations: [{ title: "Work", href: routes.work }],
    }),
    page: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: doc?.slug
          ? [{ title: doc.title || "Untitled", href: routes.page(doc.slug) }]
          : [],
      }),
    }),
    credential: defineLocations({
      locations: [{ title: "Work", href: routes.work }],
    }),
    project: defineLocations({
      select: { title: "name", slug: "slug.current", gallery: "gallery" },
      resolve: (doc) => ({
        locations: [
          ...(doc?.slug && doc.gallery?.length
            ? [
                {
                  title: doc.title || "Untitled",
                  href: routes.project(doc.slug),
                },
              ]
            : []),
          { title: "Work", href: routes.work },
        ],
      }),
    }),
  },
};
