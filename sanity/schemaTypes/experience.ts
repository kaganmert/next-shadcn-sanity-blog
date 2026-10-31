import { BriefcaseIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt } from "./imageWithAlt";

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  icon: BriefcaseIcon,
  fields: [
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "url", title: "Company URL", type: "url" }),
    imageWithAlt({ name: "image", title: "Logo" }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        }),
      ],
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isCurrent",
      title: "Current role",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "endDate",
      title: "End date",
      type: "date",
      hidden: ({ parent }) => Boolean(parent?.isCurrent),
      validation: (rule) =>
        rule.custom((endDate, context) => {
          const parent = context.parent as
            | { isCurrent?: boolean; startDate?: string }
            | undefined;
          if (parent?.isCurrent) return true;
          if (!endDate)
            return "End date is required unless this is the current role";
          if (parent?.startDate && endDate < parent.startDate)
            return "End date must be after the start date";
          return true;
        }),
    }),
  ],
  orderings: [
    {
      title: "Start date, newest first",
      name: "startDateDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "role",
      company: "company",
      isCurrent: "isCurrent",
      media: "image",
    },
    prepare({ title, company, isCurrent, media }) {
      return {
        title,
        subtitle: [company, isCurrent ? "Current" : null]
          .filter(Boolean)
          .join(" · "),
        media,
      };
    },
  },
});
