import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, findProduct, isNfcTaggingEligible, pendingTagBreakdown, pendingTagCount } from '../../domain/selectors';
import { InventoryColdStart } from './InventoryColdStart';
import { CatalogView } from './CatalogView';
import { RegisterMerchandise } from './RegisterMerchandise';
import { AssignTags, type AssignTagsEntryLine } from './AssignTags';
import type { NfcAssignSession } from '../../domain/useNfcAssignTagSession';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';

export type InventoryView =
  | {
      mode: 'catalog';
      justSaved?: string | null;
      tagsComplete?: boolean;
      enteredViaSettingsTagsOn?: boolean;
      /** inventory.md §3.13's mixed-Lot completion-copy variant
       * (`decision-log.md` D71) — set only when the Lot that just finished
       * tagging genuinely mixed NFC-tagging-eligible and non-eligible
       * Product lines (§2 step 3's own per-Lot test), never for a
       * whole-Catalog `defaultSellingMode = 'nfc'` completion or the
       * `settings.md` §2.6 whole-Catalog entry point (step 0), neither of
       * which can mix by construction. */
      mixedLotDetail?: string | null;
      /** inventory.md §3.13a (new, 2026-09-17 live pass) — set only when a
       * Product-scoped Asignar Tags queue (entered via §3.4's fifth-zone
       * toggle-ON auto-open or sixth-zone resume indicator) reaches 0
       * pending. Holds the completed Product's own id (mirrors `justSaved`'s
       * own shape); the name is resolved at render time, below, the same
       * pattern `justSaved`/`savedName` already establish. Mutually
       * exclusive with `tagsComplete` (§3.13's own Lot-scoped completion) —
       * never both set on the same view. */
      productTagsCompleteId?: string | null;
    }
  | { mode: 'register'; prefillProductId?: string }
  | {
      mode: 'assign-tags';
      /** inventory.md §3.14's entry point 3 (new, 2026-09-17 live pass) —
       * set only via §3.4's fifth-zone toggle-ON auto-open or sixth-zone
       * resume tap. `undefined` is the existing, unchanged Lot-scoped shape
       * (entry point 1, §2 step 3) — see `AssignTags.tsx`'s own
       * `scopeProductId` doc comment for the full reasoning. */
      scopeProductId?: string;
    };

/** inventory.md §3.3a / §3.4 one-time banner copy (`decision-log.md` D46
 * Addendum) — verbatim, `ux-critic`-verified spec text, no copy invented
 * here. Shared by the cold-start variant (zero Products ever registered)
 * and the Catalog-view variant (named Products, zero Lots ever received) —
 * both render the identical short line per §3.3a's own "same wording"
 * instruction. The "already fully tagged" outcome gets its own longer line
 * (SET-INV-D46-MAJ1, `ux-critic` finding). */
const SETTINGS_TAGS_ON_REGISTER_FIRST_BANNER = 'Cambiaste a vender con tags.';
const SETTINGS_TAGS_ON_ALREADY_TAGGED_BANNER =
  'Cambiaste a vender con tags. Tu mercancía ya está toda etiquetada — lista para la próxima sesión.';

/** inventory.md §2 — resolution: step 0 (D46 Addendum's new highest-priority
 * trigger, only evaluated via the `settings.md` §2.6 entry marker) ahead of
 * steps 1-2 (cold start vs. Catalog view). */
export function InventoryScreen({
  view,
  onOpenRegister,
  onSaved,
  onOpenAssignTags,
  onOpenAssignTagsForProduct,
  onTagsComplete,
  onProductTagsComplete,
  onBackToCatalog,
  onSettingsTagsOnMarkerHandled,
  assignTagsEntry,
  assignTagsSegmentTotals,
  onAssignTagsSegmentTotalsChange,
  nfcAssignSession,
}: {
  view: InventoryView;
  onOpenRegister: (prefillProductId?: string) => void;
  onSaved: (lastProductId: string) => void;
  /** inventory.md §2 step 3 — an NFC-tagging-eligible Lot (the composed
   * test, `decision-log.md` D71), auto-entered right after "Guardar
   * mercancía" succeeds (no intermediate question); also reached via this
   * screen's own step 0 below. **Untouched by the 2026-09-17 live pass**
   * (item 7 of that pass's own scope note) — §3.5/§3.17's former "Continuar
   * etiquetando" resume path that used to also call this prop with no
   * arguments is retired outright; resuming now always goes through
   * `onOpenAssignTagsForProduct` instead, below. `entryBreakdown` is passed
   * only when a fresh commit (or step 0's whole-Catalog seed) actually
   * triggered this entry, and, per D71, already filtered to only this Lot's
   * eligible lines (never the whole Lot when it mixes eligible/non-eligible
   * Product lines, §2 step 3's own corrected test). `nonEligibleBreakdown`
   * is this same Lot's remaining, non-eligible lines — passed only alongside
   * a genuinely mixed Lot (never on step 0's whole-Catalog seed, which can't
   * mix by construction) so §3.13's mixed-Lot completion copy can name both
   * halves once tagging finishes. */
  onOpenAssignTags: (entryBreakdown?: AssignTagsEntryLine[], nonEligibleBreakdown?: AssignTagsEntryLine[]) => void;
  /** inventory.md §3.14's entry point 3 (new, 2026-09-17 live pass) — the
   * *only* way to enter or resume a Product-scoped tagging queue: §3.4's
   * fifth zone (toggle-ON, when this Product already has ≥1 eligible unit)
   * or sixth zone (the `[ N sin etiquetar ]` resume indicator). Never
   * touches `assignTagsEntry`/the Lot-scoped receipt — this entry point
   * never shows a "Lo que registraste" summary line at all (§3.14's own
   * wireframe variant note), enforced below by always passing `null` as
   * `entryBreakdown` whenever `view.scopeProductId` is set. */
  onOpenAssignTagsForProduct: (productId: string) => void;
  /** inventory.md §2 step 4 → §3.13 — 0 units left pending in a Lot-scoped
   * queue; Catalog view returns with the "lista para vender" confirmation.
   * Never fired for a Product-scoped queue (`view.scopeProductId` set) —
   * see `onProductTagsComplete` below for that case's own §3.13a. */
  onTagsComplete: () => void;
  /** inventory.md §3.13a (new, 2026-09-17 live pass) — a Product-scoped
   * queue reaching 0 pending. Distinct from `onTagsComplete`'s Lot-scoped
   * §3.13: names the specific Product, ambient/fading, no mixed-Lot copy,
   * carries no "just registered" framing (a Product-scoped queue may
   * resolve units received long before today). */
  onProductTagsComplete: (productId: string) => void;
  onBackToCatalog: () => void;
  /** inventory.md §2 step 0 (`decision-log.md` D46 Addendum) — called
   * exactly once, right after this screen resolves where `settings.md`
   * §2.6's "Cambiar a vender con tags" entry marker actually lands, so
   * `App.tsx` can clear `enteredViaSettingsTagsOn` from `view` and a later
   * Inventario open (with no fresh navigation in between) never re-runs step
   * 0 or re-shows its one-time banner. Never called on the YES branch (auto
   * -enter Asignar Tags) — that branch replaces `view` with
   * `{ mode: 'assign-tags' }` entirely, which carries no marker of its own. */
  onSettingsTagsOnMarkerHandled: () => void;
  /** AT-M1/AT-M2 fix-round — both owned by the caller (`App.tsx`), not by
   * `AssignTags` itself, so neither is lost across `AssignTags`'
   * unmount/remount on a defer/resume cycle. See `AssignTags.tsx`'s own doc
   * comments for the full reasoning. */
  assignTagsEntry: AssignTagsEntryLine[] | null;
  assignTagsSegmentTotals: Record<string, number>;
  onAssignTagsSegmentTotalsChange: (updater: (totals: Record<string, number>) => Record<string, number>) => void;
  /** 2026-09-18 architecture fix (`decision-log.md` D74/D75 follow-up) —
   * the live Web NFC session (`useNfcAssignTagSession`), owned by `App.tsx`
   * one level up, alongside `assignTagsEntry`/`assignTagsSegmentTotals` for
   * the identical reason. Forwarded whole to `AssignTags` (which reads the
   * live session state/feedback and owns the mount-time fallback start);
   * only its `startScan` function is forwarded to `CatalogView` (which
   * never renders the ring itself, only triggers the real gesture-bound
   * `scan()` call ahead of navigating in). */
  nfcAssignSession: NfcAssignSession;
}) {
  const { state } = useStore();
  const rows = catalogRows(state);

  const enteredViaSettingsTagsOn = view.mode === 'catalog' && view.enteredViaSettingsTagsOn === true;

  // inventory.md §2 step 0's NO-branch banner text, captured once on the
  // render that first sees the marker (this component remounts fresh
  // whenever App.tsx sets it, since that always coincides with switching the
  // active tab to Inventario — see App.tsx). Captured via a lazy `useState`
  // initializer so it survives the marker itself being cleared from `view` a
  // moment later by the effect below (a prop change on this same mounted
  // instance, not a remount) — but this component does *not* remount again
  // on later `view.mode` changes within the same Inventario visit
  // (catalog → register/assign-tags → catalog is all internal branching on
  // one instance, per `InventoryView`'s own doc comment). Left uncleared,
  // this capture would keep being handed to whichever child renders for the
  // *entire remaining lifetime of that mount* — stale the moment she takes
  // any action that changes what's actually being shown (registers/tags
  // something, or a fresh `confirmationMessage` arrives) — so the effect
  // immediately below explicitly invalidates it the instant she leaves the
  // resting Catalog/cold-start view, matching the reactive (never-captured-
  // forever) discipline `CatalogView`'s own `confirmationMessage`/`toast`
  // pair already follows for the identical class of problem.
  const [settingsTagsBanner, setSettingsTagsBanner] = useState<string | null>(() => {
    if (!enteredViaSettingsTagsOn || pendingTagCount(state) > 0) return null;
    const anyLotEverReceived = state.entries.length > 0;
    return anyLotEverReceived ? SETTINGS_TAGS_ON_ALREADY_TAGGED_BANNER : SETTINGS_TAGS_ON_REGISTER_FIRST_BANNER;
  });

  // The instant `view.mode` moves away from 'catalog' — she taps "Registrar
  // mercancía" or lands in Asignar Tags — the landing moment the banner
  // above described is over. Clearing it here (rather than only where it's
  // consumed) means any later return to Catalog/cold-start view within this
  // same mount, by any path (a fresh commit's own confirmation, a deferred-
  // tagging return where one or more rows now carry a live `[ N sin
  // etiquetar ]` sixth-zone indicator, §3.4, 2026-09-17, or a plain "back"),
  // starts from a clean slate instead of re-showing a claim about her
  // tagging state that's no longer current. Never fires on the
  // very first render (`view.mode` is always 'catalog' whenever
  // `enteredViaSettingsTagsOn` can be true — see App.tsx's own
  // `onNavigateToInventarioViaSettingsTagsOn`), and does not fire again when
  // step 0's own effect below clears `enteredViaSettingsTagsOn` from `view`
  // a moment later, since that update leaves `view.mode` itself unchanged.
  useEffect(() => {
    if (view.mode !== 'catalog') {
      setSettingsTagsBanner(null);
    }
  }, [view.mode]);

  useEffect(() => {
    if (!enteredViaSettingsTagsOn) return;

    if (pendingTagCount(state) > 0) {
      // Step 0, YES branch — auto-enter Asignar Tags, seeded with the
      // *entire* pending queue across the whole Catalog (not scoped to a
      // single Lot, unlike the post-Guardar-mercancía seed below).
      const breakdown: AssignTagsEntryLine[] = pendingTagBreakdown(state).map(({ product, count }) => ({
        productId: product.id,
        quantity: count,
      }));
      onOpenAssignTags(breakdown);
      return;
    }

    // Step 0, NO branch — falls through to the ordinary resolution below
    // (cold start / Catalog view, §3.3a). Its one-time banner is already
    // captured above; clear the marker now so it can't re-fire on a later
    // Inventario open.
    onSettingsTagsOnMarkerHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run exactly
    // once, the moment this marker is first seen on a fresh mount (App.tsx
    // only ever sets it alongside switching the active tab to Inventario) —
    // never re-evaluated on a later re-render of this same mount.
  }, []);

  if (view.mode === 'register') {
    return (
      <ScreenTransition transitionKey="register">
        <RegisterMerchandise
          key={view.prefillProductId ?? 'blank'}
          initialProductId={view.prefillProductId}
          onSaved={(lastProductId, entryBreakdown) => {
            // inventory.md §2 step 3, corrected `decision-log.md` D71 — gates
            // on the composed NFC-tagging-eligible test, per line, not a
            // single whole-Lot `defaultSellingMode === 'nfc'` check: a Lot
            // that mixes eligible and non-eligible Product lines (Ana's own
            // worked scenario, Camisas + Plumas registered together) seeds
            // Asignar Tags with only its eligible lines' units, never the
            // whole Lot. Read from this render's own state (unaffected by
            // the commit — neither `defaultSellingMode` nor
            // `nfcPerProductEnabled` changes as a side effect of it), so no
            // post-commit re-read is needed.
            const business = state.business;
            const eligibleLines = business
              ? entryBreakdown.filter(({ productId }) => {
                  const product = findProduct(state, productId);
                  return product ? isNfcTaggingEligible(business, product) : false;
                })
              : [];
            if (eligibleLines.length > 0) {
              const nonEligibleLines = entryBreakdown.filter(
                (line) => !eligibleLines.some((e) => e.productId === line.productId),
              );
              onOpenAssignTags(eligibleLines, nonEligibleLines.length > 0 ? nonEligibleLines : undefined);
            } else {
              // No line in this Lot is NFC-tagging-eligible (§2 step 3's NO
              // branch) — return to Catalog view with the plain "registrada"
              // confirmation (§3.12), never the tagging queue.
              onSaved(lastProductId);
            }
          }}
          onBack={onBackToCatalog}
        />
      </ScreenTransition>
    );
  }

  if (view.mode === 'assign-tags') {
    // inventory.md §3.14's entry point 3 (2026-09-17 live pass) — a
    // Product-scoped queue. `scopeProductId` narrows AssignTags' own live
    // reads to this one Product (see that component's own doc comment);
    // `entryBreakdown` is always `null` here regardless of whatever's
    // frozen in `assignTagsEntry` from a possibly-unrelated earlier
    // Lot-scoped commit — §3.14's own wireframe variant drops "Lo que
    // registraste" outright for this entry point. Completion routes to
    // `onProductTagsComplete` (§3.13a), never `onTagsComplete` (§3.13,
    // Lot-scoped only) — the two completion states are mutually exclusive.
    const scopeProductId = view.scopeProductId;
    return (
      <ScreenTransition transitionKey="assign-tags">
        <AssignTags
          onDefer={onBackToCatalog}
          onComplete={scopeProductId ? () => onProductTagsComplete(scopeProductId) : onTagsComplete}
          entryBreakdown={scopeProductId ? null : assignTagsEntry}
          segmentTotals={assignTagsSegmentTotals}
          onSegmentTotalsChange={onAssignTagsSegmentTotalsChange}
          scopeProductId={scopeProductId}
          nfcSession={nfcAssignSession}
        />
      </ScreenTransition>
    );
  }

  if (rows.length === 0) {
    return (
      <ScreenTransition transitionKey="cold-start">
        <InventoryColdStart onRegister={() => onOpenRegister()} bannerLine={settingsTagsBanner} />
      </ScreenTransition>
    );
  }

  const savedName = view.justSaved ? findProduct(state, view.justSaved)?.name : null;
  // inventory.md §3.13a (new, 2026-09-17 live pass) — the Product-scoped
  // completion state, named for the specific Product ("Camisas ya está
  // etiquetada"), distinct from §3.13's Lot-scoped "Mercancía lista para
  // vender." Mutually exclusive with `view.tagsComplete` by construction
  // (`App.tsx`'s two completion handlers never set both on the same view).
  const productTagsCompleteName = view.productTagsCompleteId
    ? findProduct(state, view.productTagsCompleteId)?.name
    : null;
  const confirmationMessage = view.tagsComplete
    ? 'Mercancía lista para vender'
    : productTagsCompleteName
      ? `${productTagsCompleteName} ya está etiquetada`
      : savedName
        ? 'Mercancía registrada'
        : null;
  // inventory.md §3.13's mixed-Lot completion-copy variant
  // (`decision-log.md` D71) — only ever set alongside `tagsComplete`
  // (`App.tsx`'s own `onTagsComplete` handler), never on a plain "Mercancía
  // registrada" confirmation, and never on §3.13a's Product-scoped
  // completion (which carries no mixed-Lot copy of its own, §10).
  const confirmationDetail = view.tagsComplete ? (view.mixedLotDetail ?? null) : null;

  return (
    <ScreenTransition transitionKey="catalog">
      <CatalogView
        onRegister={() => onOpenRegister()}
        onRegisterProduct={(productId) => onOpenRegister(productId)}
        onOpenAssignTagsForProduct={onOpenAssignTagsForProduct}
        onStartNfcAssignScan={nfcAssignSession.startScan}
        confirmationMessage={confirmationMessage}
        confirmationDetail={confirmationDetail}
        settingsTagsBanner={settingsTagsBanner}
      />
    </ScreenTransition>
  );
}
