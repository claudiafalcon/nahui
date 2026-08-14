/**
 * Calendar-date utilities for Eventos (product/02-ux/events.md) and Home's
 * Event-active resolution branch (home.md §2 step 2). Every Event date and
 * every "Día N" computation (decision-log.md D15) is a *calendar-date*
 * concept, not an instant — Session.openedAt is an epoch timestamp, but
 * every comparison that matters here (which day is this?, does this range
 * overlap that one?) has to first normalize through a local calendar date.
 * Centralized here so every consumer (selectors.ts, store.tsx, the Eventos
 * screens) shares one normalization, never re-deriving it slightly
 * differently in two places.
 *
 * Date keys are `'YYYY-MM-DD'` strings in the device's local time zone —
 * chosen because it's exactly what a native `<input type="date">` produces
 * and consumes, and because lexicographic string comparison on a
 * zero-padded ISO date already matches chronological order (used directly
 * by the D17 overlap check and by every "most-recent-first" sort in
 * events.md).
 */

const MONTHS_SHORT_ES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MONTHS_LONG_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export function dateKey(timestamp: number): string {
  const d = new Date(timestamp);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dateKey(Date.now());
}

function toLocalMidnight(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).getTime();
}

/** Inclusive day count between two date keys (endDate − startDate + 1) —
 * the "de N" denominator in events.md §3.4's "Día 2 de 3." */
export function eventSpanDays(startKey: string, endKey: string): number {
  return Math.round((toLocalMidnight(endKey) - toLocalMidnight(startKey)) / 86_400_000) + 1;
}

/** Signed calendar-day difference, target − today — negative once past,
 * used for "empieza en N días" (home.md §3.5, events.md §3.4/§3.5). */
export function daysFromToday(targetKey: string): number {
  return Math.round((toLocalMidnight(targetKey) - toLocalMidnight(todayKey())) / 86_400_000);
}

/** "12 jul" — day + short Spanish month, no year, matching events.md's own
 * Día-row wireframe examples ("Día 1 · 12 jul · 5 ventas · $610"). */
export function formatShortDate(key: string): string {
  const [, m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS_SHORT_ES[m - 1]}`;
}

/** "12-14 de julio" (single month) / "30 jul - 2 ago" (spanning months) /
 * "19-21 de agosto" — events.md's own date-range display convention on
 * every detail screen (§3.11, §3.14…). A single-day Event (startKey ===
 * endKey) renders as one plain date, "12 de julio." */
export function formatDateRange(startKey: string, endKey: string): string {
  const [, sm, sd] = startKey.split('-').map(Number);
  const [, em, ed] = endKey.split('-').map(Number);
  if (startKey === endKey) return `${sd} de ${MONTHS_LONG_ES[sm - 1]}`;
  if (sm === em) return `${sd}-${ed} de ${MONTHS_LONG_ES[sm - 1]}`;
  return `${sd} ${MONTHS_SHORT_ES[sm - 1]} - ${ed} ${MONTHS_SHORT_ES[em - 1]}`;
}

/** "12-14 jul" — events.md §3.4's own, more compact list-card date-range
 * convention (short month, no "de"), distinct from `formatDateRange`'s
 * fuller detail-screen form. Single-day Event renders as "12 jul." */
export function formatShortDateRange(startKey: string, endKey: string): string {
  const [, sm, sd] = startKey.split('-').map(Number);
  const [, em, ed] = endKey.split('-').map(Number);
  if (startKey === endKey) return `${sd} ${MONTHS_SHORT_ES[sm - 1]}`;
  if (sm === em) return `${sd}-${ed} ${MONTHS_SHORT_ES[sm - 1]}`;
  return `${sd} ${MONTHS_SHORT_ES[sm - 1]} - ${ed} ${MONTHS_SHORT_ES[em - 1]}`;
}

/** Whether two inclusive date ranges overlap at all — the D17 check
 * (`decision-log.md`: "at most one Event per Business may be `scheduled`/
 * `active` with an overlapping date range at a time"). */
export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart <= bEnd && aEnd >= bStart;
}
