import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/page-transition";
import { PostList } from "@/components/post-list";
import { routes } from "@/lib/routes";
import { stagger } from "@/lib/stagger";
import { strings } from "@/lib/strings";
import { WithFetchOptions } from "@/sanity/lib/fetch-options";
import { type FetchOptions, fetchSanity } from "@/sanity/lib/live";
import { categoriesQuery, postsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: strings.blog.title,
  alternates: { canonical: routes.blog },
};

export default function BlogPage() {
  return (
    <PageTransition>
      <WithFetchOptions>
        {(fetchOptions) => <Blog fetchOptions={fetchOptions} />}
      </WithFetchOptions>
    </PageTransition>
  );
}

async function Blog({ fetchOptions }: { fetchOptions: FetchOptions }) {
  const [{ data: posts }, { data: categories }] = await Promise.all([
    fetchSanity({ query: postsQuery, ...fetchOptions }),
    fetchSanity({ query: categoriesQuery, ...fetchOptions }),
  ]);
  const usedCategories = categories.filter(
    (category) => category.postCount > 0,
  );

  return (
    <div className="pt-16 sm:pt-24">
      <header className="space-y-8 pb-12">
        <h1 className="ink-in font-display font-semibold text-4xl tracking-[0.01em] sm:text-5xl">
          {strings.blog.title}
        </h1>
        {usedCategories.length ? (
          <nav
            aria-label={strings.blog.categories}
            className="ink-in"
            style={stagger(1)}
          >
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {usedCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={routes.category(category.slug)}
                    className="font-serif text-lg text-muted-foreground transition-colors duration-150 hover:text-foreground"
                  >
                    {category.title}
                    <sup className="ml-1 font-mono text-[0.65rem] text-primary">
                      {category.postCount}
                    </sup>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      <div className="border-t">
        <PostList
          posts={posts}
          emptyMessage={strings.blog.empty}
          headingLevel="h2"
        />
      </div>
    </div>
  );
}
