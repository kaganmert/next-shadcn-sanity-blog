import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DraftModeBanner } from "@/components/draft-mode-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import { SanityLive } from "@/sanity/lib/live";

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
