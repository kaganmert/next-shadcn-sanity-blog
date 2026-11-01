import { defineQuery } from "next-sanity";

/** Site identity and chrome from the `settings` singleton. */
export const settingsQuery =
  defineQuery(`*[_type == "settings" && _id == "settings"][0]{
  title,
  description,
  intro,
  navigation[]{ label, href },
  socialLinks[]{ label, url },
  githubUsername
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

/** A project that has its own page: a slug and at least one gallery image. */
const hasProjectPage = /* groq */ `_type == "project" && defined(slug.current) && defined(gallery[0])`;

/**
 * The work page: experiences (current role first, then newest start date),
 * projects (newest first), credentials, the resume file and the tech stack.
 */
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
  "projects": *[_type == "project"] | order(startDate desc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    status,
    startDate,
    endDate,
    isOngoing,
    url,
    repositoryUrl,
    description,
    techStack,
    icon,
    "hasPage": ${hasProjectPage}
  },
  "credentials": *[_type == "credential"] | order(defined(period) desc, period desc) {
    _id,
    kind,
    title,
    issuer,
    period,
    description,
    url
  },
  "resumeUrl": *[_type == "settings" && _id == "settings"][0].resume.asset->url,
  "techStack": coalesce(*[_type == "settings" && _id == "settings"][0].techStack[]{ name, category }, [])
}`);

/** Everything a project page renders, with its updates; null unless the project has a page. */
export const projectQuery =
  defineQuery(`*[${hasProjectPage} && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  tagline,
  status,
  startDate,
  endDate,
  isOngoing,
  url,
  repositoryUrl,
  description,
  techStack,
  icon,
  gallery,
  "updates": select(
    defined(category) => *[${isListedPost} && references(^.category._ref)] | order(publishedAt desc) {
      ${postSummaryFields}
    },
    []
  )
}`);

/** Route params for every project page. */
export const projectSlugsQuery = defineQuery(
  `*[${hasProjectPage}] { "slug": slug.current }`,
);

/** The uploaded resume's file URL, or null. */
export const resumeQuery = defineQuery(
  `*[_type == "settings" && _id == "settings"][0].resume.asset->url`,
);

/** Posts that search engines and feed readers should see (sitemap, RSS), newest first. */
export const indexablePostsQuery =
  defineQuery(`*[${isListedPost}] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "updatedAt": _updatedAt
}`);

/** Categories that search engines should see (sitemap). */
export const indexableCategoriesQuery =
  defineQuery(`*[_type == "category" && defined(slug.current)] {
  "slug": slug.current,
  "updatedAt": _updatedAt
}`);

/** Project pages that search engines should see (sitemap). */
export const indexableProjectsQuery = defineQuery(`*[${hasProjectPage}] {
  "slug": slug.current,
  "updatedAt": _updatedAt
}`);

/** A standalone page that can be linked to: it has a slug. */
const isListedPage = /* groq */ `_type == "page" && defined(slug.current)`;

/** Everything a standalone page renders; null if the slug is unknown. */
export const pageQuery =
  defineQuery(`*[${isListedPage} && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  description,
  body
}`);

/** Route params for every standalone page. */
export const pageSlugsQuery = defineQuery(
  `*[${isListedPage}] { "slug": slug.current }`,
);

/** Standalone pages that search engines should see (sitemap). */
export const indexablePagesQuery = defineQuery(`*[${isListedPage}] {
  "slug": slug.current,
  "updatedAt": _updatedAt
}`);
