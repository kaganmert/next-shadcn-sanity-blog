import { defineQuery } from "next-sanity";

/** Site identity and chrome from the `settings` singleton. */
export const settingsQuery =
  defineQuery(`*[_type == "settings" && _id == "settings"][0]{
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

/** Everything the post page renders; null if the slug is unknown. */
export const postQuery =
  defineQuery(`*[${isListedPost} && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  "author": author->{ name, image },
  "categories": categories[]->{ title, "slug": slug.current },
  body
}`);

/** Route params for every post page. */
export const postSlugsQuery = defineQuery(
  `*[${isListedPost}] { "slug": slug.current }`,
);

/** The work page: experiences (current role first, then newest start date) and the tech stack. */
export const workPageQuery = defineQuery(`{
  "experiences": *[_type == "experience"] | order(coalesce(isCurrent, false) desc, startDate desc) {
    _id,
    role,
    company,
    url,
    image,
    description,
    startDate,
    endDate,
    isCurrent
  },
  "techStack": coalesce(*[_type == "settings" && _id == "settings"][0].techStack[]{ name, category }, [])
}`);

/** Posts for the RSS feed and sitemap, newest first. */
export const seoPostsQuery =
  defineQuery(`*[${isListedPost}] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "updatedAt": _updatedAt
}`);

/** Categories for the sitemap. */
export const seoCategoriesQuery =
  defineQuery(`*[_type == "category" && defined(slug.current)] {
  "slug": slug.current,
  "updatedAt": _updatedAt
}`);
