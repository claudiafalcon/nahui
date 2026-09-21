import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import {
  availableUntaggedCount,
  disponibleEnGeneral,
  eventAllocationFor,
  productByBarcode,
  // `quantityRemaining` (the combined, both-`unitSource` figure) is
  // deliberately no longer imported here — `decision-log.md` D84. This
  // screen reads the two halves by name (`quantityRemainingBySource`) and
  // composes the combined total itself for the collapsed summary only; the
  // stepper's value and ceiling are both strictly `fifo_assignment`. Its
  // absence from this import list is the guard against the two bases
  // silently merging back together.
  quantityRemainingBySource,
  taggedAvailableUnitCount,
} from '../../domain/selectors';
import { NFC_SIMULATION_ENABLED, nfcSupported, nfcUnavailable } from '../../domain/nfcSupport';
import { Button } from '../../components/Button/Button';
import { BarcodeScanner } from '../../components/BarcodeScanner/BarcodeScanner';
import { NFCScanPrompt } from '../../components/NFCScanPrompt/NFCScanPrompt';
import styles from './MercanciaParaEsteEvento.module.css';

/** §3.22a's own simulated-hardware read-failure chance, every browser
 * without real Web NFC only — mirrors `AssignTags.tsx`'s own established
 * `SCAN_FAIL_CHANCE` precedent (a genuine physical read failure a real NFC
 * radio would otherwise report on its own) rather than inventing a new
 * simulation convention. */
const NFC_SCAN_FAIL_CHANCE = 0.15;
// `nfcSupported` / `NFC_SIMULATION_ENABLED` / `nfcUnavailable` — the shared
// capability + simulation switch (`src/domain/nfcSupport.ts`, Stage 7
// correctness fix 2026-09-17), replacing this file's own former
// `'NDEFReader' in window` constant. The simulated pool in `handleNfcScan`
// below is now only reachable when `NFC_SIMULATION_ENABLED` (dev / explicit
// demo build) — a production build on a browser without Web NFC renders
// `NFCScanPrompt`'s `'unsupported'` state and never scans a random tagged
// unit into this Event's allocation.

/**
 * events.md §3.21/§3.23 "Mercancía para este evento" — the shared screen
 * both "Llevar mercancía" (§3.11, `scheduled`) and "Ver mercancía de este
 * evento" (§3.14/§3.15, `active`) land on, unchanged between them (this
 * document's own §4 shared-state convention). OWNER-only, per
 * `product-decisions.md` Q24/Q25's settled permission table.
 *
 * **Manual (quantity-based) allocation only, this slice
 * (`context/q24-q25-first-slice.md`).** NFC-scan allocation (§3.22) and its
 * own "sin tag · con tag" split are both out of scope — every row shows a
 * single plain "Disponible en general: N" figure and the manual stepper
 * only, never the scan affordance §3.21's own conditional split would
 * otherwise offer a Paid/tagged Business. "Mover a otro evento" (§3.24) is
 * also out of scope this slice and is omitted entirely, never a dead link
 * to an unbuilt destination.
 *
 * Stage 7 Backend Integration, Phase 2b — `handleSave` now awaits a real
 * `save_event_allocations` call (`saveEventAllocations`, `store.tsx`)
 * instead of a synchronous local write; `saveState='error'` is now a really
 * reachable outcome (a rejected/failed RPC call), not merely a disclosed,
 * never-triggered branch. `commitIdempotencyKeyRef` mirrors
 * `RegisterMerchandise.tsx`'s own per-attempt key ref — generated once per
 * "Guardar cambios" attempt, reused unchanged across a Reintentar retry of
 * that same attempt, cleared only on success.
 *
 * **Manual (quantity-based) allocation remains the only way to build up a
 * row's own staged figure — corrected, see §3.22a below.** §3.22's
 * per-Product scan queue (the row's own "Escanear las que te llevas"
 * button, and the "sin tag · con tag" split it would drive) is still out of
 * scope for this file — not built here, untouched by this pass, exactly as
 * this docstring previously stated. What *is* now built is §3.22a, a
 * different, list-level entry point that composes with (never replaces)
 * that still-unbuilt per-Product queue — see this file's own §3.22a-scoped
 * comments below for the full reasoning.
 *
 * §3.21/§3.21a-d (2026-09-16 amendment, expedited pass) — a list-level
 * "Escanear código de barras" affordance, Paid tier only, sitting above the
 * row list in the identical position regardless of which row (if any) is
 * expanded. **A pure navigation jump, never a write** — a deliberate
 * contrast with §3.22a's own NFC scan immediately below it, which *is* a
 * live, immediate write the instant a tag is read. On a match against this
 * Business's Catalog (`productByBarcode`, the same shared matcher
 * `inventory.md`'s own barcode surfaces already use), collapses whichever
 * row is expanded and expands the matched row instead, scrolled into view —
 * the manual stepper still requires her own tap to adjust. No match →
 * §3.21b, a plain "Entendido" dead-end back to this list, never a
 * new-Product offer (unlike `inventory.md` §3.8a's registration-time scan
 * — every Catalog Product already has a row here by construction).
 * Permission-denied/read-failure reuse `inventory.md` §3.4f/§3.4g's exact
 * shape and copy, verbatim, per §3.21c/§3.21d's own citation — see
 * `CatalogView.tsx`'s `barcodeStage === 'cameraFailure'` branch for the
 * precedent this mirrors.
 *
 * §3.22a (new, `decision-log.md` D71, `product-decisions.md` Q31) —
 * "Leer con NFC," a second list-level entry point (identical position to
 * "Escanear código de barras" above), opening a mixed-pile NFC scan queue
 * with no Product pre-selected: each successful scan resolves its own
 * Product automatically (`scanUnitIntoEventAllocationAnyProduct`, the
 * `scan_unit_into_event_allocation_any_product` RPC — reads the scanned
 * unit's own `productId` directly, mints-or-finds that Product's own
 * `EventAllocation` for this Event) and commits it live — never staged
 * behind "Guardar cambios," the identical immediacy convention §3.21's own
 * row-level scan annotation already establishes. Present only when
 * `Business.nfcPerProductEnabled = true` **and** ≥1 `InventoryUnit` on this
 * Business's Catalog has `tagId != null AND status = 'available'`
 * (`decision-log.md` D81 — live unit state, never
 * `Product.nfcTaggingEnabled`; see `canScanNfc` below for the full
 * reasoning).
 * Reuses §3.22's own two-state error register verbatim (a named conflict —
 * "[Producto]: esta prenda ya está en otro evento. Usa otra." — or a
 * generic "No se pudo leer el tag. Acércalo de nuevo.") rather than
 * inventing new copy; the conflict's Product name is resolved *client-side*
 * from this Business's already-hydrated `state.units`/`nfc_tags` mirror
 * ahead of the write, since the RPC's own `unit_already_committed`
 * exception (a bare Postgres error, per its own documented contract) never
 * carries a payload to read a Product identity back from.
 *
 * **`decision-log.md` D84 (2026-09-21) — the manual stepper's *value* is on
 * the `fifo_assignment` basis, closing a silent over-commit.** Three parts,
 * all of them correctness rather than polish: (A) `staged` initialises from
 * `quantityRemainingBySource(..., 'fifo_assignment')` and `commitNfcScan`'s
 * `staged + 1` is removed outright; (B) the stepper label reads "Cantidad
 * sin tag," §3.21's own already-approved wireframe copy; (C) the collapsed
 * summary is derived live as `staged + quantityRemainingBySource(...,
 * 'scan')`, with the scan-source count disclosed on the expanded row ("N
 * escaneadas") on its own condition — `scan`-source remaining > 0, **never**
 * the availability split's tagged-and-`available` condition, which would
 * hide the disclosure precisely when every tagged unit has been scanned into
 * this allocation. See each site's own comment for the full reasoning. No
 * migration, no RPC change, no new selector, no new state, no new write
 * path — the server contract was already correct and already documented in
 * `save_event_allocations`' own header; only the client failed to honour it.
 * D81's gate and D82's ceiling are both untouched and both confirmed
 * correct; this defect was downstream of neither. The "Disponible en
 * general: N sin tag · N con tag" *availability* decomposition, §3.22's
 * per-row scan queue and §3.24's "Mover a otro evento" all remain out of
 * scope and deliberately unbuilt here.
 */
export function MercanciaParaEsteEvento({
  eventId,
  venueName,
  onBack,
}: {
  eventId: string;
  venueName: string;
  onBack: () => void;
}) {
  const { state, saveEventAllocations, scanUnitIntoEventAllocationAnyProduct } = useStore();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'error'>('idle');
  const [confirmation, setConfirmation] = useState(false);

  // Staged **manual** quantities — initialized once from each Product's
  // current live-remaining `fifo_assignment`-source count (0 if no
  // EventAllocation exists yet for this pair). **Corrected, RFC 0010/D59:**
  // never `quantityAllocated`, which is now a monotonic lifetime total that
  // never decreases — reading it here would silently ignore any prior
  // mid-Event release and redisplay a stale, too-high number. Collapsing/
  // expanding a row is a pure display toggle, never a commit (§3.21's own
  // annotation) — this map persists whichever row is shown expanded or not.
  //
  // **Basis corrected 2026-09-21, `decision-log.md` D84.** This previously
  // read the combined `quantityRemaining`, which counts *both* `unitSource`
  // values, and `commitNfcScan` additionally did `staged + 1` on every
  // successful scan. But this number is submitted verbatim to
  // `save_event_allocations` as the `fifo_assignment` **target**, and that
  // RPC's own header states the contract: it "compute[s] the signed delta
  // between the requested quantity and that allocation's current
  // live-remaining `fifo_assignment`-sourced count." A combined number sent
  // against a manual-only baseline inflates the delta by exactly the
  // scan-committed count, and `_fifo_commit_to_allocation`'s (correct,
  // deliberate) partial-fulfillment tolerance made the over-commit silent.
  //
  // Reachable in a single session with no stepper touched at all: 2 tagged +
  // 3 untagged `available`, no allocation yet → scan both tagged garments
  // (server commits 2 `scan`-source units; the old code set `staged = 2`) →
  // "Guardar cambios" sends 2, server sees `v_remaining = 0`, `v_delta = 2`,
  // FIFO-commits **2 untagged units**. Two garments carried, four reserved,
  // success message rendered. It then *ratcheted* on each visit-and-save,
  // since the next mount re-read the combined figure including what the last
  // save wrongly committed — and because `handleSave` sends every Product
  // unconditionally, the triggering save could be an edit to a different row.
  //
  // Why it was an invariant breach rather than a display bug: the
  // over-committed units carry `unit_source = 'fifo_assignment'`, exactly the
  // field D59's Event-close reconciliation filters on — so she'd be asked to
  // confirm a *returned quantity* for garments she never took. Only partly
  // reversible: `AllocationMovement` is append-only and `quantityAllocated`
  // monotonic, so each occurrence wrote permanent false ledger history.
  //
  // This also cures D82's own introduced mount-above-ceiling symptom **by
  // construction**: `staged_init = fifo_remaining ≤ availableUntagged +
  // fifo_remaining = ceiling`, always.
  const [staged, setStaged] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const product of state.products) {
      const allocation = eventAllocationFor(state, eventId, product.id);
      initial[product.id] = allocation
        ? quantityRemainingBySource(state, allocation, 'fifo_assignment')
        : 0;
    }
    return initial;
  });
  // ux-critic fix round — §3.21 reserves "Solo tienes N disponibles." for
  // the specific case of typing past the ceiling (a keystroke actually
  // rejected/reduced), not for merely reaching the ceiling normally via
  // `[+]` (a completely valid, unremarkable "allocate everything" choice).
  // Set only inside `setQuantity` when the raw requested value genuinely
  // exceeded the ceiling; `[+]` itself is disabled at `quantity >= ceiling`
  // so it can never produce a `raw` above the ceiling in the first place —
  // this flag is only ever true after a real typed overflow.
  const [clamped, setClamped] = useState<Record<string, boolean>>({});
  // Stage 7 Backend Integration, Phase 2b — one idempotency key per logical
  // "Guardar cambios" attempt, mirroring `RegisterMerchandise.tsx`'s own
  // `commitIdempotencyKeyRef`. Cleared on success; left in place on failure
  // so Reintentar replays the exact same attempt.
  const saveIdempotencyKeyRef = useRef<string | null>(null);

  // §3.21/§3.21a-d — the list-level "Escanear código de barras" shortcut's
  // own sub-state. `closed` renders the ordinary row list untouched;
  // `scanning` mounts the shared camera; `noMatch`/`cameraFailure` are the
  // two dead-end screens it can resolve to, each with its own single way
  // back to `closed`.
  const [scanMode, setScanMode] = useState<'closed' | 'scanning' | 'noMatch' | 'cameraFailure'>('closed');
  // Set the instant a scan resolves to a real Product match, alongside
  // `setExpandedProductId` in the same handler — consumed by the effect
  // below to scroll that row into view exactly once, then cleared. Kept
  // separate from `expandedProductId` itself so an ordinary manual row tap
  // (already visible on screen, nothing to scroll to) never triggers this.
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  // inventory.md §2's D65 barcode-scanning gate, the identical check every
  // other barcode-scanning surface in this codebase uses (see
  // `CatalogView.tsx`'s own `canEditBarcode`) — Paid tier only.
  const canScanBarcode = state.business?.subscriptionTier === 'paid';

  // §3.22a — **gate corrected 2026-09-20, `decision-log.md` D81.** Present
  // when `Business.nfcPerProductEnabled === true` AND ≥1 `InventoryUnit` on
  // this Business's Catalog currently has `tagId != null AND status ===
  // 'available'` — absent entirely, not shown-then-disabled, matching this
  // section's own posture for the barcode row above. Re-read live on every
  // render (never memoized): a scan inside the overlay flips a unit to
  // `reserved`, and the gate must follow that on its own.
  //
  // This previously read `state.products.some((p) => p.nfcTaggingEnabled ===
  // true)`, which was wrong twice over. (1) It read `Product
  // .nfcTaggingEnabled`, whose charter (D71) is to gate Inventory's Asignar
  // Tags eligibility *only* — it "never itself asserts unit-level
  // sellability, which stays derived purely from `InventoryUnit.tagId`." The
  // flag goes false by two ordinary routes (a barcode saved, D71's
  // clear-on-save; or the merchant simply switching it off) while
  // already-tagged units stay tagged and stay sellable — and because this
  // was a *Catalog-wide existential*, the last flag going false made every
  // tagged unit of every Product uncommittable to any allocation,
  // business-wide. (2) The Business-level conjunct was missing entirely.
  //
  // `available` only, deliberately narrower than D80's
  // `('available','reserved')` display allowlist: a `reserved` unit is
  // mid-Sale or already held by an allocation and is not a commit candidate,
  // so counting it would open an overlay whose every scan could only report
  // "esta prenda ya está en otro evento."
  //
  // The write paths were never wrong and are untouched — both scan RPCs and
  // `_fifo_commit_to_allocation` are already pure unit-state. This is an
  // entry-point visibility fix only.
  const canScanNfc = state.business?.nfcPerProductEnabled === true && taggedAvailableUnitCount(state) > 0;
  // Growing, insertion-ordered tally — one row per Product actually scanned
  // this overlay session, "Bolsas: 2 escaneadas" (§3.22a's own wireframe).
  const [nfcOverlayOpen, setNfcOverlayOpen] = useState(false);
  const [nfcTally, setNfcTally] = useState<{ productId: string; count: number }[]>([]);
  const [nfcFeedback, setNfcFeedback] = useState<
    { kind: 'conflict'; productName: string } | { kind: 'generic' } | null
  >(null);
  // Real Web NFC read path only — the persistent `NDEFReader.scan()`
  // listening session this list-level "Leer con NFC" tap itself starts
  // (`decision-log.md` D74 — mirrors `Selling.tsx`'s own "Leer con NFC"
  // overlay entry), so the overlay opens already listening and every
  // subsequent physical tap needs no further on-screen tap. Reset on close
  // so a later re-open starts a genuinely fresh session. `nfcScanStartedRef`
  // guards the
  // *dispatch* (exactly one in-flight `scan()` attempt — a ref, not state,
  // so a second tap arriving before React re-renders can't fire a second
  // concurrent `scan()` call).
  const nfcScanStartedRef = useRef(false);
  const nfcAbortRef = useRef<AbortController | null>(null);
  // Live-hardware correctness fix (2026-09-17) — `NFCScanPrompt`'s own
  // reactive `state`, see that component's own top-of-file doc comment and
  // `Selling.tsx`'s identical `nfcSessionState` for the full rationale.
  // Simulated (non-hardware, dev/demo-build only) browsers stay permanently
  // `'listening'` — no real session for a dead-session hazard to exist for.
  // A production build on a browser without Web NFC is `'unsupported'` from
  // mount and stays there (every reset below is `nfcSupported`-gated).
  const [nfcSessionState, setNfcSessionState] = useState<'idle' | 'listening' | 'error' | 'unsupported'>(
    nfcSupported ? 'idle' : NFC_SIMULATION_ENABLED ? 'listening' : 'unsupported',
  );
  useEffect(() => {
    return () => {
      nfcAbortRef.current?.abort();
    };
  }, []);

  // Live-hardware correctness fix (2026-09-17, visibility-hardening
  // follow-up) — the identical gap `Selling.tsx`'s own sibling fix (same
  // pass) closes, applied here since this screen's "Leer con NFC" overlay
  // (§3.22a) manages the same kind of long-lived `scan()` session: per
  // Chromium's own documented behavior, Android's real underlying reader-
  // mode session is silently disabled the instant this tab goes hidden
  // (screen lock, app-switch), with no JS event our code was listening for
  // — and once past its first `scan()` resolution, there's no pending
  // promise left for that silent death to reject, so the ring kept
  // honestly showing "ready, acerca el tag" over an already-dead browser
  // session. See `Selling.tsx`'s own identical effect for the full
  // reasoning (mirrored here verbatim in shape) — one listener for this
  // component's whole mount lifetime, gated internally by
  // `nfcScanStartedRef.current` (this file's own name for the same
  // always-current dispatch-guard ref `handleNfcScan` itself relies on)
  // rather than tied to `nfcOverlayOpen` in the effect's own dependency
  // array, since the two are behaviorally equivalent and this avoids
  // re-subscription risk.
  const wasSessionActiveBeforeHiddenRef = useRef(false);
  useEffect(() => {
    if (!nfcSupported) return;
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        if (nfcScanStartedRef.current) {
          // Mirrors `closeNfcOverlay`'s own explicit-close cleanup below.
          nfcAbortRef.current?.abort();
          nfcAbortRef.current = null;
          nfcScanStartedRef.current = false;
          wasSessionActiveBeforeHiddenRef.current = true;
          // Live-hardware correctness fix (2026-09-17, staleness-window
          // follow-up) — the teardown above is real and synchronous (the
          // session is genuinely dead the instant the tab hides), but
          // leaving `nfcSessionState` untouched here left the ring
          // rendering `'listening'` for the entire time the tab stayed
          // hidden, correcting only later, whenever (if ever) the matching
          // `'visible'` transition fired. `'idle'`, not `'error'` — see
          // `Selling.tsx`'s identical comment for why.
          setNfcSessionState('idle');
        }
      } else if (wasSessionActiveBeforeHiddenRef.current) {
        wasSessionActiveBeforeHiddenRef.current = false;
        // Redundant with the `'hidden'` branch's own
        // `setNfcSessionState('idle')` above once that fix is in place —
        // kept anyway as a harmless no-op / defensive backstop in case some
        // device fires `'visible'` without a matching prior `'hidden'`
        // having gone through this exact code path.
        setNfcSessionState('idle');
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!pendingScrollId) return;
    const id = pendingScrollId;
    const raf = window.requestAnimationFrame(() => {
      rowRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    setPendingScrollId(null);
    return () => window.cancelAnimationFrame(raf);
  }, [pendingScrollId]);

  // A successful scan matching a Catalog Product — collapses whichever row
  // is currently expanded and expands the matched row instead, scrolled
  // into view (§3.21's own amendment). Writes nothing: the manual stepper
  // still needs her own tap, exactly as if she'd scrolled to and tapped
  // this row herself. No match → §3.21b.
  function handleScanResult(code: string) {
    const match = productByBarcode(state, code.trim());
    if (!match) {
      setScanMode('noMatch');
      return;
    }
    setExpandedProductId(match.id);
    setPendingScrollId(match.id);
    setScanMode('closed');
  }

  /**
   * §3.22a — a successful scan is a live, immediate write (unlike the
   * barcode shortcut above), and its Product is resolved *by the scan
   * itself*, never pre-known. `localUnit` is looked up client-side, ahead
   * of the write, purely so a conflict can still be named to a specific
   * Product — see this file's own top-of-component doc comment for why the
   * RPC's own `unit_already_committed` exception can't supply that fact.
   */
  async function commitNfcScan(tagId: string) {
    const localUnit = state.units.find((u) => u.tagId === tagId);
    const result = await scanUnitIntoEventAllocationAnyProduct(eventId, tagId);
    if (!result.ok) {
      if (result.reason === 'already-committed') {
        const productName = localUnit
          ? state.products.find((p) => p.id === localUnit.productId)?.name ?? ''
          : '';
        setNfcFeedback({ kind: 'conflict', productName });
        return;
      }
      // `tag-not-found` / `event-not-found` / `platform-error` all fold
      // into the same generic bucket §3.22's own register already reserves
      // for "nothing resolved at all" — reused verbatim, no third state
      // invented here.
      setNfcFeedback({ kind: 'generic' });
      return;
    }
    setNfcFeedback(null);
    setNfcTally((prev) => {
      const idx = prev.findIndex((row) => row.productId === result.productId);
      if (idx === -1) return [...prev, { productId: result.productId, count: 1 }];
      const next = [...prev];
      next[idx] = { ...next[idx], count: next[idx].count + 1 };
      return next;
    });
    // **`staged + 1` removed outright, 2026-09-21, `decision-log.md` D84 —
    // and nothing replaces it.** A scan is already committed server-side and
    // is *not* a manual stage: `staged` is the `fifo_assignment` target
    // `save_event_allocations` diffs against, so incrementing it here made
    // the very next "Guardar cambios" FIFO-commit that many *untagged* units
    // on top of the tagged ones she actually scanned. This line was the half
    // of the defect that made the no-stepper-touched single-session path
    // reachable.
    //
    // §3.21's own row-level annotation ("a successful scan is a live,
    // immediate write... 'Para este evento' figure updates immediately") is
    // still honoured, and now honoured *correctly*: the collapsed summary is
    // derived live in the row map below as `staged +
    // quantityRemainingBySource(allocation, 'scan')`, and
    // `mirrorAllocationMovement` (`store.tsx`) has already inserted this
    // scan's own `eventAllocationUnits` row with `unitSource: 'scan'` by the
    // time this resolves — so the summary and the expanded row's "N
    // escaneadas" disclosure both move on the next render with no local
    // counter to keep in sync, and no risk of clobbering her staged manual
    // edit on that same row (nothing writes to `staged` here at all).
    //
    // **Neither `disponibleEnGeneralByProduct` nor `ceilings` is touched,
    // and both are still correct after this scan** (comment kept from D82's
    // split of the two): "Disponible en general" is net-zero by
    // construction, since moving a unit from the general pool into *this*
    // Event's own allocation leaves that figure unchanged (§3.21's own
    // "Disponible en general... deliberately includes what's already
    // allocated to this Event"); and the manual ceiling is untouched because
    // a scan only ever consumes a **tagged** unit and only ever writes a
    // `scan`-source commitment — neither half of the ceiling (available
    // *untagged* units, outstanding `fifo_assignment` units) can move as a
    // result of it.
  }

  async function handleNfcScan() {
    if (nfcUnavailable) {
      // Stage 7 correctness fix (2026-09-17) — no Web NFC and no simulation
      // allowed in this build. `NFCScanPrompt`'s `'unsupported'` state
      // already renders nothing tappable; this guard additionally makes the
      // simulated pool below unreachable, so no random tagged unit is ever
      // committed into this Event's allocation via the real RPC as if a
      // physical tag had been read.
      return;
    }
    if (nfcSupported) {
      if (nfcScanStartedRef.current) return;
      nfcScanStartedRef.current = true;
      const controller = new AbortController();
      nfcAbortRef.current = controller;
      try {
        const ndef = new window.NDEFReader!();
        ndef.onreading = (event) => {
          // `decision-log.md` D74 — keyed on the tag's own hardware UID
          // (`serialNumber`), never `message.records`: a factory-blank tag
          // fires `reading` with an empty `message` and must still resolve
          // correctly. An empty `serialNumber` (spec-legal — "may be
          // unavailable") is a genuine read failure, routed through the same
          // generic bucket a bad physical read already gets, never committed
          // as a tag identifier.
          if (!event.serialNumber) {
            setNfcFeedback({ kind: 'generic' });
            return;
          }
          void commitNfcScan(event.serialNumber);
        };
        ndef.onreadingerror = () => {
          // A single bad physical read — the session itself stays alive and
          // listening, so `nfcSessionState` is untouched here (same
          // distinction `Selling.tsx`'s identical `handleScan` draws).
          setNfcFeedback({ kind: 'generic' });
        };
        await ndef.scan({ signal: controller.signal });
        // The browser has genuinely granted and begun the session now.
        setNfcSessionState('listening');
      } catch {
        // `scan()` itself rejected — the session never started.
        // `NFCScanPrompt`'s own `'error'` ring communicates that directly;
        // no separate ambient "no se pudo leer" hint here, which is reserved
        // for a per-tag misread mid-session, above.
        nfcScanStartedRef.current = false;
        nfcAbortRef.current = null;
        setNfcSessionState('error');
      }
      return;
    }

    // Simulated path — a browser without Web NFC **in a dev or explicit demo
    // build only** (`NFC_SIMULATION_ENABLED`; the `nfcUnavailable` guard
    // above makes this unreachable in production). Unlike `Selling.tsx`
    // §3.9d's own simulated pool (scoped to `available` units only, since
    // that overlay has no conflict state worth simulating), this pool draws
    // from *every* tagged unit regardless of status — the richer pool is
    // what makes the "ya está en otro evento" conflict actually reachable
    // in a browser without real Web NFC, mirroring `AssignTags.tsx`'s own
    // `DUPLICATE_TAG_CHANCE`-style precedent for simulating a real
    // business-logic conflict rather than only ever the happy path.
    if (Math.random() < NFC_SCAN_FAIL_CHANCE) {
      setNfcFeedback({ kind: 'generic' });
      return;
    }
    const pool = state.units.filter((u) => u.tagId != null);
    const candidate = pool[Math.floor(Math.random() * pool.length)];
    if (!candidate?.tagId) {
      setNfcFeedback({ kind: 'generic' });
      return;
    }
    await commitNfcScan(candidate.tagId);
  }

  /** "Terminar" (§3.22a) — returns to §3.21, every row this session touched
   * already reflecting its own live, committed total (§3.22's own
   * guarantee, reused unchanged). Also stops whichever real-hardware
   * listening session this overlay's own tap may have started. */
  function closeNfcOverlay() {
    setNfcOverlayOpen(false);
    setNfcFeedback(null);
    setNfcTally([]);
    if (nfcScanStartedRef.current) {
      nfcAbortRef.current?.abort();
      nfcAbortRef.current = null;
      nfcScanStartedRef.current = false;
    }
    // An explicit close/reset — a later re-open must show `'idle'`, not the
    // stale `'listening'`/`'error'` look this session had right before
    // "Terminar."
    if (nfcSupported) setNfcSessionState('idle');
  }

  // **The manual stepper's ceiling — re-derived 2026-09-20,
  // `decision-log.md` D82.** It used to be `disponibleEnGeneral()`, which
  // counts *all* available units, tagged and untagged. But the manual commit
  // pool is untagged-only, enforced server-side in
  // `_fifo_commit_to_allocation` (`and not exists (select 1 from
  // public.nfc_tags nt where nt.unit_id = iu.id)`), and that RPC is
  // deliberately partial-fulfillment tolerant — "fewer candidates than
  // requested is not an error... never raises." So on a Product with 8
  // available units of which 5 carry tags, the ceiling read 8, `[+]` allowed
  // 8, Guardar succeeded, a success confirmation rendered, and 3 units
  // committed: a wrong number underneath a success message, which she would
  // only discover at the bazaar.
  //
  // The ceiling is now the pool the manual write can actually consume: this
  // Product's `available` **untagged** units, plus this allocation's own
  // outstanding `fifo_assignment`-source units (already hers, and the exact
  // baseline `save_event_allocations` itself diffs the sent quantity
  // against). **No NFC-eligibility predicate** — eligibility governs future
  // tagging work (D71/D73); a merely-untagged unit is manually committable
  // regardless of whether its Product ever opted into tagging.
  const ceilings = useMemo(() => {
    const map: Record<string, number> = {};
    for (const product of state.products) {
      const allocation = eventAllocationFor(state, eventId, product.id);
      map[product.id] =
        availableUntaggedCount(state, product.id) +
        (allocation ? quantityRemainingBySource(state, allocation, 'fifo_assignment') : 0);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recomputed
    // once per mount, matching the same "ceiling read at open time" posture
    // `staged`'s own initializer already uses; a live merchant edit to
    // Inventario mid-visit here is out of this screen's own scope to react to.
  }, []);

  // **"Disponible en general" — a separate figure from the ceiling above,
  // deliberately (D82). Do not collapse the two back into one.** This is
  // still the honest answer to its own question ("how many of this Product
  // are available to this Event across the business"), which §3.21's own
  // informational line and `home.md` §3.9's tile both legitimately ask, so
  // it is unchanged and stays displayed. Where it differs from the ceiling,
  // the difference is exactly this Product's tagged units, which belong to
  // the scan pool. Two questions, two derivations. (§3.21's fuller answer —
  // the "sin tag · con tag" split, which would show *both* pools rather than
  // capping one — remains specified and out of scope here; D82 deliberately
  // does not pre-empt it.)
  const disponibleEnGeneralByProduct = useMemo(() => {
    const map: Record<string, number> = {};
    for (const product of state.products) {
      map[product.id] = disponibleEnGeneral(state, eventId, product.id);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- same
    // once-per-mount posture as `ceilings` above, for the same reason.
  }, []);

  function setQuantity(productId: string, raw: number) {
    const ceiling = ceilings[productId] ?? 0;
    const overflowed = raw > ceiling;
    setStaged((prev) => ({ ...prev, [productId]: Math.max(0, Math.min(raw, ceiling)) }));
    setClamped((prev) => (prev[productId] === overflowed ? prev : { ...prev, [productId]: overflowed }));
  }

  async function handleSave() {
    setSaveState('saving');
    if (!saveIdempotencyKeyRef.current) {
      saveIdempotencyKeyRef.current = crypto.randomUUID();
    }
    const changes = state.products.map((p) => ({ productId: p.id, quantity: staged[p.id] ?? 0 }));
    const saved = await saveEventAllocations(eventId, changes, saveIdempotencyKeyRef.current);
    if (!saved) {
      console.error('[MercanciaParaEsteEvento] saveEventAllocations failed');
      setSaveState('error');
      return;
    }
    saveIdempotencyKeyRef.current = null; // this attempt is over; a future save mints its own key
    setSaveState('idle');
    setConfirmation(true);
    window.setTimeout(() => setConfirmation(false), 2400);
  }

  if (state.products.length === 0) {
    return (
      <>
        <div className={styles.topbar}>
          <button className={styles.back} onClick={onBack}>
            ← {venueName}
          </button>
        </div>
        <h1 className={styles.heading}>Mercancía para este evento</h1>
        <p className={styles.empty}>
          Todavía no registraste ningún producto. Registra mercancía en Inventario para poder llevar mercancía a
          este evento.
        </p>
      </>
    );
  }

  if (saveState === 'saving') {
    return <p className={styles.savingLine}>Guardando…</p>;
  }
  if (saveState === 'error') {
    // §3.23's own write-failure branch — Stage 7 Backend Integration, Phase
    // 2b: a real, reachable outcome now (a rejected/failed
    // `save_event_allocations` call), not merely disclosed-not-wired.
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorBody}>No se pudo guardar. Tus cambios siguen aquí, intenta de nuevo.</p>
        <Button onClick={handleSave}>Reintentar</Button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← {venueName}
        </button>
      </div>
      <h1 className={styles.heading}>Mercancía para este evento</h1>
      <p className={styles.intro}>
        Elige cuánto llevas de cada producto. Lo que no asignes se queda disponible para tus otros eventos.
      </p>

      {/* §3.21's own amendment — list-level, same position whether or not a
          row happens to be expanded below (never per-row), Paid tier only. */}
      {canScanBarcode && (
        <button className={styles.scanBtn} onClick={() => setScanMode('scanning')}>
          Escanear código de barras
        </button>
      )}

      {/* §3.22a — identical list-level position, same default/expanded
          persistence as the barcode shortcut above. Present only when this
          Business has NFC on and ≥1 tagged, still-available unit exists on
          its Catalog (`canScanNfc`, `decision-log.md` D81 — live unit
          state, never `Product.nfcTaggingEnabled`). */}
      {canScanNfc && (
        <button
          className={styles.scanBtn}
          onClick={() => {
            // `decision-log.md` D74 — this tap is itself the user gesture
            // Web NFC's `scan()` requires (the same "the tap that opens NFC
            // mode is the gesture" precedent
            // `product/01-validation/registro.html`'s own `iniciarNfc()`
            // established), so it starts the session directly rather than
            // opening the overlay and waiting for a second tap on the ring
            // inside it. `handleNfcScan` runs synchronously, in this same
            // click handler, before its first `await` — the exact point Web
            // NFC's transient-activation check is satisfied.
            setNfcOverlayOpen(true);
            void handleNfcScan();
          }}
        >
          Leer con NFC
        </button>
      )}

      {confirmation && <p className={styles.confirmation}>Mercancía actualizada ✓</p>}

      <div className={styles.list}>
        {state.products.map((product) => {
          const quantity = staged[product.id] ?? 0;
          // Two numbers on purpose (D82): `ceiling` caps the manual stepper
          // (untagged pool only — what the write can honour), `available` is
          // §3.21's own informational "Disponible en general" line (all
          // available units). They are equal on any Product with no tagged
          // units, which is every Product on a Business without NFC.
          const ceiling = ceilings[product.id] ?? 0;
          const available = disponibleEnGeneralByProduct[product.id] ?? 0;
          const expanded = expandedProductId === product.id;
          // **`decision-log.md` D84 (C).** The scan-committed half of this
          // row, re-read live on every render (never memoized, unlike
          // `ceilings`/`disponibleEnGeneralByProduct`): a scan is a live
          // server-side write, and `mirrorAllocationMovement` (`store.tsx`)
          // inserts its `eventAllocationUnits` row with `unitSource: 'scan'`
          // and flips the unit's status the instant the RPC returns — so
          // this derivation is correct client-side with no new state, no new
          // selector and no new write path. `eventAllocationFor` is also
          // re-read here rather than captured at mount, because a mixed-pile
          // scan can *mint* this Product's allocation mid-session.
          const liveAllocation = eventAllocationFor(state, eventId, product.id);
          const scanned = liveAllocation
            ? quantityRemainingBySource(state, liveAllocation, 'scan')
            : 0;
          // §3.21: "The collapsed summary line reflects the current live
          // total — already-committed scans plus any staged-but-unsaved
          // manual edit." Derived, never stored. Before D84 this printed
          // `staged` alone, which was only accidentally right because
          // `staged` was itself wrongly carrying the scan count; now the two
          // halves are named separately and added here, which is what lets
          // the stepper hold the manual basis it always owed the server.
          const forThisEvent = quantity + scanned;
          const summary =
            forThisEvent > 0 ? `${forThisEvent} para este evento` : 'nada para este evento todavía';

          return (
            <div
              key={product.id}
              ref={(el) => {
                rowRefs.current[product.id] = el;
              }}
              className={`${styles.row} stitchBottom`}
            >
              <button
                className={styles.rowSummary}
                onClick={() => setExpandedProductId(expanded ? null : product.id)}
              >
                <span className={styles.rowName}>
                  {product.name} — {summary}
                </span>
                <span className={styles.chevron}>{expanded ? '▴' : '▾'}</span>
              </button>

              {expanded && (
                <div className={styles.rowDetail}>
                  <p className={styles.available}>Disponible en general: {available}</p>
                  {/* **"Cantidad sin tag," not plain "Cantidad" —
                      `decision-log.md` D84 (B).** Already-approved copy,
                      verbatim from §3.21's own expanded-row wireframe; this
                      restores spec text rather than inventing any. It is
                      part of the correctness fix, not polish: now that the
                      stepper holds the manual (`fifo_assignment`) basis, a
                      box labelled plain "Cantidad" reading 0 on a row
                      summarised "3 para este evento" would be a lie by
                      omission. */}
                  <p className={styles.stepperLabel}>Cantidad sin tag</p>
                  <div className={styles.stepperRow}>
                    <button
                      className={styles.stepBtn}
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 0}
                      aria-label="Menos"
                    >
                      −
                    </button>
                    <div className={styles.valueWrap}>
                      <input
                        className={styles.valueInput}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quantity}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/[^0-9]/g, '');
                          setQuantity(product.id, digits === '' ? 0 : parseInt(digits, 10));
                        }}
                      />
                    </div>
                    <button
                      className={styles.stepBtn}
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      disabled={quantity >= ceiling}
                      aria-label="Más"
                    >
                      +
                    </button>
                  </div>
                  {clamped[product.id] && <p className={styles.clampNote}>Solo tienes {ceiling} disponibles.</p>}

                  {/* **The committed-scan disclosure — `decision-log.md`
                      D84 (C), §3.21's own "2 escaneadas" wireframe line.**
                      Required rather than cosmetic: §3.21 justifies the
                      collapsed summary's combined simplification *by
                      pointing at* this breakdown existing, so without it the
                      summary ("3 para este evento") and the stepper
                      ("Cantidad sin tag: 0") would show different numbers
                      with nothing on screen explaining the gap.

                      **Render condition, and why it is deliberately NOT the
                      availability split's condition (the gap D84 fixes).**
                      §3.21 previously gave one condition to two different
                      displays. The "sin tag · con tag" *availability*
                      decomposition asks about the **scan candidate pool**,
                      so it correctly conditions on `nfcPerProductEnabled`
                      AND ≥1 unit with `tagId != null AND status =
                      'available'`. This line asks a different question —
                      what this allocation has **already committed by scan**
                      — so it conditions on `quantityRemainingBySource(...,
                      'scan') > 0` alone. Inheriting the availability
                      condition would hide it at exactly the moment she most
                      needs it: a row whose tagged units have *all* been
                      scanned into this allocation has zero tagged-available
                      units left, so she'd have committed garments by scan
                      with nothing on screen saying so.

                      Separated from the stepper cluster above by its own
                      spacing — §3.21's own blank-line grouping device
                      between independent control clusters within one row,
                      matching the wireframe's own layout. The per-row
                      "Escanear las que te llevas" button the wireframe puts
                      immediately above this line is §3.22's per-Product scan
                      queue, still out of scope for this file (§3.22a's
                      list-level entry point is what commits these units) —
                      this line stands on its own rather than a dead control
                      being drawn to host it. */}
                  {scanned > 0 && (
                    <p className={styles.scannedNote}>
                      {scanned} escaneada{scanned === 1 ? '' : 's'}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button onClick={handleSave}>Guardar cambios</Button>
      </div>

      {/* §3.21a — cámara activa. Same live-camera mechanics as every other
          consumer of this shared component (`ProductPicker.tsx`,
          `Selling.tsx`, `CatalogView.tsx`'s own "Editar código de barras"),
          no new camera surface. No typed-search alternative exists on this
          screen (§3.21a's own explicit note) — "Cancelar" is the sole way
          back, matching the identical contextual adaptation
          `inventory.md` §3.4d already makes for the same reason. Mounted as
          a sibling of the row list above (never nested inside it), so the
          list stays mounted underneath exactly as it was before this tap —
          the back arrow/"Cancelar" both simply unmount this, leaving
          whichever row was expanded (if any) untouched. */}
      {scanMode === 'scanning' && (
        <BarcodeScanner
          backLabel="Mercancía para este evento"
          fallbackLabel="Cancelar"
          onBack={() => setScanMode('closed')}
          onResult={handleScanResult}
          onPermissionDenied={() => setScanMode('cameraFailure')}
        />
      )}

      {/* §3.21c — permiso de cámara denegado. Reused verbatim from
          `inventory.md` §3.4f's shape/register, the same precedent
          `CatalogView.tsx`'s own "Editar código de barras" build already
          established for the identical situation (no typed-search
          fallback exists in this context either). */}
      {scanMode === 'cameraFailure' && (
        <div className={styles.scanFallbackScreen}>
          <button className={styles.scanFallbackBack} onClick={() => setScanMode('closed')}>
            ← Mercancía para este evento
          </button>
          <p className={styles.scanFallbackText}>
            No pudimos usar la cámara.
            <br />
            Revisa los permisos de cámara de tu teléfono e intenta de nuevo.
          </p>
          <Button variant="secondary" onClick={() => setScanMode('closed')}>
            Cancelar
          </Button>
        </div>
      )}

      {/* §3.21b — código sin coincidencia. Never creates a new Product on a
          miss (every Catalog Product already has a row here by
          construction) — a plain, dead-end-free "Entendido" back to §3.21
          exactly as she left it, adapted from `home.md` §3.9b's own
          register for the identical underlying fact. */}
      {scanMode === 'noMatch' && (
        <div className={styles.scanFallbackScreen}>
          <button className={styles.scanFallbackBack} onClick={() => setScanMode('closed')}>
            ← Mercancía para este evento
          </button>
          <p className={styles.scanFallbackText}>No encontramos este código en tu Catálogo.</p>
          <Button onClick={() => setScanMode('closed')}>Entendido</Button>
        </div>
      )}

      {/* §3.22a — the mixed-pile NFC scan queue. Reached only from this
          screen's own list-level "Leer con NFC" above (never from any row's
          own §3.22 queue, which this file still doesn't build). No Product
          is ever pre-selected — the header/tally area is a live, growing
          list instead of a fixed "Escaneando: [Producto]" line. */}
      {nfcOverlayOpen && (
        <div className={styles.scanFallbackScreen}>
          <button className={styles.scanFallbackBack} onClick={closeNfcOverlay}>
            ← Mercancía para este evento
          </button>
          <p className={styles.nfcQueueHeading}>Leer con NFC</p>

          {nfcFeedback?.kind === 'conflict' && (
            <p className={styles.nfcQueueError}>
              {nfcFeedback.productName}: esta prenda ya está en otro evento. Usa otra.
            </p>
          )}
          {nfcFeedback?.kind === 'generic' && (
            <p className={styles.nfcQueueError}>No se pudo leer el tag. Acércalo de nuevo.</p>
          )}

          {nfcTally.length > 0 && (
            <ul className={styles.nfcQueueTally}>
              {nfcTally.map((row) => {
                const product = state.products.find((p) => p.id === row.productId);
                return (
                  <li key={row.productId}>
                    {product?.name ?? ''}: {row.count} escaneada{row.count === 1 ? '' : 's'}
                  </li>
                );
              })}
            </ul>
          )}

          <div className={styles.nfcQueuePrompt}>
            <NFCScanPrompt onTap={handleNfcScan} state={nfcSessionState} />
          </div>

          <Button variant="secondary" onClick={closeNfcOverlay}>
            Terminar
          </Button>
        </div>
      )}
    </>
  );
}
