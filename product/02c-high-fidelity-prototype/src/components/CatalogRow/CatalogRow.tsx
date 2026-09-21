import type { CSSProperties } from 'react';
import { TagStub } from '../TagStub/TagStub';
import { stockCaption } from '../../domain/format';
import { toneForProduct } from '../../styles/productIdentity';
import styles from './CatalogRow.module.css';

/**
 * `inventory.md` §3.4 — a Catalog card. **Rewritten in full, 2026-09-19
 * (Product Owner decision, Approved spec): the card is one tap target.**
 *
 * This component's previous three-, four-, five- and six-zone prop surfaces
 * (`onTapRow`/`onTapPrice`/`onTapPhoto`/`onTapBarcode`/`nfcToggle`/
 * `pendingTag`/`reserveNfcSlot`) are retired **as a set, not individually
 * superseded again** — each was correct when written and each is preserved in
 * the spec's own changelog, per that document's non-deletion discipline. What
 * follows does not stack on top of them.
 *
 * **Tapping anywhere on a card — marker, name, price, caption, empty space —
 * opens that Product's own page (§3.19).** There is no second destination
 * reachable from the card's own area, and no tap on it resolves between two
 * outcomes. The tap-zone-disambiguation discipline that produced the six
 * zones is unchanged and still binding; what changed is that it now has
 * almost nothing to arbitrate, which is the point.
 *
 * **What the card carries, and nothing else** — Catalog view answers "what do
 * I have, how much, and at what price," so every element is one of those
 * facts, or the one shortcut:
 * - **Marker** — `Product.photo` when set, otherwise the initial letter (the
 *   same substitution rule `home.md` §3.9 uses, reused verbatim). **Display-
 *   only now** — no longer a tap zone.
 * - **Name**, plain.
 * - **Price** (line 1, trailing) — `Product.defaultPrice`. **Display-only
 *   now.** D33's "Catalog-row-level edit affordance" requirement is satisfied
 *   by §3.19's Precio row, one tap deeper; D33 calls for a Catalog-level
 *   *entry point* to price editing, which the card still is.
 * - **Caption** (line 2, leading) — `N disponibles` / `0 disponibles` /
 *   `sin registrar`, extended with ` · N sin etiquetar` when this Product has
 *   pending tag work. **Passive informational text, not a tap target** — it
 *   carries the count the retired sixth zone used to carry.
 * - **`[ Etiquetar ]`** (line 2, trailing, fixed slot) — the one exception.
 *
 * **The one shortcut, under a hard cap of one per card, ever.** A control may
 * appear here only if it (1) resolves pending work that already exists on
 * this Product right now — never a configuration change, never an edit of a
 * stored fact; (2) is produced by a fact already visible on the card itself;
 * (3) disappears automatically the instant its condition stops holding; and
 * (4) is **pure navigation, never a write** — filter 4 alone is what
 * disqualified the NFC switch, and why its removal is not a decluttering
 * preference. Passing all four makes a control a *candidate*, not a resident:
 * **at most one shortcut renders, ever, even when two or more qualify**, and
 * which one wins is an ordered list maintained in §3.4 (one entry today:
 * `[ Etiquetar ]`), never a computed tie-break. A losing or unlisted
 * candidate is never relocated onto the card in another form — no badge, no
 * dot, no third line. It lives on §3.19.
 *
 * **Hit-area guarantees, binding (`ux-critic` M4), and how each is built:**
 * 1. **Structural separation from the price column, first.** The shortcut
 *    lives on line 2 at the trailing edge; the price lives on line 1. They
 *    share no horizontal space at all, so the shortcut's presence or absence
 *    **cannot** move the price column on this card or any other. This is the
 *    primary guarantee against the alignment defect the Product Owner
 *    reported, and it is structural — not a layout convention that could
 *    drift. It is also why the retired 84px `.nfcSlot` reservation is *gone*
 *    rather than relaxed: with no variable-presence control left on line 1,
 *    the drift it protected against is impossible and it has nothing to
 *    reserve.
 * 2. **A fixed slot within line 2.** `reserveShortcutSlot` is the same
 *    list-level, derived-once signal the retired NFC slot used — pass the
 *    same value to every card in a given list whenever *any* card in it could
 *    carry a shortcut, so the caption's own available width stays constant
 *    card to card and never reflows depending on whether its neighbour has
 *    pending tag work.
 * 3. **Minimum 48×48 hit area, with a real gap.** See `.shortcut` /
 *    `.line2Main` in this component's CSS module for how the gap is
 *    allocated, and the note there on the one place §3.4's own wording is
 *    internally ambiguous.
 * 4. **No nested-button semantics.** The card is **not** a control containing
 *    another control. Three sibling, non-overlapping `<button>`s sit inside
 *    one plain `<div>`: two of them are the card's own tap area (line 1, and
 *    line 2's leading region), the third is the shortcut. The card's region
 *    genuinely **excludes** the shortcut's rect rather than sitting beneath
 *    it — no overlay, no `stopPropagation`, no interactive element nested
 *    inside another. The card's tap area is split into two rects for the
 *    purely geometric reason that the region "all of line 1, plus the leading
 *    part of line 2" is an L-shape and a DOM element is a rectangle; they are
 *    one logical target, so only the first is exposed to keyboard and
 *    assistive technology (the second is `aria-hidden` + `tabIndex={-1}`,
 *    a touch-only extension of the same target).
 *
 * **A dimmed card stays fully tappable.** A `0 disponibles` or `sin registrar`
 * card renders dimmed, the same signal `home.md` §3.9 applies to a sold-out
 * ProductTile — but **unlike that case, dimming here never pairs with
 * non-tappability**, and that is now a statement about the whole card rather
 * than one zone within it. Dimming here means "needs restocking," not
 * "disabled," and this is precisely the card she is most likely to want to
 * open. Her one previous risk — reaching for a dimmed row and hitting a zone
 * she did not mean — is structurally gone, since there is only one thing to
 * hit.
 */
export function CatalogRow({
  name,
  photo,
  price,
  available,
  everReceived,
  pendingTagCount = 0,
  onOpenProduct,
  onTapEtiquetar,
  reserveShortcutSlot,
}: {
  name: string;
  /** `Product.photo` (`product-decisions.md` Q23) — rendered in the marker's
   * position in place of the initial letter whenever set. Display-only. */
  photo?: string;
  price: number;
  available: number;
  everReceived: boolean;
  /** This Product's live `available`, untagged, NFC-tagging-eligible count
   * (`selectors.ts`' `pendingTagCount`, narrowed to this Product) — computed
   * fresh on every Catalog render, per card, never cached. Drives the
   * caption's ` · N sin etiquetar` extension. **Passive text**: it is not
   * itself a target, and never has been since this amendment. */
  pendingTagCount?: number;
  /** §3.4's single tap target → §3.19, this Product's own page. */
  onOpenProduct: () => void;
  /** §3.4's one shortcut. `undefined` renders nothing — the caller owns the
   * rendering condition (≥1 eligible untagged unit on this Product) and the
   * one-shortcut-per-card cap. **Pure navigation: this must never read or
   * write `Product.nfcTaggingEnabled`** — resuming a tagging run and changing
   * a Product's NFC setting are two different intentions and must never be
   * reachable through the same control (the 2026-09-17 reasoning that
   * separated them, retained unchanged; it is what makes the switch's own
   * removal from the card safe rather than a regression). */
  onTapEtiquetar?: () => void;
  /** Reserves line 2's trailing slot even on a card that carries no shortcut
   * — a **list-level** signal, derived once by the caller and passed
   * identically to every card in that list; never derived per card. */
  reserveShortcutSlot?: boolean;
}) {
  const dimmed = available <= 0;
  // §3.4's binding count-caption rule (2026-09-21): singular at exactly N=1
  // (`1 disponible`), plural at zero (`0 disponibles`). Derived in one shared
  // place (`format.ts`) so this card and §3.19's own Level-1 figure can never
  // disagree about the same number.
  const stock = stockCaption(available, everReceived);
  // §3.4: "the caption extends with ` · N sin etiquetar`" — one caption, one
  // string, so it can never be mistaken for two elements, one of which might
  // be tappable. **`sin etiquetar` is invariant** — a prepositional phrase
  // carrying no agreement, so `1 sin etiquetar` is already correct and is
  // deliberately not pluralized here.
  const caption = pendingTagCount > 0 ? `${stock} · ${pendingTagCount} sin etiquetar` : stock;
  const tone = toneForProduct(name);
  const priceLabel = `$${price.toLocaleString('es-MX')}`;

  return (
    <div
      className={`${styles.card} stitchBottom ${dimmed ? styles.dimmed : ''} ${
        reserveShortcutSlot ? styles.withSlot : ''
      }`}
      style={{ '--tone-bg': tone.bg } as CSSProperties}
    >
      {/* Card tap region, rect 1 of 2 — all of line 1. The single element
          exposed to keyboard/AT for this card, carrying the whole card's
          accessible name. */}
      <button
        type="button"
        className={styles.line1}
        onClick={onOpenProduct}
        aria-label={`${name}, ${priceLabel}, ${caption}`}
      >
        <span className={styles.marker} aria-hidden="true">
          <TagStub name={name} photo={photo} muted={dimmed} size={48} />
        </span>
        <span className={styles.name}>{name}</span>
        {/* Money that belongs to one specific Product, so it renders inside
            the shared `.moneyTag` primitive (patterns.css) — unchanged. What
            changed is only that it is no longer a control: a <span>, not a
            <button>, and inside the card's own target rather than beside it. */}
        <span className={`${styles.price} moneyTag`}>{priceLabel}</span>
      </button>

      {/* Card tap region, rect 2 of 2 — line 2's leading region, the caption
          plus the gap separating it from the shortcut. Same destination, same
          logical target; hidden from keyboard/AT so the card is announced
          once, not twice. */}
      <button
        type="button"
        className={styles.line2Main}
        onClick={onOpenProduct}
        tabIndex={-1}
        aria-hidden="true"
      >
        <span className={styles.caption}>{caption}</span>
      </button>

      {/* Line 2's trailing slot. Rendered as a fixed-width sibling whenever
          the list reserves it, occupied or not — an empty slot is what keeps
          every caption in the list the same width. */}
      {(reserveShortcutSlot || onTapEtiquetar) && (
        <div className={styles.shortcutSlot}>
          {onTapEtiquetar && (
            <button
              type="button"
              className={styles.shortcut}
              onClick={onTapEtiquetar}
              // §3.4: "The label carries no count, and is identical to
              // §3.19's own Level-1 action." Both read `[ Etiquetar ]`; the
              // count is one line away on both screens, so putting it in the
              // button too would state one fact twice within a few
              // millimetres. Two entry points to one destination read
              // identically, which is what makes them recognisably the same
              // action. The accessible name names the Product, since a
              // screen-reader user hears this row's buttons out of visual
              // context.
              aria-label={`Etiquetar ${name}`}
            >
              Etiquetar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
