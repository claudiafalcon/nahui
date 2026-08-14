/**
 * Local, self-contained domain types for the Loyalty-claim customer-facing
 * surface. Shaped to match `product/00-foundation/domain-model.md` and
 * `decision-log.md` D37/D47 — NOT imported from
 * `product/02c-high-fidelity-prototype/src/domain/types.ts` (this folder's
 * own `CLAUDE.md` forbids any import from that sibling project; see
 * `docs/gap-analysis.md` §1's "refinement, not a deviation" ruling).
 *
 * This is a fully self-contained mock: zero runtime coupling to the
 * Merchant Application. `Sale`/`SaleItem` exist here only as the minimal
 * internal fixtures Loyalty-claim's own read-only dependency on Selling
 * needs to resolve a Claim Token — never rendered to the customer
 * (`customer-loyalty-registration.md` §0's own explicit constraint,
 * checked screen-by-screen there).
 */

export type ID = string;

/** Loyalty-claim's own read-only view of the merchant Ana runs — just
 * enough to be the foreground identity on screen (§3.5/§3.10/§3.11).
 * `logo` is modeled for shape-completeness (`home.md` §3.8f's own
 * "name or logo, never both" precedent) but no seed Business in this build
 * sets one — every seeded screen renders `name`. */
export interface Business {
  id: ID;
  name: string;
  logo?: string;
  /** `domain-model.md`'s Business.loyaltyRewardThreshold (D37) — read only
   * to keep this build's internal counter math (`currentCycleProgress`/
   * `completedCyclesCount`) coherent. Never rendered to the customer;
   * `customer-loyalty-registration.md` §8 item 3 / §10 explicitly keeps
   * reward-cycle progress out of this surface. */
  loyaltyRewardThreshold: number;
}

/** Internal only — a Sale's SaleItems are never named, priced, or counted
 * back to the customer anywhere in this build (§0's explicit constraint).
 * `pricePaid` exists purely so `Customer.lifetimeSpend` can be incremented
 * correctly when a Claim resolves (Gap Analysis §2's "internal-only
 * fixture need"). */
export interface SaleItem {
  id: ID;
  saleId: ID;
  businessId: ID;
  pricePaid: number;
}

/** Internal only — resolved behind a Claim Token, never rendered. A Sale's
 * `claimToken` is this build's local stand-in for the opaque, signed token
 * a real Sale finalization would mint (`ubiquitous-language.md`'s Claim
 * Token) — deliberately non-cryptographic, the same posture
 * `mintClaimToken` takes in the Merchant prototype (Gap Analysis §1),
 * referenced for shape only, not imported. */
export interface Sale {
  id: ID;
  businessId: ID;
  claimToken: string;
  /** A seed-only marker for a token that should resolve as expired
   * regardless of its Sale/SaleItem state — §2 step 1's "past its
   * validity window" branch, sharing 3.3's screen/copy with the malformed
   * case (Gap Analysis §5 item 1: doesn't need its own resolution logic
   * beyond this flag, since the customer-facing outcome is identical). */
  expired?: boolean;
}

/** `domain-model.md`'s Customer schema (D35/D37), reproduced in full —
 * "already complete as specified... no new fields needed" per this
 * folder's own `CLAUDE.md`. Business-scoped, uniquely identified within a
 * Business by `(businessId, email)`. */
export interface Customer {
  id: ID;
  businessId: ID;
  email: string;
  ageRange?: string;
  gender?: string;
  purchaseCount: number;
  lifetimeSpend: number;
  currentCycleProgress: number;
  completedCyclesCount: number;
}

/** `Claim { id, businessId, customerId, saleItemId, claimedAt }` —
 * `decision-log.md` D47's newly-formalized schema, one Claim per SaleItem. */
export interface Claim {
  id: ID;
  businessId: ID;
  customerId: ID;
  saleItemId: ID;
  claimedAt: number;
}

export interface StoreState {
  businesses: Business[];
  sales: Sale[];
  saleItems: SaleItem[];
  customers: Customer[];
  claims: Claim[];
}

/** Result of resolving a Claim Token — §2 steps 1-2's combined
 * validity + already-claimed check, evaluated fresh every time (never a
 * cached flag) so a rescanned, now-fully-claimed token correctly flips to
 * `fully-claimed` on a later visit. */
export type TokenResolution =
  | { kind: 'invalid' }
  | { kind: 'fully-claimed' }
  | {
      kind: 'claimable';
      businessId: ID;
      saleId: ID;
      business: Business;
      /** Still-unclaimed SaleItem ids for this Sale, computed fresh. */
      unclaimedSaleItemIds: ID[];
    };

/** §2 step 4's outcome once she submits her email on 3.5. */
export type EmailSubmissionResult =
  | { kind: 'existing-customer'; customer: Customer }
  | { kind: 'new-customer' };

/** A transient write failure — §2 step 6 / architecture-principles.md #7.
 * Thrown, never returned, so callers use ordinary try/catch. */
export class TransientWriteError extends Error {
  constructor() {
    super('No pudimos guardar. Intenta de nuevo.');
    this.name = 'TransientWriteError';
  }
}

/** A transient resolution/load failure — §2 step 7. */
export class TransientLoadError extends Error {
  constructor() {
    super('No pudimos cargar esto.');
    this.name = 'TransientLoadError';
  }
}
