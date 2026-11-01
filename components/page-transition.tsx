import { type ReactNode, ViewTransition } from "react";

/**
 * Wraps a page's content so route changes crossfade (styled by the `.page`
 * view-transition class in globals.css). It belongs in each page, not the
 * layout: layouts persist across navigations, so enter and exit never fire there.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      {children}
    </ViewTransition>
  );
}

/**
 * A post title that morphs between the post lists and the article heading.
 * Both ends must render it with the same slug.
 */
export function PostTitleTransition({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name={`post-title-${slug}`}
      share="title-morph"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

/** A project name that morphs between the work page and the project page. */
export function ProjectTitleTransition({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name={`project-title-${slug}`}
      share="title-morph"
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
