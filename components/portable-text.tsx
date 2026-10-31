import {
  type PortableTextBlockComponent,
  type PortableTextComponents,
  PortableText as PortableTextRenderer,
} from "@portabletext/react";
import { CodeBlock } from "@/components/code-block";
import { SanityImage } from "@/components/sanity-image";
import { headingIds } from "@/lib/heading-ids";
import type { BlockContent } from "@/sanity.types";

type ImageBlock = Extract<BlockContent[number], { _type: "image" }>;
type CodeBlockValue = { code?: string; language?: string; filename?: string };

/** Renders a post body: headings get stable anchor ids, code is highlighted on the server. */
export function PortableText({ value }: { value: BlockContent }) {
  const ids = headingIds(value);

  const heading =
    (Tag: "h2" | "h3" | "h4"): PortableTextBlockComponent =>
    ({ children, value: block }) => {
      const id = block._key ? ids.get(block._key) : undefined;
      return (
        <Tag id={id} className="group scroll-mt-24">
          <a href={`#${id}`} className="heading-anchor">
            {children}
            <span
              aria-hidden
              className="ml-2 text-muted-foreground opacity-0 group-hover:opacity-100"
            >
              #
            </span>
          </a>
        </Tag>
      );
    };

  const components: PortableTextComponents = {
    block: { h2: heading("h2"), h3: heading("h3"), h4: heading("h4") },
    marks: {
      link: ({ children, value: link }) => {
        const href: string = link?.href ?? "#";
        const isExternal = /^https?:\/\//.test(href);
        return (
          <a
            href={href}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value: image }: { value: ImageBlock }) => (
        <figure>
          <SanityImage
            image={image}
            sizes="(min-width: 768px) 672px, 100vw"
            className="rounded-lg"
          />
          {image.caption ? <figcaption>{image.caption}</figcaption> : null}
        </figure>
      ),
      code: ({ value: code }: { value: CodeBlockValue }) =>
        code.code ? (
          <CodeBlock
            code={code.code}
            language={code.language}
            filename={code.filename}
          />
        ) : null,
    },
  };

  return <PortableTextRenderer value={value} components={components} />;
}
