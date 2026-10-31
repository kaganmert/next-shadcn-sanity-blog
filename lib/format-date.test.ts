import { describe, expect, it } from "vitest";
import { formatDate } from "./format-date";

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
