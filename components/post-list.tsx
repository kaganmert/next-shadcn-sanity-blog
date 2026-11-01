import Link from "next/link";
import { PostTitleTransition } from "@/components/page-transition";
import { formatDate } from "@/lib/format-date";
import { routes } from "@/lib/routes";
import { stagger } from "@/lib/stagger";
import type { PostsQueryResult } from "@/sanity.types";

export type PostSummary = PostsQueryResult[number];

type HeadingLevel = "h2" | "h3";

/**
 * A list of post summaries. `headingLevel` keeps the document outline
 * correct: h2 when the list sits under the page's h1, h3 under a section h2.
 */
export function PostList({
  posts,
  emptyMessage,
  headingLevel,
}: {
  posts: PostSummary[];
  emptyMessage: string;
  headingLevel: HeadingLevel;
}) {
  if (posts.length === 0) {
    return <p className="font-serif text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul>
      {posts.map((post, index) => (
        <li
          key={post._id}
          className="ink-in border-t first:border-t-0"
          style={stagger(index + 1)}
        >
          <PostSummaryItem post={post} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}

/**
 * The whole row is one link target (the title link's ::after covers it), so
 * category links sit above it with `relative`.
 */
function PostSummaryItem({
  post,
  headingLevel: Heading,
}: {
  post: PostSummary;
  headingLevel: HeadingLevel;
}) {
  return (
    <article className="group relative grid gap-x-8 gap-y-2 py-7 sm:grid-cols-[7.5rem_1fr]">
      <time dateTime={post.publishedAt} className="label-mono pt-1.5">
        {formatDate(post.publishedAt)}
      </time>
      <div className="min-w-0 space-y-2">
        <PostTitleTransition slug={post.slug}>
          <Heading className="font-display font-semibold text-[1.2rem] leading-snug tracking-[0.01em]">
            <Link
              href={routes.post(post.slug)}
              className="transition-colors duration-150 after:absolute after:inset-0 group-hover:text-primary"
            >
              {post.title}
            </Link>
          </Heading>
        </PostTitleTransition>
        <p className="font-serif text-[1.05rem] text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
        {post.categories?.length ? (
          <ul className="relative flex flex-wrap gap-x-4 gap-y-1 pt-1">
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
    </article>
  );
}
