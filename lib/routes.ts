/** Every URL the site links to, so pages, links and the Studio agree. */
export const routes = {
  home: "/",
  blog: "/blog",
  work: "/work",
  post: (slug: string) => `/blog/${encodeURIComponent(slug)}`,
  category: (slug: string) => `/blog/category/${encodeURIComponent(slug)}`,
} as const;
