import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format-date";
import { renderOgImage } from "@/lib/og-image";
import { getSiteIdentity } from "@/lib/site-identity";
import { withPlaceholderParam } from "@/lib/static-params";
import { strings } from "@/lib/strings";
import { fetchSanity, publishedFetchOptions } from "@/sanity/lib/live";
import { postQuery, postSlugsQuery } from "@/sanity/lib/queries";

export { ogImageSize as size } from "@/lib/og-image";
export const contentType = "image/png";
export const alt = strings.og.postAlt;

export async function generateStaticParams() {
  const { data } = await fetchSanity({
    query: postSlugsQuery,
    ...publishedFetchOptions,
  });
  return withPlaceholderParam(data);
}

/** One OG image per post: site name, post title and publish date. */
export default async function PostOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [site, { data: post }] = await Promise.all([
    getSiteIdentity(),
    fetchSanity({
      query: postQuery,
      params: { slug },
      ...publishedFetchOptions,
    }),
  ]);
  if (!post) notFound();
  return renderOgImage({
    eyebrow: site.title,
    title: post.title,
    footer: formatDate(post.publishedAt),
  });
}
