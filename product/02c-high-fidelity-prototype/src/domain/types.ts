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
 * `AuthIdentity` (RFC 0012, `decision-log.md` D62/D63 — Google Sign-In and
 * Email activated as fully independent first-time sign-up methods alongside
 * phone; `authentication.md`'s 2026-09-13 amendment) — `User` is corrected
 * to drop `phone`/`phoneVerifiedAt` entirely; a verified credential (phone,
 * email, or Google) is now its own row, keyed on `(type, identifier)`, never
 * embedded on `User` itself (RFC 0012 §1: a User may eventually hold more
 * than one). See `store.tsx`'s `resolveAuthIdentity`/`verifyOtp`/
 * `requestEmailOtp`/`verifyEmailOtp`/`startGoogleSignIn`/`resolveGoogleSignIn`
 * for the write paths and their invariants, and `src/domain/authProviders.ts`
 * for the Supabase Auth wiring these last four call through.
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
 * (manual-mode fields only, at the time of this Slice 12 addition), and one
 * disclosed prototype-only addition beyond the settled architecture,
 * `Session.openedByMembershipId` (see that field's own doc comment for the
 * full reasoning). NFC-mode allocation was deliberately unmodeled at the
 * time of this addition — since made real, Stage 7 Backend Integration
 * Phase 2b (below).
 *
 * RFC 0010/`decision-log.md` D59 (commitment-lifecycle correction) —
 * `EventAllocation.quantityRemaining` is retired as a *stored* field
 * (closes a confirmed, reproduced defect: the old counter never touched
 * `InventoryUnit.status`, so a same-day Quick Sale or another Event's own
 * allocation could silently consume stock a merchant believed reserved).
 * `EventAllocation` gains `quantityPlanned` (soft intent, no pool effect).
 * `AllocationMovement`, previously deferred as having no UI surface until
 * reconciliation was built, is now modeled — `events.md` §3.16's
 * Approved reconciliation UI requires it (`quantityExpected`/`unitSource`
 * are read directly by that screen).
 *
 * Stage 7 Backend Integration, Phase 2b (`context/stage-7-backend-
 * integration.md`'s "Phase 2b design summary") — the real
 * `event_allocations`/`event_allocation_units`/`allocation_movements`
 * tables and their `save_event_allocations`/`scan_unit_into_event_allocation`/
 * `reallocate_event_allocation`/`return_scanned_units_to_general`/
 * `reconcile_manual_allocation` RPCs replace this slice's local-only mock.
 * **`EventAllocation.allocatedUnitIds` is retired** — the real row-level
 * committed set now lives in its own mirrored table, `EventAllocationUnit`
 * (below), matching the server's own `event_allocation_units` 1:1 (D59's own
 * "needs an indexed, lockable `SELECT ... FOR UPDATE`, which an array column
 * can't support" reasoning, now realized as a real join table on both sides).
 * **NFC-scan allocation is no longer unmodeled** — `scan_unit_into_event_
 * allocation` is real, so `EventAllocationUnit.unitSource` can now genuinely
 * be `'scan'`, not only `'fifo_assignment'`. See `store.tsx`'s
 * `saveEventAllocations`/`scanUnitIntoEventAllocation`/
 * `reallocateEventAllocation`/`returnScannedUnitsToGeneral`/
 * `reconcileManualAllocation` for the write paths and `selectors.ts`'s
 * `quantityRemaining` for the read-time derivation, now sourced from
 * `state.eventAllocationUnits` instead of the retired array field.
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
/**
 * Identity context (RFC 0012, `decision-log.md` D62/D63) — a single verified
 * credential, unique on `(type, identifier)`. `User` no longer embeds
 * `phone`/`phoneVerifiedAt` directly (corrected from the RFC 0007-era shape)
 * — every credential a User has ever verified, of any type, is its own row
 * here instead, resolved via `store.tsx`'s `resolveAuthIdentity`.
 *
 * `identifier`:
 * - `phone` — the raw 10-digit number, the same un-prefixed string
 *   `verifyOtp` always keyed on before this amendment.
 * - `email` — lowercased, trimmed.
 * - `google` — the provider's own opaque stable subject ID (RFC 0012 §1's
 *   own reasoning: an email can be hidden/relayed/changed without the
 *   underlying identity changing) — **never** a human-readable label.
 *   `authentication.md` §3.7e's confirm-screen display value is read live
 *   from the OAuth session at render time and is deliberately never
 *   persisted anywhere, including here.
 * - `apple` — schema-ready per RFC 0012, not activated by D62/D63, not
 *   reachable through any built UI this slice (`authentication.md` §11).
 *
 * `verifiedAt` is set once, at creation, and never cleared again — unlike
 * the old `User.phoneVerifiedAt`, which `signOut` used to null back out.
 * "Is this device's session currently live" is now a property of
 * `AppState.currentUserId` alone (`null` = no live session), never of an
 * `AuthIdentity` row — a credential, once verified, stays verified forever;
 * only the device's *session* turns on and off. See `store.tsx`'s `signOut`
 * for the corrected mechanism.
 */
export interface AuthIdentity {
  id: ID;
  userId: ID;
  type: 'phone' | 'email' | 'google' | 'apple';
  identifier: string;
  verifiedAt: number;
  createdAt: number;
}

/** Identity context (RFC 0007/D44, corrected RFC 0012/D62-63) — the
 * platform's own authenticated person, distinct from `Customer` ("no login,
 * no roles, no global account"). A bare anchor as of the `AuthIdentity`
 * correction above — every credential fact (`phone`, `phoneVerifiedAt`) that
 * used to live directly on this row now lives on its own `AuthIdentity` row
 * instead, resolved by `userId`. What's left here is genuinely device-local
 * UI state, below the Foundation's own abstraction level (the same posture
 * `Business.nfcAvailabilityNudgeShown` already takes for its own one-time
 * marker) — not credential data, so it stays on `User` unchanged by this
 * amendment. */
export interface User {
  id: ID;
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
  /**
   * `authentication.md` §2.2 case 1's device-history check / §3.7e (Slice 12
   * `merchant-user-tester` defect fix, 2026-09-07; **generalized 2026-09-13,
   * `decision-log.md` D62/D63** — was "does this device remember a *phone
   * number* that previously held a session on it," now "does this device
   * remember a *different identity* having held a session on it — any
   * `AuthIdentity`, any type (phone, email, or Google)"). A plain local
   * marker (the same "below this document's abstraction level" treatment
   * `declinedInvitationIds` already gets), set exactly once, by
   * `resolveAuthIdentity` (`store.tsx`, shared by `verifyOtp`/
   * `verifyEmailOtp`/`resolveGoogleSignIn`), at the one moment this fact is
   * actually decidable: when a genuinely first-ever-anywhere credential
   * mints its own brand-new `User` row and `state.users` already holds at
   * least one other row at that instant — which, by construction, can only
   * be a *different* identity (this exact credential would otherwise have
   * matched an existing `AuthIdentity` row instead of minting a new one).
   * Never recomputed on a later re-verification of the same credential.
   * Cleared to `false` only by `confirmPhoneMismatch` ("Sí, es mío/mía,"
   * §3.7e) — the same "shown once ever" persisted-flag shape
   * `Business.nfcAvailabilityNudgeShown`/`pendingSubscriptionTierAcknowledged`
   * already use, chosen deliberately over an ephemeral React-state latch so
   * the "never ask twice" guarantee survives a reload landing between this
   * confirmation and `onboarding.md §3.5`'s own Business-creation write.
   * Deliberately a *separate* device fact from the session itself:
   * `signOut` (`settings.md §2.5`) only ever nulls `AppState.currentUserId`
   * — it never touches this field, which is exactly what lets this check
   * fire in the one situation it exists for (a signed-out device, re-
   * verified with a mistyped number/address, or a wrong Google account).
   * Field name kept as-is despite the generalized meaning — a rename here
   * would touch every existing call site for a purely cosmetic reason; the
   * doc comment is the source of truth for what it actually now means.
   */
  phoneMismatchConfirmationPending: boolean;
  /**
   * `decision-log.md` D69, `product-decisions.md` Q29 — optional,
   * self-service-editable, person-level (never per-`BusinessMembership`).
   * Captured two ways, same field either way: the OWNER at Onboarding's "Tu
   * negocio" screen (`onboarding.md` §2.2b/§3.9/§3.9a, a second,
   * independently-sequenced, non-blocking write — see `store.tsx`'s
   * `setUserDisplayName`), or a SELLER (or self-editing OWNER) via
   * `settings.md` §2.5/§3.3a/§3.3b "Tu cuenta" → "Tu nombre". Display
   * resolution reads this first, everywhere role-only copy used to render
   * unconditionally — "Vendiendo ahorita" (`reports.md` §3.4a), the sales
   * export's Vendedor column (§3.19), and "Tu equipo"'s team list
   * (`settings.md` §2.7/§3.11) — falling back to the pre-existing
   * role-only/phone copy only when unset. `null` = not set, the common case
   * for any existing User and for any new one who skips it at capture.
   * Real backend column: `public.users.display_name`
   * (`supabase/migrations/20260915120000_user_display_name.sql`) —
   * **disclosed limitation**: unlike every other Identity-context table in
   * this schema, `public.users` has no FK to `auth.users` (a phone-verified
   * User's `id` is a client-minted mock, never a real `auth.users` row —
   * `resolveAuthIdentity`'s own `realUserId` doc comment), so a name
   * written by a phone-verified merchant persists locally
   * (`applyWriteMirror`) but the real RPC call requires a genuine
   * `auth.uid()`, which phone auth doesn't yet produce
   * (`supabase/README.md`'s own disclosed Twilio-not-configured gap) — the
   * same pre-existing limitation every other real write in this file
   * already has for the phone channel, not a new one this field
   * introduces.
   */
  displayName: string | null;
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

/** Identity context, token-keyed (RFC 0013/`decision-log.md` D64 —
 * supersedes RFC 0008/D56's phone-keyed design) — a not-yet-accepted offer
 * to join a Business as a SELLER. Root, not an entity nested inside Business
 * — resolvable by `token` alone, before either a Business or a User is in
 * context, at link-open time (`peek_invitation`, before authentication even
 * runs). `role` is a closed set of one value (`'SELLER'`) — inviting a
 * second OWNER isn't a capability this Foundation describes anywhere, so no
 * picker is ever shown for it (`settings.md` §2.7). Unique on `token`,
 * globally. **The raw token itself is never a field on this type** — the
 * server mints and returns it once (`createInvitation`/`regenerateInvitation`
 * in `store.tsx`); only its hash is ever persisted, matching the backend's
 * own `token_hash`-only storage. `status`'s closed set narrows to
 * `pending | accepted | revoked` — `expired` is a read-time derivation
 * (`status === 'pending' && Date.now() > expiresAt`, `selectors.ts`'s
 * `invitationDisplayStatus`), never itself written.
 */
export interface Invitation {
  id: ID;
  businessId: ID;
  role: 'SELLER';
  status: 'pending' | 'accepted' | 'revoked';
  expiresAt: number;
  /**
   * OWNER-entered — originally a delivery/addressing aid only, "never
   * matched against the accepting User's identity" (RFC 0013 §1). **That
   * specific ruling is superseded by `product/99-rfc/0014-invitation-
   * target-hint-enforced.md` (Accepted, `decision-log.md` D70,
   * `product-decisions.md` Q30)** — required at `create_invitation()`
   * going forward (this field stays optional at the TypeScript level only
   * for a legacy, hint-less `pending` row created before D70 shipped, RFC
   * 0014's own backward-compatibility exemption), and now checked at
   * acceptance: the invited person authenticates specifically through the
   * Email method, pre-filled and locked to this exact value
   * (`authentication.md` §3.2g), and `accept_invitation()` rejects a
   * mismatch before its status CAS (`invitation_identity_mismatch`,
   * §3.10f). Still never promoted to `BusinessMembership`'s own canonical
   * identity, which stays `userId` — RFC 0013's point on *that* narrower
   * claim is unaffected.
   */
  targetHint?: { type: 'email'; value: string };
  acceptedByUserId?: ID | null;
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
   * and cleared together (`cancelPendingSubscriptionTierChange`, or the real
   * `land_pending_subscription_tier` RPC landing the change,
   * `reconcilePendingSubscriptionTier` in store.tsx) — never independently.
   * `null`/`false` when no change is pending, the common case.
   */
  pendingSubscriptionTier: 'free' | 'paid' | null;
  pendingSubscriptionTierEffectiveDate: string | null;
  pendingSubscriptionTierAcknowledged: boolean;
  /**
   * NFC Selling pass (Migration Workflow D43) — originally fed `home.md`
   * §3.6a's fourth Session-start variant, itself retired 2026-09-17
   * (`decision-log.md` D72). **Dead field as of D72, confirmed still dead
   * (no functional reader anywhere) by `decision-log.md` D79's own trace** —
   * kept in schema/type as inert historical data on any existing row (never
   * deleted, D25), no code path reads or writes it going forward.
   */
  nfcAvailabilityNudgeShown: boolean;
  /**
   * `settings.md` §2.8/§3.4 (`decision-log.md` D71, `product-decisions.md`
   * Q31) — the master per-product-opt-in toggle. Off by default even on an
   * already-Paid, already-`nfc`-capable Business (never a side effect of
   * "Activar plan de pago") — a deliberate opt-in, only offered while
   * `nfc ∈ registrationMode` (`subscriptionTier === 'paid'`). Turning it off
   * never resets any individual `Product.nfcTaggingEnabled` value — it only
   * withdraws *future* tag-assignment eligibility while it reads `false`,
   * per the composed NFC-tagging-eligible test (`selectors.ts`'s
   * `isNfcTaggingEligible`). **`decision-log.md` D79 — this is now the sole
   * NFC-related capability field on `Business`; `defaultSellingMode` (the
   * field this comment used to contrast it with) is retired outright, not
   * merely narrowed — see `Session.operatingMode`'s own retirement note
   * below for the matching Selling-side correction.**
   */
  nfcPerProductEnabled: boolean;
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
 * Root, Selling context (RFC 0009/D57, corrected by RFC 0010/D59) — how much
 * of a Product Ana has decided to bring/reserve for one specific Event, out
 * of the Business-wide shared pool. Not nested inside Event or Product —
 * resolving "what's allocated to this Event" and "what's allocated to this
 * Product, across every Event" are both real, independent query axes
 * (`events.md` §3.21's own "Disponible en general" figure needs the
 * second). Unique on `(eventId, productId)` — real, plain SQL uniqueness
 * server-side, not merely a client-side filter (`save_event_allocations`,
 * `scan_unit_into_event_allocation`, `reallocate_event_allocation` all
 * mint-or-find by `(eventId, productId)` alone, never additionally filtering
 * on `status`, since a row's identity for this pair never changes across
 * its `open`/`reconciled` lifecycle).
 *
 * **`quantityRemaining` is retired as a stored field (RFC 0010/D59)** — the
 * old counter (`quantityRemaining > 0` compare-and-swap) never touched
 * `InventoryUnit.status`, so any consumption path that didn't explicitly
 * check it (Quick Sale's FIFO, another Event's own commitment) could still
 * consume stock a merchant believed reserved — a confirmed, reproduced
 * defect. The actual selling gate is now the ordinary `available`-status
 * filter every consumption path already applies: the server's private
 * `_fifo_commit_to_allocation` helper performs a real, row-level conditional
 * flip (`available` [`AND untagged` for FIFO mode] → `reserved`) into a real
 * join table, `EventAllocationUnit` (below) — so a committed unit genuinely
 * stops being `available` the moment it's committed. `quantityRemaining` is
 * a read-time derivation only (`selectors.ts`): the count of this
 * allocation's `EventAllocationUnit` rows whose unit is still `reserved`
 * *and* not yet claimed by any open Sale (`SaleItem`) — the second
 * condition is what makes allocated stock genuinely sellable, Phase 2b's own
 * extension to `add_item_to_sale`/`add_item_to_sale_by_tag`.
 *
 * `quantityAllocated` is a monotonic, hard-committed lifetime total for
 * `unitSource='fifo_assignment'` commitments only (RFC 0009's own
 * ubiquitous-language: "manual mode... the running total ever allocated") —
 * incremented only by a FIFO commit, never decremented by a release.
 *
 * `quantityPlanned` (RFC 0010 §2) is soft intent only — freely settable,
 * zero effect on the shared pool, never read by any gate. Not yet surfaced
 * in any built UI (Slice B, deferred) — defaults to `0` and stays there.
 */
export interface EventAllocation {
  id: ID;
  eventId: ID;
  productId: ID;
  quantityPlanned: number;
  quantityAllocated: number;
  status: 'open' | 'reconciled';
  createdAt: number;
}

/**
 * Internal-only entity owned by `EventAllocation` (Stage 7 Backend
 * Integration, Phase 2b) — the real, row-level mirror of the server's
 * `event_allocation_units` table, and the D59-mandated replacement for this
 * type's own earlier `EventAllocation.allocatedUnitIds` array field (retired
 * — an array column can't support the indexed, lockable `SELECT ... FOR
 * UPDATE` the server's own release/compare-and-swap logic needs).
 * **Append-only, both server- and client-side** — a release only ever
 * changes the referenced `InventoryUnit.status`, never removes or mutates a
 * row here. `unitSource` records how the unit entered this allocation
 * (`'scan'` — NFC allocation-time exclusivity, `events.md` §3.22; or
 * `'fifo_assignment'` — manual/FIFO commitment, `events.md` §3.21/§3.23) —
 * both are real and populated as of Phase 2b, unlike the pre-Phase-2b build
 * where NFC-scan allocation was entirely unmodeled.
 */
export interface EventAllocationUnit {
  id: ID;
  eventAllocationId: ID;
  unitId: ID;
  unitSource: 'scan' | 'fifo_assignment';
  committedAt: number;
}

/**
 * Internal-only entity owned by `EventAllocation` (RFC 0009 §2, corrected
 * RFC 0010/D59) — one row per discrete write action against an
 * `EventAllocation`'s committed set, written unconditionally by the server's
 * private `_fifo_commit_to_allocation`/`_release_from_allocation` helpers.
 * Mirrored client-side (read-only — this build never writes to it directly)
 * from each RPC's own returned movement fields. `events.md` §3.16's Approved
 * reconciliation UI reads `unitSource`/`quantityExpected` directly (the "Ya
 * revisaste esto" ledger existence-check, the confirmed/expected split in
 * the ambient confirmation copy).
 *
 * `unitSource` records how the units this movement affected relate to
 * `EventAllocationUnit.unitSource` above — both `'scan'` and
 * `'fifo_assignment'` movements are real as of Phase 2b. `quantityExpected`
 * is populated only on a manual-mode reconciliation write
 * (`type = 'return_to_general'`, `unitSource = 'fifo_assignment'`,
 * `reconcile_manual_allocation`) — `null` on every other movement, including
 * NFC's own `return_to_general` rows and an ordinary mid-Event `adjustment`.
 * `counterpartEventAllocationId` is populated on `reallocate_in`/
 * `reallocate_out` pairs (`reallocate_event_allocation`), `null` otherwise.
 */
export interface AllocationMovement {
  id: ID;
  eventAllocationId: ID;
  type:
    | 'initial_allocation'
    | 'replenish'
    | 'reallocate_in'
    | 'reallocate_out'
    | 'return_to_general'
    | 'adjustment';
  unitIds: ID[];
  quantityDelta: number;
  unitSource: 'scan' | 'fifo_assignment';
  quantityExpected: number | null;
  counterpartEventAllocationId: ID | null;
  createdAt: number;
}

/**
 * Root, Selling context (`product/99-rfc/0011-event-assignment.md`,
 * `decision-log.md` D60) — a standing record that a specific
 * `BusinessMembership` is expected to sell at a specific `Event`, created by
 * an OWNER ahead of Session-open (a roster/schedule fact, not a
 * selling-time mechanism). Not nested inside Event or BusinessMembership —
 * "which Memberships are assigned to this Event" (an OWNER's own staffing
 * view, `src/screens/Events/PersonalParaEsteEvento.tsx`) and "which Events
 * is this Membership assigned to" (the SELLER-side Session-open filter,
 * `home.md` §2) are both real,
 * independent query axes (RFC 0011 §1). Unique on `(eventId, membershipId)`
 * — assigning the same Membership to the same Event twice is a no-op against
 * the existing row (`createEventAssignment`, `store.tsx`), never a
 * duplicate.
 *
 * **Plain-delete, no `status` field** — a deliberate departure from this
 * Foundation's usual soft-state discipline (`BusinessMembership.status`,
 * `Invitation.status`, `EventAllocation.status`), justified because no
 * downstream write ever references an `EventAssignment` row directly: the
 * actual selling mechanism (`Session.eventId`, `Sale.performedByMembershipId`)
 * resolves through entirely separate, already-established linkages this RFC
 * doesn't touch (RFC 0011 §1).
 *
 * **Never gates `Session.eventId`, never a new write path for it, never a
 * gate on an OWNER's own Event-picking** — filters only the SELLER-side
 * Session-open picker (`home.md` §2's role-scoped qualifying-Event check,
 * `selectors.ts`'s `qualifyingEventsForMembership`).
 *
 * **Scheduling-conflict handling (RFC 0011 §2): warn, never block.**
 * Assigning the same Membership to two date-overlapping Events is a
 * legitimate business-judgment call for the assigning OWNER, not a
 * system-resolution-ambiguity or physical-exclusivity case (contrast
 * `decision-log.md` D17, contrast `EventAllocation`'s own invariant, D57) —
 * `hasSchedulingConflict` (`selectors.ts`) is a pure read-side check that
 * `src/screens/Events/PersonalParaEsteEvento.tsx` consults;
 * `createEventAssignment` itself never blocks a write on it.
 *
 * `businessId` is carried directly, unlike this prototype's existing
 * single-Business convention for sibling Selling types (`Venue`, `Event`,
 * `EventAllocation` all omit it) — RFC 0011/D60's own schema requires it
 * explicitly ("same tenant-scoping discipline every other aggregate root
 * carries"), since the not-yet-built OWNER-side UI may need to query by it
 * directly rather than resolving it indirectly through `eventId`.
 */
export interface EventAssignment {
  id: ID;
  businessId: ID;
  eventId: ID;
  membershipId: ID;
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
  /**
   * Optional manufacturer/packaging barcode (`decision-log.md` D65,
   * `inventory.md` §3.8b-§3.8e). Unique per Business (enforced server-side
   * by `products_barcode_unique_idx`, a partial unique index so multiple
   * `null`s never collide) — never globally unique, since two different
   * Businesses' own stock is never meant to conflict. **Written only from
   * two Inventory-owned surfaces, both in this document** — the original
   * capture at Registrar Mercancía (`inventory.md` §3.8b's "vía escaneo"
   * path, via `commitLot`, captured once, silently, the first time a
   * barcode resolves to a new Product identity) and, as of D65's
   * 2026-09-16/17 amendment, a correction path (`inventory.md`
   * §3.4c-§3.4g, "Editar código de barras," Paid tier only, via
   * `update_product_barcode`) that replaces the stored value outright — no
   * merge, no history — matching `defaultPrice`/`photo`'s existing "plain
   * mutable current scalar" posture. Selling still only ever reads it
   * read-only (`home.md` §3.9a/§3.9b, `architecture-principles.md` #6);
   * this field is never written from Selling.
   */
  barcode?: string;
  /**
   * `inventory.md` §3.4's fifth Catalog-row tap zone (`decision-log.md`
   * D71, `product-decisions.md` Q31) — this Product's own opt-in into the
   * composed NFC-tagging-eligible test (`selectors.ts`'s
   * `isNfcTaggingEligible`), only ever meaningful while
   * `Business.nfcPerProductEnabled = true`. Mutually exclusive with
   * `barcode` by construction, enforced server-side too
   * (`set_product_nfc_tagging_enabled` rejects enabling on a barcoded
   * Product; `update_product_barcode` clears this flag in the same write
   * whenever it saves a fresh barcode on a Product currently `true`) — a
   * Product is barcode-identified or NFC-tagging-eligible, never both.
   * Turning it (or the Business-level toggle) off never untags or orphans
   * an already-tagged `InventoryUnit` of this Product — only *future*
   * eligibility stops, the same invariant `Business.nfcPerProductEnabled`'s
   * own doc comment states.
   */
  nfcTaggingEnabled: boolean;
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

/**
 * `decision-log.md` D77, `product/99-rfc/0015-inventory-unit-removal.md`
 * (Accepted) — `removed` is a new terminal status, parallel to `sold`: a
 * unit that leaves sellable stock without going through a Sale (mistyped
 * registration, defective units returned to supplier), written only via
 * "Cantidad actual" (`inventory.md` §3.6/§3.7). `available -> removed`
 * only, never from `reserved` (Selling's own in-flight write — Inventory
 * must never reach into it, `product/99-rfc/0010`'s own discipline).
 */
export type InventoryUnitStatus = 'available' | 'reserved' | 'sold' | 'removed';

export interface InventoryUnit {
  id: ID;
  productId: ID;
  lotId: ID;
  status: InventoryUnitStatus;
  receivedAt: number; // inherited from Lot.receivedAt — drives FIFO ordering (D5)
  /**
   * Asignar Tags (`inventory.md` §3.14-§3.17, Migration Workflow D43) —
   * **the identifier of this unit's one *open* `NFCTag` attachment**, or
   * `null` when it has none. Modeled here as a nullable scalar rather than a
   * client-side `NFCTag` entity: server-side `nfc_tags` is a real table, and
   * this field is the flattened result of a join the hydration boundary
   * already narrows to open rows (`store.tsx`'s `hydrateFromBackend`,
   * `hydrationMapping.ts`'s `mapUnitRow`).
   *
   * `null` = untagged (every unit `commitLot` mints starts here, regardless
   * of `nfc` capability — tagging is optional at the capability level, never
   * a precondition for `status = 'available'`, `inventory.md` §8 item 2/Q2).
   *
   * **`decision-log.md` D83 / RFC 0018 — no longer "a 1:1 NFCTag attribute,"
   * and no longer set exactly once.** `NFCTag` became an attachment record
   * with an explicit validity window (`assignedAt -> detachedAt`); the
   * invariant is "at most one *open* attachment per unit and per
   * `(businessId, tagIdentifier)`," with closed rows kept as history that
   * collides with nothing. This scalar therefore tracks the open window
   * only, and it genuinely does change after its first write, by exactly two
   * routes, both mirrored in `store.tsx`: `available -> removed` (D77/D78)
   * clears it, and re-attaching the same identifier to a new unit clears it
   * on the prior holder while setting it on the new one.
   *
   * **Non-null does not mean "on hand."** A `sold` unit deliberately keeps
   * an *open* attachment — `finalize_sale` never detaches, because the
   * moment a customer peels a tag off is unobservable, and D10's claim
   * resolution reads that very row. Open means "not superseded"; possession
   * is `status`, which is why D80/D81/D82's selectors all scope by `status`
   * and must keep doing so.
   */
  tagId: string | null;
}

/** Selling context */

/**
 * `Session.operatingMode` — removed entirely, `decision-log.md` D79
 * (`product/99-rfc/0017-nfc-composable-selling-capability.md`). It used to
 * resolve once at Session-open (buttons-vs-nfc, immutable for the Session's
 * lifecycle) and gate which selling surface rendered; D79 retires it
 * outright, no replacement field, since every Session now shows one
 * unconditional composable surface (buttons + barcode + NFC overlays, each
 * gate re-evaluated live on every render — `home.md` §3.9). The Supabase
 * `sessions.operating_mode` column stays in the schema as inert historical
 * data (never deleted, D25) but no client code reads or writes it as of
 * this change.
 */
export interface Session {
  id: ID;
  // Generalized from a hardcoded `null` (Eventos build, D43) — `null` for a
  // Quick Session, or the Event this Session's Día belongs to. Never
  // retroactively assignable — a Session only ever gets an `eventId` through
  // Home's own resolution at open time (`home.md` §2, `events.md` §2's "note
  // on what Session→Event linking is, and isn't").
  eventId: ID | null;
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
  /** `decision-log.md` D67 — which open `EventAllocation`, if any, this unit
   * was consumed from, captured once by `add_item_to_sale`/
   * `add_item_to_sale_by_tag`'s own allocation-aware branch (the one moment
   * this fact is actually and unambiguously known). `undefined` for a plain-
   * pool sale. Read back unchanged by `removeSaleItem`/`cancelSale` to decide
   * the released unit's revert target — never re-derived from
   * `eventAllocationUnits`, which is append-only and can't distinguish a
   * still-live commitment from a long-reconciled one. */
  eventAllocationId?: ID;
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
  /** RFC 0012/D62-63 — see `AuthIdentity`'s own doc comment above. */
  authIdentities: AuthIdentity[];
  /** `null` whenever this device holds no live verified session — the
   * genuine pre-Authentication state, per `authentication.md` §2.1. Resolve
   * the actual row via `selectors.ts`'s `currentUser`, never by indexing
   * `users` directly. **Corrected, RFC 0012/D62-63:** previously stayed
   * non-`null` even after `signOut` (only `User.phoneVerifiedAt` flipped);
   * now `signOut` nulls this directly — `AuthIdentity.verifiedAt` is
   * permanent once set (a credential, once verified, stays verified
   * forever), so "is this device's session currently live" needs its own,
   * separate on/off signal, and this is it. */
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
  /** RFC 0009/D57, corrected RFC 0010/D59 — see `EventAllocation`'s own doc
   * comment above. */
  eventAllocations: EventAllocation[];
  /** Stage 7 Backend Integration, Phase 2b — see `EventAllocationUnit`'s own
   * doc comment above. Replaces the retired `EventAllocation.allocatedUnitIds`
   * array field. */
  eventAllocationUnits: EventAllocationUnit[];
  /** RFC 0010/D59 — see `AllocationMovement`'s own doc comment above. */
  allocationMovements: AllocationMovement[];
  /** RFC 0011/D60 — see `EventAssignment`'s own doc comment above. */
  eventAssignments: EventAssignment[];
}
