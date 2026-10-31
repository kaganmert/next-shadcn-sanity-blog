import { defineArrayMember, defineField, defineType } from "sanity";

/** Rich text for post bodies: headings, lists, links, images and code. */
export const blockContent = defineType({
  name: "blockContent",
  title: "Block content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Strike", value: "strike-through" },
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
                  rule.required().uri({
                    allowRelative: true,
                    scheme: ["http", "https", "mailto"],
                  }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineArrayMember({
      type: "code",
      options: {
        withFilename: true,
        languageAlternatives: [
          { title: "TypeScript", value: "typescript" },
          { title: "TSX", value: "tsx" },
          { title: "JavaScript", value: "javascript" },
          { title: "JSX", value: "jsx" },
          { title: "JSON", value: "json" },
          { title: "HTML", value: "html" },
          { title: "CSS", value: "css" },
          { title: "Shell", value: "sh" },
          { title: "GROQ", value: "groq" },
          { title: "Markdown", value: "markdown" },
          { title: "Plain text", value: "text" },
        ],
      },
    }),
  ],
});
