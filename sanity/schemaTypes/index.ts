import type { SchemaTypeDefinition } from "sanity";
import { author } from "./author";
import { blockContent } from "./blockContent";
import { category } from "./category";
import { credential } from "./credential";
import { experience } from "./experience";
import { post } from "./post";
import { project } from "./project";
import { settings } from "./settings";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  category,
  author,
  experience,
  project,
  credential,
  settings,
  blockContent,
];
