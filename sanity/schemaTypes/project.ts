import { FolderGitIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  altTextField,
  endDateField,
  imageWithAlt,
  linkSchemes,
  shortRichTextField,
  slugField,
} from "./fields";

/**
 * A project on the work page. A project with a gallery also gets its own
 * page at /work/[slug]; one without stays a row on the work page.
 */
export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: FolderGitIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField({ source: "name" }),
    defineField({
      name: "tagline",
      title: "Tagline",
      description: "One line under the name.",
      type: "string",
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: "status",
      title: "Status",
      description: "Optional label, e.g. “In development · Unreleased”.",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isOngoing",
      title: "Ongoing",
      type: "boolean",
      initialValue: false,
    }),
    endDateField({ ongoingField: "isOngoing" }),
    defineField({
      name: "url",
      title: "Link",
      description: "The live site or store page.",
      type: "url",
      validation: (rule) => rule.uri({ scheme: linkSchemes }),
    }),
    defineField({
      name: "repositoryUrl",
      title: "Repository",
      type: "url",
    }),
    shortRichTextField({ name: "description", title: "Description" }),
    defineField({
      name: "techStack",
      title: "Tech stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    imageWithAlt({ name: "icon", title: "Icon" }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description: "Screenshots. A project with a gallery gets its own page.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [altTextField({ required: "always" })],
        }),
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "category",
      title: "Updates category",
      description:
        "Posts in this category are listed as the project's updates.",
      type: "reference",
      to: [{ type: "category" }],
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
    select: { title: "name", subtitle: "tagline", media: "icon" },
  },
});
