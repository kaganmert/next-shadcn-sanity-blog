/**
 * Returns `path` if it is a path on this site, otherwise "/". Guards redirect
 * targets taken from query strings against open redirects.
 */
export function safeRedirectPath(path: string | null | undefined): string {
  if (!path?.startsWith("/")) return "/";
  // "//host" and "/\host" are treated by browsers as protocol-relative URLs.
  if (path.startsWith("//") || path.startsWith("/\\")) return "/";
  return path;
}
