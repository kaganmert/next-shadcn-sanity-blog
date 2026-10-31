import { draftMode } from "next/headers";
import { type ReactNode, Suspense } from "react";
import {
  type FetchOptions,
  getFetchOptions,
  publishedFetchOptions,
} from "./live";

type RenderWithFetchOptions = (options: FetchOptions) => ReactNode;

/**
 * Renders `children` with the right Sanity fetch options. Outside draft mode it
 * renders straight away with the published options, so the result can be
 * prerendered into the static shell. In draft mode the options depend on
 * cookies, so it streams in behind a Suspense boundary.
 *
 * Keep every cookie read inside the draft branch: routes with
 * `ensureStatic = "navigation"` must prerender without request-time data.
 */
export async function WithFetchOptions({
  children,
}: {
  children: RenderWithFetchOptions;
}) {
  const { isEnabled: isDraftMode } = await draftMode();
  if (!isDraftMode) return children(publishedFetchOptions);

  return (
    <Suspense>
      <WithDraftFetchOptions>{children}</WithDraftFetchOptions>
    </Suspense>
  );
}

async function WithDraftFetchOptions({
  children,
}: {
  children: RenderWithFetchOptions;
}) {
  return children(await getFetchOptions());
}
