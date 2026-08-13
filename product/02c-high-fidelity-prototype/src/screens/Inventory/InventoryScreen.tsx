import { useStore } from '../../domain/store';
import { catalogRows, findProduct } from '../../domain/selectors';
import { InventoryColdStart } from './InventoryColdStart';
import { CatalogView } from './CatalogView';
import { RegisterMerchandise } from './RegisterMerchandise';

export type InventoryView =
  | { mode: 'catalog'; justSaved?: string | null }
  | { mode: 'register'; prefillProductId?: string };

/** inventory.md §2 — resolution: cold start vs. Catalog view. */
export function InventoryScreen({
  view,
  onOpenRegister,
  onSaved,
  onBackToCatalog,
}: {
  view: InventoryView;
  onOpenRegister: (prefillProductId?: string) => void;
  onSaved: (lastProductId: string) => void;
  onBackToCatalog: () => void;
}) {
  const { state } = useStore();
  const rows = catalogRows(state);

  if (view.mode === 'register') {
    return (
      <RegisterMerchandise
        key={view.prefillProductId ?? 'blank'}
        initialProductId={view.prefillProductId}
        onSaved={onSaved}
        onBack={onBackToCatalog}
      />
    );
  }

  if (rows.length === 0) {
    return <InventoryColdStart onRegister={() => onOpenRegister()} />;
  }

  const savedName = view.justSaved ? findProduct(state, view.justSaved)?.name : null;

  return (
    <CatalogView
      onRegister={() => onOpenRegister()}
      onRegisterProduct={(productId) => onOpenRegister(productId)}
      justSavedConfirmation={savedName ? 'Mercancía registrada' : null}
    />
  );
}
