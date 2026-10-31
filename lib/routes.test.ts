import { describe, expect, it } from "vitest";
import { routes } from "./routes";

describe("routes", () => {
  it("builds the URL of a post from its slug", () => {
    expect(routes.post("hello-world")).toBe("/blog/hello-world");
  });

  it("builds the URL of a category page from its slug", () => {
    expect(routes.category("nextjs")).toBe("/blog/category/nextjs");
  });

  it("encodes slug characters that are not URL-safe", () => {
    expect(routes.post("c# tips")).toBe("/blog/c%23%20tips");
  });
});
