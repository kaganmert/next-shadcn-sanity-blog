import { describe, expect, it } from "vitest";
import { parseContributionCalendar } from "./github-contributions";

/** A trimmed GitHub GraphQL response: one partial week, then one full week. */
function response() {
  return {
    data: {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: 12,
            weeks: [
              {
                contributionDays: [
                  {
                    date: "2026-10-23",
                    weekday: 5,
                    contributionCount: 0,
                    contributionLevel: "NONE",
                  },
                  {
                    date: "2026-10-24",
                    weekday: 6,
                    contributionCount: 2,
                    contributionLevel: "FIRST_QUARTILE",
                  },
                ],
              },
              {
                contributionDays: [
                  {
                    date: "2026-10-25",
                    weekday: 0,
                    contributionCount: 10,
                    contributionLevel: "FOURTH_QUARTILE",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  };
}

describe("parseContributionCalendar", () => {
  it("turns the GraphQL response into weeks of days with numeric levels", () => {
    expect(parseContributionCalendar(response())).toEqual({
      total: 12,
      weeks: [
        [
          { date: "2026-10-23", weekday: 5, count: 0, level: 0 },
          { date: "2026-10-24", weekday: 6, count: 2, level: 1 },
        ],
        [{ date: "2026-10-25", weekday: 0, count: 10, level: 4 }],
      ],
    });
  });

  it("maps every GitHub quartile to a level from 0 to 4", () => {
    const payload = response();
    const days =
      payload.data.user.contributionsCollection.contributionCalendar.weeks[0]
        .contributionDays;
    days[0].contributionLevel = "SECOND_QUARTILE";
    days[1].contributionLevel = "THIRD_QUARTILE";
    const [week] = parseContributionCalendar(payload).weeks;
    expect(week.map((day) => day.level)).toEqual([2, 3]);
  });

  it("throws when GitHub reports an error, such as an unknown user", () => {
    expect(() =>
      parseContributionCalendar({
        data: { user: null },
        errors: [{ message: "Could not resolve to a User" }],
      }),
    ).toThrow("Could not resolve to a User");
  });

  it("throws on a response without a calendar", () => {
    expect(() => parseContributionCalendar({ data: {} })).toThrow();
    expect(() => parseContributionCalendar("not json")).toThrow();
  });

  it("throws on a day with an unknown level or an invalid date", () => {
    const badLevel = response();
    badLevel.data.user.contributionsCollection.contributionCalendar.weeks[0].contributionDays[0].contributionLevel =
      "FIFTH_QUARTILE";
    expect(() => parseContributionCalendar(badLevel)).toThrow();

    const badDate = response();
    badDate.data.user.contributionsCollection.contributionCalendar.weeks[0].contributionDays[0].date =
      "yesterday";
    expect(() => parseContributionCalendar(badDate)).toThrow();
  });
});
