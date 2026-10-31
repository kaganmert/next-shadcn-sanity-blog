import { defineQuery } from "next-sanity";

/** Site identity and chrome from the `settings` singleton. */
export const settingsQuery = defineQuery(`*[_id == "settings"][0]{
  title,
  description,
  intro,
  navigation[]{ label, href },
  socialLinks[]{ label, url }
}`);

/** Fields a post card needs: link, title, excerpt, date, cover and categories. */
const postCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  "categories": categories[]->{ title, "slug": slug.current }
`;

/** Every post with a slug, newest first. */
export const postsQuery =
  defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  ${postCardFields}
}`);

/** The newest `$limit` posts with a slug. */
export const latestPostsQuery =
  defineQuery(`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...$limit] {
  ${postCardFields}
}`);

/** Every category, A to Z, with the number of posts filed under it. */
export const categoriesQuery =
  defineQuery(`*[_type == "category" && defined(slug.current)] | order(title asc) {
  title,
  "slug": slug.current,
  "postCount": count(*[_type == "post" && defined(slug.current) && references(^._id)])
}`);

/** One category and the posts filed under it, newest first; null if the slug is unknown. */
export const categoryPageQuery =
  defineQuery(`*[_type == "category" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  description,
  "posts": *[_type == "post" && defined(slug.current) && references(^._id)] | order(publishedAt desc) {
    ${postCardFields}
  }
}`);

/** Route params for every category page. */
export const categorySlugsQuery = defineQuery(
  `*[_type == "category" && defined(slug.current)] { "slug": slug.current }`,
);
