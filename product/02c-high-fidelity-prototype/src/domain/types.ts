/**
 * Domain types for the High-Fidelity prototype slice
 * (Home → Inventario → Registrar mercancía → Selling → Digital receipt →
 * Authentication → Onboarding).
 *
 * These mirror the relevant aggregates in `product/00-foundation/domain-model.md`
 * for this slice only — not a full re-implementation of the Foundation.
 *
 * Scope decisions (see README.md "Scope decisions" for the full reasoning):
 * - Business operates at `subscriptionTier = 'free'` for the two real
 *   Onboarding paths; only the demo ("Ver un ejemplo") path ever reaches
 *   `paid`/`nfc` in this slice — `onboarding.md` §2.2's own capability table.
 * - Event/Venue/Eventos are out of this slice's scope — every Session here is
 *   a Quick Session (`eventId: null`), matching home.md §3.7b.
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
 */

export type ID = string;

/** Identity context (RFC 0007 / D44) — the platform's own authenticated
 * person, distinct from `Customer` ("no login, no roles, no global
 * account"). Global, not Business-scoped — the one deliberate exception to
 * this Foundation's businessId-scoping pattern (RFC 0007 §1). This
 * prototype is a single localStorage instance per device, so there is at
 * most one `User` ever held in `AppState` at a time (`currentUser`) — a
 * disclosed simplification of RFC 0007's "looked up by phone, globally"
 * shape, which only has real work to do once a second device/session
 * exists. See README.md's disclosure for this build's authentication pass.
 */
export interface User {
  id: ID;
  phone: string; // E.164 formatting left to the build layer, per RFC 0007
  phoneVerifiedAt: number | null; // null = unverified; set once OTP verification succeeds
  createdAt: number;
}

export type MembershipRole = 'OWNER' | 'SELLER';

/** Identity context (RFC 0007 / D44) — the join between a User and a
 * Business, its own aggregate root (not nested inside Business — see RFC
 * 0007 §2). This slice can only ever produce an `OWNER` row (the atomic
 * Owner-creation write, `completeOnboarding` below) — no invitation flow
 * exists yet, so `SELLER` is unreachable by construction, not merely
 * deferred, matching RFC 0007 §5 exactly.
 */
export interface BusinessMembership {
  id: ID;
  userId: ID;
  businessId: ID;
  role: MembershipRole;
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

/** Inventory context */

export interface Product {
  id: ID;
  name: string;
  defaultPrice: number;
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
}

/** Root state shape, persisted to localStorage. */
export interface AppState {
  /** Identity context (RFC 0007/D44). `null` until phone+OTP verification
   * succeeds for the first time on this device — the genuine pre-
   * Authentication state, per `authentication.md` §2.1. */
  currentUser: User | null;
  /** `null` until Onboarding's atomic Owner-creation write (`onboarding.md`
   * §3.5) succeeds — was previously a hardcoded, always-present singleton
   * ("Luna Mercado"); this build removes that workaround (see BACKLOG.md's
   * own "What's not built" entry for this exact gap). */
  business: Business | null;
  /** Array shape even though this slice only ever produces 0–1 `OWNER`
   * entries — RFC 0007's own explicit instruction ("keep the domain model
   * ready for multiple Users per Business from the beginning"). */
  memberships: BusinessMembership[];
  products: Product[];
  lots: Lot[];
  entries: InventoryEntry[];
  units: InventoryUnit[];
  sessions: Session[];
  sales: Sale[];
  venues: Venue[];
  events: Event[];
  priceOverrides: PriceOverride[];
}
