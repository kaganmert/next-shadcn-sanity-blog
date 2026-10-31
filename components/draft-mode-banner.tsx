"use client";

import { usePathname } from "next/navigation";
import { useIsPresentationTool } from "next-sanity/hooks";
import { strings } from "@/lib/strings";

/**
 * Shown when draft mode is on outside the Presentation tool, so an editor who
 * opened a preview link can tell they see drafts and leave draft mode.
 */
export function DraftModeBanner() {
  const isPresentationTool = useIsPresentationTool();
  const pathname = usePathname();
  // `null` while detecting; inside Presentation the Studio has its own controls.
  if (isPresentationTool !== false) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex items-center gap-3 rounded-lg border bg-background px-4 py-2 text-sm shadow-lg">
      <span>{strings.draftMode.label}</span>
      <a
        href={`/api/draft-mode/disable?redirect=${encodeURIComponent(pathname)}`}
        className="font-medium text-primary hover:underline"
      >
        {strings.draftMode.exit}
      </a>
    </div>
  );
}
