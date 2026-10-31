type BlockLike = {
  _type?: string;
  _key?: string;
  style?: string;
  children?: Array<{ text?: string }>;
};

const HEADING_STYLES = new Set(["h2", "h3", "h4"]);

/**
 * Anchor ids for the headings in a Portable Text body, keyed by block `_key`.
 * Ids come from the heading text and stay unique within the document, so
 * links like /blog/post#fetching-content are stable and shareable.
 */
export function headingIds(blocks: BlockLike[]): Map<string, string> {
  const ids = new Map<string, string>();
  const seen = new Map<string, number>();

  for (const block of blocks) {
    if (
      block._type !== "block" ||
      !block._key ||
      !HEADING_STYLES.has(block.style ?? "")
    )
      continue;

    const text = (block.children ?? [])
      .map((child) => child.text ?? "")
      .join("");
    const base = slugify(text) || "section";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    ids.set(block._key, count === 1 ? base : `${base}-${count}`);
  }

  return ids;
}

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
