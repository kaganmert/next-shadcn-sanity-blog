"use client";

import type { SanityImageSource } from "@sanity/image-url";
import Image, { type ImageProps } from "next/image";
import {
  getImageDimensions,
  sanityImageLoader,
  urlForImage,
} from "@/sanity/lib/image";

/** `sizes` for images that span the article column (max-w-2xl). */
export const ARTICLE_IMAGE_SIZES = "(min-width: 768px) 672px, 100vw";

type SanityImageProps = Omit<
  ImageProps,
  "src" | "alt" | "loader" | "width" | "height"
> & {
  image: SanityImageSource & {
    asset?: { _ref?: string } | null;
    alt?: string | null;
  };
};

/**
 * `next/image` for Sanity images: the Sanity CDN does the resizing (with crop
 * and hotspot), and width/height come from the asset ID so layout never shifts.
 * A client component because `next/image` loaders are functions.
 */
export function SanityImage({ image, ...props }: SanityImageProps) {
  const dimensions = getImageDimensions(image);
  if (!dimensions) return null;

  return (
    <Image
      {...props}
      src={urlForImage(image).url()}
      loader={sanityImageLoader(image)}
      width={dimensions.width}
      height={dimensions.height}
      alt={image.alt ?? ""}
    />
  );
}
