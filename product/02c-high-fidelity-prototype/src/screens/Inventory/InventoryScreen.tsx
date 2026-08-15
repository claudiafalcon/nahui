import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, findProduct, pendingTagBreakdown, pendingTagCount } from '../../domain/selectors';
import { InventoryColdStart } from './InventoryColdStart';
import { CatalogView } from './CatalogView';
import { RegisterMerchandise } from './RegisterMerchandise';
import { AssignTags, type AssignTagsEntryLine } from './AssignTags';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';

export type InventoryView =
  | { mode: 'catalog'; justSaved?: string | null; tagsComplete?: boolean; enteredViaSettingsTagsOn?: boolean }
  | { mode: 'register'; prefillProductId?: string }
  | { mode: 'assign-tags' };

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
  onTagsComplete,
  onBackToCatalog,
  onSettingsTagsOnMarkerHandled,
  assignTagsEntry,
  assignTagsSegmentTotals,
  onAssignTagsSegmentTotalsChange,
}: {
  view: InventoryView;
  onOpenRegister: (prefillProductId?: string) => void;
  onSaved: (lastProductId: string) => void;
  /** inventory.md §2 step 3 — `defaultSellingMode === 'nfc'` Business,
   * auto-entered right after "Guardar mercancía" succeeds (no intermediate
   * question); also reached via §3.5/§3.17's "Continuar etiquetando" and via
   * this screen's own step 0 below. `entryBreakdown` is passed only when a
   * fresh commit (or step 0's whole-Catalog seed) actually triggered this
   * entry — omitted on a plain resume. */
  onOpenAssignTags: (entryBreakdown?: AssignTagsEntryLine[]) => void;
  /** inventory.md §2 step 4 → §3.13 — 0 units left pending; Catalog view
   * returns with the "lista para vender" confirmation. */
  onTagsComplete: () => void;
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
  // tagging return with a now-live "Te faltan N por etiquetar" nudge, or a
  // plain "back"), starts from a clean slate instead of re-showing a claim
  // about her tagging state that's no longer current. Never fires on the
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
            // inventory.md §2 step 3 (`decision-log.md` D46) — gates on her
            // actual chosen selling mode (`defaultSellingMode === 'nfc'`),
            // never on mere nfc capability (`subscriptionTier === 'paid'`): a
            // Paid merchant who stays in `buttons` mode is never auto-routed
            // into tagging, at any point, for any reason. Read from this
            // render's own state (unaffected by the commit — `defaultSellingMode`
            // never changes as a side effect of it), so no post-commit re-read
            // is needed.
            if (state.business?.defaultSellingMode === 'nfc') {
              onOpenAssignTags(entryBreakdown);
            } else {
              onSaved(lastProductId);
            }
          }}
          onBack={onBackToCatalog}
        />
      </ScreenTransition>
    );
  }

  if (view.mode === 'assign-tags') {
    return (
      <ScreenTransition transitionKey="assign-tags">
        <AssignTags
          onDefer={onBackToCatalog}
          onComplete={onTagsComplete}
          entryBreakdown={assignTagsEntry}
          segmentTotals={assignTagsSegmentTotals}
          onSegmentTotalsChange={onAssignTagsSegmentTotalsChange}
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
  const confirmationMessage = view.tagsComplete
    ? 'Mercancía lista para vender'
    : savedName
      ? 'Mercancía registrada'
      : null;

  return (
    <ScreenTransition transitionKey="catalog">
      <CatalogView
        onRegister={() => onOpenRegister()}
        onRegisterProduct={(productId) => onOpenRegister(productId)}
        onContinueTagging={onOpenAssignTags}
        confirmationMessage={confirmationMessage}
        settingsTagsBanner={settingsTagsBanner}
      />
    </ScreenTransition>
  );
}
