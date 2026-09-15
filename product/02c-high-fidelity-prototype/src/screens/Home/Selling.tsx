import { useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import {
  actingMembership,
  dayNumberForDate,
  eventScopedRemaining,
  findProduct,
  findVenue,
  myActiveSession,
  openSaleForSession,
  productByBarcode,
  sellingGridRows,
  sessionTotals,
  todaySalesSummary,
} from '../../domain/selectors';
import { todayKey } from '../../domain/dates';
import { SessionHeader } from '../../components/SessionHeader/SessionHeader';
import { VentaActualTray } from '../../components/VentaActualTray/VentaActualTray';
import { ProductTile } from '../../components/ProductTile/ProductTile';
import { NFCScanPrompt } from '../../components/NFCScanPrompt/NFCScanPrompt';
import { BarcodeScanner } from '../../components/BarcodeScanner/BarcodeScanner';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import type { Receipt } from '../../domain/store';
import type { MembershipRole } from '../../domain/types';
import { articulos, pesos, pluralize } from '../../domain/format';
import styles from './Selling.module.css';

/**
 * home.md §3.7/§3.8/§3.9/§3.10 — active Session, mode-agnostic shell
 * (SessionHeader + VentaActualTray, §3.7) with an exclusive registration
 * zone that branches on `Session.operatingMode` (§2/§3.6a: resolved once at
 * Session-start, never re-evaluated mid-Session):
 * - `'buttons'` (§3.9) — the scrollable, frequency-ordered ProductTile grid,
 *   unchanged since Slice 1.
 * - `'nfc'` (§3.10, NFC Selling pass, D43) — no product grid at all, not
 *   grayed out, not present: replaced entirely by `NFCScanPrompt` (reused
 *   from the Asignar Tags slice, per the Architecture Gap Analysis's own
 *   instruction), simulating a scan by resolving `addItemToSaleByTag`
 *   against a randomly-picked currently-tagged-and-available unit — the
 *   same "mock the physical mechanism, keep the domain layer honest"
 *   posture `AssignTags.tsx`'s own scan simulation already established, not
 *   a new convention invented here.
 */
export function Selling({
  role,
  onSaleFinalized,
  onSessionClosed,
  onOpenAccountSurface,
  onNavigateToAssignTags,
  onOpenMiActividad,
}: {
  /** home.md §3.15 (Slice 12) — role-scoped header icon/destination. */
  role: MembershipRole;
  onSaleFinalized: (receipt: Receipt) => void;
  onSessionClosed: (summary: { count: number; revenue: number }, sessionId: string) => void;
  onOpenAccountSurface: () => void;
  /** Fix round, `docs/passes/slice-7-nfc-selling.md` (ux-critic Major) —
   * the same `HomeScreen.tsx`-owned hand-off `Idle.tsx`/`EventResume.tsx`
   * already use for §3.6a's "Asignar tags" mention, threaded one level
   * deeper so §3.10's no-match scan fallback can offer it too (see
   * `handleScan`'s own doc comment below). */
  onNavigateToAssignTags: () => void;
  /** home.md §3.7c "Ver mi actividad de hoy" (Slice 12) — opens the full
   * push-in own-activity screen; `HomeScreen.tsx` owns the actual mount
   * swap (§3.7c is a distinct screen state, not a sheet over this one). */
  onOpenMiActividad: () => void;
}) {
  const { state, addItemToSale, addItemToSaleByTag, removeSaleItem, cancelSale, finalizeSale, closeSession } =
    useStore();
  /** Stage 7 Backend Integration, Phase 2 — one idempotency key per
   * logical "add this Product" attempt, tracked per Product so a retry of
   * one tile's failed tap replays its own key while a different tile's own
   * attempt (tapped in between) mints its own, independent one — mirrors
   * `RegisterMerchandise.tsx`'s own `commitIdempotencyKeyRef`, generalized
   * to a per-Product slot since this screen, unlike that one, has many
   * independent "attempts" in flight across a session rather than one
   * single draft. Cleared on success; left in place on any failure so a
   * follow-up tap of the *same* tile retries the *same* attempt rather than
   * risking a second physical unit sold for what she experiences as one
   * tap. `add_item_to_sale` is the single highest-frequency write in the
   * whole product (`company/backlog.md` #1's own `<3s` bar), so this is
   * where that retry discipline matters most.
   *
   * `addItemPendingRef` (Blocker fix, `reviewer` fix round 1) is this ref's
   * necessary companion, not a duplicate of it: the key `Map` alone
   * conflated "retry an attempt that already settled with failure" (where
   * key-reuse is correct) with "a second, distinct tap fired while the
   * first attempt is still in flight" (where reusing the key is wrong — the
   * server's own idempotency mechanism correctly collapses both calls into
   * one write, silently under-recording a Sale a real double-tap meant to
   * register as two units). A tap on a Product with an outstanding add is
   * now ignored outright rather than replaying its still-in-flight key. */
  const addItemKeysRef = useRef<Map<string, string>>(new Map());
  const addItemPendingRef = useRef<Set<string>>(new Set());

  /**
   * Stage 7 Backend Integration, Phase 2b — `addItemToSale` now distinguishes
   * a genuine, terminal `'exhausted'` outcome (this Session's own Event has
   * an open `EventAllocation` for this Product and its committed pool is
   * spent, `home.md` §3.8a's "lost the race" mechanism) from an ordinary
   * `'failed'` one. This function's own external contract stays a plain
   * boolean (every existing caller below already expects one) — `'exhausted'`
   * surfaces via the same ambient `stockHint` mechanism §3.9's own disabled-
   * tile tap already uses, never silently folded into the identical
   * generic-failure `console.error` path a network/platform failure gets.
   *
   * **Known, disclosed scope boundary:** `home.md` §3.8a's full design is an
   * *optimistic* add (the item appears in "Venta actual" instantly, a
   * background sync reconciles after, and only a still-unconfirmed item
   * later gets marked with the terminal ⊗ glyph) — this function still
   * awaits the write before ever touching local state at all, the same
   * synchronous-await shape `commitLot`/`addItemToSaleByTag` already hold.
   * Wiring the full optimistic/⊗ pattern this exact terminal outcome is
   * *meant* to drive (`conflictedItemIds`, above) is a genuine UI-architecture
   * change to this screen's own add-item flow — out of this Stage 7 Backend
   * Integration dispatch's scope (a data-layer/RPC-wiring pass, not a UX
   * rebuild of an already-reviewed, `<3s`-critical screen) — and is not
   * attempted here. `event_allocation_exhausted` is real and observable
   * end-to-end as of this pass; the ambient-hint surfacing below is the
   * appropriately-scoped interim treatment, not the final one.
   */
  async function handleAddItem(productId: string): Promise<boolean> {
    if (addItemPendingRef.current.has(productId)) {
      // This exact tile's own add is still in flight — ignore the tap
      // rather than treat it as either a fresh attempt or a retry. See this
      // file's own top-of-ref doc comment for why silently reusing the
      // in-flight key here would be the actual bug.
      return false;
    }
    let key = addItemKeysRef.current.get(productId);
    if (!key) {
      key = crypto.randomUUID();
      addItemKeysRef.current.set(productId, key);
    }
    addItemPendingRef.current.add(productId);
    try {
      const outcome = await addItemToSale(productId, key);
      if (outcome === 'added') {
        addItemKeysRef.current.delete(productId); // this attempt is over; a genuinely new tap mints its own key
        return true;
      }
      if (outcome === 'exhausted') {
        // Terminal, not retriable (`home.md` §3.8a) — this attempt is over;
        // a later tap on this same tile is a genuinely new attempt, not a
        // retry of one that structurally cannot succeed.
        addItemKeysRef.current.delete(productId);
        const productName = findProduct(state, productId)?.name ?? '';
        showHint(`${productName} ya no está disponible — otro vendedor la vendió.`);
        return false;
      }
      console.error('[Selling] addItemToSale failed for product', productId);
      return false;
    } finally {
      addItemPendingRef.current.delete(productId);
    }
  }

  /** Stage 7 Backend Integration, Phase 2 — the equivalent per-attempt ref
   * for `finalizeSale`'s own single "Finalizar Venta" tap (one slot, not a
   * Map, since only one Sale can ever be open on this Session at a time).
   * Cleared on success; left in place on failure so the same finalize
   * attempt retries with the same key on a follow-up tap. */
  const finalizeIdempotencyKeyRef = useRef<string | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [closeBlockedOpen, setCloseBlockedOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // Live-found gap (2026-09-15, `merchant-user-tester` walkthrough): a
  // genuine `finalize_sale` platform failure previously left this screen
  // completely silent — "Finalizar Venta" tapped repeatedly with zero
  // feedback of any kind. Same error/retry shape every other real write
  // in this codebase already uses (`WritingState`'s own error variant).
  const [finalizeError, setFinalizeError] = useState(false);
  // home.md §3.8a extended / §3.8d-i / §3.8d-ii (Slice 12, `product-
  // decisions.md` Q24/Q25) — the "lost the race" terminal marker. Local,
  // UI-only state (never part of the persisted `Sale`/`SaleItem` domain
  // shape, which has no conflict concept at all) since nothing in this
  // no-backend prototype ever produces a genuine cross-actor race within
  // one synchronous write (see this file's own disclosure below,
  // `handleFinalize`'s doc comment). Real, correctly-rendering machinery,
  // wired to the real `removeSaleItem` write — simply never populated by
  // any live handler in this build, the same disclosed-not-organically-
  // reachable posture this codebase already holds for every other state a
  // genuine backend concurrency mechanism alone could trigger.
  const [conflictedItemIds, setConflictedItemIds] = useState<Set<string>>(new Set());
  const [conflictDetailItemId, setConflictDetailItemId] = useState<string | null>(null);
  const [finalizeBlockedOpen, setFinalizeBlockedOpen] = useState(false);
  // Sold-out tile tap feedback — not in home.md §3.9's original text (which
  // assumed a native `disabled` button needed no separate message, "there's
  // no tap to respond to"). A real device tap on a disabled button produces
  // zero feedback, read by a first-time merchant as the app being broken
  // (`merchant-user-tester` finding, `product/02-ux/
  // experience-review-2026-08-13-eventos.md`, routed as a direct fix).
  // Small gap-fill, disclosed in docs/passes/slice-3-eventos.md — reuses
  // the same ambient, self-dismissing toast mechanism already established
  // in Eventos
  // (`EventsList.tsx`'s `toast`/`ambientMessage`), not a new UI primitive.
  // Fix round, `docs/passes/slice-7-nfc-selling.md` (ux-critic Major) —
  // `stockHint` now optionally carries a tappable link, so the one
  // sibling-less dead end in this file (§3.10's no-match scan fallback, see
  // `handleScan` below) can offer a next step the same way every other
  // "you can't do X right now" moment in this file family already does,
  // without introducing a second hint mechanism.
  const [stockHint, setStockHint] = useState<{ message: string; link?: { label: string; onTap: () => void } } | null>(
    null,
  );
  const stockHintTimeout = useRef<number | undefined>(undefined);

  // home.md §3.9/§3.9a/§3.9a-i/§3.9b/§3.9c (`decision-log.md` D65) —
  // "Escanear código de barras," `buttons`-mode-only, layered on top of the
  // existing tile-tap mechanics rather than a new operating mode. 'active'
  // mounts the shared camera (`BarcodeScanner.tsx`, real `getUserMedia`);
  // 'no-match' is its own terminal dead-end screen (§3.9b) reached only
  // once the camera has already closed. Deliberately does not exist at all
  // in `nfc` mode (§3.10, unchanged) — that surface has its own, different
  // hardware capability.
  const [scannerMode, setScannerMode] = useState<'closed' | 'active' | 'no-match'>('closed');

  const membership = actingMembership(state);
  if (!membership) return null; // defensive — HomeScreen only mounts this once a valid acting Membership resolves
  const session = myActiveSession(state, membership.id);
  if (!session) return null; // defensive — HomeScreen only mounts this once a Session exists

  const sale = openSaleForSession(state, session.id);
  const items = sale?.items ?? [];
  // Session-scoped — still what the close-confirm dialog and
  // `onSessionClosed`/closing-summary report on (Product Owner decision,
  // 2026-08-13): closing a Session always summarizes that specific Session,
  // never the wider context. Left untouched, no longer fed to SessionHeader.
  const totals = sessionTotals(state, session.id);
  // Context-scoped — every finalized Sale today across every Session sharing
  // this Session's `eventId` (`null` for a Quick Session, per
  // `todaySalesSummary`'s own `eventId=null` convention). Feeds
  // SessionHeader's ongoing "Hoy: $X · N ventas" line, distinct from
  // `totals` above on purpose — SessionHeader always renders a value
  // (unlike §3.7b's conditional ambient line elsewhere), so default to
  // zero rather than `todaySalesSummary`'s `null` "no Sales yet" case.
  const contextTotals = todaySalesSummary(state, session.eventId) ?? { total: 0, count: 0 };
  const grid = sellingGridRows(state);

  // home.md §3.7b — Quick Session keeps "Venta rápida" (title stays
  // undefined, SessionHeader's own default); an Event-linked Session
  // resolves "{Venue.displayName} · Día N" instead (events.md §3.14's own
  // header convention), reusing the identical dayNumberForDate computation
  // Eventos itself reads (`decision-log.md` D15) — never re-derived.
  const event = session.eventId ? state.events.find((e) => e.id === session.eventId) : undefined;
  const headerTitle = event
    ? `${findVenue(state, event.venueId)?.displayName ?? ''} · Día ${dayNumberForDate(state, event.id, todayKey())}`
    : undefined;

  // Local, read-only aggregation of the open Sale's own items — grouped by
  // Product for the tag-chip stack (VentaActualTray) and the tile's own
  // "already in this sale" badge. Presentation-only, derived entirely from
  // data the store already exposes (Sale.items); no src/domain/ change.
  const countByProduct = new Map<string, number>();
  for (const item of items) {
    countByProduct.set(item.productId, (countByProduct.get(item.productId) ?? 0) + 1);
  }
  const lines = Array.from(countByProduct.entries()).map(([productId, qty]) => ({
    productId,
    name: findProduct(state, productId)?.name ?? '',
    qty,
  }));
  // Running subtotal of the open Sale — same reduce over SaleItem.pricePaid
  // store.tsx's own finalizeSale already uses for the final total (Fix 3,
  // merchant-user-tester finding, 2026-08-13). Presentation-only, derived
  // entirely from data the store already exposes (Sale.items); no
  // src/domain/ change — same discipline as `lines` above.
  const subtotal = items.reduce((sum, item) => sum + item.pricePaid, 0);

  // home.md §3.8a extended (Slice 12) — which Product chips carry the
  // terminal ⊗ marker, derived from `conflictedItemIds` the same way
  // `countByProduct` derives from `items` above.
  const conflictedProductIds = new Set(
    items.filter((item) => conflictedItemIds.has(item.id)).map((item) => item.productId),
  );
  const conflictDetailItem = conflictDetailItemId ? items.find((item) => item.id === conflictDetailItemId) : undefined;
  const conflictDetailProductName = conflictDetailItem ? findProduct(state, conflictDetailItem.productId)?.name ?? '' : '';

  async function resolveConflict(itemId: string, andRetryFinalize: boolean) {
    await removeSaleItem(itemId);
    setConflictedItemIds((prev) => {
      const next = new Set(prev);
      next.delete(itemId);
      return next;
    });
    setConflictDetailItemId(null);
    if (andRetryFinalize) {
      // §3.8d-i: "Finalizar Venta can proceed immediately after [resolving
      // the one blocking item] — no re-tap of Finalizar Venta needed" — the
      // original attempt is still logically in progress (nothing was ever
      // submitted, unlike §3.8d-ii's own mid-write discovery), so resolving
      // the block re-triggers the same attempt automatically rather than
      // waiting for a second tap.
      setFinalizeBlockedOpen(false);
      window.setTimeout(() => handleFinalize(), 0);
    }
  }

  function showHint(message: string, link?: { label: string; onTap: () => void }) {
    setStockHint({ message, link });
    window.clearTimeout(stockHintTimeout.current);
    // Bug found live by `merchant-user-tester`, reproduced directly in the
    // browser (docs/passes/slice-7-nfc-selling.md): a fixed timeout — even a
    // longer one — races real interaction latency ("notice the message,
    // read it, decide, move a cursor/finger, tap") for the one message in
    // this file that wraps an actual decision+action rather than a passive
    // fact. A link-bearing hint therefore doesn't auto-dismiss at all — same
    // persistent-until-resolved treatment as `NfcSessionStartNote.tsx`'s
    // "Not Ready" variant, which never times out either. It's cleared only
    // by a real event: `handleScan`'s own successful-resolution branch
    // clearing it before it can go stale, or this screen unmounting
    // (Session close, etc.), never by a clock. Every other `stockHint`
    // caller in this file stays passive/glance-only and keeps its 2400ms
    // auto-dismiss unchanged.
    if (link) {
      stockHintTimeout.current = undefined;
      return;
    }
    stockHintTimeout.current = window.setTimeout(() => setStockHint(null), 2400);
  }

  // ux-critic fix round (Slice 12) — a dimmed tile can be gated by two
  // materially different facts (§3.9's own distinction, already drawn
  // correctly by the visible caption): genuinely no Business-wide stock at
  // all, vs. stock that exists but simply isn't allocated to this Event.
  // The original single message ("Necesitas registrar stock de...") is only
  // true of the first case — telling her to register new stock when stock
  // already exists, just elsewhere, sends her to the wrong screen
  // (Inventario, not "Llevar mercancía"). `eventDepletedOnly` mirrors the
  // exact condition the caption itself uses to decide "0 en este evento" vs
  // "0 disponibles". Kept role-neutral (no reference to a specific
  // OWNER-only screen name) since §3.9 renders identically for both
  // roles — a SELLER reading this can't act on "Llevar mercancía" herself
  // either way.
  function handleDisabledTap(productName: string, eventDepletedOnly: boolean) {
    showHint(
      eventDepletedOnly
        ? `${productName} tiene mercancía, pero no está asignada a este evento.`
        : `Necesitas registrar stock de ${productName}.`,
    );
  }

  /**
   * home.md §3.10's own scan simulation (see this file's top doc comment) —
   * picks a random currently-tagged-and-available unit and resolves the
   * scan against it, exactly the way a real NFC read would resolve against
   * whichever physical tag she actually holds near the phone.
   *
   * **Genuine open gap at the wireframe level, `product/02-ux/
   * product-decisions.md` Q2's own remaining task for `ux-designer`:** §3.10
   * as Approved defines only the empty-tray idle prompt, and Q2 leaves the
   * *exact placement* of a no-match resolution affordance on that screen
   * formally undesigned. The *mechanism* itself, though, is already decided
   * by Q2's own text — "the merchant is guided to tag the unit immediately
   * when the situation arises," via "the redirect from Selling into
   * Inventario's Asignar Tags flow," named there as "a sanctioned UI
   * hand-off pattern already used elsewhere" (the same one §3.6a's own Not
   * Ready mention already uses: "Todavía no tienes prendas con tag para
   * hoy… [Asignar tags]," see `NfcSessionStartNote.tsx`'s `not-ready`
   * variant). Fix round, `docs/passes/slice-7-nfc-selling.md` (ux-critic
   * Major): a scan matching zero `available` tagged units (e.g. every
   * tagged unit for a Product already sold this Session, or a customer
   * wants a Product whose only remaining stock happens to be untagged —
   * FIFO substitution doesn't apply in nfc mode) now offers that same
   * hand-off — a tappable "Asignar tags" link inside this file's existing
   * ambient-hint mechanism (`showHint`, already established above for a
   * sold-out buttons-mode tile tap), not a new UI primitive and not a full
   * modal interruption. This closes the "dead end" finding specifically;
   * the exact wireframe placement on §3.10 itself remains Q2's own open
   * item, not invented here.
   */
  async function handleScan() {
    const pool = state.units.filter((u) => u.status === 'available' && u.tagId != null);
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    const noMatchLink = { label: 'Asignar tags', onTap: onNavigateToAssignTags };
    if (!candidate?.tagId) {
      showHint('No hay ninguna prenda con tag lista para escanear.', noMatchLink);
      return;
    }
    const result = await addItemToSaleByTag(candidate.tagId);
    if (!result.ok) {
      // Defensively unreachable in practice — `candidate` above was drawn
      // from the exact live set `addItemToSaleByTag` itself re-derives —
      // but never silently dropped either way (same disclosure as above).
      showHint('No hay ninguna prenda con tag lista para escanear.', noMatchLink);
      return;
    }
    // A real scan resolving successfully is one of the two events allowed
    // to clear a persistent no-match hint (the other being the "Asignar
    // tags" link navigating away) — see `showHint`'s own doc comment. Left
    // in place unlikely to fire mid-Session (the no-match condition rarely
    // self-resolves while scanning continues) but must clear correctly if
    // it does, rather than leaving a stale "no match" message on screen
    // next to a Sale that just gained an item.
    if (stockHint?.link) {
      window.clearTimeout(stockHintTimeout.current);
      setStockHint(null);
    }
  }

  /**
   * home.md §3.9a/§3.9a-i/§3.9b (`decision-log.md` D65) — resolves a
   * decoded barcode exactly the way a tile tap already would, since a scan
   * "identifies which Product, never which physical unit, exactly like a
   * tile tap" — reuses `handleAddItem`'s own shared write path (and its own
   * per-Product idempotency-key tracking), never a second write path.
   * **Deliberately silent on a match — no confirm step, unlike
   * `inventory.md` §3.8c's own confirm-on-scan for the identical underlying
   * fact.** The barcode→Product identity trust decision was already made
   * once, upstream, the first time this barcode was resolved in Inventory
   * (§3.8c) — re-confirming it here, on every Sale-time scan, would add
   * exactly the kind of mid-flow question `company/backlog.md` #1's
   * <3-second bar exists to eliminate (§3.9a's own reasoning, §10).
   */
  async function handleBarcodeResult(code: string) {
    const product = productByBarcode(state, code);
    if (!product) {
      setScannerMode('no-match');
      return;
    }
    setScannerMode('closed');
    const added = await handleAddItem(product.id);
    if (added) return;
    // §3.9a-i — the one branch a scan can reach that a tile tap
    // structurally can't (a dimmed tile already told her "0" before she
    // ever tapped it). Same ambient message, same eventDepletedOnly
    // distinction §3.9's own tile tap already computes.
    const gridRow = grid.find((g) => g.product.id === product.id);
    // Optional chaining, not a bare `session.eventId` — `session` is
    // guaranteed non-null at runtime (this function is only ever invoked
    // after this component's own top-of-body guard already returned early
    // otherwise), but TS's control-flow narrowing of that outer `const`
    // doesn't carry into a separately-declared nested function the way it
    // does for an inline JSX callback (see the other `session.eventId`
    // reads a few lines below, inside `grid.map`'s own inline arrow).
    const eventRemaining = session?.eventId ? eventScopedRemaining(state, session.eventId, product.id) : null;
    const eventDepletedOnly = eventRemaining != null && eventRemaining <= 0 && (gridRow?.available ?? 0) > 0;
    handleDisabledTap(product.name, eventDepletedOnly);
  }

  function handleCloseSessionRequest() {
    if (items.length > 0) {
      setCloseBlockedOpen(true);
    } else {
      setCloseConfirmOpen(true);
    }
  }

  async function handleFinalize() {
    // §3.8d-i — a client-side precondition check, ahead of ever calling the
    // write itself: reached only if a §3.8a lost-race marker is still
    // present (genuinely unreachable through real interaction in this
    // build, see this file's own conflict-state disclosure above).
    if (conflictedItemIds.size > 0) {
      setFinalizeBlockedOpen(true);
      return;
    }
    setSaving(true);
    setFinalizeError(false);
    // `reviewer` Blocker fix precedent (`RegisterMerchandise.tsx`'s own
    // `commitIdempotencyKeyRef`) — generated once per attempt, reused
    // unchanged across a retry.
    if (!finalizeIdempotencyKeyRef.current) {
      finalizeIdempotencyKeyRef.current = crypto.randomUUID();
    }
    // Stage 7 Backend Integration, Phase 2 — finalizeSale is now a real,
    // awaitable Supabase RPC call; `saving`'s own "Cerrando venta…" state
    // covers the real network latency (the previous artificial 260ms delay
    // is retired, matching Phase 1's own `commitLot` wiring).
    const receipt = await finalizeSale(finalizeIdempotencyKeyRef.current);
    setSaving(false);
    if (!receipt) {
      // §3.8d-ii — a lost-race conflict discovered by the write itself
      // would resolve here in the settled architecture (`finalizeSale()`
      // returning `null` for a reason other than "nothing to finalize");
      // `add_item_to_sale`'s own atomic FIFO reservation means this Sale's
      // items were already genuinely reserved at add-time, so a rejection
      // this late is a platform/network failure, not a lost race. Disclosed,
      // not silently glossed over: see this file's own top-of-conflict-state
      // comment. The idempotency key deliberately stays in place — a
      // follow-up "Finalizar Venta" tap retries this exact same attempt.
      console.error('[Selling] finalizeSale failed');
      setFinalizeError(true);
      return;
    }
    finalizeIdempotencyKeyRef.current = null;
    onSaleFinalized(receipt);
  }

  return (
    <div className={styles.wrap}>
      {/* Composition change from the earlier build: SessionHeader and
          VentaActualTray were two flat, disconnected rows directly on the
          canvas. They're still the same two components — session identity,
          running total, always-visible Venta actual, Cancelar — but now
          compose as one continuous paper-toned surface with its own torn
          lower edge, reading as a single "this is where the live
          transaction lives" zone, distinct from the catalog grid below it.
          (SessionHeader's own controls: as of the 2026-08-14 amendment,
          "⚙" and "Cerrar jornada de venta" are two direct header buttons,
          no longer a shared "⋯" → sheet — see SessionHeader.tsx.) */}
      <div
        className={`${styles.transactionPanel} grain tearBottom ${items.length > 0 ? styles.transactionPanelActive : ''}`}
      >
        <SessionHeader
          revenue={contextTotals.total}
          count={contextTotals.count}
          title={headerTitle}
          headerIcon={role === 'OWNER' ? '⚙' : '⊚'}
          onCloseSession={handleCloseSessionRequest}
          onOpenAccountSurface={onOpenAccountSurface}
          onOpenMiActividad={onOpenMiActividad}
        />
        <VentaActualTray
          lines={lines}
          subtotal={subtotal}
          onCancel={() => setCancelConfirmOpen(true)}
          conflictedProductIds={conflictedProductIds}
          onTapConflictedChip={(productId) => {
            const item = items.find((i) => conflictedItemIds.has(i.id) && i.productId === productId);
            if (item) setConflictDetailItemId(item.id);
          }}
        />
      </div>

      {saving ? (
        <div className={styles.savingLine}>Cerrando venta…</div>
      ) : finalizeError ? (
        <div className={styles.savingLine}>
          <p>No pudimos finalizar tu venta. Intenta de nuevo.</p>
          <Button onClick={() => void handleFinalize()}>Reintentar</Button>
        </div>
      ) : (
        <>
          {stockHint && (
            <p className={styles.stockHint}>
              {stockHint.message}
              {stockHint.link && (
                <>
                  {' '}
                  <button className={styles.stockHintLink} onClick={stockHint.link.onTap}>
                    {stockHint.link.label}
                  </button>
                </>
              )}
            </p>
          )}

          {session.operatingMode === 'nfc' ? (
            <div className={styles.nfcSurface}>
              <NFCScanPrompt
                onTap={handleScan}
                ariaLabel="Acerca el tag del producto"
                label={
                  <>
                    Acerca el tag del
                    <br />
                    producto
                  </>
                }
              />
            </div>
          ) : (
            <div className={styles.gridScroll}>
              <button className={styles.scanBtn} onClick={() => setScannerMode('active')}>
                Escanear código de barras
              </button>
              {grid.length === 0 ? (
                <p className={styles.emptyGrid}>Todavía no tienes productos registrados.</p>
              ) : (
                <div className={styles.grid}>
                  {grid.map(({ product, available }) => {
                    const eventRemaining = session.eventId
                      ? eventScopedRemaining(state, session.eventId, product.id)
                      : null;
                    // Same distinction §3.9's own caption already draws:
                    // exhausted at the Event level while Business-wide stock
                    // still genuinely exists elsewhere.
                    const eventDepletedOnly = eventRemaining != null && eventRemaining <= 0 && available > 0;
                    return (
                      <ProductTile
                        key={product.id}
                        name={product.name}
                        photo={product.photo}
                        available={available}
                        eventRemaining={eventRemaining}
                        countInSale={countByProduct.get(product.id)}
                        onTap={() => void handleAddItem(product.id)}
                        onDisabledTap={() => handleDisabledTap(product.name, eventDepletedOnly)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {items.length > 0 && (
            <div className={`${styles.footer} stitchTop`}>
              <Button onClick={handleFinalize}>
                Finalizar Venta <span className={styles.footerCount}>· {articulos(items.length)}</span>
              </Button>
            </div>
          )}
        </>
      )}

      {/* home.md §3.9's own cross-reference: "reuses the same camera-
          viewfinder shape inventory.md §3.8b already defines... except the
          header." Mounted as a sibling of the header/tray/grid above —
          never nested inside the buttons-mode branch — so the grid stays
          mounted (and, per §3.9c, visibly untouched) underneath it the
          entire time a permission-denial resolves near-instantly. */}
      {scannerMode === 'active' && (
        <BarcodeScanner
          backLabel="Escanear código"
          fallbackLabel="Usar los botones"
          onBack={() => setScannerMode('closed')}
          onResult={handleBarcodeResult}
          onPermissionDenied={() => {
            setScannerMode('closed');
            // §3.9c, first variant — ambient, self-dismissing, reuses the
            // identical mechanism already established for the sold-out-
            // tile-tap message (`showHint`, no link — auto-dismiss stays
            // the default for a passive, glance-only fact).
            showHint('No pudimos usar la cámara. Usa los botones para agregar el producto.');
          }}
        />
      )}

      {/* home.md §3.9b — a genuine dead end toward Inventario, reached only
          once the camera has already closed (never shown alongside it). */}
      {scannerMode === 'no-match' && (
        <div className={styles.scanDeadEnd}>
          <div className={styles.scanDeadEndTopbar}>
            <button className={styles.scanDeadEndBack} onClick={() => setScannerMode('closed')}>
              ← Escanear código
            </button>
          </div>
          <div className={styles.scanDeadEndBody}>
            <p className={styles.scanDeadEndText}>
              No encontramos este código.
              <br />
              Revísalo en Inventario.
            </p>
            <Button onClick={() => setScannerMode('closed')}>Entendido</Button>
          </div>
        </div>
      )}

      {cancelConfirmOpen && (
        <Sheet onDismiss={() => setCancelConfirmOpen(false)}>
          <p className={styles.confirmTitle}>
            ¿Cancelar {pluralize(items.length, 'este', 'estos')} {articulos(items.length)}?
          </p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setCancelConfirmOpen(false)}>
              No
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                // Important 3 fix (`reviewer` fix round 1) — captures the
                // specific open Sale's id at the moment "Sí, cancelar" is
                // actually tapped, rather than letting cancel_sale resolve
                // "whatever is open right now" server-side. `sale` is
                // guaranteed defined here in practice (this sheet is only
                // reachable from VentaActualTray's "Cancelar," itself only
                // shown once `items.length > 0`), but the guard stays
                // explicit rather than asserted.
                if (!sale) return;
                await cancelSale(sale.id);
                setCancelConfirmOpen(false);
              }}
            >
              Sí, cancelar
            </Button>
          </div>
        </Sheet>
      )}

      {closeConfirmOpen && (
        <Sheet onDismiss={() => setCloseConfirmOpen(false)}>
          <p className={styles.confirmTitle}>¿Ya terminaste por hoy?</p>
          <p className={styles.confirmBody}>
            Esta sesión: {totals.count} {pluralize(totals.count, 'venta', 'ventas')} · {pesos(totals.revenue)}
          </p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setCloseConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={async () => {
                // Important 3 fix (`reviewer` fix round 1) — same
                // explicit-target capture as "Sí, cancelar" above.
                // `session` is guaranteed non-null (this component's own
                // top-of-body guard already returned early otherwise).
                await closeSession(session.id);
                setCloseConfirmOpen(false);
                onSessionClosed(totals, session.id);
              }}
            >
              Sí, cerrar
            </Button>
          </div>
        </Sheet>
      )}

      {closeBlockedOpen && (
        <Sheet onDismiss={() => setCloseBlockedOpen(false)}>
          <p className={styles.confirmTitle}>Tienes una venta sin terminar ({articulos(items.length)}).</p>
          <p className={styles.confirmBody}>Termínala o cancélala antes de cerrar la jornada de venta.</p>
          <Button onClick={() => setCloseBlockedOpen(false)}>Entendido</Button>
        </Sheet>
      )}

      {/* home.md §3.8a extended — the lost-race detail sheet, reached by
          tapping a conflicted chip. "Quitar de la venta" is a single tap,
          no secondary Sí/No — acknowledging an already-true fact, not a
          decision that risks losing good data (§3.8a's own reasoning).
          Genuinely unreachable through real interaction in this build (see
          this file's own top-of-conflict-state disclosure). */}
      {conflictDetailItem && (
        <Sheet onDismiss={() => setConflictDetailItemId(null)}>
          <p className={styles.confirmTitle}>{conflictDetailProductName} ya no está disponible.</p>
          <p className={styles.confirmBody}>Otro vendedor la vendió.</p>
          <Button variant="destructive" onClick={() => resolveConflict(conflictDetailItem.id, false)}>
            Quitar de la venta
          </Button>
        </Sheet>
      )}

      {/* home.md §3.8d-i — Finalizar Venta attempted while a lost-race
          marker is still present; a precondition, not a save failure.
          Genuinely unreachable through real interaction in this build (see
          this file's own top-of-conflict-state disclosure). */}
      {finalizeBlockedOpen &&
        (() => {
          const firstConflictedId = Array.from(conflictedItemIds)[0];
          const firstConflictedItem = items.find((i) => i.id === firstConflictedId);
          const productName = firstConflictedItem ? findProduct(state, firstConflictedItem.productId)?.name ?? '' : '';
          return (
            <Sheet onDismiss={() => setFinalizeBlockedOpen(false)}>
              <p className={styles.confirmBody}>
                {productName || 'Un producto'} ya no está disponible – tienes que quitarla antes de terminar la venta.
              </p>
              <Button
                variant="destructive"
                onClick={() => {
                  if (firstConflictedId) resolveConflict(firstConflictedId, true);
                }}
              >
                Quitar de la venta
              </Button>
            </Sheet>
          );
        })()}
    </div>
  );
}
