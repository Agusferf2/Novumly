const TZ = 'America/Argentina/San_Juan';

/**
 * Returns today's date as "YYYY-MM-DD" in the project timezone.
 */
export function getTodayString() {
  return toDateString(new Date());
}

/**
 * Converts any Date to "YYYY-MM-DD" in the project timezone.
 */
export function toDateString(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  const d = parts.find(p => p.type === 'day').value;
  return `${y}-${m}-${d}`;
}
