import { createClient } from "next-sanity";
import { routes } from "@/lib/routes";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  // Stega encodes edit links into strings; it is only switched on per fetch in draft mode.
  stega: { studioUrl: routes.studio },
});
