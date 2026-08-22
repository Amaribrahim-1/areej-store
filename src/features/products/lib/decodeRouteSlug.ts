/**
 * Next.js dynamic `[slug]` params stay percent-encoded for non-ASCII
 * (Arabic product slugs). The DB stores the decoded value.
 */
export function decodeRouteSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
