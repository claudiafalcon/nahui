import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { makeId } from './id';
import { createSeedState } from './seed';
import {
  TransientLoadError,
  TransientWriteError,
  type Claim,
  type Customer,
  type EmailSubmissionResult,
  type ID,
  type StoreState,
  type TokenResolution,
} from './types';

const STORAGE_KEY = 'nahui-loyalty-prototype-v1';

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreState;
      // Minimal shape guard — a corrupt/old localStorage value never
      // crashes this prototype, same discipline the Merchant prototype's
      // own `loadState` follows (pattern reference only, reimplemented
      // locally — see this folder's own CLAUDE.md zero-import rule).
      if (
        Array.isArray(parsed.businesses) &&
        Array.isArray(parsed.sales) &&
        Array.isArray(parsed.saleItems) &&
        Array.isArray(parsed.customers) &&
        Array.isArray(parsed.claims)
      ) {
        return parsed;
      }
    }
  } catch {
    // falls through to a fresh seed below
  }
  return createSeedState();
}

function saveState(state: StoreState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // best-effort only — a full/blocked localStorage never breaks the flow
  }
}

/** Reset this browser's local demo data back to the original seed fixtures
 * — a dev-tooling affordance (see `DemoIndex`), not a customer-facing
 * capability. Lets a click-through of "demo-nueva"/"demo-recurrente" be
 * repeated after those tokens' SaleItems get claimed. */
export function resetLoyaltyDemoData() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op — nothing to clear
  }
}

/** Simulated network latency — randomized on purpose so both the
 * near-instant (3.1/3.7) and slow (3.2/3.8, >~1.5s) wireframe variants are
 * organically reachable across repeated attempts, instead of only ever
 * exercising one of the two. */
function networkDelay(): Promise<void> {
  const ms = 300 + Math.random() * 1900;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Demo-only flaky-network simulation ---
// Reached via `?flaky=resolve` / `?flaky=save` / `?flaky=both` on any
// `/c/:token` URL — fails exactly the first matching attempt of that kind
// per page load, then succeeds on retry, so 3.9/3.12 are reliably
// demoable without a dedicated seed token (Gap Analysis §5: a
// network-failure toggle "doesn't need its own token"). Module-scoped
// (not React state) so it survives re-renders within one page load but
// naturally resets on a fresh load — see this build's own report for the
// full rationale.
let resolveFailureConsumed = false;
let saveFailureConsumed = false;

function shouldSimulateFailure(kind: 'resolve' | 'save'): boolean {
  if (typeof window === 'undefined') return false;
  const flaky = new URLSearchParams(window.location.search).get('flaky');
  if (!flaky || (flaky !== 'both' && flaky !== kind)) return false;
  if (kind === 'resolve') {
    if (resolveFailureConsumed) return false;
    resolveFailureConsumed = true;
    return true;
  }
  if (saveFailureConsumed) return false;
  saveFailureConsumed = true;
  return true;
}

function unclaimedSaleItemIds(state: StoreState, saleId: ID): ID[] {
  const claimedItemIds = new Set(state.claims.map((c) => c.saleItemId));
  return state.saleItems.filter((si) => si.saleId === saleId && !claimedItemIds.has(si.id)).map((si) => si.id);
}

/**
 * `customer-loyalty-registration.md` §2 steps 1-2, evaluated fresh every
 * call — never a cached "is this claimed" flag — so a rescan of a token
 * whose SaleItems have since all been claimed correctly flips from
 * `claimable` to `fully-claimed` on a later visit.
 */
function resolveTokenImpl(state: StoreState, token: string): TokenResolution {
  const sale = state.sales.find((s) => s.claimToken === token);
  if (!sale || sale.expired) return { kind: 'invalid' };
  const business = state.businesses.find((b) => b.id === sale.businessId);
  if (!business) return { kind: 'invalid' }; // defensive — unreachable via seed data
  const unclaimed = unclaimedSaleItemIds(state, sale.id);
  if (unclaimed.length === 0) return { kind: 'fully-claimed' };
  return { kind: 'claimable', businessId: business.id, saleId: sale.id, business, unclaimedSaleItemIds: unclaimed };
}

/**
 * The one shared write mechanism both trigger points converge on
 * (Gap Analysis §3): create one Claim per still-unclaimed SaleItem in the
 * resolved Sale, link to the given Customer, increment counters by
 * exactly this call's own newly-created Claims — never the Sale's full
 * original count. Recomputes "still-unclaimed" fresh from `state.claims`
 * every call, which is what makes this idempotent on retry: if an earlier
 * attempt already landed, this finds zero remaining unclaimed items and
 * is a safe, silent no-op (Gap Analysis §3's reused `completeOnboarding`
 * pattern — existing-state-lookup at write time, no separate idempotency
 * key/ledger).
 */
function writeUnclaimedItemsAsClaims(state: StoreState, businessId: ID, saleId: ID, customerId: ID): StoreState {
  const unclaimed = unclaimedSaleItemIds(state, saleId);
  if (unclaimed.length === 0) return state;

  const now = Date.now();
  const newClaims: Claim[] = unclaimed.map((saleItemId) => ({
    id: makeId('claim'),
    businessId,
    customerId,
    saleItemId,
    claimedAt: now,
  }));
  const newlyClaimedSpend = state.saleItems
    .filter((si) => unclaimed.includes(si.id))
    .reduce((sum, si) => sum + si.pricePaid, 0);

  const threshold = state.businesses.find((b) => b.id === businessId)?.loyaltyRewardThreshold ?? 10;
  const customers = state.customers.map((c) => {
    if (c.id !== customerId) return c;
    let progress = c.currentCycleProgress + newClaims.length;
    let completed = c.completedCyclesCount;
    while (progress >= threshold) {
      progress -= threshold;
      completed += 1;
    }
    return {
      ...c,
      purchaseCount: c.purchaseCount + 1,
      lifetimeSpend: c.lifetimeSpend + newlyClaimedSpend,
      currentCycleProgress: progress,
      completedCyclesCount: completed,
    };
  });

  return { ...state, claims: [...state.claims, ...newClaims], customers };
}

interface LoyaltyStoreContextValue {
  /** §2 steps 1-2. Throws `TransientLoadError` when the demo's
   * `?flaky=resolve`/`?flaky=both` simulation is armed and unconsumed. */
  resolveToken: (token: string) => Promise<TokenResolution>;
  /**
   * §2 steps 3-4, the combined lookup+write. Performs the
   * `(businessId, email)` dedup lookup itself, fresh, every call (Gap
   * Analysis §3 — "never trusting a UI-computed... flag from an earlier
   * read"). Only writes when an existing Customer is found; when none is
   * found, nothing is written and the caller proceeds to the optional
   * demographics screen. Throws `TransientWriteError` when the demo's
   * `?flaky=save`/`?flaky=both` simulation is armed and unconsumed.
   */
  submitEmail: (saleId: ID, businessId: ID, email: string) => Promise<EmailSubmissionResult>;
  /**
   * §2 step 5's "Listo" write. Re-runs the same dedup lookup before
   * creating anything, so a retry after a partial prior success (customer
   * created, Claims failed) never mints a duplicate Customer. Throws
   * `TransientWriteError` on the demo's simulated failure.
   */
  submitDetails: (
    saleId: ID,
    businessId: ID,
    email: string,
    ageRange: string | undefined,
    gender: string | undefined,
  ) => Promise<Customer>;
}

const LoyaltyStoreContext = createContext<LoyaltyStoreContextValue | null>(null);

export function LoyaltyStoreProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<StoreState>(() => loadState());
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    saveState(state);
  }, [state]);

  function getState(): StoreState {
    return stateRef.current;
  }
  function commit(next: StoreState) {
    stateRef.current = next;
    setStateRaw(next);
  }

  async function resolveToken(token: string): Promise<TokenResolution> {
    await networkDelay();
    if (shouldSimulateFailure('resolve')) throw new TransientLoadError();
    return resolveTokenImpl(getState(), token);
  }

  async function submitEmail(saleId: ID, businessId: ID, email: string): Promise<EmailSubmissionResult> {
    await networkDelay();
    if (shouldSimulateFailure('save')) throw new TransientWriteError();
    const normalized = email.trim().toLowerCase();
    const existing = getState().customers.find((c) => c.businessId === businessId && c.email.toLowerCase() === normalized);
    if (!existing) return { kind: 'new-customer' };
    const next = writeUnclaimedItemsAsClaims(getState(), businessId, saleId, existing.id);
    commit(next);
    const updated = next.customers.find((c) => c.id === existing.id)!;
    return { kind: 'existing-customer', customer: updated };
  }

  async function submitDetails(
    saleId: ID,
    businessId: ID,
    email: string,
    ageRange: string | undefined,
    gender: string | undefined,
  ): Promise<Customer> {
    await networkDelay();
    if (shouldSimulateFailure('save')) throw new TransientWriteError();
    const normalized = email.trim().toLowerCase();
    let working = getState();
    const existing = working.customers.find((c) => c.businessId === businessId && c.email.toLowerCase() === normalized);
    let customerId: ID;
    if (existing) {
      // Already known (e.g. a retry of this exact call after a prior
      // attempt's Customer-create half succeeded but its Claim-write half
      // didn't) — never overwrite already-stored ageRange/gender (D37).
      customerId = existing.id;
    } else {
      const created: Customer = {
        id: makeId('cust'),
        businessId,
        email: email.trim(),
        ageRange: ageRange || undefined,
        gender: gender || undefined,
        purchaseCount: 0,
        lifetimeSpend: 0,
        currentCycleProgress: 0,
        completedCyclesCount: 0,
      };
      working = { ...working, customers: [...working.customers, created] };
      customerId = created.id;
    }
    const next = writeUnclaimedItemsAsClaims(working, businessId, saleId, customerId);
    commit(next);
    return next.customers.find((c) => c.id === customerId)!;
  }

  return (
    <LoyaltyStoreContext.Provider value={{ resolveToken, submitEmail, submitDetails }}>
      {children}
    </LoyaltyStoreContext.Provider>
  );
}

export function useLoyaltyStore(): LoyaltyStoreContextValue {
  const ctx = useContext(LoyaltyStoreContext);
  if (!ctx) throw new Error('useLoyaltyStore must be used within LoyaltyStoreProvider');
  return ctx;
}
