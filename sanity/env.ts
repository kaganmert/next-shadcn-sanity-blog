/**
 * Public Sanity identifiers. They are not secrets: the project ID and dataset
 * are visible in every request the browser makes to the Sanity CDN.
 */
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

/** Pin the Content Lake API to a known date so query behaviour can't shift. */
export const apiVersion = "2026-10-31";

function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined || value === "") {
    throw new Error(errorMessage);
  }
  return value;
}
