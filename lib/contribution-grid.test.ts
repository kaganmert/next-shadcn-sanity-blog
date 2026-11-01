import { describe, expect, it } from "vitest";
import { buildContributionGrid } from "./contribution-grid";
import type { ContributionCalendar } from "./github-contributions";

const calendar: ContributionCalendar = {
  total: 12,
  weeks: [
    // The first week starts mid-week: only Friday and Saturday.
    [
      { date: "2026-10-23", weekday: 5, count: 0, level: 0 },
      { date: "2026-10-24", weekday: 6, count: 2, level: 1 },
    ],
    [
      { date: "2026-10-25", weekday: 0, count: 10, level: 4 },
      { date: "2026-10-26", weekday: 1, count: 0, level: 0 },
    ],
  ],
};

describe("buildContributionGrid", () => {
  it("places each day by week (column) and weekday (row)", () => {
    const grid = buildContributionGrid(calendar);
    expect(
      grid.cells.map(({ date, column, row }) => ({ date, column, row })),
    ).toEqual([
      { date: "2026-10-23", column: 0, row: 5 },
      { date: "2026-10-24", column: 0, row: 6 },
      { date: "2026-10-25", column: 1, row: 0 },
      { date: "2026-10-26", column: 1, row: 1 },
    ]);
  });

  it("counts columns from the weeks, partial ones included", () => {
    expect(buildContributionGrid(calendar).columns).toBe(2);
  });

  it("marks the last day in the calendar as today, and only that day", () => {
    const grid = buildContributionGrid(calendar);
    expect(
      grid.cells.filter((cell) => cell.isToday).map((cell) => cell.date),
    ).toEqual(["2026-10-26"]);
  });

  it("keeps the total, levels and counts", () => {
    const grid = buildContributionGrid(calendar);
    expect(grid.total).toBe(12);
    expect(grid.cells[2]).toMatchObject({ count: 10, level: 4 });
  });

  it("handles an empty calendar", () => {
    expect(buildContributionGrid({ total: 0, weeks: [] })).toEqual({
      total: 0,
      columns: 0,
      cells: [],
    });
  });

  it("labels each day like GitHub's calendar tooltip", () => {
    const grid = buildContributionGrid(calendar);
    expect(grid.cells.map((cell) => cell.label)).toEqual([
      "No contributions on October 23rd.",
      "2 contributions on October 24th.",
      "10 contributions on October 25th.",
      "No contributions on October 26th.",
    ]);
    expect(
      buildContributionGrid({
        total: 1,
        weeks: [[{ date: "2026-02-12", weekday: 4, count: 1, level: 1 }]],
      }).cells[0].label,
    ).toBe("1 contribution on February 12th.");
  });
});
