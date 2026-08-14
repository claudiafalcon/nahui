import { useMemo, useState } from 'react';
import { useStore } from '../../domain/store';
import { priceOverrideFor } from '../../domain/selectors';
import { TagStub } from '../../components/TagStub/TagStub';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import type { Product } from '../../domain/types';
import styles from './AdjustPrices.module.css';

/**
 * events.md §3.19/§3.20 (D33) — Ajustar precios. Reached only while the
 * Event is still `scheduled` (§3.11) — an Event-*planning* capability, never
 * reachable once active. One row per Catalog Product she's ever registered
 * (not only Products currently in stock), pre-filled from
 * `Product.defaultPrice`; every row is optional to touch.
 */
export function AdjustPrices({
  eventId,
  venueName,
  onBack,
}: {
  eventId: string;
  venueName: string;
  onBack: () => void;
}) {
  const { state, setPriceOverride } = useStore();
  const [editing, setEditing] = useState<Product | null>(null);
  const [draftPrice, setDraftPrice] = useState('');

  const draftPriceValue = useMemo(() => parseFloat(draftPrice), [draftPrice]);
  const draftPriceValid = draftPrice.trim().length > 0 && !Number.isNaN(draftPriceValue) && draftPriceValue > 0;

  if (state.products.length === 0) {
    return (
      <>
        <div className={styles.topbar}>
          <button className={styles.back} onClick={onBack}>
            ← {venueName}
          </button>
        </div>
        <h1 className={styles.heading}>Precios para este evento</h1>
        <p className={styles.empty}>
          Todavía no registraste ningún producto. Registra mercancía en Inventario para poder ajustar precios
          aquí.
        </p>
      </>
    );
  }

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← {venueName}
        </button>
      </div>
      <h1 className={styles.heading}>Precios para este evento</h1>
      <p className={styles.intro}>Cada producto usa su precio normal salvo que lo ajustes aquí.</p>

      <div className={styles.list}>
        {state.products.map((product) => {
          const override = priceOverrideFor(state, eventId, product.id);
          const price = override ?? product.defaultPrice;
          return (
            <div key={product.id} className={`${styles.row} stitchBottom`}>
              <TagStub name={product.name} size={40} />
              <span className={styles.name}>{product.name}</span>
              <button
                className={`${styles.price} moneyTag`}
                onClick={() => {
                  setEditing(product);
                  setDraftPrice(String(price));
                }}
              >
                ${price.toLocaleString('es-MX')}
              </button>
            </div>
          );
        })}
      </div>

      {editing && (
        <Sheet onDismiss={() => setEditing(null)}>
          <p className={styles.sheetTitle}>{editing.name}</p>
          <p className={styles.normalPrice}>Precio normal: ${editing.defaultPrice.toLocaleString('es-MX')}</p>
          <p className={styles.overrideLabel}>Precio para este evento</p>
          <div className={styles.priceField}>
            <span className={styles.pesoSign}>$</span>
            <input
              className={styles.priceInput}
              type="number"
              inputMode="decimal"
              autoFocus
              value={draftPrice}
              onChange={(e) => setDraftPrice(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <Button
              disabled={!draftPriceValid}
              onClick={() => {
                setPriceOverride(eventId, editing.id, draftPriceValue);
                setEditing(null);
              }}
            >
              Guardar precio
            </Button>
          </div>
        </Sheet>
      )}
    </>
  );
}
