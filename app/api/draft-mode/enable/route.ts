import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

/** Called by the Presentation tool to turn on draft mode for the preview iframe. */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
