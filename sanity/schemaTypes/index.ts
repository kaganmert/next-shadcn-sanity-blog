import type { SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { blockContent } from "./blockContent";
import { category } from "./category";
import { experience } from "./experience";
import { post } from "./post";
import { settings } from "./settings";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  category,
  author,
  experience,
  settings,
  blockContent,
];
