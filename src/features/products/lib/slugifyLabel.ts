import { normalizeArabic } from "./normalizeArabic";

/**
 * URL slug from a product name or category label.
 * Keeps Arabic and Latin letters/digits; spaces become hyphens.
 */
export function slugifyLabel(input: string, maxLength: number): string {
  return normalizeArabic(input)
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLength)
    .replace(/-$/g, "");
}
