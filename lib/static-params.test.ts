import { describe, expect, it } from "vitest";
import { PLACEHOLDER_SLUG, withPlaceholderParam } from "./static-params";

describe("withPlaceholderParam", () => {
  it("passes real params through unchanged", () => {
    expect(
      withPlaceholderParam([{ slug: "nextjs" }, { slug: "sanity" }]),
    ).toEqual([{ slug: "nextjs" }, { slug: "sanity" }]);
  });

  it("returns a single placeholder slug when there is nothing to prerender yet", () => {
    expect(withPlaceholderParam([])).toEqual([{ slug: PLACEHOLDER_SLUG }]);
  });

  it("drops entries without a slug before deciding", () => {
    expect(withPlaceholderParam([{ slug: null }])).toEqual([
      { slug: PLACEHOLDER_SLUG },
    ]);
  });
});
