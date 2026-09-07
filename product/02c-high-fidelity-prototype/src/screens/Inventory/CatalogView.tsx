import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, pendingTagCount } from '../../domain/selectors';
import { articulos } from '../../domain/format';
import { CatalogRow } from '../../components/CatalogRow/CatalogRow';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import styles from './CatalogView.module.css';
import pickerStyles from '../../components/ProductPicker/ProductPicker.module.css';

/** `product-decisions.md` Q23 — verbatim inline failure copy, reused
 * everywhere a selected/stored photo can't be shown (`inventory.md` §3.4b,
 * `onboarding.md` §3.5b/§3.5c, `inventory.md` §3.8a). */
const PHOTO_UNREADABLE_MESSAGE = 'No pudimos mostrar ese archivo.';

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
  settingsTagsBanner,
}: {
  onRegister: () => void;
  onRegisterProduct: (productId: string) => void;
  /** §3.5/§3.17 — resumes Asignar Tags exactly where she left off. */
  onContinueTagging: () => void;
  confirmationMessage?: string | null;
  /** inventory.md §3.3a/§3.4 (`decision-log.md` D46 Addendum) — the one-time
   * ambient banner shown when this view was reached via `settings.md` §2.6's
   * "Cambiar a vender con tags" handoff and step 0 found nothing to
   * auto-route her into. Rendered once, prepended above the Catalog list,
   * never re-shown afterward — the caller (`InventoryScreen`) owns the
   * "shown exactly once" discipline, this component only renders whatever
   * it's handed. */
  settingsTagsBanner?: string | null;
}) {
  const { state, editPrice, setProductPhoto } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState('');
  const [toast, setToast] = useState<string | null>(confirmationMessage ?? null);

  // inventory.md §3.4b "Editar foto" — the sheet's own staged state.
  // `Product.photo` is untouched until "Guardar foto" is explicitly tapped;
  // "Cancelar" discards the staged change and returns the Catalog row (and
  // any tile already rendering it) exactly as it was.
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [stagedPhoto, setStagedPhoto] = useState<string | undefined>(undefined);
  // The product's photo value at the exact moment the sheet opened —
  // captured once in `openPhotoSheet` and never updated while the sheet is
  // open. `handleGuardarFoto` diffs `stagedPhoto` against this (not against
  // anything post-write) to tell a real edit apart from a no-op "Guardar
  // foto" tap (sheet opened, nothing changed, tapped Guardar out of habit
  // instead of Cancelar) — only a real edit gets the "Foto guardada" toast.
  const openedPhotoRef = useRef<string | undefined>(undefined);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false);
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);
  // Preview overlay isn't a DOM descendant of the "Editar foto" Sheet (it's
  // a full-viewport sibling, §3.4b's shape doesn't fit Sheet's bottom-drawer
  // panel) — so opening it via keyboard (Enter/Space on the thumbnail) never
  // moves focus there on its own. previewOverlayRef lets the effect below
  // pull focus onto the dialog surface itself when it opens;
  // previewTriggerRef remembers the thumbnail button that opened it so focus
  // can be returned there on close (Escape/Enter/Space/backdrop-tap/
  // "Cerrar") — standard modal open/dismiss focus management.
  const previewOverlayRef = useRef<HTMLDivElement | null>(null);
  const previewTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (photoPreviewOpen) {
      previewOverlayRef.current?.focus();
    } else if (previewTriggerRef.current) {
      previewTriggerRef.current.focus();
      previewTriggerRef.current = null;
    }
  }, [photoPreviewOpen]);

  useEffect(() => {
    if (confirmationMessage) {
      setToast(confirmationMessage);
      const t = window.setTimeout(() => setToast(null), 2400);
      return () => window.clearTimeout(t);
    }
  }, [confirmationMessage]);

  const rows = catalogRows(state);
  const editingProduct = rows.find((r) => r.product.id === editingId)?.product;
  const editingPhotoProduct = rows.find((r) => r.product.id === editingPhotoId)?.product;

  const draftPriceValue = useMemo(() => parseFloat(draftPrice), [draftPrice]);
  const draftPriceValid =
    draftPrice.trim().length > 0 && !Number.isNaN(draftPriceValue) && draftPriceValue > 0;

  function openPhotoSheet(productId: string) {
    const product = rows.find((r) => r.product.id === productId)?.product;
    setEditingPhotoId(productId);
    setStagedPhoto(product?.photo);
    openedPhotoRef.current = product?.photo;
    setPhotoError(null);
    setPhotoPreviewOpen(false);
  }

  function closePhotoSheet() {
    setEditingPhotoId(null);
    setStagedPhoto(undefined);
    setPhotoError(null);
    setPhotoPreviewOpen(false);
  }

  function handlePhotoFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError(PHOTO_UNREADABLE_MESSAGE);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setStagedPhoto(typeof reader.result === 'string' ? reader.result : undefined);
      setPhotoError(null);
    };
    reader.onerror = () => setPhotoError(PHOTO_UNREADABLE_MESSAGE);
    reader.readAsDataURL(file);
  }

  function handleGuardarFoto() {
    // A real write only happened if `stagedPhoto` actually differs from the
    // photo the sheet opened with — covers both a new/changed photo and a
    // removal (`Quitar` → `Guardar foto` on a product that had a photo).
    // Comparing against the post-write result would always read as
    // "changed" for a fresh photo but say nothing about a genuine no-op
    // save, which is exactly the case this fix targets — so the diff is
    // taken here, against `openedPhotoRef`, before the write.
    const photoChanged = stagedPhoto !== openedPhotoRef.current;
    if (editingPhotoId) setProductPhoto(editingPhotoId, stagedPhoto);
    closePhotoSheet();
    if (!photoChanged) return;
    // Same ambient near-instant confirmation convention as every other write
    // in this file ("Mercancía registrada", "Mercancía lista para vender") —
    // inventory.md §3.4b explicitly follows §3.10/§3.11's save convention.
    // Fires whether "Guardar foto" committed a photo or committed its
    // removal ("Quitar" → "Guardar foto" is a valid save too, §3.4b) — the
    // toast confirms the write, not any particular resulting content. A
    // no-op "Guardar foto" (nothing staged differently from what the sheet
    // opened with) still closes the sheet but never fires this toast —
    // telling the merchant something changed when it didn't is worse than
    // staying silent (merchant-user-tester finding).
    setToast('Foto guardada');
    window.setTimeout(() => setToast(null), 2400);
  }

  // §2 step 2 / §3.5 — a live check, recomputed every render (never
  // cached): deferring tagging and later selling some of those same
  // untagged units via FIFO in buttons mode must silently shrink this
  // count, not just refresh whenever Asignar Tags itself is reopened.
  // Gate corrected per `decision-log.md` D46: this reads her actual chosen
  // selling mode (`defaultSellingMode === 'nfc'`), never mere nfc capability
  // (`subscriptionTier === 'paid'`) — a Paid merchant who stays in
  // `buttons` mode never sees this nudge.
  const pendingCount = pendingTagCount(state);
  const pendingTagWork = state.business?.defaultSellingMode === 'nfc' && pendingCount > 0;

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Inventario</span>
      </div>
      {toast && <p className={styles.confirmation}>{toast} ✓</p>}

      {settingsTagsBanner && <p className={styles.settingsBanner}>{settingsTagsBanner}</p>}

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
            photo={product.photo}
            price={product.defaultPrice}
            available={available}
            everReceived={everReceived}
            onTapRow={() => onRegisterProduct(product.id)}
            onTapPrice={() => {
              setEditingId(product.id);
              setDraftPrice(String(product.defaultPrice));
            }}
            onTapPhoto={() => openPhotoSheet(product.id)}
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

      {editingPhotoProduct && (
        <Sheet onDismiss={closePhotoSheet}>
          <p className={pickerStyles.sheetTitle}>{editingPhotoProduct.name}</p>
          <p className={pickerStyles.newProductLabel}>Foto (opcional)</p>
          {stagedPhoto ? (
            <div className={styles.photoRow}>
              <button
                type="button"
                className={styles.photoThumbBtn}
                onClick={(e) => {
                  previewTriggerRef.current = e.currentTarget;
                  setPhotoPreviewOpen(true);
                }}
                aria-label={`Ver foto de ${editingPhotoProduct.name} en tamaño grande`}
              >
                <img
                  className={styles.photoThumb}
                  src={stagedPhoto}
                  alt={`Foto de ${editingPhotoProduct.name}`}
                  // A previously-saved photo that fails to render later —
                  // this prototype's storage is browser-local, corruption/
                  // eviction is real (`product-decisions.md` Q23) — falls
                  // back silently to this sheet's own "Agregar foto"
                  // no-photo-yet state, never a broken-image glyph and
                  // never "Cambiar"/"Quitar" against a thumbnail she can't
                  // see.
                  onError={() => {
                    setStagedPhoto(undefined);
                    setPhotoPreviewOpen(false);
                  }}
                />
              </button>
              <button className={styles.linkBtn} onClick={() => photoFileInputRef.current?.click()}>
                Cambiar
              </button>
              <button
                className={styles.linkBtn}
                onClick={() => {
                  setStagedPhoto(undefined);
                  setPhotoError(null);
                }}
              >
                Quitar
              </button>
            </div>
          ) : (
            <>
              <button className={styles.uploadBtn} onClick={() => photoFileInputRef.current?.click()}>
                Agregar foto
              </button>
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
            ref={photoFileInputRef}
            type="file"
            accept="image/*"
            className={styles.hiddenFileInput}
            onChange={handlePhotoFileChange}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Button variant="secondary" onClick={closePhotoSheet}>
              Cancelar
            </Button>
            <Button onClick={handleGuardarFoto}>Guardar foto</Button>
          </div>
        </Sheet>
      )}

      {photoPreviewOpen && stagedPhoto && editingPhotoProduct && (
        <div
          ref={previewOverlayRef}
          className={styles.previewOverlay}
          onClick={() => setPhotoPreviewOpen(false)}
          onKeyDown={(e) => {
            // Sheet.tsx's own Escape-to-dismiss precedent, replicated here
            // since this overlay isn't built on top of Sheet (§3.4b's
            // "simple full-viewport, non-editable large view" doesn't match
            // Sheet's bottom-drawer shape — panel padding, rounded top
            // corners, handle, tearTop). Enter/Space included because this
            // element is the focusable dialog surface itself, not a
            // decorative backdrop.
            //
            // stopPropagation on Escape specifically: this overlay is a DOM
            // sibling of the "Editar foto" Sheet (both gated on
            // editingPhotoProduct), not a descendant, and Sheet's own
            // Escape-to-dismiss listener is bound on `window`, not scoped to
            // its own subtree. Without stopping propagation here, a single
            // Escape keypress bubbles past this handler to Sheet's window
            // listener too, closing the whole "Editar foto" sheet underneath
            // and silently discarding any staged-but-unsaved photo — not
            // just this preview. Enter/Space have no equivalent window-level
            // listener anywhere in this codebase, so they're left to bubble.
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              setPhotoPreviewOpen(false);
            } else if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setPhotoPreviewOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
          aria-label={`Foto de ${editingPhotoProduct.name} en tamaño grande`}
        >
          <img
            className={styles.previewImg}
            src={stagedPhoto}
            alt={`Foto de ${editingPhotoProduct.name}`}
            onClick={(e) => e.stopPropagation()}
            onError={() => {
              setStagedPhoto(undefined);
              setPhotoPreviewOpen(false);
            }}
          />
          <button className={styles.previewClose} onClick={() => setPhotoPreviewOpen(false)}>
            ← Cerrar
          </button>
        </div>
      )}
    </>
  );
}
