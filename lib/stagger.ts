import type { CSSProperties } from "react";

/** Position in an `ink-in` stagger sequence (see globals.css). */
export function stagger(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}
