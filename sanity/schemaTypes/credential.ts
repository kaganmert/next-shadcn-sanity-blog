import { AwardIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

export const credentialKinds = [
  { title: "Education", value: "education" },
  { title: "Award", value: "award" },
  { title: "Certificate", value: "certificate" },
  { title: "Organization", value: "organization" },
] as const;

/** Education, awards, certificates and organizations on the work page. */
export const credential = defineType({
  name: "credential",
  title: "Credential",
  type: "document",
  icon: AwardIcon,
  fields: [
    defineField({
      name: "kind",
      title: "Kind",
      type: "string",
      options: { list: [...credentialKinds], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      description: "The degree, award, certificate or role.",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "issuer",
      title: "Issuer",
      description: "The school, company or organization.",
      type: "string",
    }),
    defineField({
      name: "period",
      title: "Period",
      description:
        "Free text, as precise as you know it: “2015 – 2020”, “Mar 2021”.",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "url", title: "Link", type: "url" }),
  ],
  preview: {
    select: { title: "title", issuer: "issuer", kind: "kind" },
    prepare: ({ title, issuer, kind }) => ({
      title,
      subtitle: [
        credentialKinds.find((option) => option.value === kind)?.title,
        issuer,
      ]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
