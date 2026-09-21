import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { catalogRows, findProduct, isNfcTaggingEligible, pendingTagBreakdown, pendingTagCount } from '../../domain/selectors';
import { InventoryColdStart } from './InventoryColdStart';
import { CatalogView } from './CatalogView';
import {
  RegisterMerchandise,
  type EntryMode,
  type RegisterDraftState,
  type RegisterDraftStore,
} from './RegisterMerchandise';
import { ProductPage } from './ProductPage/ProductPage';
import { AssignTags, type AssignTagsEntryLine } from './AssignTags';
import type { NfcAssignSession } from '../../domain/useNfcAssignTagSession';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';

/**
 * **"Return to origin" — `inventory.md`'s single navigation rule for every
 * exit of Registro de mercancía and Asignar Tags (new 2026-09-19, §3.6/§3.14,
 * closing `ux-critic` M3).** The Product Owner's own words: "Navigation after
 * Guardar mercancía should return to the context the user came from. If the
 * flow was started from Product Page, return to that Product Page. If it was
 * started from the general Catalog flow, return to Catalog. Treat 'return to
 * origin' as the consistent rule."
 *
 * Origin is **captured when the operation opens and held for the whole
 * operation**, including through a tagging queue auto-entered from that
 * operation's own save. It is never asked and never chosen — she is shown no
 * "¿a dónde quieres volver?" anywhere.
 *
 * The full origin set §3.6 names is "§3.19, §3.4, §3.3/§3.3a, or Home."
 * Three cases are modelled here, not four, and the collapse is deliberate:
 * **§3.3/§3.3a (Inventario's own cold start) is `'catalog'`**, because this
 * screen's own resolution renders the cold start itself for as long as its
 * precondition ("no Product ever registered") is still true, and stops the
 * instant it isn't. Returning to `'catalog'` therefore *is* "return to the
 * cold start while it's true, and to Catalog view once the save made it
 * untrue" — §3.6's named exception, obtained by construction rather than by a
 * second branch.
 *
 * **Home is the one origin that genuinely needs the exception**, since it
 * lives on another tab: `resolveOrigin` below returns it verbatim for a back
 * arrow with nothing written (the origin is still true), and `'catalog'`
 * after a successful save or a queue started by one (the cold-start
 * precondition is false the instant a Product exists).
 */
export type InventoryOrigin =
  | { screen: 'catalog' }
  | { screen: 'product'; productId: string }
  | { screen: 'home' };

/**
 * The ambient confirmation an operation carries back to **whichever screen it
 * returned to** — §3.4 or §3.19, identical copy and identical shape on both
 * (§3.12/§3.13/§3.13a's own 2026-09-19 correction: "This ambient line is a
 * property of the **destination**, not of Catalog view specifically").
 * Composed once, below, and handed to whichever screen is the origin.
 */
export interface InventoryConfirmation {
  /** §3.12 "Mercancía registrada ✓" — the Product a just-succeeded save was
   * scoped to. */
  savedProductId?: string | null;
  /** §3.13 "Mercancía lista para vender ✓" — a Lot-scoped tagging queue
   * reached zero. Mutually exclusive with `productTagsCompleteId`. */
  tagsComplete?: boolean;
  /** §3.13's mixed-Lot second line (`decision-log.md` D71) — only ever set
   * alongside `tagsComplete`. Historical in practice: a Lot from §3.6 now
   * always contains exactly one Product's units. */
  mixedLotDetail?: string | null;
  /** §3.13a "Terminaste de etiquetar Camisas ✓" — a Product-scoped queue
   * reached zero. Mutually exclusive with `tagsComplete`. */
  productTagsCompleteId?: string | null;
  /** One fresh value per *delivered* confirmation, minted where every
   * confirmation funnels through (`App.tsx`'s `onReturnToOrigin`). Without
   * it, a second save of the same Product — identical copy, on a screen whose
   * `ScreenTransition` key is stable per Product, so no remount — would
   * confirm nothing at all, on the one screen where the confirmation is the
   * only evidence the write landed (`ux-critic` Major 2). */
  token?: number;
}

export type InventoryView =
  | {
      mode: 'catalog';
      confirmation?: InventoryConfirmation;
      enteredViaSettingsTagsOn?: boolean;
    }
  /** `inventory.md` §3.19 "Página de producto" (new 2026-09-19) — the
   * destination of every Catalog card tap. Carries only the selected
   * `productId`; every fact the page shows is already loaded, so opening it
   * performs no new fetch and no new capability resolution. It carries the
   * same `confirmation` shape as `'catalog'` because it is equally a possible
   * origin, and an operation's confirmation renders wherever it returns. */
  | { mode: 'product'; productId: string; confirmation?: InventoryConfirmation }
  | {
      mode: 'register';
      prefillProductId?: string;
      /** §3.6's two pre-expanded reveals — see `RegisterMerchandise`'s own
       * `entryMode` doc comment. */
      entryMode?: EntryMode;
      /** Captured at open, held for the whole operation, propagated through
       * an auto-entered tagging queue. */
      origin: InventoryOrigin;
    }
  | {
      mode: 'assign-tags';
      /** `inventory.md` §3.14's entry point 3 — set for a Product-scoped
       * queue (§3.4's card shortcut or §3.19's Level-1 action). `undefined`
       * is the unchanged Lot-scoped shape (entry point 1, §2 step 3). */
      scopeProductId?: string;
      /** §3.14: completion **and** "Terminar después" both return to origin,
       * by the same rule and with the same exception — never unconditionally
       * to Catalog view. For a queue auto-entered from a save, this is the
       * originating operation's own origin, propagated. */
      origin: InventoryOrigin;
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
 * steps 1-2 (cold start vs. Catalog view), plus the Product Page and the two
 * flow screens this tab owns. */
export function InventoryScreen({
  view,
  onOpenRegister,
  onOpenProduct,
  onReturnToOrigin,
  onOpenAssignTags,
  onOpenAssignTagsForProduct,
  onSettingsTagsOnMarkerHandled,
  assignTagsEntry,
  assignTagsSegmentTotals,
  onAssignTagsSegmentTotalsChange,
  registerDrafts,
  onRegisterDraftChange,
  nfcAssignSession,
}: {
  view: InventoryView;
  /** Opens §3.6. `origin` is captured by the caller of this callback — the
   * screen the merchant is actually standing on — never inferred here. */
  onOpenRegister: (args: { origin: InventoryOrigin; prefillProductId?: string; entryMode?: EntryMode }) => void;
  /** §3.4's single card tap → §3.19. */
  onOpenProduct: (productId: string) => void;
  /**
   * The one exit every flow on this tab now goes through (§3.6's back arrow,
   * §3.6's save, §3.14's completion and its "Terminar después"). `afterWrite`
   * is what selects §3.6's named exception: **if the save itself makes the
   * origin untrue, return to the nearest still-true state instead.** Exactly
   * one case exists today — an operation opened from Home's cold-start CTA,
   * whose origin is a cold-start state whose precondition is false the instant
   * the save succeeds. A back arrow with nothing written passes
   * `afterWrite: false` and still returns to Home, because the origin is
   * still true while nothing has been written.
   */
  onReturnToOrigin: (args: {
    origin: InventoryOrigin;
    afterWrite: boolean;
    confirmation?: InventoryConfirmation;
  }) => void;
  /** inventory.md §2 step 3 — an NFC-tagging-eligible Lot (the composed
   * test, `decision-log.md` D71), auto-entered right after "Guardar
   * mercancía" succeeds (no intermediate question); also reached via this
   * screen's own step 0 below. `entryBreakdown` is passed only when a fresh
   * commit (or step 0's whole-Catalog seed) actually triggered this entry,
   * and, per D71, already filtered to only this Lot's eligible lines.
   * `nonEligibleBreakdown` is this same Lot's remaining, non-eligible lines,
   * passed only alongside a genuinely mixed Lot so §3.13's mixed-Lot
   * completion copy can name both halves once tagging finishes. **`origin` is
   * the originating operation's own origin, propagated through the queue** —
   * §3.14's completion and deferral both return to it, not to Catalog view
   * unconditionally. */
  onOpenAssignTags: (args: {
    origin: InventoryOrigin;
    entryBreakdown?: AssignTagsEntryLine[];
    nonEligibleBreakdown?: AssignTagsEntryLine[];
  }) => void;
  /** inventory.md §3.14's entry point 3 — the *only* way to enter or resume a
   * Product-scoped tagging queue, and as of 2026-09-19 it has exactly two
   * live callers, both labelled `[ Etiquetar ]` and both pure navigation:
   * §3.4's card shortcut and §3.19's Level-1 action. **The 2026-09-17
   * toggle-ON auto-open is retired outright** — the NFC switch (now §3.19's
   * NFC row) writes only `Product.nfcTaggingEnabled` and never navigates. */
  onOpenAssignTagsForProduct: (args: { productId: string; origin: InventoryOrigin }) => void;
  /** inventory.md §2 step 0 (`decision-log.md` D46 Addendum) — called exactly
   * once, right after this screen resolves where `settings.md` §2.6's entry
   * marker actually lands, so `App.tsx` can clear `enteredViaSettingsTagsOn`
   * from `view` and a later Inventario open never re-runs step 0 or re-shows
   * its one-time banner. */
  onSettingsTagsOnMarkerHandled: () => void;
  /** AT-M1/AT-M2 fix-round — both owned by the caller (`App.tsx`), not by
   * `AssignTags` itself, so neither is lost across `AssignTags`'
   * unmount/remount on a defer/resume cycle. */
  assignTagsEntry: AssignTagsEntryLine[] | null;
  assignTagsSegmentTotals: Record<string, number>;
  onAssignTagsSegmentTotalsChange: (updater: (totals: Record<string, number>) => Record<string, number>) => void;
  /** §3.6 exit 1's "anything staged is preserved silently" — owned by
   * `App.tsx` for the same reason the two above are: `RegisterMerchandise` is
   * mounted only while `view.mode === 'register'`, and **every** exit from it
   * (back arrow to Catalog view, to a Product Page, or across tabs to Home)
   * unmounts it. Keyed by operation slot, so a draft staged for one Product
   * is not evicted by one staged for another (`ux-critic` Minor 5). See
   * `RegisterDraftStore`. */
  registerDrafts: RegisterDraftStore;
  onRegisterDraftChange: (slot: string, next: RegisterDraftState | null) => void;
  /** 2026-09-18 architecture fix (`decision-log.md` D74/D75 follow-up) — the
   * live Web NFC session (`useNfcAssignTagSession`), owned by `App.tsx` one
   * level up. Forwarded whole to `AssignTags`; only its `startScan` function
   * is forwarded to the two screens that carry an `[ Etiquetar ]` control,
   * which trigger the real gesture-bound `scan()` call ahead of navigating
   * in. */
  nfcAssignSession: NfcAssignSession;
}) {
  const { state } = useStore();
  const rows = catalogRows(state);

  const enteredViaSettingsTagsOn = view.mode === 'catalog' && view.enteredViaSettingsTagsOn === true;

  // inventory.md §2 step 0's NO-branch banner text, captured once on the
  // render that first sees the marker (this component remounts fresh whenever
  // App.tsx sets it, since that always coincides with switching the active tab
  // to Inventario). Captured via a lazy `useState` initializer so it survives
  // the marker itself being cleared from `view` a moment later — but this
  // component does *not* remount again on later `view.mode` changes within the
  // same Inventario visit, so the effect below explicitly invalidates it the
  // instant she leaves the resting Catalog/cold-start view, matching the
  // reactive (never-captured-forever) discipline `CatalogView`'s own
  // confirmation pair already follows for the identical class of problem.
  const [settingsTagsBanner, setSettingsTagsBanner] = useState<string | null>(() => {
    if (!enteredViaSettingsTagsOn || pendingTagCount(state) > 0) return null;
    const anyLotEverReceived = state.entries.length > 0;
    return anyLotEverReceived ? SETTINGS_TAGS_ON_ALREADY_TAGGED_BANNER : SETTINGS_TAGS_ON_REGISTER_FIRST_BANNER;
  });

  // The instant `view.mode` moves away from 'catalog' the landing moment that
  // banner described is over. Clearing it here (rather than only where it's
  // consumed) means any later return to Catalog/cold-start view within this
  // same mount, by any path, starts from a clean slate instead of re-showing a
  // claim about her tagging state that's no longer current.
  useEffect(() => {
    if (view.mode !== 'catalog') {
      setSettingsTagsBanner(null);
    }
  }, [view.mode]);

  useEffect(() => {
    if (!enteredViaSettingsTagsOn) return;

    if (pendingTagCount(state) > 0) {
      // Step 0, YES branch — auto-enter Asignar Tags, seeded with the *entire*
      // pending queue across the whole Catalog. Historical: dormant since D72,
      // doubly dead since D73. Its origin is Catalog view, the screen this
      // resolution is standing on.
      const breakdown: AssignTagsEntryLine[] = pendingTagBreakdown(state).map(({ product, count }) => ({
        productId: product.id,
        quantity: count,
      }));
      onOpenAssignTags({ origin: { screen: 'catalog' }, entryBreakdown: breakdown });
      return;
    }

    // Step 0, NO branch — falls through to the ordinary resolution below
    // (cold start / Catalog view, §3.3a). Its one-time banner is already
    // captured above; clear the marker now so it can't re-fire on a later
    // Inventario open.
    onSettingsTagsOnMarkerHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run exactly once,
    // the moment this marker is first seen on a fresh mount.
  }, []);

  if (view.mode === 'register') {
    const origin = view.origin;
    const originProduct = origin.screen === 'product' ? findProduct(state, origin.productId) : undefined;
    // The identity of *this* operation: a different Product, or the same
    // Product in the other pre-expanded entry mode, is a genuinely different
    // operation. It is both the remount key and — now that drafts outlive
    // this component (§3.6 exit 1) — the key each one is stored under, so
    // every operation keeps its own and none can evict another's.
    const draftSlot = `${view.prefillProductId ?? 'blank'}:${view.entryMode ?? 'default'}`;
    return (
      <ScreenTransition transitionKey="register">
        <RegisterMerchandise
          key={draftSlot}
          initialProductId={view.prefillProductId}
          entryMode={view.entryMode}
          backLabel={originProduct ? originProduct.name : 'Inventario'}
          preservedDraft={registerDrafts[draftSlot] ?? null}
          onDraftChange={(line) => onRegisterDraftChange(draftSlot, { line })}
          onSaved={(lastProductId, entryBreakdown) => {
            // The draft was just committed — it is no longer "staged," so it
            // is dropped here rather than left to resume as a phantom the
            // next time this same operation is opened. This is the one exit
            // where §3.6's preservation guarantee does not apply, because
            // there is nothing left un-saved to preserve.
            onRegisterDraftChange(draftSlot, null);
            // inventory.md §2 step 3, corrected `decision-log.md` D71 — gates
            // on the composed NFC-tagging-eligible test, per line, not a
            // single whole-Lot check. Read from this render's own state
            // (unaffected by the commit — neither `nfcPerProductEnabled` nor
            // any Product's own flag changes as a side effect of it).
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
              // §3.6 exit 3 — the queue is auto-entered from *this* save, so
              // this operation's origin propagates through it; §3.14's own
              // completion and "Terminar después" both return to it.
              onOpenAssignTags({
                origin,
                entryBreakdown: eligibleLines,
                nonEligibleBreakdown: nonEligibleLines.length > 0 ? nonEligibleLines : undefined,
              });
            } else {
              // No line in this Lot is NFC-tagging-eligible (§2 step 3's NO
              // branch) — §3.6 exit 2: return to origin with §3.12's plain
              // "registrada" confirmation rendered *there*, never the tagging
              // queue, and never unconditionally to Catalog view.
              onReturnToOrigin({
                origin,
                afterWrite: true,
                confirmation: { savedProductId: lastProductId },
              });
            }
          }}
          // §3.6 exit 1 — the back arrow returns to origin with nothing
          // written, so the "origin untrue" exception does not apply and a
          // Home-originated operation genuinely goes back to Home. Anything
          // staged is preserved silently and resumes exactly as she left it.
          onBack={() => onReturnToOrigin({ origin, afterWrite: false })}
        />
      </ScreenTransition>
    );
  }

  if (view.mode === 'assign-tags') {
    // §3.14's entry point 3 — a Product-scoped queue. `scopeProductId`
    // narrows AssignTags' own live reads to this one Product;
    // `entryBreakdown` is always `null` there regardless of whatever's frozen
    // in `assignTagsEntry` from a possibly-unrelated earlier Lot-scoped
    // commit, since §3.14's wireframe variant drops "Lo que registraste"
    // outright for that entry point.
    const scopeProductId = view.scopeProductId;
    const origin = view.origin;
    return (
      <ScreenTransition transitionKey="assign-tags">
        <AssignTags
          // §3.14 (corrected 2026-09-19): "Terminar después" returns to
          // origin too, by the same rule and with the same exception — never
          // unconditionally to Catalog view and never to a retired §3.5/§3.17.
          // `afterWrite: true` because a deferred queue is only ever reached
          // *after* something was written (a save, or an explicit
          // `[ Etiquetar ]` on stock that already exists), so a cold-start
          // origin is already untrue by the time she can defer.
          onDefer={() => onReturnToOrigin({ origin, afterWrite: true })}
          onComplete={() =>
            onReturnToOrigin({
              origin,
              afterWrite: true,
              // §3.13a for a Product-scoped queue, §3.13 for a Lot-scoped
              // one — mutually exclusive by construction, rendered on the
              // origin either way.
              confirmation: scopeProductId
                ? { productTagsCompleteId: scopeProductId }
                : { tagsComplete: true },
            })
          }
          entryBreakdown={scopeProductId ? null : assignTagsEntry}
          segmentTotals={assignTagsSegmentTotals}
          onSegmentTotalsChange={onAssignTagsSegmentTotalsChange}
          scopeProductId={scopeProductId}
          nfcSession={nfcAssignSession}
        />
      </ScreenTransition>
    );
  }

  if (view.mode === 'product') {
    const product = findProduct(state, view.productId);
    if (product) {
      const { message, detail } = confirmationCopy(state, view.confirmation);
      return (
        <ScreenTransition transitionKey={`product-${product.id}`}>
          <ProductPage
            product={product}
            confirmationMessage={message}
            confirmationDetail={detail}
            confirmationToken={view.confirmation?.token}
            onBack={() => onReturnToOrigin({ origin: { screen: 'catalog' }, afterWrite: false })}
            onRegisterMerchandise={() =>
              onOpenRegister({
                origin: { screen: 'product', productId: product.id },
                prefillProductId: product.id,
                entryMode: 'receipt',
              })
            }
            onCorrectQuantity={() =>
              onOpenRegister({
                origin: { screen: 'product', productId: product.id },
                prefillProductId: product.id,
                entryMode: 'correction',
              })
            }
            onEtiquetar={() => {
              // Same shape as §3.4's card shortcut: `startScan()`
              // fire-and-forget inside the literal, synchronous tap that
              // semantically starts the NFC operation, immediately before the
              // navigation it's paired with.
              void nfcAssignSession.startScan();
              onOpenAssignTagsForProduct({
                productId: product.id,
                origin: { screen: 'product', productId: product.id },
              });
            }}
          />
        </ScreenTransition>
      );
    }
    // §3.19's own load-and-failure note routes an unresolvable Product to
    // §3.18 (the defensive fallback, with its manual "Reintentar" and a fully
    // functional nav bar). **§3.18 has never been built in this prototype** —
    // it is a pre-existing, spec'd-but-unbuilt state, flagged rather than
    // invented here. Until it exists, an unresolvable Product falls through to
    // Catalog view below, which is the safe, non-dead-end behaviour and is
    // reachable today only via a stale card tapped after a concurrent change
    // on another device.
  }

  if (rows.length === 0) {
    return (
      <ScreenTransition transitionKey="cold-start">
        <InventoryColdStart
          // §3.3's CTA. Origin is `'catalog'`: this cold start *is* Catalog
          // view's own resolution while its precondition holds, so returning
          // to `'catalog'` lands back here while nothing is saved and on the
          // real card list the instant a save makes it untrue — §3.6's named
          // exception, by construction.
          onRegister={() => onOpenRegister({ origin: { screen: 'catalog' } })}
          bannerLine={settingsTagsBanner}
        />
      </ScreenTransition>
    );
  }

  const { message, detail } = confirmationCopy(state, view.mode === 'catalog' ? view.confirmation : undefined);

  return (
    <ScreenTransition transitionKey="catalog">
      <CatalogView
        onOpenProduct={onOpenProduct}
        onRegister={() => onOpenRegister({ origin: { screen: 'catalog' } })}
        onOpenAssignTagsForProduct={(productId) =>
          onOpenAssignTagsForProduct({ productId, origin: { screen: 'catalog' } })
        }
        onStartNfcAssignScan={nfcAssignSession.startScan}
        confirmationMessage={message}
        confirmationDetail={detail}
        confirmationToken={view.mode === 'catalog' ? view.confirmation?.token : undefined}
        settingsTagsBanner={settingsTagsBanner}
      />
    </ScreenTransition>
  );
}

/**
 * §3.12/§3.13/§3.13a's ambient copy, resolved in one place so Catalog view
 * and the Product Page can never drift into two wordings of the same
 * confirmation — the spec's own requirement that each renders "with identical
 * copy and identical shape on both."
 */
function confirmationCopy(
  state: ReturnType<typeof useStore>['state'],
  confirmation: InventoryConfirmation | undefined,
): { message: string | null; detail: string | null } {
  if (!confirmation) return { message: null, detail: null };
  const productTagsCompleteName = confirmation.productTagsCompleteId
    ? findProduct(state, confirmation.productTagsCompleteId)?.name
    : null;
  const savedName = confirmation.savedProductId ? findProduct(state, confirmation.savedProductId)?.name : null;
  // Each string arrives at its screen complete, "✓" included — composed here,
  // in one place, rather than half here and half in each screen's JSX.
  //
  // §3.13a's copy was corrected 2026-09-21: **the Product name moves into
  // object position.** It read `Camisas ya está etiquetada ✓`, which breaks
  // on both gender and number for a merchant-supplied name (`Delantales ya
  // está etiquetada`) — the same defect corrected in §3.4c's banner the same
  // day, pre-existing here rather than introduced by that amendment.
  // `Terminaste de etiquetar Camisas ✓` carries zero agreement while keeping
  // the name, which §3.13a requires ("names the specific Product, not a
  // generic 'lista para vender'"). Second person, plainly stated, never
  // inflated (`brand/tone-of-voice.md`).
  const message = confirmation.tagsComplete
    ? 'Mercancía lista para vender ✓'
    : productTagsCompleteName
      ? `Terminaste de etiquetar ${productTagsCompleteName} ✓`
      : savedName
        ? 'Mercancía registrada ✓'
        : null;
  // The mixed-Lot second line only ever accompanies §3.13's own Lot-scoped
  // completion, never a plain "registrada" and never §3.13a's Product-scoped
  // completion (which carries no mixed-Lot copy of its own).
  const detail = confirmation.tagsComplete ? (confirmation.mixedLotDetail ?? null) : null;
  return { message, detail };
}
