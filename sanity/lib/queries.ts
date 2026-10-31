import { defineQuery } from "next-sanity";

/** Site identity and chrome from the `settings` singleton. */
export const settingsQuery = defineQuery(`*[_id == "settings"][0]{
  title,
  description,
  intro,
  navigation[]{ label, href },
  socialLinks[]{ label, url }
}`);

/** A post that can be linked to: it has a slug. */
const isListedPost = /* groq */ `_type == "post" && defined(slug.current)`;

/** Fields a post summary in a list needs: link, title, excerpt, date and categories. */
const postSummaryFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "categories": categories[]->{ title, "slug": slug.current }
`;

/** Every post with a slug, newest first. */
export const postsQuery =
  defineQuery(`*[${isListedPost}] | order(publishedAt desc) {
  ${postSummaryFields}
}`);

/** The newest `$limit` posts with a slug. */
export const latestPostsQuery =
  defineQuery(`*[${isListedPost}] | order(publishedAt desc) [0...$limit] {
  ${postSummaryFields}
}`);

/** Every category, A to Z, with the number of posts filed under it. */
export const categoriesQuery =
  defineQuery(`*[_type == "category" && defined(slug.current)] | order(title asc) {
  title,
  "slug": slug.current,
  "postCount": count(*[${isListedPost} && references(^._id)])
}`);

/** One category and the posts filed under it, newest first; null if the slug is unknown. */
export const categoryPageQuery =
  defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  description,
  "posts": *[${isListedPost} && references(^._id)] | order(publishedAt desc) {
    ${postSummaryFields}
  }
}`);

/** Route params for every category page. */
export const categorySlugsQuery = defineQuery(
  `*[_type == "category" && defined(slug.current)] { "slug": slug.current }`,
);
