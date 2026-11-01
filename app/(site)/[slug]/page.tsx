import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageTransition } from "@/components/page-transition";
import { PostBody } from "@/components/post-body";
import { routes } from "@/lib/routes";
import { getSiteIdentity } from "@/lib/site-identity";
import { stagger } from "@/lib/stagger";
import { withPlaceholderParam } from "@/lib/static-params";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import {
  type FetchOptions,
  fetchSanity,
  publishedFetchOptions,
} from "@/sanity/lib/live";
import { pageQuery, pageSlugsQuery } from "@/sanity/lib/queries";

/** Unknown slugs wait for the full render so `notFound()` returns a real 404. */
export const ensureStatic = "navigation";

/** Navigating here may wait for the page (see ensureStatic). */
export const instant = false;

/** Prerenders every standalone page at build time. */
export async function generateStaticParams() {
  const { data } = await fetchSanity({
    query: pageSlugsQuery,
    ...publishedFetchOptions,
  });
  return withPlaceholderParam(data);
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [site, { data: page }] = await Promise.all([
    getSiteIdentity(),
    fetchSanity({
      query: pageQuery,
      params: { slug },
      ...publishedFetchOptions,
    }),
  ]);
  if (!page) return {};
  const description = page.description ?? undefined;
  return {
    title: page.title,
    description,
    alternates: { canonical: routes.page(slug) },
    // Next replaces (not merges) the layout's openGraph, so repeat the site-wide fields.
    openGraph: {
      type: "website",
      url: routes.page(slug),
      siteName: site.title,
      locale: strings.locale.openGraph,
      title: page.title,
      description,
    },
  };
}

export default async function StandalonePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  return (
    <PageTransition>
      <WithFetchOptions>
        {(fetchOptions) => <Page slug={slug} fetchOptions={fetchOptions} />}
      </WithFetchOptions>
    </PageTransition>
  );
}

async function Page({
  slug,
  fetchOptions,
}: {
  slug: string;
  fetchOptions: FetchOptions;
}) {
  const { data: page } = await fetchSanity({
    query: pageQuery,
    params: { slug },
    ...fetchOptions,
  });
  if (!page) notFound();

  return (
    <article className="pt-16 sm:pt-24">
      <header>
        <h1 className="ink-in text-balance font-display font-semibold text-4xl leading-[1.2] tracking-[0.01em] sm:text-5xl">
          {page.title}
        </h1>
        {page.description ? (
          <p
            className="ink-in mt-6 text-pretty font-serif text-muted-foreground text-xl leading-relaxed"
            style={stagger(1)}
          >
            {page.description}
          </p>
        ) : null}
      </header>
      {page.body?.length ? (
        <div
          className="ink-rise prose dark:prose-invert mt-10 max-w-none border-t pt-10 prose-code:before:content-none prose-code:after:content-none"
          style={stagger(2)}
        >
          <PostBody value={page.body} />
        </div>
      ) : null}
    </article>
  );
}
