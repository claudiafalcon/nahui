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
  sellingGridRows,
  sessionTotals,
  todaySalesSummary,
} from '../../domain/selectors';
import { todayKey } from '../../domain/dates';
import { SessionHeader } from '../../components/SessionHeader/SessionHeader';
import { VentaActualTray } from '../../components/VentaActualTray/VentaActualTray';
import { ProductTile } from '../../components/ProductTile/ProductTile';
import { NFCScanPrompt } from '../../components/NFCScanPrompt/NFCScanPrompt';
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
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [closeBlockedOpen, setCloseBlockedOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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

  function resolveConflict(itemId: string, andRetryFinalize: boolean) {
    removeSaleItem(itemId);
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
  function handleScan() {
    const pool = state.units.filter((u) => u.status === 'available' && u.tagId != null);
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    const noMatchLink = { label: 'Asignar tags', onTap: onNavigateToAssignTags };
    if (!candidate?.tagId) {
      showHint('No hay ninguna prenda con tag lista para escanear.', noMatchLink);
      return;
    }
    const result = addItemToSaleByTag(candidate.tagId);
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

  function handleCloseSessionRequest() {
    if (items.length > 0) {
      setCloseBlockedOpen(true);
    } else {
      setCloseConfirmOpen(true);
    }
  }

  function handleFinalize() {
    // §3.8d-i — a client-side precondition check, ahead of ever calling the
    // write itself: reached only if a §3.8a lost-race marker is still
    // present (genuinely unreachable through real interaction in this
    // build, see this file's own conflict-state disclosure above).
    if (conflictedItemIds.size > 0) {
      setFinalizeBlockedOpen(true);
      return;
    }
    setSaving(true);
    // Near-instant save convention (home.md §3.8c) — a brief, deliberate
    // beat so the state transition reads as real, never an invisible jump.
    window.setTimeout(() => {
      const receipt = finalizeSale();
      setSaving(false);
      // §3.8d-ii — a lost-race conflict discovered by the write itself
      // would resolve here (`finalizeSale()` returning `null` for a reason
      // other than "nothing to finalize"); this mock write cannot actually
      // distinguish that case from any other failure, and — since this
      // build's own compare-and-swap runs at add-time, not at finalize —
      // never has a conflict left to discover this late in the first
      // place. Disclosed, not silently glossed over: see this file's own
      // top-of-conflict-state comment.
      if (receipt) onSaleFinalized(receipt);
    }, 260);
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
                        onTap={() => addItemToSale(product.id)}
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
              onClick={() => {
                cancelSale();
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
              onClick={() => {
                closeSession();
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
