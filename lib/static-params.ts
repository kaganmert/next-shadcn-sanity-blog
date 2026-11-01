/**
 * Slug used when a dynamic route has nothing to prerender yet. No document
 * can have it, so the placeholder page renders the route's 404.
 */
export const PLACEHOLDER_SLUG = "__placeholder__";

/**
 * With Cache Components, `generateStaticParams` must return at least one
 * param or the build fails. A fresh dataset can have no posts or categories
 * yet, so fall back to a placeholder that resolves to a 404.
 */
export function withPlaceholderParam(
  params: Array<{ slug: string | null }>,
): Array<{ slug: string }> {
  const withSlug = params.filter((param): param is { slug: string } =>
    Boolean(param.slug),
  );
  return withSlug.length > 0 ? withSlug : [{ slug: PLACEHOLDER_SLUG }];
}
