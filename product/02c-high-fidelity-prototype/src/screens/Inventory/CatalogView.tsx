import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, nfcCapable, pendingTagCount } from '../../domain/selectors';
import { articulos } from '../../domain/format';
import { CatalogRow } from '../../components/CatalogRow/CatalogRow';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import styles from './CatalogView.module.css';
import pickerStyles from '../../components/ProductPicker/ProductPicker.module.css';

/**
 * inventory.md §3.4/§3.5 — Catalog view. Product + available count only,
 * never a Lot/InventoryUnit reference. Price is its own tap target (§3.4a,
 * D33). §3.5's pending-tag-work variant (nfc-capable Businesses only, ≥1
 * untagged `available` unit) renders "Continuar etiquetando" as the primary
 * action directly under the header and demotes "Registrar mercancía" to
 * secondary — same position, same destination, never gated (2026-08-07
 * amendment). Identical to §3.17 ("Terminar después") — same live check,
 * no separate flag needed to distinguish how she arrived here.
 */
export function CatalogView({
  onRegister,
  onRegisterProduct,
  onContinueTagging,
  confirmationMessage,
}: {
  onRegister: () => void;
  onRegisterProduct: (productId: string) => void;
  /** §3.5/§3.17 — resumes Asignar Tags exactly where she left off. */
  onContinueTagging: () => void;
  confirmationMessage?: string | null;
}) {
  const { state, editPrice } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState('');
  const [toast, setToast] = useState<string | null>(confirmationMessage ?? null);

  useEffect(() => {
    if (confirmationMessage) {
      setToast(confirmationMessage);
      const t = window.setTimeout(() => setToast(null), 2400);
      return () => window.clearTimeout(t);
    }
  }, [confirmationMessage]);

  const rows = catalogRows(state);
  const editingProduct = rows.find((r) => r.product.id === editingId)?.product;

  const draftPriceValue = useMemo(() => parseFloat(draftPrice), [draftPrice]);
  const draftPriceValid =
    draftPrice.trim().length > 0 && !Number.isNaN(draftPriceValue) && draftPriceValue > 0;

  // §2 step 2 / §3.5 — a live check, recomputed every render (never
  // cached): deferring tagging and later selling some of those same
  // untagged units via FIFO in buttons mode must silently shrink this
  // count, not just refresh whenever Asignar Tags itself is reopened.
  const pendingCount = pendingTagCount(state);
  const pendingTagWork = nfcCapable(state) && pendingCount > 0;

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Inventario</span>
      </div>
      {toast && <p className={styles.confirmation}>{toast} ✓</p>}

      {pendingTagWork && (
        <div className={styles.pendingTagBlock}>
          <p className={styles.pendingTagLine}>Te faltan {articulos(pendingCount)} por etiquetar</p>
          <Button onClick={onContinueTagging}>Continuar etiquetando</Button>
        </div>
      )}

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
        <Button variant={pendingTagWork ? 'secondary' : 'primary'} onClick={onRegister}>
          Registrar mercancía
        </Button>
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
