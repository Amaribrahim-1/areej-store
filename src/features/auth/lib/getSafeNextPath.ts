/**
 * Allows only same-origin relative paths for post-auth redirects.
 * Rejects protocol-relative URLs, absolute URLs, and backslash tricks
 * (e.g. `/\evil.com`) that some browsers treat as external.
 */
export function getSafeNextPath(
  next: string | string[] | undefined | null,
  fallback = "/",
): string {
  const raw = Array.isArray(next) ? next[0] : next;
  if (!raw) return fallback;
  if (!raw.startsWith("/")) return fallback;
  if (raw.startsWith("//")) return fallback;
  if (raw.includes("\\")) return fallback;
  if (raw.includes("://")) return fallback;
  return raw;
}
