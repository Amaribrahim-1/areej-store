import { getSafeNextPath } from "./getSafeNextPath";

/**
 * Absolute URL for Supabase `emailRedirectTo` / OAuth `redirectTo`.
 * Keeps `next` as a safe relative path query param for `/auth/callback`.
 */
export function buildAuthCallbackUrl(
  origin: string,
  nextPath?: string | null,
): string {
  const next = getSafeNextPath(nextPath, "/");
  const url = new URL("/auth/callback", origin);
  url.searchParams.set("next", next);
  return url.toString();
}
