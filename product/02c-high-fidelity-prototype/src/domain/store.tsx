import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { makeId } from './id';
import { addDaysToKey, dateKey, todayKey } from './dates';
import { sendOtp, verifyOtpCode } from './otpClient';
import {
  actingMembership,
  currentUser,
  eventStatus,
  findMembership,
  myActiveSession,
  nfcCapable,
  nfcReadiness,
  quantityRemaining,
} from './selectors';
import type {
  AllocationMovement,
  AppState,
  AuthIdentity,
  Business,
  BusinessMembership,
  Event,
  EventAllocation,
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
    | 'allocationMovements'
    | 'eventAssignments'
  > {
  currentUser?: LegacyUser | null;
  users?: LegacyUser[];
  authIdentities?: AuthIdentity[];
  currentUserId?: ID | null;
  invitations?: Invitation[];
  /** RFC 0010/D59 — an old saved row predates `quantityPlanned`/
   * `allocatedUnitIds` (it may still carry the now-retired stored
   * `quantityRemaining` key, harmlessly ignored) — see `loadState`'s own
   * migration below. Typed loosely (`EventAllocation`, not a variant
   * omitting the new fields) matching every other legacy field in this
   * interface's own established "cast loosely, default with `??` at read
   * time" convention (`memberships.status`/`sessions.openedByMembershipId`
   * below). */
  eventAllocations?: EventAllocation[];
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
        // pass) has no `quantityPlanned`/`allocatedUnitIds` at all; defaulted
        // to `0`/`[]`, the same honest "nothing committed via the new
        // mechanism yet" starting shape `commitAllocation` now writes for a
        // brand-new row. Its old, now-retired `quantityRemaining` key (if
        // present) is simply never read again — `quantityRemaining` is a
        // derived selector now, not a stored field.
        const eventAllocations: EventAllocation[] = (
          Array.isArray(parsed.eventAllocations) ? parsed.eventAllocations : []
        ).map((a) => ({
          ...a,
          quantityPlanned: a.quantityPlanned ?? 0,
          allocatedUnitIds: a.allocatedUnitIds ?? [],
        }));
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
   * later write (`setBusinessIdentity`, still a local-only mock write, not
   * yet part of this Phase 0 pass — see this pass's own build report). */
  completeOnboarding: (path: OnboardingPath) => Promise<ID | null>;
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
   * appended (`decision-log.md` D58). **Plain Business-wide FIFO only —
   * `EventAllocation`-aware selection (RFC 0010/D59's own local-only
   * mechanism) is no longer consulted here; Phase 2b's own not-yet-built
   * compare-and-swap is what will eventually reconcile the two (confirmed
   * out of this phase's scope, three independent ways).** `idempotencyKey`
   * is supplied by the caller (`Selling.tsx`'s own per-product idempotency-
   * key ref, mirroring `commitLot`'s fix — the single highest-frequency
   * write in the whole product, so this is where that retry discipline
   * matters most). Resolves `false` on any rejected/failed outcome (no
   * local state change happens in that case). */
  addItemToSale: (productId: ID, idempotencyKey: string) => Promise<boolean>;
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
   * rule. **Rewritten as a thin dispatcher, RFC 0010/D59:** for each
   * `(productId, quantity)` pair, resolves (creating if needed) this Event's
   * own `EventAllocation`, computes the signed delta between the requested
   * quantity and that allocation's current live-remaining count
   * (`quantityRemaining`, `selectors.ts` — never the monotonic
   * `quantityAllocated` lifetime total, which never decreases), and calls
   * `commitAllocation()` (delta > 0) or `releaseAllocation(..., 'adjustment')`
   * (delta < 0) to do the actual FIFO/ledger work — a delta of 0 is a no-op.
   * She still only ever sees "Para este evento" go up or down; which of
   * `initial_allocation`/`replenish`/`adjustment` actually wrote is resolved
   * entirely underneath, invisibly, exactly as before. Manual/FIFO mode
   * only, this slice — NFC-scan allocation (`events.md` §3.22) is out of
   * scope. No idempotency key is currently generated for this write, or for
   * the `commitAllocation()`/`releaseAllocation()` writes it dispatches to.
   * RFC 0010 §8/§11 names a stable idempotency key as a write-mechanics
   * requirement; same pre-existing gap as `commitLot()`/`editPrice()`/
   * `setProductPhoto()` (`BACKLOG.md` §F) — a stated
   * `architecture-principles.md` #7 guarantee this implementation doesn't
   * yet satisfy, not fixed here — Stage 7 (Backend Integration) owns it. */
  saveEventAllocations: (eventId: ID, changes: { productId: ID; quantity: number }[]) => void;
  /** RFC 0010/D59 §8/§11 — the symmetric decrease/reconciliation operation.
   * Candidates are `eventAllocation.allocatedUnitIds` entries whose unit is
   * currently `status='reserved'`, ordered most-recently-committed-first
   * (by originating `AllocationMovement.createdAt` descending, resolved via
   * this `EventAllocation`'s own ledger — never commit's own oldest-first
   * order, a different question with a different answer, §11). Flips up to
   * `quantity` of them `reserved → available` (fewer if the candidate pool
   * is smaller — the same partial-fulfillment tolerance `commitAllocation`
   * already has), writes one `AllocationMovement` row (`type`, the actual
   * released `unitIds`, `unitSource='fifo_assignment'`, `quantityExpected`
   * when given), and flips `EventAllocation.status` to `'reconciled'` when
   * `type='return_to_general'` leaves zero `reserved` units remaining —
   * never on an ordinary `'adjustment'`. Two call sites, same operation:
   * `saveEventAllocations`'s own mid-Event decrease (`type='adjustment'`,
   * no `quantityExpected`) and `events.md` §3.16's closed-Event
   * reconciliation section (`type='return_to_general'`, `quantityExpected`
   * = the live-derived expected count at the moment she confirmed).
   * **`quantity=0` is a legitimate, real call, not a no-op** — §3.16's
   * N=1 "No regresó" and a stepper confirmed at 0 both mean it, and still
   * need their own zero-delta ledger row written (for the ambient
   * "Confirmaste que 0 de N..." copy, and so a later visit's "Ya revisaste
   * esto" check can find this attempt) — only `quantity > 0` with an empty
   * candidate pool is treated as a genuine no-op. No idempotency key is
   * currently generated for this write, despite RFC 0010 §8/§11 naming one
   * as a write-mechanics requirement. Same pre-existing gap as
   * `commitLot()`/`editPrice()`/`setProductPhoto()` (`BACKLOG.md` §F); a
   * stated `architecture-principles.md` #7 guarantee this implementation
   * doesn't yet satisfy, not fixed here — Stage 7 (Backend Integration)
   * owns it. */
  releaseAllocation: (
    eventAllocationId: ID,
    quantity: number,
    type: 'adjustment' | 'return_to_general',
    quantityExpected?: number | null,
  ) => void;
  /** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — the
   * atomic `EventAssignment`-creation write. Called directly by the
   * OWNER-side "assign staff to an Event" screen,
   * `src/screens/Events/PersonalParaEsteEvento.tsx`. Upsert-shaped: a no-op
   * against the already-existing row if one exists for this exact
   * `(eventId, membershipId)` pair (unique on that pair, RFC 0011 §1) —
   * never a duplicate, the same "find-or-no-op" idiom
   * `createInvitation`/`setPriceOverride` already use for their own
   * uniqueness rules. **Gated on `membership.status === 'active'`** (RFC
   * 0011 Open Item 4, resolved by the Architecture Gap Analysis directly
   * from the existing D55/D56 authorization-gate precedent) — defensively
   * re-checked here, at write time, never trusting a UI-computed value, the
   * same posture `revokeMembership`/`cancelEvent` already hold themselves to
   * elsewhere in this file. A no-op (not a thrown error) whenever either
   * precondition fails, matching this file's existing defensive-guard style
   * throughout. Never checks `hasSchedulingConflict` (`selectors.ts`) itself
   * — RFC 0011 §2's "warn, never block" rule means a conflict is surfaced by
   * `PersonalParaEsteEvento.tsx` itself, never enforced at the write. */
  createEventAssignment: (businessId: ID, eventId: ID, membershipId: ID) => void;
  /** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — plain
   * delete, no soft-state (RFC 0011 §1: "no downstream write ever
   * references an `EventAssignment` row directly"). Unassigning removes the
   * row outright — the correct, minimal shape for a join with no historical
   * dependent, unlike `revokeMembership`/`cancelEvent`'s own soft-state
   * writes above. */
  removeEventAssignment: (id: ID) => void;
  resetPrototype: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

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

    setState((s) => ({
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
    setState((s) => ({ ...s, business, memberships: [...s.memberships, membership] }));
    return data.business_id;
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
   * the new `SaleItem` by its real `sale_item_id`/`unit_id`, and flip that
   * unit's local mirror to `'reserved'`. Pure, given `s` — called from
   * inside each caller's own `setState` updater, never calling `setState`
   * itself.
   */
  function mirrorAddedSaleItem(
    s: AppState,
    sessionId: ID,
    productId: ID,
    row: { sale_id: ID; sale_item_id: ID; unit_id: ID; price_paid: number },
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
    const item: SaleItem = { id: row.sale_item_id, productId, unitId: row.unit_id, pricePaid: row.price_paid };
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
    setState((s) => ({
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
    setState((s) => ({
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
    setState((s) => ({
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
    setState((s) => ({
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
    setState((s) => ({
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
    setState((s) => {
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
    setState((s) => {
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
   * **`EventAllocation`-aware selection is no longer consulted here.** The
   * RPC performs plain Business-wide FIFO only (Phase 2's own explicit scope
   * boundary — EventAllocation/AllocationMovement are Phase 2b, confirmed
   * out of scope three independent ways). `EventAllocation`'s own "Para este
   * evento" bookkeeping (`commitAllocation`/`releaseAllocation`/
   * `saveEventAllocations`, the Events screens that read it) remains an
   * entirely local, display/planning-only concept in this build — not yet
   * enforced by the real selling write, exactly as Phase 2b's own not-yet-
   * built compare-and-swap is what will eventually reconcile the two.
   *
   * `idempotencyKey` is supplied by the caller (`Selling.tsx`'s own
   * per-product idempotency-key ref, mirroring `commitLot`'s own fix) — one
   * key per logical tap, reused unchanged across a retry of that same tap.
   * Resolves `true` on success, `false` on any rejected/failed outcome (no
   * local state change happens in that case).
   */
  async function addItemToSale(productId: ID, idempotencyKey: string): Promise<boolean> {
    if (!state.business) return false; // defensive — Selling only mounts once onboarding is complete
    const membership = actingMembership(state);
    if (!membership) return false; // defensive — Selling only mounts once a valid acting Membership resolves
    const session = myActiveSession(state, membership.id);
    if (!session) return false;
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('[store] addItemToSale: Supabase not configured. See supabase/README.md.');
      return false;
    }
    const { data, error } = await supabase
      .rpc('add_item_to_sale', {
        p_business_id: state.business.id,
        p_product_id: productId,
        p_idempotency_key: idempotencyKey,
      })
      .single();

    if (error || !data) {
      console.error('[store] add_item_to_sale failed', error);
      return false;
    }

    const row = data as { sale_id: ID; sale_item_id: ID; unit_id: ID; price_paid: number };
    setState((s) => mirrorAddedSaleItem(s, session.id, productId, row, membership.id));
    return true;
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

    const row = data as { sale_id: ID; sale_item_id: ID; unit_id: ID; product_id: ID; price_paid: number };
    setState((s) => mirrorAddedSaleItem(s, session.id, row.product_id, row, membership.id));
    return { ok: true, unitId: row.unit_id, productId: row.product_id };
  }

  /** home.md §3.8a's "Quitar de la venta." Stage 7 Backend Integration,
   * Phase 2: a real call to `remove_sale_item` (naturally idempotent by id
   * — no client-supplied key needed). Plain reserved->available revert —
   * `EventAllocation`'s own "still genuinely committed, revert to
   * `reserved`" distinction (RFC 0010/D59, the client's pre-Phase-2 local
   * mock) is no longer consulted here, for the same reason
   * `addItemToSale`'s own doc comment above names — Phase 2b's own
   * compare-and-swap, not built yet, is what will eventually reconcile the
   * two. */
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
    setState((s) => {
      const sale = s.sales.find((sa) => sa.status === 'open' && sa.items.some((i) => i.id === saleItemId));
      if (!sale) return s;
      const item = sale.items.find((i) => i.id === saleItemId)!;
      const sales = s.sales.map((sa) =>
        sa.id === sale.id ? { ...sa, items: sa.items.filter((i) => i.id !== saleItemId) } : sa,
      );
      const units = s.units.map((u) => (u.id === item.unitId ? { ...u, status: 'available' as InventoryUnitStatus } : u));
      return { ...s, sales, units };
    });
  }

  /** home.md §3.8a "Cancelar" — the whole open Sale, all at once. Stage 7
   * Backend Integration, Phase 2: a real call to `cancel_sale` (naturally
   * idempotent — no open Sale on this Session is a no-op — no client-
   * supplied key needed). Plain reserved->available revert for every item,
   * same scope boundary as `removeSaleItem` above.
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
    setState((s) => {
      const unitIds = new Set(openSale.items.map((i) => i.unitId));
      const units = s.units.map((u) => (unitIds.has(u.id) ? { ...u, status: 'available' as InventoryUnitStatus } : u));
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
    setState((s) => ({
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
      // RFC 0012/D62-63 — `User.phone` no longer exists; resolved through
      // `AuthIdentity` instead (out-of-scope Invitation logic otherwise left
      // untouched — this is the load-bearing domain-layer correction, not a
      // redesign of this check's own meaning).
      const alreadyMember = s.memberships.some(
        (m) =>
          m.businessId === s.business!.id &&
          s.authIdentities.some((a) => a.userId === m.userId && a.type === 'phone' && a.identifier === phone),
      );
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
    // RFC 0012/D62-63 — `user.phoneVerifiedAt == null` was the old
    // authenticated-session gate; `currentUser` now only ever resolves a row
    // at all when `currentUserId` is set, which itself only happens via a
    // successful credential resolution, so `!user` alone is the identical
    // check under the corrected model (out-of-scope Invitation logic
    // otherwise left untouched).
    const user = currentUser(state);
    if (!user) return null;
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

  /** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — see
   * this function's own `StoreValue` doc comment for the full reasoning. */
  function createEventAssignment(businessId: ID, eventId: ID, membershipId: ID) {
    setState((s) => {
      const membership = s.memberships.find((m) => m.id === membershipId);
      if (!membership || membership.status !== 'active') return s; // D55/D56 authorization gate
      const exists = s.eventAssignments.some((a) => a.eventId === eventId && a.membershipId === membershipId);
      if (exists) return s; // find-or-no-op — unique on (eventId, membershipId), never a duplicate
      const assignment: EventAssignment = {
        id: makeId('assign'),
        businessId,
        eventId,
        membershipId,
        createdAt: Date.now(),
      };
      return { ...s, eventAssignments: [...s.eventAssignments, assignment] };
    });
  }

  /** `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60 — see
   * this function's own `StoreValue` doc comment for the full reasoning. */
  function removeEventAssignment(id: ID) {
    setState((s) => ({ ...s, eventAssignments: s.eventAssignments.filter((a) => a.id !== id) }));
  }

  /**
   * RFC 0010/D59 §2/§8/§11 — the FIFO-commit half of the Physical-location-
   * exclusivity invariant's mechanism (b), generalizing NFC allocation's own
   * conditional `available → reserved` write (RFC 0009 §3(a)) to manual
   * mode. FIFO-selects `min(quantity, available-and-untagged count)`
   * `InventoryUnit` rows (`status='available' && tagId==null`, oldest
   * `receivedAt` first — D5's own ordering), flips each to `reserved`,
   * appends the flipped ids to `allocatedUnitIds` (deduplicated — see this
   * function's own inline note), increments `quantityAllocated` by the
   * actual count flipped (monotonic — never decremented by
   * `releaseAllocation`, §11), and writes one `AllocationMovement` row
   * (`type='initial_allocation'` on this allocation's first-ever commit,
   * else `'replenish'` — resolved from whether `allocatedUnitIds` was empty
   * *before* this call, the same live-state check `quantityRemaining`'s own
   * retirement established elsewhere in this RFC, never a separately
   * tracked flag). A no-op if no candidate is available at all (the
   * partial-fulfillment case — fewer than `quantity` flipped — still writes
   * a movement for whatever *was* flipped, same tolerance ordinary FIFO
   * consumption already has). Private to this module — only
   * `saveEventAllocations` below calls it; no UI surface calls it directly,
   * matching `events.md` §3.21's "she only ever sees a number change" rule.
   * No idempotency key is currently generated for this write, despite RFC
   * 0010 §8/§11 naming one as a write-mechanics requirement. Same
   * pre-existing gap as `commitLot()`/`editPrice()`/`setProductPhoto()`
   * (`BACKLOG.md` §F); a stated `architecture-principles.md` #7 guarantee
   * this implementation doesn't yet satisfy, not fixed here — Stage 7
   * (Backend Integration) owns it.
   */
  function commitAllocation(eventAllocationId: ID, quantity: number) {
    if (quantity <= 0) return;
    setState((s) => {
      const allocation = s.eventAllocations.find((a) => a.id === eventAllocationId);
      if (!allocation) return s;

      const candidates = s.units
        .filter((u) => u.productId === allocation.productId && u.status === 'available' && u.tagId == null)
        .sort((a, b) => a.receivedAt - b.receivedAt)
        .slice(0, quantity);
      if (candidates.length === 0) return s;

      const flippedIds = candidates.map((u) => u.id);
      const flippedSet = new Set(flippedIds);
      const units = s.units.map((u) => (flippedSet.has(u.id) ? { ...u, status: 'reserved' as InventoryUnitStatus } : u));

      const isFirstEverCommit = allocation.allocatedUnitIds.length === 0;
      const movement: AllocationMovement = {
        id: makeId('movement'),
        eventAllocationId,
        type: isFirstEverCommit ? 'initial_allocation' : 'replenish',
        unitIds: flippedIds,
        quantityDelta: flippedIds.length,
        unitSource: 'fifo_assignment',
        quantityExpected: null,
        counterpartEventAllocationId: null,
        createdAt: Date.now(),
      };

      const eventAllocations = s.eventAllocations.map((a) => {
        if (a.id !== eventAllocationId) return a;
        // Defensive dedupe — RFC 0010 §11's own append-only rule means a
        // unit released earlier (still present in `allocatedUnitIds`, no
        // longer `reserved`) could in principle be FIFO-reselected by a
        // later commit against the *same* allocation; without this guard
        // that would push a duplicate id into the array and silently
        // double-count it in the derived `quantityRemaining` selector.
        const newIds = flippedIds.filter((id) => !a.allocatedUnitIds.includes(id));
        return {
          ...a,
          allocatedUnitIds: [...a.allocatedUnitIds, ...newIds],
          quantityAllocated: a.quantityAllocated + flippedIds.length,
        };
      });

      return { ...s, units, eventAllocations, allocationMovements: [...s.allocationMovements, movement] };
    });
  }

  /** RFC 0010/D59 §11 (mid-Event decrease) / §8 (Event-close reconciliation)
   * — see this function's own `StoreValue` doc comment for the full
   * reasoning. */
  function releaseAllocation(
    eventAllocationId: ID,
    quantity: number,
    type: 'adjustment' | 'return_to_general',
    quantityExpected: number | null = null,
  ) {
    if (quantity < 0) return; // defensive — never a negative request
    setState((s) => {
      const allocation = s.eventAllocations.find((a) => a.id === eventAllocationId);
      if (!allocation) return s;

      // Resolve each `allocatedUnitIds` entry's originating movement
      // `createdAt` — "most-recently-committed-first," not commit's own
      // FIFO-forward order (RFC 0010 §11). Only the "adding" movement types
      // ever originate a unit's membership in this array; a unit is looked
      // up against the *first* such movement it appears in (chronological
      // array order), which — given `commitAllocation`'s own dedupe above —
      // is always its one true originating write.
      const originatingCreatedAt = new Map<ID, number>();
      for (const m of s.allocationMovements) {
        if (m.eventAllocationId !== eventAllocationId) continue;
        if (m.type !== 'initial_allocation' && m.type !== 'replenish' && m.type !== 'reallocate_in') continue;
        for (const unitId of m.unitIds) {
          if (!originatingCreatedAt.has(unitId)) originatingCreatedAt.set(unitId, m.createdAt);
        }
      }

      const unitsById = new Map(s.units.map((u) => [u.id, u]));
      // Candidates: `allocatedUnitIds` entries whose unit is currently
      // `reserved`. Every populated entry in this build is
      // `fifo_assignment`-sourced (NFC allocation is unmodeled this slice),
      // so no separate `unitSource` filter is needed beyond what
      // `commitAllocation` ever wrote here.
      const reservedIds = allocation.allocatedUnitIds.filter((id) => unitsById.get(id)?.status === 'reserved');
      const candidates = reservedIds
        .slice()
        .sort((a, b) => (originatingCreatedAt.get(b) ?? 0) - (originatingCreatedAt.get(a) ?? 0))
        .slice(0, quantity);
      // A genuine no-op only when she asked for something (`quantity > 0`)
      // but nothing was actually available to release (a stale/raced read —
      // the same partial-fulfillment tolerance `commitAllocation` has, at
      // its own zero end). **`quantity === 0` is itself a legitimate,
      // real confirmation, not a no-op** — RFC 0010 §8's "No regresó" (N=1)
      // and a stepper confirmed at 0 (N>1) both call this with
      // `quantity=0` and still need their own `AllocationMovement` row (
      // `quantityDelta=0`) written, both for the ambient "Confirmaste que 0
      // de N..." copy and so §3.16's "Ya revisaste esto" existence check can
      // ever find this reconciliation attempt on a later visit.
      if (quantity > 0 && candidates.length === 0) return s;

      const candidateSet = new Set(candidates);
      const units =
        candidates.length > 0
          ? s.units.map((u) => (candidateSet.has(u.id) ? { ...u, status: 'available' as InventoryUnitStatus } : u))
          : s.units;

      const movement: AllocationMovement = {
        id: makeId('movement'),
        eventAllocationId,
        type,
        unitIds: candidates,
        quantityDelta: -candidates.length,
        unitSource: 'fifo_assignment',
        quantityExpected,
        counterpartEventAllocationId: null,
        createdAt: Date.now(),
      };

      // `EventAllocation.status` flips to `'reconciled'` only as a
      // consequence of a `return_to_general` write leaving zero `reserved`
      // units remaining (RFC 0010 §8) — never on an ordinary `'adjustment'`.
      // `allocatedUnitIds` is never pruned (§11) — only the referenced
      // unit's own `status` changes.
      const remainingAfter = reservedIds.length - candidates.length;
      const nextStatus: EventAllocation['status'] =
        type === 'return_to_general' && remainingAfter === 0 ? 'reconciled' : allocation.status;

      const eventAllocations = s.eventAllocations.map((a) =>
        a.id === eventAllocationId ? { ...a, status: nextStatus } : a,
      );

      return {
        ...s,
        units,
        eventAllocations,
        allocationMovements: [...s.allocationMovements, movement],
      };
    });
  }

  /** events.md §3.21/§3.23 "Guardar cambios" — see this function's own
   * `StoreValue` doc comment for the full reasoning. **Rewritten as a thin
   * dispatcher, RFC 0010/D59** — the actual FIFO/ledger work lives entirely
   * in `commitAllocation`/`releaseAllocation` above; this function only
   * resolves (or creates) each pair's `EventAllocation` row and the signed
   * delta between the requested quantity and that allocation's current
   * live-remaining count. Preserves the existing bulk "one save moment" UX
   * — every row's change is dispatched from this one call, even though the
   * underlying writes are no longer literally one `setState` (each
   * `commitAllocation`/`releaseAllocation` call is its own functional
   * `setState` update, chained correctly since React queues successive
   * functional updates against the previous one's result within the same
   * synchronous call). */
  function saveEventAllocations(eventId: ID, changes: { productId: ID; quantity: number }[]) {
    for (const change of changes) {
      const existing = state.eventAllocations.find(
        (a) => a.eventId === eventId && a.productId === change.productId && a.status === 'open',
      );
      if (!existing) {
        if (change.quantity <= 0) continue; // nothing to create for a still-zero row
        const newAllocation: EventAllocation = {
          id: makeId('alloc'),
          eventId,
          productId: change.productId,
          quantityPlanned: 0,
          quantityAllocated: 0,
          allocatedUnitIds: [],
          status: 'open',
          createdAt: Date.now(),
        };
        setState((s) => ({ ...s, eventAllocations: [...s.eventAllocations, newAllocation] }));
        commitAllocation(newAllocation.id, change.quantity);
        continue;
      }
      // Delta against the *live-remaining* committed count — never the
      // monotonic `quantityAllocated` lifetime total (RFC 0010 §11), which
      // never decreases and would double-release/double-commit against any
      // prior mid-Event decrease. Safe to read from the outer `state`
      // closure rather than a fresh functional-update read: each `change`
      // in this loop targets a distinct `(eventId, productId)` pair, so no
      // iteration's write ever affects another iteration's own target row.
      const remaining = quantityRemaining(state, existing);
      const delta = change.quantity - remaining;
      if (delta > 0) commitAllocation(existing.id, delta);
      else if (delta < 0) releaseAllocation(existing.id, -delta, 'adjustment');
      // delta === 0 → no-op, nothing changed for this row
    }
  }

  function resetPrototype() {
    setState(initialState());
  }

  const value: StoreValue = {
    state,
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
    acceptInvitation,
    declineInvitation,
    revokeMembership,
    saveEventAllocations,
    releaseAllocation,
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
