import type { CommitLotLine } from './store';

/**
 * "Ver un ejemplo" seed data — onboarding.md §11's own stated minimums are
 * narrowed for this pass, per this task's explicit scope decision: Products/
 * Lots/InventoryUnits via the existing `commitLot` write path (real stock,
 * so Home's own idle state, `home.md` §2.4, resolves correctly), but no
 * Event, no Customer/Claim, and the NFC-readiness/Claim minimums §11
 * otherwise recommends are explicitly skipped. Disclosed in
 * `BACKLOG.md`'s migration inventory, section E ("Demo seed data") —
 * "Ver un ejemplo" is deliberately the thinnest of the three paths in this
 * pass, reusing the two real paths' own plumbing rather than its own
 * mechanism (`onboarding.md` §2.2's own reasoning for why it's seeded at
 * the richest capability combination).
 *
 * Plausible clothing-vendor Selling Groups, matching Ana's own real-world
 * category (`company/CLAUDE.md` — a clothing vendor at private bazares).
 */
export const DEMO_BUSINESS_NAME = 'Ropa Aurora';
export const DEMO_BUSINESS_DESCRIPTION = 'Ropa y accesorios para toda la familia';

export const DEMO_SEED_LINES: CommitLotLine[] = [
  { quantity: 8, product: { kind: 'new', name: 'Playeras', defaultPrice: 220 } },
  { quantity: 6, product: { kind: 'new', name: 'Blusas', defaultPrice: 320 } },
  { quantity: 5, product: { kind: 'new', name: 'Pantalones', defaultPrice: 450 } },
  { quantity: 10, product: { kind: 'new', name: 'Bolsas', defaultPrice: 280 } },
];
