import { UserIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { imageWithAlt } from "./fields";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    imageWithAlt({ name: "image", title: "Image" }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "name", media: "image" } },
});
