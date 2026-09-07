import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { makeId } from './id';
import { addDaysToKey, dateKey, todayKey } from './dates';
import { actingMembership, currentUser, eventAllocationFor, eventStatus, findMembership, myActiveSession, nfcCapable, nfcReadiness } from './selectors';
import type {
  AppState,
  Business,
  BusinessMembership,
  Event,
  EventAllocation,
  EventType,
  ID,
  Invitation,
  InventoryUnit,
  InventoryUnitStatus,
  Product,
  Sale,
  SaleItem,
  Session,
  SessionOperatingMode,
  User,
  Venue,
} from './types';

/**
 * Exported (demo-mode.md §8 item 8) so `restartDemo.ts`'s own "clear both
 * storage keys, then reload" mechanism reuses this constant directly instead
 * of a second, independently-hardcoded copy of the same string literal that
 * could silently drift from this one if it's ever renamed here.
 */
export const STORAGE_KEY = 'nahui-hifi-prototype-v1';

/**
 * Genuine pre-Authentication state — no verified User, no Business, no
 * Membership. Replaces this build's earlier hardcoded-Business workaround
 * ("Luna Mercado," pre-seeded because Onboarding was out of scope) now that
 * Authentication → Onboarding is real, per this pass's own task. This is
 * also what `resetPrototype()` returns to, which is what makes a full,
 * repeated Authentication → Onboarding → Home walkthrough possible again
 * (named as a real gap in `BACKLOG.md`'s "what's built" entry before this
 * pass).
 */
function initialState(): AppState {
  return {
    users: [],
    currentUserId: null,
    business: null,
    memberships: [],
    invitations: [],
    products: [],
    lots: [],
    entries: [],
    units: [],
    sessions: [],
    sales: [],
    venues: [],
    events: [],
    priceOverrides: [],
    eventAllocations: [],
  };
}

/** Legacy-shape read (localStorage written before Slice 12's `users[]`/
 * `currentUserId` refactor) — `currentUser` was the single-slot field this
 * migration replaces. Kept as a narrow, explicitly-typed escape hatch for
 * `loadState`'s own migration branch only, never used elsewhere. */
interface LegacyAppStateShape extends Omit<AppState, 'users' | 'currentUserId' | 'invitations' | 'eventAllocations'> {
  currentUser?: User | null;
  users?: User[];
  currentUserId?: ID | null;
  invitations?: Invitation[];
  eventAllocations?: EventAllocation[];
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LegacyAppStateShape;
      // minimal shape guard — a corrupt/old localStorage value never crashes
      // the app. `business` is legitimately `null` pre-Onboarding now, so
      // the guard checks array-shaped fields and either identity-shape's own
      // key presence instead of truthiness of `business`.
      if (
        parsed &&
        Array.isArray(parsed.products) &&
        Array.isArray(parsed.memberships) &&
        ('currentUser' in parsed || 'users' in parsed)
      ) {
        // Slice 12 migration — `currentUser: User | null` → `users: User[]` +
        // `currentUserId: ID | null` (the Architecture Gap Analysis's own
        // foundational unblocker, `context/q24-q25-first-slice.md`). A
        // localStorage value written before this pass has `currentUser`
        // only; one already migrated has `users`/`currentUserId` only. Never
        // both real at once in practice, but this reads whichever is
        // present rather than assuming.
        // ux-critic fix round — an older saved `User` row (before the
        // "Ahora no" persistence fix) has no `declinedInvitationIds` key at
        // all; defaulted to `[]`, the same honest "nothing declined yet"
        // starting value `verifyOtp` now writes for a brand-new row.
        const users: User[] = (
          Array.isArray(parsed.users) ? parsed.users : parsed.currentUser ? [parsed.currentUser] : []
        ).map((u) => ({ ...u, declinedInvitationIds: u.declinedInvitationIds ?? [] }));
        const currentUserId: ID | null =
          parsed.currentUserId !== undefined ? parsed.currentUserId : (parsed.currentUser?.id ?? null);

        // Backward-compat with localStorage written before the Eventos pass
        // (D43) — an older saved state simply has no venues/events/
        // priceOverrides keys at all. Defaulting them to empty arrays here
        // (rather than rejecting the whole saved state) is what lets an
        // existing walkthrough resume normally instead of silently losing
        // Authentication/Onboarding/Catalog/Sale history it already has.
        // Same treatment, one level deeper, for the Configuración pass
        // (D43): an older saved `business` object has no pending-change
        // triple at all — defaulted here (`!= null` reads already used
        // throughout this file treat `undefined` and `null` identically, but
        // patching it here keeps a re-serialized state honestly typed).
        const venues = Array.isArray(parsed.venues) ? parsed.venues : [];
        const events = Array.isArray(parsed.events) ? parsed.events : [];
        const priceOverrides = Array.isArray(parsed.priceOverrides) ? parsed.priceOverrides : [];
        const invitations = Array.isArray(parsed.invitations) ? parsed.invitations : [];
        const eventAllocations = Array.isArray(parsed.eventAllocations) ? parsed.eventAllocations : [];

        // Slice 12 — an older saved Membership has no `status`/`revokedAt`
        // at all; defaulted to `active`/`null`, the same honest "nothing
        // revoked yet" starting value `completeOnboarding`/`acceptInvitation`
        // now write for a brand-new row.
        const memberships: BusinessMembership[] = parsed.memberships.map((m) => ({
          ...m,
          status: m.status ?? 'active',
          revokedAt: m.revokedAt ?? null,
        }));

        // Slice 12 — an older saved Session has no `openedByMembershipId` at
        // all (the disclosed prototype-only field, see `types.ts`'s own doc
        // comment). Every pre-Slice-12 walkthrough only ever produced an
        // OWNER Membership, so that row — if exactly one exists — is the
        // only honest guess; falls back to `''` (never crashes, simply
        // un-attributable) if that assumption doesn't hold for some reason.
        const soleOwnerId = memberships.find((m) => m.role === 'OWNER')?.id ?? '';
        const sessions: Session[] = Array.isArray(parsed.sessions)
          ? parsed.sessions.map((s) => ({ ...s, openedByMembershipId: s.openedByMembershipId ?? soleOwnerId }))
          : parsed.sessions;
        const sales: Sale[] = Array.isArray(parsed.sales)
          ? parsed.sales.map((sa) => ({ ...sa, performedByMembershipId: sa.performedByMembershipId ?? soleOwnerId }))
          : parsed.sales;

        return {
          ...parsed,
          users,
          currentUserId,
          memberships,
          invitations,
          sessions,
          sales,
          venues,
          events,
          priceOverrides,
          eventAllocations,
          // Backward-compat with localStorage written before the Asignar
          // Tags pass (D43/Migration Workflow) — an older saved unit has no
          // `tagId` key at all. Defaulted to `null` (untagged), the same
          // value every unit already starts at via `commitLot` — an existing
          // walkthrough resumes as a fully untagged, resumable tagging queue
          // rather than losing its Inventory history.
          units: Array.isArray(parsed.units)
            ? parsed.units.map((u) => ({ ...u, tagId: u.tagId ?? null }))
            : parsed.units,
          business: parsed.business
            ? {
                ...parsed.business,
                pendingSubscriptionTier: parsed.business.pendingSubscriptionTier ?? null,
                pendingSubscriptionTierEffectiveDate: parsed.business.pendingSubscriptionTierEffectiveDate ?? null,
                pendingSubscriptionTierAcknowledged: parsed.business.pendingSubscriptionTierAcknowledged ?? false,
                // NFC Selling pass (D43) — an older saved Business has no
                // `nfcAvailabilityNudgeShown` key at all; defaulted to
                // `false` (not yet shown), the same honest "never seen it
                // yet" starting value `completeOnboarding` writes for a
                // brand-new Business.
                nfcAvailabilityNudgeShown: parsed.business.nfcAvailabilityNudgeShown ?? false,
              }
            : parsed.business,
        };
      }
    }
  } catch {
    // ignore — fall through to a fresh state, same "never a dead end" posture
    // every 02-ux spec applies to a defensive fallback
  }
  return initialState();
}

export interface Receipt {
  saleId: ID;
  total: number;
  itemCount: number;
  businessName: string;
  businessLogo?: string;
  subscriptionTier: 'free' | 'paid';
  /** `home.md` §3.8f/`decision-log.md` D22 — the Paid-tier Claim Token,
   * generated automatically at Sale finalization whenever
   * `subscriptionTier=paid` (D40), `undefined` (structurally absent, not
   * merely hidden) for Free tier. An opaque, mock, non-cryptographic
   * transformation of `Sale.id` — deliberately never the raw Sale ID in
   * cleartext, per D22's "never the raw Sale ID" spirit — and, per
   * `product-decisions.md` Q15, purely ephemeral: it lives only on this
   * in-memory `Receipt` return value, never written to `Sale`/`AppState`/
   * `localStorage` (see `mintClaimToken`'s own doc comment below). */
  claimToken?: string;
}

/**
 * A deliberately unsophisticated, opaque mock token — real cryptographic
 * signing is out of scope for a backend-less prototype (this pass's own
 * dispatching task). Folds `openSale.id`, `business.id`, and the
 * finalization timestamp through a small non-cryptographic string hash
 * (djb2) rather than concatenating/encoding them directly, so the token
 * itself never contains a recognizable, reversible fragment of the raw
 * Sale ID — the specific thing D22 rules out ("never the raw Sale ID").
 * Base36-encoded to stay short and QR-friendly. Collision-resistance and
 * unguessability are explicitly not load-bearing here — nothing downstream
 * in this prototype (there is no downstream; the destination flow is a
 * separate, confirmed-unbuilt deploy target per D38) ever validates or
 * looks this token up.
 */
function mintClaimToken(saleId: ID, businessId: ID, finalizedAt: number): string {
  const raw = `${saleId}:${businessId}:${finalizedAt}`;
  let hash = 5381;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash * 33) ^ raw.charCodeAt(i);
  }
  // unsigned, base36, padded — an opaque-looking short token, not a literal
  // encoding of any single input field.
  return (hash >>> 0).toString(36);
}

/**
 * A pending Lot line at "Guardar mercancía" time. `product` either points at
 * an already-real Product (`existing`) or carries the not-yet-written
 * identity of a Product created in the "¿Qué llegó?" picker this same visit
 * (`new`) — the picker never writes to the store itself (inventory.md
 * §3.8a/§3.9: nothing is real until this atomic write).
 */
export interface CommitLotLine {
  quantity: number;
  product:
    | { kind: 'existing'; productId: ID }
    /** `photo` (`product-decisions.md` Q23) — optional, only meaningful for
     * a to-be-minted Product; an `existing` line never carries one, since an
     * already-real Product's photo is managed separately via
     * `setProductPhoto` (`inventory.md` §3.4b), never re-asked at receiving
     * time. */
    | { kind: 'new'; name: string; defaultPrice: number; photo?: string };
}

/**
 * `onboarding.md` §2.2's three-way capability table. Note: this `'demo'`
 * value is the Onboarding "Ver un ejemplo" path — unrelated to the separate
 * Demo Mode validation-campaign build gate in `src/screens/DemoMode/`
 * (`DemoModeGate`/`DemoModeGateActive`), which reuses the same "demo" token
 * for a different, build-time concept. No shared imports or storage keys;
 * this comment exists only to disambiguate at a grep/read level.
 */
export type OnboardingPath = 'free' | 'paid' | 'demo';

/**
 * A pending Venue selection at "Guardar evento" time (`events.md` §3.6/§3.7)
 * — the exact structural mirror of `CommitLotLine.product` above. `existing`
 * points at an already-real Venue (tapped from Elegir lugar's list);
 * `new` carries a not-yet-written `displayName` typed into the same picker's
 * "+ Agregar... como lugar nuevo" row. Nothing is written to `state.venues`
 * until `createEvent`'s own atomic transaction resolves it — the identical
 * "nothing is real until the atomic write" discipline this codebase's own
 * `ProductPicker` premature-write Blocker fix already established (see
 * docs/passes/slice-1-home-inventario.md), applied here preventively rather
 * than found as a bug.
 */
export type VenueRef = { kind: 'existing'; venueId: ID } | { kind: 'new'; displayName: string };

interface StoreValue {
  state: AppState;
  /** authentication.md §3.7 (Confirmar) — mock verification: any 6-digit
   * code is accepted (RFC 0007 §5's own suggested simplification, disclosed
   * in docs/passes/slice-2-authentication-onboarding.md). Creates the device's `User` row on a first-ever
   * verification, or resolves the existing one on a returning verification
   * for the same phone. Returns the resolved User. */
  verifyOtp: (phone: string, code: string) => User;
  /** onboarding.md §3.5 "Creando tu negocio" — the atomic Owner-creation
   * write (RFC 0007/D44): creates the Business (capabilities per `path`,
   * §2.2's table) and an OWNER BusinessMembership in the same state update,
   * gated on `currentUser.phoneVerifiedAt != null`. Returns the new
   * Business's id, or `null` if the precondition isn't met (defensive —
   * unreachable through the real UI flow, which never calls this before
   * verification succeeds). `Business.name` starts `''` (see types.ts) —
   * identity is a separate, later write (`setBusinessIdentity`). */
  completeOnboarding: (path: OnboardingPath) => ID | null;
  /** onboarding.md §3.10 "Guardando tu negocio" — additive identity fields
   * on the already-existing Business (§2.2b), a separate write from
   * `completeOnboarding`'s own capabilities write, per that section's own
   * reasoning (own idempotency key, own retry surface). */
  setBusinessIdentity: (fields: { name: string; logo?: string; description?: string }) => void;
  /** onboarding.md §3.6 "Todo listo" — marks the milestone dismissed
   * (tapped "Entrar," or auto-continued). See `Business.onboardingAcknowledged`. */
  acknowledgeOnboarding: () => void;
  /** inventory.md §3.8a/§3.9 "Guardar mercancía," and — as of
   * `product-decisions.md` Q20 — onboarding.md §2.2a/§3.5b–§3.5e "Guardando
   * lo que vendes" as well: the one atomic write that mints any genuinely
   * new Product identities and their Lot/InventoryEntry/InventoryUnit set
   * together. Onboarding's "Define lo que vendes" step used to call a
   * separate, Product-only `createProducts` write (no stock); Q20 retired
   * that mechanism in favor of this one, since a first-run Catalog's lines
   * are always to-be-minted Products, never an `existing` match. Returns
   * the resolved productId for each line, same order as input — a
   * freshly-minted id for `new` lines, the given id for `existing` ones. */
  commitLot: (lines: CommitLotLine[]) => ID[];
  /** inventory.md §3.4a "Editar precio" — the Catalog-row-level
   * `Product.defaultPrice` write. No idempotency key is currently generated
   * for this write, despite `inventory.md` §3.4a's own prose previously
   * (inaccurately) claiming otherwise. Same pre-existing gap as
   * `commitLot()`/`setProductPhoto` (`BACKLOG.md` §F); a stated
   * `architecture-principles.md` #7 guarantee this implementation doesn't
   * yet satisfy, not fixed here — Stage 7 (Backend Integration) owns it. */
  editPrice: (productId: ID, newPrice: number) => void;
  /** inventory.md §3.4b "Guardar foto" (`product-decisions.md` Q23) — the
   * Catalog-row-level `Product.photo` write, same shape as `editPrice`
   * immediately above. `undefined` writes a removal ("Quitar" staged, then
   * committed). No idempotency key is currently generated for this write —
   * a doc comment here previously (inaccurately, copied from `editPrice`'s
   * own now-corrected claim) said otherwise. Same pre-existing gap as
   * `commitLot()`/`editPrice` (`BACKLOG.md` §F); a stated
   * `architecture-principles.md` #7 guarantee this implementation doesn't
   * yet satisfy, not fixed here — Stage 7 (Backend Integration) owns it. */
  setProductPhoto: (productId: ID, photo: string | undefined) => void;
  /** inventory.md §3.14 — Asignar Tags' own write, one scan at a time
   * (`addItemToSale`'s per-event-write shape, not `commitLot`'s batch
   * shape). "Next pending unit" = first entry in `state.units` (existing
   * array order — already matches §3.14's "in the order she entered them")
   * where `status === 'available' && tagId == null`. Global across every
   * Lot/Product (`inventory.md` §2 step 2's own business-wide gate), never
   * scoped to the Lot that was just registered. `already-assigned` is
   * checked before `queue-empty` — a business-logic conflict (§3.15) is
   * distinct from there being nothing left to tag (§2 step 4/§3.13). */
  assignTagToNextPendingUnit: (
    tagId: string,
  ) =>
    | { ok: true; unitId: ID; productId: ID }
    | { ok: false; reason: 'already-assigned' }
    | { ok: false; reason: 'queue-empty' };
  /** events.md §3.6 "Guardar evento" — the atomic Event-creation write.
   * Resolves `venue` (mint-or-find, `resolveVenue`'s own logic) inside the
   * same transaction. **The D17 overlap check this write once re-ran
   * defensively is removed outright, not merely relaxed (`decision-log.md`
   * D53, Slice 12) — simultaneous multi-Event operation is a real,
   * supported case now; there is nothing left for this write to reject a
   * save for.** Always succeeds — returns the new Event's id directly, the
   * same unwrapped-return shape `commitLot` already uses for a write that
   * structurally cannot fail in this mock. */
  createEvent: (fields: {
    venue: VenueRef;
    type: EventType;
    startDate: string;
    endDate: string;
    bazaarCost: number;
  }) => ID;
  /** events.md §3.12 — sets `cancelledAt`; only meaningful while the
   * Event's *computed* status is still `scheduled` (§2, §3.11). */
  cancelEvent: (eventId: ID) => void;
  /** events.md §3.20 (D33) — writes/updates this Event's Price Override for
   * one Product. Defensively re-checks the Event's computed status is still
   * `scheduled` at write time (§3.20: "unreachable at all once active, not
   * just hidden") — a no-op if it isn't, never a thrown error, matching this
   * codebase's existing defensive-guard style (`startSession`, `finalizeSale`). */
  setPriceOverride: (eventId: ID, productId: ID, overridePrice: number) => void;
  /** home.md §2 / events.md §2 — `eventId` is optional; omitted (or `null`)
   * for a Quick Session, exactly as before. **Corrected for Slice 12's
   * multi-staff scope:** the guard is no longer "any active Session,
   * Business-wide, blocks a new one" — it's scoped to this device's own
   * acting Membership (`actingMembership`, `selectors.ts`), since two
   * different Memberships now genuinely can each hold their own
   * concurrently-open Session (`product-decisions.md` Q24/Q25). Writes
   * `Session.openedByMembershipId` (see that field's own `types.ts` doc
   * comment). **NFC Selling pass (D43):** `overrideToNfc` is Ana's own Limited Ready
   * override choice (§3.6a's "Usar tags de todos modos"), resolved locally
   * in the UI *before* this tap (`useNfcSessionStart.ts`) and threaded
   * through here — it can't be derived from stored state, since it's a
   * one-off, per-tap choice, never persisted. Defaults to `false` (no
   * override) so every other existing call site stays correct with no
   * change. `Session.operatingMode` itself is now resolved for real inside
   * this function (see its own body) rather than hardcoded — the same
   * "never trust a UI-computed value, recheck defensively at the write"
   * posture `setPriceOverride` above already establishes. */
  startSession: (eventId?: ID | null, overrideToNfc?: boolean) => void;
  /** home.md §3.8a/§3.9 — FIFO tap-to-add (Buttons mode). **Slice 12
   * additions:** resolves this device's own acting Membership's Session
   * (`myActiveSession`, never the bare "any active Session" read), stamps
   * the Sale's own `performedByMembershipId` the moment its first item is
   * appended (`decision-log.md` D58), and — whenever this Session's Event
   * has an `open` `EventAllocation` for this Product — performs the
   * Physical-location-exclusivity invariant's mechanism (b): a
   * compare-and-swap on `EventAllocation.quantityRemaining > 0`, layered on
   * top of the ordinary FIFO consumption below (RFC 0009/D57). Returns
   * `false` (no-op) exactly when that gate fails, the identical shape "no
   * FIFO candidate" already returns — defensively unreachable through the
   * real UI, since the tile itself already dims to "0 en este evento" at
   * that exact threshold (`home.md` §3.9), same posture every other guard
   * in this file already applies. */
  addItemToSale: (productId: ID) => boolean;
  /** home.md §3.10 — the nfc-mode counterpart to `addItemToSale` above:
   * resolves the *specific* scanned unit (`tagId` match) rather than
   * `addItemToSale`'s FIFO oldest-unit selection, reusing its identical
   * price-resolution/Sale-creation logic otherwise. Mirrors
   * `assignTagToNextPendingUnit`'s discriminated-result shape. `'no-match'`
   * covers the genuinely open gap `product/02-ux/product-decisions.md` Q2
   * names (a scan that matches no `available` tagged unit) — this build
   * never invents a resolution UI for it (see `Selling.tsx`'s own caller),
   * only guarantees the write path itself never silently does the wrong
   * thing. */
  addItemToSaleByTag: (
    tagId: string,
  ) =>
    | { ok: true; unitId: ID; productId: ID }
    | { ok: false; reason: 'no-active-session' }
    | { ok: false; reason: 'no-match' };
  /** home.md §3.8a's "Quitar de la venta" — the single, always-offered tap
   * that resolves a lost-race conflict marker (§3.8a extended, §3.8d-i,
   * §3.8d-ii, `product-decisions.md` Q24/Q25), and the only per-item
   * removal path in this file (`cancelSale` below still clears the whole
   * open Sale at once — a different, pre-existing action). Reverts the
   * item's own `InventoryUnit` to `available` (never leaves an orphaned
   * `reserved` unit) but deliberately does **not** restore any
   * `EventAllocation.quantityRemaining` — a genuinely lost-race unit was
   * (in the real, backend-integrated world this state depicts) already
   * consumed by whoever won the race, so there is nothing of this
   * device's own to give back. **Disclosed:** the condition that ever
   * flags an item this way is itself never organically produced in this
   * no-backend prototype (see `addItemToSale`'s own doc comment, and
   * `Selling.tsx`) — a real, correctly-rendering, disclosed-not-wired
   * branch, the same posture this codebase already holds for every other
   * state a genuine backend concurrency mechanism alone can trigger. */
  removeSaleItem: (saleItemId: ID) => void;
  cancelSale: () => void;
  finalizeSale: () => Receipt | null;
  closeSession: () => void;
  /** settings.md §2.2/§3.4 "Activar plan de pago" — immediate: sets
   * `subscriptionTier='paid'` directly, per Q11's own today-illustrative
   * assignment ("she's confirming a payment already arranged"). Reachable
   * only from the Free-tier vista principal (no pending change can exist
   * there), so this never needs to touch the pending triple. Never touches
   * `defaultSellingMode` — `nfc` becomes available only as a read-time
   * derivation from the new `subscriptionTier` value (D27), never written
   * here directly. */
  activatePaidPlan: () => void;
  /** settings.md §2.2/§3.5 "Volver al plan gratis" — deferred: sets the
   * pending-change triple (§2.4/D25/D29's own shape). Does **not** touch
   * `subscriptionTier` yet — it stays `'paid'` until the effective date
   * actually lands (`reconcilePendingSubscriptionTier`). The illustrative
   * effective date (Q11 open, `dates.ts`'s own disclosed judgment call) is
   * computed here, once, at request time — never re-computed on every read. */
  requestDowngradeToFree: () => void;
  /** settings.md §2.2/§3.7 "Cancelar cambio pendiente" — clears the pending
   * triple entirely; `subscriptionTier` is untouched (still `'paid'`), since
   * the pending write never touched it either. */
  cancelPendingSubscriptionTierChange: () => void;
  /** settings.md §2.3 "Cambiar a vender con tags/con botones" — immediate,
   * no pending-value/effective-date pair at all (D27: this field carries no
   * billing-cycle implication in either direction). Per §2.3's own explicit
   * invariant, this is the *only* write path that may ever touch
   * `defaultSellingMode` — never written as a side effect of any
   * `subscriptionTier` action, in either direction. */
  changeDefaultSellingMode: (mode: SessionOperatingMode) => void;
  /** home.md §3.6a's fourth variant (Ready-but-`buttons`, shown once ever) —
   * sets `Business.nfcAvailabilityNudgeShown = true`, permanently. Fired
   * once, via a `useEffect`, the first time that variant actually renders
   * (`useNfcSessionStart.ts`) — mirrors `reconcilePendingSubscriptionTier`'s
   * own one-time-acknowledgment write pattern above, at the field-write
   * level (no two-phase landing logic needed here, since this flag has only
   * one direction and no effective date to wait on). */
  markNfcAvailabilityNudgeShown: () => void;
  /** settings.md §2.4 — simulates a pending `subscriptionTier` change
   * "landing" with no real scheduled job (D25 leaves the actual billing
   * mechanism external): called once whenever Configuración's own vista
   * principal (§3.3a) mounts. Two-phase, driven by the persisted
   * `pendingSubscriptionTierAcknowledged` flag (not local component state)
   * so the "shown exactly once" guarantee survives a reload between the
   * landing open and the next one: the first open on/after the effective
   * date flips `subscriptionTier` and marks `acknowledged=true`, returning
   * the landed value so the caller can render §2.4's one-time acknowledgment
   * line; the *next* open (already acknowledged) clears the pending triple
   * entirely and returns `justLanded: false`. A no-op (and `justLanded:
   * false`) whenever no pending change exists yet, or its effective date is
   * still in the future. */
  reconcilePendingSubscriptionTier: () => { justLanded: boolean; tier?: 'free' | 'paid'; effectiveDate?: string };
  /** settings.md §2.5/§2.5a, authentication.md §2.2 case 2, RFC 0007 §1 —
   * ends this device's verified-phone session without touching the Business
   * or any of its data. **Critical correctness point:** sets this User row's
   * `phoneVerifiedAt = null` in place, inside `state.users`, and leaves
   * `currentUserId` pointing at that same (now-unverified) row — never
   * removes it from `users` or nulls `currentUserId` itself — preserving
   * that row's `id`/`phone`/`createdAt`. `verifyOtp` resolves back to the
   * *same* `User` row on a returning verification for that phone (a search
   * across `state.users`, not a single-slot check); minting a *second* row
   * for the same phone would violate RFC 0007 §1's global-phone-identity
   * invariant. Touches only that one `User` row — `business`/`memberships`/
   * products/sessions/sales are structurally untouched (RFC 0007's own
   * guarantee, §2.5's "nothing is lost" copy). `AppRouter.tsx` falls back
   * to `AuthenticationFlow` automatically the instant `phoneVerifiedAt`
   * clears — no further navigation call needed here. */
  signOut: () => void;
  /** settings.md §2.7 "Invitar a alguien" — writes a new `Invitation`
   * (`businessId`, `phone`, `role='SELLER'`, `status='pending'`), gated on
   * `subscriptionTier=paid` (composing with the existing gate, never a new
   * dimension — `company/business-decisions.md` Q18) and re-checked
   * defensively against the same uniqueness rule the UI already validates
   * inline (§3.12: "Ya invitaste a este número" / "Este número ya vende
   * contigo") — a no-op, matching this file's existing defensive-guard
   * style, if either precondition doesn't hold at write time. `role` is
   * never asked — always `'SELLER'`, the only value the settled
   * architecture describes. */
  createInvitation: (phone: string) => void;
  /** authentication.md §2.2a step 3 — the Invitation-acceptance invariant
   * (RFC 0008/D56): atomically creates `BusinessMembership(userId,
   * businessId, role='SELLER', status='active')` and flips
   * `Invitation.status: pending → accepted`, gated on a verified
   * `currentUser` and a still-`pending` Invitation, idempotency-guarded the
   * same way `completeOnboarding` already guards a retried Owner-creation
   * write (a User who already holds a Membership for this Business is
   * handed back that existing row rather than minting a duplicate). Returns
   * the resolved Membership's businessId, or `null` if the precondition
   * isn't met (defensive — unreachable through the real UI, which only ever
   * calls this from §3.10's own re-checked-pending offer). */
  acceptInvitation: (invitationId: ID) => ID | null;
  /** authentication.md §2.2a step 4 / §10 "Ahora no" (ux-critic fix round,
   * Slice 12) — "declining never re-surfaces the same offer on the next
   * open." Appends `invitationId` to the current User's own
   * `declinedInvitationIds`, a small durable local-only UI marker; never
   * touches the `Invitation` record itself, which stays `pending` exactly
   * as the spec requires. Idempotent (no duplicate id added on a repeat
   * call), same defensive-guard style as this file's other writes. A no-op
   * if no verified `currentUser` resolves — defensive, unreachable through
   * the real UI, which only ever calls this from an already-authenticated
   * `InvitationFlow`. */
  declineInvitation: (invitationId: ID) => void;
  /** settings.md §2.7 "Quitar" (§3.13) — flips `BusinessMembership.status:
   * active → revoked`, sets `revokedAt`. **Never a delete** — every Sale
   * already attributed to this Membership keeps resolving through
   * `Sale.performedByMembershipId` unaffected, the same non-deletion
   * discipline `subscriptionTier` history and `Product.active` already
   * establish (`decision-log.md` D55, Q21). No reactivation path exists —
   * the settled architecture explicitly leaves this undesigned. */
  revokeMembership: (membershipId: ID) => void;
  /** events.md §3.21/§3.23 "Guardar cambios" — the bulk manual-allocation
   * commit: one write, every row's staged manual quantity at once, per
   * `product-decisions.md` Q24/Q25's own "she only ever sees a number
   * change... never picks or is told which underlying movement type wrote"
   * rule. For each `(productId, quantity)` pair, upserts this Event's own
   * `EventAllocation` — creates one (`status='open'`, `quantityRemaining` =
   * the full new quantity) if none exists yet; otherwise shifts both
   * `quantityAllocated` and `quantityRemaining` by the same signed delta
   * (increase = a replenish, decrease = an adjustment — both invisible to
   * her, `AllocationMovement`'s own role, not modeled this slice — see
   * `EventAllocation`'s own `types.ts` doc comment), floor 0. Manual-mode
   * only, this slice — NFC-scan allocation (`events.md` §3.22) is out of
   * scope. */
  saveEventAllocations: (eventId: ID, changes: { productId: ID; quantity: number }[]) => void;
  resetPrototype: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full/unavailable — the running session still works, it just
      // won't survive a reload; never worth crashing the app over
    }
  }, [state]);

  /**
   * Shared new-Product minting/resolution logic — extracted so `commitLot`
   * (inventory.md §3.8a/§3.9, and — as of `product-decisions.md` Q20 —
   * onboarding.md §2.2a's "Define lo que vendes" as well) resolves a
   * not-yet-real `{name, defaultPrice}` identity into a real, ID-bearing
   * `Product` through exactly one mechanism — never two independently-built
   * creation paths (onboarding.md §2.2a's own explicit instruction to
   * `builder`/`ui-designer`).
   */
  function mintProduct(name: string, defaultPrice: number, createdAt: number, photo?: string): Product {
    return { id: makeId('prod'), name: name.trim(), defaultPrice, photo, createdAt };
  }

  /**
   * events.md §3.7 — mint-or-find resolution for a Venue picked/typed in
   * Elegir lugar, mirroring `mintProduct` above: given a `VenueRef`, either
   * resolve it to an already-real Venue's id, or mint a brand-new one.
   * `existing` is trusted as-is (the picker already resolved which Venue
   * she tapped). `new` re-applies the same case-insensitive/trimmed match
   * the picker's own UI already used to decide to show "+ Agregar... como
   * lugar nuevo" in the first place (§3.7's matching rule) — a second,
   * defensive check here rather than trusting the UI layer's classification
   * alone, so two callers can never mint two different Venues for what's
   * actually the same trimmed name typed a second time.
   */
  function resolveVenue(ref: VenueRef, existingVenues: Venue[]): { venueId: ID; newVenue: Venue | null } {
    if (ref.kind === 'existing') return { venueId: ref.venueId, newVenue: null };
    const trimmed = ref.displayName.trim();
    const match = existingVenues.find((v) => v.displayName.trim().toLowerCase() === trimmed.toLowerCase());
    if (match) return { venueId: match.id, newVenue: null };
    const venue: Venue = { id: makeId('venue'), displayName: trimmed };
    return { venueId: venue.id, newVenue: venue };
  }

  /**
   * inventory.md §3.8a/§3.9: the entire Lot write — including minting any
   * genuinely-new Product identities picked up in "¿Qué llegó?" this same
   * visit — happens atomically, only here, only at "Guardar mercancía."
   * Nothing before this point (picking/typing a new Product+price in the
   * picker, adding it to the in-progress list, discarding, or backing out)
   * may write a Product into the store — see `RegisterMerchandise.tsx`,
   * which holds pending new-Product identities in its own local draft/
   * committed state until it calls this.
   *
   * As of `product-decisions.md` Q20, `onboarding.md` §2.2a/§3.5b–§3.5e's
   * "Define lo que vendes" step calls this same function at "Continuar" —
   * every line it supplies is a `{kind: 'new', ...}` line (a first-run
   * Catalog is guaranteed empty, so there's never an `existing`-Product
   * match to make there), composing onto this one write mechanism rather
   * than a second, parallel one.
   */
  function commitLot(lines: CommitLotLine[]): ID[] {
    if (lines.length === 0) return [];
    const lotId = makeId('lot');
    const receivedAt = Date.now();

    const newProducts: Product[] = [];
    const resolvedProductIds: ID[] = lines.map((line) => {
      if (line.product.kind === 'existing') return line.product.productId;
      const product = mintProduct(line.product.name, line.product.defaultPrice, receivedAt, line.product.photo);
      newProducts.push(product);
      return product.id;
    });

    const entries = lines.map((line, i) => ({
      id: makeId('entry'),
      lotId,
      productId: resolvedProductIds[i],
      quantity: line.quantity,
    }));
    const units: InventoryUnit[] = [];
    lines.forEach((line, i) => {
      for (let u = 0; u < line.quantity; u += 1) {
        units.push({
          id: makeId('unit'),
          productId: resolvedProductIds[i],
          lotId,
          status: 'available',
          receivedAt,
          tagId: null,
        });
      }
    });
    setState((s) => ({
      ...s,
      products: [...s.products, ...newProducts],
      lots: [...s.lots, { id: lotId, receivedAt }],
      entries: [...s.entries, ...entries],
      units: [...s.units, ...units],
    }));

    return resolvedProductIds;
  }

  /**
   * authentication.md §3.7 — mock verification (RFC 0007 §5, disclosed in
   * docs/passes/slice-2-authentication-onboarding.md): any 6-digit code is
   * accepted, so this never fails. **Slice 12 — the real "looked up by
   * phone, globally" lookup RFC 0007 §1 describes**, now that `users` is
   * array-shaped: a first-ever verification for a phone (no existing row
   * matches) mints a new `User`; a returning verification for a phone
   * already held — whether or not it's the phone this device most recently
   * had verified — resolves that same row and preserves its original
   * `phoneVerifiedAt`, never minting a duplicate. This is what makes
   * switching between two already-verified Memberships on one shared
   * device/instance (e.g. an OWNER signing out, a SELLER verifying, the
   * OWNER later re-verifying) resolve back to each one's own stable `User`
   * identity rather than accumulating a fresh row every time.
   */
  function verifyOtp(phone: string, _code: string): User {
    const now = Date.now();
    const existing = state.users.find((u) => u.phone === phone);
    const user: User = existing
      ? { ...existing, phoneVerifiedAt: existing.phoneVerifiedAt ?? now }
      : { id: makeId('user'), phone, phoneVerifiedAt: now, createdAt: now, declinedInvitationIds: [] };
    setState((s) => ({
      ...s,
      users: existing ? s.users.map((u) => (u.id === user.id ? user : u)) : [...s.users, user],
      currentUserId: user.id,
    }));
    return user;
  }

  /**
   * onboarding.md §3.5 "Creando tu negocio" — the atomic Owner-creation
   * write (RFC 0007/D44). Gated on a verified `currentUser`, per D44's own
   * structural invariant: "no Business row can exist without a
   * corresponding OWNER Membership... enforced by there being exactly one
   * write path capable of creating a Business at all." `Business.name`
   * starts `''` (see types.ts) — identity is §3.10's own, separate write.
   *
   * Idempotency guard (RFC 0007 §4 / decision-log.md D44): a retry of this
   * write (e.g. `OnboardingFlow.tsx`'s `'creating-error'` retry button) must
   * never mint a second `Business`+`OWNER Membership` pair for the same
   * user — same "never ask twice" posture `startSession` already applies
   * above. If the current user already has a Business (found via their own
   * OWNER Membership), short-circuit and hand back that existing id instead
   * of minting a fresh one.
   */
  function completeOnboarding(path: OnboardingPath): ID | null {
    const user = currentUser(state);
    if (!user || user.phoneVerifiedAt == null) return null;
    const existingMembership = state.memberships.find((m) => m.userId === user.id && m.role === 'OWNER');
    if (existingMembership && state.business && state.business.id === existingMembership.businessId) {
      return state.business.id;
    }
    const businessId = makeId('biz');
    const now = Date.now();
    // onboarding.md §2.2's capability table — the only three combinations
    // any Onboarding path may ever produce.
    const capabilities: Pick<Business, 'subscriptionTier' | 'defaultSellingMode'> =
      path === 'free'
        ? { subscriptionTier: 'free', defaultSellingMode: 'buttons' }
        : path === 'paid'
          ? { subscriptionTier: 'paid', defaultSellingMode: 'buttons' }
          : { subscriptionTier: 'paid', defaultSellingMode: 'nfc' }; // demo — §2.2's richest combination
    const business: Business = {
      id: businessId,
      name: '',
      ...capabilities,
      onboardingAcknowledged: false,
      pendingSubscriptionTier: null,
      pendingSubscriptionTierEffectiveDate: null,
      pendingSubscriptionTierAcknowledged: false,
      nfcAvailabilityNudgeShown: false,
    };
    const membership: BusinessMembership = {
      id: makeId('mem'),
      userId: user.id,
      businessId,
      role: 'OWNER',
      status: 'active',
      revokedAt: null,
      createdAt: now,
    };
    setState((s) => ({ ...s, business, memberships: [...s.memberships, membership] }));
    return businessId;
  }

  /** onboarding.md §3.10 "Guardando tu negocio" — additive identity fields
   * on the already-existing Business (§2.2b). */
  function setBusinessIdentity(fields: { name: string; logo?: string; description?: string }) {
    setState((s) => {
      if (!s.business) return s; // defensive — unreachable via the real flow, §3.5 always runs first
      return {
        ...s,
        business: {
          ...s.business,
          name: fields.name.trim(),
          logo: fields.logo,
          description: fields.description,
        },
      };
    });
  }

  /** onboarding.md §3.6 — "Entrar" tapped, or auto-continued. */
  function acknowledgeOnboarding() {
    setState((s) => (s.business ? { ...s, business: { ...s.business, onboardingAcknowledged: true } } : s));
  }

  /**
   * Shared Price resolution (D33, domain-model.md "Price resolution") —
   * extracted so `addItemToSale` (Buttons mode) and `addItemToSaleByTag`
   * (nfc mode) resolve "what does this Sale item cost" through exactly one
   * mechanism, mirroring the `mintProduct`/`resolveVenue` extraction pattern
   * above rather than two independently-built, copy-pasted implementations
   * of the same domain rule (fix round, `docs/passes/slice-7-nfc-selling.md`
   * — a `reviewer`-caught Important finding: the two write paths previously
   * each reimplemented this lookup separately, despite doc comments already
   * describing it as "reuse"). Returns `null` only when `productId` doesn't
   * resolve to a real Product — defensively unreachable through the real UI,
   * same posture every other guard in this file already applies.
   */
  function resolvePricePaid(s: AppState, session: Session, productId: ID): number | null {
    const product = s.products.find((p) => p.id === productId);
    if (!product) return null;
    const override = session.eventId
      ? s.priceOverrides.find((po) => po.eventId === session.eventId && po.productId === productId)
      : undefined;
    return override?.overridePrice ?? product.defaultPrice;
  }

  /**
   * Shared "find-or-create this Session's open Sale, append one SaleItem,
   * mark the sold InventoryUnit reserved" write — the other half of the
   * `addItemToSale`/`addItemToSaleByTag` extraction (see
   * `resolvePricePaid` above for the full rationale). Pure, given the
   * current state `s` — same shape as `mintProduct`/`resolveVenue`: called
   * from inside each caller's own `setState` updater, never calling
   * `setState` itself, so both write paths still go through exactly one
   * `setState` call each (no behavior change to when/how state actually
   * commits).
   *
   * `performedByMembershipId` (`decision-log.md` D58, Slice 12) stamps a
   * newly-created open Sale's own attribution — never touched again once
   * set, since every item a Sale ever accumulates is added by whichever
   * Membership opened its own Session (`Session.openedByMembershipId`'s own
   * doc comment, `types.ts`). `consumeEventAllocationId` (RFC 0009/D57,
   * Slice 12), when given, decrements that `EventAllocation`'s
   * `quantityRemaining` by one in the same write — the caller has already
   * verified `quantityRemaining > 0` before ever reaching here (the
   * compare-and-swap gate itself lives in `addItemToSale`, since a failed
   * gate must return `false` without writing anything at all).
   */
  function appendItemToOpenSale(
    s: AppState,
    sessionId: ID,
    productId: ID,
    unitId: ID,
    pricePaid: number,
    performedByMembershipId: ID,
    consumeEventAllocationId?: ID,
  ): Pick<AppState, 'sales' | 'units' | 'eventAllocations'> {
    let sales = s.sales;
    let sale = sales.find((sa) => sa.sessionId === sessionId && sa.status === 'open');
    if (!sale) {
      sale = { id: makeId('sale'), sessionId, items: [], status: 'open', performedByMembershipId };
      sales = [...sales, sale];
    }
    const item: SaleItem = { id: makeId('item'), productId, unitId, pricePaid };
    sales = sales.map((sa) => (sa.id === sale!.id ? { ...sa, items: [...sa.items, item] } : sa));
    const units = s.units.map((u) => (u.id === unitId ? { ...u, status: 'reserved' as InventoryUnitStatus } : u));
    const eventAllocations = consumeEventAllocationId
      ? s.eventAllocations.map((a) =>
          a.id === consumeEventAllocationId ? { ...a, quantityRemaining: Math.max(0, a.quantityRemaining - 1) } : a,
        )
      : s.eventAllocations;
    return { sales, units, eventAllocations };
  }

  function editPrice(productId: ID, newPrice: number) {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === productId ? { ...p, defaultPrice: newPrice } : p)),
    }));
  }

  /** inventory.md §3.4b "Guardar foto" — writes or clears `Product.photo`. */
  function setProductPhoto(productId: ID, photo: string | undefined) {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === productId ? { ...p, photo } : p)),
    }));
  }

  /**
   * inventory.md §3.14 — one scan, one write. §3.16 ("scan failed," a
   * genuine physical read failure) never reaches this function at all —
   * it's simulated entirely client-side in `AssignTags.tsx`, the same
   * "mock the physical mechanism, keep the domain layer honest" posture
   * this codebase's phone-OTP mock already established. This function only
   * ever sees a tag that *did* read successfully, and decides the one real
   * business-logic question: is it already spoken for (§3.15)?
   */
  function assignTagToNextPendingUnit(
    tagId: ID,
  ): { ok: true; unitId: ID; productId: ID } | { ok: false; reason: 'already-assigned' } | { ok: false; reason: 'queue-empty' } {
    if (state.units.some((u) => u.tagId === tagId)) {
      return { ok: false, reason: 'already-assigned' };
    }
    const next = state.units.find((u) => u.status === 'available' && u.tagId == null);
    if (!next) {
      return { ok: false, reason: 'queue-empty' };
    }
    setState((s) => ({
      ...s,
      units: s.units.map((u) => (u.id === next.id ? { ...u, tagId } : u)),
    }));
    return { ok: true, unitId: next.id, productId: next.productId };
  }

  /**
   * events.md §3.6 "Guardar evento" — the atomic Event-creation write:
   * resolves the pending Venue selection (mint-or-find, `resolveVenue`)
   * inside the same transaction. **D17's own overlap rule, once re-checked
   * defensively here, is removed outright (`decision-log.md` D53, Slice
   * 12) — pure code-debt deletion, not new design work: D53 confirmed the
   * restriction was never a business-capacity rule, only a now-obsolete
   * single-actor `home.md` resolution safeguard, and simultaneous
   * multi-Event operation is a real, supported case now.** Always
   * succeeds — returns the new Event's id directly.
   */
  function createEvent(fields: {
    venue: VenueRef;
    type: EventType;
    startDate: string;
    endDate: string;
    bazaarCost: number;
  }): ID {
    const { venueId, newVenue } = resolveVenue(fields.venue, state.venues);
    const event: Event = {
      id: makeId('event'),
      venueId,
      type: fields.type,
      startDate: fields.startDate,
      endDate: fields.endDate,
      bazaarCost: fields.bazaarCost,
      cancelledAt: null,
    };
    setState((s) => ({
      ...s,
      venues: newVenue ? [...s.venues, newVenue] : s.venues,
      events: [...s.events, event],
    }));
    return event.id;
  }

  /** events.md §3.12/§2 — the only merchant-initiated Event transition.
   * Meaningful only while the Event's computed status is still `scheduled`
   * (§3.11: "Cancelar evento" is offered only on that detail screen) — a
   * defensive no-op otherwise, never a thrown error, matching this
   * codebase's existing guard style. */
  function cancelEvent(eventId: ID) {
    setState((s) => {
      const event = s.events.find((e) => e.id === eventId);
      if (!event || eventStatus(event, Date.now()) !== 'scheduled') return s;
      return { ...s, events: s.events.map((e) => (e.id === eventId ? { ...e, cancelledAt: Date.now() } : e)) };
    });
  }

  /** events.md §3.20 (D33) — writes/updates one Product's Price Override for
   * one Event. Defensively re-checks the Event's computed status is still
   * `scheduled` at write time — "Ajustar precios" is offered only on the
   * scheduled detail screen (§3.11), and §3.20 is explicit that this
   * capability is "unreachable at all once active, not just hidden," so the
   * write path itself must not trust that the UI never got there some other
   * way. Upserts: replaces this (eventId, productId) pair's row if one
   * exists, else appends — never two rows for the same pair. */
  function setPriceOverride(eventId: ID, productId: ID, overridePrice: number) {
    setState((s) => {
      const event = s.events.find((e) => e.id === eventId);
      if (!event || eventStatus(event, Date.now()) !== 'scheduled') return s;
      const exists = s.priceOverrides.some((po) => po.eventId === eventId && po.productId === productId);
      const priceOverrides = exists
        ? s.priceOverrides.map((po) =>
            po.eventId === eventId && po.productId === productId ? { ...po, overridePrice } : po,
          )
        : [...s.priceOverrides, { eventId, productId, overridePrice }];
      return { ...s, priceOverrides };
    });
  }

  function startSession(eventId: ID | null = null, overrideToNfc: boolean = false) {
    setState((s) => {
      if (!s.business) return s; // defensive — Home only mounts once onboarding is complete
      const membership = actingMembership(s);
      if (!membership) return s; // defensive — Home only mounts once a valid acting Membership resolves
      // Slice 12 — scoped to this acting Membership, never "any active
      // Session, Business-wide" (see this function's own StoreValue doc
      // comment): two different Memberships now genuinely can each hold
      // their own concurrently-open Session.
      if (s.sessions.some((sess) => sess.status === 'active' && sess.openedByMembershipId === membership.id)) {
        return s; // never ask twice
      }

      // NFC Readiness / Session-start resolution (home.md §2, decision-log.md
      // D23) — committed only here, at the Session-start tap, since
      // `Session` doesn't exist to write it onto any earlier. Computed
      // defensively from `s` (never trusting a UI-computed value, same
      // posture `setPriceOverride` above already establishes) rather than
      // any value passed in — the one exception is `overrideToNfc` itself,
      // which is genuinely a per-tap merchant choice with no other honest
      // source (see this function's own `StoreValue` doc comment).
      const capability = nfcCapable(s);
      const readiness = nfcReadiness(s);
      const defaultMode = s.business.defaultSellingMode;

      let operatingMode: SessionOperatingMode = 'buttons';
      if (defaultMode === 'nfc' && capability) {
        if (readiness === 'ready') operatingMode = 'nfc';
        else if (readiness === 'limited' && overrideToNfc) operatingMode = 'nfc';
        // 'not-ready', or 'limited' without an override, both stay 'buttons'
        // — an operational impossibility/a recommendation she didn't
        // override, never a merchant-facing error (home.md §3.6a).
      }

      const session: Session = {
        id: makeId('sess'),
        eventId,
        operatingMode,
        status: 'active',
        openedAt: Date.now(),
        openedByMembershipId: membership.id,
      };
      return { ...s, sessions: [...s.sessions, session] };
    });
  }

  function addItemToSale(productId: ID): boolean {
    const membership = actingMembership(state);
    if (!membership) return false; // defensive — Selling only mounts once a valid acting Membership resolves
    const session = myActiveSession(state, membership.id);
    if (!session) return false;
    // Defensive re-check (fix round, `docs/passes/slice-7-nfc-selling.md`,
    // reviewer Suggestion) — the `'buttons'` grid is only ever rendered
    // while `Session.operatingMode === 'buttons'` (`Selling.tsx`'s own
    // exclusive-zone branch), so this is unreachable through the real UI,
    // but never trust a UI-computed value alone, same posture
    // `setPriceOverride`/`startSession` already apply elsewhere in this file.
    if (session.operatingMode !== 'buttons') return false;

    // FIFO allocation, Buttons mode (decision-log.md D5): oldest available
    // InventoryUnit for this Product, automatically, no merchant decision.
    const candidate = state.units
      .filter((u) => u.productId === productId && u.status === 'available')
      .sort((a, b) => a.receivedAt - b.receivedAt)[0];
    if (!candidate) return false;

    // Physical-location-exclusivity invariant, mechanism (b) — a
    // compare-and-swap on `EventAllocation.quantityRemaining > 0`, manual
    // mode only (RFC 0009/D57, Slice 12). A Product with no `open`
    // EventAllocation for this Session's Event resolves from the plain
    // Business-wide pool exactly as before, unaffected — `eventAllocation`
    // is `undefined` in that case, so this gate never fires.
    const eventAllocation = session.eventId ? eventAllocationFor(state, session.eventId, productId) : undefined;
    if (eventAllocation && eventAllocation.quantityRemaining <= 0) return false;

    // Price resolution (D33, domain-model.md "Price resolution") — shared
    // with `addItemToSaleByTag` via `resolvePricePaid` (see that function's
    // own doc comment for why this is now one implementation, not two).
    const pricePaid = resolvePricePaid(state, session, productId);
    if (pricePaid == null) return false;

    setState((s) => ({
      ...s,
      ...appendItemToOpenSale(s, session.id, productId, candidate.id, pricePaid, membership.id, eventAllocation?.id),
    }));
    return true;
  }

  /**
   * home.md §3.10 — nfc-mode's own registration write, sharing
   * `addItemToSale` above's price-resolution/Sale-creation logic through the
   * `resolvePricePaid`/`appendItemToOpenSale` helpers (fix round,
   * `docs/passes/slice-7-nfc-selling.md` — see those helpers' own doc
   * comments; this was previously a second, independently-written copy of
   * the same logic, not an actual shared code path) with one swap: the unit
   * is resolved by the *specific* scanned `tagId`
   * (`u.tagId === tagId && u.status === 'available'`) rather than FIFO's
   * oldest-available-for-this-Product selection — there is no Product to
   * select by here, only a physical tag already tied to exactly one unit.
   * `'no-match'` is `product/02-ux/product-decisions.md` Q2's own genuinely
   * open gap (a scan matching no `available` tagged unit) — this function
   * only guarantees that case is never silently mishandled; it does not
   * invent a resolution UI for it (see `Selling.tsx`'s own caller/disclosure).
   */
  function addItemToSaleByTag(
    tagId: ID,
  ):
    | { ok: true; unitId: ID; productId: ID }
    | { ok: false; reason: 'no-active-session' }
    | { ok: false; reason: 'no-match' } {
    const membership = actingMembership(state);
    if (!membership) return { ok: false, reason: 'no-active-session' };
    const session = myActiveSession(state, membership.id);
    if (!session) return { ok: false, reason: 'no-active-session' };
    // Defensive re-check (fix round, reviewer Suggestion — same posture as
    // `addItemToSale`'s own re-check above): the `NFCScanPrompt` surface is
    // only ever rendered while `Session.operatingMode === 'nfc'`
    // (`Selling.tsx`'s own exclusive-zone branch), so this is unreachable
    // through the real UI. No dedicated reason code exists for "wrong mode"
    // — `'no-match'` already reads correctly here ("this scan can't resolve
    // to a sellable item right now"), so it's reused rather than adding a
    // reason variant nothing in the UI would ever branch on differently.
    if (session.operatingMode !== 'nfc') return { ok: false, reason: 'no-match' };

    const candidate = state.units.find((u) => u.tagId === tagId && u.status === 'available');
    if (!candidate) return { ok: false, reason: 'no-match' };

    const pricePaid = resolvePricePaid(state, session, candidate.productId);
    if (pricePaid == null) return { ok: false, reason: 'no-match' };

    // NFC-mode allocation (`EventAllocation.allocatedUnitIds`) is out of
    // this slice's scope, deferred alongside NFC-scan allocation itself
    // (`events.md` §3.22) — no compare-and-swap performed here; this mirrors
    // `addItemToSale`'s own gate only where an `open` manual EventAllocation
    // exists, which an nfc-mode Sale never touches.
    setState((s) => ({
      ...s,
      ...appendItemToOpenSale(s, session.id, candidate.productId, candidate.id, pricePaid, membership.id),
    }));
    return { ok: true, unitId: candidate.id, productId: candidate.productId };
  }

  /** home.md §3.8a's "Quitar de la venta" — see this function's own
   * `StoreValue` doc comment for the full reasoning (never restores
   * `EventAllocation.quantityRemaining`, unlike `cancelSale` below). */
  function removeSaleItem(saleItemId: ID) {
    setState((s) => {
      const sale = s.sales.find((sa) => sa.status === 'open' && sa.items.some((i) => i.id === saleItemId));
      if (!sale) return s;
      const item = sale.items.find((i) => i.id === saleItemId)!;
      const sales = s.sales.map((sa) => (sa.id === sale.id ? { ...sa, items: sa.items.filter((i) => i.id !== saleItemId) } : sa));
      const units = s.units.map((u) => (u.id === item.unitId ? { ...u, status: 'available' as InventoryUnitStatus } : u));
      return { ...s, sales, units };
    });
  }

  function cancelSale() {
    setState((s) => {
      const membership = actingMembership(s);
      if (!membership) return s;
      const session = myActiveSession(s, membership.id);
      if (!session) return s;
      const openSale = s.sales.find((sa) => sa.sessionId === session.id && sa.status === 'open');
      if (!openSale) return s;
      const unitIds = new Set(openSale.items.map((i) => i.unitId));
      const units = s.units.map((u) =>
        unitIds.has(u.id) ? { ...u, status: 'available' as InventoryUnitStatus } : u,
      );
      const sales = s.sales.filter((sa) => sa.id !== openSale.id);
      // Slice 12 — restores each cancelled item's own EventAllocation
      // `quantityRemaining` (the compare-and-swap `addItemToSale` already
      // decremented at add-time), symmetric with how `units` above reverts
      // to `available`. Grouped by Product so a multi-item cancel against
      // the same allocation increments it once by the right count, not once
      // per item independently mis-applied.
      let eventAllocations = s.eventAllocations;
      if (session.eventId) {
        const restoreCountByProduct = new Map<ID, number>();
        for (const item of openSale.items) {
          restoreCountByProduct.set(item.productId, (restoreCountByProduct.get(item.productId) ?? 0) + 1);
        }
        eventAllocations = eventAllocations.map((a) => {
          if (a.status !== 'open' || a.eventId !== session.eventId) return a;
          const restore = restoreCountByProduct.get(a.productId);
          return restore ? { ...a, quantityRemaining: a.quantityRemaining + restore } : a;
        });
      }
      return { ...s, sales, units, eventAllocations };
    });
  }

  function finalizeSale(): Receipt | null {
    if (!state.business) return null; // defensive — Selling only mounts once onboarding is complete
    const membership = actingMembership(state);
    if (!membership) return null;
    const session = myActiveSession(state, membership.id);
    if (!session) return null;
    const openSale = state.sales.find((sa) => sa.sessionId === session.id && sa.status === 'open');
    if (!openSale || openSale.items.length === 0) return null;

    const total = openSale.items.reduce((sum, i) => sum + i.pricePaid, 0);
    const itemCount = openSale.items.length;
    const finalizedAt = Date.now();

    setState((s) => {
      const unitIds = new Set(openSale.items.map((i) => i.unitId));
      const units = s.units.map((u) =>
        unitIds.has(u.id) ? { ...u, status: 'sold' as InventoryUnitStatus } : u,
      );
      const sales: Sale[] = s.sales.map((sa) =>
        sa.id === openSale.id ? { ...sa, status: 'finalized', finalizedAt } : sa,
      );
      return { ...s, units, sales };
    });

    return {
      saleId: openSale.id,
      total,
      itemCount,
      businessName: state.business.name,
      businessLogo: state.business.logo,
      subscriptionTier: state.business.subscriptionTier,
      // `home.md` §3.8f/D22/D40 — Paid tier only; structurally absent
      // (`undefined`, not merely hidden) for Free tier. Computed here, at
      // finalization write time, never re-derived from a later live read of
      // `state.business.subscriptionTier` (D33 write-time-capture precedent).
      //
      // Disclosed demo-sync wiring (Product Owner request, live-demo prep):
      // rather than `mintClaimToken(...)`'s real per-Sale hash, this is
      // hardcoded to `'demo-nueva'` — the exact seed-token key
      // `product/02c-loyalty-prototype/src/domain/seed.ts` defines for its
      // "valid token, brand-new email → full registration flow" scenario,
      // the loyalty app's most illustrative, complete demo path. This makes
      // the QR on a Paid-tier receipt resolve to a real, working page on the
      // now-deployed `loyalty.nahui.app` for a live walkthrough, standing in
      // for the real cross-app Loyalty data bridge (`BACKLOG.md` item 10,
      // D.5), which is still future work — no shared backend exists between
      // these two independently-mocked prototypes today. `mintClaimToken`
      // itself is left intact below as a real-token-shape reference/
      // fallback; it's simply not what gets assigned here.
      //
      // Real limitation this demo trick carries: because the loyalty app
      // has no real per-sale resolution, every Paid-tier sale's QR in this
      // build encodes the identical token. A customer who successfully
      // registers via one scan will see "ya fue registrada" on any
      // subsequent scan, until the loyalty app's own test data is reset.
      // Acceptable for a single demo walkthrough, not a multi-customer
      // simulation.
      claimToken:
        state.business.subscriptionTier === 'paid' ? 'demo-nueva' : undefined,
    };
  }

  function closeSession() {
    setState((s) => {
      const membership = actingMembership(s);
      if (!membership) return s;
      const session = myActiveSession(s, membership.id);
      if (!session) return s;
      // Slice 12 — closes only this acting Membership's own active Session;
      // was previously "every active Session" (harmless when at most one
      // could ever exist, wrong now that two Memberships can each hold
      // their own concurrently).
      return {
        ...s,
        sessions: s.sessions.map((sess) =>
          sess.id === session.id ? { ...sess, status: 'closed' as const, closedAt: Date.now() } : sess,
        ),
      };
    });
  }

  /** settings.md §2.2/§3.4 "Activar plan de pago" — immediate. Reachable only
   * from the Free-tier vista principal (no pending change can exist there —
   * see this function's own `StoreValue` doc comment), so under normal play
   * the pending triple is already empty here. Defensively clears it anyway
   * (same shape `cancelPendingSubscriptionTierChange` already writes)
   * to close a latent, currently-unreachable edge: if a downgrade just landed
   * this same mount (`reconcilePendingSubscriptionTier` flips the tier and
   * sets `acknowledged=true` but deliberately keeps the other two pending
   * fields for one render, §2.4's own design) and Ana immediately activates
   * paid again before the next Settings mount would otherwise clear them,
   * those stale fields never get a chance to linger. */
  function activatePaidPlan() {
    setState((s) =>
      s.business
        ? {
            ...s,
            business: {
              ...s.business,
              subscriptionTier: 'paid',
              pendingSubscriptionTier: null,
              pendingSubscriptionTierEffectiveDate: null,
              pendingSubscriptionTierAcknowledged: false,
            },
          }
        : s,
    );
  }

  /** settings.md §2.2/§3.5 "Volver al plan gratis" — deferred; writes the
   * pending triple only, `subscriptionTier` stays `'paid'` until it lands. */
  function requestDowngradeToFree() {
    setState((s) => {
      if (!s.business) return s;
      const effectiveDate = addDaysToKey(todayKey(), 30); // see dates.ts's own disclosed judgment call
      return {
        ...s,
        business: {
          ...s.business,
          pendingSubscriptionTier: 'free',
          pendingSubscriptionTierEffectiveDate: effectiveDate,
          pendingSubscriptionTierAcknowledged: false,
        },
      };
    });
  }

  /** settings.md §2.2/§3.7 "Cancelar cambio pendiente" — clears the pending
   * triple; `subscriptionTier` untouched. */
  function cancelPendingSubscriptionTierChange() {
    setState((s) =>
      s.business
        ? {
            ...s,
            business: {
              ...s.business,
              pendingSubscriptionTier: null,
              pendingSubscriptionTierEffectiveDate: null,
              pendingSubscriptionTierAcknowledged: false,
            },
          }
        : s,
    );
  }

  /** settings.md §2.3 "Cambiar a vender con tags/con botones" — immediate,
   * the *only* write path allowed to touch `defaultSellingMode` (§2.3's own
   * "never written by any other action" invariant — never called as a side
   * effect of any `subscriptionTier` action, and this function itself never
   * reads or writes `subscriptionTier`). */
  function changeDefaultSellingMode(mode: SessionOperatingMode) {
    setState((s) => (s.business ? { ...s, business: { ...s.business, defaultSellingMode: mode } } : s));
  }

  /** home.md §3.6a's fourth variant — see this function's own `StoreValue`
   * doc comment above. Idempotent — a second call (defensively unreachable
   * once `useNfcSessionStart.ts`'s own effect has fired once) is a no-op in
   * effect, since it only ever sets the flag to `true`. */
  function markNfcAvailabilityNudgeShown() {
    setState((s) => (s.business ? { ...s, business: { ...s.business, nfcAvailabilityNudgeShown: true } } : s));
  }

  /** settings.md §2.4 — see the `StoreValue` interface doc comment above for
   * the full two-phase reasoning. Reads/writes only `state.business`'s own
   * pending-change fields; never touches `defaultSellingMode` (§2.3's
   * invariant applies here too — this function has no reason to touch it and
   * doesn't). */
  function reconcilePendingSubscriptionTier(): {
    justLanded: boolean;
    tier?: 'free' | 'paid';
    effectiveDate?: string;
  } {
    const b = state.business;
    if (!b || b.pendingSubscriptionTier == null || b.pendingSubscriptionTierEffectiveDate == null) {
      return { justLanded: false };
    }
    if (b.pendingSubscriptionTierEffectiveDate > todayKey()) {
      return { justLanded: false }; // not yet landed
    }
    if (!b.pendingSubscriptionTierAcknowledged) {
      // Landing moment — flip the tier, mark acknowledged, but keep the
      // pending fields themselves for this one render so the caller can
      // still read `pendingSubscriptionTierEffectiveDate` for the
      // acknowledgment line's own date.
      const tier = b.pendingSubscriptionTier;
      const effectiveDate = b.pendingSubscriptionTierEffectiveDate;
      setState((s) =>
        s.business
          ? { ...s, business: { ...s.business, subscriptionTier: tier, pendingSubscriptionTierAcknowledged: true } }
          : s,
      );
      return { justLanded: true, tier, effectiveDate };
    }
    // Already acknowledged once, on an earlier open — this is the "next
    // Configuración open" §2.4 says renders as an ordinary row: clear the
    // pending triple entirely now.
    setState((s) =>
      s.business
        ? {
            ...s,
            business: {
              ...s.business,
              pendingSubscriptionTier: null,
              pendingSubscriptionTierEffectiveDate: null,
              pendingSubscriptionTierAcknowledged: false,
            },
          }
        : s,
    );
    return { justLanded: false };
  }

  /** settings.md §2.5/§2.5a — see the `StoreValue` interface doc comment
   * above for the full correctness reasoning (why this User row's own
   * `phoneVerifiedAt: null`, `currentUserId` left pointing at it, never
   * removed from `users`). */
  function signOut() {
    setState((s) => {
      const id = s.currentUserId;
      if (!id) return s;
      return { ...s, users: s.users.map((u) => (u.id === id ? { ...u, phoneVerifiedAt: null } : u)) };
    });
  }

  /** settings.md §2.7 "Invitar a alguien" (§3.12) — see this function's own
   * `StoreValue` doc comment for the full reasoning. Defensive re-check
   * mirrors the UI's own inline validation (§3.12: a duplicate pending
   * Invitation, or an existing active/revoked Membership for this phone,
   * both leave the number unwritable) — never trusts the UI alone, same
   * posture every other write in this file already holds itself to. */
  function createInvitation(phone: string) {
    setState((s) => {
      if (!s.business || s.business.subscriptionTier !== 'paid') return s;
      const alreadyPending = s.invitations.some(
        (inv) => inv.businessId === s.business!.id && inv.phone === phone && inv.status === 'pending',
      );
      const alreadyMember = s.memberships.some((m) => {
        const u = s.users.find((usr) => usr.id === m.userId);
        return m.businessId === s.business!.id && u?.phone === phone;
      });
      if (alreadyPending || alreadyMember) return s;
      const invitation: Invitation = {
        id: makeId('inv'),
        businessId: s.business.id,
        phone,
        role: 'SELLER',
        status: 'pending',
        createdAt: Date.now(),
      };
      return { ...s, invitations: [...s.invitations, invitation] };
    });
  }

  /** authentication.md §2.2a step 3 — the Invitation-acceptance invariant
   * (RFC 0008/D56). See this function's own `StoreValue` doc comment for
   * the full reasoning. */
  function acceptInvitation(invitationId: ID): ID | null {
    const user = currentUser(state);
    if (!user || user.phoneVerifiedAt == null) return null;
    const invitation = state.invitations.find((inv) => inv.id === invitationId);
    if (!invitation || invitation.status !== 'pending') return null;
    const existing = findMembership(state, user.id, invitation.businessId);
    if (existing) return invitation.businessId; // idempotency guard — never mint a duplicate Membership
    const membership: BusinessMembership = {
      id: makeId('mem'),
      userId: user.id,
      businessId: invitation.businessId,
      role: 'SELLER',
      status: 'active',
      revokedAt: null,
      createdAt: Date.now(),
    };
    setState((s) => ({
      ...s,
      memberships: [...s.memberships, membership],
      invitations: s.invitations.map((inv) => (inv.id === invitationId ? { ...inv, status: 'accepted' } : inv)),
    }));
    return invitation.businessId;
  }

  /** authentication.md §2.2a step 4 / §10 "Ahora no" — see this function's
   * own `StoreValue` doc comment for the full reasoning. Touches only this
   * User row's own `declinedInvitationIds` — the `Invitation` record itself
   * is never read or written here. */
  function declineInvitation(invitationId: ID) {
    const user = currentUser(state);
    if (!user) return;
    if (user.declinedInvitationIds.includes(invitationId)) return; // idempotency guard
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === user.id ? { ...u, declinedInvitationIds: [...u.declinedInvitationIds, invitationId] } : u,
      ),
    }));
  }

  /** settings.md §2.7 "Quitar" (§3.13) — see this function's own `StoreValue`
   * doc comment for the full reasoning. */
  function revokeMembership(membershipId: ID) {
    setState((s) => ({
      ...s,
      memberships: s.memberships.map((m) =>
        m.id === membershipId && m.status === 'active' ? { ...m, status: 'revoked', revokedAt: Date.now() } : m,
      ),
    }));
  }

  /** events.md §3.21/§3.23 "Guardar cambios" — see this function's own
   * `StoreValue` doc comment for the full reasoning. One `setState` for the
   * whole bulk commit, matching this file's "one write, one save moment"
   * convention for every other multi-line commit (`commitLot`). */
  function saveEventAllocations(eventId: ID, changes: { productId: ID; quantity: number }[]) {
    setState((s) => {
      let eventAllocations = s.eventAllocations;
      for (const change of changes) {
        const existingIndex = eventAllocations.findIndex(
          (a) => a.eventId === eventId && a.productId === change.productId && a.status === 'open',
        );
        if (existingIndex === -1) {
          if (change.quantity <= 0) continue; // nothing to create for a still-zero row
          const allocation: EventAllocation = {
            id: makeId('alloc'),
            eventId,
            productId: change.productId,
            quantityAllocated: change.quantity,
            quantityRemaining: change.quantity,
            status: 'open',
            createdAt: Date.now(),
          };
          eventAllocations = [...eventAllocations, allocation];
        } else {
          const current = eventAllocations[existingIndex];
          const delta = change.quantity - current.quantityAllocated;
          const updated: EventAllocation = {
            ...current,
            quantityAllocated: change.quantity,
            quantityRemaining: Math.max(0, current.quantityRemaining + delta),
          };
          eventAllocations = [...eventAllocations.slice(0, existingIndex), updated, ...eventAllocations.slice(existingIndex + 1)];
        }
      }
      return { ...s, eventAllocations };
    });
  }

  function resetPrototype() {
    setState(initialState());
  }

  const value: StoreValue = {
    state,
    verifyOtp,
    completeOnboarding,
    setBusinessIdentity,
    acknowledgeOnboarding,
    commitLot,
    editPrice,
    setProductPhoto,
    assignTagToNextPendingUnit,
    createEvent,
    cancelEvent,
    setPriceOverride,
    startSession,
    addItemToSale,
    addItemToSaleByTag,
    removeSaleItem,
    cancelSale,
    finalizeSale,
    closeSession,
    activatePaidPlan,
    requestDowngradeToFree,
    cancelPendingSubscriptionTierChange,
    changeDefaultSellingMode,
    markNfcAvailabilityNudgeShown,
    reconcilePendingSubscriptionTier,
    signOut,
    createInvitation,
    acceptInvitation,
    declineInvitation,
    revokeMembership,
    saveEventAllocations,
    resetPrototype,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
