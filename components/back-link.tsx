import Link from "next/link";
import { routes } from "@/lib/routes";
import { strings } from "@/lib/strings";

/**
 * "← All posts": the way back to a list. Defaults to the blog; project pages
 * point it at the work page.
 */
export function BackLink({
  href = routes.blog,
  label = strings.allPosts,
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="group mt-16 inline-flex items-center gap-2 label-mono transition-colors duration-150 hover:text-foreground"
    >
      <span
        aria-hidden
        className="transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
      >
        ←
      </span>
      {label}
    </Link>
  );
}
