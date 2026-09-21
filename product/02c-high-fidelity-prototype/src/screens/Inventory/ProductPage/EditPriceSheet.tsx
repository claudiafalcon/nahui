import { useMemo, useRef, useState } from 'react';
import { useStore } from '../../../domain/store';
import { Sheet } from '../../../components/Sheet/Sheet';
import { Button } from '../../../components/Button/Button';
import type { Product } from '../../../domain/types';
import { isInFlight, runSheetSave, SAVE_FAILED_MESSAGE, type SheetSaveState } from './sheetSave';
import pickerStyles from '../../../components/ProductPicker/ProductPicker.module.css';
import styles from './ProductSheets.module.css';

/**
 * `inventory.md` §3.4a "Editar precio" (`decision-log.md` D33).
 *
 * **Entry point moved 2026-09-19; this sheet itself is unchanged in every
 * respect.** It is no longer reached from a Catalog-row tap zone — it is
 * reached from §3.19's Precio row, one tap deeper, deliberately accepted
 * (the Product Owner's own words: "+1 tap to edit price is acceptable. Do not
 * use the card's shortcut allowance for price."). "Cancelar" and a successful
 * save both return to §3.19, not to Catalog view. Its dimmed-backdrop shape,
 * its Product-name heading, its staging/save/error behaviour and its copy are
 * untouched by that amendment — the code below is the same code, relocated.
 */
export function EditPriceSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  const { editPrice } = useStore();
  const [draftPrice, setDraftPrice] = useState(String(product.defaultPrice));
  const [saveState, setSaveState] = useState<SheetSaveState>('idle');
  /** One idempotency key per logical "Guardar precio" attempt: minted when an
   * attempt starts, **reused unchanged across a "Reintentar" tap of that same
   * attempt**, cleared on success and on any edit that changes what would be
   * saved (a different typed price is a different attempt, not a retry of
   * this one). */
  const keyRef = useRef<string | null>(null);

  const draftPriceValue = useMemo(() => parseFloat(draftPrice), [draftPrice]);
  const draftPriceValid = draftPrice.trim().length > 0 && !Number.isNaN(draftPriceValue) && draftPriceValue > 0;

  // Typing a different price makes this a different attempt, not a retry of
  // the failed one — so the key is dropped and any error line clears.
  function handleChange(next: string) {
    setDraftPrice(next);
    keyRef.current = null;
    setSaveState((s) => (s === 'error' ? 'idle' : s));
  }

  async function handleGuardar() {
    if (!draftPriceValid) return;
    if (!keyRef.current) keyRef.current = crypto.randomUUID();
    const key = keyRef.current;
    const ok = await runSheetSave(setSaveState, 'editPrice', () => editPrice(product.id, draftPriceValue, key));
    if (!ok) return;
    keyRef.current = null;
    onClose();
  }

  return (
    // While a write is in flight the sheet can't be dismissed by backdrop tap
    // or Escape (`onDismiss` withheld) — closing it mid-write is exactly how a
    // save becomes silent again.
    <Sheet onDismiss={isInFlight(saveState) ? undefined : onClose}>
      {/* On-screen heading is the Product's name, never "Editar precio" —
          avoiding the CTA/heading-collision defect class (HJR-INV-M1,
          HJR-EVT-M1), the same rule §3.19 itself holds. */}
      <p className={pickerStyles.sheetTitle}>{product.name}</p>
      <p className={pickerStyles.newProductLabel}>Precio</p>
      <div className={pickerStyles.priceField}>
        <span className={pickerStyles.pesoSign}>$</span>
        <input
          className={pickerStyles.priceInput}
          type="number"
          inputMode="decimal"
          autoFocus
          value={draftPrice}
          disabled={isInFlight(saveState)}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {/* §3.10/§3.11 — her typed value stays on screen above these lines,
          never cleared, never replaced by them. */}
      {saveState === 'slow' && (
        <p className={styles.sheetSavingHint} role="status">
          Guardando…
        </p>
      )}
      {saveState === 'error' && (
        <p className={styles.sheetError} role="alert">
          {SAVE_FAILED_MESSAGE}
        </p>
      )}
      <div className={styles.sheetActions}>
        <Button variant="secondary" disabled={isInFlight(saveState)} onClick={onClose}>
          Cancelar
        </Button>
        {/* One primary action, relabelled in the error state rather than
            joined by a second button that would do the identical thing — the
            same single-retry-affordance shape §3.11 and every other error
            surface in this codebase already use. */}
        <Button disabled={!draftPriceValid || isInFlight(saveState)} onClick={() => void handleGuardar()}>
          {saveState === 'error' ? 'Reintentar' : 'Guardar precio'}
        </Button>
      </div>
    </Sheet>
  );
}
