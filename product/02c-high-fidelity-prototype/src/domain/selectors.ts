import { dateKey } from './dates';
import type { AppState, Event, ID, Product, Session, Venue } from './types';

/** Pure, derived reads over AppState — no mutation, mirrors domain-model.md's
 * "the merchant experiences Products, the platform preserves traceability." */

export function activeSession(state: AppState): Session | undefined {
  return state.sessions.find((s) => s.status === 'active');
}

export function openSaleForSession(state: AppState, sessionId: ID) {
  return state.sales.find((sa) => sa.sessionId === sessionId && sa.status === 'open');
}

export function availableCount(state: AppState, productId: ID): number {
  return state.units.filter((u) => u.productId === productId && u.status === 'available').length;
}

export function everReceived(state: AppState, productId: ID): boolean {
  return state.entries.some((e) => e.productId === productId);
}

export function hasAnyAvailableUnit(state: AppState): boolean {
  return state.units.some((u) => u.status === 'available');
}

/** Catalog rows in registration order — what Inventario's Catalog view shows. */
export function catalogRows(state: AppState) {
  return state.products
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((product) => ({
      product,
      available: availableCount(state, product.id),
      everReceived: everReceived(state, product.id),
    }));
}

/** How many finalized SaleItems this Product has ever sold — drives the
 * selling grid's most-frequently-sold-first ordering (home.md §3.9). */
function salesCount(state: AppState, productId: ID): number {
  let count = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized') continue;
    for (const item of sale.items) {
      if (item.productId === productId) count += 1;
    }
  }
  return count;
}

/** Selling grid order: most-frequently-sold-first, ties broken by registration order. */
export function sellingGridRows(state: AppState) {
  return state.products
    .slice()
    .map((product) => ({
      product,
      available: availableCount(state, product.id),
      sold: salesCount(state, product.id),
    }))
    .sort((a, b) => {
      if (b.sold !== a.sold) return b.sold - a.sold;
      return a.product.createdAt - b.product.createdAt;
    });
}

/** Running totals for a Session — sum of SaleItem.pricePaid across every
 * finalized Sale in it (decision-log.md D33) — never a flat price × count. */
export function sessionTotals(state: AppState, sessionId: ID): { revenue: number; count: number } {
  let revenue = 0;
  let count = 0;
  for (const sale of state.sales) {
    if (sale.sessionId !== sessionId || sale.status !== 'finalized') continue;
    count += 1;
    for (const item of sale.items) revenue += item.pricePaid;
  }
  return { revenue, count };
}

export function findProduct(state: AppState, productId: ID): Product | undefined {
  return state.products.find((p) => p.id === productId);
}

/** Eventos (`events.md`, `decision-log.md` D8/D15/D17/D20). */

export type EventStatus = 'scheduled' | 'active' | 'closed' | 'cancelled';

/**
 * `events.md` §2's own explicit rule: status is **never** a stored field —
 * computed live, every time, from `startDate`/`endDate` vs. today plus
 * `cancelledAt`. `cancelledAt` is terminal and checked first, regardless of
 * dates; otherwise `scheduled` (today before start) → `active` (today within
 * range, inclusive) → `closed` (today after end), purely date-driven.
 */
export function eventStatus(event: Event, now: number = Date.now()): EventStatus {
  if (event.cancelledAt != null) return 'cancelled';
  const today = dateKey(now);
  if (today < event.startDate) return 'scheduled';
  if (today > event.endDate) return 'closed';
  return 'active';
}

export function findVenue(state: AppState, venueId: ID): Venue | undefined {
  return state.venues.find((v) => v.id === venueId);
}

export function findEvent(state: AppState, eventId: ID): Event | undefined {
  return state.events.find((e) => e.id === eventId);
}

/** Distinct calendar dates (D15) that have at least one Session under this
 * `eventId`, sorted ascending — the load-bearing computation everything
 * "Día N" derives from. Never a raw Session-row count: reopening a Session
 * the same calendar date (a lunch-break resume) doesn't add a second entry
 * here. */
export function eventSessionDateKeys(state: AppState, eventId: ID): string[] {
  const set = new Set<string>();
  for (const s of state.sessions) {
    if (s.eventId === eventId) set.add(dateKey(s.openedAt));
  }
  return Array.from(set).sort();
}

/** How many distinct calendar days this Event has actually been worked so
 * far (D15) — the "N días" component of events.md's Pasados rollup, never a
 * raw Session count. */
export function eventCompletedDays(state: AppState, eventId: ID): number {
  return eventSessionDateKeys(state, eventId).length;
}

/**
 * "Día N" for one specific calendar date under one Event (D15) — the
 * 1-based rank of `targetDateKey` among the union of this Event's existing
 * Session dates and `targetDateKey` itself. Handles both cases home.md
 * §3.6/`events.md` §3.14 need uniformly: a date with no Session yet (about
 * to become the next day, "Continuar Día N") and a date that already has one
 * (a lunch-break resume, or "Vendiendo ahora · Día N") — in the latter case
 * `targetDateKey` is already in the set, so its own established rank is
 * returned unchanged, never incremented a second time for the same date.
 */
export function dayNumberForDate(state: AppState, eventId: ID, targetDateKey: string): number {
  const dates = new Set(eventSessionDateKeys(state, eventId));
  dates.add(targetDateKey);
  const sorted = Array.from(dates).sort();
  return sorted.indexOf(targetDateKey) + 1;
}

/** Per-day rollup rows for an Event — one row per distinct worked calendar
 * date, in order, each carrying its own Día number, date, finalized Sale
 * count, and revenue. Used by `events.md` §3.14/§3.15's "Día 1 · 12 jul · 5
 * ventas · $610" rows (the consumer filters out today's own date when a
 * separate "Continuar Día N"/"Vendiendo ahora" CTA already represents it). */
export function eventDayRows(
  state: AppState,
  eventId: ID,
): { dayNumber: number; dateKey: string; sales: number; revenue: number }[] {
  const dates = eventSessionDateKeys(state, eventId);
  return dates.map((dk, i) => {
    const sessionIds = new Set(
      state.sessions.filter((s) => s.eventId === eventId && dateKey(s.openedAt) === dk).map((s) => s.id),
    );
    let sales = 0;
    let revenue = 0;
    for (const sale of state.sales) {
      if (sale.status !== 'finalized' || !sessionIds.has(sale.sessionId)) continue;
      sales += 1;
      for (const item of sale.items) revenue += item.pricePaid;
    }
    return { dayNumber: i + 1, dateKey: dk, sales, revenue };
  });
}

/** `{days, sales, revenue}` — the one-line ambient rollup reused verbatim
 * across the Pasados list card (§3.4/§3.5), the closed-detail echo (§3.16,
 * EVT-M3), and Home's own countdown text — one computation, several display
 * points, never recomputed differently at each. */
export function eventRollup(state: AppState, eventId: ID): { days: number; sales: number; revenue: number } {
  const days = eventCompletedDays(state, eventId);
  const sessionIds = new Set(state.sessions.filter((s) => s.eventId === eventId).map((s) => s.id));
  let sales = 0;
  let revenue = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized' || !sessionIds.has(sale.sessionId)) continue;
    sales += 1;
    for (const item of sale.items) revenue += item.pricePaid;
  }
  return { days, sales, revenue };
}

/** Any Session — active or closed — under this specific `eventId`, matching
 * `events.md`'s own read-side-query framing ("does NOT own Session as a
 * strict aggregate"). */
export function sessionsForEvent(state: AppState, eventId: ID): Session[] {
  return state.sessions.filter((s) => s.eventId === eventId);
}

export function activeSessionForEvent(state: AppState, eventId: ID): Session | undefined {
  return state.sessions.find((s) => s.eventId === eventId && s.status === 'active');
}

/**
 * The single `active` Event for this Business, if any — well-defined by
 * construction (D17 guarantees at most one `scheduled`/`active` Event's date
 * range overlaps another's, so at most one can ever compute `active` at
 * once).
 */
export function activeEventForBusiness(state: AppState, now: number = Date.now()): Event | undefined {
  return state.events.find((e) => eventStatus(e, now) === 'active');
}

/** The single soonest `scheduled` Event for this Business — home.md §3.5's
 * upcoming-Event card shows only this one; events.md's own Próximos section
 * is the fuller list behind it, not a duplicate mechanism. */
export function upcomingEventForBusiness(state: AppState, now: number = Date.now()): Event | undefined {
  const scheduled = state.events
    .filter((e) => eventStatus(e, now) === 'scheduled')
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return scheduled[0];
}

/** Events list, grouped exactly the way `events.md` §3.4/§3.5 render them —
 * Activo, Próximos (soonest-first), Pasados (most-recent-first, by
 * `endDate`) — a pure read of `eventStatus`, never a separately tracked list. */
export function eventsForList(
  state: AppState,
  now: number = Date.now(),
): { activo: Event[]; proximos: Event[]; pasados: Event[] } {
  const activo = state.events.filter((e) => eventStatus(e, now) === 'active');
  const proximos = state.events
    .filter((e) => eventStatus(e, now) === 'scheduled')
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const pasados = state.events
    .filter((e) => eventStatus(e, now) === 'closed')
    .sort((a, b) => b.endDate.localeCompare(a.endDate));
  return { activo, proximos, pasados };
}

/** This Event's Price Override for one Product, if any (D33) — absence
 * means "use `Product.defaultPrice`," never a stored copy of it. */
export function priceOverrideFor(state: AppState, eventId: ID, productId: ID): number | undefined {
  return state.priceOverrides.find((po) => po.eventId === eventId && po.productId === productId)?.overridePrice;
}

/**
 * home.md §3.4/§3.5/§3.6, events.md §3.14 (Architect-resolvable amendment
 * closing `architect-questions.md` Q19) — "Ya vendiste $X · N ventas hoy" /
 * "Hoy (Día N) · $X · N ventas hasta ahora." Sums `SaleItem.pricePaid` and
 * counts finalized Sales across every Session matching `eventId` (`null`
 * scopes to Quick Sessions, the identical convention `Session.eventId`
 * itself already uses) whose calendar date — read from `Sale.finalizedAt`,
 * the moment the Sale actually completed — is today. Returns `null` when
 * there are zero such Sales, so callers render nothing rather than a `"Ya
 * vendiste $0 · 0 ventas hoy"` line — the spec's own "absent in the common
 * case (first Session of the day)" rule, so the happy path stays untouched.
 * Reuses the same Session-set-by-`eventId` shape `eventDayRows`/
 * `dayNumberForDate` already scope to this `eventId` — no new query.
 */
export function todaySalesSummary(state: AppState, eventId: ID | null): { total: number; count: number } | null {
  const today = dateKey(Date.now());
  const sessionIds = new Set(state.sessions.filter((s) => s.eventId === eventId).map((s) => s.id));
  let total = 0;
  let count = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized' || !sessionIds.has(sale.sessionId)) continue;
    if (sale.finalizedAt == null || dateKey(sale.finalizedAt) !== today) continue;
    count += 1;
    for (const item of sale.items) total += item.pricePaid;
  }
  return count > 0 ? { total, count } : null;
}
