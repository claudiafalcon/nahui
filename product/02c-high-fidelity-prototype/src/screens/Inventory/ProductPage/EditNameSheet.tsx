import { useRef, useState } from 'react';
import { useStore } from '../../../domain/store';
import { availableCount, everReceived } from '../../../domain/selectors';
import { stockCaption } from '../../../domain/format';
import { Sheet } from '../../../components/Sheet/Sheet';
import { Button } from '../../../components/Button/Button';
import { TagStub } from '../../../components/TagStub/TagStub';
import type { Product } from '../../../domain/types';
import { isInFlight, runSheetSave, SAVE_FAILED_MESSAGE, type SheetSaveState } from './sheetSave';
import pickerStyles from '../../../components/ProductPicker/ProductPicker.module.css';
import styles from './ProductSheets.module.css';

/**
 * `inventory.md` §3.19a "Editar nombre" and §3.19b "Ya tienes un producto con
 * ese nombre" — **new 2026-09-19.** Product rename is newly supported.
 *
 * Reuses the exact dimmed-backdrop sheet shape already established by
 * "Elegir producto" (§3.8), "Editar precio" (§3.4a), "Editar foto" (§3.4b)
 * and "Editar código de barras" (§3.4c) — no new sheet/modal pattern.
 *
 * **Validation runs on "Guardar nombre," not as she types.** Deliberate: this
 * document family's only live/as-you-type precedent is `onboarding.md` §3.9b,
 * which needed its own grounding before it was adopted, and a name typed one
 * character at a time would flash a conflict warning at half the intermediate
 * strings. Staged-then-validated also matches §3.4c's posture exactly.
 *
 * **The matching rule is §3.8's, reused verbatim, never re-derived** — her
 * typed text compared against **every other Product's name in this Catalog**
 * after lowercasing both sides and trimming leading/trailing whitespace, the
 * one automatic normalization, and deliberately no fuzzy or typo-tolerant
 * matching ("Bolsa" and "Bolsas" stay two distinct Products). Three outcomes:
 * 1. normalizes to a **different** existing Product → §3.19b, conflict. Never
 *    saved, never merged.
 * 2. normalizes to **this same Product's own** current name (a pure casing or
 *    spacing change) → **saved normally**, not treated as a no-op: the stored
 *    literal genuinely changes, and the Catalog marker's own derived initial
 *    letter may change with it. The uniqueness check is against every *other*
 *    Product only — the identical carve-out §3.4c already makes for a
 *    pointless-but-harmless barcode rescan.
 * 3. matches nothing → saved normally.
 *
 * **No merge, ever.** Renaming a Product onto another Product's name is
 * refused, never resolved by combining the two: merging would silently
 * combine two independent identities' stock, prices, photos, barcodes and
 * sales history, and D2 keeps Product identity independent precisely so that
 * cannot happen.
 *
 * **What a rename does to history — stated plainly, because it is not
 * nothing.** Every `InventoryUnit`, `NFCTag`, `SaleItem`, `Lot`,
 * `EventAllocation` and `Claim` references this Product **by ID, never by
 * name** (D2), so a rename is complete and retroactive *by construction*:
 * past figures, allocation lists and a re-rendered Digital Receipt all show
 * the new name for sales made under the old one, because none of them ever
 * stored the old one. No historical row is altered or deleted (D25), and no
 * name history is kept — the same plain-mutable-current-scalar posture D33
 * fixed for `defaultPrice`, D54 for `photo`, D65 for `barcode`.
 */
export function EditNameSheet({
  product,
  onClose,
  onSaved,
}: {
  product: Product;
  onClose: () => void;
  /** §3.19a specifies **no ambient confirmation for a rename**, and none is
   * added: the page's heading, its Nombre row and its marker all update at
   * once, which is a larger and more legible change than any line could
   * announce. The hook stays available for a future caller that genuinely
   * needs to react to a rename; today none does. */
  onSaved?: () => void;
}) {
  const { state, renameProduct } = useStore();
  const [draftName, setDraftName] = useState(product.name);
  const [saveState, setSaveState] = useState<SheetSaveState>('idle');
  /** §3.19b — the *other* Product her typed name collides with. Set only by a
   * save attempt (never while typing); cleared by "Escribir otro nombre,"
   * which returns to §3.19a with her typed text intact. */
  const [conflict, setConflict] = useState<Product | null>(null);
  /** One idempotency key per logical "Guardar nombre" attempt — same
   * discipline as every sibling sheet. Cleared on success and whenever the
   * typed text changes (a different name is a different attempt, not a retry
   * of this one). */
  const keyRef = useRef<string | null>(null);

  // §3.19a: "[ Guardar nombre ] stays disabled while the field is empty or
  // whitespace-only." Same disabled-until-valid posture §3.8a's "Agregar" and
  // §3.4c's "Guardar código de barras" already use. No error copy is needed
  // for this case — there is simply nothing to save.
  const trimmed = draftName.trim();
  const canSave = trimmed.length > 0;

  function handleChange(next: string) {
    setDraftName(next);
    keyRef.current = null;
    setSaveState((s) => (s === 'error' ? 'idle' : s));
  }

  async function handleGuardar() {
    if (!canSave) return;
    // §3.8's matching rule, reused verbatim — against every *other* Product
    // only, never this one.
    const collision = state.products.find(
      (p) => p.id !== product.id && p.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (collision) {
      setConflict(collision);
      return;
    }
    if (!keyRef.current) keyRef.current = crypto.randomUUID();
    const key = keyRef.current;
    const ok = await runSheetSave(setSaveState, 'renameProduct', () => renameProduct(product.id, trimmed, key));
    if (!ok) return;
    keyRef.current = null;
    onClose();
    onSaved?.();
  }

  // §3.19b — conflicto. Extends two already-approved patterns rather than
  // inventing a third: §3.15's "this identifier already belongs to something
  // else — pick a different one, nothing is reassigned" shape, and §3.8c's/
  // §3.4e's recognition display (marker, name, disponibles for the *other*
  // Product), for the identical reason — a bare name is easy to misread past;
  // a real, recognizable glance catches the mistake. The recognition display
  // is passive: nothing in it is tappable.
  if (conflict) {
    return (
      <Sheet onDismiss={() => setConflict(null)}>
        <p className={pickerStyles.sheetTitle}>
          Ya tienes un producto con ese
          <br />
          nombre:
        </p>
        <div className={pickerStyles.confirmProductRow}>
          <TagStub name={conflict.name} photo={conflict.photo} size={48} />
          <div>
            <p className={pickerStyles.confirmProductName}>{conflict.name}</p>
            <p className={pickerStyles.confirmProductCaption}>
              {/* §3.4's count-caption rule, which names §3.19b's recognition
                  display among the surfaces it governs. */}
              {stockCaption(availableCount(state, conflict.id), everReceived(state, conflict.id))}
            </p>
          </div>
        </div>
        <p className={styles.barcodeConflictText}>
          No se pueden tener dos productos con el mismo nombre. Ponle otro nombre, o déjalo como estaba.
        </p>
        {/* Her only two paths are a different name or backing out — the same
            narrow, conservative posture §3.4e and §3.15 already established
            for their own conflicts. No merge, no reassignment, no swap. */}
        <div className={styles.sheetActionsStacked}>
          {/* Returns to §3.19a with her typed text intact — she is one edit
              away, never retyping from scratch. Same "return to the nearer
              state, not the furthest one" behaviour §3.4e's "Cancelar" and
              §3.8c's "No es este" already establish. */}
          <Button onClick={() => setConflict(null)}>Escribir otro nombre</Button>
          {/* Returns all the way to §3.19, unchanged. Nothing is written
              anywhere by reaching or leaving this state. */}
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet onDismiss={isInFlight(saveState) ? undefined : onClose}>
      {/* On-screen heading is the Product's current name, never "Editar
          nombre" — the identical rule §3.4a/§3.4b/§3.4c/§3.19 all hold. */}
      <p className={pickerStyles.sheetTitle}>{product.name}</p>
      <p className={pickerStyles.newProductLabel}>Nombre</p>
      {/* Pre-filled with the current name, immediately editable. Plain text
          entry, no casing help, no suggestions, no autocomplete against the
          Catalog — she is naming her own merchandise, and the app has nothing
          to add to that (*global-principles.md*: never talk down to her about
          a task she already knows how to do better than the app does). */}
      {/* Opens focused with the current name selected, so her first keystroke
          replaces it (see EditPriceSheet.tsx for the walkthrough defect this
          closes — identical pattern here, it just costs less when a rename
          goes wrong than when a price does). */}
      <input
        className={styles.nameInput}
        type="text"
        autoFocus
        onFocus={(e) => e.target.select()}
        value={draftName}
        disabled={isInFlight(saveState)}
        onChange={(e) => handleChange(e.target.value)}
        aria-label="Nombre del producto"
      />
      {saveState === 'slow' && (
        <p className={styles.sheetSavingHint} role="status">
          Guardando…
        </p>
      )}
      {/* A failed save leaves the sheet open with her typed value intact —
          including the concurrent-rename collision the server re-checks,
          which §3.19a routes through this same path rather than a separate
          branch. */}
      {saveState === 'error' && (
        <p className={styles.sheetError} role="alert">
          {SAVE_FAILED_MESSAGE}
        </p>
      )}
      <div className={styles.sheetActions}>
        <Button variant="secondary" disabled={isInFlight(saveState)} onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={!canSave || isInFlight(saveState)} onClick={() => void handleGuardar()}>
          {saveState === 'error' ? 'Reintentar' : 'Guardar nombre'}
        </Button>
      </div>
    </Sheet>
  );
}
