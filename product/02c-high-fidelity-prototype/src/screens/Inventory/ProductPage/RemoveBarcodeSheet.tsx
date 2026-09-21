import { useRef, useState } from 'react';
import { useStore } from '../../../domain/store';
import { taggedOnHandUnitCount } from '../../../domain/selectors';
import { taggedUnitsKeepSelling } from '../../../domain/format';
import { Sheet } from '../../../components/Sheet/Sheet';
import { Button } from '../../../components/Button/Button';
import type { Product } from '../../../domain/types';
import { isInFlight, runSheetSave, SAVE_FAILED_MESSAGE, type SheetSaveState } from './sheetSave';
import pickerStyles from '../../../components/ProductPicker/ProductPicker.module.css';
import styles from './ProductSheets.module.css';

/**
 * `inventory.md` §3.19c "Quitar código de barras — confirmación"
 * (**new 2026-09-19**, `decision-log.md` D80, Paid tier only).
 *
 * **Why this keeps a confirmation, and the reason survives D80's ruling.**
 * D80 is clear that both a confirmation and a plain save are architecturally
 * sound — the write is reversible by rescanning and destroys no history. The
 * deciding factor is therefore neither severity nor reversibility: it is that
 * **every other edit on this page is protected by staging, and this one
 * cannot be.** Precio, Foto and a barcode *change* each stage the change
 * locally behind an explicit Cancelar/Guardar pair — exactly the reasoning
 * §3.4b gives for needing no confirmation dialog, and exactly the reasoning
 * that let §3.9's Descartar confirmation be retired outright. A removal has
 * no staging equivalent: the action *is* the change. A confirmation is the
 * cheapest way to give the one unstageable action on this page the identical
 * protection every other action already gets for free — consistency with the
 * page's posture, not an exception to it.
 *
 * **It is a plain confirmation, not a destructive-styled one.** No warning
 * language, no red, no "esta acción no se puede deshacer" — that would be
 * false, since D80 confirms it can be undone by rescanning. The copy states
 * what changes, states what keeps working, and says she can rescan. One tap
 * to confirm, no typed-to-confirm, no two-step.
 *
 * **The confirm button is `[ Sí, quitarlo ]`, deliberately not a third
 * near-identical action string** — a chain of row → heading → button all
 * saying "Quitar código de barras" would say almost the same thing three
 * times in three sizes. It answers the sentence directly above it instead,
 * reusing §3.8c's own established `[ Sí, es este ]` affirmative-confirm shape.
 */
export function RemoveBarcodeSheet({
  product,
  onClose,
  onRemoved,
}: {
  product: Product;
  onClose: () => void;
  onRemoved: () => void;
}) {
  const { state, clearProductBarcode } = useStore();
  const [saveState, setSaveState] = useState<SheetSaveState>('idle');
  const keyRef = useRef<string | null>(null);

  /**
   * §3.19c's third copy line renders **only when ≥1 unit of this Product
   * currently carries an attached `NFCTag`** — counted live, on D80's own
   * allowlist (`tagId != null AND status IN ('available','reserved')`), since
   * a `sold` unit keeps its `tagId`.
   *
   * **It must never be conditioned on `Product.nfcTaggingEnabled`** — on a
   * barcoded Product that flag is always `false` (either §3.4c's
   * clear-on-save cleared it, or the Product was created barcode-identified),
   * so a flag-sourced condition would render this line **never**, in exactly
   * the case it exists for (`architect` ruling, 2026-09-19, binding).
   */
  const taggedOnHand = taggedOnHandUnitCount(state, product.id);

  async function handleQuitar() {
    if (!keyRef.current) keyRef.current = crypto.randomUUID();
    const key = keyRef.current;
    const ok = await runSheetSave(setSaveState, 'clearProductBarcode', () =>
      clearProductBarcode(product.id, key),
    );
    // A failed removal leaves this sheet open, unchanged and retriable, with
    // nothing written (§3.10/§3.11's existing convention).
    if (!ok) return;
    keyRef.current = null;
    onClose();
    onRemoved();
  }

  return (
    <Sheet onDismiss={isInFlight(saveState) ? undefined : onClose}>
      {/* On-screen heading is the Product's name, never "Quitar el código de
          barras de Bolsas" — the rule §3.19/§3.19a/§3.4a/§3.4b/§3.4c all
          hold. The action lives in the body sentence below, where it reads as
          a consequence rather than a restated label. */}
      <p className={pickerStyles.sheetTitle}>{product.name}</p>
      {/* The exact code being removed, plainly and unformatted, exactly as
          §3.4c displays it — the value is the whole point of the screen, and
          a bare "¿quitar el código?" would ask her to confirm something she
          cannot see. */}
      <p className={styles.barcodeCurrent}>{product.barcode}</p>
      {/* Three sentences, the middle one conditional. **It takes its singular
          at N=1 and is §3.4c's own sentence, reused from one place**
          (corrected 2026-09-21, `ux-critic` m5): it previously read "Las
          prendas que ya tienen tag siguen funcionando igual" at every N,
          which carries plural agreement three times over (article, noun,
          verb) and so was wrong at N=1 even though it contains no numeral —
          and it said *funcionando*, which is what a tag does, not what a
          garment does. What she needs to know is that she can still *sell*
          them. The other two sentences are invariant. */}
      <p className={styles.removeBody}>
        Si quitas este código, ya no vas a poder encontrar este producto escaneándolo.
        {taggedOnHand > 0 && ` ${taggedUnitsKeepSelling(taggedOnHand, { withCount: false })}`} Si te equivocas,
        puedes volver a escanearlo.
      </p>
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
        {/* Returns to §3.19 unchanged, nothing written — identical decline
            treatment to §3.4a/§3.4b/§3.4c/§3.19a. */}
        <Button variant="secondary" disabled={isInFlight(saveState)} onClick={onClose}>
          Cancelar
        </Button>
        <Button disabled={isInFlight(saveState)} onClick={() => void handleQuitar()}>
          {saveState === 'error' ? 'Reintentar' : 'Sí, quitarlo'}
        </Button>
      </div>
    </Sheet>
  );
}
