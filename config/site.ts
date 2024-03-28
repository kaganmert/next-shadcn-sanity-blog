export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
  };
};
export const siteConfig: SiteConfig = {
  name: "next-shadcn-sanity-blog",
  description:
    "Introducing a Next.js 14 blogging platform, elegantly designed with ShadcnUI for a seamless and modern user interface, and powered by Sanity.io as its robust headless CMS.",
  url: "",
  ogImage: "/og.jpg",
  links: {
    github: "https://github.com/kaganmert/next-shadcn-sanity-blog",
  },
};
