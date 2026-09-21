/**
 * Stage 7 Backend Integration — Read-side data hydration
 * (`context/stage-7-backend-integration.md`'s "Read-side data hydration
 * design", `architect`, 2026-09-14).
 *
 * Pure row → `AppState`-entity mapping, one function per table, factored out
 * of `store.tsx`'s own `hydrateFromBackend` so that function stays a short,
 * readable orchestration (issue the 17 queries, check the write-generation
 * guard, fold the mapped rows into `AppState`) rather than a ~300-line
 * mapping block inlined at the call site. No orchestration, no Supabase
 * client, no `setState` — every function here is a plain, testable
 * `(row) => Entity` transform.
 *
 * Deliberately excludes `users`/`authIdentities`/`invitations` — not part of
 * this hydration cycle at all (`stage-7-backend-integration.md`'s own table
 * list). `Loyalty-claim`'s `customers`/`claims` tables are never queried
 * anywhere in this codebase — the hard guardrail this whole design starts
 * from.
 *
 * Postgres `numeric` columns come back from PostgREST as strings (avoiding
 * float-precision loss over the wire) — every price/cost field is `Number()`
 * -coerced here. `integer` columns (quantities) come back as real numbers
 * already. `timestamptz` columns come back as ISO strings — coerced to the
 * epoch-ms numbers `AppState`'s own types already use everywhere else
 * (`Date.parse`/`new Date(...).getTime()`, matching every write-mirror site
 * in `store.tsx` that already does the identical conversion on an RPC's own
 * returned timestamp). `date` columns (`start_date`/`end_date`,
 * `pending_subscription_tier_effective_date`) come back already in the
 * `'YYYY-MM-DD'` shape `AppState`'s own string fields expect — passed
 * through unchanged.
 */

import type {
  AllocationMovement,
  Business,
  BusinessMembership,
  Event,
  EventAllocation,
  EventAllocationUnit,
  EventAssignment,
  EventType,
  ID,
  InventoryEntry,
  InventoryUnit,
  InventoryUnitStatus,
  Lot,
  PriceOverride,
  Product,
  Sale,
  SaleItem,
  Session,
  Venue,
} from './types';

function toMs(iso: string): number {
  return new Date(iso).getTime();
}

export function mapBusinessRow(row: Record<string, unknown>): Business {
  return {
    id: row.id as ID,
    name: (row.name as string) ?? '',
    logo: (row.logo as string | null) ?? undefined,
    description: (row.description as string | null) ?? undefined,
    subscriptionTier: row.subscription_tier as Business['subscriptionTier'],
    // `decision-log.md` D79 — `row.default_selling_mode` is left unread here
    // on purpose. The `businesses.default_selling_mode` column stays in the
    // schema as inert historical data (D25, never deleted); this mapper
    // simply no longer surfaces it onto the client `Business` shape, since
    // `Business.defaultSellingMode` itself is retired.
    onboardingAcknowledged: row.onboarding_acknowledged as boolean,
    pendingSubscriptionTier: (row.pending_subscription_tier as Business['pendingSubscriptionTier']) ?? null,
    pendingSubscriptionTierEffectiveDate: (row.pending_subscription_tier_effective_date as string | null) ?? null,
    pendingSubscriptionTierAcknowledged: row.pending_subscription_tier_acknowledged as boolean,
    nfcAvailabilityNudgeShown: row.nfc_availability_nudge_shown as boolean,
    // `decision-log.md` D71 — `not null default false` server-side
    // (`20260917000000_nfc_per_product.sql`), so every real row already
    // carries a real boolean; `?? false` is a purely defensive fallback.
    nfcPerProductEnabled: (row.nfc_per_product_enabled as boolean) ?? false,
  };
}

export function mapMembershipRow(row: Record<string, unknown>): BusinessMembership {
  return {
    id: row.id as ID,
    userId: row.user_id as ID,
    businessId: row.business_id as ID,
    role: row.role as BusinessMembership['role'],
    status: row.status as BusinessMembership['status'],
    revokedAt: row.revoked_at ? toMs(row.revoked_at as string) : null,
    createdAt: toMs(row.created_at as string),
  };
}

export function mapProductRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as ID,
    name: row.name as string,
    defaultPrice: Number(row.default_price),
    photo: (row.photo as string | null) ?? undefined,
    barcode: (row.barcode as string | null) ?? undefined,
    // `decision-log.md` D71 — `not null default false` server-side, same
    // defensive-fallback posture as `Business.nfcPerProductEnabled` above.
    nfcTaggingEnabled: (row.nfc_tagging_enabled as boolean) ?? false,
    createdAt: toMs(row.created_at as string),
  };
}

export function mapLotRow(row: Record<string, unknown>): Lot {
  return { id: row.id as ID, receivedAt: toMs(row.received_at as string) };
}

export function mapEntryRow(row: Record<string, unknown>): InventoryEntry {
  return {
    id: row.id as ID,
    lotId: row.lot_id as ID,
    productId: row.product_id as ID,
    quantity: row.quantity as number,
  };
}

/** `tagId` is folded in separately by the caller (a `nfc_tags` join-by-`unit_id`
 * — `nfc_tags` is its own table server-side, Phase 1's deliberate refinement
 * from this prototype's earlier inlined scalar, see `types.ts`'s own
 * `InventoryUnit.tagId` doc comment) — this function alone never has that
 * fact available.
 *
 * **`decision-log.md` D83 / RFC 0018 — that join is over *open* attachments
 * only, and the qualifier is load-bearing.** `nfc_tags` is no longer one row
 * per unit: it is an attachment record with a validity window
 * (`assigned_at -> detached_at`), so one unit may carry closed history plus
 * at most one open row (`nfc_tags_unit_open_unique_idx`). The caller
 * (`store.tsx`'s `hydrateFromBackend`) filters its read with
 * `.is('detached_at', null)` precisely so that the `tagId` this shape is
 * completed with keeps meaning "the identifier of this unit's *open*
 * attachment" — the semantics every consumer (D80/D81/D82's selectors,
 * `pendingTagUnits`, the scan-resolution lookups) already assumes. Folding a
 * closed row in here would make a genuinely-untagged unit read as tagged.
 *
 * A `sold` unit legitimately keeps an *open* attachment (D10's claim
 * resolution reads it; `finalize_sale` never detaches), so a non-null
 * `tagId` says "not superseded," never "on hand" — on-hand is `status`. */
export function mapUnitRow(row: Record<string, unknown>): Omit<InventoryUnit, 'tagId'> {
  return {
    id: row.id as ID,
    productId: row.product_id as ID,
    lotId: row.lot_id as ID,
    status: row.status as InventoryUnitStatus,
    receivedAt: toMs(row.received_at as string),
  };
}

export function mapVenueRow(row: Record<string, unknown>): Venue {
  return { id: row.id as ID, displayName: row.display_name as string };
}

export function mapEventRow(row: Record<string, unknown>): Event {
  return {
    id: row.id as ID,
    venueId: row.venue_id as ID,
    type: row.type as EventType,
    startDate: row.start_date as string,
    endDate: row.end_date as string,
    bazaarCost: Number(row.bazaar_cost),
    cancelledAt: row.cancelled_at ? toMs(row.cancelled_at as string) : null,
  };
}

export function mapPriceOverrideRow(row: Record<string, unknown>): PriceOverride {
  return {
    eventId: row.event_id as ID,
    productId: row.product_id as ID,
    overridePrice: Number(row.override_price),
  };
}

export function mapSessionRow(row: Record<string, unknown>): Session {
  return {
    id: row.id as ID,
    eventId: (row.event_id as ID | null) ?? null,
    // `decision-log.md` D79 — `row.operating_mode` is left unread here on
    // purpose. The `sessions.operating_mode` column stays in the schema as
    // inert historical data (D25, never deleted); `Session.operatingMode`
    // itself is retired from the client type entirely.
    status: row.status as Session['status'],
    openedAt: toMs(row.opened_at as string),
    closedAt: row.closed_at ? toMs(row.closed_at as string) : undefined,
    openedByMembershipId: row.opened_by_membership_id as ID,
  };
}

/** `items` is folded in separately by the caller (grouped `sale_items` rows,
 * `mapSaleItemRow` below, keyed by `sale_id`) — this function alone never has
 * that fact available, the identical two-step shape `mapUnitRow`/`tagId`
 * above already uses. */
export function mapSaleRow(row: Record<string, unknown>): Omit<Sale, 'items'> {
  return {
    id: row.id as ID,
    sessionId: row.session_id as ID,
    status: row.status as Sale['status'],
    finalizedAt: row.finalized_at ? toMs(row.finalized_at as string) : undefined,
    performedByMembershipId: row.performed_by_membership_id as ID,
  };
}

/** Includes `sale_id` (unlike every other mapper here, `SaleItem` itself
 * carries no `saleId` field — `Sale.items[]` is the ownership edge) purely so
 * the caller can group these rows by their parent Sale; never spread onto
 * the returned `SaleItem` object itself. */
export function mapSaleItemRow(row: Record<string, unknown>): SaleItem & { saleId: ID } {
  return {
    id: row.id as ID,
    saleId: row.sale_id as ID,
    productId: row.product_id as ID,
    unitId: row.unit_id as ID,
    pricePaid: Number(row.price_paid),
    eventAllocationId: (row.event_allocation_id as ID | null) ?? undefined,
  };
}

export function mapEventAllocationRow(row: Record<string, unknown>): EventAllocation {
  return {
    id: row.id as ID,
    eventId: row.event_id as ID,
    productId: row.product_id as ID,
    quantityPlanned: row.quantity_planned as number,
    quantityAllocated: row.quantity_allocated as number,
    status: row.status as EventAllocation['status'],
    createdAt: toMs(row.created_at as string),
  };
}

export function mapEventAllocationUnitRow(row: Record<string, unknown>): EventAllocationUnit {
  return {
    id: row.id as ID,
    eventAllocationId: row.event_allocation_id as ID,
    unitId: row.unit_id as ID,
    unitSource: row.unit_source as EventAllocationUnit['unitSource'],
    committedAt: toMs(row.committed_at as string),
  };
}

export function mapAllocationMovementRow(row: Record<string, unknown>): AllocationMovement {
  return {
    id: row.id as ID,
    eventAllocationId: row.event_allocation_id as ID,
    type: row.type as AllocationMovement['type'],
    unitIds: (row.unit_ids as ID[]) ?? [],
    quantityDelta: row.quantity_delta as number,
    unitSource: row.unit_source as AllocationMovement['unitSource'],
    quantityExpected: (row.quantity_expected as number | null) ?? null,
    counterpartEventAllocationId: (row.counterpart_event_allocation_id as ID | null) ?? null,
    createdAt: toMs(row.created_at as string),
  };
}

export function mapEventAssignmentRow(row: Record<string, unknown>): EventAssignment {
  return {
    id: row.id as ID,
    businessId: row.business_id as ID,
    eventId: row.event_id as ID,
    membershipId: row.membership_id as ID,
    createdAt: toMs(row.created_at as string),
  };
}
