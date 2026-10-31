/**
 * Every user-facing UI string lives here so a fork can translate the site in
 * one place. Content (posts, experiences, site settings) comes from Sanity.
 */
export const strings = {
  // TODO(NSB-06): replace siteName/siteDescription and the home intro with the
  // Sanity `settings` singleton once the data layer (NSB-05) is in place.
  siteName: "next-shadcn-sanity-blog",
  siteDescription:
    "A personal blog and portfolio built with Next.js and Sanity.",
  home: {
    title: "Hello.",
    intro: "Writing about software, design and the things in between.",
  },
  skipToContent: "Skip to content",
  nav: {
    label: "Main",
    blog: "Blog",
    work: "Work",
  },
  theme: {
    toggle: "Toggle theme",
  },
  footer: {
    builtWith: "Built with Next.js and Sanity.",
  },
} as const;
