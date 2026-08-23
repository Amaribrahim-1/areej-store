const reviewDateFormatter = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatReviewDate(isoDate: string): string {
  return reviewDateFormatter.format(new Date(isoDate));
}
