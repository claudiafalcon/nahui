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
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import type { Receipt } from '../../domain/store';
import { articulos, pesos, pluralize } from '../../domain/format';
import styles from './Selling.module.css';

/**
 * home.md §3.7/§3.8/§3.9 — active Session, buttons-mode selling surface
 * (this slice is always buttons mode — see
 * docs/passes/slice-1-home-inventario.md's "Scope decisions" section).
 * §3.9's grid: most-frequently-sold-first, sold-out tiles dimmed but
 * present, per-Product letter marker.
 */
export function Selling({
  onSaleFinalized,
  onSessionClosed,
  onOpenSettings,
}: {
  onSaleFinalized: (receipt: Receipt) => void;
  onSessionClosed: (summary: { count: number; revenue: number }, sessionId: string) => void;
  onOpenSettings: () => void;
}) {
  const { state, addItemToSale, cancelSale, finalizeSale, closeSession } = useStore();
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
  const [stockHint, setStockHint] = useState<string | null>(null);
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

  function handleDisabledTap(productName: string) {
    setStockHint(`Necesitas registrar stock de ${productName}.`);
    window.clearTimeout(stockHintTimeout.current);
    stockHintTimeout.current = window.setTimeout(() => setStockHint(null), 2400);
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
          {stockHint && <p className={styles.stockHint}>{stockHint}</p>}

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
