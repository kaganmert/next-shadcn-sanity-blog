import { defineField } from "sanity";

/** URL schemes allowed in links that editors type into the Studio. */
export const linkSchemes = ["http", "https", "mailto"];

/** A URL slug generated from the document's title. */
export function slugField() {
  return defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: { source: "title", maxLength: 96 },
    validation: (rule) => rule.required(),
  });
}

/**
 * Alt text for an image. With `required: "always"` it must be filled in; with
 * `"whenImageSet"` it only becomes required once an image is uploaded, which
 * suits optional image fields.
 */
export function altTextField({
  required,
}: {
  required: "always" | "whenImageSet";
}) {
  return defineField({
    name: "alt",
    title: "Alternative text",
    type: "string",
    validation: (rule) =>
      required === "always"
        ? rule.required()
        : rule.custom((alt, context) => {
            const image = context.parent as { asset?: unknown } | undefined;
            return image?.asset && !alt
              ? "Alternative text is required when an image is set"
              : true;
          }),
  });
}

/** An optional single image whose alt text is required once an image is set. */
export function imageWithAlt({ name, title }: { name: string; title: string }) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [altTextField({ required: "whenImageSet" })],
  });
}
