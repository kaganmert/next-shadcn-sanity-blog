import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { dataset, projectId } from "@/sanity/env";

const builder = createImageUrlBuilder({ projectId, dataset });

/** A Sanity CDN URL builder for an image; the CDN serves the best format the browser accepts. */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto("format");
}

/**
 * A `next/image` loader that lets the Sanity CDN resize the image (honouring
 * crop and hotspot) instead of the Next.js image optimizer.
 */
export function sanityImageLoader(source: SanityImageSource) {
  return ({
    width,
    quality,
  }: {
    src: string;
    width: number;
    quality?: number;
  }) =>
    urlForImage(source)
      .width(width)
      .quality(quality ?? 75)
      .url();
}

type ImageWithAsset = { asset?: { _ref?: string } | null } | null | undefined;

export type ImageDimensions = {
  width: number;
  height: number;
  aspectRatio: number;
};

/**
 * Sanity encodes an image's intrinsic size in its asset ID
 * (`image-<hash>-<width>x<height>-<format>`), so width and height are known
 * without fetching the asset document.
 */
export function getImageDimensions(
  image: ImageWithAsset,
): ImageDimensions | null {
  const match = image?.asset?._ref?.match(/^image-[^-]+-(\d+)x(\d+)-[a-z]+$/);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return { width, height, aspectRatio: width / height };
}
