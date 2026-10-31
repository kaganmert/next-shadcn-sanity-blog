import { describe, expect, it } from "vitest";
import { getImageDimensions, urlForImage } from "./image";

describe("getImageDimensions", () => {
  it("reads width and height from a Sanity image asset reference", () => {
    const image = {
      asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
    };
    expect(getImageDimensions(image)).toEqual({
      width: 2000,
      height: 3000,
      aspectRatio: 2 / 3,
    });
  });

  it("returns null when the image has no asset yet", () => {
    expect(getImageDimensions({ asset: undefined })).toBeNull();
  });
});

describe("urlForImage", () => {
  it("builds a CDN URL for the project and dataset that lets the CDN pick the format", () => {
    const image = {
      asset: { _ref: "image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg" },
    };
    expect(urlForImage(image).width(800).url()).toBe(
      "https://cdn.sanity.io/images/test-project/test/Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000.jpg?w=800&auto=format",
    );
  });
});
