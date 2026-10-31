import type { Metadata } from "next";
import Link from "next/link";
import { PostList } from "@/components/post-list";
import { routes } from "@/lib/routes";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import { type FetchOptions, fetchSanity } from "@/sanity/lib/live";
import { latestPostsQuery, settingsQuery } from "@/sanity/lib/queries";

const LATEST_POSTS_LIMIT = 5;

export const metadata: Metadata = { alternates: { canonical: routes.home } };

export default function HomePage() {
  return (
    <WithFetchOptions>
      {(fetchOptions) => <Home fetchOptions={fetchOptions} />}
    </WithFetchOptions>
  );
}

async function Home({ fetchOptions }: { fetchOptions: FetchOptions }) {
  const [{ data: settings }, { data: posts }] = await Promise.all([
    fetchSanity({ query: settingsQuery, ...fetchOptions }),
    fetchSanity({
      query: latestPostsQuery,
      params: { limit: LATEST_POSTS_LIMIT },
      ...fetchOptions,
    }),
  ]);

  return (
    <>
      <section className="py-12">
        <h1 className="font-semibold text-3xl tracking-tight">
          {settings?.title ?? strings.siteName}
        </h1>
        <p className="mt-3 max-w-prose text-muted-foreground leading-7">
          {settings?.intro ?? strings.home.intro}
        </p>
      </section>
      <section aria-labelledby="latest-posts" className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2
            id="latest-posts"
            className="font-semibold text-xl tracking-tight"
          >
            {strings.home.latestPosts}
          </h2>
          <Link
            href={routes.blog}
            className="text-primary text-sm hover:underline"
          >
            {strings.allPosts}
          </Link>
        </div>
        <PostList
          posts={posts}
          emptyMessage={strings.blog.empty}
          headingLevel="h3"
        />
      </section>
    </>
  );
}
