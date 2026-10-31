/**
 * Every user-facing UI string lives here so a fork can translate the site in
 * one place. Content (posts, settings) comes from Sanity, not from this file.
 */
export const strings = {
  siteName: "next-shadcn-sanity-blog",
  skipToContent: "Skip to content",
  nav: {
    label: "Main",
    home: "Home",
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
