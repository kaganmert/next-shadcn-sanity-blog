"use client";

/**
 * Sanity Studio configuration, mounted at /studio by
 * app/studio/[[...tool]]/page.tsx.
 */
import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";
import { singletonTypes, structure } from "./sanity/structure";

/** Singletons can be edited and published, never duplicated or deleted. */
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: "next-shadcn-sanity-blog",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (actions, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({ action }) => action && singletonActions.has(action))
        : actions,
    newDocumentOptions: (options, { creationContext }) =>
      creationContext.type === "global"
        ? options.filter(({ templateId }) => !singletonTypes.has(templateId))
        : options,
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
  ],
});
