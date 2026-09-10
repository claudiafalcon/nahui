import { addDaysToKey, dateKey } from './dates';
import type {
  AllocationMovement,
  AppState,
  BusinessMembership,
  Event,
  EventAllocation,
  EventAssignment,
  ID,
  Invitation,
  InventoryUnit,
  InventoryUnitStatus,
  Product,
  Session,
  User,
  Venue,
} from './types';

/** Pure, derived reads over AppState — no mutation, mirrors domain-model.md's
 * "the merchant experiences Products, the platform preserves traceability." */

export function activeSession(state: AppState): Session | undefined {
  return state.sessions.find((s) => s.status === 'active');
}

/** Identity context (RFC 0007/D44, Slice 12) — resolves `AppState.currentUserId`
 * to its real `User` row. The one place every other selector/component
 * should read "who is verified on this device" through, rather than
 * indexing `state.users` directly. */
export function currentUser(state: AppState): User | undefined {
  return state.users.find((u) => u.id === state.currentUserId);
}

/** Any `BusinessMembership` for `(userId, businessId)`, regardless of
 * `status` — the broader lookup `home.md` §2 step 0's revoked-Membership
 * check needs (`actingMembership` below deliberately excludes a revoked row,
 * so it can never answer "is my own Membership revoked" on its own). */
export function findMembership(state: AppState, userId: ID, businessId: ID): BusinessMembership | undefined {
  return state.memberships.find((m) => m.userId === userId && m.businessId === businessId);
}

/** `context/q24-q25-first-slice.md`'s own Architecture Gap Analysis — "the
 * one primitive items 1, 2, 5, 6's 'this device's own acting Membership'
 * language all resolve through" (`architecture-principles.md` #1, "resolved
 * once, upstream"). `undefined` whenever no verified User, no Business, or
 * no currently-`active` Membership exists for that pair — every one of
 * those is a genuine pre-condition failure elsewhere in the app (Home only
 * mounts once onboarding is complete; a revoked Membership is caught by
 * `findMembership` above, one step earlier, before this selector is ever
 * consulted for role/session/attribution purposes). */
export function actingMembership(state: AppState): BusinessMembership | undefined {
  const user = currentUser(state);
  if (!user || !state.business) return undefined;
  return state.memberships.find(
    (m) => m.userId === user.id && m.businessId === state.business!.id && m.status === 'active',
  );
}

/** `home.md` §2 step 1, corrected for Slice 12's multi-staff scope — "a
 * Session active for this device's own acting Membership," the direct
 * complement step 2's own text already names itself as. Never a bare
 * business-wide `activeSession` (above) once more than one Membership can
 * concurrently hold an open Session — see `Session.openedByMembershipId`'s
 * own doc comment (`types.ts`) for why this field exists at all. */
export function myActiveSession(state: AppState, membershipId: ID): Session | undefined {
  return state.sessions.find((s) => s.status === 'active' && s.openedByMembershipId === membershipId);
}

/** Every Session this Membership has ever opened — `home.md` §3.6b's own
 * "does this device already have a signal today" check, and §3.7c's own
 * per-Membership Sale attribution, both narrow from this same set rather
 * than re-deriving it independently. */
export function sessionsOpenedBy(state: AppState, membershipId: ID): Session[] {
  return state.sessions.filter((s) => s.openedByMembershipId === membershipId);
}

/** `authentication.md` §2.2 case 0 / §2.2a step 2 — every `pending`
 * Invitation for a phone, most-recently-created first (the deterministic
 * tiebreak §2.2a step 2 itself specifies for "more than one pending
 * Invitation," rather than a picker). */
export function pendingInvitationsForPhone(state: AppState, phone: string): Invitation[] {
  return state.invitations
    .filter((inv) => inv.phone === phone && inv.status === 'pending')
    .sort((a, b) => b.createdAt - a.createdAt);
}

/** `settings.md` §3.11 "Tu equipo" — one row per active/pending/revoked
 * SELLER, in a discriminated shape the screen can switch on directly. */
export type TeamRow =
  | { kind: 'active' | 'revoked'; membership: BusinessMembership; phone: string }
  | { kind: 'pending'; invitation: Invitation };

/** `settings.md` §2.7/§3.11 "Tu equipo" — every Invitation/Membership row
 * for this Business, in the document's own stated display order (active →
 * pending → revoked, by date within each group). Membership rows exclude
 * OWNER (there is exactly one, never listed alongside her own team). */
export function teamRows(state: AppState, businessId: ID): TeamRow[] {
  const memberRows = state.memberships
    .filter((m) => m.businessId === businessId && m.role === 'SELLER')
    .map((membership) => ({
      kind: membership.status,
      membership,
      phone: state.users.find((u) => u.id === membership.userId)?.phone ?? '',
    }));
  const active = memberRows.filter((r) => r.kind === 'active').sort((a, b) => a.membership.createdAt - b.membership.createdAt);
  const revoked = memberRows.filter((r) => r.kind === 'revoked').sort((a, b) => a.membership.createdAt - b.membership.createdAt);
  const pending: TeamRow[] = state.invitations
    .filter((inv) => inv.businessId === businessId && inv.status === 'pending')
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((invitation) => ({ kind: 'pending', invitation }));
  return [...active, ...pending, ...revoked];
}

/** `settings.md` §3.3a — "N personas vendiendo contigo," `active`-status
 * SELLER Memberships only (a pending invitation or a revoked row doesn't
 * count). */
export function activeTeamCount(state: AppState, businessId: ID): number {
  return state.memberships.filter((m) => m.businessId === businessId && m.role === 'SELLER' && m.status === 'active')
    .length;
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

/** Asignar Tags (`inventory.md` §3.14-§3.17, Migration Workflow D43). Every
 * selector below reads `InventoryUnit.tagId` live, every call — never
 * cached/snapshotted (§2 step 2's own business-wide gate): a merchant can
 * defer tagging (§3.17), sell some of those same untagged units via FIFO in
 * buttons mode in the meantime (`addItemToSale`), then resume — a consumed
 * unit (`status` no longer `'available'`) must silently drop out of the
 * queue, which falls out for free from the filter below as long as nothing
 * caches the result. */

/** The live tagging queue itself — every `available`, untagged unit, in
 * `state.units`' own array order (the order she entered them, `inventory.md`
 * §3.14's own "in the order she entered them" requirement — no separate
 * ordering field needed). Scoped globally across every Lot/Product, never to
 * one Lot, per the Architecture Gap Analysis's own confirmation against §2
 * step 2's business-wide gate. */
export function pendingTagUnits(state: AppState): InventoryUnit[] {
  return state.units.filter((u) => u.status === 'available' && u.tagId == null);
}

/** §2 step 2 / §3.5's own gate — "how many articles are left to tag." */
export function pendingTagCount(state: AppState): number {
  return pendingTagUnits(state).length;
}

/** Per-Product breakdown of the live tagging queue, grouped in the order
 * each Product first appears in it (mirrors `pendingTagUnits`' own queue
 * order, per-unit, collapsed to one row per Product) — drives §3.14's "Lo
 * que registraste: Bolsas (10) · Accesorios (5)" summary line and, via its
 * first entry, "Etiquetando: Bolsas / Faltan 7 de 10." */
export function pendingTagBreakdown(state: AppState): { product: Product; count: number }[] {
  const order: ID[] = [];
  const counts = new Map<ID, number>();
  for (const unit of pendingTagUnits(state)) {
    if (!counts.has(unit.productId)) order.push(unit.productId);
    counts.set(unit.productId, (counts.get(unit.productId) ?? 0) + 1);
  }
  return order
    .map((productId) => {
      const product = state.products.find((p) => p.id === productId);
      return product ? { product, count: counts.get(productId)! } : null;
    })
    .filter((row): row is { product: Product; count: number } => row != null);
}

/** `decision-log.md` D27 — `nfc` capability derives from `subscriptionTier`
 * alone, never from kit/code activation. Gates whether "Assign Tags" exists
 * at all in Inventario (`inventory.md` §2's own capability check) — a
 * Business-level fact, independent of any single Session's resolved
 * `Session.operatingMode` (*architecture-principles.md* #1). */
export function nfcCapable(state: AppState): boolean {
  return state.business?.subscriptionTier === 'paid';
}

/** NFC Selling pass (Migration Workflow D43, `home.md` §2's "NFC Readiness
 * sub-step, folded into Session-start," `decision-log.md` D23). Distinct
 * from, and checked independently of, `nfcCapable` above — a Business can be
 * `nfc`-capable (Paid tier) with zero tagged stock (Not Ready), and §3.6a
 * treats "capability revoked" as a separate Session-start trigger from
 * readiness itself. */

/** How many currently-sellable units already carry an assigned tag —
 * `taggedAvailableCount` in the Architecture Gap Analysis's own naming. */
export function taggedAvailableCount(state: AppState): number {
  return state.units.filter((u) => u.status === 'available' && u.tagId != null).length;
}

/** Every currently-sellable unit, tagged or not — `taggedAvailableCount` plus
 * `pendingTagCount` (the live untagged queue above), never a second,
 * independently-derived count of `state.units`. */
export function totalAvailableCount(state: AppState): number {
  return taggedAvailableCount(state) + pendingTagCount(state);
}

/**
 * Disclosed, illustrative constant (`decision-log.md` D23: the readiness
 * threshold is "a configurable product/business rule, not hard-coded into
 * the Foundation") — never surfaced to Ana as a number or percentage
 * anywhere in the UI (`home.md` §3.6a's own explicit rule: "the readiness
 * threshold itself stays invisible to Ana"). 0.8 (80% of sellable stock
 * already tagged) is this build's own illustrative choice, not a Product
 * Owner-set business rule — a future pass may make this a real Configuración
 * value without changing anything about how `nfcReadiness` below consumes it.
 */
export const NFC_READINESS_THRESHOLD = 0.8;

export type NfcReadiness = 'ready' | 'limited' | 'not-ready';

/** `home.md` §2's own three-way resolution: zero tagged sellable stock is
 * always Not Ready regardless of how much is still pending; otherwise
 * Ready/Limited Ready is a pure threshold comparison against
 * `NFC_READINESS_THRESHOLD` above. */
export function nfcReadiness(state: AppState): NfcReadiness {
  const tagged = taggedAvailableCount(state);
  if (tagged === 0) return 'not-ready';
  const total = totalAvailableCount(state);
  if (total === 0) return 'not-ready'; // defensive — unreachable when tagged > 0
  return tagged / total >= NFC_READINESS_THRESHOLD ? 'ready' : 'limited';
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

/**
 * `product/99-rfc/0011-event-assignment.md` §2's own "Mechanism" —
 * scheduling-conflict handling, warn-with-override (`decision-log.md` D60).
 * Checks every existing `EventAssignment` row for `membershipId` (excluding
 * `newEventId` itself) and returns the Event(s) whose date range overlaps
 * `newEventId`'s own range — the same inclusive-range overlap test D17/D53's
 * own mechanism already used (`event.startDate <= other.endDate &&
 * other.startDate <= event.endDate`), rewritten fresh rather than reused
 * verbatim: D53 deleted that D17-era helper outright, so there's nothing left
 * to import.
 *
 * **Returns the conflicting Event(s), never a bare boolean** — the
 * OWNER-side "assign staff to an Event" UI,
 * `src/screens/Events/PersonalParaEsteEvento.tsx`, needs to name the
 * conflicting Event in its own warning copy, per this pass's own dispatching
 * task. **Purely a read-side check — never blocks anything itself.**
 * `createEventAssignment` (`store.tsx`) never consults this;
 * `PersonalParaEsteEvento.tsx` is the caller that calls this ahead of that
 * write and decides whether to surface a warning, exactly as RFC 0011 §2
 * describes ("surfaces as a warning the assigning OWNER may override, never
 * a hard rejection").
 */
export function hasSchedulingConflict(state: AppState, membershipId: ID, newEventId: ID): Event[] {
  const newEvent = findEvent(state, newEventId);
  if (!newEvent) return [];
  const otherAssignedEventIds = eventAssignmentsForMembership(state, membershipId)
    .map((a) => a.eventId)
    .filter((eventId) => eventId !== newEventId);
  const conflicts: Event[] = [];
  for (const eventId of otherAssignedEventIds) {
    const other = findEvent(state, eventId);
    if (!other) continue;
    if (newEvent.startDate <= other.endDate && other.startDate <= newEvent.endDate) {
      conflicts.push(other);
    }
  }
  return conflicts;
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
 * Every currently-`active` Event for this Business — **corrected for Slice
 * 12** (`decision-log.md` D53 superseded D17's single-active-Event
 * restriction; `product-decisions.md` Q24/Q25 confirms simultaneous
 * multi-Event operation is a real, supported case now). Previously
 * singular (`activeEventForBusiness`, returning at most one Event "well-
 * defined by construction" under D17's own overlap guarantee) — that
 * guarantee no longer holds, so this selector is now plural; `home.md` §2
 * steps 2a/2b branch on its length (`HomeScreen.tsx`).
 */
export function activeEventsForBusiness(state: AppState, now: number = Date.now()): Event[] {
  return state.events.filter((e) => eventStatus(e, now) === 'active');
}

/** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — every
 * `EventAssignment` row for this Membership, regardless of the assigned
 * Event's current computed status (a closed/cancelled Event's own row is
 * filtered out downstream, by `qualifyingEventsForMembership` below, not
 * here — this selector is the raw, unfiltered set). */
export function eventAssignmentsForMembership(state: AppState, membershipId: ID): EventAssignment[] {
  return state.eventAssignments.filter((a) => a.membershipId === membershipId);
}

/** The `eventId` set from `eventAssignmentsForMembership` above, as a `Set`
 * for O(1) membership tests — shared by `qualifyingEventsForMembership` and
 * `upcomingQualifyingEventForMembership` below, which otherwise each built
 * this identically (reviewer Suggestion, 2026-09-10). */
function assignedEventIdSet(state: AppState, membershipId: ID): Set<ID> {
  return new Set(eventAssignmentsForMembership(state, membershipId).map((a) => a.eventId));
}

/**
 * `home.md` §2 step 2, role-scoped (`product/99-rfc/0011-event-assignment.md`,
 * `decision-log.md` D60) — the qualifying-Event set `HomeScreen.tsx` feeds
 * into steps 2a/2b. **OWNER: unchanged** — every currently `active` Event,
 * Business-wide, no `EventAssignment` gate (RFC 0011 Open Item 2 — an OWNER
 * has never needed to be "assigned" to her own Business's Events). **SELLER:
 * narrowed** to only Events with `status = active` for which an
 * `EventAssignment` row exists naming this Membership — the Business's full
 * active-Event set is never consulted for a SELLER through this path (RFC
 * 0011 Open Item 1, Resolved). Zero qualifying Events for a SELLER is not a
 * separate case here — it falls out of this same filter returning `[]`,
 * exactly like the zero-active-Event case already does for either role.
 */
export function qualifyingEventsForMembership(
  state: AppState,
  membership: BusinessMembership,
  now: number = Date.now(),
): Event[] {
  const active = activeEventsForBusiness(state, now);
  if (membership.role === 'OWNER') return active;
  const assignedEventIds = assignedEventIdSet(state, membership.id);
  return active.filter((e) => assignedEventIds.has(e.id));
}

/** Every currently-`scheduled` Event for this Business — the `scheduled`-case
 * mirror of `activeEventsForBusiness` above, needed as its own plural
 * selector (not just `upcomingEventForBusiness`'s single soonest row) so
 * `HomeScreen.tsx` can test "does the Business have 1+ Event scheduled
 * elsewhere" independently of which one, if any, is soonest — the same
 * distinction `activeEventsForBusiness`/`qualifyingEventsForMembership`
 * already draw for the `active` case (`home.md` §2 step 3, 2026-09-10
 * amendment, completing `product/99-rfc/0011-event-assignment.md`'s
 * SELLER-narrowing pattern for the `scheduled` lifecycle stage). */
export function scheduledEventsForBusiness(state: AppState, now: number = Date.now()): Event[] {
  return state.events.filter((e) => eventStatus(e, now) === 'scheduled');
}

/** The single soonest `scheduled` Event for this Business — home.md §3.5's
 * upcoming-Event card shows only this one; events.md's own Próximos section
 * is the fuller list behind it, not a duplicate mechanism. **OWNER-only as
 * of the 2026-09-10 amendment** — Business-wide, no `EventAssignment` gate,
 * unchanged (RFC 0011 Open Item 2's reasoning, identical to
 * `qualifyingEventsForMembership`'s own OWNER branch). A SELLER's own
 * upcoming-Event resolution is `upcomingQualifyingEventForMembership`
 * below, never this selector. */
export function upcomingEventForBusiness(state: AppState, now: number = Date.now()): Event | undefined {
  const scheduled = scheduledEventsForBusiness(state, now)
    .slice()
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return scheduled[0];
}

/**
 * `home.md` §2 step 3 / §3.5, role-scoped for a SELLER
 * (`product/99-rfc/0011-event-assignment.md`'s own SELLER-narrowing
 * pattern, extended to the `scheduled` case, 2026-09-10 — a
 * `merchant-user-tester`-found defect, `architect`-confirmed as completing
 * RFC 0011's own established pattern rather than a new product decision).
 * The soonest `scheduled` Event this Membership holds an `EventAssignment`
 * for — the `scheduled`-lifecycle-stage mirror of
 * `qualifyingEventsForMembership`'s SELLER branch (§2 step 2), narrowed
 * further to a single row the same way `upcomingEventForBusiness` narrows
 * the OWNER's own Business-wide set to one. `undefined` when zero qualifying
 * rows exist — not a separate case, the same "falls through" shape §2 step 2
 * already establishes for the `active` case; `HomeScreen.tsx` is the caller
 * that decides what renders instead (the card, when this resolves; the new
 * "scheduled elsewhere, not assigned" passive line, §3.4, when it doesn't
 * but `scheduledEventsForBusiness` above is non-empty; neither otherwise).
 * **A SELLER with 2+ qualifying rows sees only this single soonest one**
 * (`Event.startDate` ascending, the identical deterministic tiebreak §3.6b's
 * own row order already uses) — reasoned in full at `home.md` §10, not left
 * open: purely informational (unlike §3.6b's actual picker, nothing here
 * commits her to a choice), self-correcting on the very next Home open once
 * this row's own status advances past `scheduled`, and matches the OWNER's
 * own card's pre-existing, already-accepted multiplicity behavior. */
export function upcomingQualifyingEventForMembership(
  state: AppState,
  membership: BusinessMembership,
  now: number = Date.now(),
): Event | undefined {
  const assignedEventIds = assignedEventIdSet(state, membership.id);
  const qualifying = scheduledEventsForBusiness(state, now)
    .filter((e) => assignedEventIds.has(e.id))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  return qualifying[0];
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

/** Slice 12 (`events.md` §3.21, `product-decisions.md` Q24/Q25) — this
 * Event's `open` EventAllocation for one Product, if any. Absence means "no
 * allocation exists for this pair" — the plain Business-wide pool applies,
 * unaffected (`home.md` §3.8a's own "a Product with no EventAllocation
 * still resolves from the general pool exactly as today" rule). */
export function eventAllocationFor(state: AppState, eventId: ID, productId: ID): EventAllocation | undefined {
  return state.eventAllocations.find((a) => a.eventId === eventId && a.productId === productId && a.status === 'open');
}

/** RFC 0010/D59 §3 — the read-time derivation that replaces the old, now-
 * retired *stored* `EventAllocation.quantityRemaining` field: the count of
 * this allocation's `allocatedUnitIds` entries whose referenced
 * `InventoryUnit` is currently still `status='reserved'`. Always correct by
 * construction — there is no longer a second, independently-writable number
 * that can drift from the real committed set (the exact confirmed defect
 * this RFC closes). The identical candidate-selection logic
 * `store.tsx`'s `releaseAllocation()` performs to find its own release
 * pool — this selector and that pool are the same query, read-only here. */
export function quantityRemaining(state: AppState, allocation: EventAllocation): number {
  return allocation.allocatedUnitIds.filter((id) => {
    const unit = state.units.find((u) => u.id === id);
    return unit?.status === 'reserved';
  }).length;
}

/** `events.md` §3.16's closed-Event reconciliation section — every `open`
 * `EventAllocation` for this Event, regardless of whether it still has any
 * `reserved` unit outstanding (callers filter on `quantityRemaining` > 0
 * themselves, per that section's own trigger condition). */
export function openEventAllocationsForEvent(state: AppState, eventId: ID): EventAllocation[] {
  return state.eventAllocations.filter((a) => a.eventId === eventId && a.status === 'open');
}

/** `events.md` §3.16's "Ya revisaste esto — todavía falta N" framing — a
 * plain existence check against the already-written ledger (RFC 0010 §6/§8):
 * has this manual/untagged `EventAllocation` ever had a
 * `return_to_general`-typed, `fifo_assignment`-sourced reconciliation write
 * against it before? States no precise historical split (never "2 of 3
 * already confirmed") — only that she's reviewed this row before. */
export function hasPriorFifoReconciliation(state: AppState, eventAllocationId: ID): boolean {
  return state.allocationMovements.some(
    (m) => m.eventAllocationId === eventAllocationId && m.type === 'return_to_general' && m.unitSource === 'fifo_assignment',
  );
}

/** RFC 0010/D59 — `reviewer`-caught Blocker fix (`cancelSale`/`removeSaleItem`
 * previously reverted a unit to `reserved` on the basis of bare
 * `allocatedUnitIds` array membership alone, which can't distinguish
 * "genuinely still committed to this allocation" from "was committed once,
 * released, and is now free again" — `allocatedUnitIds` is append-only and
 * never pruned, §11). The sound derivation is the most recent
 * `AllocationMovement` — across every `EventAllocation`, in write order —
 * whose `unitIds` includes this unit. `state.allocationMovements` is
 * append-only (`store.tsx`'s `commitAllocation`/`releaseAllocation` only
 * ever append, never reorder or remove a row), so array order already *is*
 * chronological write order — reading from the end and taking the first
 * match is exact, no `createdAt` tie-breaking needed. `undefined` means this
 * unit never went through allocation machinery at all (never committed via
 * `commitAllocation`, e.g. plain Business-wide FIFO/Quick-Sale stock). */
export function mostRecentAllocationMovementForUnit(state: AppState, unitId: ID): AllocationMovement | undefined {
  for (let i = state.allocationMovements.length - 1; i >= 0; i -= 1) {
    const movement = state.allocationMovements[i];
    if (movement.unitIds.includes(unitId)) return movement;
  }
  return undefined;
}

const COMMIT_MOVEMENT_TYPES: ReadonlyArray<AllocationMovement['type']> = [
  'initial_allocation',
  'replenish',
  'reallocate_in',
];

/** RFC 0010/D59 — the corrected `cancelSale`/`removeSaleItem` revert target
 * for one Sale-item unit, built on `mostRecentAllocationMovementForUnit`
 * above. `'reserved'` only when this unit's most recent allocation-ledger
 * movement is commit-typed (`initial_allocation`/`replenish`/`reallocate_in`
 * — its most recent allocation-related action was a commitment) *and* that
 * movement's own `EventAllocation` is still `status='open'` (genuinely still
 * committed to that specific allocation, not one already reconciled out from
 * under it). `'available'` in every other case: a release-typed most-recent
 * movement (`adjustment`/`return_to_general`/`reallocate_out` — this unit's
 * most recent action was a release, regardless of stale `allocatedUnitIds`
 * membership elsewhere), a commit-typed movement whose allocation is no
 * longer `open`, or no ledger movement at all (never went through allocation
 * machinery — unaffected, the same `'available'` outcome this file always
 * produced before RFC 0010/D59). */
export function saleCancelRevertStatus(state: AppState, unitId: ID): InventoryUnitStatus {
  const movement = mostRecentAllocationMovementForUnit(state, unitId);
  if (!movement || !COMMIT_MOVEMENT_TYPES.includes(movement.type)) return 'available';
  const allocation = state.eventAllocations.find((a) => a.id === movement.eventAllocationId);
  return allocation && allocation.status === 'open' ? 'reserved' : 'available';
}

/** `events.md` §3.21 — "Disponible en general": Business-wide `available`
 * stock for this Product, plus this Event's own already-committed units
 * (hers to freely reassign within this screen, "not elsewhere," §3.21's own
 * annotation) — which is what makes the manual stepper's ceiling exactly
 * equal to this figure. **Corrected, RFC 0010/D59:** no longer subtracts
 * every *other* open EventAllocation's committed count — once
 * `commitAllocation()` genuinely flips committed units to `reserved`,
 * `availableCount()` already excludes every committed unit, from any Event;
 * subtracting again would double-subtract and silently undercount the
 * merchant-facing ceiling. Adds back only *this* Event's own currently-
 * reserved units instead of subtracting every other Event's. */
export function disponibleEnGeneral(state: AppState, eventId: ID, productId: ID): number {
  const businessWide = availableCount(state, productId);
  const thisEventAllocation = eventAllocationFor(state, eventId, productId);
  const thisEventOwnRemaining = thisEventAllocation ? quantityRemaining(state, thisEventAllocation) : 0;
  return Math.max(0, businessWide + thisEventOwnRemaining);
}

/** `home.md` §3.9's own new Event-scoped tile line ("N en este evento") —
 * `null` when no open EventAllocation applies (the tile shows nothing extra,
 * the Business-wide pool governs as always). **Corrected, RFC 0010/D59:**
 * reads the derived `quantityRemaining` selector above, never a stored field
 * (`home.md` §3.9's own annotation — the "not a live lock" caveat is
 * unaffected, independent of the storage mechanism). */
export function eventScopedRemaining(state: AppState, eventId: ID | null, productId: ID): number | null {
  if (eventId == null) return null;
  const allocation = eventAllocationFor(state, eventId, productId);
  return allocation ? quantityRemaining(state, allocation) : null;
}

/** `home.md` §3.7c "Mi actividad de hoy" — this acting Membership's own
 * finalized Sales today, scoped to the same `eventId` context §3.7's own
 * ambient header already uses (`null` for a Quick Session) — "the identical
 * `todaySalesSummary`-shaped query... one more `WHERE` clause, not a second
 * query built from scratch." Row order: chronological, most-recent-last. */
export function myActivityToday(
  state: AppState,
  membershipId: ID,
  eventId: ID | null,
): { total: number; count: number; rows: { time: number; total: number; itemCount: number }[] } {
  const today = dateKey(Date.now());
  const sessionIds = new Set(state.sessions.filter((s) => s.eventId === eventId).map((s) => s.id));
  let total = 0;
  const rows: { time: number; total: number; itemCount: number }[] = [];
  for (const sale of state.sales) {
    if (sale.status !== 'finalized' || !sessionIds.has(sale.sessionId)) continue;
    if (sale.performedByMembershipId !== membershipId) continue;
    if (sale.finalizedAt == null || dateKey(sale.finalizedAt) !== today) continue;
    const saleTotal = sale.items.reduce((sum, item) => sum + item.pricePaid, 0);
    total += saleTotal;
    rows.push({ time: sale.finalizedAt, total: saleTotal, itemCount: sale.items.length });
  }
  rows.sort((a, b) => a.time - b.time);
  return { total, count: rows.length, rows };
}
