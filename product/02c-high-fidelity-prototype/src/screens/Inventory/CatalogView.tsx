import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, matchProductByBarcode, pendingTagCount } from '../../domain/selectors';
import { articulos } from '../../domain/format';
import { CatalogRow } from '../../components/CatalogRow/CatalogRow';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { PhotoCapture } from '../../components/PhotoCapture/PhotoCapture';
import { BarcodeScanner } from '../../components/BarcodeScanner/BarcodeScanner';
import { TagStub } from '../../components/TagStub/TagStub';
import type { Product } from '../../domain/types';
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
  const { state, editPrice, setProductPhoto, setProductBarcode } = useStore();
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
  // Live-found gap (2026-09-15) — `capture="environment"` alone no longer
  // reliably launches the camera on current Chrome/Android; `PhotoCapture`
  // is the fallback-proof alternative, offered alongside the existing file
  // picker rather than replacing it.
  const [cameraOpen, setCameraOpen] = useState(false);
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

  // inventory.md §3.4c-§3.4g "Editar código de barras" (`decision-log.md`
  // D65, 2026-09-16/17 amendment, Paid tier only) — the sheet's own staged
  // state. `Product.barcode` is untouched until "Guardar código de
  // barras" is explicitly tapped; "Cancelar" (from any sub-state) discards
  // whatever was staged and returns the Catalog row exactly as it was.
  const [editingBarcodeId, setEditingBarcodeId] = useState<string | null>(null);
  type BarcodeStage = 'sheet' | 'scanning' | 'conflict' | 'cameraFailure';
  const [barcodeStage, setBarcodeStage] = useState<BarcodeStage>('sheet');
  // A fresh, successful scan that doesn't conflict with a *different*
  // Product (§3.4e) — `undefined` means "nothing staged yet," the exact
  // condition "Guardar código de barras" stays disabled on (§3.4c: "there's
  // no manually-adjustable state here to re-save").
  const [stagedBarcode, setStagedBarcode] = useState<string | undefined>(undefined);
  // §3.4e's recognition display — the *other* Product a scanned code
  // already belongs to, reusing §3.8c's own marker/name/disponibles
  // presentation (`ProductPicker.tsx`'s `confirmScan` mode) verbatim.
  const [barcodeConflict, setBarcodeConflict] = useState<{
    product: Product;
    available: number;
    everReceived: boolean;
  } | null>(null);

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
  const editingBarcodeProduct = rows.find((r) => r.product.id === editingBarcodeId)?.product;
  // inventory.md §2's D65 barcode-scanning gate, extended here verbatim to
  // §3.4's fourth tap zone ("a Free-tier Catalog row keeps its existing
  // three tap zones, nothing added").
  const canEditBarcode = state.business?.subscriptionTier === 'paid';

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

  // inventory.md §3.4c "Editar código de barras" — opened by the Catalog
  // row's fourth tap zone ("⋯"). Resets any residue from a previous open of
  // this same sheet (mirrors openPhotoSheet's own reset discipline).
  function openBarcodeSheet(productId: string) {
    setEditingBarcodeId(productId);
    setStagedBarcode(undefined);
    setBarcodeConflict(null);
    setBarcodeStage('sheet');
  }

  // "Cancelar" (§3.4c) — discards any staged (unsaved) scan and closes the
  // sheet, returning to Catalog view unchanged.
  function closeBarcodeSheet() {
    setEditingBarcodeId(null);
    setStagedBarcode(undefined);
    setBarcodeConflict(null);
    setBarcodeStage('sheet');
  }

  // §3.4d → §3.4c/§3.4e — a successful scan. §3.4c's own text: "A scan
  // matching *no* other Product, or matching this same Product's own
  // already-stored value (a pointless but harmless rescan), stages
  // normally... the uniqueness check is against every *other* Product
  // only, never this one." A match against a *different* Product (§3.4e)
  // is never staged, never offered for Guardar.
  function handleBarcodeScanResult(code: string) {
    const trimmed = code.trim();
    const match = matchProductByBarcode(state.products, trimmed);
    if (match && match.id !== editingBarcodeId) {
      const matchRow = rows.find((r) => r.product.id === match.id);
      setBarcodeConflict({
        product: match,
        available: matchRow?.available ?? 0,
        everReceived: matchRow?.everReceived ?? false,
      });
      setBarcodeStage('conflict');
      return;
    }
    setStagedBarcode(trimmed);
    setBarcodeStage('sheet');
  }

  // "Guardar código de barras" — disabled until a fresh scan has been
  // staged (enforced by the button's own `disabled` prop below); replaces
  // `Product.barcode` outright, no merge, no history. A failed save leaves
  // the sheet open with the staged value intact, the same convention
  // `handleGuardarFoto`/`editPrice`'s own Guardar handler already follow.
  async function handleGuardarBarcode() {
    if (!editingBarcodeId || stagedBarcode === undefined) return;
    const ok = await setProductBarcode(editingBarcodeId, stagedBarcode);
    if (!ok) {
      console.error('[CatalogView] setProductBarcode failed');
      return;
    }
    closeBarcodeSheet();
    // Added specifically because nothing in the Catalog row itself visibly
    // changes to confirm the write succeeded (`Product.barcode` isn't
    // rendered in the row, §3.4) — without this line she'd have no signal
    // at all that "Guardar" did anything.
    setToast('Código de barras actualizado');
    window.setTimeout(() => setToast(null), 2400);
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

  async function handleGuardarFoto() {
    // A real write only happened if `stagedPhoto` actually differs from the
    // photo the sheet opened with — covers both a new/changed photo and a
    // removal (`Quitar` → `Guardar foto` on a product that had a photo).
    // Comparing against the post-write result would always read as
    // "changed" for a fresh photo but say nothing about a genuine no-op
    // save, which is exactly the case this fix targets — so the diff is
    // taken here, against `openedPhotoRef`, before the write.
    const photoChanged = stagedPhoto !== openedPhotoRef.current;
    if (!editingPhotoId) return;
    // Stage 7 Backend Integration, Phase 1 — setProductPhoto is now a real,
    // awaitable Supabase RPC call. On a genuine network/platform failure
    // (no designed error state for this sheet in inventory.md §3.4b), the
    // sheet stays open with her staged photo intact rather than closing on
    // a write that didn't actually happen — logged so the failure is
    // visible, never silently dropped.
    const ok = await setProductPhoto(editingPhotoId, stagedPhoto);
    if (!ok) {
      console.error('[CatalogView] setProductPhoto failed');
      return;
    }
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
            onTapBarcode={canEditBarcode ? () => openBarcodeSheet(product.id) : undefined}
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
              onClick={async () => {
                // Stage 7 Backend Integration, Phase 1 — editPrice is now a
                // real, awaitable Supabase RPC call. On a genuine
                // network/platform failure (no designed error state for
                // this sheet in inventory.md §3.4a), the sheet simply stays
                // open with her typed value intact so tapping "Guardar
                // precio" again retries — logged so the failure is visible,
                // never silently dropped.
                const ok = await editPrice(editingProduct.id, draftPriceValue);
                if (ok) setEditingId(null);
                else console.error('[CatalogView] editPrice failed');
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
              <button className={styles.linkBtn} onClick={() => setCameraOpen(true)}>
                Tomar foto
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
              <div style={{ display: 'flex', gap: 12 }}>
                <button className={styles.uploadBtn} onClick={() => setCameraOpen(true)}>
                  Tomar foto
                </button>
                <button className={styles.uploadBtn} onClick={() => photoFileInputRef.current?.click()}>
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
            ref={photoFileInputRef}
            type="file"
            accept="image/*,android/allowCamera"
            capture="environment"
            className={styles.hiddenFileInput}
            onChange={handlePhotoFileChange}
          />
          {cameraOpen && (
            <PhotoCapture
              onCapture={(dataUrl) => {
                setStagedPhoto(dataUrl);
                setPhotoError(null);
                setCameraOpen(false);
              }}
              onCancel={() => setCameraOpen(false)}
              onUnavailable={() => {
                setCameraOpen(false);
                photoFileInputRef.current?.click();
              }}
            />
          )}
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

      {/* inventory.md §3.4d — "Volver a escanear," cámara activa. Same
          live-camera shape §3.8b already establishes (BarcodeScanner.tsx
          reused verbatim, no new camera surface) — not wrapped in <Sheet>,
          a real camera viewfinder needs the full content area, this
          sheet's own dimmed-backdrop chrome is set aside for as long as
          scanning is active. §3.8b's "Escribir en su lugar" fallback is
          replaced here by "Cancelar" (§3.4d's own explicit adaptation
          note): there is no typed alternative when correcting an
          already-identified Product's barcode. A sustained failed read
          (§3.4g) is handled entirely inside BarcodeScanner itself — the
          live camera view stays exactly as it is, no separate state here. */}
      {editingBarcodeProduct && barcodeStage === 'scanning' && (
        <BarcodeScanner
          backLabel={editingBarcodeProduct.name}
          fallbackLabel="Cancelar"
          onBack={() => setBarcodeStage('sheet')}
          onResult={handleBarcodeScanResult}
          onPermissionDenied={() => setBarcodeStage('cameraFailure')}
        />
      )}

      {/* inventory.md §3.4f — permiso de cámara denegado. Falls back to
          §3.4c unchanged (not a typed-search field, since none exists in
          this context) — reuses ProductPicker's own dedicated
          full-screen fallback chrome (§3.8d's precedent), copy adapted to
          drop the "Escribe el nombre del producto" clause that doesn't
          apply here. */}
      {editingBarcodeProduct && barcodeStage === 'cameraFailure' && (
        <div className={pickerStyles.cameraFailureScreen}>
          <button
            className={pickerStyles.cameraFailureBack}
            onClick={() => setBarcodeStage('sheet')}
          >
            ← {editingBarcodeProduct.name}
          </button>
          <p className={pickerStyles.cameraFailureText}>
            No pudimos usar la cámara.
            <br />
            Revisa los permisos de cámara de tu teléfono e intenta de nuevo.
          </p>
          <Button variant="secondary" onClick={() => setBarcodeStage('sheet')}>
            Cancelar
          </Button>
        </div>
      )}

      {/* inventory.md §3.4e — escaneo, coincide con otro producto
          (conflicto). Extends §3.15's "identifier already claimed by
          someone else, offer a different one, no reassignment" pattern and
          reuses §3.8c's own recognition display (marker/name/disponibles)
          verbatim — same dimmed-backdrop sheet shape as §3.4c itself.
          "Cancelar" returns to §3.4c exactly as it was before this scan
          attempt (nothing here ever touches `stagedBarcode`). */}
      {editingBarcodeProduct && barcodeStage === 'conflict' && barcodeConflict && (
        <Sheet onDismiss={() => setBarcodeStage('sheet')}>
          <p className={pickerStyles.sheetTitle}>
            Este código ya está registrado
            <br />
            en otro producto:
          </p>
          <div className={pickerStyles.confirmProductRow}>
            <TagStub
              name={barcodeConflict.product.name}
              photo={barcodeConflict.product.photo}
              size={48}
            />
            <div>
              <p className={pickerStyles.confirmProductName}>{barcodeConflict.product.name}</p>
              <p className={pickerStyles.confirmProductCaption}>
                {!barcodeConflict.everReceived
                  ? 'sin registrar'
                  : `${barcodeConflict.available} disponibles`}
              </p>
            </div>
          </div>
          <p className={styles.barcodeConflictText}>
            No se puede usar el mismo código en dos productos. Revisa que sea la prenda correcta, o
            escanea otro código.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" onClick={() => setBarcodeStage('sheet')}>
              Cancelar
            </Button>
            <Button onClick={() => setBarcodeStage('scanning')}>Escanear otro código</Button>
          </div>
        </Sheet>
      )}

      {/* inventory.md §3.4c — "Editar código de barras." On-screen heading
          is the Product's name, never the literal string "Editar código de
          barras" (the same CTA/heading-collision avoidance §3.4a/§3.4b
          already establish). "Guardar código de barras" stays disabled
          until a fresh scan has actually been staged — there's no
          manually-editable field here to re-save. */}
      {editingBarcodeProduct && barcodeStage === 'sheet' && (
        <Sheet onDismiss={closeBarcodeSheet}>
          <p className={pickerStyles.sheetTitle}>{editingBarcodeProduct.name}</p>
          <p className={pickerStyles.newProductLabel}>Código de barras</p>
          {stagedBarcode !== undefined ? (
            <div className={styles.barcodeValues}>
              <p className={styles.barcodeCurrent}>
                {editingBarcodeProduct.barcode ?? 'Sin código'}{' '}
                <span className={styles.barcodeTag}>(actual)</span>
              </p>
              <p className={styles.barcodeStaged}>
                {stagedBarcode} <span className={styles.barcodeTag}>(nuevo, sin guardar)</span>
              </p>
            </div>
          ) : (
            <p className={styles.barcodeCurrent}>{editingBarcodeProduct.barcode ?? 'Sin código'}</p>
          )}
          <Button
            variant="secondary"
            className={styles.rescanBtn}
            onClick={() => setBarcodeStage('scanning')}
          >
            Volver a escanear
          </Button>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="secondary" onClick={closeBarcodeSheet}>
              Cancelar
            </Button>
            <Button disabled={stagedBarcode === undefined} onClick={handleGuardarBarcode}>
              Guardar código de barras
            </Button>
          </div>
        </Sheet>
      )}
    </>
  );
}
