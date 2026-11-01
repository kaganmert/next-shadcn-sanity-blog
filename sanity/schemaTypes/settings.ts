import { SettingsIcon } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { linkSchemes } from "./fields";

/** Site-wide identity and navigation. A singleton: see sanity/structure.ts. */
export const settings = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: SettingsIcon,
  fields: [
    defineField({
      name: "title",
      title: "Site name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site description",
      description: "Default meta description and the RSS feed description.",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(200),
    }),
    defineField({ name: "intro", title: "Home intro", type: "text", rows: 3 }),
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
      of: [
        defineArrayMember({
          name: "navItem",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "href",
              title: "Link",
              description: "A site path such as /blog, or a full URL.",
              type: "string",
              validation: (rule) =>
                rule
                  .required()
                  .custom((href) =>
                    !href || href.startsWith("/") || /^https?:\/\//.test(href)
                      ? true
                      : "Use a path starting with / or a full http(s) URL",
                  ),
            }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [
        defineArrayMember({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.required().uri({ scheme: linkSchemes }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "githubUsername",
      title: "GitHub username",
      description:
        "Shows your GitHub contributions on the home page. Also needs a GITHUB_TOKEN environment variable; leave empty to hide.",
      type: "string",
      validation: (rule) =>
        rule.regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, {
          name: "GitHub username",
        }),
    }),
    defineField({
      name: "resume",
      title: "Resume (PDF)",
      description:
        "Linked as “Download CV” on the work page and served at /cv.pdf. Leave empty to hide both.",
      type: "file",
      options: { accept: "application/pdf" },
    }),
    defineField({
      name: "techStack",
      title: "Tech stack",
      type: "array",
      of: [
        defineArrayMember({
          name: "techStackItem",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "category",
              title: "Category",
              description:
                "Used to group the stack, e.g. Languages, Frameworks, Tools.",
              type: "string",
            }),
          ],
          preview: { select: { title: "name", subtitle: "category" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Settings" }) },
});
