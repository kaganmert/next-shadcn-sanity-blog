import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import {
  PageTransition,
  PostTitleTransition,
} from "@/components/page-transition";
import { PostBody } from "@/components/post-body";
import { ARTICLE_IMAGE_SIZES, SanityImage } from "@/components/sanity-image";
import { formatDate } from "@/lib/format-date";
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
import { postQuery, postSlugsQuery } from "@/sanity/lib/queries";

/** Unknown slugs wait for the full render so `notFound()` returns a real 404. */
export const ensureStatic = "navigation";

/** Navigating here may wait for the page (see ensureStatic). */
export const instant = false;

/** Prerenders every post at build time; newer posts render on first request and are then cached. */
export async function generateStaticParams() {
  const { data } = await fetchSanity({
    query: postSlugsQuery,
    ...publishedFetchOptions,
  });
  return withPlaceholderParam(data);
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [site, { data: post }] = await Promise.all([
    getSiteIdentity(),
    fetchSanity({
      query: postQuery,
      params: { slug },
      ...publishedFetchOptions,
    }),
  ]);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: routes.post(slug) },
    // Next replaces (not merges) the layout's openGraph, so repeat the site-wide fields.
    openGraph: {
      type: "article",
      url: routes.post(slug),
      siteName: site.title,
      locale: strings.locale.openGraph,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  return (
    <PageTransition>
      <WithFetchOptions>
        {(fetchOptions) => <Post slug={slug} fetchOptions={fetchOptions} />}
      </WithFetchOptions>
    </PageTransition>
  );
}

async function Post({
  slug,
  fetchOptions,
}: {
  slug: string;
  fetchOptions: FetchOptions;
}) {
  const { data: post } = await fetchSanity({
    query: postQuery,
    params: { slug },
    ...fetchOptions,
  });
  if (!post) notFound();

  return (
    <article className="pt-16 sm:pt-24">
      <header>
        <time dateTime={post.publishedAt} className="ink-in block label-mono">
          {formatDate(post.publishedAt)}
        </time>
        <PostTitleTransition slug={post.slug}>
          <h1 className="mt-6 text-balance font-display font-semibold text-4xl leading-[1.3] tracking-[0.01em] sm:text-[2.75rem]">
            {post.title}
          </h1>
        </PostTitleTransition>
        <p
          className="ink-in mt-6 text-pretty font-serif text-muted-foreground text-xl leading-relaxed"
          style={stagger(1)}
        >
          {post.excerpt}
        </p>
        <div
          className="ink-in mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-6"
          style={stagger(2)}
        >
          {post.author ? (
            <div className="flex items-center gap-3 text-sm">
              {post.author.image?.asset ? (
                <SanityImage
                  image={post.author.image}
                  sizes="32px"
                  className="size-8 rounded-full object-cover grayscale"
                />
              ) : null}
              <span>
                <span className="text-muted-foreground">
                  {strings.post.by}{" "}
                </span>
                {post.author.name}
              </span>
            </div>
          ) : null}
          {post.categories?.length ? (
            <ul
              aria-label={strings.blog.categories}
              className="flex flex-wrap gap-x-4 gap-y-1"
            >
              {post.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={routes.category(category.slug)}
                    className="label-mono transition-colors duration-150 hover:text-primary"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </header>

      {post.coverImage?.asset ? (
        <SanityImage
          image={post.coverImage}
          priority
          sizes={ARTICLE_IMAGE_SIZES}
          className="ink-rise mt-12 w-full rounded-sm"
          style={stagger(3)}
        />
      ) : null}

      {post.body?.length ? (
        <div
          className="ink-rise prose dark:prose-invert mt-14 max-w-none prose-code:before:content-none prose-code:after:content-none"
          style={stagger(3)}
        >
          <PostBody value={post.body} />
        </div>
      ) : null}

      <BackLink />
    </article>
  );
}
