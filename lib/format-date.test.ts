import { describe, expect, it } from "vitest";
import { formatDate, formatDateRange } from "./format-date";

describe("formatDate", () => {
  it("formats an ISO date as a short English date", () => {
    expect(formatDate("2026-10-20T09:00:00Z")).toBe("Oct 20, 2026");
  });

  it("keeps the UTC calendar day whatever the server's time zone", () => {
    expect(formatDate("2026-10-20T23:30:00Z")).toBe("Oct 20, 2026");
    expect(formatDate("2026-10-20T00:30:00Z")).toBe("Oct 20, 2026");
  });

  it("formats a plain calendar date", () => {
    expect(formatDate("2024-03-01")).toBe("Mar 1, 2024");
  });
});

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

  it("shows a single month when the range starts and ends in the same month", () => {
    expect(
      formatDateRange({
        startDate: "2021-10-01",
        endDate: "2021-10-01",
        isCurrent: false,
      }),
    ).toBe("Oct 2021");
  });
});
