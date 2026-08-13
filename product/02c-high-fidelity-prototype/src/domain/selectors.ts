import type { AppState, ID, Product, Session } from './types';

/** Pure, derived reads over AppState — no mutation, mirrors domain-model.md's
 * "the merchant experiences Products, the platform preserves traceability." */

export function activeSession(state: AppState): Session | undefined {
  return state.sessions.find((s) => s.status === 'active');
}

export function openSaleForSession(state: AppState, sessionId: ID) {
  return state.sales.find((sa) => sa.sessionId === sessionId && sa.status === 'open');
}

export function availableCount(state: AppState, productId: ID): number {
  return state.units.filter((u) => u.productId === productId && u.status === 'available').length;
}

export function everReceived(state: AppState, productId: ID): boolean {
  return state.entries.some((e) => e.productId === productId);
}

export function hasAnyAvailableUnit(state: AppState): boolean {
  return state.units.some((u) => u.status === 'available');
}

/** Catalog rows in registration order — what Inventario's Catalog view shows. */
export function catalogRows(state: AppState) {
  return state.products
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((product) => ({
      product,
      available: availableCount(state, product.id),
      everReceived: everReceived(state, product.id),
    }));
}

/** How many finalized SaleItems this Product has ever sold — drives the
 * selling grid's most-frequently-sold-first ordering (home.md §3.9). */
function salesCount(state: AppState, productId: ID): number {
  let count = 0;
  for (const sale of state.sales) {
    if (sale.status !== 'finalized') continue;
    for (const item of sale.items) {
      if (item.productId === productId) count += 1;
    }
  }
  return count;
}

/** Selling grid order: most-frequently-sold-first, ties broken by registration order. */
export function sellingGridRows(state: AppState) {
  return state.products
    .slice()
    .map((product) => ({
      product,
      available: availableCount(state, product.id),
      sold: salesCount(state, product.id),
    }))
    .sort((a, b) => {
      if (b.sold !== a.sold) return b.sold - a.sold;
      return a.product.createdAt - b.product.createdAt;
    });
}

/** Running totals for a Session — sum of SaleItem.pricePaid across every
 * finalized Sale in it (decision-log.md D33) — never a flat price × count. */
export function sessionTotals(state: AppState, sessionId: ID): { revenue: number; count: number } {
  let revenue = 0;
  let count = 0;
  for (const sale of state.sales) {
    if (sale.sessionId !== sessionId || sale.status !== 'finalized') continue;
    count += 1;
    for (const item of sale.items) revenue += item.pricePaid;
  }
  return { revenue, count };
}

export function findProduct(state: AppState, productId: ID): Product | undefined {
  return state.products.find((p) => p.id === productId);
}
