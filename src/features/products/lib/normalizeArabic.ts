/**
 * Normalize Arabic (and Latin case) for catalog search.
 * Must stay in sync with private.normalize_arabic() in
 * supabase/migrations/20260805151537_add_arabic_name_normalization.sql
 */
export function normalizeArabic(input: string): string {
  return input
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱٲٳ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .toLowerCase();
}
