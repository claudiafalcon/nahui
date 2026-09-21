import { useRef, useState } from 'react';
import { useStore } from '../../../domain/store';
import { availableCount, everReceived, matchProductByBarcode } from '../../../domain/selectors';
import { Sheet } from '../../../components/Sheet/Sheet';
import { Button } from '../../../components/Button/Button';
import { BarcodeScanner } from '../../../components/BarcodeScanner/BarcodeScanner';
import { TagStub } from '../../../components/TagStub/TagStub';
import type { Product } from '../../../domain/types';
import { isInFlight, runSheetSave, SAVE_FAILED_MESSAGE, type SheetSaveState } from './sheetSave';
import pickerStyles from '../../../components/ProductPicker/ProductPicker.module.css';
import styles from './ProductSheets.module.css';

/**
 * `inventory.md` §3.4c–§3.4g "Editar código de barras" (`decision-log.md`
 * D65, Paid tier only).
 *
 * **Entry point moved 2026-09-19; the sheet's own interior is explicitly
 * unchanged and is not re-litigated by that amendment** — its fields, its
 * "Volver a escanear"-only capture (a barcode is a manufacturer-printed fact,
 * not one Ana authors, so there is no typed entry here by design), its staged
 * "(actual)/(nuevo, sin guardar)" display, its disabled-until-staged
 * "Guardar código de barras," its "Cancelar," its tier gate, its camera
 * sub-flow (§3.4d–§3.4g), its conflict handling (§3.4e) and D71's
 * clear-on-save all carry over as the same code, relocated. It is reached
 * from §3.19's Código de barras row instead of the Catalog row's "⋯", and
 * both "Cancelar" and a successful save return to §3.19.
 *
 * **The one thing §3.4c's 2026-09-19 amendment does change is what renders on
 * the screen it returns to** — see `onSaved`'s own doc comment below, and
 * §3.19's two-shape confirmation composition.
 */
export function EditBarcodeSheet({
  product,
  onClose,
  onSaved,
}: {
  product: Product;
  onClose: () => void;
  /**
   * §3.4c's two-shape confirmation rule (amended 2026-09-19). The sheet
   * reports the two independently-conditional facts it is the only place
   * that knows at the moment of the write; §3.19 composes the actual
   * confirmation from them:
   * - `clearedNfcFlag` — this save also cleared `Product.nfcTaggingEnabled`
   *   because it was `true` (D71's clear-on-save). Read *before* the write,
   *   since the store mirrors the clear the instant it succeeds.
   * - the tagged-on-hand count is read by §3.19 itself, live, from
   *   `taggedOnHandUnitCount` — deliberately not passed from here, so there
   *   is exactly one sourcing site for that fact on this page.
   */
  onSaved: (result: { clearedNfcFlag: boolean }) => void;
}) {
  const { state, setProductBarcode } = useStore();
  type BarcodeStage = 'sheet' | 'scanning' | 'conflict' | 'cameraFailure';
  const [stage, setStage] = useState<BarcodeStage>('sheet');
  // A fresh, successful scan that doesn't conflict with a *different* Product
  // (§3.4e) — `undefined` means "nothing staged yet," the exact condition
  // "Guardar código de barras" stays disabled on (§3.4c: "there's no
  // manually-adjustable state here to re-save").
  const [stagedBarcode, setStagedBarcode] = useState<string | undefined>(undefined);
  // §3.4e's recognition display — the *other* Product a scanned code already
  // belongs to, reusing §3.8c's own marker/name/disponibles presentation.
  const [conflict, setConflict] = useState<{ product: Product; available: number; everReceived: boolean } | null>(
    null,
  );
  const [saveState, setSaveState] = useState<SheetSaveState>('idle');
  /** One idempotency key per logical attempt. Matters more here than anywhere
   * else on this page: §3.4c's own "residual, accepted race" (another device
   * claiming the identical code mid-attempt) is exactly the case where a
   * retry must arrive as the same request, not a second one. */
  const keyRef = useRef<string | null>(null);

  // §3.4d → §3.4c/§3.4e. §3.4c's own text: "A scan matching *no* other
  // Product, or matching this same Product's own already-stored value (a
  // pointless but harmless rescan), stages normally... the uniqueness check
  // is against every *other* Product only, never this one." A match against a
  // *different* Product (§3.4e) is never staged, never offered for Guardar.
  function handleScanResult(code: string) {
    const trimmed = code.trim();
    const match = matchProductByBarcode(state.products, trimmed);
    if (match && match.id !== product.id) {
      setConflict({
        product: match,
        available: availableCount(state, match.id),
        everReceived: everReceived(state, match.id),
      });
      setStage('conflict');
      return;
    }
    setStagedBarcode(trimmed);
    setStage('sheet');
    // A freshly-scanned code is a different attempt, not a retry of the
    // failed one.
    keyRef.current = null;
    setSaveState((s) => (s === 'error' ? 'idle' : s));
  }

  async function handleGuardar() {
    if (stagedBarcode === undefined) return;
    // Read before the write: `setProductBarcode` mirrors D71's clear-on-save
    // the instant the RPC succeeds, so afterwards this is always `false` and
    // the acknowledgment's second sentence would never render.
    const clearedNfcFlag = product.nfcTaggingEnabled === true;
    if (!keyRef.current) keyRef.current = crypto.randomUUID();
    const key = keyRef.current;
    const ok = await runSheetSave(setSaveState, 'setProductBarcode', () =>
      setProductBarcode(product.id, stagedBarcode, key),
    );
    if (!ok) return;
    keyRef.current = null;
    onClose();
    onSaved({ clearedNfcFlag });
  }

  // §3.4d — "Volver a escanear," cámara activa. Same live-camera shape §3.8b
  // establishes (BarcodeScanner reused verbatim, no new camera surface) — not
  // wrapped in <Sheet>: a real viewfinder needs the full content area.
  // §3.8b's "Escribir en su lugar" fallback is replaced here by "Cancelar"
  // (§3.4d's own adaptation note): there is no typed alternative when
  // correcting an already-identified Product's barcode. A sustained failed
  // read (§3.4g) is handled inside BarcodeScanner itself.
  if (stage === 'scanning') {
    return (
      <BarcodeScanner
        backLabel={product.name}
        fallbackLabel="Cancelar"
        onBack={() => setStage('sheet')}
        onResult={handleScanResult}
        onPermissionDenied={() => setStage('cameraFailure')}
      />
    );
  }

  // §3.4f — permiso de cámara denegado. Falls back to §3.4c unchanged (not a
  // typed-search field, since none exists in this context) — reuses
  // ProductPicker's own full-screen fallback chrome (§3.8d's precedent), copy
  // adapted to drop the "Escribe el nombre del producto" clause.
  if (stage === 'cameraFailure') {
    return (
      <div className={pickerStyles.cameraFailureScreen}>
        <button className={pickerStyles.cameraFailureBack} onClick={() => setStage('sheet')}>
          ← {product.name}
        </button>
        <p className={pickerStyles.cameraFailureText}>
          No pudimos usar la cámara.
          <br />
          Revisa los permisos de cámara de tu teléfono e intenta de nuevo.
        </p>
        <Button variant="secondary" onClick={() => setStage('sheet')}>
          Cancelar
        </Button>
      </div>
    );
  }

  // §3.4e — escaneo, coincide con otro producto (conflicto). Extends §3.15's
  // "identifier already claimed by someone else, offer a different one, no
  // reassignment" pattern and reuses §3.8c's recognition display verbatim.
  // "Cancelar" returns to §3.4c exactly as it was before this scan attempt
  // (nothing here ever touches `stagedBarcode`).
  if (stage === 'conflict' && conflict) {
    return (
      <Sheet onDismiss={() => setStage('sheet')}>
        <p className={pickerStyles.sheetTitle}>
          Este código ya está registrado
          <br />
          en otro producto:
        </p>
        <div className={pickerStyles.confirmProductRow}>
          <TagStub name={conflict.product.name} photo={conflict.product.photo} size={48} />
          <div>
            <p className={pickerStyles.confirmProductName}>{conflict.product.name}</p>
            <p className={pickerStyles.confirmProductCaption}>
              {!conflict.everReceived ? 'sin registrar' : `${conflict.available} disponibles`}
            </p>
          </div>
        </div>
        <p className={styles.barcodeConflictText}>
          No se puede usar el mismo código en dos productos. Revisa que sea la prenda correcta, o escanea otro
          código.
        </p>
        <div className={styles.sheetActions}>
          <Button variant="secondary" onClick={() => setStage('sheet')}>
            Cancelar
          </Button>
          <Button onClick={() => setStage('scanning')}>Escanear otro código</Button>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet onDismiss={isInFlight(saveState) ? undefined : onClose}>
      <p className={pickerStyles.sheetTitle}>{product.name}</p>
      <p className={pickerStyles.newProductLabel}>Código de barras</p>
      {stagedBarcode !== undefined ? (
        <div className={styles.barcodeValues}>
          <p className={styles.barcodeCurrent}>
            {product.barcode ?? 'Sin código'} <span className={styles.barcodeTag}>(actual)</span>
          </p>
          <p className={styles.barcodeStaged}>
            {stagedBarcode} <span className={styles.barcodeTag}>(nuevo, sin guardar)</span>
          </p>
        </div>
      ) : (
        <p className={styles.barcodeCurrent}>{product.barcode ?? 'Sin código'}</p>
      )}
      <Button
        variant="secondary"
        className={styles.rescanBtn}
        disabled={isInFlight(saveState)}
        onClick={() => setStage('scanning')}
      >
        Volver a escanear
      </Button>
      {/* §3.10/§3.11 — the staged "(nuevo, sin guardar)" value stays right
          above these lines, still there to retry or rescan. */}
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
        <Button disabled={stagedBarcode === undefined || isInFlight(saveState)} onClick={() => void handleGuardar()}>
          {saveState === 'error' ? 'Reintentar' : 'Guardar código de barras'}
        </Button>
      </div>
    </Sheet>
  );
}
