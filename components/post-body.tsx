import {
  PortableText,
  type PortableTextBlockComponent,
  type PortableTextComponents,
} from "@portabletext/react";
import { CodeBlock } from "@/components/code-block";
import { ARTICLE_IMAGE_SIZES, SanityImage } from "@/components/sanity-image";
import { headingIds } from "@/lib/heading-ids";
import { strings } from "@/lib/strings";
import type { BlockContent, Code } from "@/sanity.types";

type ImageBlock = Extract<BlockContent[number], { _type: "image" }>;

/** Renders a post body: headings get stable anchor ids, code is highlighted on the server. */
export function PostBody({ value }: { value: BlockContent }) {
  const ids = headingIds(value);

  // The anchor sits next to the heading text rather than around it, so links
  // inside a heading never end up nested in another link.
  const heading =
    (Tag: "h2" | "h3" | "h4"): PortableTextBlockComponent =>
    ({ children, value: block }) => {
      const id = block._key ? ids.get(block._key) : undefined;
      return (
        <Tag id={id} className="group scroll-mt-24">
          {children}
          {id ? (
            <a
              href={`#${id}`}
              aria-label={strings.post.linkToSection}
              className="heading-anchor"
            >
              #
            </a>
          ) : null}
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
            sizes={ARTICLE_IMAGE_SIZES}
            className="rounded-lg"
          />
          {image.caption ? <figcaption>{image.caption}</figcaption> : null}
        </figure>
      ),
      code: ({ value: code }: { value: Code }) =>
        code.code ? (
          <CodeBlock
            code={code.code}
            language={code.language}
            filename={code.filename}
          />
        ) : null,
    },
  };

  return <PortableText value={value} components={components} />;
}
