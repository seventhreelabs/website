/** "4 listopada 2026" / "November 4, 2026" from a YYYY-MM-DD or ISO string. */
export function formatDate(date: string, locale: string): string {
  const parsed = new Date(date.length === 10 ? `${date}T12:00:00Z` : date);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(parsed);
}

/** Minutes a person needs to read `html`, at 200 words a minute. */
export function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
