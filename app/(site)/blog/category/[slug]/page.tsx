import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { PageTransition } from "@/components/page-transition";
import { PostList } from "@/components/post-list";
import { routes } from "@/lib/routes";
import { stagger } from "@/lib/stagger";
import { withPlaceholderParam } from "@/lib/static-params";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import {
  type FetchOptions,
  fetchSanity,
  publishedFetchOptions,
} from "@/sanity/lib/live";
import { categoryPageQuery, categorySlugsQuery } from "@/sanity/lib/queries";

/**
 * An unknown slug waits for the complete static result instead of streaming a
 * fallback shell, so `notFound()` still returns a real 404 status.
 */
export const ensureStatic = "navigation";

/**
 * Navigating here may wait for the page: awaiting `params` before rendering is
 * what lets an unknown slug return a 404 status (see ensureStatic above).
 */
export const instant = false;

/**
 * Prerenders every category that exists at build time. A category created
 * later is rendered on its first request and then cached, so it appears
 * without a redeploy.
 */
export async function generateStaticParams() {
  const { data } = await fetchSanity({
    query: categorySlugsQuery,
    ...publishedFetchOptions,
  });
  return withPlaceholderParam(data);
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { data: category } = await fetchSanity({
    query: categoryPageQuery,
    params: { slug },
    ...publishedFetchOptions,
  });
  if (!category) return {};
  return {
    title: category.title,
    description: category.description ?? undefined,
    alternates: { canonical: routes.category(slug) },
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/blog/category/[slug]">) {
  const { slug } = await params;
  return (
    <PageTransition>
      <WithFetchOptions>
        {(fetchOptions) => <Category slug={slug} fetchOptions={fetchOptions} />}
      </WithFetchOptions>
    </PageTransition>
  );
}

async function Category({
  slug,
  fetchOptions,
}: {
  slug: string;
  fetchOptions: FetchOptions;
}) {
  const { data: category } = await fetchSanity({
    query: categoryPageQuery,
    params: { slug },
    ...fetchOptions,
  });
  if (!category) notFound();

  return (
    <div className="pt-16 sm:pt-24">
      <header className="space-y-5 pb-12">
        <p className="ink-in label-mono">{strings.category.eyebrow}</p>
        <h1
          className="ink-in font-display font-semibold text-4xl tracking-[0.01em] sm:text-5xl"
          style={stagger(1)}
        >
          {category.title}
        </h1>
        {category.description ? (
          <p
            className="ink-in max-w-[34rem] font-serif text-muted-foreground text-xl leading-relaxed"
            style={stagger(2)}
          >
            {category.description}
          </p>
        ) : null}
      </header>
      <div className="border-t">
        <PostList
          posts={category.posts}
          emptyMessage={strings.category.empty}
          headingLevel="h2"
        />
      </div>
      <BackLink />
    </div>
  );
}
