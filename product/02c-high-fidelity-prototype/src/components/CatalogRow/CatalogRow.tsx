import type { CSSProperties } from 'react';
import { TagStub } from '../TagStub/TagStub';
import { toneForProduct } from '../../styles/productIdentity';
import styles from './CatalogRow.module.css';

/** inventory.md §3.4 — Catalog row: marker (own tap target), name/caption
 * (own tap target), price (own tap target) — three independent,
 * non-overlapping zones (`product-decisions.md` Q23's own remediation of a
 * `ux-critic` Major). Same per-Product tone as the selling tile
 * (src/styles/productIdentity.ts) — a merchant learns "Playeras is the clay
 * tag" once, in Inventario, and that same color meets her again on the
 * selling grid, tying the catalog she manages to the grid she sells from.
 *
 * **Fourth tap zone, `decision-log.md` D65's 2026-09-16/17 amendment,
 * Paid tier only** — the overflow indicator ("⋯", rightmost, after the
 * price figure) opens `inventory.md` §3.4c's "Editar código de barras"
 * sheet directly, a single destination today, not an intermediate list.
 * `onTapBarcode` is only ever passed by the caller when
 * `Business.subscriptionTier === 'paid'` (`CatalogView.tsx`'s own gate) —
 * `undefined` on a Free-tier Business, which keeps this row's existing
 * three tap zones exactly as they were, nothing added.
 *
 * **Fifth tap zone, `decision-log.md` D71's amendment
 * (`product-decisions.md` Q31).** A compact NFC-eligibility switch, rendered
 * only when the caller passes `nfcToggle` — `CatalogView.tsx`'s own gate:
 * `Business.nfcPerProductEnabled === true` AND `nfc ∈ registrationMode`
 * AND this Product has no `barcode` (§3.4's own "precise gating condition,
 * stated in full"). A bare tap flips it directly, no sheet, no confirmation
 * — the one action on this row (or anywhere in `inventory.md`) with no
 * separate confirm step.
 *
 * **Layout, 2026-09-17 visual-defect pass (Product Owner report).** The
 * switch sits *before* the price tag, not after — her explicit ask, and it
 * also reads more naturally as "a property of this Product that affects
 * how its price tag behaves" sitting immediately to price's left. It lives
 * in a fixed-width slot (`.nfcSlot`) that's reserved (empty but still
 * taking up its column width) whenever `reserveNfcSlot` is true, even on a
 * specific row where `nfcToggle` itself is `undefined` (a barcoded Product
 * in an NFC-per-product-enabled Business, say) — otherwise the price tag's
 * left edge would drift left/right row to row depending on which rows
 * happen to carry the switch, which is exactly the misalignment reported.
 * `reserveNfcSlot` is a list-level signal (pass the same value, derived
 * once, to every row in a given Catalog list) — see `CatalogView.tsx`. The
 * barcode overflow ("⋯", after price) doesn't get the same reserved-slot
 * treatment: unlike `nfcToggle`, `onTapBarcode` is already uniform across
 * every row in a given list (gated only on `Business.subscriptionTier`,
 * never per-Product), so it can't itself produce this row-to-row drift.
 *
 * **Sixth tap zone, 2026-09-17 live pass ("Continuar etiquetando" and the
 * combined, cross-Catalog pending-tag queue retired; entry/resume become
 * per-Product) — `pendingTag`.** A live-computed `[ N sin etiquetar ]`
 * resume affordance, rendered only when this Product currently has ≥1
 * `available`, untagged, NFC-tagging-eligible unit (`selectors.ts`'
 * `pendingTagCount`, disjunct-agnostic — renders identically for the legacy
 * whole-Catalog `defaultSellingMode = 'nfc'` case or the per-Product
 * `nfcPerProductEnabled` case, `inventory.md` §3.4's own text). **Never
 * reads or writes `Product.nfcTaggingEnabled`** — pure navigation into the
 * identical Product-scoped Asignar Tags destination the fifth zone's own
 * toggle-ON auto-open reaches, the *only* way to resume an interrupted
 * per-Product queue after "Terminar después." Deliberately not folded into
 * the fifth zone (§3.4's own reasoning, restated in full there): turning
 * NFC off is a real, meaningful state change that must never fire as a side
 * effect of wanting to resume tagging. Rendered as a second line below the
 * tappable-zones row (`.pendingTagLink`, the same "conventional caption
 * below the row" placement `DESIGN-SYSTEM.md` §8 already establishes for
 * the fifth zone's own slow-save hint) rather than a seventh horizontal
 * column — a variable-length "N sin etiquetar" string can't itself be given
 * a fixed reserved width the way `.nfcSlot`'s single switch glyph can, and
 * placing it on its own line means it shares no horizontal space with
 * price/marker/switch at all, so it can't reintroduce the row-to-row
 * column-drift bug the fifth zone's own reserved-slot fix closed — there is
 * nothing here for a reserved-column technique to protect. No save-state
 * discipline needed (unlike zones 1–5): this is read-only navigation, never
 * a write, so there's nothing to dim, retry, or fail. */
export function CatalogRow({
  name,
  photo,
  price,
  available,
  everReceived,
  onTapRow,
  onTapPrice,
  onTapPhoto,
  onTapBarcode,
  nfcToggle,
  reserveNfcSlot,
  pendingTag,
}: {
  name: string;
  /** `Product.photo` (`product-decisions.md` Q23) — rendered in the
   * marker's position in place of the initial letter whenever set. */
  photo?: string;
  price: number;
  available: number;
  everReceived: boolean;
  onTapRow: () => void;
  onTapPrice: () => void;
  /** Opens `inventory.md` §3.4b's "Editar foto" sheet — a bare tap on the
   * marker/photo icon, distinct from `onTapRow`/`onTapPrice`. */
  onTapPhoto: () => void;
  /** Opens `inventory.md` §3.4c's "Editar código de barras" sheet — a bare
   * tap on the "⋯" overflow indicator, distinct from every other zone on
   * this row. `undefined` on a Free-tier Business (the gate this prop's
   * own caller enforces) renders no overflow indicator at all. */
  onTapBarcode?: () => void;
  /** `inventory.md` §3.4's fifth tap zone — `undefined` renders nothing
   * (the gate this prop's own caller, `CatalogView.tsx`, enforces).
   * `saving`/`slow` distinguish the near-instant (silent dim) vs. slow
   * (>~1.5s, "Guardando…" caption below the row) cases per §3.4's own
   * save-state discipline; `error` renders the inline "No pudimos guardar"
   * line below the row, with the switch itself staying tappable as its own
   * retry. */
  nfcToggle?: {
    enabled: boolean;
    saving: boolean;
    slow: boolean;
    error: boolean;
    onTap: () => void;
  };
  /** Reserves this row's `.nfcSlot` column width even when `nfcToggle` is
   * `undefined` for this specific row — see the layout note above. Pass the
   * same list-level value (`CatalogView.tsx`'s own `nfcPerProductAvailable`)
   * to every row in a given Catalog list; never derive it per-row. */
  reserveNfcSlot?: boolean;
  /** `inventory.md` §3.4's sixth tap zone (2026-09-17) — `undefined` (or a
   * zero `count`) renders nothing. Pure navigation: `onTap` must never touch
   * `Product.nfcTaggingEnabled` — see this component's own top-of-file doc
   * comment for the full reasoning against folding this into `nfcToggle`. */
  pendingTag?: {
    count: number;
    onTap: () => void;
  };
}) {
  const dimmed = available <= 0;
  const caption = !everReceived ? 'sin registrar' : `${available} disponibles`;
  const tone = toneForProduct(name);
  const nfcSaving = nfcToggle?.saving ?? false;

  return (
    <div
      className={`${styles.row} stitchBottom ${dimmed ? styles.dimmed : ''}`}
      style={{ '--tone-bg': tone.bg } as CSSProperties}
    >
      {/* `settings.md` §3.9's own "fila atenuada" mechanic, composed onto
          this row's existing architecture (§3.4's own D71 text) — the whole
          row dims while the NFC switch's own write is in flight, not just
          the switch itself. */}
      <div className={`${styles.rowMain} ${nfcSaving ? styles.rowMainSaving : ''}`}>
        <button
          className={styles.marker}
          onClick={(e) => {
            e.stopPropagation();
            onTapPhoto();
          }}
          aria-label={`Editar foto de ${name}`}
        >
          <TagStub name={name} photo={photo} muted={dimmed} size={48} />
        </button>
        <button className={styles.main} onClick={onTapRow}>
          <span className={styles.name}>{name}</span>
          <span className={styles.caption}>{caption}</span>
        </button>
        {(reserveNfcSlot || nfcToggle) && (
          <div className={styles.nfcSlot}>
            {nfcToggle && (
              <button
                type="button"
                role="switch"
                aria-checked={nfcToggle.enabled}
                className={`${styles.nfcSwitch} ${nfcToggle.enabled ? styles.nfcSwitchOn : ''}`}
                disabled={nfcSaving}
                onClick={(e) => {
                  e.stopPropagation();
                  nfcToggle.onTap();
                }}
                aria-label={`${nfcToggle.enabled ? 'Desactivar' : 'Activar'} venta con NFC para ${name}`}
              >
                <span className={styles.nfcSwitchKnob} />
              </button>
            )}
          </div>
        )}
        <button
          className={`${styles.price} moneyTag`}
          onClick={(e) => {
            e.stopPropagation();
            onTapPrice();
          }}
        >
          ${price.toLocaleString('es-MX')}
        </button>
        {onTapBarcode && (
          <button
            className={styles.overflow}
            onClick={(e) => {
              e.stopPropagation();
              onTapBarcode();
            }}
            aria-label={`Editar código de barras de ${name}`}
          >
            ⋯
          </button>
        )}
      </div>
      {pendingTag && pendingTag.count > 0 && (
        <button
          type="button"
          className={styles.pendingTagLink}
          onClick={(e) => {
            e.stopPropagation();
            pendingTag.onTap();
          }}
          aria-label={`Terminar de etiquetar ${name} — ${pendingTag.count} sin etiquetar`}
        >
          {pendingTag.count} sin etiquetar
        </button>
      )}
      {nfcToggle?.error && <p className={styles.nfcError}>No pudimos guardar. Intenta de nuevo.</p>}
      {nfcToggle && nfcSaving && nfcToggle.slow && (
        <p className={styles.nfcSavingHint}>Guardando cambio de NFC…</p>
      )}
    </div>
  );
}
