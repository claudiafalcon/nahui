import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { makeId } from './id';
import { addDaysToKey, dateKey, rangesOverlap, todayKey } from './dates';
import { eventStatus } from './selectors';
import type {
  AppState,
  Business,
  BusinessMembership,
  Event,
  EventType,
  ID,
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

const STORAGE_KEY = 'nahui-hifi-prototype-v1';

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
    currentUser: null,
    business: null,
    memberships: [],
    products: [],
    lots: [],
    entries: [],
    units: [],
    sessions: [],
    sales: [],
    venues: [],
    events: [],
    priceOverrides: [],
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      // minimal shape guard — a corrupt/old localStorage value never crashes
      // the app. `business` is legitimately `null` pre-Onboarding now, so
      // the guard checks array-shaped fields and `currentUser`'s own key
      // presence instead of truthiness of `business`.
      if (
        parsed &&
        Array.isArray(parsed.products) &&
        Array.isArray(parsed.memberships) &&
        'currentUser' in parsed
      ) {
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
        return {
          ...parsed,
          venues: Array.isArray(parsed.venues) ? parsed.venues : [],
          events: Array.isArray(parsed.events) ? parsed.events : [],
          priceOverrides: Array.isArray(parsed.priceOverrides) ? parsed.priceOverrides : [],
          business: parsed.business
            ? {
                ...parsed.business,
                pendingSubscriptionTier: parsed.business.pendingSubscriptionTier ?? null,
                pendingSubscriptionTierEffectiveDate: parsed.business.pendingSubscriptionTierEffectiveDate ?? null,
                pendingSubscriptionTierAcknowledged: parsed.business.pendingSubscriptionTierAcknowledged ?? false,
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
  product: { kind: 'existing'; productId: ID } | { kind: 'new'; name: string; defaultPrice: number };
}

/** `onboarding.md` §2.2's three-way capability table. */
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

/** `events.md` §3.6's D17 overlap-validation variant — `createEvent` never
 * returns a bare boolean; a rejected save names the specific conflicting
 * Event and its Venue's `displayName` so the form can render "Esas fechas
 * se cruzan con {venue} ({rango})" without a second lookup. */
export type CreateEventResult =
  | { ok: true; eventId: ID }
  | { ok: false; conflictingEvent: Event; conflictingVenueName: string };

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
  /** onboarding.md §2.2a/§3.5d "Guardando lo que vendes" — writes bare
   * Product rows only (no Lot/InventoryEntry/InventoryUnit), reusing the
   * same Product-minting logic `commitLot` already uses for a genuinely new
   * Product identity. Returns the resolved ids, same order as input. */
  createProducts: (lines: { name: string; defaultPrice: number }[]) => ID[];
  /** onboarding.md §3.6 "Todo listo" — marks the milestone dismissed
   * (tapped "Entrar," or auto-continued). See `Business.onboardingAcknowledged`. */
  acknowledgeOnboarding: () => void;
  /** Returns the resolved productId for each line, same order as input —
   * a freshly-minted id for `new` lines, the given id for `existing` ones. */
  commitLot: (lines: CommitLotLine[]) => ID[];
  editPrice: (productId: ID, newPrice: number) => void;
  /** events.md §3.6 "Guardar evento" — the atomic Event-creation write.
   * Resolves `venue` (mint-or-find, `resolveVenue`'s own logic) inside the
   * same transaction, and re-checks the D17 overlap rule at write time
   * (defensive re-check — the form itself already blocks the tap, same
   * "never trust the UI alone" posture `setPriceOverride`'s own defensive
   * re-check below applies). */
  createEvent: (fields: {
    venue: VenueRef;
    type: EventType;
    startDate: string;
    endDate: string;
    bazaarCost: number;
  }) => CreateEventResult;
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
   * for a Quick Session, exactly as before. The existing "any active Session
   * blocks a new one" guard already generalizes correctly with no change. */
  startSession: (eventId?: ID | null) => void;
  addItemToSale: (productId: ID) => boolean;
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
   * or any of its data. **Critical correctness point:** sets
   * `currentUser.phoneVerifiedAt = null` in place — never
   * `currentUser: null` — preserving the existing `User` row's `id`/`phone`/
   * `createdAt`. `verifyOtp` only resolves the *same* `User` row on a
   * returning verification when `state.currentUser && state.currentUser.phone
   * === phone`; nulling `currentUser` entirely would mint a *second* `User`
   * id for the same phone on re-verification, violating RFC 0007 §1's
   * global-phone-identity invariant. Touches only `currentUser` — `business`/
   * `memberships`/products/sessions/sales are structurally untouched
   * (RFC 0007's own guarantee, §2.5's "nothing is lost" copy).
   * `AppRouter.tsx` falls back to `AuthenticationFlow` automatically the
   * instant `phoneVerifiedAt` clears — no further navigation call needed
   * here. */
  signOut: () => void;
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
   * Shared new-Product minting/resolution logic — extracted so both
   * `commitLot` (inventory.md §3.8a/§3.9, a new Product atomic with its
   * Lot) and `createProducts` (onboarding.md §2.2a, a new Product with no
   * Lot at all) resolve a not-yet-real `{name, defaultPrice}` identity into
   * a real, ID-bearing `Product` through exactly one mechanism — never two
   * independently-built creation paths (onboarding.md §2.2a's own explicit
   * instruction to `builder`/`ui-designer`).
   */
  function mintProduct(name: string, defaultPrice: number, createdAt: number): Product {
    return { id: makeId('prod'), name: name.trim(), defaultPrice, createdAt };
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
   */
  function commitLot(lines: CommitLotLine[]): ID[] {
    if (lines.length === 0) return [];
    const lotId = makeId('lot');
    const receivedAt = Date.now();

    const newProducts: Product[] = [];
    const resolvedProductIds: ID[] = lines.map((line) => {
      if (line.product.kind === 'existing') return line.product.productId;
      const product = mintProduct(line.product.name, line.product.defaultPrice, receivedAt);
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
   * docs/passes/slice-2-authentication-onboarding.md): any 6-digit code is accepted, so this never fails. This
   * prototype is a single localStorage instance per device, so there is at
   * most one `User` ever relevant (`state.currentUser`) — a lookup "by
   * phone, globally" (RFC 0007 §1) only has real work to do once a second
   * device/session exists, out of this slice's scope. A first-ever
   * verification (no `currentUser`, or a different phone than any already
   * held) mints a new `User`; a returning verification for the same phone
   * resolves the existing one and preserves its original `phoneVerifiedAt`.
   */
  function verifyOtp(phone: string, _code: string): User {
    const now = Date.now();
    const user: User =
      state.currentUser && state.currentUser.phone === phone
        ? { ...state.currentUser, phoneVerifiedAt: state.currentUser.phoneVerifiedAt ?? now }
        : { id: makeId('user'), phone, phoneVerifiedAt: now, createdAt: now };
    setState((s) => ({ ...s, currentUser: user }));
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
    if (!state.currentUser || state.currentUser.phoneVerifiedAt == null) return null;
    const existingMembership = state.memberships.find(
      (m) => m.userId === state.currentUser!.id && m.role === 'OWNER',
    );
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
    };
    const membership: BusinessMembership = {
      id: makeId('mem'),
      userId: state.currentUser.id,
      businessId,
      role: 'OWNER',
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

  /** onboarding.md §2.2a/§3.5d "Guardando lo que vendes" — Product rows
   * only, through the same minting logic `commitLot` uses, per that
   * section's own instruction not to build a second creation mechanism. */
  function createProducts(lines: { name: string; defaultPrice: number }[]): ID[] {
    const now = Date.now();
    const newProducts = lines.map((l) => mintProduct(l.name, l.defaultPrice, now));
    setState((s) => ({ ...s, products: [...s.products, ...newProducts] }));
    return newProducts.map((p) => p.id);
  }

  /** onboarding.md §3.6 — "Entrar" tapped, or auto-continued. */
  function acknowledgeOnboarding() {
    setState((s) => (s.business ? { ...s, business: { ...s.business, onboardingAcknowledged: true } } : s));
  }

  function editPrice(productId: ID, newPrice: number) {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === productId ? { ...p, defaultPrice: newPrice } : p)),
    }));
  }

  /**
   * events.md §3.6 "Guardar evento" — the atomic Event-creation write:
   * resolves the pending Venue selection (mint-or-find, `resolveVenue`) and
   * enforces D17's overlap rule, both inside the same transaction. D17: "at
   * most one Event per Business may be `scheduled` or `active` with an
   * overlapping date range at a time," checked against every other Event
   * whose *computed* status (`eventStatus`, never a stored field) is
   * `scheduled`/`active` — a cancelled or already-closed Event never
   * conflicts. Returns a named conflict, never a bare boolean (§3.6's own
   * overlap-validation variant: "names the conflicting Event, not a
   * generic 'fechas inválidas'").
   */
  function createEvent(fields: {
    venue: VenueRef;
    type: EventType;
    startDate: string;
    endDate: string;
    bazaarCost: number;
  }): CreateEventResult {
    const now = Date.now();
    const conflicting = state.events.find(
      (e) =>
        (eventStatus(e, now) === 'scheduled' || eventStatus(e, now) === 'active') &&
        rangesOverlap(fields.startDate, fields.endDate, e.startDate, e.endDate),
    );
    if (conflicting) {
      const venue = state.venues.find((v) => v.id === conflicting.venueId);
      return { ok: false, conflictingEvent: conflicting, conflictingVenueName: venue?.displayName ?? '' };
    }

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
    return { ok: true, eventId: event.id };
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

  function startSession(eventId: ID | null = null) {
    setState((s) => {
      if (!s.business) return s; // defensive — Home only mounts once onboarding is complete
      if (s.sessions.some((sess) => sess.status === 'active')) return s; // never ask twice
      // NFC Readiness / Session-start resolution (decision-log.md D23),
      // narrowed by this pass's own disclosed scope decision: NFCTag
      // assignment ("Asignar Tags," inventory.md §3.14) isn't modeled at
      // all in this build, so no InventoryUnit can ever carry an assigned
      // tag — NFC Readiness therefore always evaluates Not Ready, and
      // Session.operatingMode always resolves silently to 'buttons', even
      // for the demo Onboarding path (the only path that ever seeds
      // defaultSellingMode='nfc', onboarding.md §2.2). This is the one
      // real, structural consequence: home.md §3.6a's Not Ready one-time
      // mention ("Todavía no tienes prendas con tag para hoy...") is what
      // the demo path's Idle screen shows instead — see Idle.tsx and
      // docs/passes/slice-2-authentication-onboarding.md's "NFC Readiness
      // always evaluates Not Ready" disclosure.
      const operatingMode: SessionOperatingMode = 'buttons';
      const session: Session = {
        id: makeId('sess'),
        eventId,
        operatingMode,
        status: 'active',
        openedAt: Date.now(),
      };
      return { ...s, sessions: [...s.sessions, session] };
    });
  }

  function addItemToSale(productId: ID): boolean {
    const session = state.sessions.find((sess) => sess.status === 'active');
    if (!session) return false;

    // FIFO allocation, Buttons mode (decision-log.md D5): oldest available
    // InventoryUnit for this Product, automatically, no merchant decision.
    const candidate = state.units
      .filter((u) => u.productId === productId && u.status === 'available')
      .sort((a, b) => a.receivedAt - b.receivedAt)[0];
    if (!candidate) return false;

    const product = state.products.find((p) => p.id === productId);
    if (!product) return false;

    // Price resolution (D33, domain-model.md "Price resolution"): this
    // Session's Event's Price Override for the sold Product if one exists,
    // else the Product's own defaultPrice — never a merchant decision, never
    // asked mid-Sale. A Quick Session (eventId: null) always falls straight
    // to defaultPrice, since there's no Event to carry an override.
    const override = session.eventId
      ? state.priceOverrides.find((po) => po.eventId === session.eventId && po.productId === productId)
      : undefined;
    const pricePaid = override?.overridePrice ?? product.defaultPrice;

    setState((s) => {
      let sales = s.sales;
      let sale = sales.find((sa) => sa.sessionId === session.id && sa.status === 'open');
      if (!sale) {
        sale = { id: makeId('sale'), sessionId: session.id, items: [], status: 'open' };
        sales = [...sales, sale];
      }
      const item: SaleItem = {
        id: makeId('item'),
        productId,
        unitId: candidate.id,
        pricePaid,
      };
      sales = sales.map((sa) => (sa.id === sale!.id ? { ...sa, items: [...sa.items, item] } : sa));
      const units = s.units.map((u) =>
        u.id === candidate.id ? { ...u, status: 'reserved' as InventoryUnitStatus } : u,
      );
      return { ...s, sales, units };
    });
    return true;
  }

  function cancelSale() {
    setState((s) => {
      const session = s.sessions.find((sess) => sess.status === 'active');
      if (!session) return s;
      const openSale = s.sales.find((sa) => sa.sessionId === session.id && sa.status === 'open');
      if (!openSale) return s;
      const unitIds = new Set(openSale.items.map((i) => i.unitId));
      const units = s.units.map((u) =>
        unitIds.has(u.id) ? { ...u, status: 'available' as InventoryUnitStatus } : u,
      );
      const sales = s.sales.filter((sa) => sa.id !== openSale.id);
      return { ...s, sales, units };
    });
  }

  function finalizeSale(): Receipt | null {
    if (!state.business) return null; // defensive — Selling only mounts once onboarding is complete
    const session = state.sessions.find((sess) => sess.status === 'active');
    if (!session) return null;
    const openSale = state.sales.find((sa) => sa.sessionId === session.id && sa.status === 'open');
    if (!openSale || openSale.items.length === 0) return null;

    const total = openSale.items.reduce((sum, i) => sum + i.pricePaid, 0);
    const itemCount = openSale.items.length;

    setState((s) => {
      const unitIds = new Set(openSale.items.map((i) => i.unitId));
      const units = s.units.map((u) =>
        unitIds.has(u.id) ? { ...u, status: 'sold' as InventoryUnitStatus } : u,
      );
      const sales: Sale[] = s.sales.map((sa) =>
        sa.id === openSale.id ? { ...sa, status: 'finalized', finalizedAt: Date.now() } : sa,
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
    };
  }

  function closeSession() {
    setState((s) => ({
      ...s,
      sessions: s.sessions.map((sess) =>
        sess.status === 'active' ? { ...sess, status: 'closed', closedAt: Date.now() } : sess,
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
   * above for the full correctness reasoning (why `phoneVerifiedAt: null`,
   * never `currentUser: null`). */
  function signOut() {
    setState((s) => (s.currentUser ? { ...s, currentUser: { ...s.currentUser, phoneVerifiedAt: null } } : s));
  }

  function resetPrototype() {
    setState(initialState());
  }

  const value: StoreValue = {
    state,
    verifyOtp,
    completeOnboarding,
    setBusinessIdentity,
    createProducts,
    acknowledgeOnboarding,
    commitLot,
    editPrice,
    createEvent,
    cancelEvent,
    setPriceOverride,
    startSession,
    addItemToSale,
    cancelSale,
    finalizeSale,
    closeSession,
    activatePaidPlan,
    requestDowngradeToFree,
    cancelPendingSubscriptionTierChange,
    changeDefaultSellingMode,
    reconcilePendingSubscriptionTier,
    signOut,
    resetPrototype,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
