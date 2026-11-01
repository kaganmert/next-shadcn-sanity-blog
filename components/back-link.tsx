import Link from "next/link";
import { routes } from "@/lib/routes";
import { strings } from "@/lib/strings";

/** "← All posts": the way back to the full list from a category or a post. */
export function BackLink() {
  return (
    <Link
      href={routes.blog}
      className="group mt-16 inline-flex items-center gap-2 label-mono transition-colors duration-150 hover:text-foreground"
    >
      <span
        aria-hidden
        className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
      >
        ←
      </span>
      {strings.allPosts}
    </Link>
  );
}
