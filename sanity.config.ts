"use client";

/**
 * Sanity Studio configuration, mounted at /studio by
 * app/studio/[[...tool]]/page.tsx.
 */
import { codeInput } from "@sanity/code-input";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { routes } from "./lib/routes";
import { apiVersion, dataset, projectId } from "./sanity/env";
import { resolve } from "./sanity/presentation/resolve";
import { schemaTypes } from "./sanity/schemaTypes";
import { singletonDocumentActions, singletonTypes } from "./sanity/singletons";
import { structure } from "./sanity/structure";

export default defineConfig({
  name: "default",
  title: "next-shadcn-sanity-blog",
  basePath: routes.studio,
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
        ? singletonDocumentActions(actions)
        : actions,
    newDocumentOptions: (options, { creationContext }) =>
      creationContext.type === "global"
        ? options.filter(({ templateId }) => !singletonTypes.has(templateId))
        : options,
  },
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: routes.draftMode.enable,
          disable: routes.draftMode.disable,
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    codeInput(),
  ],
});
