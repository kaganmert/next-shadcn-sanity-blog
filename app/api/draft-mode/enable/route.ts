import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

const enableDraftMode = token
  ? defineEnableDraftMode({ client: client.withConfig({ token }) })
  : null;

/** Called by the Presentation tool to turn on draft mode for the preview iframe. */
export async function GET(request: Request) {
  if (!enableDraftMode) {
    return new Response(
      "Draft mode is unavailable: SANITY_API_READ_TOKEN is not set.",
      { status: 500 },
    );
  }
  return enableDraftMode.GET(request);
}
