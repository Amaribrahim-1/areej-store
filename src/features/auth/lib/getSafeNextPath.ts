/**
 * Allows only same-origin relative paths for post-auth redirects.
 * Rejects protocol-relative URLs (`//evil.com`) and absolute URLs.
 */
export function getSafeNextPath(
  next: string | string[] | undefined | null,
  fallback = "/",
): string {
  const raw = Array.isArray(next) ? next[0] : next;
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}
