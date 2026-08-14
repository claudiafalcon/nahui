import { useStore } from '../../domain/store';
import { catalogRows, findProduct, nfcCapable } from '../../domain/selectors';
import { InventoryColdStart } from './InventoryColdStart';
import { CatalogView } from './CatalogView';
import { RegisterMerchandise } from './RegisterMerchandise';
import { AssignTags, type AssignTagsEntryLine } from './AssignTags';

export type InventoryView =
  | { mode: 'catalog'; justSaved?: string | null; tagsComplete?: boolean }
  | { mode: 'register'; prefillProductId?: string }
  | { mode: 'assign-tags' };

/** inventory.md §2 — resolution: cold start vs. Catalog view. */
export function InventoryScreen({
  view,
  onOpenRegister,
  onSaved,
  onOpenAssignTags,
  onTagsComplete,
  onBackToCatalog,
  assignTagsEntry,
  assignTagsSegmentTotals,
  onAssignTagsSegmentTotalsChange,
}: {
  view: InventoryView;
  onOpenRegister: (prefillProductId?: string) => void;
  onSaved: (lastProductId: string) => void;
  /** inventory.md §2 step 3 — nfc-capable Business, auto-entered right after
   * "Guardar mercancía" succeeds (no intermediate question); also reached
   * via §3.5/§3.17's "Continuar etiquetando." `entryBreakdown` is passed
   * only on the former (a fresh `commitLot` actually triggered this entry,
   * AT-M1) — omitted on the latter (a plain resume, not a new commit). */
  onOpenAssignTags: (entryBreakdown?: AssignTagsEntryLine[]) => void;
  /** inventory.md §2 step 4 → §3.13 — 0 units left pending; Catalog view
   * returns with the "lista para vender" confirmation. */
  onTagsComplete: () => void;
  onBackToCatalog: () => void;
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

  if (view.mode === 'register') {
    return (
      <RegisterMerchandise
        key={view.prefillProductId ?? 'blank'}
        initialProductId={view.prefillProductId}
        onSaved={(lastProductId, entryBreakdown) => {
          // inventory.md §2 step 3 — the write that just completed minted
          // ≥1 fresh `available`, untagged InventoryUnit; for an
          // nfc-capable Business that alone guarantees the tagging queue is
          // non-empty regardless of what was pending before, so
          // `nfcCapable` read from this render's own state (unaffected by
          // the commit — `subscriptionTier` never changes as a side effect
          // of it) is sufficient, no post-commit re-read needed.
          if (nfcCapable(state)) {
            onOpenAssignTags(entryBreakdown);
          } else {
            onSaved(lastProductId);
          }
        }}
        onBack={onBackToCatalog}
      />
    );
  }

  if (view.mode === 'assign-tags') {
    return (
      <AssignTags
        onDefer={onBackToCatalog}
        onComplete={onTagsComplete}
        entryBreakdown={assignTagsEntry}
        segmentTotals={assignTagsSegmentTotals}
        onSegmentTotalsChange={onAssignTagsSegmentTotalsChange}
      />
    );
  }

  if (rows.length === 0) {
    return <InventoryColdStart onRegister={() => onOpenRegister()} />;
  }

  const savedName = view.justSaved ? findProduct(state, view.justSaved)?.name : null;
  const confirmationMessage = view.tagsComplete
    ? 'Mercancía lista para vender'
    : savedName
      ? 'Mercancía registrada'
      : null;

  return (
    <CatalogView
      onRegister={() => onOpenRegister()}
      onRegisterProduct={(productId) => onOpenRegister(productId)}
      onContinueTagging={onOpenAssignTags}
      confirmationMessage={confirmationMessage}
    />
  );
}
