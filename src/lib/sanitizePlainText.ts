/**
 * Strips HTML tags from free-text user input (reviews, contact, etc.).
 * Comments are plain text — not rich HTML — so all tags are removed.
 * Comparison text like `3 < 5` is preserved (only real tags: letter after `<`).
 * Call before storage and before any non-React-text render path.
 */
export function sanitizePlainText(input: string): string {
  let out = input.replace(/\0/g, "");

  // Repeat until stable so nested / broken tag tricks cannot leave markup behind.
  let previous = "";
  while (out !== previous) {
    previous = out;
    out = out.replace(/<\/?[a-zA-Z][a-zA-Z0-9]*\b[^>]*>/g, "");
  }

  return out
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}
