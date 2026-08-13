import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { makeId } from './id';
import type {
  AppState,
  ID,
  InventoryUnit,
  InventoryUnitStatus,
  Product,
  Sale,
  SaleItem,
  Session,
  SessionOperatingMode,
} from './types';

const STORAGE_KEY = 'nahui-hifi-prototype-v1';

/**
 * Seeded Business identity only (D36: Business.name is required and must
 * exist by construction). Onboarding is explicitly out of this slice's
 * scope, so identity capture itself isn't built — this is the honest
 * substitute: a pre-existing business, exactly as Ana would already have
 * one by the time she reaches Home/Inventario for the first time.
 *
 * subscriptionTier is fixed at 'free' for this slice — see README.md
 * "Scope decisions" for the full reasoning (nfc ∉ registrationMode per D27,
 * so Session.operatingMode always resolves silently to 'buttons', D23).
 */
function initialState(): AppState {
  return {
    business: {
      name: 'Luna Mercado',
      subscriptionTier: 'free',
      defaultSellingMode: 'buttons',
    },
    products: [],
    lots: [],
    entries: [],
    units: [],
    sessions: [],
    sales: [],
  };
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      // minimal shape guard — a corrupt/old localStorage value never crashes the app
      if (parsed && Array.isArray(parsed.products) && parsed.business) return parsed;
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

interface StoreValue {
  state: AppState;
  addProduct: (name: string, defaultPrice: number) => Product;
  commitLot: (lines: { productId: ID; quantity: number }[]) => void;
  editPrice: (productId: ID, newPrice: number) => void;
  startSession: () => void;
  addItemToSale: (productId: ID) => boolean;
  cancelSale: () => void;
  finalizeSale: () => Receipt | null;
  closeSession: () => void;
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

  function addProduct(name: string, defaultPrice: number): Product {
    const product: Product = {
      id: makeId('prod'),
      name: name.trim(),
      defaultPrice,
      createdAt: Date.now(),
    };
    setState((s) => ({ ...s, products: [...s.products, product] }));
    return product;
  }

  function commitLot(lines: { productId: ID; quantity: number }[]) {
    if (lines.length === 0) return;
    const lotId = makeId('lot');
    const receivedAt = Date.now();
    const entries = lines.map((line) => ({
      id: makeId('entry'),
      lotId,
      productId: line.productId,
      quantity: line.quantity,
    }));
    const units: InventoryUnit[] = [];
    lines.forEach((line) => {
      for (let i = 0; i < line.quantity; i += 1) {
        units.push({
          id: makeId('unit'),
          productId: line.productId,
          lotId,
          status: 'available',
          receivedAt,
        });
      }
    });
    setState((s) => ({
      ...s,
      lots: [...s.lots, { id: lotId, receivedAt }],
      entries: [...s.entries, ...entries],
      units: [...s.units, ...units],
    }));
  }

  function editPrice(productId: ID, newPrice: number) {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === productId ? { ...p, defaultPrice: newPrice } : p)),
    }));
  }

  function startSession() {
    setState((s) => {
      if (s.sessions.some((sess) => sess.status === 'active')) return s; // never ask twice
      // NFC Readiness / Session-start resolution (decision-log.md D23), narrowed by
      // this slice's own scope decision: subscriptionTier is fixed 'free', so
      // nfc is never in registrationMode (D27) — this always resolves silently
      // to 'buttons', the Ready/common-case branch. No §3.6a UI moment is ever
      // reachable in this slice, by construction, not by omission.
      const nfcAvailable = s.business.subscriptionTier === 'paid';
      const operatingMode: SessionOperatingMode =
        nfcAvailable && s.business.defaultSellingMode === 'nfc' ? 'nfc' : 'buttons';
      const session: Session = {
        id: makeId('sess'),
        eventId: null,
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

    setState((s) => {
      let sales = s.sales;
      let sale = sales.find((sa) => sa.sessionId === session.id && sa.status === 'open');
      if (!sale) {
        sale = { id: makeId('sale'), sessionId: session.id, items: [], status: 'open' };
        sales = [...sales, sale];
      }
      // Price resolution (D33): the Product's defaultPrice, resolved at write
      // time — never asked. (No Event Price Override in this slice's scope.)
      const item: SaleItem = {
        id: makeId('item'),
        productId,
        unitId: candidate.id,
        pricePaid: product.defaultPrice,
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

  function resetPrototype() {
    setState(initialState());
  }

  const value: StoreValue = {
    state,
    addProduct,
    commitLot,
    editPrice,
    startSession,
    addItemToSale,
    cancelSale,
    finalizeSale,
    closeSession,
    resetPrototype,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
