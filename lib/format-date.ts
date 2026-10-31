const dateFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

/**
 * "Oct 20, 2026". Dates are formatted in UTC so the day shown never depends on
 * the time zone of the server or build machine.
 */
export function formatDate(isoDate: string): string {
  return dateFormat.format(new Date(isoDate));
}
