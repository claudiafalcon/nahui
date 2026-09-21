import { useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, availableCount, everReceived } from '../../domain/selectors';
import { makeId } from '../../domain/id';
import type { AppState, Product } from '../../domain/types';
import { ProductPicker } from '../../components/ProductPicker/ProductPicker';
import { QuantityStepper } from '../../components/QuantityStepper/QuantityStepper';
import { Button } from '../../components/Button/Button';
import styles from './RegisterMerchandise.module.css';

/**
 * Which Product this in-progress draft refers to. `existing` names a real,
 * already-written Product. `new` is a not-yet-real identity picked up in
 * "¿Qué llegó?" this same visit — inventory.md §3.8a: held here, in local
 * draft state, and only actually written (atomically with the rest of the
 * Lot) at "Guardar mercancía" — see `commitLot` in `store.tsx`.
 */
type ProductRef =
  | { kind: 'existing'; productId: string }
  /** `barcode` (`decision-log.md` D65) — set only when this draft's Producto
   * was resolved via the picker's "vía escaneo, sin coincidencia" path
   * (`inventory.md` §3.8a's scan variant); `undefined` for the typed path,
   * the same posture `photo` already has. Never shown or re-asked anywhere
   * on this screen — captured silently, attached to the same atomic
   * Product-creation write at "Guardar mercancía." */
  | { kind: 'new'; name: string; price: number; photo?: string; barcode?: string };

/**
 * §3.6's two pre-expanded entry modes (new 2026-09-19) — see the
 * `entryMode` prop's own doc comment below for what each one lands on and
 * why. `undefined` is every pre-existing entry point, unchanged.
 */
export type EntryMode = 'receipt' | 'correction';

/**
 * **`inventory.md` §3.6 exit 1, made real (`ux-critic` Major 4, 2026-09-21):
 * "Anything staged is preserved silently and resumes exactly as she left it."**
 *
 * §3.6 states that as a guarantee, §4 restates it, and §7 lists draft
 * preservation across any interruption as an automation this journey relies
 * on. The first build held the draft in `RegisterMerchandise`'s own state,
 * and `InventoryScreen` mounts that component only while
 * `view.mode === 'register'` — so **every** back-arrow path unmounted it and
 * silently discarded her staged correction and receipt. Pre-existing, but the
 * Catalog-card → Product Page slice made it far more likely to be hit: the
 * back arrow now leads somewhere she has a real reason to go mid-operation —
 * the Product Page she came from, to re-check a figure before committing.
 *
 * So the draft is owned by `App.tsx`, exactly as `assignTagsEntry` and
 * `assignTagsSegmentTotals` already are (AT-M1/AT-M2), and for exactly the
 * same reason: the state has to outlive a component that navigation unmounts.
 *
 * A draft belongs to one *operation* — identified by the same
 * `prefillProductId:entryMode` slot key `InventoryScreen` already remounts
 * this screen on. A draft is only ever resumed into the operation that
 * created it; opening a different Product, or the same Product in the other
 * pre-expanded mode, is a genuinely different operation and builds its own
 * fresh draft rather than inheriting one built for the previous one.
 *
 * **One draft per operation, not one draft total (`ux-critic` Minor 5,
 * 2026-09-21).** The first build of this fix held a single
 * `{ slot, line } | null` and compared its `slot` on the way back in — so a
 * draft staged for Camisas survived a trip to the Product Page (the sequence
 * the fix was written for), but was silently overwritten the moment she
 * staged anything in *any other* operation, and was then gone with no
 * indication it had existed. §3.6 exit 1's guarantee is stated without
 * qualification, so the store is keyed by that same slot rather than holding
 * one entry and checking whether it is the right one. The store is bounded by
 * the operations she has actually opened and left un-saved (at most one per
 * Product per entry mode), and a slot is dropped the moment its own operation
 * commits — nothing here grows with time rather than with unfinished work.
 * `RegisterDraftStore`'s
 * key **is** the slot, so `slot` is no longer carried inside the value — one
 * place for that fact, not two that can disagree.
 */
export type RegisterDraftStore = Record<string, RegisterDraftState>;

export interface RegisterDraftState {
  /** `null` is a real, preservable state: she opened the blank form and has
   * not resolved Producto yet. Distinct from *no stored draft at all* —
   * which is this slot being absent from `RegisterDraftStore` entirely, and
   * is what lets a pre-expanded entry rebuild its own default. */
  line: Line | null;
}

export interface Line {
  key: string; // stable local identity, mostly vestigial now that there is only ever one draft on screen
  product: ProductRef;
  productName: string;
  /**
   * Cantidad recibida — purely additive, never merged with `currentQuantity`
   * below. For an `existing` line this value is only ever a real staged
   * receipt while `receiptOpen` is true (§3.6's "+ Recibir lote" reveal);
   * while closed it sits at its own default (1) but contributes nothing —
   * always read through `effectiveReceiptQty` below, never directly, so a
   * closed/never-opened receipt section can never leak into a save.
   */
  quantity: number;
  touched: boolean; // Cantidad recibida's own "revisa antes de guardar" state
  /**
   * `decision-log.md` D78, `inventory.md` §3.6 — Cantidad disponible actual.
   * Present whenever this draft's Producto resolved to an *existing*
   * Product — **regardless of its live `disponibles` value, including
   * exactly 0** (D78 corrected D77's own ceiling>0 gate: 0 is now a
   * legitimate correction starting point, bidirectional correction has no
   * degenerate case left to omit). `undefined` only for a brand-new Product
   * (§3.8a, either path), which never shows this at all. `ceiling` is the
   * snapshot loaded once when Producto resolved and never re-fetched while
   * she stays on this screen (§3.6's own "snapshot-until-Guardar"
   * convention — Guardar itself converges against the real, live count
   * server-side, never a stale client-side subtraction). `value` is her
   * current edit, defaulting to `ceiling` untouched (a known fact, not a
   * guess — never carries a "revisa" marker, unlike Cantidad recibida's own
   * default-to-1).
   */
  currentQuantity?: { ceiling: number; value: number };
  /** D78 — the pencil ("✎ Corregir") reveal state. Only ever meaningful
   * when `currentQuantity` is set; ignored for a brand-new Product's draft,
   * which has no correction UI at all. Opening this alone (value still
   * equal to `ceiling`) is a genuine no-op — see `hasRealEffect` below. */
  correctionOpen: boolean;
  /** D78 — the "+ Recibir lote" reveal state, for an *existing* draft only.
   * Always effectively true for a brand-new Product's draft (its receiving
   * stepper is unconditionally visible, §3.8a) — the flag still exists on
   * that draft for shape-consistency but is never read for it, since
   * `currentQuantity === undefined` already routes past every check of this
   * flag. */
  receiptOpen: boolean;
}

/**
 * `decision-log.md` D78 — builds a fresh draft for an *existing* Product,
 * carrying forward its live `disponibles` as Cantidad disponible actual's
 * snapshot in the same motion (§3.8's own carry-forward rule), the same
 * "capture business truth once, reuse it forever" discipline this screen's
 * price/photo carry-forward already follows. Shared by every path that
 * resolves Producto to an existing Product: the Catalog-row shortcut
 * (`initialProductId`, below), a typed exact-name match, and a barcode
 * confirm-on-scan (§3.8c) — `ProductPicker`'s own `onSelectExisting` is the
 * single callback all three already funnel through. Both correction and
 * receipt open false by default — she lands on the read-only at-rest state
 * (§3.6), never with anything pre-staged.
 *
 * **`currentQuantity` is gated on `everReceived`, not mere Catalog
 * presence.** §3.6's own "Shared, unchanged" bullet preserves the legacy
 * "sin registrar" case (`product-decisions.md` Q20, `inventory.md`
 * §3.3a/§3.4 — a Product that exists as a row but has never actually had a
 * real receipt) as still landing on "the always-visible receiving
 * stepper," the same treatment as a brand-new Product — D78's own "0 is a
 * legitimate correction starting point" language is about a Product *she'd
 * registered* and later sold out or miscounted down to zero (D78's own
 * worked example), never about a Product with no received history to
 * correct *against* in the first place. `everReceived` (`selectors.ts`) is
 * this codebase's own existing test for exactly that distinction, reused
 * here rather than reinvented.
 */
function buildExistingLine(state: AppState, product: Product, entryMode?: EntryMode): Line {
  const registered = everReceived(state, product.id);
  const ceiling = availableCount(state, product.id);
  return {
    key: product.id,
    product: { kind: 'existing', productId: product.id },
    productName: product.name,
    quantity: 1,
    touched: false,
    currentQuantity: registered ? { ceiling, value: ceiling } : undefined,
    // §3.19's two pre-expanded entry modes (2026-09-19). Each lands on a
    // state this screen **already defines**, reached without the tap that
    // normally reveals it, because she declared that intent by tapping a
    // labelled action one screen earlier (*global-principles.md*, "never ask
    // twice" and "the fastest interaction is the one that never happens").
    // **Nothing is ever pre-*staged* by an entry point** — a pre-expanded
    // reveal shows a box at its already-defined default; it does not put a
    // value into the draft she did not ask for. For a "sin registrar" legacy
    // Product (`registered === false`), neither mode applies at all: the
    // always-visible receiving-stepper variant governs, exactly as already
    // specified, and `correctionOpen` is never read for such a draft.
    correctionOpen: registered && entryMode === 'correction',
    receiptOpen: !registered || entryMode === 'receipt',
  };
}

/**
 * D78 — whether this draft currently carries a real, nonzero staged effect:
 * an open correction whose value differs from the loaded ceiling, and/or an
 * open (necessarily nonzero, floor-1) receipt. Drives every gate this
 * amendment adds — Producto's re-selectability and "Guardar mercancía"
 * (`decision-log.md`'s 2026-09-18 single-Product-focus amendment retired
 * "+ Agregar otro producto" and the committed-lines list this used to also
 * gate — see §3.6/§3.7's own retirement note).
 */
function hasRealEffect(line: Line): boolean {
  if (!line.currentQuantity) {
    // A brand-new Product's draft has no correction UI at all — its
    // always-visible receiving stepper (floor 1) already carries a real
    // value the instant Producto resolves (§3.8a, unchanged from before
    // this amendment).
    return line.quantity > 0;
  }
  const correctionEffect = line.correctionOpen && line.currentQuantity.value !== line.currentQuantity.ceiling;
  const receiptEffect = line.receiptOpen && line.quantity > 0;
  return correctionEffect || receiptEffect;
}

/**
 * D78 — the actual receipt quantity this draft contributes to a save. For a
 * brand-new Product, always `quantity` (always-visible, always real). For
 * an existing Product, `quantity` only while `receiptOpen` is true —
 * otherwise 0, even though `quantity` itself still sits at its own default
 * internally. Every read of "how much is being received" on this draft goes
 * through this function, never `line.quantity` directly, so a closed
 * receipt section can never leak a phantom default-1 receipt into a save.
 */
function effectiveReceiptQty(line: Line): number {
  if (!line.currentQuantity) return line.quantity;
  return line.receiptOpen ? line.quantity : 0;
}

/**
 * inventory.md §3.6 — Registro de mercancía, Producto seleccionado, una
 * operación enfocada. Producto + Cantidad disponible actual (correction) +
 * Cantidad recibida (receipt) only (D9/architecture-principles.md #5 — no
 * Supplier, no cost field).
 *
 * **Rewritten 2026-09-18, same day, Product Owner decision (live retest of
 * D78's shipped version) — single-Product focus.** Once Producto resolves,
 * this screen's own read-only/correction/receipt states are the entire
 * interaction for this visit: check/correct the current count and/or
 * receive new stock of that one Product, then "Guardar mercancía" returns
 * her to Catalog view. "+ Agregar otro producto" and the "Ya agregaste"
 * multi-line committed list (former §3.7) are retired outright — there is
 * no longer a `committed: Line[]` array, only this one `draft`. §3.9's
 * Descartar confirmation is retired as a direct consequence — it protected
 * an already-committed line in that now-gone list, and nothing is ever
 * "committed" short of the real "Guardar mercancía" write itself anymore;
 * each staged fact already has its own instant, no-confirmation undo
 * ("Cancelar"/"Quitar," below). To work on a different Product, she starts
 * a fresh, independent Registro de mercancía from Catalog view — never a
 * continuation of this one (§3.6's own "Amended 2026-09-18" bullet, §4, §10).
 */
export function RegisterMerchandise({
  initialProductId,
  entryMode,
  backLabel = 'Inventario',
  preservedDraft,
  onDraftChange,
  onSaved,
  onBack,
}: {
  initialProductId?: string;
  /**
   * §3.6's four live entry points, amended 2026-09-19 — **two of them now
   * arrive pre-expanded**, each landing on a different, already-defined state
   * of this screen:
   * - `undefined` — Catalog view's own "Registrar mercancía" CTA (blank,
   *   Producto unresolved) or Home's cold-start CTA. Unchanged. Also the
   *   shape a Producto resolved *inside* this screen (§3.8's picker) always
   *   takes: she lands on the read-only at-rest state, nothing revealed.
   * - `'receipt'` — §3.19's `[ Registrar mercancía ]`. Producto arrives
   *   already resolved **with the receipt stepper ("Cantidad recibida")
   *   already revealed**: default 1, carrying INV-Q1's "· revisa antes de
   *   guardar" marker, floor 1, "Guardar mercancía" visible and enabled.
   *   Exactly the state this screen already defines after a "+ Recibir lote"
   *   tap, reached without that tap. **This is what keeps a one-unit restock
   *   at three taps despite the Product Page adding a hop** (§6) — deliberate,
   *   not a coincidence: it is why the pre-expansion exists.
   * - `'correction'` — §3.19's `[ Corregir cantidad ]`. Producto arrives
   *   already resolved **with correction mode already revealed**: stepper
   *   defaulting to the loaded count, delta 0, and — per this screen's own
   *   existing rule — **no "Guardar mercancía" rendered**, since an untouched
   *   correction is a genuine no-op. Keeps a count correction at its current
   *   step count rather than regressing it by the page's +1.
   *
   * Only ever meaningful alongside `initialProductId`; ignored otherwise,
   * since there is no resolved Producto for a box to belong to.
   */
  entryMode?: EntryMode;
  /**
   * The back arrow names the screen it actually returns to — this screen's
   * own exits all follow "return to origin" now (§3.6, 2026-09-19), so a
   * fixed "← Inventario" would be dishonest when the origin is a Product
   * Page. §3.6's wireframes predate that amendment and were not restated for
   * this label; the convention applied here is this document family's own
   * (§3.19's "← Inventario", §3.19a/§3.19c's "← Camisas"): **the back label
   * names the destination.** Defaults to "Inventario," so every pre-existing
   * entry point renders byte-identically to before.
   */
  backLabel?: string;
  /** §3.6 exit 1 — this operation's own previously-staged draft, when she is
   * returning to an operation she backed out of, and `null` when this is a
   * fresh one. Owned by `App.tsx` (see `RegisterDraftState`), because every
   * back-arrow path unmounts this component. `InventoryScreen` is what
   * decides whether a stored draft belongs to *this* operation. */
  preservedDraft: RegisterDraftState | null;
  /** Every change to the draft, forwarded straight up — this screen keeps no
   * second, local copy of it, so there is no state to lose on unmount and no
   * way for the two to disagree. */
  onDraftChange: (line: Line | null) => void;
  /** AT-M1 fix (`AssignTags.tsx`) — alongside the saved productId, hands
   * back exactly what this specific `commitLot` call wrote (0 or 1 entries
   * now that a draft is always exactly one Product), so a caller
   * auto-entering Asignar Tags right after can freeze a receipt scoped to
   * only this commit. */
  onSaved: (lastProductId: string, entryBreakdown: { productId: string; quantity: number }[]) => void;
  onBack: () => void;
}) {
  const { state, commitLot, correctProductAvailableCount } = useStore();
  const initialProduct = state.products.find((p) => p.id === initialProductId);

  // D78 — the Catalog-row shortcut is one of §3.8's three carry-forward
  // entry points; `buildExistingLine` loads Cantidad disponible actual's
  // snapshot from this Product's live `disponibles` in the same motion, but
  // lands her on the read-only at-rest state, never pre-staged.
  //
  // §3.6 exit 1 — **the draft lives one level up now** (`RegisterDraftState`).
  // Resume it when this operation has one; otherwise derive this operation's
  // own opening state. The derived value is deliberately *not* written up on
  // render — an untouched opening state is not a draft, and writing it would
  // both be a render-phase side effect and make "she has staged nothing"
  // indistinguishable from "she resolved Producto and then cleared it." The
  // first real change commits it, with the whole draft, through `setDraft`.
  const draft: Line | null = preservedDraft
    ? preservedDraft.line
    : initialProduct
      ? buildExistingLine(state, initialProduct, entryMode)
      : null;

  /** Same call shape `useState`'s setter had, so every staging site below
   * reads exactly as it did — the difference is only where the value lands. */
  function setDraft(next: Line | null | ((current: Line | null) => Line | null)) {
    onDraftChange(typeof next === 'function' ? next(draft) : next);
  }

  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  /** `reviewer` Blocker fix (2026-09-13) — the stable idempotency key for one
   * logical "Guardar mercancía" attempt (the receipt half of it), mirroring
   * `store.tsx`'s own `onboardingIdempotencyKeyRef` exactly: generated once
   * when `handleSave` starts an attempt, reused unchanged across any retry
   * of that same attempt (a failed save just resets `saving` and leaves
   * `draft` untouched, so tapping "Guardar mercancía" again must replay the
   * same key, never mint a fresh one). Cleared on success (below) and on
   * every action that actually changes what would be saved
   * (`resetSaveAttempt`, used by every stepper/link on this screen and the
   * picker callbacks) — never on a mere failed-save retry, which is the one
   * case this key must survive unchanged. */
  const commitIdempotencyKeyRef = useRef<string | null>(null);

  /** D78 — one idempotency key for this draft's own `correctProductAvailableCount`
   * call (a single-Product write, not a batch one like `commit_lot`), same
   * generate-once-per-attempt/reused-across-retry discipline as
   * `commitIdempotencyKeyRef` above. */
  const correctionIdempotencyKeyRef = useRef<string | null>(null);
  /** D78 — whether this draft's correction write has already succeeded
   * *within this attempt*. Required for a correct retry after a partial
   * failure (the correction succeeds, then `commitLot` fails): without
   * this, a retry would re-run the already-applied correction's local
   * mirror a second time — over-removing on a decrease, or minting a second
   * batch of phantom units on an increase. The server call itself is
   * naturally safe to repeat (idempotency-keyed, RFC 0016's own "converges
   * toward her target" design) — this guard exists only to protect the
   * *local mirror*, which the server has no way to make idempotent on its
   * own. */
  const appliedCorrectionRef = useRef(false);

  function resetSaveAttempt() {
    commitIdempotencyKeyRef.current = null;
    correctionIdempotencyKeyRef.current = null;
    appliedCorrectionRef.current = false;
  }

  const canSave = draft !== null && hasRealEffect(draft);

  async function handleSave() {
    if (!draft || !hasRealEffect(draft)) return;
    setSaving(true);

    // D78 — up to two independent writes for this one Product, composed
    // behind this one tap (§3.6): a correction (either direction) via
    // Cantidad disponible actual, a real receipt via Cantidad recibida, or
    // both. The correction runs first; if it already succeeded on a prior,
    // partially-failed attempt, it's skipped outright, not just re-sent —
    // see `appliedCorrectionRef`'s own doc comment above for why re-sending
    // would be locally unsafe even though the RPC itself is idempotent.
    const hasCorrection = draft.currentQuantity !== undefined && draft.currentQuantity.value !== draft.currentQuantity.ceiling;
    if (hasCorrection && !appliedCorrectionRef.current) {
      // Cantidad disponible actual only ever exists on an `existing` draft
      // (§3.8a: it never applies to a fresh Product) — this cast is always
      // safe by construction, same posture as this file's other
      // `kind === 'existing'` casts below.
      const productId = (draft.product as { kind: 'existing'; productId: string }).productId;
      if (!correctionIdempotencyKeyRef.current) {
        correctionIdempotencyKeyRef.current = crypto.randomUUID();
      }
      const result = await correctProductAvailableCount(
        productId,
        draft.currentQuantity!.value,
        correctionIdempotencyKeyRef.current,
      );
      if (!result.ok) {
        console.error('[RegisterMerchandise] correctProductAvailableCount failed');
        setSaving(false);
        return;
      }
      appliedCorrectionRef.current = true;
    }

    // Cantidad recibida's own write — purely additive, unchanged in
    // mechanism from before D78, but only fires while the draft's
    // *effective* receipt quantity is > 0 — a pure-correction draft, whose
    // receipt section was never opened, contributes nothing here even
    // though `quantity` still sits at its own internal default (§3.6's own
    // "never fold into the same editable number" rule). `commitLot` is
    // skipped entirely, not called with an empty array, whenever this save
    // is a pure correction — no Lot/InventoryEntry is created for zero new
    // stock.
    const receiptQty = effectiveReceiptQty(draft);
    let resolvedProductId: string | null = null;
    if (receiptQty > 0) {
      // `reviewer` Blocker fix — generated once per attempt, reused
      // unchanged across a retry (see `commitIdempotencyKeyRef`'s own doc
      // comment above).
      if (!commitIdempotencyKeyRef.current) {
        commitIdempotencyKeyRef.current = crypto.randomUUID();
      }
      const idempotencyKey = commitIdempotencyKeyRef.current;
      // The atomic write, per inventory.md §3.8a: a `new` draft's Product
      // identity is minted here, inside commitLot's own transaction — never
      // before. `resolved` is this one Product's real (or freshly-minted)
      // id.
      const resolved = await commitLot(
        [
          {
            quantity: receiptQty,
            product:
              draft.product.kind === 'existing'
                ? { kind: 'existing' as const, productId: draft.product.productId }
                : {
                    kind: 'new' as const,
                    name: draft.product.name,
                    defaultPrice: draft.product.price,
                    photo: draft.product.photo,
                    barcode: draft.product.barcode,
                  },
          },
        ],
        idempotencyKey,
      );
      if (!resolved) {
        console.error('[RegisterMerchandise] commitLot failed');
        setSaving(false);
        return;
      }
      resolvedProductId = resolved[0];
      // Success — this logical attempt is over; a future, genuinely new
      // attempt (a fresh Lot registered after this one) must mint its own key.
      commitIdempotencyKeyRef.current = null;
    }

    // Every write for this attempt has now succeeded — clear the
    // correction bookkeeping too, the same "over, a future attempt mints
    // its own" reset `commitIdempotencyKeyRef` just got above.
    correctionIdempotencyKeyRef.current = null;
    appliedCorrectionRef.current = false;

    // AT-M1 — exactly what this commit wrote, for this one Product.
    const entryBreakdown: { productId: string; quantity: number }[] =
      resolvedProductId !== null ? [{ productId: resolvedProductId, quantity: receiptQty }] : [];
    setSaving(false);
    // D78 — a save can now be pure correction, with `commitLot` never
    // called and `resolvedProductId` null. The confirmation this hands off
    // to (§3.12/§3.13) still needs *a* productId to scope its ambient
    // "registrada" line to — falls back to the draft's own `existing`
    // productId whenever `resolvedProductId` is null (a brand-new Product's
    // own draft always has a real receipt, so it can only ever reach this
    // fallback as an `existing` draft — a pure correction never applies to
    // a brand-new Product, §3.6).
    const lastProductId =
      resolvedProductId ?? (draft.product as { kind: 'existing'; productId: string }).productId;
    onSaved(lastProductId, entryBreakdown);
  }

  if (saving) {
    return <p className={styles.savingLine}>Guardando…</p>;
  }

  // D78 — Producto stays tappable (reopens Elegir producto) only while
  // nothing has been staged on the draft yet; locks (plain text) the
  // instant it does. To work with a different Product once locked, she
  // finishes or backs out of this operation and opens a fresh Registro de
  // mercancía from Catalog view (single-Product focus, 2026-09-18, §3.6/§4).
  const draftLocked = draft !== null && hasRealEffect(draft);

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← {backLabel}
        </button>
      </div>
      <h1 className={styles.heading}>Registro de mercancía</h1>

      <div className={styles.scroll}>
        <div className={styles.field}>
          <span className={styles.label}>Producto</span>
          {draftLocked ? (
            <span className={styles.productLocked}>{draft!.productName}</span>
          ) : (
            <button
              className={`${styles.pickerBtn} ${!draft ? styles.placeholder : ''}`}
              onClick={() => setPickerOpen(true)}
            >
              {draft ? draft.productName : 'Elegir producto ▾'}
            </button>
          )}
        </div>

        {draft && draft.currentQuantity && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad disponible actual</span>
            {!draft.correctionOpen ? (
              <div className={styles.readonlyRow}>
                <span className={styles.readonlyValue}>{draft.currentQuantity.value}</span>
                <button
                  className={styles.linkBtn}
                  onClick={() => {
                    resetSaveAttempt();
                    setDraft((d) => (d ? { ...d, correctionOpen: true } : d));
                  }}
                >
                  ✎ Corregir
                </button>
              </div>
            ) : (
              <>
                <QuantityStepper
                  value={draft.currentQuantity.value}
                  touched
                  showMarker={false}
                  ariaLabel="Cantidad disponible actual"
                  min={0}
                  onChange={(next) => {
                    resetSaveAttempt();
                    setDraft((d) =>
                      d && d.currentQuantity ? { ...d, currentQuantity: { ...d.currentQuantity, value: next } } : d,
                    );
                  }}
                />
                <span className={styles.hint}>
                  Corrígela si algo no cuadra — por ejemplo, piezas defectuosas que regresaste, o si contaste más de
                  lo que dice Nahui.
                </span>
                <button
                  className={styles.linkBtn}
                  onClick={() => {
                    resetSaveAttempt();
                    setDraft((d) =>
                      d && d.currentQuantity
                        ? { ...d, correctionOpen: false, currentQuantity: { ...d.currentQuantity, value: d.currentQuantity.ceiling } }
                        : d,
                    );
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}

        {draft && draft.currentQuantity && !draft.receiptOpen && (
          <button
            className={styles.linkBtn}
            onClick={() => {
              resetSaveAttempt();
              setDraft((d) => (d ? { ...d, receiptOpen: true } : d));
            }}
          >
            + Recibir lote
          </button>
        )}

        {draft && draft.currentQuantity && draft.receiptOpen && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad recibida</span>
            <QuantityStepper
              value={draft.quantity}
              touched={draft.touched}
              min={1}
              ariaLabel="Cantidad recibida"
              onChange={(next, touched) => {
                resetSaveAttempt();
                setDraft((d) => (d ? { ...d, quantity: next, touched } : d));
              }}
            />
            <span className={styles.hint}>Lo que te llegó nuevo (o escribe la cantidad)</span>
            <button
              className={styles.linkBtn}
              onClick={() => {
                resetSaveAttempt();
                setDraft((d) => (d ? { ...d, receiptOpen: false, quantity: 1, touched: false } : d));
              }}
            >
              Quitar
            </button>
          </div>
        )}

        {draft && !draft.currentQuantity && (
          <div className={styles.field}>
            <span className={styles.label}>Cantidad recibida</span>
            <QuantityStepper
              value={draft.quantity}
              touched={draft.touched}
              min={1}
              ariaLabel="Cantidad recibida"
              onChange={(next, touched) => {
                resetSaveAttempt();
                setDraft((d) => (d ? { ...d, quantity: next, touched } : d));
              }}
            />
            <span className={styles.hint}>(o escribe la cantidad)</span>
          </div>
        )}
      </div>

      {canSave && (
        <div className={`${styles.footer} stitchTop`}>
          <Button onClick={handleSave}>Guardar mercancía</Button>
        </div>
      )}

      {pickerOpen && (
        <ProductPicker
          rows={catalogRows(state)}
          onDismiss={() => setPickerOpen(false)}
          onSelectExisting={(product) => {
            // D78/§3.8 — covers all three carry-forward entry points this
            // callback serves (typed exact-name match, list-item tap,
            // barcode confirm-on-scan's "Sí, es este") in one place.
            resetSaveAttempt();
            setDraft(buildExistingLine(state, product));
            setPickerOpen(false);
          }}
          onCreateNew={(name, price, photo, barcode) => {
            // Not written to the store yet (inventory.md §3.8a) — held as a
            // pending `new` identity in local draft state until "Guardar
            // mercancía" atomically resolves it via commitLot. Any selected
            // Foto (`product-decisions.md` Q23) or scanned barcode
            // (`decision-log.md` D65) is carried the same way.
            resetSaveAttempt();
            setDraft({
              key: makeId('draft'),
              product: { kind: 'new', name, price, photo, barcode },
              productName: name,
              quantity: 1,
              touched: false,
              correctionOpen: false,
              receiptOpen: true,
            });
            setPickerOpen(false);
          }}
        />
      )}
    </>
  );
}
