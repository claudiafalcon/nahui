import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../../domain/store';
import { Sheet } from '../../../components/Sheet/Sheet';
import { Button } from '../../../components/Button/Button';
import { PhotoCapture } from '../../../components/PhotoCapture/PhotoCapture';
import type { Product } from '../../../domain/types';
import { isInFlight, runSheetSave, SAVE_FAILED_MESSAGE, type SheetSaveState } from './sheetSave';
import pickerStyles from '../../../components/ProductPicker/ProductPicker.module.css';
import styles from './ProductSheets.module.css';

/** `product-decisions.md` Q23 — verbatim inline failure copy, reused
 * everywhere a selected/stored photo can't be shown (`inventory.md` §3.4b,
 * `onboarding.md` §3.5b/§3.5c, `inventory.md` §3.8a). */
const PHOTO_UNREADABLE_MESSAGE = 'No pudimos mostrar ese archivo.';

/**
 * `inventory.md` §3.4b "Editar foto" (`product-decisions.md` Q23).
 *
 * **Entry point moved 2026-09-19; this sheet itself is unchanged.** Reached
 * from §3.19's Foto row instead of the Catalog row's marker tap; "Cancelar"
 * and a successful save both return to §3.19, where the header marker updates
 * along with the row. Everything inside — the device-upload composition, the
 * camera fallback, the large preview, the staged Cambiar/Quitar pair, the
 * silent `onError` fallback — is the same code, relocated.
 */
export function EditPhotoSheet({
  product,
  onClose,
  onSaved,
}: {
  product: Product;
  onClose: () => void;
  /** Fired only when "Guardar foto" committed a *real* change (a new photo,
   * or a removal) — never on a no-op save. Telling the merchant something
   * changed when it didn't is worse than staying silent
   * (`merchant-user-tester` finding). */
  onSaved: () => void;
}) {
  const { setProductPhoto } = useStore();
  // `Product.photo` is untouched until "Guardar foto" is explicitly tapped;
  // "Cancelar" discards the staged change and returns §3.19 exactly as it was.
  const [stagedPhoto, setStagedPhoto] = useState<string | undefined>(product.photo);
  // The product's photo value at the exact moment the sheet opened — captured
  // once and never updated while the sheet is open. `handleGuardar` diffs
  // `stagedPhoto` against this (not against anything post-write) to tell a
  // real edit apart from a no-op "Guardar foto" tap (sheet opened, nothing
  // changed, tapped Guardar out of habit instead of Cancelar).
  const openedPhotoRef = useRef<string | undefined>(product.photo);
  const [photoError, setPhotoError] = useState<string | null>(null);
  // §3.4b's own near-instant/slow/error save state (§3.10/§3.11). Distinct
  // from `photoError` above, which is the *selection*-time "No pudimos
  // mostrar ese archivo." failure — a different failure, at a different
  // moment, with a different recovery.
  const [saveState, setSaveState] = useState<SheetSaveState>('idle');
  /** One idempotency key per logical "Guardar foto" attempt — same discipline
   * as the Precio sheet's. Cleared on success and whenever the staged photo
   * itself changes (a different photo, or a "Quitar," is a different
   * attempt). */
  const keyRef = useRef<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Live-found gap (2026-09-15) — `capture="environment"` alone no longer
  // reliably launches the camera on current Chrome/Android; `PhotoCapture` is
  // the fallback-proof alternative, offered alongside the existing file
  // picker rather than replacing it.
  const [cameraOpen, setCameraOpen] = useState(false);
  // The preview overlay isn't a DOM descendant of this Sheet (it's a
  // full-viewport sibling — §3.4b's shape doesn't fit Sheet's bottom-drawer
  // panel), so opening it via keyboard never moves focus there on its own.
  const previewOverlayRef = useRef<HTMLDivElement | null>(null);
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (previewOpen) {
      previewOverlayRef.current?.focus();
    } else if (previewTriggerRef.current) {
      previewTriggerRef.current.focus();
      previewTriggerRef.current = null;
    }
  }, [previewOpen]);

  // Staging a different photo (or removing one) makes this a different
  // attempt, not a retry.
  function stagePhoto(next: string | undefined) {
    setStagedPhoto(next);
    keyRef.current = null;
    setSaveState((s) => (s === 'error' ? 'idle' : s));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError(PHOTO_UNREADABLE_MESSAGE);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      stagePhoto(typeof reader.result === 'string' ? reader.result : undefined);
      setPhotoError(null);
    };
    reader.onerror = () => setPhotoError(PHOTO_UNREADABLE_MESSAGE);
    reader.readAsDataURL(file);
  }

  async function handleGuardar() {
    // A real write only happened if `stagedPhoto` actually differs from the
    // photo the sheet opened with — covers both a new/changed photo and a
    // removal ("Quitar" → "Guardar foto" on a product that had one).
    const photoChanged = stagedPhoto !== openedPhotoRef.current;
    if (!keyRef.current) keyRef.current = crypto.randomUUID();
    const key = keyRef.current;
    const ok = await runSheetSave(setSaveState, 'setProductPhoto', () =>
      setProductPhoto(product.id, stagedPhoto, key),
    );
    if (!ok) return;
    keyRef.current = null;
    onClose();
    if (photoChanged) onSaved();
  }

  return (
    <>
      <Sheet onDismiss={isInFlight(saveState) ? undefined : onClose}>
        <p className={pickerStyles.sheetTitle}>{product.name}</p>
        <p className={pickerStyles.newProductLabel}>Foto (opcional)</p>
        {stagedPhoto ? (
          <div className={styles.photoRow}>
            <button
              type="button"
              className={styles.photoThumbBtn}
              onClick={(e) => {
                previewTriggerRef.current = e.currentTarget;
                setPreviewOpen(true);
              }}
              aria-label={`Ver foto de ${product.name} en tamaño grande`}
            >
              <img
                className={styles.photoThumb}
                src={stagedPhoto}
                alt={`Foto de ${product.name}`}
                // A previously-saved photo that fails to render later — this
                // prototype's storage is browser-local, corruption/eviction
                // is real (`product-decisions.md` Q23) — falls back silently
                // to this sheet's own "Agregar foto" no-photo-yet state,
                // never a broken-image glyph.
                onError={() => {
                  stagePhoto(undefined);
                  setPreviewOpen(false);
                }}
              />
            </button>
            {/* Every staging control goes inert while a write is in flight —
                otherwise she could swap the photo out from under an attempt
                that's still running, and the key replayed by a "Reintentar"
                would no longer match what's on screen. */}
            <button className={styles.linkBtn} disabled={isInFlight(saveState)} onClick={() => setCameraOpen(true)}>
              Tomar foto
            </button>
            <button
              className={styles.linkBtn}
              disabled={isInFlight(saveState)}
              onClick={() => fileInputRef.current?.click()}
            >
              Cambiar
            </button>
            <button
              className={styles.linkBtn}
              disabled={isInFlight(saveState)}
              onClick={() => {
                stagePhoto(undefined);
                setPhotoError(null);
              }}
            >
              Quitar
            </button>
          </div>
        ) : (
          <>
            <div className={styles.uploadRow}>
              <button
                className={styles.uploadBtn}
                disabled={isInFlight(saveState)}
                onClick={() => setCameraOpen(true)}
              >
                Tomar foto
              </button>
              <button
                className={styles.uploadBtn}
                disabled={isInFlight(saveState)}
                onClick={() => fileInputRef.current?.click()}
              >
                Agregar foto
              </button>
            </div>
            <p className={styles.photoHint}>Agrega una foto clara del producto.</p>
          </>
        )}
        {photoError && (
          <p className={styles.error}>
            {photoError}
            <br />
            Intenta con otra foto, si quieres.
          </p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,android/allowCamera"
          capture="environment"
          className={styles.hiddenFileInput}
          onChange={handleFileChange}
        />
        {cameraOpen && (
          <PhotoCapture
            onCapture={(dataUrl) => {
              stagePhoto(dataUrl);
              setPhotoError(null);
              setCameraOpen(false);
            }}
            onCancel={() => setCameraOpen(false)}
            onUnavailable={() => {
              setCameraOpen(false);
              fileInputRef.current?.click();
            }}
          />
        )}
        {/* §3.10/§3.11 — the staged photo (or the "Agregar foto" empty state a
            "Quitar" leaves behind) stays exactly as it is above these lines;
            nothing she staged is dropped by a failed save. */}
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
        <div className={`${styles.sheetActions} ${styles.sheetActionsSpaced}`}>
          <Button variant="secondary" disabled={isInFlight(saveState)} onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={isInFlight(saveState)} onClick={() => void handleGuardar()}>
            {saveState === 'error' ? 'Reintentar' : 'Guardar foto'}
          </Button>
        </div>
      </Sheet>

      {previewOpen && stagedPhoto && (
        <div
          ref={previewOverlayRef}
          className={styles.previewOverlay}
          onClick={() => setPreviewOpen(false)}
          onKeyDown={(e) => {
            // Sheet.tsx's own Escape-to-dismiss precedent, replicated here
            // since this overlay isn't built on top of Sheet. stopPropagation
            // on Escape specifically: this overlay is a DOM sibling of the
            // sheet, not a descendant, and Sheet's own Escape listener is
            // bound on `window` — without stopping propagation, one Escape
            // would close the whole "Editar foto" sheet underneath and
            // silently discard a staged-but-unsaved photo.
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              setPreviewOpen(false);
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setPreviewOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          aria-label={`Foto de ${product.name} en tamaño grande`}
        >
          <img
            className={styles.previewImg}
            src={stagedPhoto}
            alt={`Foto de ${product.name}`}
            onClick={(e) => e.stopPropagation()}
            onError={() => {
              // Routed through `stagePhoto` like every other change to the
              // staged value, so the idempotency key can't outlive the value
              // it was minted for.
              stagePhoto(undefined);
              setPreviewOpen(false);
            }}
          />
          <button className={styles.previewClose} onClick={() => setPreviewOpen(false)}>
            ← Cerrar
          </button>
        </div>
      )}
    </>
  );
}
