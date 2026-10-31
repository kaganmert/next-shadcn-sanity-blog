import { strings } from "@/lib/strings";

// Dates are formatted in UTC so the day or month shown never depends on the
// time zone of the server or build machine.
const dayFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});
const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "Oct 20, 2026". */
export function formatDate(isoDate: string): string {
  return dayFormat.format(new Date(isoDate));
}

type DateRange = {
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean | null;
};

/** "Jun 2021 – Feb 2024", or "Mar 2024 – Present" for the current role. */
export function formatDateRange({
  startDate,
  endDate,
  isCurrent,
}: DateRange): string {
  const start = monthFormat.format(new Date(startDate));
  if (isCurrent) return `${start} – ${strings.work.present}`;
  if (!endDate) return start;
  return `${start} – ${monthFormat.format(new Date(endDate))}`;
}
