import { useMemo, useRef, useState } from 'react';
import { Sheet } from '../Sheet/Sheet';
import { Button } from '../Button/Button';
import { TagStub } from '../TagStub/TagStub';
import { BarcodeScanner } from '../BarcodeScanner/BarcodeScanner';
import { PhotoCapture } from '../PhotoCapture/PhotoCapture';
import { matchProductByBarcode } from '../../domain/selectors';
import { stockCaption } from '../../domain/format';
import type { Product } from '../../domain/types';
import styles from './ProductPicker.module.css';

/** `product-decisions.md` Q23 — verbatim inline failure copy, reused
 * everywhere a selected photo can't be shown. */
const PHOTO_UNREADABLE_MESSAGE = 'No pudimos mostrar ese archivo.';

/** `decision-log.md` D65 — the one Catalog row this picker ever needs
 * beyond a bare `Product`, for §3.8c's confirm-on-scan caption
 * ("12 disponibles" / "sin registrar") — the same derivation `CatalogRow`
 * already renders, reused rather than re-derived. */
type CatalogPickerRow = { product: Product; available: number; everReceived: boolean };

type PickerMode =
  | { kind: 'search' }
  | { kind: 'creating'; name: string }
  /** §3.8a's "vía escaneo, sin coincidencia" variant (D65) — a scanned
   * barcode with no Catalog match. `barcode` is carried here, silently,
   * never shown as its own field. */
  | { kind: 'creatingFromScan'; barcode: string }
  /** §3.8b — the live camera. */
  | { kind: 'scanning' }
  /** §3.8c — a scan resolved to an already-known Product; the one
   * deliberate confirm-before-resolving step this picker carries (§10). */
  | { kind: 'confirmScan'; row: CatalogPickerRow }
  /** §3.8d — camera permission denied/unavailable. A dedicated, minimal
   * full-screen fallback matching the Approved spec's own wireframe
   * exactly (back arrow, failure message, the typed-search field, nothing
   * else) — not a flag layered onto `'search'`'s general sheet, which
   * carries the scan button and the full Catalog list this state
   * deliberately omits. The instant she types anything, this hands off to
   * `'search'` carrying the typed character, since this *is* "§3.8's own
   * typed-search field," reused rather than a second, parallel one. */
  | { kind: 'cameraFailure' };

/**
 * inventory.md §3.8 / §3.8a — Elegir producto. One field resolves both
 * "restock an existing Product" and "this is new" — matching rule:
 * case-insensitive, whitespace-trimmed (never fuzzy). Price is required,
 * with no honest default, only for a genuinely new Product identity (D33) —
 * never re-asked for an existing one. **Foto (opcional), added
 * `product-decisions.md` Q23** — captured optionally alongside Precio for a
 * genuinely new Product only, reusing §3.4b's device-upload mechanism
 * (adapted to this compact sheet field). Never gates "Agregar" — only
 * Precio does.
 *
 * **§3.8b-§3.8e, added `decision-log.md` D65 — phone-camera barcode
 * scanning, a second way to resolve Producto, never replacing the typed
 * path above.** "Escanear código de barras" opens the shared
 * `BarcodeScanner` (real `getUserMedia` + `@zxing/browser` decoding — see
 * that component's own doc comment for the full implementation-choice
 * disclosure) and resolves one of four ways: a known `Product.barcode` →
 * confirm-on-scan (§3.8c, the deliberate exception to this picker's own
 * "never ask twice" resolution — see §10); no match → the scan variant of
 * "nuevo producto" (§3.8a, this component's own `creatingFromScan` mode);
 * camera permission denied/unavailable → falls straight back onto the
 * typed-search field, focused (§3.8d); a sustained failed read → an inline
 * message on the still-live camera (§3.8e). Every branch keeps typing one
 * tap away — this is additive, never a one-way door.
 */
export function ProductPicker({
  rows,
  onDismiss,
  onSelectExisting,
  onCreateNew,
}: {
  rows: CatalogPickerRow[];
  onDismiss: () => void;
  onSelectExisting: (product: Product) => void;
  /** `barcode` (`decision-log.md` D65) — set only when this Product was
   * created via the scan-no-match path; `undefined` for the typed path,
   * exactly like `photo` when none was selected. */
  onCreateNew: (name: string, price: number, photo?: string, barcode?: string) => void;
}) {
  const products = rows.map((r) => r.product);

  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<PickerMode>({ kind: 'search' });

  // Shared by both "new Product" sub-flows (typed and scanned-no-match) —
  // the identical Precio/Foto capture, D33/Q23, reset fresh every time
  // either sub-flow is entered.
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [photoError, setPhotoError] = useState<string | null>(null);
  // Only meaningful in `creatingFromScan` — a scan carries no human-readable
  // name (D65: no external barcode lookup), so she types it herself here,
  // the one genuinely missing fact a scan can't supply.
  const [scanName, setScanName] = useState('');
  const photoFileInputRef = useRef<HTMLInputElement | null>(null);
  // Live-found gap (2026-09-15, Product Owner-reported): this picker's own
  // inline "new Product" Foto field never got the `PhotoCapture` fix
  // `CatalogView.tsx`/`BusinessIdentity.tsx`/`SellingGroups.tsx` already
  // received — `capture="environment"` alone no longer reliably launches
  // the camera on current Chrome/Android, and this field didn't even carry
  // that attempt. Same fix, same pattern: `PhotoCapture` offered alongside
  // the existing file picker, never replacing it.
  const [cameraOpen, setCameraOpen] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const exactMatch = products.find((p) => p.name.trim().toLowerCase() === normalizedQuery);
  const visible = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(normalizedQuery))
    : products;

  const showAddNew = normalizedQuery.length > 0 && !exactMatch;

  const priceValue = useMemo(() => parseFloat(price), [price]);
  const priceValid = price.trim().length > 0 && !Number.isNaN(priceValue) && priceValue > 0;
  const scanNameValid = scanName.trim().length > 0;

  function beginCreating(name: string) {
    setPrice('');
    setPhoto(undefined);
    setPhotoError(null);
    setMode({ kind: 'creating', name });
  }

  function beginCreatingFromScan(barcode: string) {
    setPrice('');
    setPhoto(undefined);
    setPhotoError(null);
    setScanName('');
    setMode({ kind: 'creatingFromScan', barcode });
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
      setPhoto(typeof reader.result === 'string' ? reader.result : undefined);
      setPhotoError(null);
    };
    reader.onerror = () => setPhotoError(PHOTO_UNREADABLE_MESSAGE);
    reader.readAsDataURL(file);
  }

  function handleScanResult(code: string) {
    const matchedProduct = matchProductByBarcode(products, code);
    const match = matchedProduct && rows.find((r) => r.product.id === matchedProduct.id);
    if (match) {
      setMode({ kind: 'confirmScan', row: match });
    } else {
      beginCreatingFromScan(code.trim());
    }
  }

  // Shared Foto (opcional) field markup — identical for the typed and
  // scanned-no-match "new Product" sub-flows (§3.8a's own text: "Foto stays
  // optional, identical to the typed path").
  function renderPhotoField() {
    return (
      <>
        <p className={styles.newProductLabel}>Foto (opcional)</p>
        {photo ? (
          <div className={styles.photoRow}>
            <img className={styles.photoThumb} src={photo} alt="" />
            <button className={styles.linkBtn} onClick={() => setCameraOpen(true)}>
              Tomar foto
            </button>
            <button className={styles.linkBtn} onClick={() => photoFileInputRef.current?.click()}>
              Cambiar
            </button>
            <button
              className={styles.linkBtn}
              onClick={() => {
                setPhoto(undefined);
                setPhotoError(null);
              }}
            >
              Quitar
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <button className={styles.uploadBtn} onClick={() => setCameraOpen(true)}>
              Tomar foto
            </button>
            <button className={styles.uploadBtn} onClick={() => photoFileInputRef.current?.click()}>
              Agregar foto
            </button>
          </div>
        )}
        {photoError && (
          <p className={styles.photoErrorText}>
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
              setPhoto(dataUrl);
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
      </>
    );
  }

  // §3.8b — live camera. Not wrapped in <Sheet>: a real camera viewfinder
  // needs the full content area, not a bottom-drawer panel (see
  // BarcodeScanner's own doc comment) — this picker's dimmed-backdrop sheet
  // chrome is set aside for as long as scanning is active, resumed the
  // instant she backs out or a scan resolves.
  if (mode.kind === 'scanning') {
    return (
      <BarcodeScanner
        backLabel="Elegir producto"
        fallbackLabel="Escribir en su lugar"
        onBack={() => setMode({ kind: 'search' })}
        onResult={handleScanResult}
        onPermissionDenied={() => setMode({ kind: 'cameraFailure' })}
      />
    );
  }

  // §3.8d — camera permission denied/unavailable. A dedicated, minimal
  // full-screen fallback (not `<Sheet>` — same "set the dimmed-backdrop
  // sheet chrome aside" posture §3.8b's own live camera already takes)
  // showing only the failure message and the typed-search field, already
  // focused, matching the Approved spec's wireframe with nothing added.
  if (mode.kind === 'cameraFailure') {
    return (
      <div className={styles.cameraFailureScreen}>
        <button className={styles.cameraFailureBack} onClick={() => setMode({ kind: 'search' })}>
          ← Elegir producto
        </button>
        <p className={styles.cameraFailureText}>
          No pudimos usar la cámara.
          <br />
          Escribe el nombre del producto o revisa los permisos de cámara de tu teléfono.
        </p>
        <input
          className={styles.search}
          placeholder="Buscar o escribir…"
          autoFocus
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            // The instant she types, this *is* §3.8's own typed-search
            // field — hand off to the full search sheet (list, add-new,
            // scan button) carrying what she's already typed, rather than
            // building a second, parallel search experience here.
            if (value.trim().length > 0) setMode({ kind: 'search' });
          }}
        />
      </div>
    );
  }

  // §3.8c — confirm-on-scan. The one deliberate exception to this picker's
  // own "never ask twice" resolution (§10): a barcode is a fact she doesn't
  // author or control the way a typed name is.
  if (mode.kind === 'confirmScan') {
    const { product, available, everReceived } = mode.row;
    // §3.4's binding count-caption rule, which names this recognition
    // display (§3.8c) among the surfaces it governs: singular at exactly N=1.
    const caption = stockCaption(available, everReceived);
    return (
      <Sheet onDismiss={onDismiss}>
        <p className={styles.sheetTitle}>Encontramos este producto:</p>
        <div className={styles.confirmProductRow}>
          <TagStub name={product.name} photo={product.photo} size={48} />
          <div>
            <p className={styles.confirmProductName}>{product.name}</p>
            <p className={styles.confirmProductCaption}>{caption}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setMode({ kind: 'scanning' })}>
            No es este
          </Button>
          <Button
            onClick={() => {
              onSelectExisting(product);
            }}
          >
            Sí, es este
          </Button>
        </div>
      </Sheet>
    );
  }

  if (mode.kind === 'creating' || mode.kind === 'creatingFromScan') {
    const isScanVariant = mode.kind === 'creatingFromScan';
    const canSubmit = isScanVariant ? scanNameValid && priceValid : priceValid;
    return (
      <Sheet onDismiss={onDismiss}>
        {isScanVariant ? (
          <>
            <p className={styles.sheetTitle}>
              Código escaneado — no lo
              <br />
              tenemos registrado todavía
            </p>
            <label className={styles.newProductLabel} htmlFor="product-picker-scan-name">
              Nombre del producto
            </label>
            <input
              id="product-picker-scan-name"
              className={styles.search}
              autoFocus
              value={scanName}
              onChange={(e) => setScanName(e.target.value)}
            />
          </>
        ) : (
          <>
            <p className={styles.sheetTitle}>¿Qué llegó?</p>
            <p className={styles.newProductLabel}>Nuevo producto: {mode.name}</p>
          </>
        )}
        <label className={styles.newProductLabel} htmlFor="product-picker-price">
          Precio
        </label>
        <div className={styles.priceField}>
          <span className={styles.pesoSign}>$</span>
          <input
            id="product-picker-price"
            className={styles.priceInput}
            type="number"
            inputMode="decimal"
            placeholder="Precio"
            autoFocus={!isScanVariant}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        {renderPhotoField()}
        {isScanVariant ? (
          <Button disabled={!canSubmit} onClick={() => onCreateNew(scanName.trim(), priceValue, photo, mode.barcode)}>
            Agregar producto
          </Button>
        ) : (
          <Button disabled={!canSubmit} onClick={() => onCreateNew(mode.name, priceValue, photo)}>
            Agregar "{mode.name}"
          </Button>
        )}
      </Sheet>
    );
  }

  return (
    <Sheet onDismiss={onDismiss}>
      <p className={styles.sheetTitle}>¿Qué llegó?</p>
      <input
        className={styles.search}
        placeholder="Buscar o escribir…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <button className={styles.scanBtn} onClick={() => setMode({ kind: 'scanning' })}>
        Escanear código de barras
      </button>
      {showAddNew && (
        <button className={`${styles.addNew} stitchBottom`} onClick={() => beginCreating(query.trim())}>
          + Agregar "{query.trim()}" como producto nuevo
        </button>
      )}
      <div className={styles.list}>
        {visible.length === 0 && !showAddNew && (
          <p className={styles.empty}>
            {products.length === 0 ? 'Escribe el nombre de lo que llegó.' : 'Sin resultados.'}
          </p>
        )}
        {visible.map((p) => (
          <button key={p.id} className={`${styles.option} stitchBottom`} onClick={() => onSelectExisting(p)}>
            <TagStub name={p.name} photo={p.photo} size={30} />
            {p.name}
          </button>
        ))}
      </div>
    </Sheet>
  );
}
