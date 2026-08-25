const contactDateFormatter = new Intl.DateTimeFormat("ar-EG", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatContactMessageDate(isoDate: string): string {
  return contactDateFormatter.format(new Date(isoDate));
}
