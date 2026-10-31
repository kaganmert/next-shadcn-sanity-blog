import { strings } from "@/lib/strings";

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

type DateRange = {
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean | null;
};

/** "Jun 2021 – Feb 2024", or "Mar 2024 – Present" for the current role. Months are read in UTC. */
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
