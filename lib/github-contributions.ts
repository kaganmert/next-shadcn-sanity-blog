/** GitHub's contribution calendar, parsed from its GraphQL API. Pure: no I/O. */

export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export type ContributionDay = {
  /** ISO calendar date, e.g. "2026-10-25". */
  date: string;
  /** 0 = Sunday … 6 = Saturday. */
  weekday: number;
  count: number;
  level: ContributionLevel;
};

export type ContributionCalendar = {
  total: number;
  /** Oldest week first. The first and last weeks may be partial. */
  weeks: ContributionDay[][];
};

/** The GraphQL query; `$login` is the GitHub username. */
export const contributionCalendarQuery = /* GraphQL */ `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              weekday
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const levels: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

function parseDay(value: unknown): ContributionDay {
  if (!isRecord(value)) throw new Error("Invalid contribution day.");
  const { date, weekday, contributionCount, contributionLevel } = value;
  const level =
    typeof contributionLevel === "string"
      ? levels[contributionLevel]
      : undefined;
  if (
    typeof date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    typeof weekday !== "number" ||
    weekday < 0 ||
    weekday > 6 ||
    typeof contributionCount !== "number" ||
    level === undefined
  ) {
    throw new Error(`Invalid contribution day: ${JSON.stringify(value)}`);
  }
  return { date, weekday, count: contributionCount, level };
}

/** Throws if GitHub returned an error or the payload doesn't have the expected shape. */
export function parseContributionCalendar(
  payload: unknown,
): ContributionCalendar {
  if (!isRecord(payload)) throw new Error("Invalid GitHub response.");
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const [first] = payload.errors;
    throw new Error(
      isRecord(first) && typeof first.message === "string"
        ? first.message
        : "GitHub returned an error.",
    );
  }

  const user = isRecord(payload.data) ? payload.data.user : undefined;
  const collection = isRecord(user) ? user.contributionsCollection : undefined;
  const contributionCalendar = isRecord(collection)
    ? collection.contributionCalendar
    : undefined;
  if (
    !isRecord(contributionCalendar) ||
    typeof contributionCalendar.totalContributions !== "number" ||
    !Array.isArray(contributionCalendar.weeks)
  ) {
    throw new Error("GitHub response has no contribution calendar.");
  }

  return {
    total: contributionCalendar.totalContributions,
    weeks: contributionCalendar.weeks.map((week) => {
      if (!isRecord(week) || !Array.isArray(week.contributionDays))
        throw new Error("Invalid contribution week.");
      return week.contributionDays.map(parseDay);
    }),
  };
}
