import { formatMonthDayOrdinal } from "@/lib/format-date";
import type {
  ContributionCalendar,
  ContributionDay,
} from "@/lib/github-contributions";
import { strings } from "@/lib/strings";

export type ContributionCell = ContributionDay & {
  /** Week index, oldest first. */
  column: number;
  /** Weekday, Sunday first. */
  row: number;
  isToday: boolean;
  /** "1 contribution on February 12th." */
  label: string;
};

export type ContributionGrid = {
  total: number;
  columns: number;
  cells: ContributionCell[];
};

/**
 * Lays the calendar out as columns of weeks and rows of weekdays. "Today" is
 * the calendar's last day: GitHub ends the calendar on the current day, and
 * reading it from the data keeps the result deterministic inside a cache.
 */
export function buildContributionGrid(
  calendar: ContributionCalendar,
): ContributionGrid {
  const lastDate = calendar.weeks.at(-1)?.at(-1)?.date;
  return {
    total: calendar.total,
    columns: calendar.weeks.length,
    cells: calendar.weeks.flatMap((week, column) =>
      week.map((day) => ({
        ...day,
        column,
        row: day.weekday,
        isToday: day.date === lastDate,
        label: strings.github.day(day.count, formatMonthDayOrdinal(day.date)),
      })),
    ),
  };
}
