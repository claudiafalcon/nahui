import { useRef, useState } from 'react';
import { useStore } from '../../../domain/store';
import { availableCount, everReceived, pendingTagCount, taggedOnHandUnitCount } from '../../../domain/selectors';
import { pluralize, stockCaption, taggedUnitsKeepSelling } from '../../../domain/format';
import { AmbientConfirmation } from '../../../components/AmbientConfirmation/AmbientConfirmation';
import { Button } from '../../../components/Button/Button';
import { DetailRow } from '../../../components/DetailRow/DetailRow';
import { TagStub } from '../../../components/TagStub/TagStub';
import type { ID, Product } from '../../../domain/types';
import { EditPriceSheet } from './EditPriceSheet';
import { EditPhotoSheet } from './EditPhotoSheet';
import { EditBarcodeSheet } from './EditBarcodeSheet';
import { EditNameSheet } from './EditNameSheet';
import { RemoveBarcodeSheet } from './RemoveBarcodeSheet';
import styles from './ProductPage.module.css';

/** §3.19's own slow threshold for the NFC row — §3.10's ">~1.5s", the
 * identical value every other write in this codebase uses. */
const SLOW_THRESHOLD_MS = 1500;

type OpenSheet = 'price' | 'photo' | 'barcode' | 'remove-barcode' | 'name' | null;

/**
 * `inventory.md` §3.19 "Página de producto" — **new 2026-09-19, the
 * destination of every Catalog card tap.**
 *
 * **What this screen is for, in one line:** Catalog view = scan and compare
 * Products. **Product Page = understand and manage one Product.** Editors and
 * flows (§3.4a/§3.4b/§3.4c, §3.6, §3.14, §3.19a) = perform one specific task.
 * **Nothing on this page performs a task that has its own flow** — the page's
 * job is to show one Product truthfully and route.
 *
 * **Three levels, in the Product Owner's own stated order:**
 * 1. stock/status figures + primary inventory actions — **nothing here
 *    writes**; all three actions are navigation into flows that own their own
 *    writes.
 * 2. product details and identification — every row is a tap target (see
 *    `DetailRow` for the three-shape vocabulary and why there is deliberately
 *    no passive row shape on this level).
 * 3. a named, reserved, **deliberately undesigned** place for contextual and
 *    future sections. **Nothing renders here today** — no heading, no
 *    placeholder, no "próximamente," no empty container. It exists in the
 *    page's information architecture so a future section lands in a decided
 *    place instead of being wedged into Level 1 or Level 2, which is exactly
 *    how the Catalog card accumulated six zones. Reserved, in order:
 *    `Este producto en tus eventos` (→ `product-decisions.md` Q32),
 *    `Movimientos de este producto` (→ §8 item 3 / Q32), and
 *    `Desactivar producto` (→ `product-decisions.md` Q21 — the mechanism is
 *    decided, the affordance is not, and `Product.active` does not currently
 *    exist in `domain-model.md` or `types.ts`).
 *
 * **The on-screen heading is the Product's name, never the string "Página de
 * producto"** — the identical relationship §3.4a/§3.4b/§3.4c already
 * establish, avoiding the CTA/heading-collision defect class this project has
 * found and fixed twice (HJR-INV-M1, HJR-EVT-M1).
 *
 * **This page is never dimmed, at any stock level.** Dimming is a
 * list-scanning signal that distinguishes one card from its neighbours; on a
 * screen about exactly one Product there are no neighbours, so it would carry
 * no information and would read as "disabled." A `0 disponibles` or
 * `sin registrar` Product renders in full, normally, with the stock figure
 * stating the plain fact. A deliberate divergence from §3.4's card treatment.
 *
 * **No resolving pair, and no new fetch.** Every fact here was already loaded
 * by Inventario's own tab-level state load, so opening a Product Page
 * performs no new fetch and no new capability resolution — there is no
 * interval for a skeleton or a "Cargando…" line to occupy, and neither is
 * ever shown (§3.19's own load-and-failure note).
 */
export function ProductPage({
  product,
  confirmationMessage,
  confirmationDetail,
  confirmationToken,
  onBack,
  onRegisterMerchandise,
  onCorrectQuantity,
  onEtiquetar,
}: {
  product: Product;
  /** §3.12/§3.13/§3.13a's ambient confirmation, **rendered on whichever
   * screen the operation actually returned to.** These lines are a property
   * of the *destination*, not of Catalog view specifically (§3.12/§3.13/
   * §3.13a's own 2026-09-19 correction), so the copy and shape here are
   * identical to `CatalogView`'s — same string, same ambient/fading/
   * no-tap-to-dismiss behaviour, composed once by `InventoryScreen` and
   * handed to whichever screen is the origin. **Rendered through the shared
   * `AmbientConfirmation`, not a local copy of it** (`ux-critic` Major 2,
   * 2026-09-21): the spec requires the two screens to stay identical forever,
   * and the first build had already drifted — Catalog view faded at 2400ms
   * while this page rendered the prop straight through and never faded at
   * all, leaving a stale success claim standing over current state, including
   * over a failure line beneath it. */
  confirmationMessage?: string | null;
  confirmationDetail?: string | null;
  /** One fresh value per delivered confirmation — what makes a *second*,
   * byte-identical save visibly confirm on a page that never remounts
   * (`ScreenTransition`'s key is stable per Product). */
  confirmationToken?: string | number | null;
  /** §3.19: "Back arrow '← Inventario' returns to Catalog view (§3.4),
   * always" — this page is reached from exactly one place today, so its own
   * back destination needs no origin logic. */
  onBack: () => void;
  /** Level 1 → §3.6, Producto already resolved, **receipt stepper
   * pre-revealed.** */
  onRegisterMerchandise: () => void;
  /** Level 1 → §3.6, Producto already resolved, **correction mode
   * pre-revealed.** */
  onCorrectQuantity: () => void;
  /** Level 1 → §3.14, Product-scoped. Identical label and identical
   * destination to §3.4's card shortcut. */
  onEtiquetar: () => void;
}) {
  const { state, setProductNfcTaggingEnabled } = useStore();
  const [openSheet, setOpenSheet] = useState<OpenSheet>(null);
  /** Ambient, fading, no-tap-to-dismiss — this page's own local writes
   * (§3.4b's "Foto guardada", §3.4c's ordinary one-line case, §3.19c's
   * "Código de barras quitado"). **The same shared component, and therefore
   * literally the same shape and lifecycle** as the origin-delivered
   * confirmations above; these simply originate here. The token is minted per
   * *showing*, not per string, so saving the same photo twice confirms twice
   * — the identical reason the origin-delivered ones carry one. */
  const [toast, setToast] = useState<{ text: string; token: number } | null>(null);
  const toastSeqRef = useRef(0);
  function showToast(text: string) {
    toastSeqRef.current += 1;
    setToast({ text, token: toastSeqRef.current });
  }
  /**
   * §3.4c's **second confirmation shape** (amended 2026-09-19): when a
   * barcode save actually cleared `nfcTaggingEnabled` and/or this Product has
   * ≥1 tagged unit on hand, a fading ambient line is the wrong vehicle for
   * two or three sentences. This document already has the right pattern for
   * "acknowledge why something just changed" — §3.3a's one-time,
   * non-blocking acknowledgment banner — reused rather than stretched: shown
   * once on this landing, no tap to dismiss it and no tap required to
   * proceed, never repeated on a later open (it lives in this mount's own
   * state and is gone the moment she leaves the page).
   */
  const [barcodeAck, setBarcodeAck] = useState<string[] | null>(null);

  // §3.19's NFC row save-state discipline. One row, so a single set of flags
  // rather than the per-row `Set`s the retired Catalog-row switch needed.
  const [nfcBusy, setNfcBusy] = useState(false);
  const [nfcSlow, setNfcSlow] = useState(false);
  const [nfcError, setNfcError] = useState(false);
  /** The value she just tapped toward, displayed optimistically while the
   * write is in flight — "she sees `Sí` the instant she taps `No`." Only ever
   * read while `nfcBusy`; the moment the write resolves, the row goes back to
   * reading live stored state, which is what makes the failure path a genuine
   * revert rather than a second piece of local truth. */
  const [nfcAttempted, setNfcAttempted] = useState<boolean | null>(null);
  /** One stable idempotency key per logical NFC-row attempt, replayed
   * unchanged if she taps the row again to retry a failed write
   * (*architecture-principles.md* #7 — this write is explicitly exposed to a
   * client-initiated retry, since the row itself *is* the retry). Cleared on
   * success; a later, genuinely new flip mints its own. */
  const nfcKeyRef = useRef<string | null>(null);

  const available = availableCount(state, product.id);
  const registered = everReceived(state, product.id);
  const pending = pendingTagCount(state, product.id);
  /**
   * §3.19's Level-1 `N ya etiquetadas` — **sourced from live unit state, never
   * from `Product.nfcTaggingEnabled`** (`architect` ruling, binding; D80).
   * The flag records a *future-eligibility choice* and says nothing about
   * whether a given garment sells by tag — and on a barcoded Product it is
   * always `false`, which is precisely the case this line exists for.
   */
  const taggedOnHand = taggedOnHandUnitCount(state, product.id);

  const business = state.business;
  const paid = business?.subscriptionTier === 'paid';
  /** §3.19's NFC-row gate, stated in full: `nfcPerProductEnabled === true`
   * **and** `nfc ∈ registrationMode` (i.e. `subscriptionTier = paid`) **and**
   * this Product has **no** `barcode`. Absent entirely otherwise — never
   * disabled, never greyed, never with explanatory upsell copy. The middle
   * clause is normally redundant (the only write path that can set
   * `nfcPerProductEnabled = true` is itself only offered while paid) until a
   * Paid→Free downgrade lands, which never resets that stored value —
   * checking it explicitly keeps this row honestly absent for a
   * since-downgraded Business. */
  const nfcSwitchLive = business?.nfcPerProductEnabled === true && paid && !product.barcode;

  /**
   * What the NFC row currently *reads*. **On tap it immediately displays the
   * attempted new value** — she sees `Sí` the instant she taps `No` — and the
   * moment the write resolves this falls straight back to live stored state.
   * That optimistic display is only safe because failure is guaranteed to
   * undo it: the store mirrors nothing on a failed write, so dropping
   * `nfcAttempted` *is* the revert to "the last value actually stored," with
   * no second piece of local truth to go stale. The row is never left
   * displaying the attempted value after a failure.
   *
   * It is also what the standing caption below the row and **Level 1's own
   * clause A** both follow — each belongs to what the row *says*, not to what
   * the server has confirmed, so neither flickers out and back during an
   * ordinary flip, and the two swap in the same beat as the word and the
   * control (§3.19: "the swap happens in the same beat as the write").
   *
   * Computed before the clauses below because clause A reads it.
   */
  const nfcDisplayed = nfcBusy && nfcAttempted !== null ? nfcAttempted : product.nfcTaggingEnabled;

  /**
   * §3.19's two independently-conditional clauses on `N ya etiquetadas`.
   * Both are **basis statements, not warnings**, and they compose into one
   * sentence rather than stacking as fragments. Never framed as a conflict, a
   * warning or an error: no icon, no colour cue, no "atención," no offer to
   * reconcile anything.
   *
   * - **Clause A** renders in **every state except one: a live NFC switch
   *   reading `Sí`** (condition corrected 2026-09-21, `ux-critic` m4). The
   *   condition is the rationale stated directly rather than a proxy for it:
   *   the fact is self-evident only while the switch is live *and* on,
   *   because only then does the page already say, in the caption directly
   *   beneath that row, that tagged garments keep selling. In every other
   *   state — no switch at all (this Product has a `barcode`, or
   *   `nfcPerProductEnabled` is off) **and** a live switch reading `No` —
   *   nothing else on the page implies it, so the clause renders. **The
   *   earlier `!nfcSwitchLive` test was strictly narrower than its own stated
   *   reason**, so a Product whose garments already carry tags and whose
   *   switch she has since turned off rendered `5 ya etiquetadas` directly
   *   above `[ Vender con tag NFC   No ]` with nothing reconciling the two —
   *   a state D71 explicitly blesses and §3.19c's own post-clear landing
   *   produces deliberately.
   *
   *   **Exactly one statement about already-tagged garments renders at a
   *   time, and the two are complementary by construction.** While the row
   *   reads `Sí`, its caption carries the *conditional* form ("Si lo apagas,
   *   las prendas que ya tienen tag siguen igual"); in every other state
   *   Level 1 carries the *present-tense* form. They never render together
   *   and never both go missing — which is why both read `nfcDisplayed`, the
   *   same single value the row's word and control are drawn from.
   *
   *   **After a §3.19c barcode clear the clause is KEPT, not dropped**
   *   (corrected 2026-09-21): the newly-live switch reads `No`, so it carries
   *   no caption of its own and makes nothing self-evident. "A live switch is
   *   now present" was never the operative reason.
   * - **Clause B** renders when **`ya etiquetadas > disponibles`** — a plain
   *   comparison of two figures already on screen, never a read into Selling
   *   and never a check of *why*. This is the cross-basis disclosure: the
   *   three figures deliberately do not sum (`sin etiquetar` is a strict
   *   subset of `disponibles`; `ya etiquetadas` spans `available` **and**
   *   `reserved`, so it counts garments `disponibles` does not), and this
   *   states that fact at the one moment the two figures visibly disagree.
   *
   * **Both clauses take their singular at N=1** (§3.19's "the same four forms
   * at N=1"). Clause B's singular is not merely grammatical but *more*
   * precise: N=1 with clause B firing necessarily means `0 disponibles`, and
   * "aunque no aparezca como disponible" says exactly that — still naming the
   * figure by the label she read one line above, still avoiding "apartadas"
   * (a word reserved for the not-yet-started Apartado capability).
   */
  const clauseA = taggedOnHand > 0 && !(nfcSwitchLive && nfcDisplayed);
  const clauseB = taggedOnHand > 0 && taggedOnHand > available;
  const one = taggedOnHand === 1;
  const clauseAText = one ? 'se sigue vendiendo con su tag' : 'se siguen vendiendo con su tag';
  const clauseBText = one
    ? 'aunque no aparezca como disponible'
    : 'aunque no todas aparezcan como disponibles';
  const taggedClause = clauseA
    ? clauseB
      ? ` — ${clauseAText}, ${clauseBText}`
      : ` — ${clauseAText}`
    : clauseB
      ? ` — ${clauseBText}`
      : '';

  /** §3.4's binding count-caption rule, cited from §3.19 and derived in the
   * one shared place `CatalogRow` reads it from, "so the card and the page
   * can never disagree about one figure": `1 disponible` at exactly N=1,
   * `0 disponibles` at zero. */
  const stockLine = stockCaption(available, registered);

  async function handleToggleNfc() {
    if (nfcBusy) return; // a second tap is ignored, never queued
    const next = !product.nfcTaggingEnabled;
    setNfcAttempted(next);
    setNfcBusy(true);
    // "The line clears on the next tap of that row, successful or not."
    setNfcError(false);
    const slowTimer = window.setTimeout(() => setNfcSlow(true), SLOW_THRESHOLD_MS);
    if (!nfcKeyRef.current) nfcKeyRef.current = crypto.randomUUID();
    const ok = await setProductNfcTaggingEnabled(product.id, next, nfcKeyRef.current);
    window.clearTimeout(slowTimer);
    setNfcSlow(false);
    setNfcBusy(false);
    setNfcAttempted(null);
    if (!ok) {
      // The row reverts to the last value actually stored — never left
      // displaying the attempted value. That revert is free here: the store
      // only mirrors on success, and dropping `nfcAttempted` puts the row
      // straight back on live stored state.
      setNfcError(true);
      return;
    }
    nfcKeyRef.current = null;
    // **A successful save never navigates anywhere** — the 2026-09-17
    // toggle-ON auto-entry into Asignar Tags is reversed and retired outright
    // (Product Owner decision, 2026-09-19: "turning NFC on should only change
    // the product setting. It should NOT automatically enter tagging.
    // [Etiquetar] is the explicit action that starts the tagging flow.").
    // What she sees instead, immediately, without leaving this page: Level 1
    // gains `N sin etiquetar` and `[ Etiquetar ]` and switches to its
    // pending-work ordering in the same beat this row finishes saving,
    // because both are derived live from the store this write just updated.
    // The consequence of the setting becomes visible one level up on the
    // screen she is already on — which is what makes withholding the
    // navigation honest rather than merely quieter. If she has nothing yet
    // received, nothing appears, and no empty tagging queue is ever reachable
    // (D46's own rule, preserved at the Product level).
  }

  /** §3.4c's two-shape confirmation rule, composed here because this is the
   * screen the save returns to. */
  function handleBarcodeSaved({ clearedNfcFlag }: { clearedNfcFlag: boolean }) {
    // Re-read live, after the write: the tagged-unit count is unaffected by a
    // barcode save (zero units and zero tags are touched), but reading it
    // here keeps this page's single sourcing site for that fact.
    const tagged = taggedOnHandUnitCount(state, product.id);
    if (!clearedNfcFlag && tagged === 0) {
      // The common case — correcting a misread code on a Product with no
      // tagged units and no NFC flag to clear. Byte-identical to before this
      // amendment: one fading line.
      showToast('Código de barras actualizado ✓');
      return;
    }
    const lines = ['Código de barras actualizado ✓'];
    if (clearedNfcFlag) {
      // Names what stopped, because what she will notice is that the NFC row,
      // the `N sin etiquetar` figure and `[ Etiquetar ]` all vanished at once.
      // Those three disappearances are correct and are not restored (D71,
      // D73); this sentence explains them, it does not apologise for them or
      // offer to undo them.
      //
      // **Anchored to "este producto," never to the Product's name**
      // (§3.4c, corrected 2026-09-21). The first build interpolated the name
      // — "Camisas ya no se etiqueta — ahora **la** encuentras" — which
      // breaks on **both gender and number** for a merchant-supplied name
      // ("Delantales ya no se etiqueta — ahora la encuentras" is wrong
      // twice), and plural names are the common case, not the edge: every
      // example in the spec, and most of Ana's catalog, is plural. Agreement
      // is unknowable at authoring time, so the sentence hangs on an
      // invariant noun instead of a grammatical workaround — `producto` is
      // masculine singular always, and is already-approved merchant
      // vocabulary here (§3.19b). **Dropping the name costs nothing**: this
      // banner form only ever renders on §3.19, whose on-screen heading *is*
      // the name, larger, one line above.
      lines.push('Ya no vas a etiquetar este producto — ahora lo encuentras escaneando su código.');
    }
    if (tagged > 0) {
      // The one fact that persists through the change and that nothing else
      // on screen would otherwise tell her — a Product can be
      // barcode-identified while some of its units still carry tags, and
      // those units keep selling (D79/D80).
      //
      // **The N=1 form carries no numeral at all** — "La prenda que ya tiene
      // tag," never "La 1 prenda," which is not Spanish. It is therefore a
      // **distinct full string, not a count-plus-noun template**, which is
      // why it comes from `taggedUnitsKeepSelling`'s own string pair rather
      // than from `pluralize`'s noun pair. N=0 needs no form: the sentence's
      // render condition is ≥1 tagged unit.
      //
      // **Shared with §3.19c's sheet, from one place** (`ux-critic` m5,
      // 2026-09-21): the same fact, on two screens that sit directly over one
      // another, is one string. `withCount` is the only legitimate difference
      // — here the count *is* the reassurance (§3.4c's own note), and it
      // appears only in the plural.
      lines.push(taggedUnitsKeepSelling(tagged, { withCount: true }));
    }
    setBarcodeAck(lines);
  }

  /** §3.19c's ambient confirmation. The second clause renders **only when the
   * NFC row will actually be a live switch after the clear** — for every
   * other Business the line is plain, since mentioning a capability she does
   * not have would be both untrue and the upsell posture §2 already rules
   * out. No in-flow NFC offer is added beyond this: the page already makes
   * the offer better than a prompt would, since the NFC row reappears as a
   * live switch reading `No` in the exact screen position it already
   * occupied, at the moment it becomes real, with no extra screen and no
   * extra tap (D80 permits an offer and forbids auto-enabling; this is the
   * same mechanism the reverse direction uses, which is what makes the page
   * predictable).
   *
   * **Nothing here touches Level 1's clause A, and it must not.** `N ya
   * etiquetadas` is unchanged (the write touches zero units and zero tags)
   * and **keeps its clause**: the newly-live switch reads `No`, so it carries
   * no caption and makes nothing self-evident (§3.19c, corrected
   * 2026-09-21). That falls out of the clause's own live condition — there is
   * no post-clear special case, and adding one would be the defect. */
  function handleBarcodeRemoved() {
    const willOfferNfc = business?.nfcPerProductEnabled === true && paid;
    setBarcodeAck(null);
    showToast(
      willOfferNfc
        ? 'Código de barras quitado ✓ — ahora puedes venderlo con tag, si quieres.'
        : 'Código de barras quitado ✓',
    );
  }

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Inventario
        </button>
      </div>

      {/* The origin-delivered line (§3.12/§3.13/§3.13a) and this page's own
          local ones (§3.4b/§3.4c/§3.19c) render through the *same* component,
          which is what keeps "identical copy and identical shape on both"
          true by construction rather than by two matching edits. */}
      <AmbientConfirmation
        message={confirmationMessage}
        detail={confirmationDetail}
        token={confirmationToken}
      />
      <AmbientConfirmation message={toast?.text} token={toast?.token} />
      {barcodeAck && (
        <div className={styles.ackBanner}>
          {barcodeAck.map((line, i) => (
            <p key={i} className={i === 0 ? styles.ackHead : styles.ackBody}>
              {line}
            </p>
          ))}
        </div>
      )}

      <div className={styles.scroll}>
        {/* Passive header — display-only, never a tap target, deliberately
            unbracketed in the spec's own notation. It renders `Product.photo`
            when one is set, otherwise the initial letter, by the same
            substitution rule §3.4 uses. Photo inspection at a larger size
            stays inside §3.4b: the page already shows the photo at header
            size, so a second route to it would be a second way to do one
            thing. */}
        <div className={styles.header}>
          <span className={styles.headerMarker} aria-hidden="true">
            <TagStub name={product.name} photo={product.photo} size={64} />
          </span>
          <div className={styles.headerText}>
            <h1 className={styles.heading}>{product.name}</h1>
            <p className={`${styles.headerPrice} moneyTag`}>${product.defaultPrice.toLocaleString('es-MX')}</p>
          </div>
        </div>

        {/* ---------------- Level 1 — stock/status + primary actions -------
            The figures are plain text (§3's "plain text = passive/
            informational"): no trailing slot, no target, derived from live
            unit state. **Passive facts belong on this level**, never on
            Level 2 — an earlier draft of this amendment put a read-only NFC
            statement among the rows and, in taking the row shape, drew its
            subject from `Product.nfcTaggingEnabled`, rendering "No" for a
            Product with ten tagged garments that were selling perfectly well.
            The level split is what keeps the sourcing honest: Level 1 reports
            what is true of the units right now; Level 2 edits what is stored
            about the Product. */}
        <div className={styles.figures}>
          <p className={styles.figure}>{stockLine}</p>
          {/* Rendered only while ≥1 such unit exists; at zero it is absent
              entirely, since there is nothing to disclose and a standing line
              at zero would reintroduce the phantom-entry class D73 removed.
              The condition is tagged units, never the barcode. */}
          {taggedOnHand > 0 && (
            <p className={styles.figure}>
              {taggedOnHand} ya {pluralize(taggedOnHand, 'etiquetada', 'etiquetadas')}
              {taggedClause}
            </p>
          )}
          {pending > 0 && <p className={styles.figure}>{pending} sin etiquetar</p>}
        </div>

        {/* Two orderings, depending on whether pending tag work exists — the
            direct application of this document's own 2026-08-07
            task-priority precedent, at the Product level now that the
            Catalog-level state it was written for is retired. That precedent
            made the tagging action primary and "Registrar mercancía"
            explicitly secondary *in that one state only*, never gated and
            never moved; this mirrors it exactly, one scope down. */}
        <div className={styles.actions}>
          {pending > 0 && (
            <Button variant="primary" onClick={onEtiquetar}>
              Etiquetar
            </Button>
          )}
          <Button variant={pending > 0 ? 'secondary' : 'primary'} onClick={onRegisterMerchandise}>
            Registrar mercancía
          </Button>
          <Button variant="secondary" onClick={onCorrectQuantity}>
            Corregir cantidad
          </Button>
        </div>

        {/* ---------------- Level 2 — details and identification -----------
            Separated from Level 1 by a plain divider, with **no section
            heading** — the level break is carried by the divider plus the
            uniform row shape, and an added heading would be a label that
            informs nothing (`events.md` §3.4's rule: nothing on screen that
            isn't informative).

            Row order is **frequency of real use, most-used first** — the
            Product Owner's own listed order, and the honest one: price
            changes with the season, a photo gets added once and rarely
            touched, a barcode is corrected only when misread, an NFC setting
            is decided once per Product, a name is changed almost never.

            **Rows absent rather than empty.** A Free-tier Business sees
            Precio, Foto, Nombre and nothing else. A Paid Business with
            `nfcPerProductEnabled = false` sees Precio, Foto, Código de
            barras, Nombre. A barcode-identified Product sees no NFC row at
            all (D71, unchanged and not reinterpreted). Nothing renders
            disabled, greyed, or with explanatory upsell copy, and no empty
            divider or orphan heading ever renders. */}
        <div className={`${styles.level2} stitchTop`}>
          <DetailRow
            shape="value"
            label="Precio"
            value={`$${product.defaultPrice.toLocaleString('es-MX')}`}
            onTap={() => setOpenSheet('price')}
          />
          {/* Value reads a plain `Con foto`/`Sin foto` rather than a
              thumbnail — the page already shows the photo at header size, and
              a second thumbnail here would be the same fact twice. */}
          <DetailRow
            shape="value"
            label="Foto"
            value={product.photo ? 'Con foto' : 'Sin foto'}
            onTap={() => setOpenSheet('photo')}
          />
          {/* Paid tier only — absent entirely on a Free-tier Business, never
              shown-then-blocked, inheriting §2's existing gate rather than
              defining a new one. The "⋯" glyph is retired with the card zone;
              a named row needs no overflow indicator. */}
          {paid && (
            <DetailRow
              shape="value"
              label="Código de barras"
              value={product.barcode ?? 'Sin código'}
              onTap={() => setOpenSheet('barcode')}
            />
          )}
          {/* Rendered only when this Product currently has a barcode; absent
              at "Sin código," where there is nothing to remove. **Its own
              full-width tap target, a sibling row and never nested inside the
              row above.** */}
          {paid && product.barcode && (
            <DetailRow
              shape="action"
              label="Quitar código de barras"
              onTap={() => setOpenSheet('remove-barcode')}
            />
          )}
          {nfcSwitchLive && (
            <>
              {/* **The one control on this page that writes directly.** The
                  whole row is the tap target: a bare tap anywhere on it flips
                  the value — no smaller switch-shaped sub-target to aim at,
                  the two-position control included, no sheet, no
                  confirmation, no separate save. It carries no "›", trails
                  only `Sí` or `No`, and ends in a control shown in its
                  current position — the three halves of the shape-3
                  contract, all readable at rest, before she commits to
                  anything. She can tell this row writes and the ones above it
                  don't without touching any of them.

                  The word and the control are both drawn from this single
                  `value` prop, so they cannot disagree in any state: they
                  move together on tap, hold the attempted position together
                  through `Guardando…`, and revert together on failure
                  (§3.19's save-state discipline; `DetailRow` states the
                  construction). */}
              <DetailRow
                shape="instant"
                label="Vender con tag NFC"
                value={nfcDisplayed ? 'Sí' : 'No'}
                pending={nfcSlow}
                busy={nfcBusy}
                onTap={() => void handleToggleNfc()}
              />
              {/* D71's own invariant, already settled and not reopened here,
                  stated in merchant language at the moment it matters:
                  turning NFC off never untags or orphans an already-tagged
                  unit. A standing caption, not a warning and not a
                  confirmation dialog — a fact about a reversible setting, not
                  a risk. Merchant vocabulary throughout. */}
              {nfcDisplayed && (
                <p className={styles.rowCaption}>
                  Si lo apagas, las prendas que ya tienen tag siguen igual. Solo dejas de etiquetar las que faltan.
                </p>
              )}
              {/* The inline failure line renders directly beneath that row
                  only; nothing else on the page is affected, nothing is
                  blocked, and the rest of the page stays fully interactive.
                  **The row itself is the retry** — no separate
                  `[ Reintentar ]`, no full-screen error. */}
              {nfcError && (
                <p className={styles.rowError} role="alert">
                  No pudimos guardar. Intenta de nuevo.
                </p>
              )}
            </>
          )}
          {/* Placed last deliberately: the rarest change on the page, and the
              only row whose value is already the page's own heading — putting
              it first would read as a duplicated title rather than a
              control. */}
          <DetailRow shape="value" label="Nombre" value={product.name} onTap={() => setOpenSheet('name')} />
        </div>

        {/* Level 3 — nothing renders today. Deliberately not a placeholder;
            see this component's own top-of-file note. */}
      </div>

      {openSheet === 'price' && <EditPriceSheet product={product} onClose={() => setOpenSheet(null)} />}
      {openSheet === 'photo' && (
        <EditPhotoSheet
          product={product}
          onClose={() => setOpenSheet(null)}
          onSaved={() => showToast('Foto guardada ✓')}
        />
      )}
      {openSheet === 'barcode' && (
        <EditBarcodeSheet product={product} onClose={() => setOpenSheet(null)} onSaved={handleBarcodeSaved} />
      )}
      {openSheet === 'remove-barcode' && product.barcode && (
        <RemoveBarcodeSheet
          product={product}
          onClose={() => setOpenSheet(null)}
          onRemoved={handleBarcodeRemoved}
        />
      )}
      {openSheet === 'name' && (
        // §3.19a specifies no ambient confirmation for a rename, and none is
        // added: the page's own heading, its Nombre row and its marker all
        // update at once, which is a larger and more legible change than any
        // line could announce.
        //
        // **The rename no longer drops a standing §3.4c banner** (2026-09-21).
        // That drop existed for one reason — the banner's second sentence
        // interpolated the Product's name, so a rename left it stating a name
        // that no longer existed. §3.4c's corrected copy is anchored to
        // "este producto" and names nothing, so every sentence in the banner
        // stays true across a rename and there is nothing left to invalidate.
        // Dismissing it anyway would be a dismissal rule the spec does not
        // define, on a banner it explicitly specifies as "no tap to dismiss."
        <EditNameSheet product={product} onClose={() => setOpenSheet(null)} />
      )}
    </>
  );
}

/** Re-exported for `InventoryScreen`'s own view type — the page needs only a
 * `productId` to resolve against already-loaded state. */
export type ProductPageProductId = ID;
