/** Every URL the site links to, so pages, links and the Studio agree. */
export const routes = {
  home: "/",
  blog: "/blog",
  work: "/work",
  /** A standalone page from Sanity, e.g. /privacy. */
  page: (slug: string) => `/${encodeURIComponent(slug)}`,
  project: (slug: string) => `/work/${encodeURIComponent(slug)}`,
  resume: "/cv.pdf",
  post: (slug: string) => `/blog/${encodeURIComponent(slug)}`,
  category: (slug: string) => `/blog/category/${encodeURIComponent(slug)}`,
  studio: "/studio",
  rss: "/rss.xml",
  sitemap: "/sitemap.xml",
  /** Route handlers (draft mode, etc.); not pages. */
  api: "/api/",
  draftMode: {
    enable: "/api/draft-mode/enable",
    disable: "/api/draft-mode/disable",
    /** Leave draft mode and come back to `path`. */
    exit: (path: string) =>
      `/api/draft-mode/disable?redirect=${encodeURIComponent(path)}`,
  },
} as const;

/**
 * First path segments the app already uses. A Sanity page at /[slug] can't
 * take one of these: the existing route would always win.
 */
export const reservedPageSlugs: ReadonlySet<string> = new Set([
  "blog",
  "work",
  "studio",
  "api",
  "rss.xml",
  "sitemap.xml",
  "robots.txt",
  "cv.pdf",
  "opengraph-image",
  "favicon.ico",
]);
