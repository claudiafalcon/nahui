import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows } from '../../domain/selectors';
import { CatalogRow } from '../../components/CatalogRow/CatalogRow';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import styles from './CatalogView.module.css';
import pickerStyles from '../../components/ProductPicker/ProductPicker.module.css';

/**
 * inventory.md §3.4 — Catalog view. Product + available count only, never a
 * Lot/InventoryUnit reference. Price is its own tap target (§3.4a, D33).
 */
export function CatalogView({
  onRegister,
  onRegisterProduct,
  justSavedConfirmation,
}: {
  onRegister: () => void;
  onRegisterProduct: (productId: string) => void;
  justSavedConfirmation?: string | null;
}) {
  const { state, editPrice } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState('');
  const [toast, setToast] = useState<string | null>(justSavedConfirmation ?? null);

  useEffect(() => {
    if (justSavedConfirmation) {
      setToast(justSavedConfirmation);
      const t = window.setTimeout(() => setToast(null), 2400);
      return () => window.clearTimeout(t);
    }
  }, [justSavedConfirmation]);

  const rows = catalogRows(state);
  const editingProduct = rows.find((r) => r.product.id === editingId)?.product;

  const draftPriceValue = useMemo(() => parseFloat(draftPrice), [draftPrice]);
  const draftPriceValid =
    draftPrice.trim().length > 0 && !Number.isNaN(draftPriceValue) && draftPriceValue > 0;

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Inventario</span>
      </div>
      {toast && <p className={styles.confirmation}>{toast} ✓</p>}

      <div className={styles.list}>
        {rows.map(({ product, available, everReceived }) => (
          <CatalogRow
            key={product.id}
            name={product.name}
            price={product.defaultPrice}
            available={available}
            everReceived={everReceived}
            onTapRow={() => onRegisterProduct(product.id)}
            onTapPrice={() => {
              setEditingId(product.id);
              setDraftPrice(String(product.defaultPrice));
            }}
          />
        ))}
      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button onClick={onRegister}>Registrar mercancía</Button>
      </div>

      {editingProduct && (
        <Sheet onDismiss={() => setEditingId(null)}>
          <p className={pickerStyles.sheetTitle}>{editingProduct.name}</p>
          <p className={pickerStyles.newProductLabel}>Precio</p>
          <div className={pickerStyles.priceField}>
            <span className={pickerStyles.pesoSign}>$</span>
            <input
              className={pickerStyles.priceInput}
              type="number"
              inputMode="decimal"
              autoFocus
              value={draftPrice}
              onChange={(e) => setDraftPrice(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" onClick={() => setEditingId(null)}>
              Cancelar
            </Button>
            <Button
              disabled={!draftPriceValid}
              onClick={() => {
                editPrice(editingProduct.id, draftPriceValue);
                setEditingId(null);
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
