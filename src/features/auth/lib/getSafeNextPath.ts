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

function adminPathname(path: string): string {
  return path.split("?")[0] ?? path;
}

/**
 * Same-origin relative paths that stay inside the admin panel.
 * Rejects `/admin/login` so a failed guard cannot loop the login page.
 */
export function getSafeAdminNextPath(
  next: string | string[] | undefined | null,
  fallback = "/admin",
): string {
  const path = getSafeNextPath(next, fallback);
  const pathname = adminPathname(path);

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return fallback;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return path;
  }

  return fallback;
}
