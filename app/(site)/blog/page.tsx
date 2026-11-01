import type { Metadata } from "next";
import Link from "next/link";
import { PostList } from "@/components/post-list";
import { routes } from "@/lib/routes";
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
    <WithFetchOptions>
      {(fetchOptions) => <Blog fetchOptions={fetchOptions} />}
    </WithFetchOptions>
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
    <div className="space-y-10 py-12">
      <header className="space-y-4">
        <h1 className="font-semibold text-3xl tracking-tight">
          {strings.blog.title}
        </h1>
        {usedCategories.length ? (
          <nav aria-label={strings.blog.categories}>
            <ul className="flex flex-wrap gap-2 text-sm">
              {usedCategories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={routes.category(category.slug)}
                    className="inline-flex rounded-full border px-3 py-1 text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                  >
                    {category.title}
                    <span className="ml-1.5 text-muted-foreground/70">
                      {category.postCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>
      <PostList
        posts={posts}
        emptyMessage={strings.blog.empty}
        headingLevel="h2"
      />
    </div>
  );
}
