import { useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import {
  activeSession,
  dayNumberForDate,
  findProduct,
  findVenue,
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
  onSaleFinalized,
  onSessionClosed,
  onOpenSettings,
  onNavigateToAssignTags,
}: {
  onSaleFinalized: (receipt: Receipt) => void;
  onSessionClosed: (summary: { count: number; revenue: number }, sessionId: string) => void;
  onOpenSettings: () => void;
  /** Fix round, `docs/passes/slice-7-nfc-selling.md` (ux-critic Major) —
   * the same `HomeScreen.tsx`-owned hand-off `Idle.tsx`/`EventResume.tsx`
   * already use for §3.6a's "Asignar tags" mention, threaded one level
   * deeper so §3.10's no-match scan fallback can offer it too (see
   * `handleScan`'s own doc comment below). */
  onNavigateToAssignTags: () => void;
}) {
  const { state, addItemToSale, addItemToSaleByTag, cancelSale, finalizeSale, closeSession } = useStore();
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [closeBlockedOpen, setCloseBlockedOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const session = activeSession(state);
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

  function handleDisabledTap(productName: string) {
    showHint(`Necesitas registrar stock de ${productName}.`);
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
    setSaving(true);
    // Near-instant save convention (home.md §3.8c) — a brief, deliberate
    // beat so the state transition reads as real, never an invisible jump.
    window.setTimeout(() => {
      const receipt = finalizeSale();
      setSaving(false);
      if (receipt) onSaleFinalized(receipt);
    }, 260);
  }

  return (
    <div className={styles.wrap}>
      {/* Composition change from the earlier build: SessionHeader and
          VentaActualTray were two flat, disconnected rows directly on the
          canvas. They're still the same two components, unchanged
          behavior/content — session identity, running total, "⋯" controls,
          always-visible Venta actual, Cancelar — but now compose as one
          continuous paper-toned surface with its own torn lower edge,
          reading as a single "this is where the live transaction lives"
          zone, distinct from the catalog grid below it. */}
      <div
        className={`${styles.transactionPanel} grain tearBottom ${items.length > 0 ? styles.transactionPanelActive : ''}`}
      >
        <SessionHeader
          revenue={contextTotals.total}
          count={contextTotals.count}
          title={headerTitle}
          onCloseSession={handleCloseSessionRequest}
          onOpenSettings={onOpenSettings}
        />
        <VentaActualTray lines={lines} subtotal={subtotal} onCancel={() => setCancelConfirmOpen(true)} />
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
                  {grid.map(({ product, available }) => (
                    <ProductTile
                      key={product.id}
                      name={product.name}
                      available={available}
                      countInSale={countByProduct.get(product.id)}
                      onTap={() => addItemToSale(product.id)}
                      onDisabledTap={() => handleDisabledTap(product.name)}
                    />
                  ))}
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
    </div>
  );
}
