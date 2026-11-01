import { FileIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { reservedPageSlugs, routes } from "@/lib/routes";
import { slugField } from "./fields";

/**
 * A standalone page at /[slug]: privacy, support, about. Not listed in the
 * navigation unless an editor adds it in Settings.
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: FileIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      ...slugField(),
      description: "The page's address: /your-slug.",
      validation: (rule) =>
        rule
          .required()
          .custom((slug) =>
            slug?.current && reservedPageSlugs.has(slug.current)
              ? `“${slug.current}” is already used by the site (${routes.page(slug.current)})`
              : true,
          ),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Shown under the title and as the meta description.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.max(200),
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug ? routes.page(slug) : undefined,
    }),
  },
});
