import { addDaysToKey, dateKey } from './dates';
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
 * selling grid's most-frequently-sold-first ordering (home.md §3.9).
 * Exported (Resultados pass, D43) so `topProductsAllTime` below reuses this
 * exact per-Product count rather than reimplementing it — reports.md's own
 * instruction ("sellingGridRows's internal per-product sales-count logic
 * already computes this per product — expose/reuse it"). */
export function salesCount(state: AppState, productId: ID): number {
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

/** Resultados (`product/02-ux/reports.md`, Migration Workflow D43) — every
 * selector below is a pure, read-only derivation over `AppState`, exactly
 * the same discipline as everything above. No new domain-model field or
 * write path — reports.md is a read-only slice (§1) except for §3.17/§3.18's
 * "Confirmar recompensa entregada" write, explicitly out of scope for this
 * build per the dispatching task (structurally unreachable — `Customer`/
 * `Claim` don't exist anywhere in this domain layer). */

/** §2 step 1's cold-start gate — "has any Session ever reached status =
 * closed," distinct from "an active Session exists" (`activeSession` above
 * answers a different question). */
export function hasAnyClosedSession(state: AppState): boolean {
  return state.sessions.some((s) => s.status === 'closed');
}

/** "Total histórico" (§3.4/§3.5/§3.6) — sum/count of `SaleItem.pricePaid`
 * across every finalized Sale this Business has ever recorded, all-time, no
 * Session/Event scoping. `sessionTotals` above is the identical computation
 * scoped to one Session; this is its all-time-scoped sibling, needed because
 * no existing selector sums across every Session at once. */
export function allTimeTotals(state: AppState): { revenue: number; count: number } {
  let revenue = 0;
  let count = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized') continue;
    count += 1;
    for (const item of sale.items) revenue += item.pricePaid;
  }
  return { revenue, count };
}

/** "Top productos · todo tu historial" (§3.4/§3.5/§3.6) — every Product with
 * ≥1 finalized SaleItem ever, ranked by piece count descending. Reuses
 * `salesCount` (the exact per-Product logic `sellingGridRows` already
 * computes) rather than re-deriving it — the one all-time-scope difference
 * is `sellingGridRows`'s own tie-break-by-registration-order and
 * zero-count rows, neither of which this ranked, filtered list needs. */
export function topProductsAllTime(state: AppState): { product: Product; count: number }[] {
  return state.products
    .map((product) => ({ product, count: salesCount(state, product.id) }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count);
}

/** Per-Product SaleItem counts within one Session (§3.7's "Por producto") —
 * `sessionTotals` only gives revenue/count, never a per-Product axis. Rows
 * ordered by Product registration order (`catalogRows`'s own convention),
 * not by count — §3.7's own wireframe example ("Bolsas 5, Accesorios 2,
 * Playeras 3") isn't itself count-sorted, so this doesn't invent a ranking
 * the spec never asked for. */
export function sessionProductBreakdown(state: AppState, sessionId: ID): { product: Product; count: number }[] {
  const counts = new Map<ID, number>();
  for (const sale of state.sales) {
    if (sale.sessionId !== sessionId || sale.status !== 'finalized') continue;
    for (const item of sale.items) counts.set(item.productId, (counts.get(item.productId) ?? 0) + 1);
  }
  return state.products
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .filter((p) => counts.has(p.id))
    .map((p) => ({ product: p, count: counts.get(p.id)! }));
}

/** Same per-Product breakdown as above, summed across every Session sharing
 * this `eventId` (§3.8's "Por producto (todo el evento)") — the identical
 * cross-Session union `eventRollup`/`eventDayRows` already build, extended
 * with the one extra axis (Product) they don't carry. */
export function eventProductBreakdown(state: AppState, eventId: ID): { product: Product; count: number }[] {
  const sessionIds = new Set(state.sessions.filter((s) => s.eventId === eventId).map((s) => s.id));
  const counts = new Map<ID, number>();
  for (const sale of state.sales) {
    if (!sessionIds.has(sale.sessionId) || sale.status !== 'finalized') continue;
    for (const item of sale.items) counts.set(item.productId, (counts.get(item.productId) ?? 0) + 1);
  }
  return state.products
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .filter((p) => counts.has(p.id))
    .map((p) => ({ product: p, count: counts.get(p.id)! }));
}

export type HistorialRow =
  | { kind: 'event'; sortKey: string; event: Event }
  | { kind: 'quick-session'; sortKey: string; session: Session };

/** §2 step 2 / §3.4-§3.6's "Historial" — every closed Event (one rollup row
 * each, reusing `eventsForList`'s own `pasados`, already status-filtered and
 * sorted) merged with every standalone closed Quick Session (`eventId ===
 * null`), most-recent-first. `sortKey` is each row's own comparable date —
 * an Event's `endDate`, a Quick Session's closed (or opened, defensively)
 * calendar date — so a single `localeCompare` sort interleaves both kinds
 * correctly instead of needing two separately-rendered lists. */
export function historialRows(state: AppState): HistorialRow[] {
  const { pasados } = eventsForList(state);
  const eventRows: HistorialRow[] = pasados.map((event) => ({ kind: 'event', sortKey: event.endDate, event }));
  const quickSessionRows: HistorialRow[] = state.sessions
    .filter((s) => s.eventId === null && s.status === 'closed')
    .map((session) => ({
      kind: 'quick-session',
      sortKey: dateKey(session.closedAt ?? session.openedAt),
      session,
    }));
  return [...eventRows, ...quickSessionRows].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
}

/** §3.4's "En curso" — one entry per still-`active` Event, each carrying
 * only the Día rows whose Session has actually *closed* (never today's row
 * while a Session for today is still open — the same "today's date is
 * represented by a separate ambient line, not a tappable row" rule
 * `EventDetail.tsx`'s own active-Event body already applies) plus that
 * Día's specific `sessionId`, the tap-through target for Session detail
 * (§3.7, §4: "tap an 'En curso' Día row → Session detail"). Reuses
 * `eventDayRows`'s own per-day sales/revenue aggregation rather than
 * re-deriving it — adds only the one field it doesn't carry.
 *
 * **Disclosed judgment call — same-calendar-date reopen.** If a date has more
 * than one *closed* Session (a lunch-break resume, closed twice the same
 * day), the most-recently-closed one is used as that Día's representative
 * Session — Session detail is inherently per-Session, and `eventDayRows`
 * itself already aggregates across Sessions per day, so some choice is
 * needed here; this extends Q1's own already-acknowledged "Día N counting"
 * ambiguity (`product/02-ux/product-decisions.md` Q1) rather than
 * introducing a new one. An Event with zero closed Días yet (just started,
 * still selling) is omitted from the result entirely — nothing to review
 * yet, consistent with "nothing here is a dead end" never meaning "show an
 * empty card."
 */
export function enCursoRows(
  state: AppState,
): { event: Event; dayRows: { dayNumber: number; dateKey: string; sales: number; revenue: number; sessionId: ID }[] }[] {
  const activeEvents = state.events.filter((e) => eventStatus(e) === 'active');
  return activeEvents
    .map((event) => {
      const rows = eventDayRows(state, event.id)
        .filter(
          (r) => !state.sessions.some((s) => s.eventId === event.id && s.status === 'active' && dateKey(s.openedAt) === r.dateKey),
        )
        .map((r) => {
          const sessionId = sessionIdForEventDate(state, event.id, r.dateKey);
          return sessionId ? { ...r, sessionId } : null;
        })
        .filter((r): r is { dayNumber: number; dateKey: string; sales: number; revenue: number; sessionId: ID } => r != null);
      return { event, dayRows: rows };
    })
    .filter((e) => e.dayRows.length > 0);
}

/** The most-recently-closed Session under `eventId` on one specific calendar
 * date — the same resolution `enCursoRows` above uses internally, exposed
 * standalone for Event detail's own Día rows (§3.8: "Día rows are tappable
 * → Session detail (§3.7) for that specific day"), which need it outside
 * the `enCursoRows`/active-Event context (a closed Event's Día rows are
 * never "en curso"). `undefined` when no Session ever closed on that date —
 * defensive; every date `eventDayRows` produces has ≥1 Session by
 * construction, so this is never actually hit through the real UI. */
export function sessionIdForEventDate(state: AppState, eventId: ID, targetDateKey: string): ID | undefined {
  const closedForDate = state.sessions
    .filter((s) => s.eventId === eventId && s.status === 'closed' && dateKey(s.openedAt) === targetDateKey)
    .sort((a, b) => (a.closedAt ?? 0) - (b.closedAt ?? 0));
  return closedForDate[closedForDate.length - 1]?.id;
}

/** "Rendimiento por bazar" (§3.9) — one row per Venue, `$ promedio/día`
 * descending. Reuses the identical "sum `SaleItem.pricePaid` across every
 * finalized Sale in a closed Session" computation `eventRollup` already
 * performs, grouped by `venueId` instead of `eventId` (reports.md's own
 * instruction). `eventCount` only counts Events that actually produced ≥1
 * closed Session — a `scheduled` Event with nothing sold yet would otherwise
 * inflate a Venue's "N eventos" with zero contribution to its own
 * `avgPerDay`, which this all-time performance view has no reason to show. */
export function venuePerformance(
  state: AppState,
): { venue: Venue; eventCount: number; sessionCount: number; revenue: number; avgPerDay: number }[] {
  const rows: { venue: Venue; eventCount: number; sessionCount: number; revenue: number; avgPerDay: number }[] = [];
  for (const venue of state.venues) {
    const venueEvents = state.events.filter((e) => e.venueId === venue.id);
    let revenue = 0;
    let sessionCount = 0;
    let eventCount = 0;
    for (const event of venueEvents) {
      const closedSessions = state.sessions.filter((s) => s.eventId === event.id && s.status === 'closed');
      if (closedSessions.length === 0) continue;
      eventCount += 1;
      sessionCount += closedSessions.length;
      const sessionIds = new Set(closedSessions.map((s) => s.id));
      for (const sale of state.sales) {
        if (sale.status !== 'finalized' || !sessionIds.has(sale.sessionId)) continue;
        for (const item of sale.items) revenue += item.pricePaid;
      }
    }
    if (eventCount === 0) continue;
    rows.push({ venue, eventCount, sessionCount, revenue, avgPerDay: Math.round(revenue / sessionCount) });
  }
  return rows.sort((a, b) => b.avgPerDay - a.avgPerDay);
}

/** §3.11's "detalle de bazar" — Historial filtered to one Venue's closed
 * Events only (Quick Sessions never appear here, same as they never
 * contribute to `venuePerformance`'s own aggregate — a Quick Session has no
 * `eventId`, and therefore no Venue). Reuses `eventsForList`'s own `pasados`
 * rather than re-deriving the closed-status filter. */
export function venueHistorialRows(state: AppState, venueId: ID): Event[] {
  return eventsForList(state).pasados.filter((e) => e.venueId === venueId);
}

function mondayOfWeek(targetDateKey: string): string {
  const [y, m, d] = targetDateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay(); // 0 = Sunday … 6 = Saturday
  const diffToMonday = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diffToMonday);
  return dateKey(date.getTime());
}

/**
 * §3.4's sales-trend headline statement ("esta semana vendiste N ventas
 * menos/más que la semana pasada") — a genuinely new aggregation reports.md
 * itself leaves as "a read-side computation detail, not specified at this
 * fidelity" (§3.4's own annotation). **Disclosed judgment call:** weeks are
 * Monday-first calendar weeks (not a rolling trailing-7-days window) — the
 * calendar week a Mexican merchant would actually recognize by name ("esta
 * semana"), computed from `Sale.finalizedAt` (the same moment
 * `todaySalesSummary` already reads for its own "hoy" scoping) via
 * `dateKey`, never re-priced or re-derived.
 *
 * **Graceful omission, not a fabricated comparison** (§3.4's own explicit
 * rule): if Ana's very first closed Session postdates last week's Sunday —
 * i.e. she wasn't using Nahui at all last week — this returns `null` rather
 * than comparing this week against a week she never had, mirroring the same
 * restraint `venuePerformance`'s empty state and §3.10 already apply to "no
 * fabricated venue data."
 */
export function salesTrend(state: AppState, now: number = Date.now()): { thisWeek: number; lastWeek: number } | null {
  const closedSessionDateKeys = state.sessions.filter((s) => s.status === 'closed').map((s) => dateKey(s.openedAt));
  if (closedSessionDateKeys.length === 0) return null;
  const earliestSessionDateKey = closedSessionDateKeys.sort()[0];

  const todayKey = dateKey(now);
  const thisMonday = mondayOfWeek(todayKey);
  const lastMonday = addDaysToKey(thisMonday, -7);
  const lastSunday = addDaysToKey(thisMonday, -1);

  if (earliestSessionDateKey > lastSunday) return null; // she wasn't active yet last week

  let thisWeek = 0;
  let lastWeek = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized' || sale.finalizedAt == null) continue;
    const dk = dateKey(sale.finalizedAt);
    if (dk >= thisMonday && dk <= todayKey) thisWeek += 1;
    else if (dk >= lastMonday && dk <= lastSunday) lastWeek += 1;
  }
  return { thisWeek, lastWeek };
}
