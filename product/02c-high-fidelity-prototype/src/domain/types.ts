/**
 * Domain types for the High-Fidelity prototype slice
 * (Home → Inventario → Registrar mercancía → Selling → Digital receipt →
 * Authentication → Onboarding).
 *
 * These mirror the relevant aggregates in `product/00-foundation/domain-model.md`
 * for this slice only — not a full re-implementation of the Foundation.
 *
 * Scope decisions, as originally built in Slice 1
 * (docs/passes/slice-1-home-inventario.md) — both since superseded by later
 * slices, see the paragraphs below:
 * - Originally, `subscriptionTier = 'free'` for the two real Onboarding
 *   paths, reachable at `paid`/`nfc` only via the demo path. Superseded by
 *   Slice 4 (Configuración) — `paid`/`nfc` are now self-service reachable
 *   from inside the app for any Business, not only the demo seed.
 * - Originally, Event/Venue/Eventos were out of scope, every Session a Quick
 *   Session (`eventId: null`). Superseded by Slice 3 — see "Eventos
 *   additions" below.
 * - Full unit-level traceability IS modeled (Product → Lot → InventoryEntry →
 *   InventoryUnit, with FIFO consumption, D3/D5) — not the simplified
 *   single-quantity fallback the brief permits, because it's real, cheap-to-model
 *   domain truth for this slice and is what "continue building from it" needs.
 *
 * Identity context additions (RFC 0007, decision-log.md D44) — `User` and
 * `BusinessMembership`, the first authenticated-identity concepts in this
 * Foundation. See `store.tsx`'s `verifyOtp`/`completeOnboarding` for the
 * write paths and their invariants.
 *
 * Eventos additions (Migration Workflow, D43; `product/02-ux/events.md`
 * Approved) — `Venue`, `Event`, `PriceOverride`, and `Session.eventId`
 * generalized from a hardcoded `null` to `ID | null`. See `store.tsx`'s
 * `createEvent`/`cancelEvent`/`setPriceOverride` and `selectors.ts`'s
 * `eventStatus`/`dayNumberForDate` for the write/read rules these types
 * exist to support.
 *
 * Slice 12 additions (`product-decisions.md` Q24/Q25, RFC 0007/0008/0009,
 * `decision-log.md` D53/D55/D56/D57/D58; see
 * `context/q24-q25-first-slice.md`) — multi-staff concurrent selling:
 * `currentUser: User | null` generalized to `users: User[]` +
 * `currentUserId: ID | null` (the Architecture Gap Analysis's own
 * foundational unblocker); `Invitation`, `BusinessMembership.status`/
 * `revokedAt`, `Sale.performedByMembershipId`, `EventAllocation`
 * (manual-mode fields only this slice), and one disclosed prototype-only
 * addition beyond the settled architecture, `Session.openedByMembershipId`
 * (see that field's own doc comment for the full reasoning). `AllocationMovement`
 * and NFC-mode allocation (`allocatedUnitIds`) are both deliberately not
 * modeled — out of this slice's scope.
 */

export type ID = string;

/** Identity context (RFC 0007 / D44) — the platform's own authenticated
 * person, distinct from `Customer` ("no login, no roles, no global
 * account"). Global, not Business-scoped — the one deliberate exception to
 * this Foundation's businessId-scoping pattern (RFC 0007 §1).
 *
 * **Array-shaped as of Slice 12 (`context/q24-q25-first-slice.md`'s own
 * Architecture Gap Analysis)** — was a single-slot `currentUser: User |
 * null` through Slice 2/11, a correctly-scoped simplification at the time
 * ("at most one `User` ever relevant... only has real work to do once a
 * second device/session exists," the exact condition Slice 12's own
 * multi-staff concurrent-selling scope now creates). `AppState.users` now
 * mirrors `memberships`/`sessions`'s own existing array-shaped convention;
 * `AppState.currentUserId` names which row this device's own verified
 * session currently is, resolved via `selectors.ts`'s `currentUser`. See
 * `store.tsx`'s `verifyOtp`/`completeOnboarding`/`signOut` for the write
 * paths and their invariants.
 */
export interface User {
  id: ID;
  phone: string; // E.164 formatting left to the build layer, per RFC 0007
  phoneVerifiedAt: number | null; // null = unverified; set once OTP verification succeeds
  createdAt: number;
  /** `authentication.md` §2.2a step 4 / §10 — "declining never re-surfaces
   * the same offer on the next open." A small, durable, local-only UI
   * marker (ux-critic fix round, Slice 12) — **never** a write to the
   * `Invitation` record itself, which stays `pending`/untouched exactly as
   * the spec requires ("as if this screen had never been shown"). Same
   * "shown once ever" shape as `Business.nfcAvailabilityNudgeShown`, scoped
   * per-User since the offer itself is resolved per verified phone
   * (`AppRouter.tsx`), not per-Business. Set only by `declineInvitation`
   * ("Ahora no"); never read or written anywhere else. */
  declinedInvitationIds: ID[];
}

export type MembershipRole = 'OWNER' | 'SELLER';

/** Identity context (RFC 0007 / D44) — the join between a User and a
 * Business, its own aggregate root (not nested inside Business — see RFC
 * 0007 §2). A `SELLER` row is produced only by the Invitation-acceptance
 * invariant (`acceptInvitation` below, RFC 0008/D56) — never directly.
 *
 * `status`/`revokedAt` (Slice 12, `decision-log.md` D55) — closed set,
 * plain mutable current scalar, no version history, same shape as
 * `Product.active`; defaults `active`; flipped to `revoked` only via
 * `revokeMembership` (OWNER-only, `settings.md` §2.7/§3.13), never deleted;
 * no reactivation path designed. `revokedAt` is set once alongside the
 * flip, never modified again while `status` stays `revoked`.
 */
export interface BusinessMembership {
  id: ID;
  userId: ID;
  businessId: ID;
  role: MembershipRole;
  status: 'active' | 'revoked';
  revokedAt: number | null;
  createdAt: number;
}

/** Identity context (RFC 0008/D56, Slice 12) — a not-yet-accepted offer to
 * join a Business as a SELLER. Root, not an entity nested inside Business
 * (`settings.md` §2.7's own "does this verified phone hold a pending
 * Invitation" query must run before any single Business is in context, at
 * OTP-verification time, `authentication.md` §2.2 case 0). `role` is a
 * closed set of one value (`'SELLER'`) — inviting a second OWNER isn't a
 * capability this Foundation describes anywhere, so no picker is ever shown
 * for it (`settings.md` §2.7). Unique on `(businessId, phone)` while
 * `pending` — a resolved Invitation never blocks a fresh reinvite to the
 * same number. `expired` is included in the closed set for Foundation
 * fidelity, but this build never writes it — `settings.md §8` item 12 names
 * its trigger/timing as genuinely undesigned anywhere in the settled
 * architecture.
 */
export interface Invitation {
  id: ID;
  businessId: ID;
  phone: string;
  role: 'SELLER';
  status: 'pending' | 'accepted' | 'revoked' | 'expired';
  createdAt: number;
}

export interface Business {
  id: ID;
  /**
   * Required with no honest default (D36) — but genuinely absent for the
   * brief window between the atomic Owner-creation write (onboarding.md
   * §3.5, which creates the Business+Membership before her identity is
   * ever asked for) and the identity-capture write (§3.10) that sets it.
   * Modeled here as `''` during that window rather than `string | undefined`
   * — `''` is never a value "Continuar" can actually submit (§3.9 gates on
   * a non-empty Nombre), so it's a safe, unambiguous not-yet-captured
   * sentinel, never mistaken for a real (if unusual) business name. The
   * demo path ("Ver un ejemplo") never leaves this window on-screen — its
   * seeded identity is written in the same tap that creates the Business.
   */
  name: string;
  logo?: string;
  description?: string;
  subscriptionTier: 'free' | 'paid';
  defaultSellingMode: 'buttons' | 'nfc';
  /**
   * True only once onboarding.md §3.6's "Todo listo" milestone has actually
   * been dismissed (tapped "Entrar," or auto-continued) — §2.1's own
   * narrowing of "complete": an interruption while §3.6 is on screen must
   * resume at that exact screen next time, not silently skip to Home. Every
   * other Onboarding-resolution fact (capabilities, identity, Catalog) is
   * already derivable from data that exists elsewhere in `AppState`; this
   * one bit has no other honest home, since nothing else records whether
   * she's actually seen the milestone screen.
   */
  onboardingAcknowledged: boolean;
  /**
   * `settings.md` §2.2/§2.4, `decision-log.md` D25/D29's own already-specified
   * pending-change triple — the deferred-effect shape for a `subscriptionTier`
   * downgrade ("Volver al plan gratis"). `pendingSubscriptionTier` names the
   * target value this Business is moving *to*, `pendingSubscriptionTierEffectiveDate`
   * ('YYYY-MM-DD') is when it lands, `pendingSubscriptionTierAcknowledged`
   * tracks whether the one-time landing acknowledgment (§2.4) has already
   * been shown once. All three are set together (`requestDowngradeToFree`)
   * and cleared together (`cancelPendingSubscriptionTierChange`, or the
   * second Configuración open after landing, `reconcilePendingSubscriptionTier`
   * in store.tsx) — never independently. `null`/`false` when no change is
   * pending, the common case. `defaultSellingMode` carries no equivalent
   * pending pair at all (§2.3, D27) — both its directions are immediate,
   * with nothing to defer.
   */
  pendingSubscriptionTier: 'free' | 'paid' | null;
  pendingSubscriptionTierEffectiveDate: string | null;
  pendingSubscriptionTierAcknowledged: boolean;
  /**
   * NFC Selling pass (Migration Workflow D43, `home.md` §3.6a's fourth
   * Session-start variant — "Ready, but `defaultSellingMode = buttons`...
   * tags now available"). `true` once that one-time discoverability mention
   * has actually been shown — the exact render `useNfcSessionStart.ts`
   * (`src/screens/Home/`) fires its own one-time mutator for, mirroring
   * `pendingSubscriptionTierAcknowledged`'s own "shown once ever" flag
   * pattern above. Never reset once set — §3.6a's own explicit rule ("she
   * may genuinely prefer botones... repeating this mention... would read as
   * the app second-guessing a choice she's entitled to make"), so this stays
   * `true` for the life of the Business even if the readiness/
   * `defaultSellingMode` disagreement it flagged persists indefinitely.
   */
  nfcAvailabilityNudgeShown: boolean;
}

/** Selling context — Eventos (`events.md`, `decision-log.md` D8/D17/D20). */

/**
 * A place Ana sells (`domain-model.md`: "independent identity, referenced by
 * ID from Event... owned by the Selling context," `decision-log.md` D20).
 * Minimum viable for this slice — no address/notes/`active` toggle, since
 * `events.md` §11 designs no UI surface for capturing or editing them (the
 * same structurally-present-but-UI-absent treatment D9 already established
 * for Supplier/cost). No `businessId` field, matching this prototype's
 * existing single-Business scoping convention (`Product`, `Lot`, etc. carry
 * no `businessId` either — the whole `AppState` is implicitly one Business).
 */
export interface Venue {
  id: ID;
  displayName: string;
}

/** The closed, 6-value Event type enum (`decision-log.md` D16) — internal
 * English keys per `ubiquitous-language.md`; Spanish labels are mapped only
 * at the UI layer (see `src/screens/Events/eventTypeLabels.ts`), never
 * stored. "Market"'s Spanish rendering is "Tianguis," not a literal
 * translation — `events.md` §3.8's own EVT-M1 remediation. */
export type EventType = 'Bazaar' | 'Expo' | 'Pop-up' | 'Festival' | 'Market' | 'Office Sale';

/**
 * A scheduled occasion to sell (`domain-model.md`: "light root... does NOT
 * own Session as a strict aggregate"). **Status is never a stored field** —
 * `scheduled`/`active`/`closed`/`cancelled` is computed live, every time,
 * from `startDate`/`endDate` vs. today plus `cancelledAt` (`events.md` §2's
 * own explicit rule; see `selectors.ts`'s `eventStatus`). `cancelledAt` is
 * the one stored, manual fact — the only merchant-initiated transition in
 * the whole lifecycle (`scheduled → cancelled`, `events.md` §2).
 */
export interface Event {
  id: ID;
  venueId: ID; // required, not nullable — D20
  type: EventType;
  startDate: string; // 'YYYY-MM-DD', local calendar date — see dates.ts
  endDate: string; // 'YYYY-MM-DD', inclusive, >= startDate
  bazaarCost: number; // optional at entry, always stored as a number (0 default) — D33
  cancelledAt: number | null;
}

/**
 * Internal-only entity owned by `Event` (no identity or lookup outside its
 * parent Event — the same shape `InventoryEntry` has under `Lot`,
 * `decision-log.md` D33). One row per `(eventId, productId)` pair whose
 * price Ana has adjusted specifically for that Event; absence of a row
 * means "use `Product.defaultPrice`," never a stored copy of the default.
 */
export interface PriceOverride {
  eventId: ID;
  productId: ID;
  overridePrice: number;
}

/**
 * Root, Selling context (RFC 0009/D57, Slice 12) — how much of a Product
 * Ana has decided to bring/reserve for one specific Event, out of the
 * Business-wide shared pool. Not nested inside Event or Product — resolving
 * "what's allocated to this Event" and "what's allocated to this Product,
 * across every Event" are both real, independent query axes
 * (`events.md` §3.21's own "Disponible en general" figure needs the
 * second). Unique on `(eventId, productId)`.
 *
 * **Manual mode only, this slice** — `quantityAllocated`/`quantityRemaining`
 * (`events.md` §3.21's manual stepper). `quantityRemaining` is the actual
 * selling gate: atomically decremented at the moment a Sale item is added
 * under this Event for this Product (the Physical-location-exclusivity
 * invariant's mechanism (b), a compare-and-swap on `quantityRemaining > 0`,
 * layered on top of ordinary Business-wide FIFO), floor 0. `quantityAllocated`
 * is the current target total she's decided to bring — edited via the
 * stepper, never reduced by a Sale.
 *
 * **`allocatedUnitIds` (NFC mode) and `AllocationMovement` are both
 * deliberately not modeled in this slice** — NFC-scan allocation
 * (`events.md` §3.22) and its own exclusivity mechanism (a) are out of this
 * slice's scope (`context/q24-q25-first-slice.md`), and `AllocationMovement`
 * has no UI surface until reallocation/reconciliation (`events.md`
 * §3.24/§3.25, also deferred) are built — `quantityAllocated`/
 * `quantityRemaining` alone serve everything this slice's screens read or
 * write. No `businessId` field, matching this prototype's existing
 * single-Business scoping convention (`Venue`, `Event`, etc. carry none
 * either).
 */
export interface EventAllocation {
  id: ID;
  eventId: ID;
  productId: ID;
  quantityAllocated: number;
  quantityRemaining: number;
  status: 'open' | 'reconciled';
  createdAt: number;
}

/** Inventory context */

export interface Product {
  id: ID;
  name: string;
  defaultPrice: number;
  /**
   * Optional, plain mutable current scalar — no version history, the same
   * shape as `defaultPrice`/`Business.logo` (`decision-log.md` D54,
   * `product-decisions.md` Q23). A browser-local object/data URL held
   * entirely client-side, since this prototype has no backend — the same
   * storage mechanism `Business.logo` already uses. Captured optionally at
   * Product creation (`onboarding.md` §2.2a/§3.5b–§3.5e, `inventory.md`
   * §3.8a) and manageable afterward via `inventory.md` §3.4b's Catalog-row
   * "Editar foto" sheet. Consumed, display-only, wherever a Product's
   * marker renders (`inventory.md` §3.4's Catalog row, `home.md` §3.9's
   * Venta rápida tile) — never on the Digital Receipt (`home.md` §3.8f,
   * deliberately untouched). One photo per Product, no gallery.
   */
  photo?: string;
  createdAt: number;
}

export interface Lot {
  id: ID;
  receivedAt: number;
}

export interface InventoryEntry {
  id: ID;
  lotId: ID;
  productId: ID;
  quantity: number;
}

export type InventoryUnitStatus = 'available' | 'reserved' | 'sold';

export interface InventoryUnit {
  id: ID;
  productId: ID;
  lotId: ID;
  status: InventoryUnitStatus;
  receivedAt: number; // inherited from Lot.receivedAt — drives FIFO ordering (D5)
  /**
   * Asignar Tags (`inventory.md` §3.14-§3.17, Migration Workflow D43) — the
   * domain-model's 1:1 NFCTag attribute, modeled here as a nullable scalar
   * rather than a separate `NFCTag` entity (no other field/behavior needs to
   * hang off a tag besides "which unit does it belong to," so a second
   * aggregate would be pure ceremony). `null` = untagged (every unit
   * `commitLot` mints starts here, regardless of `nfc` capability — tagging
   * is optional at the capability level, never a precondition for
   * `status = 'available'`, `inventory.md` §8 item 2/Q2). Set exactly once,
   * by `assignTagToNextPendingUnit` (`store.tsx`) — never cleared or
   * reassigned by any other write path in this slice.
   */
  tagId: string | null;
}

/** Selling context */

export type SessionOperatingMode = 'buttons' | 'nfc';

export interface Session {
  id: ID;
  // Generalized from a hardcoded `null` (Eventos build, D43) — `null` for a
  // Quick Session, or the Event this Session's Día belongs to. Never set
  // after the Session opens (`Session.operatingMode`'s own immutability
  // precedent, D23) and never retroactively assignable — a Session only
  // ever gets an `eventId` through Home's own resolution at open time
  // (`home.md` §2, `events.md` §2's "note on what Session→Event linking is,
  // and isn't").
  eventId: ID | null;
  operatingMode: SessionOperatingMode;
  status: 'active' | 'closed';
  openedAt: number;
  closedAt?: number;
  /**
   * **Disclosed, deliberate prototype-only deviation from RFC 0008/D56's
   * own "No changes to `Session`" decision (Slice 12) — not a Foundation
   * field, flagged here for `architect`/`reviewer` to challenge.** The
   * settled architecture needs no Membership FK on `Session` because a real,
   * separately-deployed device structurally only ever discovers the Session
   * *it itself* opened — there is no cross-device "which Session is mine"
   * query surface for a real backend to answer in the first place, so the
   * ambiguity this field resolves simply doesn't exist there. This
   * prototype's single shared `localStorage` blob stands in for *every*
   * device at once (the same disclosed simplification `home.md` §3.6b's own
   * "does this device already have a signal today" language already
   * accepts, `product-decisions.md` Q19) — without this field, two
   * concurrently `active` Sessions (the entire point of Q24/Q25's
   * multi-staff scope) would be indistinguishable from each other the
   * instant a second `BusinessMembership` signs in on "the same device,"
   * and Home's own step 1 (`home.md` §2, "a Session active for this
   * device's own acting Membership") would have no honest way to answer
   * whose Session it's looking at. Trivially removable once real per-device
   * backend separation exists (Stage 7) — never surfaced as merchant-facing
   * copy, never read by any bounded context Selling doesn't already read
   * (`Sale.performedByMembershipId` carries the identical kind of fact,
   * already Foundation-promoted, D58).
   */
  openedByMembershipId: ID;
}

export interface SaleItem {
  id: ID;
  productId: ID;
  unitId: ID;
  pricePaid: number; // resolved automatically at write time (D33) — never asked
}

export interface Sale {
  id: ID;
  sessionId: ID;
  items: SaleItem[];
  status: 'open' | 'finalized';
  finalizedAt?: number;
  /** `decision-log.md` D58, RFC 0008 — the acting `BusinessMembership` that
   * performed this Sale, resolved from already-validated authorization
   * context (`actingMembership`, `selectors.ts`) at the moment this Sale's
   * first item is appended, immutable thereafter. Consumed by `home.md`
   * §3.7c "Mi actividad de hoy" — not yet consumed by Resultados (same
   * restrained "captured now, not yet consumed by reporting" posture
   * `Sale.claimToken` already established, D26). */
  performedByMembershipId: ID;
}

/** Root state shape, persisted to localStorage. */
export interface AppState {
  /** Identity context (RFC 0007/D44) — array-shaped as of Slice 12, see
   * `User`'s own doc comment above. */
  users: User[];
  /** `null` until phone+OTP verification succeeds for the first time on this
   * device — the genuine pre-Authentication state, per `authentication.md`
   * §2.1. Resolve the actual row via `selectors.ts`'s `currentUser`, never
   * by indexing `users` directly. */
  currentUserId: ID | null;
  /** `null` until Onboarding's atomic Owner-creation write (`onboarding.md`
   * §3.5) succeeds — was previously a hardcoded, always-present singleton
   * ("Luna Mercado"); this build removes that workaround (see BACKLOG.md's
   * own "What's not built" entry for this exact gap). */
  business: Business | null;
  memberships: BusinessMembership[];
  /** RFC 0008/D56, Slice 12 — see `Invitation`'s own doc comment above. */
  invitations: Invitation[];
  products: Product[];
  lots: Lot[];
  entries: InventoryEntry[];
  units: InventoryUnit[];
  sessions: Session[];
  sales: Sale[];
  venues: Venue[];
  events: Event[];
  priceOverrides: PriceOverride[];
  /** RFC 0009/D57, Slice 12 — see `EventAllocation`'s own doc comment
   * above. */
  eventAllocations: EventAllocation[];
}
