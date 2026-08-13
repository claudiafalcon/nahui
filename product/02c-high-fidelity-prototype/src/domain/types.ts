/**
 * Domain types for the High-Fidelity prototype slice
 * (Home → Inventario → Registrar mercancía → Selling → Digital receipt).
 *
 * These mirror the relevant aggregates in `product/00-foundation/domain-model.md`
 * for this slice only — not a full re-implementation of the Foundation.
 *
 * Scope decisions (see README.md "Scope decisions" for the full reasoning):
 * - Business operates at `subscriptionTier = 'free'` for this slice. `nfc` is
 *   therefore never in `registrationMode` (D27: nfc ⟺ subscriptionTier=paid),
 *   so `Session.operatingMode` always resolves silently to 'buttons' (the
 *   Ready/common-case branch, D23) — no NFC hardware simulation is attempted.
 * - Event/Venue/Eventos are out of this slice's scope — every Session here is
 *   a Quick Session (`eventId: null`), matching home.md §3.7b.
 * - Full unit-level traceability IS modeled (Product → Lot → InventoryEntry →
 *   InventoryUnit, with FIFO consumption, D3/D5) — not the simplified
 *   single-quantity fallback the brief permits, because it's real, cheap-to-model
 *   domain truth for this slice and is what "continue building from it" needs.
 */

export type ID = string;

export interface Business {
  name: string;
  logo?: string;
  subscriptionTier: 'free' | 'paid';
  defaultSellingMode: 'buttons' | 'nfc';
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
  eventId: null; // Quick Session only, in this slice — see scope note above
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
  business: Business;
  products: Product[];
  lots: Lot[];
  entries: InventoryEntry[];
  units: InventoryUnit[];
  sessions: Session[];
  sales: Sale[];
}
