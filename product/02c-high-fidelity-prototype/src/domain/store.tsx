import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { makeId } from './id';
import { dateKey, todayKey } from './dates';
import { sendOtp, verifyOtpCode } from './otpClient';
import { peekInvitationRemote } from './invitationClient';
import {
  actingMembership,
  currentUser,
  eventStatus,
  myActiveSession,
  nfcCapable,
  nfcReadiness,
  quantityRemaining,
  saleItemHasEventAllocationCommitment,
} from './selectors';
import type {
  AllocationMovement,
  AppState,
  AuthIdentity,
  Business,
  BusinessMembership,
  Event,
  EventAllocation,
  EventAllocationUnit,
  EventAssignment,
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
import { getSupabaseClient, resolveGoogleSession, sendEmailCode, signInWithGoogle, verifyEmailCode } from './authProviders';
import {
  mapAllocationMovementRow,
  mapEntryRow,
  mapEventAllocationRow,
  mapEventAllocationUnitRow,
  mapEventAssignmentRow,
  mapEventRow,
  mapLotRow,
  mapMembershipRow,
  mapPriceOverrideRow,
  mapProductRow,
  mapSaleItemRow,
  mapSaleRow,
  mapSessionRow,
  mapUnitRow,
  mapVenueRow,
  mapBusinessRow,
} from './hydrationMapping';

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
    authIdentities: [],
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
    eventAllocationUnits: [],
    allocationMovements: [],
    eventAssignments: [],
  };
}

/** Legacy-shape read (localStorage written before Slice 12's `users[]`/
 * `currentUserId` refactor) — `currentUser` was the single-slot field this
 * migration replaces. Kept as a narrow, explicitly-typed escape hatch for
 * `loadState`'s own migration branch only, never used elsewhere. */
/** RFC 0012/D62-63 — a `User` row as it existed before the `AuthIdentity`
 * correction (`phone`/`phoneVerifiedAt` directly on `User`), for `loadState`'s
 * own migration branch only. */
type LegacyUser = Omit<User, never> & { phone?: string; phoneVerifiedAt?: number | null };

interface LegacyAppStateShape
  extends Omit<
    AppState,
    | 'users'
    | 'authIdentities'
    | 'currentUserId'
    | 'invitations'
    | 'eventAllocations'
    | 'eventAllocationUnits'
    | 'allocationMovements'
    | 'eventAssignments'
  > {
  currentUser?: LegacyUser | null;
  users?: LegacyUser[];
  authIdentities?: AuthIdentity[];
  currentUserId?: ID | null;
  invitations?: Invitation[];
  /** RFC 0010/D59 — an old saved row predates `quantityPlanned` (it may
   * still carry the now-retired stored `quantityRemaining`/`allocatedUnitIds`
   * keys, harmlessly ignored — Phase 2b's own real `event_allocation_units`
   * table, mirrored client-side as `eventAllocationUnits` below, is what
   * `allocatedUnitIds` was retired in favor of) — see `loadState`'s own
   * migration below. Typed loosely (`EventAllocation`, not a variant
   * omitting the new fields) matching every other legacy field in this
   * interface's own established "cast loosely, default with `??` at read
   * time" convention (`memberships.status`/`sessions.openedByMembershipId`
   * below). */
  eventAllocations?: EventAllocation[];
  /** Stage 7 Backend Integration, Phase 2b — an older saved state (before
   * this pass) has no `eventAllocationUnits` key at all; defaulted to `[]`
   * below, same backward-compat treatment every other Slice-12+ array field
   * already gets. */
  eventAllocationUnits?: EventAllocationUnit[];
  allocationMovements?: AllocationMovement[];
  eventAssignments?: EventAssignment[];
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
        // Slice 12 (Slice-12-defect fix, 2026-09-07) — an older saved `User`
        // row (before the §3.7e device-history check existed) has no
        // `phoneMismatchConfirmationPending` key at all; defaulted to
        // `false`, the same honest "nothing to confirm" value a User who
        // predates this check would have had all along.
        const legacyUsers: LegacyUser[] = Array.isArray(parsed.users)
          ? parsed.users
          : parsed.currentUser
            ? [parsed.currentUser]
            : [];
        const users: User[] = legacyUsers.map((u) => ({
          id: u.id,
          createdAt: u.createdAt,
          declinedInvitationIds: u.declinedInvitationIds ?? [],
          phoneMismatchConfirmationPending: u.phoneMismatchConfirmationPending ?? false,
        }));

        // RFC 0012/D62-63 — `AuthIdentity` migration. A localStorage value
        // written after this pass already has a real `authIdentities` array;
        // one written before it has none at all, but every legacy `User` row
        // carries its own `phone`/`phoneVerifiedAt` directly — exactly the
        // two fields this migration folds into a synthesized `type='phone'`
        // `AuthIdentity` row per verified legacy User, so an existing
        // walkthrough's phone-verification history is never silently lost.
        // An unverified legacy row (`phoneVerifiedAt == null`, i.e. a signed-
        // out User under the old model) mints no identity row at all — under
        // the old model that phone was never actually re-nulled out of
        // existence, but the *fact* that mattered structurally was always
        // "was it ever successfully verified," which is exactly what
        // `phoneVerifiedAt` staying non-null on first verification, forever,
        // already told us — so this reads `phoneVerifiedAt` for the
        // timestamp, not as a live on/off session flag (that role now
        // belongs to `currentUserId` alone, corrected below).
        const authIdentities: AuthIdentity[] = Array.isArray(parsed.authIdentities)
          ? parsed.authIdentities
          : legacyUsers
              .filter((u) => u.phone && u.phoneVerifiedAt != null)
              .map((u) => ({
                id: makeId('authid'),
                userId: u.id,
                type: 'phone' as const,
                identifier: u.phone!,
                verifiedAt: u.phoneVerifiedAt!,
                createdAt: u.phoneVerifiedAt!,
              }));

        // **Corrected, RFC 0012/D62-63:** `currentUserId` used to stay
        // pointed at a User row even after `signOut` (only that row's own
        // `phoneVerifiedAt` flipped to `null`) — under the new model,
        // `currentUserId` itself is the one live/dead session signal
        // (`AuthIdentity.verifiedAt` is permanent once set, never nulled
        // again). A pre-migration save whose pointed-to legacy User had
        // already been signed out (`phoneVerifiedAt == null`) migrates to no
        // live session at all — the honest equivalent under the corrected
        // model, not a behavior regression: that device was already showing
        // `AuthenticationFlow` before this migration ever runs.
        const rawCurrentUserId: ID | null =
          parsed.currentUserId !== undefined ? parsed.currentUserId : (parsed.currentUser?.id ?? null);
        const pointedLegacyUser = legacyUsers.find((u) => u.id === rawCurrentUserId);
        const currentUserId: ID | null =
          rawCurrentUserId != null && (pointedLegacyUser ? pointedLegacyUser.phoneVerifiedAt != null : true)
            ? rawCurrentUserId
            : null;

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
        // RFC 0010/D59 — an older saved `EventAllocation` row (before this
        // pass) has no `quantityPlanned` at all; defaulted to `0`, the same
        // honest "nothing planned yet" starting shape a brand-new row gets.
        // Its old, now-retired `quantityRemaining`/`allocatedUnitIds` keys
        // (if present) are simply never read again — `quantityRemaining` is
        // a derived selector, and the real committed set now lives in its
        // own mirrored table, `eventAllocationUnits` (below).
        const eventAllocations: EventAllocation[] = (
          Array.isArray(parsed.eventAllocations) ? parsed.eventAllocations : []
        ).map((a) => ({
          ...a,
          quantityPlanned: a.quantityPlanned ?? 0,
        }));
        // Stage 7 Backend Integration, Phase 2b — an older saved state (before
        // this pass) has no `eventAllocationUnits` key at all; defaulted to
        // `[]` — an existing walkthrough resumes with its allocation history
        // intact (real `EventAllocation`/`AllocationMovement` rows), just
        // without a locally-mirrored committed-unit set until she next visits
        // an allocation screen and this build's own RPC calls repopulate it.
        const eventAllocationUnits = Array.isArray(parsed.eventAllocationUnits) ? parsed.eventAllocationUnits : [];
        // RFC 0010/D59 — an older saved state (before this pass) has no
        // `allocationMovements` key at all; defaulted to `[]`, the same
        // backward-compat treatment every other Slice-12+ array field here
        // already gets.
        const allocationMovements = Array.isArray(parsed.allocationMovements) ? parsed.allocationMovements : [];
        // RFC 0011/D60 — an older saved state (before this pass) has no
        // `eventAssignments` key at all; defaulted to `[]`, the same
        // backward-compat treatment every other Slice-12+ array field above
        // already gets.
        const eventAssignments = Array.isArray(parsed.eventAssignments) ? parsed.eventAssignments : [];

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
          authIdentities,
          currentUserId,
          memberships,
          invitations,
          sessions,
          sales,
          venues,
          events,
          priceOverrides,
          eventAllocations,
          eventAllocationUnits,
          allocationMovements,
          eventAssignments,
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
     * time. `barcode` (`decision-log.md` D65) — same posture: only
     * meaningful for a to-be-minted Product, set exactly once, only when
     * this line was resolved via the picker's "vía escaneo, sin
     * coincidencia" path (`inventory.md` §3.8a's scan variant); the typed
     * path never sets it. */
    | { kind: 'new'; name: string; defaultPrice: number; photo?: string; barcode?: string };
}

/**
 * `onboarding.md` §2.2's three-way capability table. Note: this `'demo'`
 * value is the Onboarding "Ver un ejemplo" path — unrelated to the
 * now-retired `demo.nahui.app` validation-campaign build gate, which reused
 * the same "demo" token for a different, build-time concept before it was
 * removed (2026-09-10, Product Owner decision — see `company/bitacora.md`'s
 * retirement entry). No shared imports or storage keys ever existed between
 * the two; this comment exists only to disambiguate at a grep/read level.
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

/** authentication.md §3.7's own error-state vocabulary (`CodeStep.tsx`'s
 * `codeError`) — `verifyOtp` now resolves to one of these instead of
 * always succeeding. */
export type VerifyOtpOutcome =
  | { ok: true; user: User }
  | { ok: false; reason: 'incorrect' | 'expired' | 'too-many' | 'platform-error' };

/** authentication.md §3.5a's own error state (`PhoneStep.tsx`'s
 * `sendState === 'error'`). */
export type RequestOtpOutcome = { ok: true } | { ok: false; reason: 'rate-limited' | 'platform-error' };

interface StoreValue {
  state: AppState;
  /**
   * Stage 7 Backend Integration — Read-side data hydration
   * (`context/stage-7-backend-integration.md`'s "Read-side data hydration
   * design"). Transient — never persisted to `localStorage`/`AppState`,
   * since it describes this device's own in-flight read activity, not
   * domain data. `'idle'` before the first resolution attempt has even
   * started (the instant after mount, before the auth-resolution `useEffect`
   * below has run); `'loading'` while `resolveActiveBusinessFromAuth`/
   * `hydrateFromBackend` are in flight; `'ready'` once a cycle has resolved
   * — including the honest "no real Supabase Auth session/Business to
   * hydrate yet" case (a fresh phone-OTP-only session, or a genuinely new
   * merchant who hasn't finished Onboarding), which is a successful
   * resolution, not an error; `'error'` only for a genuine platform/network
   * failure. `AppRouter.tsx` is this value's one load-bearing consumer — see
   * its own `AuthResolving` gate for why.
   */
  hydrationStatus: 'idle' | 'loading' | 'ready' | 'error';
  /** Re-runs the exact same resolution cycle the mount `useEffect` below
   * runs — `AppRouter.tsx`'s own "Reintentar" affordance on `AuthResolving`'s
   * error state. */
  retryHydration: () => void;
  /**
   * Stage 7 Backend Integration — Read-side data hydration. `Promise.all` of
   * one `.select('*')` per domain table (every `AppState` array slice this
   * cycle owns gets a matching query — see `hydrationMapping.ts`'s own doc
   * comment for the full table list and what's deliberately excluded:
   * `users`/`authIdentities`/`invitations`, and, as a hard guardrail,
   * Loyalty-claim's `customers`/`claims`, never queried anywhere in this
   * codebase), scoped to `businessId` server-side (RLS) and again client-side
   * (`.eq('business_id', ...)`, matching every existing `.rpc()` call site's
   * own business-scoping convention) for determinism/query efficiency.
   *
   * Race-safety against the existing write-mirror pattern
   * (`writeGenerationRef`/`applyWriteMirror` below): captures the current
   * write generation before issuing any reads, and re-checks it after they
   * resolve — a mismatch means a write landed mid-cycle, so this cycle's
   * results are discarded outright (never merged with `AppState`), retried
   * up to twice (`attempt < 2`), then abandoned (`'stale'`) for the next
   * natural trigger (mount, `visibilitychange`, or Resultados' own mount).
   * On success, wholesale-replaces every corresponding `AppState` array
   * slice — never a per-row merge (no `updated_at`/version columns exist to
   * support one, and this domain model has no real-time subscription
   * pushing incremental deltas either).
   *
   * Exposed on `StoreValue` (not just an internal `store.tsx` function)
   * because Resultados' own screen-mount calls this directly, per the design
   * summary's own third trigger.
   */
  hydrateFromBackend: (businessId: ID, attempt?: number) => Promise<'ok' | 'error' | 'stale'>;
  /** authentication.md §3.5 "Enviar código" — Stage 7 Backend Integration:
   * a real call to the `send-otp` Supabase Edge Function
   * (`supabase/functions/send-otp/`, via `otpClient.ts`), which generates
   * and WhatsApp-delivers a real code via Twilio. Nothing is written to
   * `AppState` here — the OTP itself lives entirely server-side
   * (`otp_attempts`), never in the client. See `supabase/README.md`: not
   * live-tested, since no real Supabase/Twilio account exists yet. */
  requestOtp: (phone: string) => Promise<RequestOtpOutcome>;
  /** authentication.md §3.7 (Confirmar) — Stage 7 Backend Integration: a
   * real call to the `verify-otp` Supabase Edge Function
   * (`supabase/functions/verify-otp/`, via `otpClient.ts`), replacing the
   * previous "any 6-digit code is accepted" mock (RFC 0007 §5's own
   * suggested simplification, disclosed in
   * docs/passes/slice-2-authentication-onboarding.md — now retired).
   * Creates the device's `User` row on a first-ever *successful*
   * verification, or resolves the existing one on a returning
   * verification for the same phone; on any rejected outcome, no `User`
   * row is created or changed. See `supabase/README.md`: not live-tested,
   * since no real Supabase/Twilio account exists yet. */
  verifyOtp: (phone: string, code: string) => Promise<VerifyOtpOutcome>;
  /** authentication.md §3.2e "Enviar código" (`decision-log.md` D62/D63) —
   * the email-channel counterpart to `requestOtp`, through
   * `src/domain/authProviders.ts`'s thin wrapper around Supabase Auth's own
   * `signInWithOtp({ email })`. Not live-tested — same posture `requestOtp`
   * already has. */
  requestEmailOtp: (email: string) => Promise<RequestOtpOutcome>;
  /** authentication.md §3.7 (shared with the email channel) — the
   * email-channel counterpart to `verifyOtp`, through `authProviders.ts`'s
   * `verifyEmailCode` (Supabase Auth's own `verifyOtp({ type: 'email' })`).
   * Same `AuthIdentity` resolution shape as `verifyOtp` (`resolveAuthIdentity`,
   * `type='email'`). Not live-tested — same posture `verifyOtp` already
   * has. */
  verifyEmailOtp: (email: string, code: string) => Promise<VerifyOtpOutcome>;
  /** authentication.md §3.2a/§3.2b "Continuar con Google" (`decision-log.md`
   * D62/D63) — starts the real Supabase Auth OAuth redirect
   * (`authProviders.ts`'s `signInWithGoogle`). A genuine full-page
   * navigation away from and back to this app — `ok: false` means the
   * redirect itself never started (a genuine send-time platform error,
   * §3.2d), not a later cancellation (that's `resolveGoogleSignIn` below).
   * Fails closed until a real Google Cloud OAuth Client is provisioned in
   * the Supabase project (Product Owner action, not code) — same "ships
   * real code, gated on external credentials" posture `requestOtp` already
   * has for Twilio/WhatsApp. */
  startGoogleSignIn: () => Promise<{ ok: true } | { ok: false }>;
  /** authentication.md §3.2c "Verificando con Google" (`decision-log.md`
   * D62/D63) — resolves whatever happened once control returns from
   * Google's own UI (real success / silent cancellation / genuine platform
   * error), called on mount by `AuthenticationFlow.tsx` whenever there's
   * reason to believe a Google redirect is being resumed. `displayLabel` is
   * the human-readable value read live from the OAuth session, for
   * `authentication.md` §3.7e's confirm-screen display only — **never**
   * persisted to `AppState`/`AuthIdentity` (RFC 0012 §1). */
  resolveGoogleSignIn: () => Promise<
    { status: 'success'; user: User; displayLabel: string | null } | { status: 'cancelled' } | { status: 'error' }
  >;
  /** onboarding.md §3.5 "Creando tu negocio" — Stage 7 Backend Integration,
   * Phase 0 (`supabase/migrations/20260913000000_identity_persistence_layer.sql`):
   * a real call to the `create_business_with_owner` SECURITY DEFINER RPC,
   * which re-implements the Owner-creation invariant server-side (RFC
   * 0007/D44, amended RFC 0012/D62-63) — creates the Business (capabilities
   * per `path`, §2.2's table) and an OWNER BusinessMembership atomically,
   * gated on this User holding at least one verified `AuthIdentity`, of any
   * type. Idempotency-keyed: the same client-generated key is reused across
   * every retry of one logical onboarding attempt (`architecture-principles.md`
   * #7/D30), never regenerated per call. Resolves to the new Business's id,
   * or `null` on any rejected/failed outcome (no verified identity, no
   * Supabase configured, a genuine platform error) — `OnboardingFlow.tsx`
   * routes a `null` result to its own `'creating-error'` retry state.
   * `Business.name` starts `''` (see types.ts) — identity is a separate,
   * later write (`setBusinessIdentity`, wired to the real
   * `update_business_identity` RPC, see that function's own doc comment). */
  completeOnboarding: (path: OnboardingPath) => Promise<ID | null>;
  /** onboarding.md §3.10 "Guardando tu negocio" — additive identity fields
   * on the already-existing Business (§2.2b), a separate write from
   * `completeOnboarding`'s own capabilities write, per that section's own
   * reasoning (own idempotency key, own retry surface). Stage 7 Backend
   * Integration — real, idempotency-keyed call to `update_business_identity`,
   * closing the read-side hydration wholesale-replace gap `reviewer` flagged
   * as a Blocker (`20260914000000_business_settings_writes.sql`). Resolves
   * `true` on success, `false` on any rejected/failed outcome — same
   * "server-confirmed, then local mirror" shape as `editPrice`. */
  setBusinessIdentity: (fields: { name: string; logo?: string; description?: string }) => Promise<boolean>;
  /** onboarding.md §3.6 "Todo listo" — marks the milestone dismissed
   * (tapped "Entrar," or auto-continued). See `Business.onboardingAcknowledged`.
   * Stage 7 Backend Integration — real call to `acknowledge_onboarding`,
   * same shape as `setBusinessIdentity` above. */
  acknowledgeOnboarding: () => Promise<boolean>;
  /** inventory.md §3.8a/§3.9 "Guardar mercancía," and — as of
   * `product-decisions.md` Q20 — onboarding.md §2.2a/§3.5b–§3.5e "Guardando
   * lo que vendes" as well: the one atomic write that mints any genuinely
   * new Product identities and their Lot/InventoryEntry/InventoryUnit set
   * together. Onboarding's "Define lo que vendes" step used to call a
   * separate, Product-only `createProducts` write (no stock); Q20 retired
   * that mechanism in favor of this one, since a first-run Catalog's lines
   * are always to-be-minted Products, never an `existing` match.
   *
   * Stage 7 Backend Integration, Phase 1 (`supabase/migrations/
   * 20260913030000_inventory_persistence_layer.sql`,
   * `20260913031000_inventory_persistence_layer_fixes.sql`,
   * `20260913033000_inventory_persistence_layer_fixes.sql`): a real call to
   * the `commit_lot` SECURITY DEFINER RPC, closing the idempotency-key gap
   * `BACKLOG.md` §F previously named. **`reviewer` Blocker fix (2026-09-13):**
   * the idempotency key is now supplied by the caller, not minted fresh
   * inside this function on every invocation — the earlier shape defeated
   * `commit_lot`'s own replay-on-conflict guarantee, since a retry after a
   * lost response would mint a brand-new key and the RPC would treat it as a
   * genuinely new attempt, silently doubling the Lot/Products/InventoryUnits.
   * `commit_lot` has multiple, structurally independent call sites
   * (RegisterMerchandise.tsx, SellingGroups.tsx via OnboardingFlow.tsx, the
   * demo seed in OnboardingFlow.tsx) — each one owns its own logical
   * attempt/retry surface, so each caller manages its own stable key (the
   * same `useRef<string | null>`, generate-once-if-null,
   * reused-across-retry, cleared-on-success shape `completeOnboarding`'s own
   * `onboardingIdempotencyKeyRef` already established above — mirrored, not
   * shared, since a single store-level ref would incorrectly leak one
   * caller's in-flight key into an unrelated caller's own attempt).
   * Resolves to the resolved productId for each line, same order as input —
   * a freshly-minted id for `new` lines, the given id for `existing` ones —
   * or `null` on any rejected/failed outcome (no Business, no Supabase
   * configured, a genuine platform error). */
  commitLot: (lines: CommitLotLine[], idempotencyKey: string) => Promise<ID[] | null>;
  /** inventory.md §3.4a "Editar precio" — the Catalog-row-level
   * `Product.defaultPrice` write. Stage 7 Backend Integration, Phase 1: a
   * real, idempotency-keyed call to the `update_product_price` RPC, closing
   * the gap `BACKLOG.md` §F previously named. Resolves `true` on success,
   * `false` on any rejected/failed outcome (no local state change happens
   * in that case — `CatalogView.tsx`'s sheet stays open so she can retry). */
  editPrice: (productId: ID, newPrice: number) => Promise<boolean>;
  /** inventory.md §3.4b "Guardar foto" (`product-decisions.md` Q23) — the
   * Catalog-row-level `Product.photo` write, same shape as `editPrice`
   * immediately above. `undefined` writes a removal ("Quitar" staged, then
   * committed). Stage 7 Backend Integration, Phase 1: a real,
   * idempotency-keyed call to the `update_product_photo` RPC, closing the
   * gap `BACKLOG.md` §F previously named. Resolves `true` on success,
   * `false` on any rejected/failed outcome. */
  setProductPhoto: (productId: ID, photo: string | undefined) => Promise<boolean>;
  /** inventory.md §3.14 — Asignar Tags' own write, one scan at a time
   * (`addItemToSale`'s per-event-write shape, not `commitLot`'s batch
   * shape). "Next pending unit" = FIFO-first (oldest `receivedAt`) unit,
   * global across every Lot/Product (`inventory.md` §2 step 2's own
   * business-wide gate), never scoped to the Lot that was just registered
   * — resolved server-side now, not by scanning the local `state.units`
   * array. `already-assigned` is checked before `queue-empty` — a
   * business-logic conflict (§3.15) is distinct from there being nothing
   * left to tag (§2 step 4/§3.13).
   *
   * Stage 7 Backend Integration, Phase 1: a real, idempotency-keyed call
   * (fresh key per scan — each scan is its own logical attempt) to the
   * `assign_tag_to_next_pending_unit` RPC. `platform-error` is a new
   * outcome a purely-client-side mock never had — a genuine network/RPC
   * failure, distinct from the two named business-logic outcomes above. */
  assignTagToNextPendingUnit: (
    tagId: string,
  ) => Promise<
    | { ok: true; unitId: ID; productId: ID }
    | { ok: false; reason: 'already-assigned' }
    | { ok: false; reason: 'queue-empty' }
    | { ok: false; reason: 'platform-error' }
  >;
  /** events.md §3.6 "Guardar evento" — Stage 7 Backend Integration, Phase 2
   * (`supabase/migrations/20260913040000_selling_persistence_layer.sql`): a
   * real, idempotency-keyed call to `create_event`, which resolves `venue`
   * (mint-or-find) and inserts the Event atomically, server-side. **The D17
   * overlap check this write once re-ran defensively is removed outright,
   * not merely relaxed (`decision-log.md` D53, Slice 12)** — the server
   * schema itself carries no overlap/uniqueness constraint across Events.
   * `idempotencyKey` is supplied by the caller (`NuevoEvento.tsx`'s own
   * per-attempt ref, mirroring `commitLot`'s fix — the screen already has a
   * real, disclosed "Reintentar" retry affordance, now genuinely wired).
   * Resolves to the new Event's id, or `null` on any rejected/failed
   * outcome. */
  createEvent: (
    fields: {
      venue: VenueRef;
      type: EventType;
      startDate: string;
      endDate: string;
      bazaarCost: number;
    },
    idempotencyKey: string,
  ) => Promise<ID | null>;
  /** events.md §3.12 — Stage 7 Backend Integration, Phase 2: a real call to
   * `cancel_event`, a naturally-idempotent status flip (no client-supplied
   * key needed). Only meaningful while the Event's *computed* status is
   * still `scheduled` (§2, §3.11) — re-checked client-side first (a cheap
   * local no-op) and, authoritatively, again inside the RPC. */
  cancelEvent: (eventId: ID) => Promise<void>;
  /** events.md §3.20 (D33) — Stage 7 Backend Integration, Phase 2: a real,
   * idempotency-keyed call to `set_price_override` (an upsert — "light
   * idempotency," same posture `update_product_price` already established
   * in Phase 1). Defensively re-checks the Event's computed status is still
   * `scheduled` at write time (§3.20: "unreachable at all once active, not
   * just hidden") — a no-op if it isn't, never a thrown error, matching this
   * codebase's existing defensive-guard style (`startSession`, `finalizeSale`),
   * checked client-side first and, authoritatively, again inside the RPC. */
  setPriceOverride: (eventId: ID, productId: ID, overridePrice: number) => Promise<void>;
  /** home.md §2 / events.md §2 — Stage 7 Backend Integration, Phase 2: a
   * real call to `start_session`, naturally safe under concurrent double-
   * submission via `ON CONFLICT` against the server's own partial unique
   * index (D66) — no client-supplied idempotency key needed. `eventId` is
   * optional; omitted (or `null`) for a Quick Session, exactly as before.
   * **Slice 12's multi-staff scope:** scoped to this device's own acting
   * Membership (`actingMembership`, `selectors.ts`), since two different
   * Memberships now genuinely can each hold their own concurrently-open
   * Session (`product-decisions.md` Q24/Q25) — writes
   * `Session.openedByMembershipId` (see that field's own `types.ts` doc
   * comment), a real, permanent column as of D66, not the disclosed
   * prototype-only crutch that field's own doc comment previously described.
   * **NFC Selling pass (D43):** `overrideToNfc` is Ana's own Limited Ready
   * override choice (§3.6a's "Usar tags de todos modos"), resolved locally
   * in the UI *before* this tap (`useNfcSessionStart.ts`) and threaded
   * through here — it can't be derived from stored state, since it's a
   * one-off, per-tap choice, never persisted. Defaults to `false` (no
   * override) so every other existing call site stays correct with no
   * change. `Session.operatingMode` itself is resolved client-side (never
   * trusting a UI-computed value alone, same posture `setPriceOverride`
   * above already establishes) and passed to the RPC already-resolved; the
   * RPC re-checks the one entitlement-relevant boundary server-side ('nfc'
   * requires `subscriptionTier='paid'`, D27). */
  startSession: (eventId?: ID | null, overrideToNfc?: boolean) => Promise<void>;
  /** home.md §3.8a/§3.9 — FIFO tap-to-add (Buttons mode). Stage 7 Backend
   * Integration, Phase 2: a real, idempotency-keyed call to `add_item_to_sale`
   * — the FIFO pick (D5), price resolution (D33), Sale mint-or-find, and
   * SaleItem write all happen atomically server-side now (`FOR UPDATE SKIP
   * LOCKED`, the same concurrency-safety mechanism
   * `assignTagToNextPendingUnit` already established in Phase 1), stamping
   * the Sale's own `performedByMembershipId` the moment its first item is
   * appended (`decision-log.md` D58). **Phase 2b — `EventAllocation`-aware
   * selection is now real**: when an open `EventAllocation` exists for this
   * Session's own Event/Product, the RPC consumes exclusively from its
   * committed pool, never falling back to the plain pool — `'exhausted'` is
   * that pool's own terminal, non-retriable compare-and-swap failure
   * (`home.md` §3.8a's ⊗ pattern's real trigger); `'failed'` is every other
   * rejected/failed outcome (no local state change happens in either case).
   * `idempotencyKey` is supplied by the caller (`Selling.tsx`'s own
   * per-product idempotency-key ref, mirroring `commitLot`'s fix — the
   * single highest-frequency write in the whole product, so this is where
   * that retry discipline matters most). */
  addItemToSale: (productId: ID, idempotencyKey: string) => Promise<'added' | 'exhausted' | 'failed'>;
  /** home.md §3.10 — the nfc-mode counterpart to `addItemToSale` above.
   * Stage 7 Backend Integration, Phase 2: a real call to
   * `add_item_to_sale_by_tag`, sharing `add_item_to_sale`'s own server-side
   * logic with one swap: the unit is resolved by the *specific* scanned
   * `tagId` rather than a FIFO scan. Mirrors `assignTagToNextPendingUnit`'s
   * discriminated-result shape, and its own fresh-key-per-scan idempotency
   * treatment (a distinct physical scan is a genuinely new logical attempt,
   * never a retry of a prior one). `'no-match'` covers the genuinely open
   * gap `product/02-ux/product-decisions.md` Q2 names (a scan that matches
   * no `available` tagged unit) — this build never invents a resolution UI
   * for it (see `Selling.tsx`'s own caller), only guarantees the write path
   * itself never silently does the wrong thing. */
  addItemToSaleByTag: (
    tagId: string,
  ) => Promise<
    | { ok: true; unitId: ID; productId: ID }
    | { ok: false; reason: 'no-active-session' }
    | { ok: false; reason: 'no-match' }
  >;
  /** home.md §3.8a's "Quitar de la venta" — the single, always-offered tap
   * that resolves a lost-race conflict marker (§3.8a extended, §3.8d-i,
   * §3.8d-ii, `product-decisions.md` Q24/Q25), and the only per-item
   * removal path in this file (`cancelSale` below still clears the whole
   * open Sale at once — a different, pre-existing action). Stage 7 Backend
   * Integration, Phase 2: a real call to `remove_sale_item` (naturally
   * idempotent by id — no client-supplied key needed). **Plain
   * reserved->available revert only** — RFC 0010/D59's own "still
   * genuinely committed to an open EventAllocation, revert to `reserved`"
   * distinction is no longer consulted here, the same Phase 2b scope
   * boundary `addItemToSale` above now holds. **Disclosed:** the condition
   * that ever flags an item with the lost-race marker in the first place
   * is still never organically produced through the real UI (`add_item_to_sale`'s
   * own `FOR UPDATE SKIP LOCKED` mechanism means two concurrent taps for
   * the same Product each resolve a genuinely different unit, or a
   * structurally distinct `out_of_stock` outcome — never a "lost the race
   * after already added" outcome this marker's own shape expects) — a
   * real, correctly-rendering, disclosed-not-organically-reachable branch,
   * the same posture this codebase already holds for every other state a
   * genuine Phase 2b/2c mechanism alone could eventually trigger. */
  removeSaleItem: (saleItemId: ID) => Promise<void>;
  /** home.md §3.8a "Cancelar" — Stage 7 Backend Integration, Phase 2: a real
   * call to `cancel_sale` (naturally idempotent — no open Sale on this
   * Session is a no-op — no client-supplied key needed). Same plain
   * reserved->available revert scope boundary as `removeSaleItem` above.
   * `saleId` is the specific open Sale the caller captured at the moment
   * "Cancelar" was tapped (`reviewer` Important finding, fix round 1) —
   * `cancel_sale` scopes its write to this exact id rather than resolving
   * "whatever is open right now" server-side, matching `cancelEvent`'s own
   * explicit-target precedent. */
  cancelSale: (saleId: ID) => Promise<void>;
  /** home.md §3.8c/§3.8f "Finalizar Venta" — Stage 7 Backend Integration,
   * Phase 2: a real, idempotency-keyed call to `finalize_sale` (marks every
   * sold unit `status='sold'` and the Sale `'finalized'`, atomically,
   * server-side). `idempotencyKey` is supplied by the caller (`Selling.tsx`'s
   * own per-attempt ref, mirroring `commitLot`'s fix). `total`/`itemCount`/
   * the Digital Receipt's own claim-token logic stay a client-side
   * computation over the already-mirrored `Sale.items`, unchanged. Resolves
   * `null` on any rejected/failed outcome, same as before. */
  finalizeSale: (idempotencyKey: string) => Promise<Receipt | null>;
  /** home.md §3.7 "Cerrar jornada de venta" — Stage 7 Backend Integration,
   * Phase 2: a real call to `close_session`, a naturally-idempotent status
   * flip (no client-supplied key needed, matching `cancelEvent`'s own
   * precedent above). Deliberately does not independently block on an open
   * Sale — that guarantee lives in the UI flow (`Selling.tsx`'s own
   * blocked-close sheet), not a new server-side check an approved spec
   * never called for. `sessionId` is the specific active Session the caller
   * captured at the moment "Cerrar jornada de venta" was tapped (`reviewer`
   * Important finding, fix round 1) — same explicit-target scoping as
   * `cancelSale` above. */
  closeSession: (sessionId: ID) => Promise<void>;
  /** settings.md §2.2/§3.4 "Activar plan de pago" — immediate: sets
   * `subscriptionTier='paid'` directly, per Q11's own today-illustrative
   * assignment ("she's confirming a payment already arranged"). Reachable
   * only from the Free-tier vista principal (no pending change can exist
   * there), so this never needs to touch the pending triple. Never touches
   * `defaultSellingMode` — `nfc` becomes available only as a read-time
   * derivation from the new `subscriptionTier` value (D27), never written
   * here directly. Stage 7 Backend Integration — real call to
   * `activate_paid_plan`, same "server-confirmed, then local mirror" shape
   * as `editPrice`. */
  activatePaidPlan: () => Promise<boolean>;
  /** settings.md §2.2/§3.5 "Volver al plan gratis" — deferred: sets the
   * pending-change triple (§2.4/D25/D29's own shape). Does **not** touch
   * `subscriptionTier` yet — it stays `'paid'` until the effective date
   * actually lands (`reconcilePendingSubscriptionTier`). The illustrative
   * effective date (Q11 open, `dates.ts`'s own disclosed judgment call) is
   * computed by the caller and passed in, rather than re-derived
   * server-side — Stage 7 Backend Integration — real call to
   * `request_downgrade_to_free`. */
  requestDowngradeToFree: (effectiveDate: string) => Promise<boolean>;
  /** settings.md §2.2/§3.7 "Cancelar cambio pendiente" — clears the pending
   * triple entirely; `subscriptionTier` is untouched (still `'paid'`), since
   * the pending write never touched it either. Stage 7 Backend Integration —
   * real call to `cancel_pending_subscription_tier_change`. */
  cancelPendingSubscriptionTierChange: () => Promise<boolean>;
  /** settings.md §2.3 "Cambiar a vender con tags/con botones" — immediate,
   * no pending-value/effective-date pair at all (D27: this field carries no
   * billing-cycle implication in either direction). Per §2.3's own explicit
   * invariant, this is the *only* write path that may ever touch
   * `defaultSellingMode` — never written as a side effect of any
   * `subscriptionTier` action, in either direction. Stage 7 Backend
   * Integration — real call to `change_default_selling_mode`. */
  changeDefaultSellingMode: (mode: SessionOperatingMode) => Promise<boolean>;
  /** home.md §3.6a's fourth variant (Ready-but-`buttons`, shown once ever) —
   * sets `Business.nfcAvailabilityNudgeShown = true`, permanently. Fired
   * once, via a `useEffect`, the first time that variant actually renders
   * (`useNfcSessionStart.ts`) — mirrors `reconcilePendingSubscriptionTier`'s
   * own one-time-acknowledgment write pattern above, at the field-write
   * level (no two-phase landing logic needed here, since this flag has only
   * one direction and no effective date to wait on). Stage 7 Backend
   * Integration — real call to `acknowledge_nfc_availability_nudge`. */
  markNfcAvailabilityNudgeShown: () => Promise<boolean>;
  /** settings.md §2.4 — detects a pending `subscriptionTier` change's
   * effective date arriving, with no real scheduled job (D25 leaves the
   * actual billing mechanism external): called once whenever Configuración's
   * own vista principal (§3.3a) mounts. A no-op (`justLanded: false`)
   * whenever no pending change exists, or its effective date is still in the
   * future. Otherwise it's the landing moment: the pre-write tier/date are
   * captured and returned synchronously so the caller can render §2.4's
   * one-time acknowledgment line immediately, while the real
   * `land_pending_subscription_tier` RPC (Stage 7 Backend Integration) fires
   * in the background and returns `boolean` — `true` only when its own
   * conditional UPDATE actually matched a row, `false` on a harmless no-op
   * (e.g. a concurrent `cancel_pending_subscription_tier_change` call
   * already won the race). Only on `true` does the client
   * `applyWriteMirror` the full flip — `subscriptionTier` set, the pending
   * triple cleared to null/null/false — in one atomic step, matching the
   * RPC's own all-or-nothing write. Because the RPC clears the pending
   * triple server-side the moment it lands, the "shown exactly once"
   * guarantee survives a reload for free: any later mount's own guard
   * clause (`pendingSubscriptionTier == null`) already returns
   * `justLanded: false` once the real row reflects the landed state — no
   * separate persisted "acknowledged, not yet cleared" intermediate is
   * needed or written. A failed RPC attempt, or a `false` no-op result, is
   * logged (the error case only), never surfaced to any UI (no direct user
   * action to attach an error state to) and never locally mirrored — the
   * pending triple stays intact locally either way, so only the next
   * Configuración mount retries the same detection (hydration does not
   * re-trigger this function). */
  reconcilePendingSubscriptionTier: (onSettled?: (landed: boolean) => void) => {
    justLanded: boolean;
    tier?: 'free' | 'paid';
    effectiveDate?: string;
  };
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
  /** authentication.md §3.7e "Sí, es mi número" (Slice 12
   * `merchant-user-tester` defect fix, 2026-09-07) — clears
   * `User.phoneMismatchConfirmationPending` permanently for the current
   * User, so `AppRouter.tsx`'s own `needsPhoneMismatchConfirmation`
   * derivation stops firing for this row, on this render and every future
   * one (including across a reload), and control falls through to
   * `onboarding.md §3.3` exactly as an ordinary first-ever verification on a
   * virgin device already would. See `types.ts`'s own `User.phoneMismatchConfirmationPending`
   * doc comment for the full "why a persisted flag, not ephemeral state"
   * reasoning. */
  confirmPhoneMismatch: () => void;
  /** authentication.md §3.7e "No, corregir número" (Slice 12
   * `merchant-user-tester` defect fix, 2026-09-07) — reverts the
   * just-completed verification of a phone she's telling us, right now,
   * wasn't the one she meant to type. Mechanically identical to `signOut`
   * (reverting `phoneVerifiedAt` to `null` is the one honest way this build
   * represents "this device no longer treats this phone as currently
   * active"), but named and documented separately: this User row was only
   * ever minted this same moment (§2.2 case 1, a genuinely
   * first-ever-anywhere phone) and holds no Business/Membership/Session/Sale
   * of its own yet, so reverting it costs nothing real — a different
   * situation from an ordinary account sign-out, even though both happen to
   * share one write. `AppRouter.tsx` falls back to `AuthenticationFlow`
   * automatically the instant `phoneVerifiedAt` clears, the identical
   * mechanism `signOut` already relies on. */
  retractMistypedVerification: () => void;
  /** settings.md §2.7 "Invitar a alguien" (RFC 0013/D64, real backend write
   * — Stage 7 Backend Integration, this pass) — calls `create_invitation`:
   * OWNER-only and Paid-tier-gated server-side (re-checked, never trusted
   * from the client), idempotency-keyed. Mints a fresh Invitation and
   * returns its `token` **once** — the raw token is never persisted
   * anywhere server-side either, not even in the idempotency replay cache
   * (`20260914032000_invitation_token_no_raw_cache.sql`); the caller is
   * responsible for displaying/sharing it immediately. `token` comes back
   * `null` when this call was itself a replay of an already-completed
   * request (the Invitation exists, but its one-time token display already
   * happened on the original call and can't be recovered here) — the caller
   * must fall back to `regenerateInvitation` to obtain a fresh, displayable
   * token in that case. Returns `null` outright on any failure (not
   * authorized, not Paid-tier, platform error). */
  createInvitation: (
    businessId: ID,
    targetHint: { type: 'email'; value: string } | null,
    idempotencyKey: string,
  ) => Promise<{ invitationId: ID; token: string | null; expiresAt: number } | null>;
  /** settings.md §4 "Generar otra" (RFC 0013/D64) — calls
   * `regenerate_invitation`: OWNER-only, in-place token/expiry mutation on
   * any Invitation the server itself re-confirms is still genuinely
   * `pending` (loosened from "and expired" —
   * `20260914032000_invitation_token_no_raw_cache.sql` — this is now also
   * the recovery path for a dropped `createInvitation` response; the
   * Approved UI still only surfaces the `[ Generar otra ]` button on
   * expired rows, `settings.md` §3.11). Returns the new `token` **once**,
   * same one-time-display posture as `createInvitation` — including the
   * same `token: null` replay case, which the caller cannot recover from
   * this call and would need to surface as "already regenerated, try
   * again." `null` outright on any failure (not authorized, not pending,
   * platform error). */
  regenerateInvitation: (invitationId: ID, idempotencyKey: string) => Promise<{ token: string | null; expiresAt: number } | null>;
  /** RFC 0013 §2 / §4 / §7 — calls the `peek-invitation` Edge Function
   * (`invitationClient.ts`), which itself rate-limits by caller IP before
   * calling `peek_invitation` server-side (`peek_invitation` is no longer
   * directly PostgREST-callable at all —
   * `20260914060000_peek_invitation_rate_limit.sql` revokes anon/
   * authenticated execute on it — closing the token-enumeration surface
   * RFC 0013 §4/§7 named but never actually closed). Read-only, resolves an
   * Invitation by `token` alone, before authentication runs at all (never
   * gated on `state.currentUserId`). `status` already reflects the
   * read-time `expired` derivation the server itself computes — never call
   * `invitationDisplayStatus` on this result, it's already resolved.
   * **Corrected 2026-09-15 — the prior version of this doc comment
   * collapsed `not-found` into the same `null` bucket as `rate-limited`/
   * `platform-error`, live-tested and found to contradict `authentication.md`
   * §2.0 step 2's own literal text: "the read itself fails outright" → §3.9b
   * is a genuinely different outcome from "resolves cleanly to anything
   * else — not found... or a determinate status that isn't a live
   * pending" → §3.13a. `rate-limited`/`platform-error` still collapse to
   * `null` (§3.9b, retry-appropriate — the caller can't usefully
   * distinguish a plumbing-level protection from a genuine transient
   * failure, same posture `sendOtp`'s own `rate-limited` reason already
   * gets at `PhoneStep.tsx`), but `not-found` now returns its own
   * sentinel, since it's a determinate, non-retryable outcome with its
   * own defined destination, not an ambiguous failure.** */
  peekInvitation: (
    token: string,
  ) => Promise<
    | { businessName: string; status: 'pending' | 'expired' | 'accepted' | 'revoked' }
    | 'not-found'
    | null
  >;
  /** authentication.md §2.2a step 3 (RFC 0013/D64, real backend write —
   * Stage 7 Backend Integration, this pass) — calls the already-working
   * `accept_invitation` RPC (unchanged by this pass): atomically creates
   * `BusinessMembership(userId, businessId, role='SELLER', status='active')`
   * and flips `Invitation.status: pending → accepted`, idempotency-keyed.
   * Distinguishes the RPC's three named failure modes
   * (`invitation_not_available` — already accepted/revoked/expired, or a
   * losing actor in a same-token race; `already_member` — she already holds
   * active access to this Business; `membership_revoked` — she held, and
   * lost, access, D55's no-reactivation rule) from a generic platform error
   * (`null`). */
  acceptInvitation: (
    token: string,
    idempotencyKey: string,
  ) => Promise<
    | { businessId: ID; membershipId: ID }
    | { error: 'invitation_not_available' | 'already_member' | 'membership_revoked' }
    | null
  >;
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
  /** settings.md §3.12d "Cancelar invitación" (RFC 0013/D64, real backend
   * write — Stage 7 Backend Integration) — calls `cancel_invitation`:
   * OWNER-only (re-checked server-side), idempotency-keyed, flips
   * `Invitation.status: pending → revoked` via a `status = 'pending'` CAS
   * — deliberately expiry-independent (the migration's own header comment:
   * `settings.md` §3.11 hides the "Cancelar" button on an expired row for
   * UX reasons only, not a domain rule, matching `regenerate_invitation`'s
   * own final "any still-pending row" precondition). No Paid-tier gate,
   * deliberately — unlike `createInvitation`/`regenerateInvitation` (which
   * mint a new capability a downgraded Business shouldn't get),
   * `cancel_invitation` only ever closes an existing exposure; gating it
   * would strand a downgraded OWNER unable to kill a leaked link. Returns
   * `{ error: 'invitation_not_pending' }` when the CAS loses (already
   * accepted/cancelled, or a losing actor in a same-row race) — matching
   * `acceptInvitation`'s named-exception convention above; `null` on any
   * other failure (not authorized, not found, platform error).
   * `revokeMembership` below was the same still-mock-after-RPC-shipped
   * defect class until its own real `revoke_membership` RPC was wired up
   * client-side; this closes the last still-open instance. */
  cancelInvitation: (
    invitationId: ID,
    idempotencyKey: string,
  ) => Promise<{ invitationId: ID; status: 'revoked' } | { error: 'invitation_not_pending' } | null>;
  /** settings.md §2.7 "Quitar" (§3.13) — flips `BusinessMembership.status:
   * active → revoked`, sets `revokedAt`. **Never a delete** — every Sale
   * already attributed to this Membership keeps resolving through
   * `Sale.performedByMembershipId` unaffected, the same non-deletion
   * discipline `subscriptionTier` history and `Product.active` already
   * establish (`decision-log.md` D55, Q21). No reactivation path exists —
   * the settled architecture explicitly leaves this undesigned. Stage 7
   * Backend Integration: a real call to the `revoke_membership` RPC (added
   * to the schema during Phase 0's own `reviewer` fix round,
   * `20260913010000_identity_persistence_layer_fixes.sql`, but never wired
   * client-side until now — the same still-mock-after-its-RPC-shipped gap
   * `createInvitation`/`acceptInvitation` had before the Team Invitations
   * wiring pass closed theirs). OWNER-only, re-checked server-side, never
   * trusted from this client alone. Naturally idempotent (a revoke landing
   * on an already-revoked or nonexistent-for-this-Business row is a no-op,
   * not an error) — no client-supplied idempotency key needed, matching
   * `cancelEvent`'s own precedent (itself following this RPC's). Resolves
   * to `false` on a genuine RPC failure, so `TeamScreen.tsx`'s existing
   * `remove-error` state is actually reachable; a no-op still resolves to
   * `true`, matching the RPC's own documented no-op-is-success shape. */
  revokeMembership: (membershipId: ID) => Promise<boolean>;
  /** events.md §3.21/§3.23 "Guardar cambios" — the bulk manual-allocation
   * commit: one write, every row's staged manual quantity at once, per
   * `product-decisions.md` Q24/Q25's own "she only ever sees a number
   * change... never picks or is told which underlying movement type wrote"
   * rule. Stage 7 Backend Integration, Phase 2b — a real, idempotency-keyed
   * call to `save_event_allocations`
   * (`20260913060000_event_allocation_persistence_layer.sql`): for each
   * `(productId, quantity)` pair, the server mint-or-finds this Event's own
   * `EventAllocation`, computes the signed delta against that allocation's
   * current live-remaining `fifo_assignment`-sourced count, and dispatches
   * to its own private `_fifo_commit_to_allocation`/`_release_from_allocation`
   * helpers — the same FIFO/ledger mechanics `commitAllocation`/
   * `releaseAllocation` (this build's earlier, now-retired local mock)
   * performed client-side, now real and server-authoritative. `idempotencyKey`
   * is caller-supplied (full cache-and-replay, matching `commitLot`'s own
   * shape) — one key per logical "Guardar cambios" attempt, reused unchanged
   * across a retry of that same attempt. Resolves `true` on success, `false`
   * on any rejected/failed outcome (no local state change happens in that
   * case). */
  saveEventAllocations: (
    eventId: ID,
    changes: { productId: ID; quantity: number }[],
    idempotencyKey: string,
  ) => Promise<boolean>;
  /** events.md §3.22 "Escaneando: [Producto]," NFC-mode's live, immediate
   * per-scan allocation write. Stage 7 Backend Integration, Phase 2b — a
   * real call to `scan_unit_into_event_allocation`, resolving the physical
   * tag to its already-tagged `InventoryUnit` and committing it to this
   * Event's own `EventAllocation` for that Unit's Product. A fresh
   * idempotency key per scan, generated inline — matches
   * `assignTagToNextPendingUnit`'s own precedent (each physical scan is a
   * genuinely new logical attempt, never a retry of a prior one). Not yet
   * called by any built screen — §3.22 isn't built in this slice — but a
   * real, ready function per the Phase 2b design summary's own scope. */
  scanUnitIntoEventAllocation: (
    eventId: ID,
    productId: ID,
    tagIdentifier: string,
  ) => Promise<
    | { ok: true; unitId: ID }
    | { ok: false; reason: 'already-committed' | 'tag-not-found' | 'wrong-product' | 'platform-error' }
  >;
  /** events.md §3.24 "Mover a otro evento," D57's single-transaction move of
   * allocated stock between two simultaneously-open Events. Stage 7 Backend
   * Integration, Phase 2b — a real call to `reallocate_event_allocation`.
   * Selects exactly one pool to move per call (never a mixed manual+scan
   * single move — matches the Approved UX, §3.16's mixed-row buttons acting
   * independently): `unitSource='fifo_assignment'` moves `quantity` of the
   * source allocation's own most-recently-committed manual units;
   * `unitSource='scan'` moves the specific known-tagged `unitIds` given.
   * `idempotencyKey` is caller-supplied (full cache-and-replay — a
   * client-initiated retry on a write with real merchant-facing consequence,
   * §3.24's own "one save state, one confirmation" framing). Not yet called
   * by any built screen — §3.24 isn't built in this slice (the client's own
   * `AllocationMovement.type` enum previously carried `reallocate_in`/
   * `reallocate_out` only defensively, per the Architecture Gap Analysis's
   * own finding) — but a real, ready function per the Phase 2b design
   * summary's own explicit ask. */
  reallocateEventAllocation: (
    sourceEventId: ID,
    destEventId: ID,
    productId: ID,
    unitSource: 'scan' | 'fifo_assignment',
    quantityOrUnitIds: number | ID[],
    idempotencyKey: string,
  ) => Promise<boolean>;
  /** events.md §3.16/§3.25 "Regresar a inventario general," NFC-tagged
   * rows' own full-known-set reconciliation. Stage 7 Backend Integration,
   * Phase 2b — a real call to `return_scanned_units_to_general`. No quantity
   * argument, by design (RFC 0010 §8) — always releases every currently
   * `reserved`-and-unclaimed `scan`-sourced unit for the given allocation in
   * one call. `idempotencyKey` is caller-supplied (full cache-and-replay). */
  returnScannedUnitsToGeneral: (eventAllocationId: ID, idempotencyKey: string) => Promise<boolean>;
  /** events.md §3.16 closed-Event reconciliation for manual/untagged rows
   * ("Sí, regresaron las N" / "No regresó" / Ajustar cantidad's "Confirmar"),
   * RFC 0010 §8/§11's own quantity-based reconciliation action. Stage 7
   * Backend Integration, Phase 2b — a real call to
   * `reconcile_manual_allocation`, replacing this build's earlier, now-
   * retired local `releaseAllocation(..., 'return_to_general', ...)` call
   * site. `quantityExpected` is the live-derived ceiling the caller already
   * displayed to Ana (`quantityRemainingBySource`, `selectors.ts`) — carried
   * through purely for this function's own local-mirror bookkeeping (the
   * server independently, authoritatively re-derives its own copy at write
   * time, never trusting this one for the write itself — see the RPC's own
   * doc comment). `idempotencyKey` is caller-supplied (full cache-and-
   * replay). */
  reconcileManualAllocation: (
    eventAllocationId: ID,
    quantity: number,
    quantityExpected: number,
    idempotencyKey: string,
  ) => Promise<boolean>;
  /** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — the
   * atomic `EventAssignment`-creation write. Called directly by the
   * OWNER-side "assign staff to an Event" screen,
   * `src/screens/Events/PersonalParaEsteEvento.tsx`. Stage 7 Backend
   * Integration, Phase 2c: a real call to `assign_to_event`
   * (`supabase/migrations/20260913050000_event_assignment_persistence_layer.sql`),
   * naturally idempotent server-side (`ON CONFLICT DO NOTHING` against the
   * table's own `(event_id, membership_id)` uniqueness) — no
   * client-supplied idempotency key needed, matching `revokeMembership`'s
   * own precedent. `membership.status === 'active'` and "already assigned"
   * are both re-checked here, client-side, only as a cheap local fast-path
   * (skipping the network round trip for an already-known outcome) — the
   * RPC itself re-verifies both this and that `eventId` belongs to this
   * Business, authoritatively, server-side, never trusting the client-side
   * check alone. Resolves to `true` on success (including the already-
   * assigned no-op case), `false` on failure (a network drop, a genuine
   * platform error) — the caller (`runWrite`, `PersonalParaEsteEvento.tsx`)
   * surfaces a real, now-reachable `'error'`/"Reintentar" state on `false`,
   * no longer disclosed-not-wired. Never checks `hasSchedulingConflict`
   * (`selectors.ts`) itself — RFC 0011 §2's "warn, never block" rule means a
   * conflict is surfaced by `PersonalParaEsteEvento.tsx` itself, never
   * enforced at the write. */
  createEventAssignment: (businessId: ID, eventId: ID, membershipId: ID) => Promise<boolean>;
  /** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — plain
   * delete, no soft-state (RFC 0011 §1: "no downstream write ever
   * references an `EventAssignment` row directly"). Stage 7 Backend
   * Integration, Phase 2c: a real call to `unassign_from_event`, naturally
   * idempotent server-side (a no-op delete on an already-unassigned pair is
   * already correct) — no client-supplied idempotency key needed. Takes the
   * same `(businessId, eventId, membershipId)` triple `createEventAssignment`
   * above does, rather than a local `EventAssignment.id` — a real shape
   * change from this function's pre-backend-integration signature, since
   * the server resolves the target row by the same unique pair, not by a
   * client-remembered local id. Resolves to `true`/`false`, same convention
   * as `createEventAssignment` above. */
  removeEventAssignment: (businessId: ID, eventId: ID, membershipId: ID) => Promise<boolean>;
  resetPrototype: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  /**
   * Stage 7 Backend Integration — Read-side data hydration's own race-safety
   * mechanism (`context/stage-7-backend-integration.md`'s design summary,
   * "Composition with the existing write-mirror pattern"). Monotonic —
   * incremented by `applyWriteMirror` below on every one of the 22 existing
   * write-mirror `setState` calls, never reset. `hydrateFromBackend` reads
   * this before and after its own reads to detect a write that landed
   * mid-cycle (in either direction: a write starting before hydration, or a
   * write starting *during* an already-in-flight hydration and finishing
   * first) — a `ref`, not `state`, since it must be readable synchronously
   * inside an async function's own closure without itself triggering a
   * re-render.
   */
  const writeGenerationRef = useRef(0);

  /**
   * The shared replacement for every one of the 22 existing `.rpc()` call
   * sites' final `setState((s) => {...})` mirror call — mechanical, the same
   * updater body every site already had, with exactly one substitution
   * (`setState` → `applyWriteMirror`). Increments `writeGenerationRef` before
   * applying the update, so `hydrateFromBackend`'s own generation check can
   * always tell "did a write land since I started reading."
   */
  function applyWriteMirror(updater: (s: AppState) => AppState) {
    writeGenerationRef.current += 1;
    setState(updater);
  }

  /**
   * Stage 7 Backend Integration — Read-side data hydration. See
   * `StoreValue.hydrationStatus`'s own doc comment above for the four-value
   * meaning; the mount/`visibilitychange`/Resultados-mount triggers below are
   * this value's only writers besides `retryHydration`.
   */
  const [hydrationStatus, setHydrationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  /** The last businessId a hydration cycle actually resolved — what the
   * `visibilitychange` trigger below re-hydrates against (it never has its
   * own independent resolution step; re-running `resolveActiveBusinessFromAuth`
   * on every tab-refocus would be real, avoidable Supabase Auth traffic for a
   * fact that doesn't change mid-session). A `ref`, not `state`: read inside
   * an event listener registered once at mount, never itself a render input. */
  const hydratedBusinessIdRef = useRef<ID | null>(null);

  /**
   * Stage 7 Backend Integration — Read-side data hydration
   * (`context/stage-7-backend-integration.md`'s design summary). See
   * `StoreValue.hydrateFromBackend`'s own doc comment above for the full
   * race-safety/wholesale-replace reasoning — this is the implementation.
   *
   * Every query is scoped to `businessId` both server-side (RLS — every
   * table below either is `businesses` itself or carries a denormalized
   * `business_id` column, per each Phase's own design summary) and
   * client-side (`.eq('business_id', businessId)`), matching the existing
   * `.rpc()` call sites' own business-scoping convention. `businesses`
   * itself is scoped by `.eq('id', businessId)` instead, being the row
   * itself rather than a child of it.
   */
  async function hydrateFromBackend(businessId: ID, attempt = 0): Promise<'ok' | 'error' | 'stale'> {
    const supabase = getSupabaseClient();
    if (!supabase) return 'error';

    const startGeneration = writeGenerationRef.current;

    const [
      businessesRes,
      membershipsRes,
      productsRes,
      lotsRes,
      entriesRes,
      unitsRes,
      tagsRes,
      venuesRes,
      eventsRes,
      priceOverridesRes,
      sessionsRes,
      salesRes,
      saleItemsRes,
      eventAllocationsRes,
      eventAllocationUnitsRes,
      allocationMovementsRes,
      eventAssignmentsRes,
    ] = await Promise.all([
      supabase.from('businesses').select('*').eq('id', businessId),
      supabase.from('business_memberships').select('*').eq('business_id', businessId),
      supabase.from('products').select('*').eq('business_id', businessId),
      supabase.from('lots').select('*').eq('business_id', businessId),
      supabase.from('inventory_entries').select('*').eq('business_id', businessId),
      supabase.from('inventory_units').select('*').eq('business_id', businessId),
      supabase.from('nfc_tags').select('*').eq('business_id', businessId),
      supabase.from('venues').select('*').eq('business_id', businessId),
      supabase.from('events').select('*').eq('business_id', businessId),
      supabase.from('price_overrides').select('*').eq('business_id', businessId),
      supabase.from('sessions').select('*').eq('business_id', businessId),
      supabase.from('sales').select('*').eq('business_id', businessId),
      supabase.from('sale_items').select('*').eq('business_id', businessId),
      supabase.from('event_allocations').select('*').eq('business_id', businessId),
      supabase.from('event_allocation_units').select('*').eq('business_id', businessId),
      supabase.from('allocation_movements').select('*').eq('business_id', businessId),
      supabase.from('event_assignments').select('*').eq('business_id', businessId),
    ]);

    const allResults = [
      businessesRes,
      membershipsRes,
      productsRes,
      lotsRes,
      entriesRes,
      unitsRes,
      tagsRes,
      venuesRes,
      eventsRes,
      priceOverridesRes,
      sessionsRes,
      salesRes,
      saleItemsRes,
      eventAllocationsRes,
      eventAllocationUnitsRes,
      allocationMovementsRes,
      eventAssignmentsRes,
    ];
    const failed = allResults.find((r) => r.error);
    if (failed) {
      console.error('[store] hydrateFromBackend: a read failed', failed.error);
      return 'error';
    }

    // A write landed mid-cycle (in either direction — one that started
    // before this cycle's reads, or one that started during them and
    // finished first) — this cycle's snapshot is discarded outright, never
    // merged, per the design's own race-safety mechanism. The write's own
    // already-applied `applyWriteMirror` mirror is untouched either way.
    if (writeGenerationRef.current !== startGeneration) {
      if (attempt < 2) return hydrateFromBackend(businessId, attempt + 1);
      return 'stale';
    }

    // `tagId` is a join, not a column, on the client-side `InventoryUnit`
    // shape (Phase 1's `nfc_tags` table refinement — see
    // `hydrationMapping.ts`'s own `mapUnitRow` doc comment).
    const tagByUnitId = new Map<ID, string>(
      (tagsRes.data ?? []).map((row: Record<string, unknown>) => [row.unit_id as ID, row.tag_identifier as string]),
    );
    const units: InventoryUnit[] = (unitsRes.data ?? []).map((row: Record<string, unknown>) => {
      const unit = mapUnitRow(row);
      return { ...unit, tagId: tagByUnitId.get(unit.id) ?? null };
    });

    // `items[]` is a join, not a column, on the client-side `Sale` shape
    // (`sale_items` is its own table, internal-only, owned by `Sale`).
    const itemsBySaleId = new Map<ID, SaleItem[]>();
    for (const row of saleItemsRes.data ?? []) {
      const { saleId, ...item } = mapSaleItemRow(row as Record<string, unknown>);
      const existing = itemsBySaleId.get(saleId) ?? [];
      existing.push(item);
      itemsBySaleId.set(saleId, existing);
    }
    const sales: Sale[] = (salesRes.data ?? []).map((row: Record<string, unknown>) => {
      const sale = mapSaleRow(row);
      return { ...sale, items: itemsBySaleId.get(sale.id) ?? [] };
    });

    // A plain `setState`, deliberately never `applyWriteMirror` — a
    // hydration cycle is a read, not a merchant write, and must never bump
    // `writeGenerationRef` itself (doing so would give every future
    // hydration cycle a moving target to compare against, for no protective
    // purpose the design calls for).
    const businessRow = (businessesRes.data ?? [])[0] as Record<string, unknown> | undefined;
    setState((s) => ({
      ...s,
      // Defensive — a `businessId` this function was actually called with
      // (`resolveActiveBusinessFromAuth`'s own resolved id, or Resultados'
      // own already-mirrored `state.business.id`) should always return
      // exactly one row here; if RLS or a transient read ever returns none,
      // this keeps whatever local `business` mirror already existed rather
      // than wiping a known-good value on a partial-result edge case.
      business: businessRow ? mapBusinessRow(businessRow) : s.business,
      memberships: (membershipsRes.data ?? []).map(mapMembershipRow),
      products: (productsRes.data ?? []).map(mapProductRow),
      lots: (lotsRes.data ?? []).map(mapLotRow),
      entries: (entriesRes.data ?? []).map(mapEntryRow),
      units,
      venues: (venuesRes.data ?? []).map(mapVenueRow),
      events: (eventsRes.data ?? []).map(mapEventRow),
      priceOverrides: (priceOverridesRes.data ?? []).map(mapPriceOverrideRow),
      sessions: (sessionsRes.data ?? []).map(mapSessionRow),
      sales,
      eventAllocations: (eventAllocationsRes.data ?? []).map(mapEventAllocationRow),
      eventAllocationUnits: (eventAllocationUnitsRes.data ?? []).map(mapEventAllocationUnitRow),
      allocationMovements: (allocationMovementsRes.data ?? []).map(mapAllocationMovementRow),
      eventAssignments: (eventAssignmentsRes.data ?? []).map(mapEventAssignmentRow),
    }));

    return 'ok';
  }

  /**
   * Stage 7 Backend Integration — Read-side data hydration. Resolves this
   * device's own real Supabase Auth session (Email/Google — phone-OTP
   * sessions never bridge to a real Supabase Auth session, per this
   * initiative's own disclosed, non-blocking open item;
   * `context/stage-7-backend-integration.md`'s "Open items") to the
   * `business_memberships` row it holds, if any. `null` covers two
   * genuinely different situations alike (no real Supabase Auth session on
   * this device; a genuine query failure or no Membership row at all — a
   * brand-new merchant mid-Onboarding) — the caller only ever needs "is
   * there a real Business to hydrate," never which of these this was, per
   * this function's own declared return shape.
   *
   * **`reviewer` Blocker fix (2026-09-14):** deliberately does **not** filter
   * on `status = 'active'` any more. The earlier `.eq('status', 'active')`
   * meant a revoked Membership always resolved `null` here — same as a
   * genuinely new merchant — so `hydrateFromBackend` was never called for a
   * revoked user, and a device with pre-revocation cached `AppState` kept
   * showing her the stale, still-`active` local mirror forever (`AppRouter.tsx`'s
   * pre-shell gate never even runs `AuthResolving` once `state.business` is
   * already truthy from that cache). `business_memberships_select`'s own RLS
   * policy (`supabase/migrations/20260913000000_identity_persistence_layer.sql`)
   * already lets a user read her own row regardless of status — the fix is
   * simply to stop discarding it client-side. Resolving against *any* row for
   * this user, active or revoked, lets `hydrateFromBackend` run against that
   * real `businessId`; every actual business-data table stays gated on
   * `status='active'` via `is_active_member_of`/`is_active_owner_of` (so a
   * revoked user's `products`/`sales`/etc. queries correctly come back
   * empty), but `business_memberships` itself comes back with her true,
   * current `status: 'revoked'` row, wholesale-replacing the stale local
   * mirror — `App.tsx`'s existing `AccesoRevocado` check then fires
   * correctly off that fresh data, no new screen or logic needed.
   *
   * **Multi-Membership resolution.** A User's relationship to a Business is
   * structurally N:M (`domain-model.md`'s own `User` entry, `decision-log.md`
   * D44) — she can hold more than one `business_memberships` row, one per
   * Business. Fetches every row for this user, most-recently-created first,
   * and resolves to her active one if she has one (there's at most one
   * `active` row per Business, and in practice a User acts in one Business
   * at a time today); only when none of her rows is `active` does this fall
   * back to the most recently created row overall, so a revoked Membership
   * still surfaces even for a user who's since accumulated other, older
   * rows.
   */
  async function resolveActiveBusinessFromAuth(): Promise<{ businessId: ID; membershipId: ID } | null> {
    const supabase = getSupabaseClient();
    if (!supabase) return null;
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) return null;
    const userId = sessionData.session.user.id;
    const { data, error } = await supabase
      .from('business_memberships')
      .select('id, business_id, status')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return null;
    const resolved = data.find((row) => row.status === 'active') ?? data[0];
    return { businessId: resolved.business_id as ID, membershipId: resolved.id as ID };
  }

  /**
   * Stage 7 Backend Integration — the shared resolution cycle both the
   * mount/session-resolve trigger below and `AppRouter.tsx`'s own
   * "Reintentar" (`retryHydration`) run. Not itself part of the design
   * summary's own three named triggers — a thin, deliberate factoring so
   * those two callers (an automatic effect, a manual retry tap) never drift
   * out of sync with each other.
   */
  async function runHydrationResolution(): Promise<void> {
    const supabase = getSupabaseClient();
    if (!supabase || state.currentUserId == null) {
      setHydrationStatus('ready'); // nothing to hydrate — local-only/dev mode, or no live session yet
      return;
    }
    setHydrationStatus('loading');
    const resolved = await resolveActiveBusinessFromAuth();
    if (!resolved) {
      setHydrationStatus('ready'); // no real Supabase Auth session bound yet, or genuinely no Business yet — both honest, non-error resolutions
      return;
    }
    hydratedBusinessIdRef.current = resolved.businessId;
    const result = await hydrateFromBackend(resolved.businessId);
    setHydrationStatus(result === 'error' ? 'error' : 'ready');
  }

  /**
   * Stage 7 Backend Integration — trigger 1 of 3 (design summary): "once on
   * mount when auth resolves to a real business_id/membership_id." Keyed on
   * `state.currentUserId` rather than a one-time mount — this is what makes
   * it also cover the ordinary "session already persisted, app just opened"
   * case (the ref's initial render already has a non-null `currentUserId`,
   * so this fires on the very first render too) without a second, separately
   * -maintained effect for that case.
   */
  useEffect(() => {
    void runHydrationResolution();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fires once per
    // `currentUserId` transition (a fresh sign-in, a sign-out → sign-in, or
    // the initial mount if a session already persisted) — `runHydrationResolution`
    // itself is a fresh closure every render, but re-running this effect on
    // every unrelated state change it happens to close over would defeat the
    // "once per session becoming available" trigger this design specifies.
  }, [state.currentUserId]);

  /**
   * Stage 7 Backend Integration — trigger 2 of 3 (design summary): "again on
   * `visibilitychange` → visible (tab regains focus)," only if a `businessId`
   * is already known (`hydratedBusinessIdRef`) — never re-runs
   * `resolveActiveBusinessFromAuth` itself, matching that ref's own doc
   * comment above.
   */
  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible' && hydratedBusinessIdRef.current) {
        void hydrateFromBackend(hydratedBusinessIdRef.current);
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- registered once
    // at mount; `hydrateFromBackend` itself closes over `setState`/
    // `writeGenerationRef` only (both stable across renders), never over
    // `state` directly, so a stale closure here is safe by construction.
  }, []);

  /** `architecture-principles.md` #7/D30 — the stable idempotency key for
   * one logical `completeOnboarding` attempt, generated once and reused
   * unchanged across every retry of that same attempt (`OnboardingFlow.tsx`'s
   * own `'creating-error'` retry button re-invokes `completeOnboarding` with
   * no new user action in between). A `ref`, not `state`, since it must
   * survive re-renders without itself triggering one, and must NOT survive
   * a genuinely new attempt (cleared to `null` on success, below, so a
   * later distinct attempt — a different device/session — mints a fresh
   * key rather than replaying a stale one). */
  const onboardingIdempotencyKeyRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage full/unavailable — the running session still works, it just
      // won't survive a reload; never worth crashing the app over
    }
  }, [state]);

  /**
   * RFC 0012 §4 — the `AuthIdentity` resolution invariant, shared by every
   * credential-verification write path (`verifyOtp`, `verifyEmailOtp`,
   * `resolveGoogleSignIn`) — one mechanism, never copy-pasted per channel.
   * Three outcomes:
   *
   * - `'existing'` — a plain read: this exact `(type, identifier)` already
   *   has an `AuthIdentity` row. Resolves its `userId`, mints nothing.
   * - `'new-user'` — first-ever-credential creation (shape 1): no existing
   *   row for this `(type, identifier)`, and this device holds no live
   *   session either. Mints a brand-new `User` + its first `AuthIdentity`
   *   row together, atomically (the caller's own `setState` folds both in
   *   as one update).
   * - `'linked'` — additive linking (shape 2): no existing row for this
   *   `(type, identifier)`, but this device *does* hold a live session
   *   (`s.currentUserId` resolves to a real `User`) — mints one new
   *   `AuthIdentity` row against that same, already-authenticated User,
   *   never a second `User` row. **Not reachable through any built UI this
   *   slice** (`authentication.md` §8 item 11/Q26 — a future "link a second
   *   method" surface has no design yet), but the domain invariant is
   *   modeled correctly now so that future UI has real ground to stand on,
   *   per this dispatch's own build-order instruction.
   *
   * `phoneMismatchConfirmationPending`'s own device-history condition
   * (`s.users.length > 0` at the exact instant a brand-new row is minted)
   * is preserved unchanged from the pre-`AuthIdentity` `verifyOtp` — see
   * `User`'s own doc comment (`types.ts`) for the full "why this is
   * decidable, no separate 'last known identity' field needed" reasoning,
   * now generalized to any credential type rather than phone specifically.
   *
   * Pure, given `s` — never calls `setState` itself.
   */
  function resolveAuthIdentity(
    s: AppState,
    type: AuthIdentity['type'],
    identifier: string,
    now: number,
  ):
    | { kind: 'existing'; user: User; identity: AuthIdentity }
    | { kind: 'new-user'; user: User; identity: AuthIdentity }
    | { kind: 'linked'; user: User; identity: AuthIdentity } {
    const existingIdentity = s.authIdentities.find((a) => a.type === type && a.identifier === identifier);
    if (existingIdentity) {
      const user = s.users.find((u) => u.id === existingIdentity.userId)!;
      return { kind: 'existing', user, identity: existingIdentity };
    }
    const authedUser = s.currentUserId ? s.users.find((u) => u.id === s.currentUserId) : undefined;
    if (authedUser) {
      const identity: AuthIdentity = {
        id: makeId('authid'),
        userId: authedUser.id,
        type,
        identifier,
        verifiedAt: now,
        createdAt: now,
      };
      return { kind: 'linked', user: authedUser, identity };
    }
    const user: User = {
      id: makeId('user'),
      createdAt: now,
      declinedInvitationIds: [],
      phoneMismatchConfirmationPending: s.users.length > 0,
    };
    const identity: AuthIdentity = {
      id: makeId('authid'),
      userId: user.id,
      type,
      identifier,
      verifiedAt: now,
      createdAt: now,
    };
    return { kind: 'new-user', user, identity };
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
  /**
   * Stage 7 Backend Integration, Phase 1 (`supabase/migrations/
   * 20260913030000_inventory_persistence_layer.sql`,
   * `20260913031000_inventory_persistence_layer_fixes.sql`,
   * `20260913033000_inventory_persistence_layer_fixes.sql`) — real call to
   * `commit_lot`, replacing the previous client-side-only write. Mirrors
   * `completeOnboarding`'s own "server is truth, fold the result into the
   * local `AppState` mirror" posture (Phase 0): every other screen in this
   * build still reads Inventory state from `AppState`, not from Supabase
   * directly (that broader "replace local reads with live queries" pass is
   * out of this Phase 1 dispatch's scope, same as it was for Phase 0).
   *
   * The RPC returns one row per input line — `productId` (real or
   * freshly-minted), the shared `lotId`, and `unitIds` (every newly-created
   * InventoryUnit for that line) — so the local mirror is built entirely
   * from real server-assigned ids, never `makeId()`-fabricated ones. This
   * is load-bearing, not cosmetic: `assignTagToNextPendingUnit` below
   * resolves and returns a real unit id, server-side, FIFO-first — the
   * local mirror can only recognize that id back inside `state.units` if
   * this function built that array from the same real ids to begin with.
   *
   * `idempotencyKey` — **`reviewer` Blocker fix:** now supplied by the
   * caller (see the `StoreValue.commitLot` doc comment above for the full
   * reasoning) rather than minted fresh here on every call. This function
   * stays a thin, trusting pass-through of whatever key its caller supplies
   * — it has no way to know, from inside a single call, whether that key
   * represents a first attempt or a retry of one; only the caller (which
   * owns the actual retry loop) can know that.
   */
  async function commitLot(lines: CommitLotLine[], idempotencyKey: string): Promise<ID[] | null> {
    if (lines.length === 0) return [];
    if (!state.business) return null;

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] commitLot: Supabase not configured. See supabase/README.md.');
      return null;
    }

    const payload = lines.map((line) => ({
      kind: line.product.kind,
      ...(line.product.kind === 'existing'
        ? { product_id: line.product.productId }
        : {
            name: line.product.name,
            default_price: line.product.defaultPrice,
            photo: line.product.photo ?? null,
            // D65 — silently attached, never a field she sees or confirms
            // (inventory.md §3.8a's scan variant); `null` for the typed
            // path, exactly like `photo` above when none was selected.
            barcode: line.product.barcode ?? null,
          }),
      quantity: line.quantity,
    }));

    const { data, error } = await supabase.rpc('commit_lot', {
      p_business_id: state.business.id,
      p_idempotency_key: idempotencyKey,
      p_lines: payload,
    });

    if (error || !data) {
      // D65 — a genuine barcode collision (`products_barcode_unique_idx`,
      // 20260913032000_inventory_barcode_write.sql) surfaces here as an
      // ordinary commit_lot failure, same as any other save error — no
      // dedicated UI state exists for it (or is called for): inventory.md
      // never designs a distinguishable message for this case, since the
      // write only ever reaches this point *after* §3.8c's own confirm-on-
      // scan step already resolved the identity question once; a collision
      // this late is a genuinely rare race (two devices, two near-
      // simultaneous first-scans of the same never-before-seen barcode),
      // not a state she needs a special explanation for — §3.11's existing
      // "No se pudo guardar... intenta de nuevo" retry already covers it
      // correctly (her typed data, including the not-yet-created Product's
      // name/price/photo, is preserved, exactly as §3.11 already promises).
      console.error('[store] commit_lot failed', error);
      return null;
    }

    const rows = data as { product_id: ID; lot_id: ID; unit_ids: ID[] }[];
    const resolvedProductIds = rows.map((row) => row.product_id);
    if (rows.length === 0) return resolvedProductIds;

    const lotId = rows[0].lot_id;
    const receivedAt = Date.now();
    // Identity (id) comes from the RPC's own resolved productId — never
    // `mintProduct`'s local `makeId('prod')`, which would drift from the
    // real server row this Product now actually is.
    const newProducts: Product[] = lines.flatMap((line, i) =>
      line.product.kind === 'new'
        ? [
            {
              id: resolvedProductIds[i],
              name: line.product.name.trim(),
              defaultPrice: line.product.defaultPrice,
              photo: line.product.photo,
              barcode: line.product.barcode,
              createdAt: receivedAt,
            },
          ]
        : [],
    );
    const entries = lines.map((line, i) => ({
      id: makeId('entry'),
      lotId,
      productId: resolvedProductIds[i],
      quantity: line.quantity,
    }));
    const units: InventoryUnit[] = [];
    rows.forEach((row) => {
      row.unit_ids.forEach((unitId) => {
        units.push({ id: unitId, productId: row.product_id, lotId: row.lot_id, status: 'available', receivedAt, tagId: null });
      });
    });

    applyWriteMirror((s) => ({
      ...s,
      products: [...s.products, ...newProducts],
      lots: [...s.lots, { id: lotId, receivedAt }],
      entries: [...s.entries, ...entries],
      units: [...s.units, ...units],
    }));

    return resolvedProductIds;
  }

  /** authentication.md §3.5 — Stage 7 Backend Integration: proxies straight
   * through to the real `send-otp` Edge Function (`otpClient.ts`). No
   * domain-state write happens here; the OTP itself is entirely
   * server-side state, not `AppState`. `invalid-phone` is folded into
   * `platform-error` — the real UI can't actually produce it, since
   * `PhoneStep.tsx` already validates the 10-digit format before this is
   * ever called. */
  async function requestOtp(phone: string): Promise<RequestOtpOutcome> {
    const result = await sendOtp(phone);
    if (result.ok) return result;
    return { ok: false, reason: result.reason === 'rate-limited' ? 'rate-limited' : 'platform-error' };
  }

  /**
   * authentication.md §3.7 — Stage 7 Backend Integration: real verification
   * against the `verify-otp` Edge Function (`otpClient.ts`), replacing the
   * previous "any 6-digit code is accepted" mock (RFC 0007 §5, disclosed in
   * docs/passes/slice-2-authentication-onboarding.md — retired by this
   * pass). On any rejected outcome, this function returns early and writes
   * nothing.
   *
   * **Corrected, RFC 0012/D62-63 (`decision-log.md`):** the find-or-mint
   * write now goes through `resolveAuthIdentity` (`type='phone'`,
   * `identifier=phone`) — the same shared resolution every credential type
   * goes through — rather than a phone-specific `state.users.find(u =>
   * u.phone === phone)` lookup, since `User` no longer carries `phone`
   * directly. Behaviorally identical to the pre-amendment mechanism for the
   * phone channel specifically: a first-ever-successful verification for a
   * phone (no existing `AuthIdentity` row) mints a new `User` + its first
   * `AuthIdentity`; a returning successful verification for a phone already
   * held resolves that same `User` row, never minting a duplicate — what
   * makes switching between two already-verified Memberships on one shared
   * device/instance (e.g. an OWNER signing out, a SELLER verifying, the
   * OWNER later re-verifying) resolve back to each one's own stable `User`
   * identity rather than accumulating a fresh row every time.
   */
  async function verifyOtp(phone: string, code: string): Promise<VerifyOtpOutcome> {
    const result = await verifyOtpCode(phone, code);
    if (!result.ok) {
      // `invalid-phone`/`invalid-code` are malformed-request outcomes the
      // real UI can't actually produce (both fields are already validated
      // client-side before this is ever called) — folded into
      // `platform-error`, the one CodeStep.tsx branch that doesn't assume
      // a specific correctable user mistake.
      const reason = result.reason === 'incorrect' || result.reason === 'expired' || result.reason === 'too-many'
        ? result.reason
        : 'platform-error';
      return { ok: false, reason };
    }
    const now = Date.now();
    const resolution = resolveAuthIdentity(state, 'phone', phone, now);
    setState((s) => ({
      ...s,
      users: resolution.kind === 'new-user' ? [...s.users, resolution.user] : s.users,
      authIdentities: resolution.kind === 'existing' ? s.authIdentities : [...s.authIdentities, resolution.identity],
      currentUserId: resolution.user.id,
    }));
    return { ok: true, user: resolution.user };
  }

  /** authentication.md §3.2e "Enviar código" (new, `decision-log.md`
   * D62/D63) — the email-channel counterpart to `requestOtp` above,
   * through the thin Nahui-domain wrapper (`authProviders.ts`) around
   * Supabase Auth's own `signInWithOtp({ email })`, per §10's own decision
   * ("a numeric code, not a magic link"). No domain-state write happens
   * here — same posture `requestOtp` already holds. */
  async function requestEmailOtp(email: string): Promise<RequestOtpOutcome> {
    return sendEmailCode(email);
  }

  /**
   * authentication.md §3.7 (shared with the email channel via §3.2e/§3.2f,
   * generalized 2026-09-13) — the email-channel counterpart to `verifyOtp`
   * above, through `authProviders.ts`'s `verifyEmailCode` (Supabase Auth's
   * own `verifyOtp({ email, token, type: 'email' })`). Identical
   * `resolveAuthIdentity` write shape, `type='email'`, `identifier` = the
   * lowercased, trimmed email address her own typed value resolves to.
   */
  async function verifyEmailOtp(email: string, code: string): Promise<VerifyOtpOutcome> {
    const result = await verifyEmailCode(email, code);
    if (!result.ok) return { ok: false, reason: result.reason };
    const now = Date.now();
    const resolution = resolveAuthIdentity(state, 'email', result.identifier, now);
    setState((s) => ({
      ...s,
      users: resolution.kind === 'new-user' ? [...s.users, resolution.user] : s.users,
      authIdentities: resolution.kind === 'existing' ? s.authIdentities : [...s.authIdentities, resolution.identity],
      currentUserId: resolution.user.id,
    }));
    return { ok: true, user: resolution.user };
  }

  /** authentication.md §3.2a "Continuar con Google" / §3.2b (new,
   * `decision-log.md` D62/D63) — starts the real Supabase Auth OAuth
   * redirect (`authProviders.ts`'s `signInWithGoogle`), which performs a
   * genuine full-page navigation away from this app and back — no
   * domain-state write happens here at all; the eventual write happens in
   * `resolveGoogleSignIn` below, once control actually returns. `ok: false`
   * here means the redirect itself never started (a genuine send-time
   * platform error, e.g. Google not yet enabled as a provider on the
   * Supabase project — §3.2d) — distinct from her cancelling/denying
   * *after* the redirect started, which `resolveGoogleSignIn` handles. */
  async function startGoogleSignIn(): Promise<{ ok: true } | { ok: false }> {
    return signInWithGoogle(window.location.origin + window.location.pathname);
  }

  /**
   * authentication.md §3.2c "Verificando con Google" (new, `decision-log.md`
   * D62/D63) — resolves whatever happened once control returns to Nahui
   * from Google's own UI (a real success, a silent cancellation, or a
   * genuine platform error), called from `AuthenticationFlow.tsx` on mount
   * whenever there's reason to believe a Google redirect is being resumed
   * (§3.8's own extended resumability range covers exactly this). Mirrors
   * `verifyOtp`/`verifyEmailOtp`'s own `resolveAuthIdentity` write shape,
   * `type='google'`, `identifier` = the provider's own opaque stable
   * subject ID (`authProviders.ts`'s own doc comment — never the
   * human-readable `displayLabel`, which is returned here purely for
   * `PhoneMismatchConfirm`/§3.7e's own display-only use and is never
   * written to `AppState` at all, per RFC 0012 §1).
   */
  async function resolveGoogleSignIn(): Promise<
    | { status: 'success'; user: User; displayLabel: string | null }
    | { status: 'cancelled' }
    | { status: 'error' }
  > {
    const session = await resolveGoogleSession();
    if (session.status !== 'success') return session;
    const now = Date.now();
    const resolution = resolveAuthIdentity(state, 'google', session.subjectId, now);
    setState((s) => ({
      ...s,
      users: resolution.kind === 'new-user' ? [...s.users, resolution.user] : s.users,
      authIdentities: resolution.kind === 'existing' ? s.authIdentities : [...s.authIdentities, resolution.identity],
      currentUserId: resolution.user.id,
    }));
    return { status: 'success', user: resolution.user, displayLabel: session.displayLabel };
  }

  /**
   * onboarding.md §3.5 "Creando tu negocio" — Stage 7 Backend Integration,
   * Phase 0: the atomic Owner-creation write (RFC 0007/D44, amended RFC
   * 0012/D62-63) now happens server-side, via `create_business_with_owner`
   * (`supabase/migrations/20260913000000_identity_persistence_layer.sql`),
   * which re-implements the exact same invariant as its own first
   * statements (SECURITY DEFINER bypasses RLS by default — the RPC cannot
   * rely on RLS alone). This function is now a **thin client wrapper**: it
   * still short-circuits locally when this device's own cached `AppState`
   * already reflects an owned Business (the identical fast path the old
   * local-only write already had — no reason to hit the network for a case
   * already known), calls the RPC otherwise, and folds the *server's*
   * returned ids into local `AppState` as a client-side mirror — every
   * other screen in this build still reads Business/Membership state from
   * `AppState`, not from Supabase directly (that broader "replace local
   * reads with live queries" pass is out of this Phase 0 dispatch's scope,
   * named explicitly in this pass's own build report).
   *
   * Idempotency (`architecture-principles.md` #7/D30): reuses one stable
   * key across every retry of this same logical attempt
   * (`onboardingIdempotencyKeyRef`, above) — never a fresh key per call,
   * which would defeat the RPC's own replay-on-conflict guarantee.
   */
  async function completeOnboarding(path: OnboardingPath): Promise<ID | null> {
    const user = currentUser(state);
    // RFC 0012/D62-63 — the Owner-creation gate is "holds at least one
    // verified AuthIdentity, of any type," not phone-specifically. In
    // practice this is never reachable false through the real UI: `user`
    // only resolves at all via `currentUser`/`currentUserId`, which is only
    // ever set by a successful `resolveAuthIdentity` write, so the User this
    // function sees already holds ≥1 AuthIdentity by construction — the
    // explicit check is kept for the same defensive-redundancy style this
    // file's other guards already use, not because it's expected to fire.
    const hasVerifiedIdentity = !!user && state.authIdentities.some((a) => a.userId === user.id);
    if (!user || !hasVerifiedIdentity) return null;
    const existingMembership = state.memberships.find((m) => m.userId === user.id && m.role === 'OWNER');
    if (existingMembership && state.business && state.business.id === existingMembership.businessId) {
      return state.business.id;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] completeOnboarding: Supabase not configured. See supabase/README.md.');
      return null;
    }

    if (!onboardingIdempotencyKeyRef.current) {
      onboardingIdempotencyKeyRef.current = crypto.randomUUID();
    }
    const idempotencyKey = onboardingIdempotencyKeyRef.current;

    // onboarding.md §2.2's capability table — the only three combinations
    // any Onboarding path may ever produce.
    const capabilities: Pick<Business, 'subscriptionTier' | 'defaultSellingMode'> =
      path === 'free'
        ? { subscriptionTier: 'free', defaultSellingMode: 'buttons' }
        : path === 'paid'
          ? { subscriptionTier: 'paid', defaultSellingMode: 'buttons' }
          : { subscriptionTier: 'paid', defaultSellingMode: 'nfc' }; // demo — §2.2's richest combination

    const { data: rawData, error } = await supabase
      .rpc('create_business_with_owner', {
        p_idempotency_key: idempotencyKey,
        p_subscription_tier: capabilities.subscriptionTier,
        p_default_selling_mode: capabilities.defaultSellingMode,
      })
      .single();

    if (error || !rawData) {
      console.error('[store] create_business_with_owner failed', error);
      // TEMPORARY DIAGNOSTIC — remove before this dispatch is done. Surfaces
      // the raw error on-screen so it can be read directly off a phone,
      // where console access isn't practical.
      if (typeof window !== 'undefined') {
        window.alert(
          `DIAGNOSTIC create_business_with_owner error:\nmessage: ${error?.message}\ncode: ${error?.code}\ndetails: ${error?.details}\nhint: ${error?.hint}`,
        );
      }
      return null;
    }
    const data = rawData as { business_id: ID; membership_id: ID };
    // This logical attempt succeeded — a future, genuinely distinct attempt
    // (a different device/session) must mint its own fresh key, never
    // replay this one.
    onboardingIdempotencyKeyRef.current = null;

    const now = Date.now();
    const business: Business = {
      id: data.business_id,
      name: '',
      ...capabilities,
      onboardingAcknowledged: false,
      pendingSubscriptionTier: null,
      pendingSubscriptionTierEffectiveDate: null,
      pendingSubscriptionTierAcknowledged: false,
      nfcAvailabilityNudgeShown: false,
    };
    const membership: BusinessMembership = {
      id: data.membership_id,
      userId: user.id,
      businessId: data.business_id,
      role: 'OWNER',
      status: 'active',
      revokedAt: null,
      createdAt: now,
    };
    applyWriteMirror((s) => ({ ...s, business, memberships: [...s.memberships, membership] }));
    return data.business_id;
  }

  /** onboarding.md §3.10 "Guardando tu negocio" — additive identity fields
   * on the already-existing Business (§2.2b). Stage 7 Backend Integration —
   * real call to `update_business_identity`, same "server-confirmed, then
   * local mirror" shape as `editPrice`. */
  async function setBusinessIdentity(fields: {
    name: string;
    logo?: string;
    description?: string;
  }): Promise<boolean> {
    if (!state.business) return false; // defensive — unreachable via the real flow, §3.5 always runs first
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] setBusinessIdentity: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('update_business_identity', {
      p_business_id: state.business.id,
      p_idempotency_key: crypto.randomUUID(),
      p_name: fields.name.trim(),
      p_logo: fields.logo ?? null,
      p_description: fields.description ?? null,
    });
    if (error) {
      console.error('[store] update_business_identity failed', error);
      return false;
    }
    applyWriteMirror((s) =>
      s.business
        ? {
            ...s,
            business: { ...s.business, name: fields.name.trim(), logo: fields.logo, description: fields.description },
          }
        : s,
    );
    return true;
  }

  /** onboarding.md §3.6 — "Entrar" tapped, or auto-continued. Stage 7
   * Backend Integration — real call to `acknowledge_onboarding`, same shape
   * as `setBusinessIdentity` above. */
  async function acknowledgeOnboarding(): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] acknowledgeOnboarding: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('acknowledge_onboarding', {
      p_business_id: state.business.id,
      p_idempotency_key: crypto.randomUUID(),
    });
    if (error) {
      console.error('[store] acknowledge_onboarding failed', error);
      return false;
    }
    applyWriteMirror((s) => (s.business ? { ...s, business: { ...s.business, onboardingAcknowledged: true } } : s));
    return true;
  }

  /**
   * Stage 7 Backend Integration, Phase 2 — shared local-mirror update for
   * `addItemToSale`/`addItemToSaleByTag`, both of which now resolve the
   * actual FIFO/tag pick, price, Sale mint-or-find, and SaleItem write
   * entirely server-side (`add_item_to_sale`/`add_item_to_sale_by_tag`).
   * This is the one remaining piece those two functions still own
   * client-side: folding the RPC's own real, server-assigned ids into the
   * local `AppState` mirror every other screen in this build still reads
   * from (the same "server is truth, fold the result into the local mirror"
   * posture `commitLot`/`completeOnboarding` already established) — find-or-
   * create the local `Sale` row by its real `sale_id` (mint-or-find can
   * legitimately replay an already-mirrored Sale on a retried tap), append
   * the new `SaleItem` by its real `sale_item_id`/`unit_id`/
   * `event_allocation_id` (D67 — the server's own authoritative allocation
   * decision, never re-derived client-side), and flip that unit's local
   * mirror to `'reserved'`. Pure, given `s` — called from inside each
   * caller's own `setState` updater, never calling `setState` itself.
   */
  function mirrorAddedSaleItem(
    s: AppState,
    sessionId: ID,
    productId: ID,
    row: { sale_id: ID; sale_item_id: ID; unit_id: ID; price_paid: number; event_allocation_id: ID | null },
    performedByMembershipId: ID,
  ): AppState {
    let sales = s.sales;
    let sale = sales.find((sa) => sa.id === row.sale_id);
    if (!sale) {
      sale = { id: row.sale_id, sessionId, items: [], status: 'open', performedByMembershipId };
      sales = [...sales, sale];
    }
    if (sale.items.some((i) => i.id === row.sale_item_id)) {
      return s; // already mirrored (a replayed idempotent result)
    }
    const item: SaleItem = {
      id: row.sale_item_id,
      productId,
      unitId: row.unit_id,
      pricePaid: row.price_paid,
      eventAllocationId: row.event_allocation_id ?? undefined,
    };
    sales = sales.map((sa) => (sa.id === sale!.id ? { ...sa, items: [...sa.items, item] } : sa));
    const units = s.units.map((u) => (u.id === row.unit_id ? { ...u, status: 'reserved' as InventoryUnitStatus } : u));
    return { ...s, sales, units };
  }

  /**
   * Stage 7 Backend Integration, Phase 1 — real call to
   * `update_product_price` (`supabase/migrations/
   * 20260913030000_inventory_persistence_layer.sql`), replacing the
   * previous client-side-only write. Local `AppState` is only ever updated
   * once the server confirms the write — no optimistic update — so a
   * rejected/failed call leaves `Product.defaultPrice` exactly as it was,
   * and the caller (`CatalogView.tsx`) can tell the two apart via the
   * resolved boolean.
   */
  async function editPrice(productId: ID, newPrice: number): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] editPrice: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('update_product_price', {
      p_business_id: state.business.id,
      p_product_id: productId,
      p_idempotency_key: crypto.randomUUID(),
      p_new_price: newPrice,
    });
    if (error) {
      console.error('[store] update_product_price failed', error);
      return false;
    }
    applyWriteMirror((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === productId ? { ...p, defaultPrice: newPrice } : p)),
    }));
    return true;
  }

  /**
   * inventory.md §3.4b "Guardar foto" — writes or clears `Product.photo`.
   * Stage 7 Backend Integration, Phase 1 — real call to
   * `update_product_photo`, same "server-confirmed, then local mirror"
   * shape as `editPrice` above.
   */
  async function setProductPhoto(productId: ID, photo: string | undefined): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] setProductPhoto: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('update_product_photo', {
      p_business_id: state.business.id,
      p_product_id: productId,
      p_idempotency_key: crypto.randomUUID(),
      p_photo: photo ?? null,
    });
    if (error) {
      console.error('[store] update_product_photo failed', error);
      return false;
    }
    applyWriteMirror((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === productId ? { ...p, photo } : p)),
    }));
    return true;
  }

  /**
   * inventory.md §3.14 — one scan, one write. §3.16 ("scan failed," a
   * genuine physical read failure) never reaches this function at all —
   * it's simulated entirely client-side in `AssignTags.tsx`, the same
   * "mock the physical mechanism, keep the domain layer honest" posture
   * this codebase's phone-OTP mock already established. This function only
   * ever sees a tag that *did* read successfully, and decides the two real
   * business-logic questions (already spoken for? anything left to tag?) —
   * now resolved server-side, FIFO-ordered, `FOR UPDATE SKIP LOCKED`
   * (`assign_tag_to_next_pending_unit`, `supabase/migrations/
   * 20260913030000_inventory_persistence_layer.sql`), replacing the
   * previous client-side scan of `state.units`.
   */
  async function assignTagToNextPendingUnit(
    tagId: ID,
  ): Promise<
    | { ok: true; unitId: ID; productId: ID }
    | { ok: false; reason: 'already-assigned' }
    | { ok: false; reason: 'queue-empty' }
    | { ok: false; reason: 'platform-error' }
  > {
    if (!state.business) return { ok: false, reason: 'platform-error' };
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] assignTagToNextPendingUnit: Supabase not configured. See supabase/README.md.');
      return { ok: false, reason: 'platform-error' };
    }
    const { data, error } = await supabase
      .rpc('assign_tag_to_next_pending_unit', {
        p_business_id: state.business.id,
        p_tag_identifier: tagId,
        p_idempotency_key: crypto.randomUUID(),
      })
      .single();

    if (error) {
      if (error.message === 'tag_already_assigned') return { ok: false, reason: 'already-assigned' };
      if (error.message === 'tag_queue_empty') return { ok: false, reason: 'queue-empty' };
      console.error('[store] assign_tag_to_next_pending_unit failed', error);
      return { ok: false, reason: 'platform-error' };
    }
    if (!data) return { ok: false, reason: 'platform-error' };

    const { unit_id: unitId, product_id: productId } = data as { unit_id: ID; product_id: ID };
    applyWriteMirror((s) => ({
      ...s,
      units: s.units.map((u) => (u.id === unitId ? { ...u, tagId } : u)),
    }));
    return { ok: true, unitId, productId };
  }

  /**
   * events.md §3.6 "Guardar evento" — Stage 7 Backend Integration, Phase 2
   * (`supabase/migrations/20260913040000_selling_persistence_layer.sql`): a
   * real, idempotency-keyed call to `create_event`, which resolves the
   * pending Venue selection (mint-or-find, server-side, replacing the
   * previous client-side `resolveVenue`) and inserts the Event atomically.
   * **D17's own overlap rule, once re-checked defensively here, is removed
   * outright (`decision-log.md` D53, Slice 12)** — the server schema itself
   * carries no overlap/uniqueness constraint across Events, matching that
   * same, already-settled call. Resolves to the new Event's id, or `null`
   * on any rejected/failed outcome (`NuevoEvento.tsx` routes a `null` result
   * to its own, previously-disclosed-not-wired `'error'` retry state).
   */
  async function createEvent(
    fields: {
      venue: VenueRef;
      type: EventType;
      startDate: string;
      endDate: string;
      bazaarCost: number;
    },
    idempotencyKey: string,
  ): Promise<ID | null> {
    if (!state.business) return null;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] createEvent: Supabase not configured. See supabase/README.md.');
      return null;
    }
    const { data, error } = await supabase
      .rpc('create_event', {
        p_business_id: state.business.id,
        p_idempotency_key: idempotencyKey,
        p_venue_id: fields.venue.kind === 'existing' ? fields.venue.venueId : null,
        p_venue_display_name: fields.venue.kind === 'new' ? fields.venue.displayName : null,
        p_type: fields.type,
        p_start_date: fields.startDate,
        p_end_date: fields.endDate,
        p_bazaar_cost: fields.bazaarCost,
      })
      .single();

    if (error || !data) {
      console.error('[store] create_event failed', error);
      return null;
    }

    const { event_id: eventId, venue_id: venueId } = data as { event_id: ID; venue_id: ID };
    const event: Event = {
      id: eventId,
      venueId,
      type: fields.type,
      startDate: fields.startDate,
      endDate: fields.endDate,
      bazaarCost: fields.bazaarCost,
      cancelledAt: null,
    };
    applyWriteMirror((s) => ({
      ...s,
      venues: s.venues.some((v) => v.id === venueId)
        ? s.venues
        : [...s.venues, { id: venueId, displayName: fields.venue.kind === 'new' ? fields.venue.displayName.trim() : '' }],
      events: [...s.events, event],
    }));
    return event.id;
  }

  /** events.md §3.12/§2 — the only merchant-initiated Event transition.
   * Stage 7 Backend Integration, Phase 2: a real call to `cancel_event`, a
   * naturally-idempotent status flip (no client-supplied idempotency key
   * needed, matching `revoke_membership`'s own precedent). Meaningful only
   * while the Event's computed status is still `scheduled` — re-checked
   * client-side first (a cheap local no-op, skipping the network round trip
   * for the unreachable-through-the-real-UI case) and, authoritatively,
   * again inside the RPC itself, which never trusts this client-side check
   * alone. */
  async function cancelEvent(eventId: ID): Promise<void> {
    if (!state.business) return;
    const event = state.events.find((e) => e.id === eventId);
    if (!event || eventStatus(event, Date.now()) !== 'scheduled') return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] cancelEvent: Supabase not configured. See supabase/README.md.');
      return;
    }
    const { error } = await supabase.rpc('cancel_event', {
      p_business_id: state.business.id,
      p_event_id: eventId,
    });
    if (error) {
      console.error('[store] cancel_event failed', error);
      return;
    }
    applyWriteMirror((s) => ({
      ...s,
      events: s.events.map((e) => (e.id === eventId ? { ...e, cancelledAt: Date.now() } : e)),
    }));
  }

  /** events.md §3.20 (D33) — writes/updates one Product's Price Override for
   * one Event. Stage 7 Backend Integration, Phase 2: a real, idempotency-
   * keyed call to `set_price_override` (an upsert — "light idempotency,"
   * same posture `update_product_price` already established in Phase 1, no
   * cached-result replay branch). Defensively re-checks the Event's computed
   * status is still `scheduled` client-side first, and again, authoritatively,
   * inside the RPC. */
  async function setPriceOverride(eventId: ID, productId: ID, overridePrice: number): Promise<void> {
    if (!state.business) return;
    const event = state.events.find((e) => e.id === eventId);
    if (!event || eventStatus(event, Date.now()) !== 'scheduled') return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] setPriceOverride: Supabase not configured. See supabase/README.md.');
      return;
    }
    const { error } = await supabase.rpc('set_price_override', {
      p_business_id: state.business.id,
      p_event_id: eventId,
      p_product_id: productId,
      p_idempotency_key: crypto.randomUUID(),
      p_override_price: overridePrice,
    });
    if (error) {
      console.error('[store] set_price_override failed', error);
      return;
    }
    applyWriteMirror((s) => {
      const exists = s.priceOverrides.some((po) => po.eventId === eventId && po.productId === productId);
      const priceOverrides = exists
        ? s.priceOverrides.map((po) =>
            po.eventId === eventId && po.productId === productId ? { ...po, overridePrice } : po,
          )
        : [...s.priceOverrides, { eventId, productId, overridePrice }];
      return { ...s, priceOverrides };
    });
  }

  /**
   * home.md §2 — Stage 7 Backend Integration, Phase 2: a real call to
   * `start_session`, naturally safe under concurrent double-submission via
   * `ON CONFLICT` against the server's own `sessions_one_active_per_
   * membership_idx` (D66) — no client-supplied idempotency key needed. NFC
   * Readiness/Session-start resolution (home.md §2, `decision-log.md` D23)
   * stays a client-side computation (unchanged) — `operatingMode` is
   * resolved here, defensively, from the current local `state` (never
   * trusting a UI-computed value, same posture this function always held)
   * and passed to the RPC already-resolved; the RPC itself re-checks the one
   * entitlement-relevant boundary server-side (`'nfc'` requires
   * `subscriptionTier='paid'`, D27), correcting silently if the local mirror
   * were ever stale. `overrideToNfc` is Ana's own per-tap choice, threaded
   * through unchanged (no other honest source, see this function's own
   * `StoreValue` doc comment).
   */
  async function startSession(eventId: ID | null = null, overrideToNfc: boolean = false): Promise<void> {
    if (!state.business) return; // defensive — Home only mounts once onboarding is complete
    const membership = actingMembership(state);
    if (!membership) return; // defensive — Home only mounts once a valid acting Membership resolves
    // "Never ask twice" — a cheap local fast-path, skipping the network
    // round trip entirely when this device already knows its own Session is
    // open; the server's own partial unique index is the real, authoritative
    // guarantee regardless (see `start_session`'s own comment).
    if (state.sessions.some((sess) => sess.status === 'active' && sess.openedByMembershipId === membership.id)) {
      return;
    }

    const capability = nfcCapable(state);
    const readiness = nfcReadiness(state);
    const defaultMode = state.business.defaultSellingMode;

    let operatingMode: SessionOperatingMode = 'buttons';
    if (defaultMode === 'nfc' && capability) {
      if (readiness === 'ready') operatingMode = 'nfc';
      else if (readiness === 'limited' && overrideToNfc) operatingMode = 'nfc';
      // 'not-ready', or 'limited' without an override, both stay 'buttons'
      // — an operational impossibility/a recommendation she didn't
      // override, never a merchant-facing error (home.md §3.6a).
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] startSession: Supabase not configured. See supabase/README.md.');
      return;
    }
    const { data, error } = await supabase
      .rpc('start_session', {
        p_business_id: state.business.id,
        p_event_id: eventId,
        p_operating_mode: operatingMode,
      })
      .single();

    if (error || !data) {
      console.error('[store] start_session failed', error);
      return;
    }

    const row = data as { session_id: ID; event_id: ID | null; operating_mode: SessionOperatingMode; opened_at: string };
    applyWriteMirror((s) => {
      if (s.sessions.some((sess) => sess.id === row.session_id)) return s; // already mirrored (a replayed mint-or-find)
      const session: Session = {
        id: row.session_id,
        eventId: row.event_id,
        operatingMode: row.operating_mode,
        status: 'active',
        openedAt: new Date(row.opened_at).getTime(),
        openedByMembershipId: membership.id,
      };
      return { ...s, sessions: [...s.sessions, session] };
    });
  }

  /**
   * home.md §3.8a/§3.9 — FIFO tap-to-add (Buttons mode). Stage 7 Backend
   * Integration, Phase 2 (`supabase/migrations/
   * 20260913040000_selling_persistence_layer.sql`): a real, idempotency-
   * keyed call to `add_item_to_sale` — the FIFO pick, price resolution, Sale
   * mint-or-find, and SaleItem write all happen atomically server-side now
   * (`FOR UPDATE SKIP LOCKED`, the same concurrency-safety mechanism
   * `assign_tag_to_next_pending_unit` already established in Phase 1),
   * replacing this function's previous client-side FIFO scan/price
   * resolution/local Sale-append logic entirely.
   *
   * **Stage 7 Backend Integration, Phase 2b — `EventAllocation`-aware
   * selection is now real** (`20260913061000_event_allocation_selling_
   * integration.sql`): when an open `EventAllocation` exists for this
   * Session's own `(eventId, productId)`, the RPC consumes exclusively from
   * that allocation's own committed-and-unclaimed pool, never falling back
   * to the plain Business-wide pool — its exhaustion is a distinct,
   * terminal `event_allocation_exhausted` error (`home.md` §3.8a's ⊗
   * pattern's actual real-backend trigger), never retriable the way a
   * generic failure is. A Product with no open allocation for this Event is
   * completely unaffected — plain FIFO, exactly as Phase 2 shipped it.
   *
   * `idempotencyKey` is supplied by the caller (`Selling.tsx`'s own
   * per-product idempotency-key ref, mirroring `commitLot`'s own fix) — one
   * key per logical tap, reused unchanged across a retry of that same tap
   * (never retried by this function itself on `'exhausted'` — see above).
   */
  async function addItemToSale(productId: ID, idempotencyKey: string): Promise<'added' | 'exhausted' | 'failed'> {
    if (!state.business) return 'failed'; // defensive — Selling only mounts once onboarding is complete
    const membership = actingMembership(state);
    if (!membership) return 'failed'; // defensive — Selling only mounts once a valid acting Membership resolves
    const session = myActiveSession(state, membership.id);
    if (!session) return 'failed';
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] addItemToSale: Supabase not configured. See supabase/README.md.');
      return 'failed';
    }
    const { data, error } = await supabase
      .rpc('add_item_to_sale', {
        p_business_id: state.business.id,
        p_product_id: productId,
        p_idempotency_key: idempotencyKey,
      })
      .single();

    if (error || !data) {
      if (error?.message === 'event_allocation_exhausted') return 'exhausted';
      console.error('[store] add_item_to_sale failed', error);
      return 'failed';
    }

    const row = data as { sale_id: ID; sale_item_id: ID; unit_id: ID; price_paid: number; event_allocation_id: ID | null };
    applyWriteMirror((s) => mirrorAddedSaleItem(s, session.id, productId, row, membership.id));
    return 'added';
  }

  /**
   * home.md §3.10 — nfc-mode's own registration write. Stage 7 Backend
   * Integration, Phase 2: a real call to `add_item_to_sale_by_tag`, sharing
   * `add_item_to_sale`'s own server-side logic with one swap: the unit is
   * resolved by the *specific* scanned `tagId` rather than a FIFO scan.
   * `'no-match'` is `product/02-ux/product-decisions.md` Q2's own genuinely
   * open gap (a scan matching no `available` tagged unit) — this function
   * only guarantees that case is never silently mishandled; it does not
   * invent a resolution UI for it (see `Selling.tsx`'s own caller/disclosure).
   * A fresh idempotency key per scan (not reused across separate scans —
   * generated inline here, same posture `assignTagToNextPendingUnit`
   * already holds for its own per-scan key), since a distinct physical scan
   * is a genuinely new logical attempt, never a retry of a prior one.
   */
  async function addItemToSaleByTag(
    tagId: ID,
  ): Promise<
    | { ok: true; unitId: ID; productId: ID }
    | { ok: false; reason: 'no-active-session' }
    | { ok: false; reason: 'no-match' }
  > {
    if (!state.business) return { ok: false, reason: 'no-active-session' };
    const membership = actingMembership(state);
    if (!membership) return { ok: false, reason: 'no-active-session' };
    const session = myActiveSession(state, membership.id);
    if (!session) return { ok: false, reason: 'no-active-session' };
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] addItemToSaleByTag: Supabase not configured. See supabase/README.md.');
      return { ok: false, reason: 'no-match' };
    }
    const { data, error } = await supabase
      .rpc('add_item_to_sale_by_tag', {
        p_business_id: state.business.id,
        p_tag_identifier: tagId,
        p_idempotency_key: crypto.randomUUID(),
      })
      .single();

    if (error || !data) {
      if (error?.message === 'no_active_session') return { ok: false, reason: 'no-active-session' };
      // `no_match`, `wrong_operating_mode` (mapped to the same client
      // reason, see the RPC's own comment), or a genuine platform error all
      // fold into `'no-match'` — the one reason `Selling.tsx`'s own caller
      // already handles ("this scan can't resolve to a sellable item right
      // now").
      return { ok: false, reason: 'no-match' };
    }

    const row = data as {
      sale_id: ID;
      sale_item_id: ID;
      unit_id: ID;
      product_id: ID;
      price_paid: number;
      event_allocation_id: ID | null;
    };
    applyWriteMirror((s) => mirrorAddedSaleItem(s, session.id, row.product_id, row, membership.id));
    return { ok: true, unitId: row.unit_id, productId: row.product_id };
  }

  /** home.md §3.8a's "Quitar de la venta." Stage 7 Backend Integration,
   * Phase 2: a real call to `remove_sale_item` (naturally idempotent by id
   * — no client-supplied key needed). **Phase 2b/D67:** the server's own
   * `remove_sale_item` now reverts a unit to `'reserved'` (still genuinely
   * committed to its `EventAllocation`, only unclaimed from this Sale) or
   * `'available'` (the plain-pool case, unchanged) by reading the removed
   * `SaleItem`'s own `eventAllocationId` back unchanged — mirrored here via
   * `saleItemHasEventAllocationCommitment`, the identical row-level check
   * against the same already-mirrored `SaleItem` the server itself just
   * read. */
  async function removeSaleItem(saleItemId: ID): Promise<void> {
    if (!state.business) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] removeSaleItem: Supabase not configured. See supabase/README.md.');
      return;
    }
    const { error } = await supabase.rpc('remove_sale_item', {
      p_business_id: state.business.id,
      p_sale_item_id: saleItemId,
    });
    if (error) {
      console.error('[store] remove_sale_item failed', error);
      return;
    }
    applyWriteMirror((s) => {
      const sale = s.sales.find((sa) => sa.status === 'open' && sa.items.some((i) => i.id === saleItemId));
      if (!sale) return s;
      const item = sale.items.find((i) => i.id === saleItemId)!;
      const sales = s.sales.map((sa) =>
        sa.id === sale.id ? { ...sa, items: sa.items.filter((i) => i.id !== saleItemId) } : sa,
      );
      const revertStatus: InventoryUnitStatus = saleItemHasEventAllocationCommitment(item) ? 'reserved' : 'available';
      const units = s.units.map((u) => (u.id === item.unitId ? { ...u, status: revertStatus } : u));
      return { ...s, sales, units };
    });
  }

  /** home.md §3.8a "Cancelar" — the whole open Sale, all at once. Stage 7
   * Backend Integration, Phase 2: a real call to `cancel_sale` (naturally
   * idempotent — no open Sale on this Session is a no-op — no client-
   * supplied key needed). **Phase 2b/D67:** per-item revert target
   * (`'reserved'` if allocation-committed, `'available'` otherwise), same
   * mirrored check as `removeSaleItem` above.
   *
   * `saleId` is captured by the caller (`Selling.tsx`) at the moment
   * "Cancelar" is actually tapped, not re-resolved here — `reviewer`
   * Important finding, fix round 1: a stale retry must act on the specific
   * Sale the merchant intended to cancel, never "whatever is open right
   * now," matching `cancelEvent`'s/Phase 0's `revokeMembership`'s own
   * explicit-target precedent. */
  async function cancelSale(saleId: ID): Promise<void> {
    if (!state.business) return;
    const openSale = state.sales.find((sa) => sa.id === saleId && sa.status === 'open');
    if (!openSale) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] cancelSale: Supabase not configured. See supabase/README.md.');
      return;
    }
    const { error } = await supabase.rpc('cancel_sale', {
      p_business_id: state.business.id,
      p_sale_id: saleId,
    });
    if (error) {
      console.error('[store] cancel_sale failed', error);
      return;
    }
    applyWriteMirror((s) => {
      const units = s.units.map((u) => {
        const item = openSale.items.find((i) => i.unitId === u.id);
        if (!item) return u;
        const revertStatus: InventoryUnitStatus = saleItemHasEventAllocationCommitment(item) ? 'reserved' : 'available';
        return { ...u, status: revertStatus };
      });
      const sales = s.sales.filter((sa) => sa.id !== openSale.id);
      return { ...s, sales, units };
    });
  }

  /** home.md §3.8c/§3.8f "Finalizar Venta." Stage 7 Backend Integration,
   * Phase 2: a real, idempotency-keyed call to `finalize_sale` (marks every
   * sold unit `status='sold'` and the Sale `'finalized'`, atomically,
   * server-side). `total`/`itemCount`/the Digital Receipt's own claim-token
   * logic stay exactly as before — a client-side computation over the
   * already-mirrored `Sale.items`, unchanged. */
  async function finalizeSale(idempotencyKey: string): Promise<Receipt | null> {
    if (!state.business) return null; // defensive — Selling only mounts once onboarding is complete
    const membership = actingMembership(state);
    if (!membership) return null;
    const session = myActiveSession(state, membership.id);
    if (!session) return null;
    const openSale = state.sales.find((sa) => sa.sessionId === session.id && sa.status === 'open');
    if (!openSale || openSale.items.length === 0) return null;

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] finalizeSale: Supabase not configured. See supabase/README.md.');
      return null;
    }
    const { data, error } = await supabase
      .rpc('finalize_sale', {
        p_business_id: state.business.id,
        p_idempotency_key: idempotencyKey,
      })
      .single();

    if (error || !data) {
      console.error('[store] finalize_sale failed', error);
      return null;
    }

    const { finalized_at: finalizedAtRaw } = data as { sale_id: ID; finalized_at: string };
    const finalizedAt = new Date(finalizedAtRaw).getTime();
    const total = openSale.items.reduce((sum, i) => sum + i.pricePaid, 0);
    const itemCount = openSale.items.length;

    applyWriteMirror((s) => {
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

  /** home.md §3.7 "Cerrar jornada de venta." Stage 7 Backend Integration,
   * Phase 2: a real call to `close_session`, a naturally-idempotent status
   * flip (no client-supplied key needed, matching `cancel_event`'s own
   * precedent). Deliberately does not independently block on an open Sale
   * — that guarantee lives in the UI flow (`Selling.tsx`'s own blocked-close
   * sheet), unchanged.
   *
   * `sessionId` is captured by the caller at the moment "Cerrar jornada de
   * venta" is actually tapped, not re-resolved here — `reviewer` Important
   * finding, fix round 1: a stale retry must act on the specific Session the
   * merchant intended to close, never "whatever is active right now,"
   * matching `cancelEvent`'s/Phase 0's `revokeMembership`'s own
   * explicit-target precedent (see `cancelSale`'s own doc comment above for
   * the identical fix). */
  async function closeSession(sessionId: ID): Promise<void> {
    if (!state.business) return;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] closeSession: Supabase not configured. See supabase/README.md.');
      return;
    }
    const { error } = await supabase.rpc('close_session', {
      p_business_id: state.business.id,
      p_session_id: sessionId,
    });
    if (error) {
      console.error('[store] close_session failed', error);
      return;
    }
    applyWriteMirror((s) => ({
      ...s,
      sessions: s.sessions.map((sess) =>
        sess.id === sessionId ? { ...sess, status: 'closed' as const, closedAt: Date.now() } : sess,
      ),
    }));
  }

  /** settings.md §2.2/§3.4 "Activar plan de pago" — immediate. Reachable only
   * from the Free-tier vista principal (no pending change can exist there —
   * see this function's own `StoreValue` doc comment), so under normal play
   * the pending triple is already empty here. Defensively clears it anyway
   * (same shape `cancelPendingSubscriptionTierChange` already writes)
   * to close a latent, currently-unreachable edge: `reconcilePendingSubscriptionTier`
   * fires its own landing RPC in the background rather than awaiting it, so
   * there's a brief window, right after a downgrade lands this same mount,
   * where the pending triple is still locally populated while that RPC is
   * in flight — if Ana activates paid again inside that window, this
   * defensive clear (plus `activate_paid_plan`'s own server-side overwrite)
   * keeps those stale fields from lingering either way. */
  async function activatePaidPlan(): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] activatePaidPlan: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('activate_paid_plan', {
      p_business_id: state.business.id,
      p_idempotency_key: crypto.randomUUID(),
    });
    if (error) {
      console.error('[store] activate_paid_plan failed', error);
      return false;
    }
    applyWriteMirror((s) =>
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
    return true;
  }

  /** settings.md §2.2/§3.5 "Volver al plan gratis" — deferred; writes the
   * pending triple only, `subscriptionTier` stays `'paid'` until it lands.
   * Stage 7 Backend Integration — real call to `request_downgrade_to_free`. */
  async function requestDowngradeToFree(effectiveDate: string): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] requestDowngradeToFree: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('request_downgrade_to_free', {
      p_business_id: state.business.id,
      p_idempotency_key: crypto.randomUUID(),
      p_effective_date: effectiveDate,
    });
    if (error) {
      console.error('[store] request_downgrade_to_free failed', error);
      return false;
    }
    applyWriteMirror((s) =>
      s.business
        ? {
            ...s,
            business: {
              ...s.business,
              pendingSubscriptionTier: 'free',
              pendingSubscriptionTierEffectiveDate: effectiveDate,
              pendingSubscriptionTierAcknowledged: false,
            },
          }
        : s,
    );
    return true;
  }

  /** settings.md §2.2/§3.7 "Cancelar cambio pendiente" — clears the pending
   * triple; `subscriptionTier` untouched. Stage 7 Backend Integration — real
   * call to `cancel_pending_subscription_tier_change`. */
  async function cancelPendingSubscriptionTierChange(): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] cancelPendingSubscriptionTierChange: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('cancel_pending_subscription_tier_change', {
      p_business_id: state.business.id,
      p_idempotency_key: crypto.randomUUID(),
    });
    if (error) {
      console.error('[store] cancel_pending_subscription_tier_change failed', error);
      return false;
    }
    applyWriteMirror((s) =>
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
    return true;
  }

  /** settings.md §2.3 "Cambiar a vender con tags/con botones" — immediate,
   * the *only* write path allowed to touch `defaultSellingMode` (§2.3's own
   * "never written by any other action" invariant — never called as a side
   * effect of any `subscriptionTier` action, and this function itself never
   * reads or writes `subscriptionTier`). Stage 7 Backend Integration — real
   * call to `change_default_selling_mode`. */
  async function changeDefaultSellingMode(mode: SessionOperatingMode): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] changeDefaultSellingMode: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('change_default_selling_mode', {
      p_business_id: state.business.id,
      p_idempotency_key: crypto.randomUUID(),
      p_mode: mode,
    });
    if (error) {
      console.error('[store] change_default_selling_mode failed', error);
      return false;
    }
    applyWriteMirror((s) => (s.business ? { ...s, business: { ...s.business, defaultSellingMode: mode } } : s));
    return true;
  }

  /** home.md §3.6a's fourth variant — see this function's own `StoreValue`
   * doc comment above. Idempotent — a second call (defensively unreachable
   * once `useNfcSessionStart.ts`'s own effect has fired once) is a no-op in
   * effect, since it only ever sets the flag to `true`. Stage 7 Backend
   * Integration — real call to `acknowledge_nfc_availability_nudge`. */
  async function markNfcAvailabilityNudgeShown(): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] markNfcAvailabilityNudgeShown: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('acknowledge_nfc_availability_nudge', {
      p_business_id: state.business.id,
      p_idempotency_key: crypto.randomUUID(),
    });
    if (error) {
      console.error('[store] acknowledge_nfc_availability_nudge failed', error);
      return false;
    }
    applyWriteMirror((s) => (s.business ? { ...s, business: { ...s.business, nfcAvailabilityNudgeShown: true } } : s));
    return true;
  }

  /** settings.md §2.4 — see the `StoreValue` interface doc comment above for
   * the full reasoning. Reads only `state.business`'s own pending-change
   * fields to detect landing; never touches `defaultSellingMode` (§2.3's
   * invariant applies here too — this function has no reason to touch it and
   * doesn't). Stage 7 Backend Integration — the actual land is a real call
   * to `land_pending_subscription_tier`, fired here but not awaited by the
   * caller (this function keeps its synchronous `justLanded` return contract
   * so `SettingsScreen.tsx`'s own `useEffect` can render the acknowledgment
   * line on the same mount, without waiting on the network round trip).
   * `onSettled` reports the RPC's real, eventual outcome once it resolves —
   * `true` only in the same branch that applies `applyWriteMirror`, `false`
   * on the no-op branch and on error — so the caller can self-correct its
   * own optimistic local state if the real outcome turns out not to match
   * the synchronous guess (settings.md §2.4 requires acknowledging a change
   * that actually happened). */
  function reconcilePendingSubscriptionTier(onSettled?: (landed: boolean) => void): {
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

    // Landing moment. Capture the pre-write values for the caller's
    // one-time acknowledgment line, then land the change server-side —
    // the server re-checks the same effective-date condition itself
    // (never trusted from the client), so this is safe to fire even if
    // called again before the previous attempt's response comes back.
    const tier = b.pendingSubscriptionTier;
    const effectiveDate = b.pendingSubscriptionTierEffectiveDate;
    const businessId = b.id;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] reconcilePendingSubscriptionTier: Supabase not configured. See supabase/README.md.');
      return { justLanded: true, tier, effectiveDate };
    }
    void supabase
      .rpc('land_pending_subscription_tier', {
        p_business_id: businessId,
        p_idempotency_key: crypto.randomUUID(),
      })
      .then(({ data, error }) => {
        if (error) {
          // Automatically triggered, no direct user action to attach an
          // error state to — logged and left for the next natural trigger
          // (the next Configuración mount) to retry. The pending triple
          // stays intact locally either way, so this isn't harmful in the
          // meantime.
          console.error('[store] land_pending_subscription_tier failed', error);
          onSettled?.(false);
          return;
        }
        if (data !== true) {
          // A genuine no-op: the landing condition no longer held (most
          // likely a concurrent `cancel_pending_subscription_tier_change`
          // call won the race). Don't apply the optimistic mirror update —
          // the next hydration cycle will correctly reflect whatever the
          // real state actually is (cancelled, or still pending).
          onSettled?.(false);
          return;
        }
        applyWriteMirror((s) =>
          s.business
            ? {
                ...s,
                business: {
                  ...s.business,
                  subscriptionTier: tier,
                  pendingSubscriptionTier: null,
                  pendingSubscriptionTierEffectiveDate: null,
                  pendingSubscriptionTierAcknowledged: false,
                },
              }
            : s,
        );
        onSettled?.(true);
      });

    return { justLanded: true, tier, effectiveDate };
  }

  /**
   * settings.md §2.5/§2.5a — ends this device's live verified session
   * without touching the Business, Membership, or any of its data.
   *
   * **Corrected, RFC 0012/D62-63:** previously flipped this `User` row's own
   * `phoneVerifiedAt: null` in place while deliberately leaving
   * `currentUserId` still pointing at it — that mechanism relied on
   * `phoneVerifiedAt` being nullable/re-settable, which no longer exists on
   * `User` at all (`AuthIdentity.verifiedAt` is permanent once set, a
   * credential stays verified forever). "Is this device's session currently
   * live" is now `currentUserId` itself — `null` = no live session — so
   * signing out simply nulls it. `users`/`authIdentities`/`business`/
   * `memberships`/products/sessions/sales are all structurally untouched
   * either way (RFC 0007's own guarantee, §2.5's "nothing is lost" copy): a
   * later re-verification of any of this User's linked credentials
   * (`verifyOtp`/`verifyEmailOtp`/`resolveGoogleSignIn`) resolves straight
   * back to this exact same `User` row via `resolveAuthIdentity`'s
   * `'existing'` branch, never minting a duplicate. `AppRouter.tsx` falls
   * back to `AuthenticationFlow` automatically the instant `currentUserId`
   * clears — no further navigation call needed here.
   */
  function signOut() {
    setState((s) => (s.currentUserId ? { ...s, currentUserId: null } : s));
  }

  /** authentication.md §3.7e "Sí, es mío/mía" (Slice 12 `merchant-user-tester`
   * defect fix, 2026-09-07; generalized 2026-09-13, `decision-log.md`
   * D62/D63) — see the `StoreValue` interface doc comment above for the full
   * reasoning. Clears `User.phoneMismatchConfirmationPending` permanently
   * for the current User, the same "shown once ever" persisted-flag shape
   * `markNfcAvailabilityNudgeShown` already uses. A no-op if no verified
   * `currentUser` resolves (defensive — unreachable through the real UI,
   * which only ever calls this from `PhoneMismatchConfirm.tsx`'s own
   * re-check). */
  function confirmPhoneMismatch() {
    setState((s) => {
      const id = s.currentUserId;
      if (!id) return s;
      return {
        ...s,
        users: s.users.map((u) => (u.id === id ? { ...u, phoneMismatchConfirmationPending: false } : u)),
      };
    });
  }

  /**
   * authentication.md §3.7e "No, elegir otro" (Slice 12 `merchant-user-tester`
   * defect fix, 2026-09-07; generalized 2026-09-13, `decision-log.md`
   * D62/D63, renamed from "No, corregir número" since Google has nothing to
   * "correct" — §3.7e's own text) — see the `StoreValue` interface doc
   * comment above for the full reasoning.
   *
   * **Corrected, RFC 0012/D62-63:** the old mechanism (null out this User
   * row's own `phoneVerifiedAt`, the identical write `signOut` made) no
   * longer applies — there's no field left to null. The honest equivalent
   * now is a real removal: this User row and its one `AuthIdentity` row were
   * both only ever minted this same moment (§3.7e is only ever reached for a
   * genuinely first-ever-anywhere credential, `resolveAuthIdentity`'s own
   * `'new-user'` branch), and hold no Business, Membership, Session, or Sale
   * of their own yet — nothing real is at risk from deleting them outright,
   * the same "costs nothing real" reasoning this function's own spec
   * citation already gives, made more literal by this correction rather
   * than contradicted by it. Kept as its own named function rather than
   * folded into `signOut`: a real account sign-out and correcting a fresh
   * mistake are different merchant-facing moments that happen to share
   * *some* mechanism, not the exact same one anymore.
   */
  function retractMistypedVerification() {
    setState((s) => {
      const id = s.currentUserId;
      if (!id) return s;
      return {
        ...s,
        users: s.users.filter((u) => u.id !== id),
        authIdentities: s.authIdentities.filter((a) => a.userId !== id),
        currentUserId: null,
      };
    });
  }

  /** settings.md §2.7 "Invitar a alguien" (RFC 0013/D64) — see this
   * function's own `StoreValue` doc comment for the full reasoning. Real
   * call to `create_invitation`; every precondition (OWNER, Paid tier) is
   * re-checked server-side, this function never duplicates that check
   * client-side (the same "server is the source of truth for its own
   * authorization" posture every other real write in this file already
   * holds). */
  async function createInvitation(
    businessId: ID,
    targetHint: { type: 'email'; value: string } | null,
    idempotencyKey: string,
  ): Promise<{ invitationId: ID; token: string | null; expiresAt: number } | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] createInvitation: Supabase not configured. See supabase/README.md.');
      return null;
    }
    const { data, error } = await supabase
      .rpc('create_invitation', {
        p_business_id: businessId,
        p_idempotency_key: idempotencyKey,
        p_target_hint: targetHint,
      })
      .single();

    if (error || !data) {
      console.error('[store] create_invitation failed', error);
      return null;
    }

    const row = data as { invitation_id: ID; token: string | null; expires_at: string };
    const expiresAt = new Date(row.expires_at).getTime();
    const invitation: Invitation = {
      id: row.invitation_id,
      businessId,
      role: 'SELLER',
      status: 'pending',
      expiresAt,
      targetHint: targetHint ?? undefined,
      acceptedByUserId: null,
      createdAt: Date.now(),
    };
    applyWriteMirror((s) => ({ ...s, invitations: [...s.invitations, invitation] }));
    return { invitationId: row.invitation_id, token: row.token, expiresAt };
  }

  /** settings.md §4 "Generar otra" (RFC 0013/D64) — see this function's own
   * `StoreValue` doc comment for the full reasoning. Real call to
   * `regenerate_invitation`; the server, not this function, re-confirms the
   * row is still genuinely `pending` before mutating it. */
  async function regenerateInvitation(
    invitationId: ID,
    idempotencyKey: string,
  ): Promise<{ token: string | null; expiresAt: number } | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] regenerateInvitation: Supabase not configured. See supabase/README.md.');
      return null;
    }
    const { data, error } = await supabase
      .rpc('regenerate_invitation', { p_invitation_id: invitationId, p_idempotency_key: idempotencyKey })
      .single();

    if (error || !data) {
      console.error('[store] regenerate_invitation failed', error);
      return null;
    }

    const row = data as { token: string | null; expires_at: string };
    const expiresAt = new Date(row.expires_at).getTime();
    applyWriteMirror((s) => ({
      ...s,
      invitations: s.invitations.map((inv) => (inv.id === invitationId ? { ...inv, expiresAt } : inv)),
    }));
    return { token: row.token, expiresAt };
  }

  /** RFC 0013 §2 / §4 / §7 — see this function's own `StoreValue` doc
   * comment for the full reasoning. Read-only; never mirrors anything into
   * `state`, since the caller may not even hold a `currentUserId` yet. */
  async function peekInvitation(
    token: string,
  ): Promise<
    | { businessName: string; status: 'pending' | 'expired' | 'accepted' | 'revoked' }
    | 'not-found'
    | null
  > {
    const result = await peekInvitationRemote(token);
    if (result.ok) return { businessName: result.businessName, status: result.status };
    if (result.reason === 'not-found') return 'not-found';
    return null;
  }

  /** authentication.md §2.2a step 3 (RFC 0013/D64) — see this function's
   * own `StoreValue` doc comment for the full reasoning. Real call to the
   * already-working `accept_invitation` RPC — this function only wires it
   * up and mirrors its result, it never touches the RPC itself. */
  async function acceptInvitation(
    token: string,
    idempotencyKey: string,
  ): Promise<
    | { businessId: ID; membershipId: ID }
    | { error: 'invitation_not_available' | 'already_member' | 'membership_revoked' }
    | null
  > {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] acceptInvitation: Supabase not configured. See supabase/README.md.');
      return null;
    }
    const { data, error } = await supabase
      .rpc('accept_invitation', { p_token: token, p_idempotency_key: idempotencyKey })
      .single();

    if (error || !data) {
      if (
        error?.message === 'invitation_not_available' ||
        error?.message === 'already_member' ||
        error?.message === 'membership_revoked'
      ) {
        return { error: error.message };
      }
      console.error('[store] accept_invitation failed', error);
      return null;
    }

    const row = data as { business_id: ID; membership_id: ID };
    const user = currentUser(state);
    applyWriteMirror((s) => {
      if (s.memberships.some((m) => m.id === row.membership_id)) return s; // idempotent retry — already mirrored
      const membership: BusinessMembership = {
        id: row.membership_id,
        userId: user?.id ?? s.currentUserId ?? '',
        businessId: row.business_id,
        role: 'SELLER',
        status: 'active',
        revokedAt: null,
        createdAt: Date.now(),
      };
      return { ...s, memberships: [...s.memberships, membership] };
    });
    return { businessId: row.business_id, membershipId: row.membership_id };
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

  /** settings.md §3.12d "Cancelar invitación" (RFC 0013/D64) — see this
   * function's own `StoreValue` doc comment for the full reasoning. */
  async function cancelInvitation(
    invitationId: ID,
    idempotencyKey: string,
  ): Promise<{ invitationId: ID; status: 'revoked' } | { error: 'invitation_not_pending' } | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] cancelInvitation: Supabase not configured. See supabase/README.md.');
      return null;
    }
    const { data, error } = await supabase
      .rpc('cancel_invitation', { p_invitation_id: invitationId, p_idempotency_key: idempotencyKey })
      .single();

    if (error || !data) {
      if (error?.message === 'invitation_not_pending') {
        return { error: 'invitation_not_pending' };
      }
      console.error('[store] cancel_invitation failed', error);
      return null;
    }

    const row = data as { invitation_id: ID; status: string };
    applyWriteMirror((s) => ({
      ...s,
      invitations: s.invitations.map((inv) =>
        inv.id === row.invitation_id ? { ...inv, status: 'revoked' } : inv,
      ),
    }));
    return { invitationId: row.invitation_id, status: 'revoked' };
  }

  /** settings.md §2.7 "Quitar" (§3.13) — see this function's own `StoreValue`
   * doc comment for the full reasoning. */
  async function revokeMembership(membershipId: ID): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] revokeMembership: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('revoke_membership', {
      p_business_id: state.business.id,
      p_membership_id: membershipId,
    });
    if (error) {
      console.error('[store] revoke_membership failed', error);
      return false;
    }
    applyWriteMirror((s) => ({
      ...s,
      memberships: s.memberships.map((m) =>
        m.id === membershipId && m.status === 'active' ? { ...m, status: 'revoked', revokedAt: Date.now() } : m,
      ),
    }));
    return true;
  }

  /** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — see
   * this function's own `StoreValue` doc comment for the full reasoning. */
  async function createEventAssignment(businessId: ID, eventId: ID, membershipId: ID): Promise<boolean> {
    if (!state.business) return false;
    const membership = state.memberships.find((m) => m.id === membershipId);
    if (!membership || membership.status !== 'active') return false; // D55/D56 authorization gate — cheap local fast-path
    const exists = state.eventAssignments.some((a) => a.eventId === eventId && a.membershipId === membershipId);
    if (exists) return true; // already assigned — cheap local fast-path, matches the RPC's own find-or-no-op

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] createEventAssignment: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { data, error } = await supabase
      .rpc('assign_to_event', {
        p_business_id: businessId,
        p_event_id: eventId,
        p_membership_id: membershipId,
      })
      .single();

    if (error || !data) {
      console.error('[store] assign_to_event failed', error);
      return false;
    }

    const { assignment_id: assignmentId, created_at: createdAtRaw } = data as {
      assignment_id: ID;
      created_at: string;
    };
    applyWriteMirror((s) => {
      if (s.eventAssignments.some((a) => a.id === assignmentId)) return s;
      const assignment: EventAssignment = {
        id: assignmentId,
        businessId,
        eventId,
        membershipId,
        createdAt: new Date(createdAtRaw).getTime(),
      };
      return { ...s, eventAssignments: [...s.eventAssignments, assignment] };
    });
    return true;
  }

  /** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — see
   * this function's own `StoreValue` doc comment for the full reasoning. */
  async function removeEventAssignment(businessId: ID, eventId: ID, membershipId: ID): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] removeEventAssignment: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { error } = await supabase.rpc('unassign_from_event', {
      p_business_id: businessId,
      p_event_id: eventId,
      p_membership_id: membershipId,
    });
    if (error) {
      console.error('[store] unassign_from_event failed', error);
      return false;
    }
    applyWriteMirror((s) => ({
      ...s,
      eventAssignments: s.eventAssignments.filter(
        (a) => !(a.eventId === eventId && a.membershipId === membershipId),
      ),
    }));
    return true;
  }

  /**
   * Stage 7 Backend Integration, Phase 2b — shared local-mirror helper: a
   * real, server-confirmed `AllocationMovement` folded into the local
   * mirror every allocation screen reads from. `movement.id` is checked
   * against `s.allocationMovements` first (already-mirrored guard, the same
   * "a replayed idempotent result" posture `mirrorAddedSaleItem` already
   * holds) — a lost-response retry that replays a cached RPC result must
   * never double-apply its side effects locally.
   *
   * A commit-typed movement (`initial_allocation`/`replenish`/
   * `reallocate_in`) flips every affected unit to `reserved` and appends the
   * corresponding `EventAllocationUnit` rows (deduplicated against this
   * allocation's own existing rows — the local mirror of the server's own
   * `(event_allocation_id, unit_id)` uniqueness). A release-typed movement
   * (`adjustment`/`return_to_general`/`reallocate_out`) flips every affected
   * unit back to `available` — `EventAllocationUnit` itself is never pruned
   * (append-only, matching the server's own table).
   */
  function mirrorAllocationMovement(
    s: AppState,
    eventAllocationId: ID,
    movement: {
      id: ID;
      type: AllocationMovement['type'];
      unitIds: ID[];
      quantityDelta: number;
      unitSource: 'scan' | 'fifo_assignment';
      quantityExpected: number | null;
      counterpartEventAllocationId: ID | null;
    } | null,
  ): AppState {
    if (!movement) return s;
    if (s.allocationMovements.some((m) => m.id === movement.id)) return s;

    const isCommit = movement.type === 'initial_allocation' || movement.type === 'replenish' || movement.type === 'reallocate_in';
    const affected = new Set(movement.unitIds);
    const units = s.units.map((u) =>
      affected.has(u.id) ? { ...u, status: (isCommit ? 'reserved' : 'available') as InventoryUnitStatus } : u,
    );

    let eventAllocationUnits = s.eventAllocationUnits;
    if (isCommit) {
      const already = new Set(
        eventAllocationUnits.filter((u) => u.eventAllocationId === eventAllocationId).map((u) => u.unitId),
      );
      const newRows: EventAllocationUnit[] = movement.unitIds
        .filter((id) => !already.has(id))
        .map((id) => ({
          id: makeId('eau'),
          eventAllocationId,
          unitId: id,
          unitSource: movement.unitSource,
          committedAt: Date.now(),
        }));
      eventAllocationUnits = [...eventAllocationUnits, ...newRows];
    }

    const mirrored: AllocationMovement = {
      id: movement.id,
      eventAllocationId,
      type: movement.type,
      unitIds: movement.unitIds,
      quantityDelta: movement.quantityDelta,
      unitSource: movement.unitSource,
      quantityExpected: movement.quantityExpected,
      counterpartEventAllocationId: movement.counterpartEventAllocationId,
      createdAt: Date.now(),
    };

    return { ...s, units, eventAllocationUnits, allocationMovements: [...s.allocationMovements, mirrored] };
  }

  /** Stage 7 Backend Integration, Phase 2b — shared local-mirror helper:
   * upserts the `EventAllocation` row itself (the server's own
   * mint-or-find-by-`(event_id, product_id)` result) — find-by-id first
   * (mint-or-find can legitimately replay an already-mirrored row on a
   * retried call, the same posture `mirrorAddedSaleItem` holds for `Sale`),
   * creating a fresh local row only if none exists yet. */
  function mirrorAllocationUpsert(
    s: AppState,
    eventId: ID,
    productId: ID,
    eventAllocationId: ID,
    quantityAllocated: number,
    status: EventAllocation['status'],
  ): AppState {
    const exists = s.eventAllocations.some((a) => a.id === eventAllocationId);
    const eventAllocations = exists
      ? s.eventAllocations.map((a) => (a.id === eventAllocationId ? { ...a, quantityAllocated, status } : a))
      : [
          ...s.eventAllocations,
          {
            id: eventAllocationId,
            eventId,
            productId,
            quantityPlanned: 0,
            quantityAllocated,
            status,
            createdAt: Date.now(),
          },
        ];
    return { ...s, eventAllocations };
  }

  /** events.md §3.21/§3.23 "Guardar cambios" — see this function's own
   * `StoreValue` doc comment for the full reasoning. A real call to
   * `save_event_allocations`, folding each returned row into the local
   * mirror via `mirrorAllocationUpsert`/`mirrorAllocationMovement` above. */
  async function saveEventAllocations(
    eventId: ID,
    changes: { productId: ID; quantity: number }[],
    idempotencyKey: string,
  ): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] saveEventAllocations: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { data, error } = await supabase.rpc('save_event_allocations', {
      p_business_id: state.business.id,
      p_event_id: eventId,
      p_idempotency_key: idempotencyKey,
      p_changes: changes.map((c) => ({ product_id: c.productId, quantity: c.quantity })),
    });

    if (error || !data) {
      console.error('[store] save_event_allocations failed', error);
      return false;
    }

    const rows = data as {
      product_id: ID;
      event_allocation_id: ID;
      quantity_allocated: number;
      status: EventAllocation['status'];
      movement_id: ID | null;
      movement_type: AllocationMovement['type'] | null;
      movement_unit_ids: ID[] | null;
      movement_quantity_delta: number | null;
    }[];

    applyWriteMirror((s) => {
      let next = s;
      for (const row of rows) {
        next = mirrorAllocationUpsert(next, eventId, row.product_id, row.event_allocation_id, row.quantity_allocated, row.status);
        if (row.movement_id && row.movement_type && row.movement_unit_ids) {
          next = mirrorAllocationMovement(next, row.event_allocation_id, {
            id: row.movement_id,
            type: row.movement_type,
            unitIds: row.movement_unit_ids,
            quantityDelta: row.movement_quantity_delta ?? 0,
            unitSource: 'fifo_assignment',
            quantityExpected: null,
            counterpartEventAllocationId: null,
          });
        }
      }
      return next;
    });
    return true;
  }

  /** events.md §3.22 — see this function's own `StoreValue` doc comment for
   * the full reasoning. A real call to `scan_unit_into_event_allocation`.
   * The commit's own `type` (`initial_allocation` vs `replenish`) isn't
   * returned by the RPC — resolved locally from whether this allocation's
   * `scan`-sourced pool was empty before this call, the same live-state
   * inference `_fifo_commit_to_allocation` performs server-side (no UI
   * currently reads a `scan`-sourced movement's exact `type`, so this is a
   * safe, disclosed local approximation, not a load-bearing security or
   * write-correctness concern — the server's own ledger is authoritative). */
  async function scanUnitIntoEventAllocation(
    eventId: ID,
    productId: ID,
    tagIdentifier: string,
  ): Promise<
    | { ok: true; unitId: ID }
    | { ok: false; reason: 'already-committed' | 'tag-not-found' | 'wrong-product' | 'platform-error' }
  > {
    if (!state.business) return { ok: false, reason: 'platform-error' };
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] scanUnitIntoEventAllocation: Supabase not configured. See supabase/README.md.');
      return { ok: false, reason: 'platform-error' };
    }
    const { data, error } = await supabase
      .rpc('scan_unit_into_event_allocation', {
        p_business_id: state.business.id,
        p_event_id: eventId,
        p_product_id: productId,
        p_tag_identifier: tagIdentifier,
        p_idempotency_key: crypto.randomUUID(),
      })
      .single();

    if (error || !data) {
      if (error?.message === 'unit_already_committed') return { ok: false, reason: 'already-committed' };
      if (error?.message === 'tag_not_found') return { ok: false, reason: 'tag-not-found' };
      if (error?.message === 'tag_wrong_product') return { ok: false, reason: 'wrong-product' };
      console.error('[store] scan_unit_into_event_allocation failed', error);
      return { ok: false, reason: 'platform-error' };
    }

    const row = data as { event_allocation_id: ID; unit_id: ID; movement_id: ID };
    const existingAllocation = state.eventAllocations.find((a) => a.id === row.event_allocation_id);
    const wasEmptyBefore = !state.eventAllocationUnits.some(
      (u) => u.eventAllocationId === row.event_allocation_id && u.unitSource === 'scan',
    );

    applyWriteMirror((s) => {
      let next = mirrorAllocationUpsert(
        s,
        eventId,
        productId,
        row.event_allocation_id,
        existingAllocation?.quantityAllocated ?? 0,
        'open',
      );
      next = mirrorAllocationMovement(next, row.event_allocation_id, {
        id: row.movement_id,
        type: wasEmptyBefore ? 'initial_allocation' : 'replenish',
        unitIds: [row.unit_id],
        quantityDelta: 1,
        unitSource: 'scan',
        quantityExpected: null,
        counterpartEventAllocationId: null,
      });
      return next;
    });
    return { ok: true, unitId: row.unit_id };
  }

  /** events.md §3.24 — see this function's own `StoreValue` doc comment for
   * the full reasoning. A real call to `reallocate_event_allocation`,
   * folding both sides of the single-transaction move into the local
   * mirror — the source's own `reallocate_out` movement, then the
   * destination's `reallocate_in` movement (mint-or-find, and
   * `quantityAllocated` incremented locally only for `unitSource=
   * 'fifo_assignment'`, mirroring `_fifo_commit_to_allocation`'s own
   * server-side rule). The source `EventAllocation`'s own status is
   * untouched by this operation, matching the server's own scoping
   * decision (`_release_from_allocation`'s `'reconciled'` flip applies only
   * to `'return_to_general'`, never `'reallocate_out'` — see that
   * migration's own header comment). */
  async function reallocateEventAllocation(
    sourceEventId: ID,
    destEventId: ID,
    productId: ID,
    unitSource: 'scan' | 'fifo_assignment',
    quantityOrUnitIds: number | ID[],
    idempotencyKey: string,
  ): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] reallocateEventAllocation: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const isQuantity = typeof quantityOrUnitIds === 'number';
    const { data, error } = await supabase
      .rpc('reallocate_event_allocation', {
        p_business_id: state.business.id,
        p_idempotency_key: idempotencyKey,
        p_source_event_id: sourceEventId,
        p_dest_event_id: destEventId,
        p_product_id: productId,
        p_unit_source: unitSource,
        p_quantity: isQuantity ? quantityOrUnitIds : null,
        p_unit_ids: isQuantity ? null : quantityOrUnitIds,
      })
      .single();

    if (error || !data) {
      console.error('[store] reallocate_event_allocation failed', error);
      return false;
    }

    const row = data as {
      source_event_allocation_id: ID;
      dest_event_allocation_id: ID;
      moved_unit_ids: ID[];
      source_movement_id: ID;
      dest_movement_id: ID;
    };
    const existingDestAllocation = state.eventAllocations.find((a) => a.id === row.dest_event_allocation_id);
    const destQuantityAllocated =
      (existingDestAllocation?.quantityAllocated ?? 0) + (unitSource === 'fifo_assignment' ? row.moved_unit_ids.length : 0);

    applyWriteMirror((s) => {
      let next = mirrorAllocationMovement(s, row.source_event_allocation_id, {
        id: row.source_movement_id,
        type: 'reallocate_out',
        unitIds: row.moved_unit_ids,
        quantityDelta: -row.moved_unit_ids.length,
        unitSource,
        quantityExpected: null,
        counterpartEventAllocationId: row.dest_event_allocation_id,
      });
      next = mirrorAllocationUpsert(next, destEventId, productId, row.dest_event_allocation_id, destQuantityAllocated, 'open');
      next = mirrorAllocationMovement(next, row.dest_event_allocation_id, {
        id: row.dest_movement_id,
        type: 'reallocate_in',
        unitIds: row.moved_unit_ids,
        quantityDelta: row.moved_unit_ids.length,
        unitSource,
        quantityExpected: null,
        counterpartEventAllocationId: row.source_event_allocation_id,
      });
      return next;
    });
    return true;
  }

  /** events.md §3.16/§3.25 "Regresar a inventario general" (NFC rows) — see
   * this function's own `StoreValue` doc comment for the full reasoning. A
   * real call to `return_scanned_units_to_general`. */
  async function returnScannedUnitsToGeneral(eventAllocationId: ID, idempotencyKey: string): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] returnScannedUnitsToGeneral: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { data, error } = await supabase
      .rpc('return_scanned_units_to_general', {
        p_business_id: state.business.id,
        p_event_allocation_id: eventAllocationId,
        p_idempotency_key: idempotencyKey,
      })
      .single();

    if (error || !data) {
      console.error('[store] return_scanned_units_to_general failed', error);
      return false;
    }

    const row = data as { released_unit_ids: ID[]; movement_id: ID };
    applyWriteMirror((s) => {
      let next = mirrorAllocationMovement(s, eventAllocationId, {
        id: row.movement_id,
        type: 'return_to_general',
        unitIds: row.released_unit_ids,
        quantityDelta: -row.released_unit_ids.length,
        unitSource: 'scan',
        quantityExpected: null,
        counterpartEventAllocationId: null,
      });
      const allocation = next.eventAllocations.find((a) => a.id === eventAllocationId);
      if (allocation && quantityRemaining(next, allocation) === 0) {
        next = {
          ...next,
          eventAllocations: next.eventAllocations.map((a) => (a.id === eventAllocationId ? { ...a, status: 'reconciled' } : a)),
        };
      }
      return next;
    });
    return true;
  }

  /** events.md §3.16 closed-Event reconciliation for manual/untagged rows —
   * see this function's own `StoreValue` doc comment for the full
   * reasoning. A real call to `reconcile_manual_allocation`. */
  async function reconcileManualAllocation(
    eventAllocationId: ID,
    quantity: number,
    quantityExpected: number,
    idempotencyKey: string,
  ): Promise<boolean> {
    if (!state.business) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] reconcileManualAllocation: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { data, error } = await supabase
      .rpc('reconcile_manual_allocation', {
        p_business_id: state.business.id,
        p_event_allocation_id: eventAllocationId,
        p_idempotency_key: idempotencyKey,
        p_quantity: quantity,
      })
      .single();

    if (error || !data) {
      console.error('[store] reconcile_manual_allocation failed', error);
      return false;
    }

    const row = data as { released_unit_ids: ID[]; movement_id: ID };
    applyWriteMirror((s) => {
      let next = mirrorAllocationMovement(s, eventAllocationId, {
        id: row.movement_id,
        type: 'return_to_general',
        unitIds: row.released_unit_ids,
        quantityDelta: -row.released_unit_ids.length,
        unitSource: 'fifo_assignment',
        quantityExpected,
        counterpartEventAllocationId: null,
      });
      const allocation = next.eventAllocations.find((a) => a.id === eventAllocationId);
      if (allocation && quantityRemaining(next, allocation) === 0) {
        next = {
          ...next,
          eventAllocations: next.eventAllocations.map((a) => (a.id === eventAllocationId ? { ...a, status: 'reconciled' } : a)),
        };
      }
      return next;
    });
    return true;
  }

  function resetPrototype() {
    setState(initialState());
  }

  const value: StoreValue = {
    state,
    hydrationStatus,
    retryHydration: () => void runHydrationResolution(),
    hydrateFromBackend,
    requestOtp,
    verifyOtp,
    requestEmailOtp,
    verifyEmailOtp,
    startGoogleSignIn,
    resolveGoogleSignIn,
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
    confirmPhoneMismatch,
    retractMistypedVerification,
    createInvitation,
    regenerateInvitation,
    peekInvitation,
    acceptInvitation,
    declineInvitation,
    cancelInvitation,
    revokeMembership,
    saveEventAllocations,
    scanUnitIntoEventAllocation,
    reallocateEventAllocation,
    returnScannedUnitsToGeneral,
    reconcileManualAllocation,
    createEventAssignment,
    removeEventAssignment,
    resetPrototype,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
