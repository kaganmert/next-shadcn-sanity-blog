import type { ReactNode } from "react";

/**
 * A quiet section label: small mono caps, then a hairline that runs to the
 * end of the column, with an optional link at the end.
 */
export function SectionHeading({
  id,
  children,
  aside,
}: {
  id: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <h2 id={id} className="label-mono shrink-0">
        {children}
      </h2>
      <span aria-hidden className="h-px flex-1 bg-border" />
      {aside}
    </div>
  );
}
