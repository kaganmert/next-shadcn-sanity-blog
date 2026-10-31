/**
 * Every user-facing UI string lives here so a fork can translate the site in
 * one place. Content (posts, experiences, site settings) comes from Sanity.
 */
export const strings = {
  // Fallbacks used until the editor fills in the Sanity `settings` singleton.
  // TODO(NSB-06): the home intro and NSB-09 metadata read from `settings` too.
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
  draftMode: {
    label: "Viewing drafts",
    exit: "Exit draft mode",
  },
  footer: {
    builtWith: "Built with Next.js and Sanity.",
  },
} as const;
