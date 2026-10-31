import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    path: "./{app,components,lib,sanity}/**/*.{ts,tsx}",
    schema: "./sanity/extract.json",
    generates: "./sanity.types.ts",
    overloadClientMethods: true,
  },
});
