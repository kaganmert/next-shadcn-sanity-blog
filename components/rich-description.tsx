import {
  PortableText,
  type PortableTextComponents,
  type PortableTextProps,
} from "@portabletext/react";

/** The quiet ink underline used for links in CV entries. */
export const inkLinkClass =
  "text-foreground underline decoration-primary/45 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-150 hover:decoration-primary";

/** Short paragraphs and bullets, with small vermilion markers like the post body. */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-2 first:mt-0">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-2 space-y-1.5 first:mt-0">{children}</ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-4 before:absolute before:top-[0.72em] before:left-0 before:size-1 before:rounded-full before:bg-primary/70">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-foreground">{children}</strong>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className={inkLinkClass}
      >
        {children}
      </a>
    ),
  },
};

/** Rich text from a `shortRichTextField` (experience and project descriptions). */
export function RichDescription({
  value,
}: {
  value: PortableTextProps["value"];
}) {
  return <PortableText value={value} components={components} />;
}
