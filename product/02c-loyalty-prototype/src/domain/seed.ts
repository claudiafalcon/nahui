import { makeId } from './id';
import type { Business, Claim, Customer, Sale, SaleItem, StoreState } from './types';

/**
 * Seed fixtures covering the Gap Analysis §1 branch list: a malformed
 * token (unrecognized — needs no fixture of its own), an expired token, a
 * fully-already-claimed token, a valid token for a brand-new email, and a
 * valid token for an email that already matches a seeded Customer at that
 * Business. "Luna Mercado" reuses the same fictional demo-business name
 * convention the Merchant prototype's own seed data already established.
 */

const business: Business = {
  id: 'biz-luna',
  name: 'Luna Mercado',
  loyaltyRewardThreshold: 10,
};

// --- demo-nueva: valid token, brand-new email branch (§2 step 4 → §3.6 → §3.10) ---
const saleNueva: Sale = { id: 'sale-nueva', businessId: business.id, claimToken: 'demo-nueva' };
const saleItemsNueva: SaleItem[] = [
  { id: 'item-nueva-1', saleId: saleNueva.id, businessId: business.id, pricePaid: 250 },
  { id: 'item-nueva-2', saleId: saleNueva.id, businessId: business.id, pricePaid: 180 },
];

// --- demo-reclamada: valid token, every SaleItem already claimed (§2 step 2 → §3.4) ---
const saleReclamada: Sale = { id: 'sale-reclamada', businessId: business.id, claimToken: 'demo-reclamada' };
const saleItemsReclamada: SaleItem[] = [
  { id: 'item-reclamada-1', saleId: saleReclamada.id, businessId: business.id, pricePaid: 320 },
];
const customerMario: Customer = {
  id: 'cust-mario',
  businessId: business.id,
  email: 'mario.perez@example.com',
  ageRange: '25-34',
  gender: 'Hombre',
  purchaseCount: 1,
  lifetimeSpend: 320,
  currentCycleProgress: 1,
  completedCyclesCount: 0,
};
const claimReclamada: Claim = {
  id: 'claim-reclamada-1',
  businessId: business.id,
  customerId: customerMario.id,
  saleItemId: saleItemsReclamada[0].id,
  claimedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
};

// --- demo-recurrente: valid token, still-unclaimed, but this Business already
// knows carla.ruiz@example.com (§2 step 4 → existing branch → §3.11).
// Typing any other email on this same token still resolves to the
// brand-new branch (§3.6 → §3.10) — same dedup key, (businessId, email). ---
const saleRecurrente: Sale = { id: 'sale-recurrente', businessId: business.id, claimToken: 'demo-recurrente' };
const saleItemsRecurrente: SaleItem[] = [
  { id: 'item-recurrente-1', saleId: saleRecurrente.id, businessId: business.id, pricePaid: 410 },
  { id: 'item-recurrente-2', saleId: saleRecurrente.id, businessId: business.id, pricePaid: 150 },
];
const customerCarla: Customer = {
  id: 'cust-carla',
  businessId: business.id,
  email: 'carla.ruiz@example.com',
  ageRange: '35-44',
  gender: 'Mujer',
  purchaseCount: 3,
  lifetimeSpend: 970,
  currentCycleProgress: 4,
  completedCyclesCount: 0,
};

// --- demo-expirado: recognized but past its validity window — shares 3.3's
// screen/copy with the malformed case, §2 step 1. ---
const saleExpirado: Sale = {
  id: 'sale-expirado',
  businessId: business.id,
  claimToken: 'demo-expirado',
  expired: true,
};
const saleItemsExpirado: SaleItem[] = [
  { id: 'item-expirado-1', saleId: saleExpirado.id, businessId: business.id, pricePaid: 200 },
];

export function createSeedState(): StoreState {
  return {
    businesses: [business],
    sales: [saleNueva, saleReclamada, saleRecurrente, saleExpirado],
    saleItems: [...saleItemsNueva, ...saleItemsReclamada, ...saleItemsRecurrente, ...saleItemsExpirado],
    customers: [customerMario, customerCarla],
    claims: [claimReclamada],
  };
}

/** Referenced by `DemoIndex` (this build's own dev-only entry screen — not
 * one of `customer-loyalty-registration.md` §5's 14 states; see this
 * folder's build report) so a click-through never requires hand-typing a
 * URL. A malformed token isn't listed here since it needs no fixture — any
 * string this list doesn't contain already resolves to `invalid`. */
export const demoTokens = [
  {
    token: 'demo-nueva',
    label: 'Correo nuevo',
    description: 'Token válido, sin correo conocido todavía → pantalla opcional de edad/género → registro exitoso.',
  },
  {
    token: 'demo-recurrente',
    label: 'Cliente que regresa',
    description: `Token válido. Escribe ${customerCarla.email} para la confirmación ligera de cliente que regresa, o cualquier otro correo para la ruta de correo nuevo.`,
  },
  {
    token: 'demo-reclamada',
    label: 'Compra ya registrada',
    description: 'Token válido pero ya completamente reclamado — no pide correo.',
  },
  {
    token: 'demo-expirado',
    label: 'Enlace no disponible',
    description: 'Token reconocido pero vencido — misma pantalla que un token no reconocido.',
  },
  {
    token: 'no-existe',
    label: 'Token no reconocido',
    description: 'Cualquier valor que no esté en esta lista cae aquí — enlace no disponible.',
  },
] as const;

export function makeCustomerId(): string {
  return makeId('cust');
}

export function makeClaimId(): string {
  return makeId('claim');
}
