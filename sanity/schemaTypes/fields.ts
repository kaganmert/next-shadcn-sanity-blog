import { defineArrayMember, defineField } from "sanity";

/** URL schemes allowed in links that editors type into the Studio. */
export const linkSchemes = ["http", "https", "mailto"];

/** A URL slug generated from the document's title (or another field). */
export function slugField({ source = "title" }: { source?: string } = {}) {
  return defineField({
    name: "slug",
    title: "Slug",
    type: "slug",
    options: { source, maxLength: 96 },
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

/**
 * Short rich text for CV entries: paragraphs and bullets, strong/em and
 * links. No headings, images or code: those belong in posts.
 */
export function shortRichTextField({
  name,
  title,
}: {
  name: string;
  title: string;
}) {
  return defineField({
    name,
    title,
    type: "array",
    of: [
      defineArrayMember({
        type: "block",
        styles: [{ title: "Normal", value: "normal" }],
        lists: [{ title: "Bullet", value: "bullet" }],
        marks: {
          decorators: [
            { title: "Strong", value: "strong" },
            { title: "Emphasis", value: "em" },
          ],
          annotations: [
            defineArrayMember({
              name: "link",
              title: "Link",
              type: "object",
              fields: [
                defineField({
                  name: "href",
                  title: "URL",
                  type: "url",
                  validation: (rule) =>
                    rule.required().uri({ scheme: linkSchemes }),
                }),
              ],
            }),
          ],
        },
      }),
    ],
  });
}

/**
 * The end of a date range. Hidden while `ongoingField` is checked; otherwise
 * required and not before the start date.
 */
export function endDateField({ ongoingField }: { ongoingField: string }) {
  return defineField({
    name: "endDate",
    title: "End date",
    type: "date",
    hidden: ({ parent }) => Boolean(parent?.[ongoingField]),
    validation: (rule) =>
      rule.custom((endDate, context) => {
        const parent = context.parent as Record<string, unknown> | undefined;
        if (parent?.[ongoingField]) return true;
        if (!endDate) return "End date is required unless this is ongoing";
        const startDate = parent?.startDate as string | undefined;
        if (startDate && endDate < startDate)
          return "End date must be after the start date";
        return true;
      }),
  });
}
