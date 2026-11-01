/**
 * Every user-facing UI string lives here so a fork can translate the site in
 * one place. Content (posts, experiences, site settings) comes from Sanity.
 */
export const strings = {
  locale: { lang: "en", openGraph: "en_US" },
  // Fallbacks used until the editor fills in the Sanity `settings` singleton.
  siteName: "next-shadcn-sanity-blog",
  siteDescription:
    "A personal blog and portfolio built with Next.js and Sanity.",
  home: {
    intro: "Writing about software, design and the things in between.",
    latestPosts: "Latest posts",
  },
  /** Link back to the full post list, used on the home, category and post pages. */
  allPosts: "All posts",
  blog: {
    title: "Blog",
    categories: "Categories",
    empty: "No posts yet.",
  },
  post: {
    by: "By",
    linkToSection: "Link to this section",
  },
  work: {
    title: "Work",
    experience: "Experience",
    techStack: "Tech stack",
    present: "Present",
    otherTech: "Other",
    empty: "No experience added yet.",
  },
  category: {
    eyebrow: "Category",
    empty: "No posts in this category yet.",
  },
  og: {
    siteAlt: "Site preview",
    postAlt: "Post preview",
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
