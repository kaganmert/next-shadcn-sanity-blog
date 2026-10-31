import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostList } from "@/components/post-list";
import { routes } from "@/lib/routes";
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
    <WithFetchOptions>
      {(fetchOptions) => <Category slug={slug} fetchOptions={fetchOptions} />}
    </WithFetchOptions>
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
    <div className="space-y-10 py-12">
      <header className="space-y-2">
        <p className="text-muted-foreground text-sm">
          {strings.category.eyebrow}
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          {category.title}
        </h1>
        {category.description ? (
          <p className="max-w-prose text-muted-foreground leading-7">
            {category.description}
          </p>
        ) : null}
      </header>
      <PostList
        posts={category.posts}
        emptyMessage={strings.category.empty}
        headingLevel="h2"
      />
      <Link
        href={routes.blog}
        className="inline-block text-primary text-sm hover:underline"
      >
        ← {strings.allPosts}
      </Link>
    </div>
  );
}
