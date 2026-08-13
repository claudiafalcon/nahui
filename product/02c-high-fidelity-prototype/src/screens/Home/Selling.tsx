import { useState } from 'react';
import { useStore } from '../../domain/store';
import { activeSession, findProduct, openSaleForSession, sellingGridRows, sessionTotals } from '../../domain/selectors';
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
 * (this slice is always buttons mode — see README.md "Scope decisions").
 * §3.9's grid: most-frequently-sold-first, sold-out tiles dimmed but
 * present, per-Product letter marker.
 */
export function Selling({
  onSaleFinalized,
  onSessionClosed,
  onOpenSettingsPlaceholder,
}: {
  onSaleFinalized: (receipt: Receipt) => void;
  onSessionClosed: (summary: { count: number; revenue: number }) => void;
  onOpenSettingsPlaceholder: () => void;
}) {
  const { state, addItemToSale, cancelSale, finalizeSale, closeSession } = useStore();
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [closeBlockedOpen, setCloseBlockedOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const session = activeSession(state);
  if (!session) return null; // defensive — HomeScreen only mounts this once a Session exists

  const sale = openSaleForSession(state, session.id);
  const items = sale?.items ?? [];
  const totals = sessionTotals(state, session.id);
  const grid = sellingGridRows(state);

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
          revenue={totals.revenue}
          count={totals.count}
          onCloseSession={handleCloseSessionRequest}
          onOpenSettingsPlaceholder={onOpenSettingsPlaceholder}
        />
        <VentaActualTray lines={lines} onCancel={() => setCancelConfirmOpen(true)} />
      </div>

      {saving ? (
        <div className={styles.savingLine}>Cerrando venta…</div>
      ) : (
        <>
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
            {totals.count} {pluralize(totals.count, 'venta', 'ventas')} · {pesos(totals.revenue)}
          </p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setCloseConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                closeSession();
                setCloseConfirmOpen(false);
                onSessionClosed(totals);
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
          <p className={styles.confirmBody}>Termínala o cancélala antes de cerrar la sesión.</p>
          <Button onClick={() => setCloseBlockedOpen(false)}>Entendido</Button>
        </Sheet>
      )}
    </div>
  );
}
