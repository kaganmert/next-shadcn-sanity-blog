import { describe, expect, it } from "vitest";
import { getSiteUrl } from "./site-url";

describe("getSiteUrl", () => {
  it("uses NEXT_PUBLIC_SITE_URL when it is set, without a trailing slash", () => {
    expect(
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://example.com/",
        VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app",
      }),
    ).toBe("https://example.com");
  });

  it("falls back to the Vercel production domain over https", () => {
    expect(
      getSiteUrl({
        VERCEL_PROJECT_PRODUCTION_URL: "blog.vercel.app",
        VERCEL_URL: "blog-abc.vercel.app",
      }),
    ).toBe("https://blog.vercel.app");
  });

  it("falls back to the deployment URL when no production domain is known", () => {
    expect(getSiteUrl({ VERCEL_URL: "blog-abc.vercel.app" })).toBe(
      "https://blog-abc.vercel.app",
    );
  });

  it("uses localhost when nothing is configured", () => {
    expect(getSiteUrl({})).toBe("http://localhost:3000");
  });

  it("ignores empty values", () => {
    expect(
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: "",
        VERCEL_URL: "blog-abc.vercel.app",
      }),
    ).toBe("https://blog-abc.vercel.app");
  });
});
