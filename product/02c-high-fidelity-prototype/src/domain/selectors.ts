import { addDaysToKey, dateKey } from './dates';
import type {
  AppState,
  Business,
  BusinessMembership,
  Event,
  EventAllocation,
  EventAllocationUnit,
  EventAssignment,
  ID,
  Invitation,
  InventoryUnit,
  MembershipRole,
  Product,
  SaleItem,
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

/** RFC 0012/D62-63 — resolves a User's own phone-type `AuthIdentity`
 * identifier, if any. The one place every pre-amendment `User.phone` read
 * now resolves through, since `User` itself no longer carries a `phone`
 * field directly (`AuthIdentity` does — see that type's own doc comment).
 * `''` when absent — the same safe fallback every pre-amendment call site
 * already used; genuinely reachable now for a real Google/Email-only
 * merchant (`authentication.md` §8 item 12/Future Considerations — a real,
 * flagged, not-yet-designed gap in `settings.md`'s own "Tu cuenta" display,
 * not something this dispatch's domain-layer fix invents or resolves). */
export function phoneIdentifierFor(state: AppState, userId: ID): string {
  return state.authIdentities.find((a) => a.userId === userId && a.type === 'phone')?.identifier ?? '';
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

/**
 * `reports.md` §2/§3.4a ("Vendiendo ahorita," `decision-log.md` D68) — a
 * **Business-wide, cross-Session, cross-device read**: every Session with
 * `status = 'active'` right now, regardless of which Membership opened it or
 * which device it's running on. Deliberately **not** `myActiveSession`
 * above, which is Membership-scoped — the wrong shape here, since this check
 * has to surface every OWNER's and every SELLER's Session at once (§1's own
 * motivating scenario: "an OWNER at home with three SELLERs each actively
 * selling, wanting to check in without interrupting anyone"). No explicit
 * `businessId` parameter — this prototype's `AppState` is implicitly
 * single-Business, the same convention `activeEventsForBusiness` below
 * already follows for an identical "ForBusiness" read. Sorted
 * most-recently-opened-first (§3.4a's own explicit sort rule — "never
 * Ana-sorted"), never re-sorted by the caller.
 */
export function activeSessionsForBusiness(state: AppState): Session[] {
  return state.sessions.filter((s) => s.status === 'active').sort((a, b) => b.openedAt - a.openedAt);
}

/**
 * `reports.md` §3.4a — resolves a `Session.openedByMembershipId` straight to
 * its `BusinessMembership` row, id-only. Distinct from `findMembership`
 * above, which needs `(userId, businessId)` in hand and answers a different
 * question ("does this User hold a Membership on this Business") — here we
 * already have the Membership's own id and just need its `role`, the one
 * fact "Tú" vs. "Alguien de tu equipo" (§3.4a) turns on.
 */
export function membershipById(state: AppState, membershipId: ID): BusinessMembership | undefined {
  return state.memberships.find((m) => m.id === membershipId);
}

/** `decision-log.md` D69, `product-decisions.md` Q29 — the two-tier
 * resolution `reports.md` §3.4a ("Vendiendo ahorita") and §3.19 ("Exportar
 * tus ventas," Vendedor column) both share, verbatim: `User.displayName` if
 * set, else the pre-existing role-only fallback ("Tú" for OWNER, "Alguien de
 * tu equipo" for SELLER) — a single resolution rule, not a role-specific
 * branch, per D69's own framing ("'Tú' only works today because exactly one
 * OWNER exists per Business... not because her identity was ever actually
 * recorded"). `undefined` membership (an orphaned `performedByMembershipId`
 * — unreachable through any real write path in this codebase) still
 * degrades to "Alguien de tu equipo," the same defensive-but-honest posture
 * every other caller of `membershipById` already takes. */
export function membershipDisplayName(state: AppState, membershipId: ID): string {
  const membership = membershipById(state, membershipId);
  if (membership) {
    const user = state.users.find((u) => u.id === membership.userId);
    if (user?.displayName) return user.displayName;
  }
  return membership?.role === 'OWNER' ? 'Tú' : 'Alguien de tu equipo';
}

/** Every Session this Membership has ever opened — `home.md` §3.6b's own
 * "does this device already have a signal today" check, and §3.7c's own
 * per-Membership Sale attribution, both narrow from this same set rather
 * than re-deriving it independently. */
export function sessionsOpenedBy(state: AppState, membershipId: ID): Session[] {
  return state.sessions.filter((s) => s.openedByMembershipId === membershipId);
}

/** RFC 0013/`decision-log.md` D64 — `Invitation.status`'s stored closed set
 * is `pending | accepted | revoked`; `expired` is a read-time derivation,
 * never itself written (matching `peek_invitation`'s own server-side
 * computation of the identical condition). Every caller that needs to
 * *display* an Invitation's status goes through this selector rather than
 * reading `.status` directly, the same "derived, not stored" discipline
 * `quantityRemaining` already holds for `EventAllocation`. */
export function invitationDisplayStatus(invitation: Invitation): 'pending' | 'expired' | 'accepted' | 'revoked' {
  if (invitation.status === 'pending' && Date.now() > invitation.expiresAt) return 'expired';
  return invitation.status;
}

/** `settings.md` §3.11 "Tu equipo" — one row per active/revoked SELLER
 * Membership, or per pending/expired/cancelled Invitation, in a
 * discriminated shape the screen can switch on directly. **Widened
 * 2026-09-14 (RFC 0013/D64) from three kinds to five** — §3.11's own text:
 * "Five row states now, each a pure read, never a merchant choice (widened
 * from three...)." `Invitation.status = 'accepted'` deliberately produces no
 * row of its own (§3.11's own text) — the accepting person simply appears
 * as a fresh `'active'` Membership row instead, so no filter here ever
 * matches `'accepted'` directly. */
export type TeamRow =
  | { kind: 'active'; membership: BusinessMembership; phone: string; displayName: string | null }
  | { kind: 'revoked'; membership: BusinessMembership; phone: string; displayName: string | null }
  | { kind: 'pending'; invitation: Invitation }
  | { kind: 'expired'; invitation: Invitation }
  | { kind: 'cancelled'; invitation: Invitation };

/** `settings.md` §2.7/§3.11 "Tu equipo" — every Invitation/Membership row
 * for this Business, in the document's own stated display order: "active
 * Memberships, then pending Invitations, then expired Invitations, then
 * revoked Memberships, then cancelled Invitations... Both terminal groups
 * (revoked Memberships, cancelled Invitations) sit last, since neither
 * offers an action; the two still-actionable groups (pending, expired) sit
 * ahead of them." Deterministic, by date within each group — never
 * Ana-sorted. Membership rows exclude OWNER (there is exactly one, never
 * listed alongside her own team). `pending`/`expired` are both read through
 * `invitationDisplayStatus` (never `.status` directly) — `expired` is a
 * read-time derivation, never itself stored (§2.7a). A `revoked` Invitation
 * (cancelled by Ana, §3.12d, or the identical read on an Invitation that
 * expired without ever being explicitly cancelled — both share `.status =
 * 'revoked'` once cancelled; an expired-but-never-cancelled row stays
 * `'pending'` in storage and is read as `'expired'` here, never conflated
 * with a cancelled one) always reads as `'cancelled'`, regardless of
 * `expiresAt`.
 *
 * **Row display, resolved 2026-09-15 (`decision-log.md` D69,
 * `product-decisions.md` Q29): `displayName` first, then the pre-existing
 * phone/role fallback.** An `active`/`revoked` row carries both `phone`
 * (unchanged, may be `''` for a Google/Email-only SELLER) and the new
 * `displayName` (`User.displayName`, `null` if not set) — `TeamScreen.tsx`
 * itself resolves the final three-tier order (`displayName` → formatted
 * `phone` → "Alguien de tu equipo," §2.7's own text), since that fallback
 * chain is a presentation-layer concern (phone formatting), matching this
 * file's own "hand back the fields, let the screen format the copy"
 * discipline elsewhere (`historialRows`, `SalesExportRow`). */
export function teamRows(state: AppState, businessId: ID): TeamRow[] {
  const memberRows = state.memberships
    .filter((m) => m.businessId === businessId && m.role === 'SELLER')
    .map((membership) => ({
      kind: membership.status,
      membership,
      phone: phoneIdentifierFor(state, membership.userId),
      displayName: state.users.find((u) => u.id === membership.userId)?.displayName ?? null,
    }));
  const active = memberRows
    .filter((r) => r.kind === 'active')
    .sort((a, b) => a.membership.createdAt - b.membership.createdAt);
  const revokedMemberships = memberRows
    .filter((r) => r.kind === 'revoked')
    .sort((a, b) => a.membership.createdAt - b.membership.createdAt);

  const invitationsForBusiness = state.invitations.filter((inv) => inv.businessId === businessId);
  const byCreatedAt = (a: Invitation, b: Invitation) => a.createdAt - b.createdAt;
  const pending: TeamRow[] = invitationsForBusiness
    .filter((inv) => invitationDisplayStatus(inv) === 'pending')
    .sort(byCreatedAt)
    .map((invitation) => ({ kind: 'pending', invitation }));
  const expired: TeamRow[] = invitationsForBusiness
    .filter((inv) => invitationDisplayStatus(inv) === 'expired')
    .sort(byCreatedAt)
    .map((invitation) => ({ kind: 'expired', invitation }));
  const cancelled: TeamRow[] = invitationsForBusiness
    .filter((inv) => inv.status === 'revoked')
    .sort(byCreatedAt)
    .map((invitation) => ({ kind: 'cancelled', invitation }));

  return [...active, ...pending, ...expired, ...revokedMemberships, ...cancelled];
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

/**
 * `inventory.md` §2's **NFC-tagging-eligible** test (`decision-log.md` D73,
 * narrowing D71/`product-decisions.md` Q31) — the single source of truth
 * every step/state in this document now reads:
 *
 * `business.nfcPerProductEnabled === true` AND `product.nfcTaggingEnabled === true`
 *
 * A single condition, not a disjunction. D73 drops the earlier
 * `defaultSellingMode === 'nfc'`-only disjunct (D46's original rule, carried
 * forward unexamined by D71) outright: a barcoded Product being swept into
 * "needs an NFC tag" purely because the Business is in whole-Catalog `nfc`
 * mode was never a state that could actually resolve (barcode/NFC-tagging
 * are mutually exclusive per Product, D71) — a structurally unfixable
 * phantom entry, not a legitimate part of the queue. Eligibility is now
 * governed solely by the Business's per-product opt-in and the Product's own
 * flag, regardless of `defaultSellingMode` — including a Business that
 * stays in whole-Catalog `nfc` mode (a named, valid, reachable combination
 * per D73). `business` is `null | undefined`-safe (defensive — every real
 * caller already holds a resolved Business by the time it reads Inventory
 * state) and returns `false` rather than throwing.
 */
export function isNfcTaggingEligible(business: Business | null | undefined, product: Product): boolean {
  if (!business) return false;
  return business.nfcPerProductEnabled === true && product.nfcTaggingEnabled === true;
}

/** The live tagging queue itself — every `available`, untagged, NFC-tagging-
 * eligible unit (the composed test above, `decision-log.md` D71), in
 * `state.units`' own array order (the order she entered them, `inventory.md`
 * §3.14's own "in the order she entered them" requirement — no separate
 * ordering field needed). Scoped globally across every Lot/Product by
 * default, per the Architecture Gap Analysis's own confirmation against §2
 * step 2's business-wide gate. A unit whose own Product isn't NFC-tagging-
 * eligible (e.g. Plumas on a Business that's only opted Camisas in) never
 * enters this queue at all — not filtered out later, never queued in the
 * first place.
 *
 * **`productId`, added 2026-09-17 (live pass — "Continuar etiquetando"
 * retired, tagging entry/resume becomes per-Product).** Optional, additive,
 * backward-compatible: omitted (or `undefined`), this returns the identical
 * whole-Catalog queue it always has — every existing caller (the Lot-scoped
 * entry point, `inventory.md` §2 step 3, untouched by this amendment) is
 * unaffected. Passed, it narrows the same composed-eligibility filter to one
 * Product's own units only — the exact test `inventory.md` §3.4's new sixth
 * tap zone and §3.14's new Product-scoped entry point both require, reusing
 * this one function rather than duplicating its filter logic a second time. */
export function pendingTagUnits(state: AppState, productId?: ID): InventoryUnit[] {
  return state.units.filter((u) => {
    if (u.status !== 'available' || u.tagId != null) return false;
    if (productId != null && u.productId !== productId) return false;
    const product = state.products.find((p) => p.id === u.productId);
    return product ? isNfcTaggingEligible(state.business, product) : false;
  });
}

/** §2 step 2 / §3.4's own gate — "how many articles are left to tag,"
 * whole-Catalog by default. **`productId` (2026-09-17, additive, see
 * `pendingTagUnits`'s own doc comment) narrows this to one Product's own
 * pending count** — `inventory.md` §3.4's sixth tap zone's own live,
 * per-row rendering condition ("this Product currently has ≥1 `available`,
 * untagged, NFC-tagging-eligible unit"), computed fresh on every render,
 * never cached. */
export function pendingTagCount(state: AppState, productId?: ID): number {
  return pendingTagUnits(state, productId).length;
}

/** Per-Product breakdown of the live tagging queue, grouped in the order
 * each Product first appears in it (mirrors `pendingTagUnits`' own queue
 * order, per-unit, collapsed to one row per Product) — drives §3.14's "Lo
 * que registraste: Bolsas (10) · Accesorios (5)" summary line and, via its
 * first entry, "Etiquetando: Bolsas / Faltan 7 de 10." **`productId`
 * (2026-09-17, additive, see `pendingTagUnits`'s own doc comment) narrows
 * this to a single-Product breakdown** — `inventory.md` §3.14's new
 * Product-scoped entry point (toggle-ON auto-open or the sixth zone's
 * resume tap), which must never let some *other* Product's own pending
 * units surface in "Etiquetando: …" while she's working through one
 * specific Product's stack. */
export function pendingTagBreakdown(state: AppState, productId?: ID): { product: Product; count: number }[] {
  const order: ID[] = [];
  const counts = new Map<ID, number>();
  for (const unit of pendingTagUnits(state, productId)) {
    if (!counts.has(unit.productId)) order.push(unit.productId);
    counts.set(unit.productId, (counts.get(unit.productId) ?? 0) + 1);
  }
  return order
    .map((pid) => {
      const product = state.products.find((p) => p.id === pid);
      return product ? { product, count: counts.get(pid)! } : null;
    })
    .filter((row): row is { product: Product; count: number } => row != null);
}

/** `decision-log.md` D27 — `nfc` capability derives from `subscriptionTier`
 * alone, never from kit/code activation. Gates whether "Assign Tags" exists
 * at all in Inventario (`inventory.md` §2's own capability check) — a
 * Business-level fact. **`decision-log.md` D79 — "Session Operating Mode"
 * as a concept is retired, so this is no longer contrasted against it; a
 * plain Business-level capability fact with no Session-scoped counterpart
 * of any kind.** */
export function nfcCapable(state: AppState): boolean {
  return state.business?.subscriptionTier === 'paid';
}

/**
 * **NFC Readiness — retired outright, `decision-log.md` D79
 * (`product/99-rfc/0017-nfc-composable-selling-capability.md`).** This used
 * to be the Ready/Limited Ready/Not Ready three-state computation
 * (`home.md` §2's "NFC Readiness sub-step, folded into Session-start,"
 * `decision-log.md` D23) that gated `Session.operatingMode`'s own
 * Session-start resolution and the "Leer con NFC" overlay's Limited-Ready-
 * only composition. D79 retires it, not merely narrows it — there is no
 * aggregate-coverage computation left in the corrected model at all; "Leer
 * con NFC" now gates on `Business.nfcPerProductEnabled` alone, re-read live
 * on every render (`home.md` §3.9). `taggedAvailableCount`/
 * `totalAvailableCount`/`NFC_READINESS_THRESHOLD`/`nfcReadiness` (the four
 * functions/constant this computation used) are removed entirely along with
 * it — confirmed via trace, zero remaining callers anywhere in this
 * codebase as of this change.
 */

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

/**
 * `decision-log.md` D65 — the actual matching predicate behind
 * `productByBarcode` below, pulled out as its own pure function (not
 * `AppState`-shaped) so a caller that only has a `Product[]` in hand — not
 * full `AppState` — can still resolve a scanned code through the identical
 * rule instead of re-deriving it inline. Trimmed only (whitespace a decoder
 * might pad/trail with) — deliberately **not** case-folded the way
 * `inventory.md` §3.8's typed-name matching is: a barcode is a fact a
 * manufacturer/packager printed, not one Ana types, so there's no "BOLSAS
 * vs. bolsas" human-typing variance to normalize away here.
 */
export function matchProductByBarcode(products: Product[], code: string): Product | undefined {
  const normalized = code.trim();
  if (!normalized) return undefined;
  return products.find((p) => p.barcode != null && p.barcode.trim() === normalized);
}

/**
 * `decision-log.md` D65 — resolves a scanned barcode against this
 * Business's Catalog. One shared implementation for both consumers that
 * ever resolve a barcode against the Catalog — Inventory's own confirm-on-
 * scan (`inventory.md` §3.8c) and Selling's silent scan-to-add (`home.md`
 * §3.9a/§3.9a-i/§3.9b) — so the two never drift into two independently-
 * maintained matching rules. `ProductPicker`'s own scan-no-match resolution
 * (`inventory.md` §3.8a's scan variant) doesn't hold `AppState` at all —
 * only the `Product[]` its `rows` prop already carries — so it calls
 * `matchProductByBarcode` directly instead of this wrapper; both routes run
 * the identical predicate either way.
 */
export function productByBarcode(state: AppState, code: string): Product | undefined {
  return matchProductByBarcode(state.products, code);
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
 * points, never recomputed differently at each.
 *
 * Excludes Sales belonging to a currently-`active` Session
 * (`activeSessionIds` below, `reports.md` §2's live-Session exclusion) —
 * `eventStatus` computes an Event as `'closed'` purely from
 * `today > event.endDate`, entirely independent of whether its own Session(s)
 * have actually been closed via the separate `closeSession` merchant action.
 * A multi-day Event can therefore read `'closed'` while its last Session is
 * still `active` — without this exclusion, that still-open Session's Sales
 * would double as both "Vendiendo ahorita" (still live, "hasta ahorita") and
 * settled Resultados history at once, the exact contradiction §2 forbids. */
export function eventRollup(state: AppState, eventId: ID): { days: number; sales: number; revenue: number } {
  const days = eventCompletedDays(state, eventId);
  const liveSessionIds = activeSessionIds(state);
  const sessionIds = new Set(state.sessions.filter((s) => s.eventId === eventId).map((s) => s.id));
  let sales = 0;
  let revenue = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized' || !sessionIds.has(sale.sessionId) || liveSessionIds.has(sale.sessionId))
      continue;
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

/** Every Session currently `active`, as a Set of its `id`s — the standing
 * exclusion `reports.md` §2 (`decision-log.md` D68) requires of every
 * Resultados all-time aggregate: "A live Session's Sales are never counted
 * toward 'Total histórico,' 'Top productos,' or any other aggregate defined
 * below — those keep reading only closed/reviewed data, unchanged." A Sale's
 * own `status` turns `'finalized'` the instant that one transaction
 * completes (`store.tsx`'s `finalizeSale`), completely independent of
 * whether the Session it belongs to has closed yet — so `Sale.status`
 * alone can never answer "is this Sale still part of a live Session," only
 * this Session-level check can.
 *
 * **Deliberately not folded into `salesCount` below.** `salesCount` is
 * shared with Home's own `sellingGridRows` (`home.md` §3.9), which correctly
 * needs live-Session Sales counted in real time — "how much of this Product
 * is already spoken for right now" during an active selling day is a
 * different, correct use case from Resultados' own closed/reviewed-only
 * altitude. This Set exists so Resultados-scoped selectors can apply the
 * exclusion themselves without narrowing the selector Home depends on. */
function activeSessionIds(state: AppState): Set<ID> {
  return new Set(state.sessions.filter((s) => s.status === 'active').map((s) => s.id));
}

/** "Total histórico" (§3.4/§3.5/§3.6) — sum/count of `SaleItem.pricePaid`
 * across every finalized Sale this Business has ever recorded, all-time, no
 * Session/Event scoping, excluding any Sale whose Session is still `active`
 * (§2's live-Session exclusion, `activeSessionIds` above). `sessionTotals`
 * above is the identical computation scoped to one Session; this is its
 * all-time-scoped sibling, needed because no existing selector sums across
 * every Session at once. */
export function allTimeTotals(state: AppState): { revenue: number; count: number } {
  const liveSessionIds = activeSessionIds(state);
  let revenue = 0;
  let count = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized' || liveSessionIds.has(sale.sessionId)) continue;
    count += 1;
    for (const item of sale.items) revenue += item.pricePaid;
  }
  return { revenue, count };
}

/** "Top productos · todo tu historial" (§3.4/§3.5/§3.6) — every Product with
 * ≥1 finalized SaleItem ever recorded under a closed/reviewed Session,
 * ranked by piece count descending. **Does not reuse `salesCount`** the way
 * an earlier pass did — `salesCount` intentionally counts live-Session Sales
 * too (Home's own `sellingGridRows` needs that), while this list must not
 * (§2's live-Session exclusion, `activeSessionIds` above) — so this performs
 * its own identically-shaped per-Product count, scoped to closed/reviewed
 * Sales only. */
export function topProductsAllTime(state: AppState): { product: Product; count: number }[] {
  const liveSessionIds = activeSessionIds(state);
  const counts = new Map<ID, number>();
  for (const sale of state.sales) {
    if (sale.status !== 'finalized' || liveSessionIds.has(sale.sessionId)) continue;
    for (const item of sale.items) counts.set(item.productId, (counts.get(item.productId) ?? 0) + 1);
  }
  return state.products
    .map((product) => ({ product, count: counts.get(product.id) ?? 0 }))
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
 *
 * **Live-Session exclusion (§2, `decision-log.md` D68):** the day-by-day
 * tally below excludes any Sale whose Session is still `active`
 * (`activeSessionIds` above) — this headline is one of the aggregates §2
 * names explicitly ("or any other aggregate defined below"), so a still-open
 * Session's Sales must not move "esta semana"'s count until that Session
 * actually closes, same as every other aggregate on this screen.
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

  const liveSessionIds = activeSessionIds(state);
  let thisWeek = 0;
  let lastWeek = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized' || sale.finalizedAt == null || liveSessionIds.has(sale.sessionId)) continue;
    const dk = dateKey(sale.finalizedAt);
    if (dk >= thisMonday && dk <= todayKey) thisWeek += 1;
    else if (dk >= lastMonday && dk <= lastSunday) lastWeek += 1;
  }
  return { thisWeek, lastWeek };
}

/** `events.md` §3.21, `product-decisions.md` Q24/Q25 — this Event's `open`
 * EventAllocation for one Product, if any. Absence means "no allocation
 * exists for this pair" — the plain Business-wide pool applies, unaffected
 * (`home.md` §3.8a's own "a Product with no EventAllocation still resolves
 * from the general pool exactly as today" rule). */
export function eventAllocationFor(state: AppState, eventId: ID, productId: ID): EventAllocation | undefined {
  return state.eventAllocations.find((a) => a.eventId === eventId && a.productId === productId && a.status === 'open');
}

/** Stage 7 Backend Integration, Phase 2b — every `EventAllocationUnit` row
 * mirroring this one allocation's real, row-level committed set (the server's
 * own `event_allocation_units` table, joined by `eventAllocationId`). */
export function eventAllocationUnitsFor(state: AppState, eventAllocationId: ID): EventAllocationUnit[] {
  return state.eventAllocationUnits.filter((u) => u.eventAllocationId === eventAllocationId);
}

/** Stage 7 Backend Integration, Phase 2b/D67 — mirrors the server's own
 * `remove_sale_item`/`cancel_sale` revert-target rule
 * (`20260913063000_sale_item_event_allocation_id.sql`): a `SaleItem`'s own
 * `eventAllocationId`, captured once at write time by `add_item_to_sale`/
 * `add_item_to_sale_by_tag`, decides directly whether its unit reverts to
 * `'reserved'` (still allocation-committed) or `'available'` (the plain-pool
 * case) when unclaimed from a Sale. **Superseded, not merely renamed** — the
 * prior version of this check tested `state.eventAllocationUnits` for *any*
 * row referencing the unit, regardless of that specific commitment's current
 * standing; `event_allocation_units` is append-only, so that check stayed
 * `true` forever, long after a unit's own commitment had been reconciled
 * back to general stock (the exact defect D67 fixes server-side). Reading
 * the row-level value captured once on the `SaleItem` itself, instead of
 * re-deriving it from data that structurally can't support the derivation,
 * is what makes this selector's prediction actually match the server's own
 * decision rather than merely usually matching it. Used only for the local
 * mirror update after the real RPC confirms — the server is the
 * authoritative decision-maker. */
export function saleItemHasEventAllocationCommitment(item: SaleItem): boolean {
  return item.eventAllocationId != null;
}

/** Stage 7 Backend Integration, Phase 2b — a committed unit still counts
 * toward "remaining" only while it's genuinely still held by *this specific*
 * `EventAllocationUnit` row and not yet claimed by any Sale. Three
 * conditions, all required:
 *
 * 1. `status='reserved'` on the referenced `InventoryUnit`.
 * 2. No `SaleItem` anywhere references it — new as of Phase 2b: once
 *    allocated stock became directly sellable (the extended `addItemToSale`/
 *    `addItemToSaleByTag`), a unit claimed by a still-open Sale is
 *    `status='reserved'` for *two* simultaneously-true reasons (held by its
 *    allocation, and mid-Sale) — it must stop counting as remaining stock
 *    the moment a Sale claims it, matching the server's own extended
 *    `add_item_to_sale` candidate query.
 * 3. **This is the *current custody* record for its `unitId`** — no *later*
 *    `EventAllocationUnit` row exists for the same `unitId` (self-caught
 *    correctness fix, `20260913062000_event_allocation_persistence_layer_
 *    fixes.sql`'s own header comment). `EventAllocationUnit` is append-only,
 *    and reallocation is the one write that ever produces a *second* row for
 *    the same `unitId` (the destination's own commit) — without this check,
 *    the *source* allocation's now-stale row would still count the unit
 *    toward its own "remaining," double-counting stock that's actually moved
 *    elsewhere. */
function isCommittedUnitStillOutstanding(state: AppState, row: EventAllocationUnit): boolean {
  const unit = state.units.find((u) => u.id === row.unitId);
  if (!unit || unit.status !== 'reserved') return false;
  if (state.sales.some((sa) => sa.items.some((i) => i.unitId === row.unitId))) return false;
  return !state.eventAllocationUnits.some((other) => other.unitId === row.unitId && other.committedAt > row.committedAt);
}

/** RFC 0010/D59 §3 — the read-time derivation that replaces the old, now-
 * retired *stored* `EventAllocation.quantityRemaining` field: the count of
 * this allocation's `EventAllocationUnit` rows whose referenced
 * `InventoryUnit` is still genuinely outstanding (see
 * `isCommittedUnitStillOutstanding` above). Always correct by construction —
 * there is no longer a second, independently-writable number that can drift
 * from the real committed set (the exact confirmed defect RFC 0010 closes).
 * Counts *both* `unitSource` values together — "Para este evento" is the
 * combined total across manual and NFC-scan commitment, which compose on the
 * same Product row (never a forced choice, RFC 0009's own ubiquitous-
 * language entry); see `quantityRemainingBySource` below for the per-source
 * breakdown a mixed row's own display needs. */
export function quantityRemaining(state: AppState, allocation: EventAllocation): number {
  return state.eventAllocationUnits.filter(
    (u) => u.eventAllocationId === allocation.id && isCommittedUnitStillOutstanding(state, u),
  ).length;
}

/** Which open `EventAllocation` a unit is currently, genuinely committed to
 * (if any) — the read-side counterpart of `isCommittedUnitStillOutstanding`
 * above, exposed for a caller that needs to go unit → allocation directly:
 * `home.md` §3.9d/§3.9e's "Leer con NFC" Selling overlay (`decision-log.md`
 * D71) classifies a scanned tag's "already in a different Event" conflict
 * this way, entirely client-side, ahead of ever attempting the write — the
 * exact same need `events.md` §3.22a's own mixed-pile scan queue has for
 * naming which Product a conflicting tag belongs to. At most one such row
 * can exist per unit at a time by construction (the physical-location-
 * exclusivity invariant, `product-decisions.md` Q24/Q25). */
export function currentEventAllocationForUnit(state: AppState, unitId: ID): EventAllocation | undefined {
  const row = state.eventAllocationUnits.find(
    (u) => u.unitId === unitId && isCommittedUnitStillOutstanding(state, u),
  );
  if (!row) return undefined;
  return state.eventAllocations.find((a) => a.id === row.eventAllocationId);
}

/** Stage 7 Backend Integration, Phase 2b — `quantityRemaining` above, scoped
 * to one `unitSource` — the "sin tag · con tag" split `events.md` §3.21's
 * expanded row shows, and the per-source candidate-pool size
 * `reconcile_manual_allocation`/`return_scanned_units_to_general` each
 * derive server-side. */
export function quantityRemainingBySource(
  state: AppState,
  allocation: EventAllocation,
  unitSource: 'scan' | 'fifo_assignment',
): number {
  return state.eventAllocationUnits.filter(
    (u) => u.eventAllocationId === allocation.id && u.unitSource === unitSource && isCommittedUnitStillOutstanding(state, u),
  ).length;
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

/** `events.md` §3.21 — "Disponible en general": Business-wide `available`
 * stock for this Product, plus this Event's own already-committed units
 * (hers to freely reassign within this screen, "not elsewhere," §3.21's own
 * annotation) — which is what makes the manual stepper's ceiling exactly
 * equal to this figure. **Corrected, RFC 0010/D59:** no longer subtracts
 * every *other* open EventAllocation's committed count — once a commit
 * genuinely flips committed units to `reserved` (server-side,
 * `_fifo_commit_to_allocation`, Stage 7 Backend Integration Phase 2b),
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

/** `reports.md` §3.19 (`product-decisions.md` Q27) — every Session actually
 * `closed` within `[desde, hasta]`, inclusive on both ends, filtered against
 * each Session's own closed date (the same date every Historial/En curso
 * card already shows, never an `Event` date range — a multi-day Event's own
 * Sessions can close on different individual days, and the merchant is
 * picking a *sales* date range, not an *Event* range). A Session still
 * `active` can never appear here, for the same reason `activeSessionIds`
 * excludes it everywhere else in this tab — `status === 'closed'` alone
 * already enforces that exclusion, since a still-open Session has no closed
 * date to fall inside any range in the first place. */
export function closedSessionsInRange(state: AppState, desde: string, hasta: string): Session[] {
  return state.sessions.filter((s) => {
    if (s.status !== 'closed') return false;
    const closedDateKey = dateKey(s.closedAt ?? s.openedAt);
    return closedDateKey >= desde && closedDateKey <= hasta;
  });
}

/** §3.19's own default Desde/Hasta — "this Business's first and most recent
 * closed Session's own dates," the same "start from what's actually useful,
 * not blank" restraint `events.md` §3.6's Empieza-defaults-to-hoy decision
 * already established (EVT-Q1). `null` only when no Session has ever closed
 * — defensive only: the "[ Exportar tus ventas ▸ ]" row itself is reachable
 * exclusively from the main view (§3.4/§3.5/§3.6), which is itself only ever
 * reached once `hasAnyClosedSession` is true (§2), so this is never actually
 * hit as `null` through real navigation. */
export function defaultExportRange(state: AppState): { desde: string; hasta: string } | null {
  const keys = state.sessions.filter((s) => s.status === 'closed').map((s) => dateKey(s.closedAt ?? s.openedAt));
  if (keys.length === 0) return null;
  let desde = keys[0];
  let hasta = keys[0];
  for (const k of keys) {
    if (k < desde) desde = k;
    if (k > hasta) hasta = k;
  }
  return { desde, hasta };
}

/** One row of `reports.md` §3.19's file-content column table, one step short
 * of the actual exported-file cell values — structured data only
 * (`Venue`/`Event` entities, a raw `MembershipRole`), matching every other
 * selector in this file's own "hand back the entity, let the screen format
 * the copy" discipline (`historialRows`, `sessionProductBreakdown`, etc.).
 * The actual Spanish column-cell formatting (Event-type labels, "Tú"/
 * "Alguien de tu equipo," "Día N"/"Venta rápida") and the real-`.xlsx`
 * workbook generation live in `screens/Resultados/salesExportFile.ts`, a
 * presentation-layer concern, not this domain-layer file's own. */
export interface SalesExportRow {
  saleId: ID;
  /** The Session's own closed date (`dateKey` — `YYYY-MM-DD`), per §3.19's
   * own column-table citation for "Fecha." */
  fecha: string;
  venue?: Venue;
  event?: Event;
  /** Set iff `event` is set — this Sale's Session's own "Día N," §3.7's
   * exact existing header vocabulary, unchanged (`dayNumberForDate`). */
  dayNumber?: number;
  /** `undefined` only defensively (an orphaned `performedByMembershipId` —
   * unreachable through any real write path in this codebase, `Sale` always
   * carries a resolved acting Membership at finalization, D58). */
  vendedorRole?: MembershipRole;
  /** `decision-log.md` D69, `product-decisions.md` Q29 — `User.displayName`
   * for the Membership that performed this Sale, if set; `null` otherwise
   * (falls back to `vendedorRole`'s own "Tú"/"Alguien de tu equipo" copy,
   * `salesExportFile.ts`'s `vendedorLabel`). Resolved via the same
   * `membershipDisplayName` two-tier rule `reports.md` §3.4a already uses —
   * reused, not reimplemented. */
  vendedorDisplayName: string | null;
  product: Product;
  /** Count of `SaleItem` rows for this `(Sale, Product)` pair — §2's own
   * "Row shape and grouping" rule. */
  cantidad: number;
  /** The shared, already-resolved `pricePaid` for this `(Sale, Product)`
   * pair (D33) — safe to read as one value per §2's own citation of
   * `domain-model.md`'s "Price resolution" (resolves once per
   * `(Event, Product)` at write time). */
  precio: number;
}

/** §3.19/§3.20 (`product-decisions.md` Q27) — one row per `(Sale, Product)`
 * pair, for every finalized Sale whose own Session closed within
 * `[desde, hasta]` (`closedSessionsInRange` above). Reuses the identical
 * per-`(Sale,Product)` grouping §2's own "Row shape and grouping" rule
 * requires, and `membershipById`'s existing role-derivation — never a
 * reimplementation of either. Row order: by Fecha, then by Sale, so every
 * row belonging to the same Sale is contiguous (the "repeated ID de venta"
 * shape §2/§3.19 both call for) — a stable, deterministic order for a file
 * she may re-open later, not itself specified by the Approved spec. */
export function salesExportRows(state: AppState, desde: string, hasta: string): SalesExportRow[] {
  const sessions = closedSessionsInRange(state, desde, hasta);
  const sessionById = new Map(sessions.map((s) => [s.id, s]));
  const rows: SalesExportRow[] = [];
  for (const sale of state.sales) {
    if (sale.status !== 'finalized') continue;
    const session = sessionById.get(sale.sessionId);
    if (!session) continue;
    const event = session.eventId ? findEvent(state, session.eventId) : undefined;
    const venue = event ? findVenue(state, event.venueId) : undefined;
    const dayNumber = event ? dayNumberForDate(state, event.id, dateKey(session.openedAt)) : undefined;
    const vendedorMembership = membershipById(state, sale.performedByMembershipId);
    const vendedorRole = vendedorMembership?.role;
    // `decision-log.md` D69 — same two-tier resolution `membershipDisplayName`
    // performs, inlined here since this loop already has the Membership row
    // in hand and needs `vendedorRole` as its own separate field anyway
    // (§3.19's disclosure line reads the two together).
    const vendedorDisplayName = vendedorMembership
      ? (state.users.find((u) => u.id === vendedorMembership.userId)?.displayName ?? null)
      : null;
    const fecha = dateKey(session.closedAt ?? session.openedAt);
    // §2's own "(Sale, Product)" grouping — Cantidad is the count of
    // matching SaleItems, Precio their one shared pricePaid (D33).
    const byProduct = new Map<ID, { count: number; pricePaid: number }>();
    for (const item of sale.items) {
      const existing = byProduct.get(item.productId);
      if (existing) existing.count += 1;
      else byProduct.set(item.productId, { count: 1, pricePaid: item.pricePaid });
    }
    for (const [productId, { count, pricePaid }] of byProduct) {
      const product = findProduct(state, productId);
      if (!product) continue; // defensive — every SaleItem names a real Product
      rows.push({
        saleId: sale.id,
        fecha,
        venue,
        event,
        dayNumber,
        vendedorRole,
        vendedorDisplayName,
        product,
        cantidad: count,
        precio: pricePaid,
      });
    }
  }
  return rows.sort((a, b) => a.fecha.localeCompare(b.fecha) || a.saleId.localeCompare(b.saleId));
}
