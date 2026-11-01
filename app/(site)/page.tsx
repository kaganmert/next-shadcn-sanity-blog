import type { Metadata } from "next";
import Link from "next/link";
import { ContributionGraph } from "@/components/contribution-graph";
import { PageTransition } from "@/components/page-transition";
import { PostList } from "@/components/post-list";
import { SectionHeading } from "@/components/section-heading";
import { routes } from "@/lib/routes";
import { stagger } from "@/lib/stagger";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import { type FetchOptions, fetchSanity } from "@/sanity/lib/live";
import { latestPostsQuery, settingsQuery } from "@/sanity/lib/queries";

const LATEST_POSTS_LIMIT = 5;

export const metadata: Metadata = { alternates: { canonical: routes.home } };

export default function HomePage() {
  return (
    <PageTransition>
      <WithFetchOptions>
        {(fetchOptions) => <Home fetchOptions={fetchOptions} />}
      </WithFetchOptions>
    </PageTransition>
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
      <section className="pt-16 pb-20 sm:pt-28 sm:pb-28">
        <h1 className="ink-in max-w-[18ch] text-balance font-display font-semibold text-4xl leading-[1.25] tracking-[0.01em] sm:text-5xl">
          {settings?.title ?? strings.siteName}
        </h1>
        <p
          className="ink-in mt-8 max-w-[34rem] text-pretty font-serif text-muted-foreground text-xl leading-relaxed"
          style={stagger(1)}
        >
          {settings?.intro ?? strings.home.intro}
        </p>
        <ContributionGraph
          username={settings?.githubUsername}
          className="ink-rise mt-14"
          style={stagger(2)}
        />
      </section>
      <section aria-labelledby="latest-posts" className="space-y-4">
        <SectionHeading
          id="latest-posts"
          aside={
            <Link
              href={routes.blog}
              className="label-mono shrink-0 transition-colors duration-150 hover:text-primary"
            >
              {strings.allPosts} →
            </Link>
          }
        >
          {strings.home.latestPosts}
        </SectionHeading>
        <PostList
          posts={posts}
          emptyMessage={strings.blog.empty}
          headingLevel="h3"
        />
      </section>
    </>
  );
}
