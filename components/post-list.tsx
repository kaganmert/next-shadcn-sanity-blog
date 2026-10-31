import Link from "next/link";
import { formatDate } from "@/lib/format-date";
import { routes } from "@/lib/routes";
import type { PostsQueryResult } from "@/sanity.types";

export type PostSummary = PostsQueryResult[number];

export function PostList({
  posts,
  emptyMessage,
}: {
  posts: PostSummary[];
  emptyMessage: string;
}) {
  if (posts.length === 0) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y">
      {posts.map((post) => (
        <li key={post._id} className="py-6 first:pt-0">
          <PostSummaryItem post={post} />
        </li>
      ))}
    </ul>
  );
}

function PostSummaryItem({ post }: { post: PostSummary }) {
  return (
    <article className="space-y-2">
      <time
        dateTime={post.publishedAt}
        className="text-muted-foreground text-sm"
      >
        {formatDate(post.publishedAt)}
      </time>
      <h3 className="font-semibold text-lg tracking-tight">
        <Link href={routes.post(post.slug)} className="hover:text-primary">
          {post.title}
        </Link>
      </h3>
      <p className="text-muted-foreground leading-7">{post.excerpt}</p>
      {post.categories?.length ? (
        <ul className="flex flex-wrap gap-2 text-sm">
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
    </article>
  );
}
