import { cacheLife, cacheTag } from "next/cache";
import {
  type ContributionCalendar,
  contributionCalendarQuery,
  parseContributionCalendar,
} from "@/lib/github-contributions";

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

/**
 * Fetches the calendar at most once an hour. A failure throws, so it is never
 * cached: the next request tries again.
 */
async function fetchContributionCalendar(
  login: string,
): Promise<ContributionCalendar> {
  "use cache";
  cacheLife("hours");
  cacheTag("github-contributions");

  // Read here rather than passed in, so the token never becomes part of a cache key.
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set.");

  const response = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "next-shadcn-sanity-blog",
    },
    body: JSON.stringify({
      query: contributionCalendarQuery,
      variables: { login },
    }),
  });
  if (!response.ok) {
    throw new Error(`GitHub responded with ${response.status}.`);
  }
  return parseContributionCalendar(await response.json());
}

/**
 * The contribution calendar for `login`, or null when there is no token or
 * GitHub fails. A failure is logged and hides the graph; it never breaks the page.
 */
export async function loadContributionCalendar(
  login: string,
): Promise<ContributionCalendar | null> {
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    return await fetchContributionCalendar(login);
  } catch (error) {
    console.error("GitHub contributions could not be loaded.", error);
    return null;
  }
}
