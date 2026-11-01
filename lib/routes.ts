/** Every URL the site links to, so pages, links and the Studio agree. */
export const routes = {
  home: "/",
  blog: "/blog",
  work: "/work",
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
