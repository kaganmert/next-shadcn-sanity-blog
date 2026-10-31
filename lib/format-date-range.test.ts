import { describe, expect, it } from "vitest";
import { formatDateRange } from "./format-date-range";

describe("formatDateRange", () => {
  it("shows the start and end month of a past role", () => {
    expect(
      formatDateRange({
        startDate: "2021-06-01",
        endDate: "2024-02-29",
        isCurrent: false,
      }),
    ).toBe("Jun 2021 – Feb 2024");
  });

  it("ends a current role with Present, even if an old end date is still set", () => {
    expect(
      formatDateRange({
        startDate: "2024-03-01",
        endDate: "2024-12-31",
        isCurrent: true,
      }),
    ).toBe("Mar 2024 – Present");
  });

  it("shows only the start month when a past role has no end date", () => {
    expect(
      formatDateRange({
        startDate: "2019-01-15",
        endDate: null,
        isCurrent: false,
      }),
    ).toBe("Jan 2019");
  });

  it("keeps the calendar month whatever the server's time zone", () => {
    expect(
      formatDateRange({
        startDate: "2024-03-01",
        endDate: "2024-05-31",
        isCurrent: false,
      }),
    ).toBe("Mar 2024 – May 2024");
  });
});
