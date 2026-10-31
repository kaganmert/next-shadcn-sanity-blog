import { SettingsIcon } from "lucide-react";
import type { StructureResolver } from "sanity/structure";

/** Document types that exist exactly once, under a fixed document ID. */
export const singletonTypes = new Set(["settings"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Settings")
        .id("settings")
        .icon(SettingsIcon)
        .child(
          S.document()
            .schemaType("settings")
            .documentId("settings")
            .title("Settings"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? ""),
      ),
    ]);
