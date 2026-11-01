import { FileTextIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt, slugField } from "./fields";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: FileTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Shown in post lists, RSS and as the meta description.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(200),
    }),
    imageWithAlt({ name: "coverImage", title: "Cover image" }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", title: "Body", type: "blockContent" }),
  ],
  orderings: [
    {
      title: "Published, newest first",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      publishedAt: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, author, publishedAt, media }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString("en", {
            dateStyle: "medium",
          })
        : "Draft";
      return {
        title,
        subtitle: [date, author].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
