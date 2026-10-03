const monthFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** Formats a "YYYY-MM" month as a short French label, e.g. "juil. 2025". */
export function formatMonth(month: string): string {
  const [year, monthNumber] = month.split('-').map(Number);
  return monthFormatter.format(new Date(Date.UTC(year, monthNumber - 1, 1)));
}

/** Formats a period. A null end means the work is still going on; a one-month period shows its month once. */
export function formatPeriod(start: string, end: string | null): string {
  if (end === start) return formatMonth(start);
  return `${formatMonth(start)} - ${end === null ? "aujourd'hui" : formatMonth(end)}`;
}
