import "server-only";

/**
 * Viewer token for drafts, Live preview and Visual Editing. `server-only`
 * makes the build fail if any client component imports this module, so the
 * token can never end up in the browser bundle.
 */
export const token = process.env.SANITY_API_READ_TOKEN || undefined;
