import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, pendingTagCount } from '../../domain/selectors';
import { CatalogRow } from '../../components/CatalogRow/CatalogRow';
import { Button } from '../../components/Button/Button';
import styles from './CatalogView.module.css';

/**
 * `inventory.md` §3.4 — Catalog view.
 *
 * **Rewritten 2026-09-19 (Approved spec): no write remains on any Catalog
 * card, and the card has exactly one destination.** What this screen used to
 * own and no longer does — all of it moved to §3.19, the Product Page:
 * - the six-prop `CatalogRow` wiring (`onTapRow`/`onTapPrice`/`onTapPhoto`/
 *   `onTapBarcode`/`nfcToggle`/`pendingTag`/`reserveNfcSlot`);
 * - `handleToggleNfc` and its fire-and-forget `onOpenAssignTagsForProduct`
 *   call — **the toggle-ON auto-entry into Asignar Tags is reversed and
 *   retired outright** (Product Owner decision), so no tap on this screen
 *   starts a tagging run except the card's own `[ Etiquetar ]` shortcut;
 * - the `reserveNfcSlot` list-level derivation (the 84px reserved column had
 *   nothing left to reserve once no variable-presence control shared line 1
 *   with the price — retired, not relaxed);
 * - the three edit sheets (§3.4a/§3.4b/§3.4c) and their whole save-state
 *   machinery, now `src/screens/Inventory/ProductPage/`.
 *
 * **`onTapRow`'s destination changed, too** — it used to open Registro de
 * mercancía; a card tap now opens that Product's own page (`onOpenProduct`).
 * Restocking is still three taps: the page's +1 is exactly offset by §3.6's
 * receipt stepper arriving pre-revealed (§6).
 *
 * What this screen still owns: the card list, the one list-level shortcut
 * signal, the unconditional "Registrar mercancía" CTA, and the ambient
 * confirmation/banner lines that land here when an operation's origin was
 * Catalog view. Those confirmations are a property of the *destination*, not
 * of this screen specifically (§3.12/§3.13/§3.13a's 2026-09-19 correction) —
 * `ProductPage` renders the identical copy and shape when it is the origin.
 */
export function CatalogView({
  onOpenProduct,
  onRegister,
  onOpenAssignTagsForProduct,
  onStartNfcAssignScan,
  confirmationMessage,
  confirmationDetail,
  settingsTagsBanner,
}: {
  /** §3.4's single tap target — the whole card, every card, one destination
   * (§3.19). Dimming never affects tappability. */
  onOpenProduct: (productId: string) => void;
  onRegister: () => void;
  /** §3.14's entry point 3, Product-scoped — reached from the card's one
   * `[ Etiquetar ]` shortcut and nowhere else on this screen. **Pure
   * navigation: it never reads or writes `Product.nfcTaggingEnabled`**
   * (§3.4's filter 4, and the 2026-09-17 reasoning that separated resuming a
   * tagging run from changing a Product's NFC setting — retained unchanged,
   * and what makes the switch's removal from the card safe). */
  onOpenAssignTagsForProduct: (productId: string) => void;
  /** 2026-09-18 architecture fix (`decision-log.md` D74/D75 follow-up) —
   * `nfcAssignSession.startScan`, threaded down from `App.tsx`. Called
   * synchronously inside the shortcut's own `onClick`, right alongside the
   * navigation, so the real `NDEFReader.scan()` call happens inside the same
   * tap that semantically starts tagging — never deferred into
   * `AssignTags.tsx`'s mount effect after the navigation. This tap is the
   * literal, synchronous user gesture (no `await` in between), the same shape
   * `Selling.tsx`'s "Leer con NFC" button already uses. */
  onStartNfcAssignScan: () => Promise<void>;
  confirmationMessage?: string | null;
  /** §3.13's mixed-Lot completion-copy variant (`decision-log.md` D71) — an
   * optional second line beneath `confirmationMessage`, on the same fade
   * lifecycle. */
  confirmationDetail?: string | null;
  /** §3.3a/§3.4 (`decision-log.md` D46 Addendum) — the one-time ambient
   * banner shown when this view was reached via `settings.md` §2.6's handoff
   * and step 0 found nothing to auto-route her into. The caller owns the
   * "shown exactly once" discipline; this component only renders what it's
   * handed. Historical (dormant since D72, doubly dead since D73). */
  settingsTagsBanner?: string | null;
}) {
  const { state } = useStore();
  const [toast, setToast] = useState<string | null>(confirmationMessage ?? null);
  const [toastDetail, setToastDetail] = useState<string | null>(confirmationDetail ?? null);

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
  const pendingByProduct = rows.map(({ product }) => pendingTagCount(state, product.id));
  /**
   * §3.4's hit-area guarantee 2 — the fixed slot within line 2, "reserved on
   * every card in a given list whenever at least one card in that list could
   * carry a shortcut — the same list-level, derived-once signal the retired
   * NFC slot used." Derived here, once, and passed identically to every card,
   * so a caption never reflows depending on whether its neighbour has pending
   * tag work.
   */
  const reserveShortcutSlot = pendingByProduct.some((count) => count > 0);

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Inventario</span>
      </div>
      {toast && <p className={styles.confirmation}>{toast} ✓</p>}
      {toast && toastDetail && <p className={styles.confirmationDetail}>{toastDetail}</p>}

      {settingsTagsBanner && <p className={styles.settingsBanner}>{settingsTagsBanner}</p>}

      <div className={styles.list}>
        {rows.map(({ product, available, everReceived }, i) => {
          // Computed fresh on every Catalog render, per card, never cached
          // (§3.4): this Product currently has ≥1 `available`, untagged,
          // NFC-tagging-eligible unit under §2's composed test. It drives both
          // the caption's passive ` · N sin etiquetar` extension and, as the
          // one entry on §3.4's ordered shortcut-precedence list, whether
          // `[ Etiquetar ]` renders at all — so the shortcut "disappears the
          // moment its condition stops holding" (she finishes the queue, or
          // turns the NFC setting off on §3.19) for free, with no separate
          // rule.
          const pending = pendingByProduct[i];
          return (
            <CatalogRow
              key={product.id}
              name={product.name}
              photo={product.photo}
              price={product.defaultPrice}
              available={available}
              everReceived={everReceived}
              pendingTagCount={pending}
              onOpenProduct={() => onOpenProduct(product.id)}
              reserveShortcutSlot={reserveShortcutSlot}
              onTapEtiquetar={
                pending > 0
                  ? () => {
                      void onStartNfcAssignScan();
                      onOpenAssignTagsForProduct(product.id);
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      <div className={`${styles.footer} stitchTop`}>
        {/* §3.4: always present, never gated, opens §3.6 blank with Catalog
            view as its origin. */}
        <Button variant="primary" onClick={onRegister}>
          Registrar mercancía
        </Button>
      </div>
    </>
  );
}
