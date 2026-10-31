import { defineField } from "sanity";

/**
 * An optional image whose alt text becomes required as soon as an image is
 * uploaded. Shared by every document that has a single image field.
 */
export function imageWithAlt({ name, title }: { name: string; title: string }) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        validation: (rule) =>
          rule.custom((alt, context) => {
            const image = context.parent as { asset?: unknown } | undefined;
            return image?.asset && !alt
              ? "Alternative text is required when an image is set"
              : true;
          }),
      }),
    ],
  });
}
