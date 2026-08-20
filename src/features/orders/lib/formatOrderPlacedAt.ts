const compactDateFormatter = new Intl.DateTimeFormat("ar-EG", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Compact Arabic date for admin order lists. */
export function formatOrderPlacedAt(isoDate: string): string {
  return compactDateFormatter.format(new Date(isoDate));
}
