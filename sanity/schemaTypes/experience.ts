import { BriefcaseIcon } from "lucide-react";
import { defineField, defineType } from "sanity";
import { endDateField, imageWithAlt, shortRichTextField } from "./fields";

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
    shortRichTextField({ name: "description", title: "Description" }),
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
    endDateField({ ongoingField: "isCurrent" }),
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
