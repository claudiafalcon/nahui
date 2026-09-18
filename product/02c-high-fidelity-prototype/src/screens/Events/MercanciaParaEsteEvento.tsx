import { useEffect, useMemo, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import {
  disponibleEnGeneral,
  eventAllocationFor,
  productByBarcode,
  quantityRemaining,
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
 * row-level scan annotation already establishes. Present only when ≥1
 * Product on this Business's Catalog has `nfcTaggingEnabled = true`.
 * Reuses §3.22's own two-state error register verbatim (a named conflict —
 * "[Producto]: esta prenda ya está en otro evento. Usa otra." — or a
 * generic "No se pudo leer el tag. Acércalo de nuevo.") rather than
 * inventing new copy; the conflict's Product name is resolved *client-side*
 * from this Business's already-hydrated `state.units`/`nfc_tags` mirror
 * ahead of the write, since the RPC's own `unit_already_committed`
 * exception (a bare Postgres error, per its own documented contract) never
 * carries a payload to read a Product identity back from.
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

  // Staged manual quantities — initialized once from each Product's current
  // live-remaining committed count (`quantityRemaining`, 0 if no
  // EventAllocation exists yet for this pair). **Corrected, RFC 0010/D59:**
  // never `quantityAllocated`, which is now a monotonic lifetime total that
  // never decreases — reading it here would silently ignore any prior
  // mid-Event release and redisplay a stale, too-high number. Collapsing/
  // expanding a row is a pure display toggle, never a commit (§3.21's own
  // annotation) — this map persists whichever row is shown expanded or not.
  const [staged, setStaged] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const product of state.products) {
      const allocation = eventAllocationFor(state, eventId, product.id);
      initial[product.id] = allocation ? quantityRemaining(state, allocation) : 0;
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

  // §3.22a — present only when ≥1 Product on this Business's Catalog is
  // NFC-tagging-eligible enough to have actually been tagged
  // (`Product.nfcTaggingEnabled`), matching this section's own "absent
  // entirely, not shown-then-disabled" posture for the barcode row above.
  const canScanNfc = state.products.some((p) => p.nfcTaggingEnabled === true);
  // Growing, insertion-ordered tally — one row per Product actually scanned
  // this overlay session, "Bolsas: 2 escaneadas" (§3.22a's own wireframe).
  const [nfcOverlayOpen, setNfcOverlayOpen] = useState(false);
  const [nfcTally, setNfcTally] = useState<{ productId: string; count: number }[]>([]);
  const [nfcFeedback, setNfcFeedback] = useState<
    { kind: 'conflict'; productName: string } | { kind: 'generic' } | null
  >(null);
  // Real Web NFC read path only — the persistent `NDEFReader.scan()`
  // listening session this overlay's own first tap starts (mirrors
  // `Selling.tsx` §3.9d/§3.10's identical mechanism), so every subsequent
  // physical tap needs no further on-screen tap. Reset on close so a later
  // re-open starts a genuinely fresh session. `nfcScanStartedRef` guards the
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
        }
      } else if (wasSessionActiveBeforeHiddenRef.current) {
        wasSessionActiveBeforeHiddenRef.current = false;
        // Not `'listening'` — see `Selling.tsx`'s identical comment for why.
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
    // §3.21's own row-level annotation ("a successful scan is a live,
    // immediate write... 'Para este evento' figure updates immediately") —
    // a scan always adds exactly one unit to the resolved Product's own
    // allocation, so a plain relative +1 is correct and, being relative,
    // never clobbers any of her own not-yet-saved manual edit already
    // staged on that same row. "Disponible en general" (`ceilings`) is
    // deliberately left untouched — moving a unit from the general pool
    // into *this* Event's own allocation is a net-zero change to that
    // figure by construction (§3.21's own "Disponible en general...
    // deliberately includes what's already allocated to this Event").
    setStaged((prev) => ({ ...prev, [result.productId]: (prev[result.productId] ?? 0) + 1 }));
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
          const record = event.message.records[0];
          if (!record?.data) return;
          const tagId = new TextDecoder(record.encoding || 'utf-8').decode(record.data);
          void commitNfcScan(tagId);
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

  const ceilings = useMemo(() => {
    const map: Record<string, number> = {};
    for (const product of state.products) {
      map[product.id] = disponibleEnGeneral(state, eventId, product.id);
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recomputed
    // once per mount, matching the same "ceiling read at open time" posture
    // `staged`'s own initializer already uses; a live merchant edit to
    // Inventario mid-visit here is out of this screen's own scope to react to.
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
          persistence as the barcode shortcut above. Present only when ≥1
          Product on this Catalog is NFC-tagging-eligible. */}
      {canScanNfc && (
        <button className={styles.scanBtn} onClick={() => setNfcOverlayOpen(true)}>
          Leer con NFC
        </button>
      )}

      {confirmation && <p className={styles.confirmation}>Mercancía actualizada ✓</p>}

      <div className={styles.list}>
        {state.products.map((product) => {
          const quantity = staged[product.id] ?? 0;
          const ceiling = ceilings[product.id] ?? 0;
          const expanded = expandedProductId === product.id;
          const summary = quantity > 0 ? `${quantity} para este evento` : 'nada para este evento todavía';

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
                  <p className={styles.available}>Disponible en general: {ceiling}</p>
                  <p className={styles.stepperLabel}>Cantidad</p>
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
