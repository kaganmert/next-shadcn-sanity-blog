import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/post-body";
import { ARTICLE_IMAGE_SIZES, SanityImage } from "@/components/sanity-image";
import { formatDate } from "@/lib/format-date";
import { routes } from "@/lib/routes";
import { getSiteIdentity } from "@/lib/site-identity";
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
    <WithFetchOptions>
      {(fetchOptions) => <Post slug={slug} fetchOptions={fetchOptions} />}
    </WithFetchOptions>
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
    <article className="py-12">
      <header className="space-y-4">
        <time
          dateTime={post.publishedAt}
          className="text-muted-foreground text-sm"
        >
          {formatDate(post.publishedAt)}
        </time>
        <h1 className="font-semibold text-3xl tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="text-lg text-muted-foreground leading-8">
          {post.excerpt}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {post.author ? (
            <div className="flex items-center gap-2">
              {post.author.image?.asset ? (
                <SanityImage
                  image={post.author.image}
                  sizes="32px"
                  className="size-8 rounded-full object-cover"
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
              className="flex flex-wrap gap-2"
            >
              {post.categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={routes.category(category.slug)}
                    className="text-primary hover:underline"
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
          className="mt-8 w-full rounded-lg"
        />
      ) : null}

      {post.body?.length ? (
        <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none prose-a:text-primary prose-headings:tracking-tight prose-code:before:content-none prose-code:after:content-none">
          <PostBody value={post.body} />
        </div>
      ) : null}

      <Link
        href={routes.blog}
        className="mt-12 inline-block text-primary text-sm hover:underline"
      >
        ← {strings.allPosts}
      </Link>
    </article>
  );
}
