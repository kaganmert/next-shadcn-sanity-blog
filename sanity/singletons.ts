import type { DocumentActionComponent } from "sanity";
import type { StructureBuilder } from "sanity/structure";
import { settings } from "./schemaTypes/settings";

/**
 * Document types that exist exactly once, stored under a document ID equal to
 * their type name. Add a schema here to make it a singleton everywhere: the
 * Studio structure, the "new document" menus and the document actions.
 */
const singletonSchemas = [settings];

export const singletonTypes = new Set<string>(
  singletonSchemas.map((schema) => schema.name),
);

/** Singletons can be edited and published, never duplicated or deleted. */
const allowedSingletonActions = new Set([
  "publish",
  "discardChanges",
  "restore",
]);

export function singletonDocumentActions(actions: DocumentActionComponent[]) {
  return actions.filter(
    ({ action }) => action && allowedSingletonActions.has(action),
  );
}

export function singletonListItems(S: StructureBuilder) {
  return singletonSchemas.map((schema) => {
    const title = schema.title ?? schema.name;
    return S.listItem()
      .title(title)
      .id(schema.name)
      .icon(schema.icon)
      .child(
        S.document()
          .schemaType(schema.name)
          .documentId(schema.name)
          .title(title),
      );
  });
}
