import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, matchProductByBarcode, pendingTagCount } from '../../domain/selectors';
import { CatalogRow } from '../../components/CatalogRow/CatalogRow';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { PhotoCapture } from '../../components/PhotoCapture/PhotoCapture';
import { BarcodeScanner } from '../../components/BarcodeScanner/BarcodeScanner';
import { TagStub } from '../../components/TagStub/TagStub';
import type { ID, Product } from '../../domain/types';
import styles from './CatalogView.module.css';
import pickerStyles from '../../components/ProductPicker/ProductPicker.module.css';

/** `product-decisions.md` Q23 — verbatim inline failure copy, reused
 * everywhere a selected/stored photo can't be shown (`inventory.md` §3.4b,
 * `onboarding.md` §3.5b/§3.5c, `inventory.md` §3.8a). */
const PHOTO_UNREADABLE_MESSAGE = 'No pudimos mostrar ese archivo.';

/**
 * inventory.md §3.4a/§3.4b/§3.4c each state that their own "Guardar" follows
 * "the same near-instant/slow/error save convention as every other write in
 * this document (§3.10/§3.11)." Before 2026-09-19 none of the three sheets
 * actually had one: a failed save only reached `console.error`, the sheet
 * just stayed open, and the merchant got no message, no retry, and nothing
 * telling her it hadn't saved — a failed save that looked exactly like a
 * successful one, minus the sheet closing.
 *
 * One shared state machine for all three sheets (they save the same way and
 * fail the same way — three copies of it would be three things to drift):
 * - `idle`   — at rest, or back at rest after a success.
 * - `saving` — write in flight, under the slow threshold: **silent**,
 *              §3.10's own "near-instant: silent" half. The only visible
 *              effect is that the sheet's controls go inert, so a second tap
 *              can't start a second attempt.
 * - `slow`   — still in flight past ~1.5s: one plain "Guardando…" line,
 *              §3.10's slow half, same copy/shape every other slow save in
 *              this codebase already uses.
 * - `error`  — the write came back rejected/failed: §3.11's plain-Spanish
 *              line plus "Reintentar," with her staged value still on screen
 *              and untouched.
 */
type SheetSaveState = 'idle' | 'saving' | 'slow' | 'error';

/** §3.10's own ">~1.5s" slow threshold, the identical value this screen's
 * NFC row toggle (`handleToggleNfc` below) and `PersonalParaEsteEvento.tsx`
 * already use. */
const SLOW_THRESHOLD_MS = 1500;

/** §3.11's own failure line, adapted for an edit sheet. §3.11's literal
 * wording names the merchandise being registered ("No se pudo guardar.
 * Bolsas sigue aquí, intenta de nuevo."); what's preserved here isn't the
 * Product — it never went anywhere — but her staged edit, so this reuses the
 * exact string this codebase already uses for that same meaning in
 * `MercanciaParaEsteEvento.tsx`/`EventDetail.tsx` rather than inventing a
 * fourth phrasing. Same register, same "your work is still here" promise. */
const SAVE_FAILED_MESSAGE = 'No se pudo guardar. Tus cambios siguen aquí, intenta de nuevo.';

/** True while a write is genuinely in flight (either half of §3.10). */
function isInFlight(saveState: SheetSaveState) {
  return saveState === 'saving' || saveState === 'slow';
}

/**
 * inventory.md §3.4 — Catalog view. Product + available count only, never a
 * Lot/InventoryUnit reference. Price is its own tap target (§3.4a, D33).
 * **There is exactly one Catalog view now (2026-09-17 live pass)** —
 * §3.5/§3.17's former combined, cross-Catalog "Continuar etiquetando"
 * variant (promoted primary action, demoted "Registrar mercancía") is
 * retired outright, its role folded into §3.4's own per-row sixth tap zone
 * (the `[ N sin etiquetar ]` resume indicator, rendered by `CatalogRow`
 * itself below, live-computed per row). "Registrar mercancía" stays the
 * one, unconditional primary action in this view's own footer.
 */
export function CatalogView({
  onRegister,
  onRegisterProduct,
  onOpenAssignTagsForProduct,
  onStartNfcAssignScan,
  confirmationMessage,
  confirmationDetail,
  settingsTagsBanner,
}: {
  onRegister: () => void;
  onRegisterProduct: (productId: string) => void;
  /** inventory.md §3.14's entry point 3 (2026-09-17 live pass) — the fifth
   * zone's toggle-ON auto-open and the sixth zone's resume tap both call
   * this, scoped to one Product's own pending units. */
  onOpenAssignTagsForProduct: (productId: string) => void;
  /** 2026-09-18 architecture fix (`decision-log.md` D74/D75 follow-up) —
   * `nfcAssignSession.startScan` (`useNfcAssignTagSession.ts`), threaded
   * down from `App.tsx` via `InventoryScreen.tsx`. Called synchronously,
   * right alongside `onOpenAssignTagsForProduct` at both of this screen's
   * own tap sites below, so the real `NDEFReader.scan()` call happens
   * inside the same tap that semantically starts tagging — never deferred
   * into `AssignTags.tsx`'s own mount effect after the navigation, the
   * unreliable shape this fix replaces. See the hook's own doc comment for
   * the full reasoning. */
  onStartNfcAssignScan: () => Promise<void>;
  confirmationMessage?: string | null;
  /** inventory.md §3.13's mixed-Lot completion-copy variant
   * (`decision-log.md` D71) — an optional second line rendered directly
   * beneath `confirmationMessage`, e.g. "Camisas ya está etiquetada. Plumas
   * no necesita tag — se vende con botones, y ya está lista." Only ever
   * accompanies the "Mercancía lista para vender" message, on the same
   * fade lifecycle; `undefined`/`null` renders nothing extra, the plain,
   * undifferentiated confirmation §3.13 already had before D71. */
  confirmationDetail?: string | null;
  /** inventory.md §3.3a/§3.4 (`decision-log.md` D46 Addendum) — the one-time
   * ambient banner shown when this view was reached via `settings.md` §2.6's
   * "Cambiar a vender con tags" handoff and step 0 found nothing to
   * auto-route her into. Rendered once, prepended above the Catalog list,
   * never re-shown afterward — the caller (`InventoryScreen`) owns the
   * "shown exactly once" discipline, this component only renders whatever
   * it's handed. */
  settingsTagsBanner?: string | null;
}) {
  const { state, editPrice, setProductPhoto, setProductBarcode, setProductNfcTaggingEnabled } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState('');
  // §3.4a's own near-instant/slow/error save state (§3.10/§3.11).
  const [priceSaveState, setPriceSaveState] = useState<SheetSaveState>('idle');
  /** One idempotency key per logical "Guardar precio" attempt, mirroring
   * `RegisterMerchandise.tsx`'s own `commitIdempotencyKeyRef` exactly:
   * minted when an attempt starts, **reused unchanged across a "Reintentar"
   * tap of that same attempt**, cleared on success and on any edit that
   * changes what would be saved (a different typed price is a different
   * attempt, not a retry of this one). `editPrice` no longer mints one
   * internally, which is what made every retry look like a fresh request. */
  const priceKeyRef = useRef<string | null>(null);
  const [toast, setToast] = useState<string | null>(confirmationMessage ?? null);
  const [toastDetail, setToastDetail] = useState<string | null>(confirmationDetail ?? null);

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
  // §3.4b's own near-instant/slow/error save state (§3.10/§3.11). Distinct
  // from `photoError` immediately above, which is the *selection*-time
  // "No pudimos mostrar ese archivo." failure — a different failure, at a
  // different moment, with a different recovery.
  const [photoSaveState, setPhotoSaveState] = useState<SheetSaveState>('idle');
  /** One idempotency key per logical "Guardar foto" attempt — same
   * discipline as `priceKeyRef` above. Cleared on success and whenever the
   * staged photo itself changes (a different photo, or a "Quitar," is a
   * different attempt). */
  const photoKeyRef = useRef<string | null>(null);
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
  // §3.4c's own near-instant/slow/error save state (§3.10/§3.11). Only ever
  // reached from `barcodeStage === 'sheet'` — the scanning/conflict/camera
  // sub-states have no write of their own.
  const [barcodeSaveState, setBarcodeSaveState] = useState<SheetSaveState>('idle');
  /** One idempotency key per logical "Guardar código de barras" attempt —
   * same discipline as `priceKeyRef`/`photoKeyRef` above. Cleared on success
   * and whenever a *new* code is staged by a fresh scan. Matters more here
   * than anywhere else on this screen: §3.4c's own "residual, accepted race"
   * (another device claiming the identical code mid-attempt) is exactly the
   * case where a retry must arrive as the same request, not a second one. */
  const barcodeKeyRef = useRef<string | null>(null);

  // inventory.md §3.4's fifth tap zone (`decision-log.md` D71) — the
  // NFC-eligibility switch's own per-row save state. Per-row grain (a
  // `Record`/`Set` keyed by `Product.id`), same shape
  // `PersonalParaEsteEvento.tsx`'s own per-row save/slow/error mechanic
  // already establishes for an identical "several independent rows, each
  // saved on its own" screen — each row's tap is independent, never
  // blocking any other row.
  const [nfcSavingIds, setNfcSavingIds] = useState<Set<ID>>(new Set());
  const [nfcSlowIds, setNfcSlowIds] = useState<Set<ID>>(new Set());
  const [nfcErrorIds, setNfcErrorIds] = useState<Set<ID>>(new Set());

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
      setToastDetail(confirmationDetail ?? null);
      const t = window.setTimeout(() => {
        setToast(null);
        setToastDetail(null);
      }, 2400);
      return () => window.clearTimeout(t);
    }
  }, [confirmationMessage, confirmationDetail]);

  const rows = catalogRows(state);
  const editingProduct = rows.find((r) => r.product.id === editingId)?.product;
  const editingPhotoProduct = rows.find((r) => r.product.id === editingPhotoId)?.product;
  const editingBarcodeProduct = rows.find((r) => r.product.id === editingBarcodeId)?.product;
  // inventory.md §2's D65 barcode-scanning gate, extended here verbatim to
  // §3.4's fourth tap zone ("a Free-tier Catalog row keeps its existing
  // three tap zones, nothing added").
  const canEditBarcode = state.business?.subscriptionTier === 'paid';
  // inventory.md §3.4's fifth tap zone — "precise gating condition, stated
  // in full": `nfcPerProductEnabled` AND `nfc ∈ registrationMode`, checked
  // explicitly rather than assumed redundant (a since-downgraded Business
  // keeps `nfcPerProductEnabled = true` stored but no longer has
  // `subscriptionTier = 'paid'` — §3.4's own reasoning for checking both).
  // The third clause (no `barcode`) is per-Product, applied per row below.
  // `decision-log.md` D73 corrects a same-night regression: a prior pass
  // (2026-09-17) also required `defaultSellingMode !== 'nfc'` here, on the
  // now-disproven premise that whole-Catalog "Con tags" mode already
  // qualified every Product via D46's composed-test disjunct — D73 drops
  // that disjunct entirely, so this row's own visibility no longer reads
  // `defaultSellingMode` at all; it's governed purely by
  // `nfcPerProductEnabled` + `subscriptionTier`, matching `isNfcTaggingEligible`
  // (`src/domain/selectors.ts`) exactly.
  const nfcPerProductAvailable =
    state.business?.nfcPerProductEnabled === true && state.business?.subscriptionTier === 'paid';

  // §3.4's own save-state discipline — a bare tap dims that one row
  // (near-instant: silent; slow >~1.5s: "Guardando…" label), reverting to
  // its last-saved state and showing an inline retry line on failure. The
  // switch itself is the retry — no separate "Reintentar" control.
  async function handleToggleNfc(productId: ID, nextEnabled: boolean) {
    setNfcSavingIds((s) => new Set(s).add(productId));
    setNfcErrorIds((s) => {
      if (!s.has(productId)) return s;
      const next = new Set(s);
      next.delete(productId);
      return next;
    });
    const slowTimer = window.setTimeout(() => {
      setNfcSlowIds((s) => new Set(s).add(productId));
    }, 1500);
    const ok = await setProductNfcTaggingEnabled(productId, nextEnabled);
    window.clearTimeout(slowTimer);
    setNfcSlowIds((s) => {
      if (!s.has(productId)) return s;
      const next = new Set(s);
      next.delete(productId);
      return next;
    });
    setNfcSavingIds((s) => {
      const next = new Set(s);
      next.delete(productId);
      return next;
    });
    if (!ok) {
      console.error('[CatalogView] setProductNfcTaggingEnabled failed');
      setNfcErrorIds((s) => new Set(s).add(productId));
      return;
    }
    if (!nextEnabled) return; // turning OFF never hands off anywhere (§3.4's own unchanged invariant)

    // Corrected 2026-09-17 (Product Owner decision, live) — turning this
    // switch ON now auto-enters Asignar Tags directly, Product-scoped,
    // exactly when there's already something to tag (`inventory.md` §3.4's
    // own corrected text: "a tap dims the row → on a successful save, if
    // this Product currently has ≥1 available, untagged unit... she's taken
    // straight into Asignar Tags"). Computed here against the *raw* unit
    // set, deliberately not `pendingTagCount(state, productId)` (which
    // additionally requires `isNfcTaggingEligible`, i.e.
    // `product.nfcTaggingEnabled === true`) — `state` in this closure was
    // captured at this render and never updates in place mid-async-function;
    // `setProductNfcTaggingEnabled`'s own `applyWriteMirror` triggers a
    // fresh render of a *future* CatalogView instance, not this one. But
    // toggling NFC on never changes which units exist or their
    // available/tagId state, only whether they now *count* as eligible — so
    // reading the raw available/untagged count already on hand, rather than
    // waiting on a `state` that will never refresh inside this closure, is
    // both correct and race-free: the write already succeeded (`ok`), and
    // `nfcTaggingEnabled` is now `true` for this Product server-side, since
    // this call is the one that just set it.
    const rawPendingUnits = state.units.filter(
      (u) => u.productId === productId && u.status === 'available' && u.tagId == null,
    ).length;
    if (rawPendingUnits > 0) {
      // 2026-09-18 architecture fix — `startScan()` called synchronously,
      // immediately before the navigation it's paired with, right here in
      // the resolved-RPC continuation of the same handler the original tap
      // invoked. Not literally inside the click's own synchronous callstack
      // (this line only runs after `await setProductNfcTaggingEnabled(...)`
      // above resolves) — but Chromium's transient-activation budget is a
      // genuine 5-second wall-clock window from the original gesture, not a
      // same-callstack requirement (`useNfcAssignTagSession.ts`'s own doc
      // comment), and this removes the one hop that was actually unreliable:
      // starting the scan from a *newly-mounted component's own effect*
      // after an additional React render/commit cycle on top of this RPC's
      // own latency. Fire-and-forget (never awaited) — `onOpenAssignTagsForProduct`
      // right below must not wait on it; `startScan`'s own internal guard
      // makes it safe to call unconditionally, and `AssignTags.tsx`'s mount
      // effect finds it already started (or starting) and no-ops.
      void onStartNfcAssignScan();
      onOpenAssignTagsForProduct(productId);
    }
    // Zero eligible units right now (nothing yet received, or everything
    // already tagged) — the row simply un-dims in place, exactly as before;
    // an empty tagging queue is never shown as a landing state (D46's own
    // rule, restated at the per-Product level).
  }

  /**
   * The one save runner all three edit sheets (§3.4a/§3.4b/§3.4c) go
   * through — §3.10's near-instant/slow split and §3.11's error state, in
   * one place. Structurally the same `runWrite` shape
   * `PersonalParaEsteEvento.tsx` already establishes for an identical
   * "independent write, its own save/slow/error surface" case, and the same
   * shape `handleToggleNfc` above uses for the row toggle — deliberately not
   * a fourth pattern.
   *
   * The `commit` callback owns the actual store call, so each sheet keeps
   * its own idempotency key and its own arguments; this function only owns
   * the timing and the visible state. Resolves the write's own boolean so
   * the caller can run its success path (close the sheet, fire the ambient
   * confirmation) only when the write genuinely succeeded.
   */
  async function runSheetSave(
    setSaveState: (next: SheetSaveState) => void,
    label: string,
    commit: () => Promise<boolean>,
  ): Promise<boolean> {
    setSaveState('saving');
    const slowTimer = window.setTimeout(() => setSaveState('slow'), SLOW_THRESHOLD_MS);
    const ok = await commit();
    window.clearTimeout(slowTimer);
    if (!ok) {
      console.error(`[CatalogView] ${label} failed`);
      setSaveState('error');
      return false;
    }
    setSaveState('idle');
    return true;
  }

  const draftPriceValue = useMemo(() => parseFloat(draftPrice), [draftPrice]);
  const draftPriceValid =
    draftPrice.trim().length > 0 && !Number.isNaN(draftPriceValue) && draftPriceValue > 0;

  // §3.4a — opened by the Catalog row's price tap zone. Resets any residue
  // from a previous open (same reset discipline `openPhotoSheet`/
  // `openBarcodeSheet` below already follow), including a stale save state
  // and a stale idempotency key: a new open is always a new attempt.
  function openPriceSheet(product: Product) {
    setEditingId(product.id);
    setDraftPrice(String(product.defaultPrice));
    setPriceSaveState('idle');
    priceKeyRef.current = null;
  }

  // "Cancelar" (§3.4a) — discards the edit and returns unchanged.
  function closePriceSheet() {
    setEditingId(null);
    setPriceSaveState('idle');
    priceKeyRef.current = null;
  }

  // Typing a different price makes this a different attempt, not a retry of
  // the failed one — so the key is dropped and any error line clears, the
  // same `resetSaveAttempt` discipline `RegisterMerchandise.tsx` applies to
  // every control that changes what would be saved.
  function handleDraftPriceChange(next: string) {
    setDraftPrice(next);
    priceKeyRef.current = null;
    setPriceSaveState((s) => (s === 'error' ? 'idle' : s));
  }

  // "Guardar precio" (§3.4a) — writes `Product.defaultPrice` and closes back
  // to the Catalog view, updated. A failed save leaves the sheet open with
  // her typed value intact, now with §3.11's own visible message and
  // "Reintentar" instead of the silent nothing this used to do.
  async function handleGuardarPrecio() {
    if (!editingId || !draftPriceValid) return;
    if (!priceKeyRef.current) priceKeyRef.current = crypto.randomUUID();
    const key = priceKeyRef.current;
    const ok = await runSheetSave(setPriceSaveState, 'editPrice', () =>
      editPrice(editingId, draftPriceValue, key),
    );
    if (!ok) return;
    // Success — this attempt is over; a future edit mints its own key.
    priceKeyRef.current = null;
    setEditingId(null);
  }

  function openPhotoSheet(productId: string) {
    const product = rows.find((r) => r.product.id === productId)?.product;
    setEditingPhotoId(productId);
    setStagedPhoto(product?.photo);
    openedPhotoRef.current = product?.photo;
    setPhotoError(null);
    setPhotoPreviewOpen(false);
    setPhotoSaveState('idle');
    photoKeyRef.current = null;
  }

  function closePhotoSheet() {
    setEditingPhotoId(null);
    setStagedPhoto(undefined);
    setPhotoError(null);
    setPhotoPreviewOpen(false);
    setPhotoSaveState('idle');
    photoKeyRef.current = null;
  }

  // Staging a different photo (or removing one) makes this a different
  // attempt, not a retry — same reasoning as `handleDraftPriceChange` above.
  function stagePhoto(next: string | undefined) {
    setStagedPhoto(next);
    photoKeyRef.current = null;
    setPhotoSaveState((s) => (s === 'error' ? 'idle' : s));
  }

  // inventory.md §3.4c "Editar código de barras" — opened by the Catalog
  // row's fourth tap zone ("⋯"). Resets any residue from a previous open of
  // this same sheet (mirrors openPhotoSheet's own reset discipline).
  function openBarcodeSheet(productId: string) {
    setEditingBarcodeId(productId);
    setStagedBarcode(undefined);
    setBarcodeConflict(null);
    setBarcodeStage('sheet');
    setBarcodeSaveState('idle');
    barcodeKeyRef.current = null;
  }

  // "Cancelar" (§3.4c) — discards any staged (unsaved) scan and closes the
  // sheet, returning to Catalog view unchanged.
  function closeBarcodeSheet() {
    setEditingBarcodeId(null);
    setStagedBarcode(undefined);
    setBarcodeConflict(null);
    setBarcodeStage('sheet');
    setBarcodeSaveState('idle');
    barcodeKeyRef.current = null;
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
    // A freshly-scanned code is a different attempt, not a retry of the
    // failed one — same reasoning as `handleDraftPriceChange`/`stagePhoto`.
    barcodeKeyRef.current = null;
    setBarcodeSaveState((s) => (s === 'error' ? 'idle' : s));
  }

  // "Guardar código de barras" — disabled until a fresh scan has been
  // staged (enforced by the button's own `disabled` prop below); replaces
  // `Product.barcode` outright, no merge, no history. A failed save leaves
  // the sheet open with the staged value intact — and, since 2026-09-19,
  // with §3.11's own visible message and "Reintentar" rather than the silent
  // nothing this used to do; the same convention `handleGuardarPrecio`/
  // `handleGuardarFoto` now follow.
  async function handleGuardarBarcode() {
    if (!editingBarcodeId || stagedBarcode === undefined) return;
    if (!barcodeKeyRef.current) barcodeKeyRef.current = crypto.randomUUID();
    const key = barcodeKeyRef.current;
    const ok = await runSheetSave(setBarcodeSaveState, 'setProductBarcode', () =>
      setProductBarcode(editingBarcodeId, stagedBarcode, key),
    );
    if (!ok) return;
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
      stagePhoto(typeof reader.result === 'string' ? reader.result : undefined);
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
    // Stage 7 Backend Integration, Phase 1 — setProductPhoto is a real,
    // awaitable Supabase RPC call. On a genuine network/platform failure the
    // sheet stays open with her staged photo intact rather than closing on a
    // write that didn't actually happen — and, since 2026-09-19, that
    // failure is now *visible* (§3.4b's own "same near-instant/slow/error
    // save convention... §3.10/§3.11"), not merely logged to a console she
    // will never open.
    if (!photoKeyRef.current) photoKeyRef.current = crypto.randomUUID();
    const key = photoKeyRef.current;
    const ok = await runSheetSave(setPhotoSaveState, 'setProductPhoto', () =>
      setProductPhoto(editingPhotoId, stagedPhoto, key),
    );
    if (!ok) return;
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

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Inventario</span>
      </div>
      {toast && <p className={styles.confirmation}>{toast} ✓</p>}
      {toast && toastDetail && <p className={styles.confirmationDetail}>{toastDetail}</p>}

      {settingsTagsBanner && <p className={styles.settingsBanner}>{settingsTagsBanner}</p>}

      <div className={styles.list}>
        {rows.map(({ product, available, everReceived }) => {
          const pendingTagRowCount = pendingTagCount(state, product.id);
          return (
            <CatalogRow
              key={product.id}
              name={product.name}
              photo={product.photo}
              price={product.defaultPrice}
              available={available}
              everReceived={everReceived}
              onTapRow={() => onRegisterProduct(product.id)}
              onTapPrice={() => openPriceSheet(product)}
              onTapPhoto={() => openPhotoSheet(product.id)}
              onTapBarcode={canEditBarcode ? () => openBarcodeSheet(product.id) : undefined}
              reserveNfcSlot={nfcPerProductAvailable}
              // inventory.md §3.4's sixth tap zone (2026-09-17 live pass) —
              // live-computed per row, every render, never cached: this
              // Product currently has ≥1 available, untagged, NFC-tagging-
              // eligible unit (the same `isNfcTaggingEligible` test
              // `pendingTagCount` already applies whole-Catalog,
              // `selectors.ts`, now narrowed to this one Product).
              // `decision-log.md` D73 drops the eligibility test's earlier
              // `defaultSellingMode === 'nfc'` disjunct entirely, so this
              // row now renders purely off this Product's own
              // `nfcTaggingEnabled` opt-in, regardless of
              // `defaultSellingMode`. Pure navigation, never touches
              // `Product.nfcTaggingEnabled`.
              pendingTag={
                pendingTagRowCount > 0
                  ? {
                      count: pendingTagRowCount,
                      // 2026-09-18 architecture fix — this tap is itself the
                      // literal, synchronous user gesture (no `await` in
                      // between, unlike the toggle-ON site above), the exact
                      // same shape `Selling.tsx`'s "Leer con NFC"/
                      // `MercanciaParaEsteEvento.tsx`'s scanner-open button
                      // already use: `handleScan()`/`startScan()` called
                      // directly inside the same `onClick`, no navigation, no
                      // new-component-mount gap. `onStartNfcAssignScan`
                      // fire-and-forget before `onOpenAssignTagsForProduct`
                      // — the Product Owner's own instruction, "the action
                      // that semantically starts the NFC operation should
                      // start listening," applies most literally right here.
                      onTap: () => {
                        void onStartNfcAssignScan();
                        onOpenAssignTagsForProduct(product.id);
                      },
                    }
                  : undefined
              }
              nfcToggle={
                nfcPerProductAvailable && !product.barcode
                  ? {
                      enabled: product.nfcTaggingEnabled,
                      saving: nfcSavingIds.has(product.id),
                      slow: nfcSlowIds.has(product.id),
                      error: nfcErrorIds.has(product.id),
                      onTap: () => void handleToggleNfc(product.id, !product.nfcTaggingEnabled),
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      <div className={`${styles.footer} stitchTop`}>
        {/* inventory.md §3.4 (2026-09-17 live pass) — "Registrar mercancía"
            is now the one, unconditional primary action in every Catalog
            view state; the former pending-tag-work variant that demoted it
            to secondary (§3.5/§3.17) is retired. */}
        <Button variant="primary" onClick={onRegister}>
          Registrar mercancía
        </Button>
      </div>

      {editingProduct && (
        // While a write is in flight the sheet can't be dismissed by
        // backdrop tap or Escape (`onDismiss` withheld) — closing it
        // mid-write is exactly how a save becomes silent again.
        <Sheet onDismiss={isInFlight(priceSaveState) ? undefined : closePriceSheet}>
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
              disabled={isInFlight(priceSaveState)}
              onChange={(e) => handleDraftPriceChange(e.target.value)}
            />
          </div>
          {/* §3.10/§3.11 — her typed value stays on screen above these
              lines, never cleared, never replaced by them. */}
          {priceSaveState === 'slow' && <p className={styles.sheetSavingHint} role="status">Guardando…</p>}
          {priceSaveState === 'error' && <p className={styles.sheetError} role="alert">{SAVE_FAILED_MESSAGE}</p>}
          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              variant="secondary"
              disabled={isInFlight(priceSaveState)}
              onClick={closePriceSheet}
            >
              Cancelar
            </Button>
            {/* One primary action, relabelled in the error state rather than
                joined by a second button that would do the identical thing
                — the same single-retry-affordance shape §3.11 and every
                other error surface in this codebase already use. */}
            <Button
              disabled={!draftPriceValid || isInFlight(priceSaveState)}
              onClick={() => void handleGuardarPrecio()}
            >
              {priceSaveState === 'error' ? 'Reintentar' : 'Guardar precio'}
            </Button>
          </div>
        </Sheet>
      )}

      {editingPhotoProduct && (
        // Same in-flight dismissal guard as the Precio sheet above.
        <Sheet onDismiss={isInFlight(photoSaveState) ? undefined : closePhotoSheet}>
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
                    stagePhoto(undefined);
                    setPhotoPreviewOpen(false);
                  }}
                />
              </button>
              {/* Every staging control goes inert while a write is in
                  flight — otherwise she could swap the photo out from under
                  an attempt that's still running, and the key replayed by a
                  "Reintentar" would no longer match what's on screen. */}
              <button
                className={styles.linkBtn}
                disabled={isInFlight(photoSaveState)}
                onClick={() => setCameraOpen(true)}
              >
                Tomar foto
              </button>
              <button
                className={styles.linkBtn}
                disabled={isInFlight(photoSaveState)}
                onClick={() => photoFileInputRef.current?.click()}
              >
                Cambiar
              </button>
              <button
                className={styles.linkBtn}
                disabled={isInFlight(photoSaveState)}
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
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className={styles.uploadBtn}
                  disabled={isInFlight(photoSaveState)}
                  onClick={() => setCameraOpen(true)}
                >
                  Tomar foto
                </button>
                <button
                  className={styles.uploadBtn}
                  disabled={isInFlight(photoSaveState)}
                  onClick={() => photoFileInputRef.current?.click()}
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
                stagePhoto(dataUrl);
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
          {/* §3.10/§3.11 — the staged photo (or the "Agregar foto" empty
              state a "Quitar" leaves behind) stays exactly as it is above
              these lines; nothing she staged is dropped by a failed save. */}
          {photoSaveState === 'slow' && <p className={styles.sheetSavingHint} role="status">Guardando…</p>}
          {photoSaveState === 'error' && <p className={styles.sheetError} role="alert">{SAVE_FAILED_MESSAGE}</p>}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <Button
              variant="secondary"
              disabled={isInFlight(photoSaveState)}
              onClick={closePhotoSheet}
            >
              Cancelar
            </Button>
            <Button
              disabled={isInFlight(photoSaveState)}
              onClick={() => void handleGuardarFoto()}
            >
              {photoSaveState === 'error' ? 'Reintentar' : 'Guardar foto'}
            </Button>
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
              // Routed through `stagePhoto` like every other change to the
              // staged value, so the idempotency key can't outlive the value
              // it was minted for (this passive fallback silently changes
              // what a "Reintentar" would write).
              stagePhoto(undefined);
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
        // Same in-flight dismissal guard as the other two sheets above.
        <Sheet onDismiss={isInFlight(barcodeSaveState) ? undefined : closeBarcodeSheet}>
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
            disabled={isInFlight(barcodeSaveState)}
            onClick={() => setBarcodeStage('scanning')}
          >
            Volver a escanear
          </Button>
          {/* §3.10/§3.11 — the staged "(nuevo, sin guardar)" value stays
              right above these lines, still there to retry or rescan. */}
          {barcodeSaveState === 'slow' && <p className={styles.sheetSavingHint} role="status">Guardando…</p>}
          {barcodeSaveState === 'error' && (
            <p className={styles.sheetError} role="alert">{SAVE_FAILED_MESSAGE}</p>
          )}
          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              variant="secondary"
              disabled={isInFlight(barcodeSaveState)}
              onClick={closeBarcodeSheet}
            >
              Cancelar
            </Button>
            <Button
              disabled={stagedBarcode === undefined || isInFlight(barcodeSaveState)}
              onClick={() => void handleGuardarBarcode()}
            >
              {barcodeSaveState === 'error' ? 'Reintentar' : 'Guardar código de barras'}
            </Button>
          </div>
        </Sheet>
      )}
    </>
  );
}
