import type { StructureResolver } from "sanity/structure";
import { singletonListItems, singletonTypes } from "./singletons";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...singletonListItems(S),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !singletonTypes.has(item.getId() ?? ""),
      ),
    ]);
