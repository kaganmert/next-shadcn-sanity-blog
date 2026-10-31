import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DraftModeBanner } from "@/components/draft-mode-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routes } from "@/lib/routes";
import { getSiteSettings } from "@/lib/site-settings";
import { getSiteUrl } from "@/lib/site-url";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import { SanityLive } from "@/sanity/lib/live";

/** Defaults for every page; pages set their own title, description and canonical URL. */
export async function generateMetadata(): Promise<Metadata> {
  return siteMetadata();
}

/**
 * Cached and argument-free, so it never touches request data such as the
 * Studio's runtime params (the Studio route sits outside this layout). Cached values must be serializable, so
 * metadataBase is a string rather than a URL.
 */
async function siteMetadata(): Promise<Metadata> {
  "use cache";
  // Sanity Live revalidates the settings it reads, like the page content.
  cacheLife("max");
  const site = await getSiteSettings();
  return {
    metadataBase: getSiteUrl(),
    title: { default: site.title, template: `%s · ${site.title}` },
    description: site.description,
    openGraph: { type: "website", siteName: site.title, locale: "en_US" },
    twitter: { card: "summary_large_image" },
    alternates: {
      types: {
        "application/rss+xml": [{ url: routes.rss, title: site.title }],
      },
    },
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2"
      >
        {strings.skipToContent}
      </a>
      <WithFetchOptions>
        {(fetchOptions) => <SiteHeader fetchOptions={fetchOptions} />}
      </WithFetchOptions>
      <main id="content" className="page-column flex-1 pb-16">
        {children}
      </main>
      <WithFetchOptions>
        {(fetchOptions) => <SiteFooter fetchOptions={fetchOptions} />}
      </WithFetchOptions>
      {/*
        With browserToken: false (see sanity/lib/live.ts) published content
        streams live everywhere; draft changes refresh live inside the
        Presentation tool only. Outside it, a draft preview needs a reload.
      */}
      <SanityLive includeDrafts={isDraftMode} />
      {isDraftMode ? (
        <>
          <VisualEditing />
          <DraftModeBanner />
        </>
      ) : null}
    </>
  );
}
