import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { pendingTagBreakdown } from '../../domain/selectors';
import { makeId } from '../../domain/id';
import { Button } from '../../components/Button/Button';
import { NFCScanPrompt } from '../../components/NFCScanPrompt/NFCScanPrompt';
import styles from './AssignTags.module.css';

/** inventory.md §3.16 — a genuine physical read failure (out of range, foil
 * interference, timeout), client-side only; §3.16's own explicit instruction
 * is that this state never touches the domain layer. **Only used on
 * browsers without real Web NFC** (`!nfcSupported`, below) — there, it's a
 * random roll simulating a hardware failure that a real NFC radio would
 * otherwise report on its own. On real hardware (Chrome/Android), this same
 * `{ kind: 'scan-failed' }` feedback state is still reached, but from a
 * genuine `NDEFReader.write()` rejection, not this random chance. */
const SCAN_FAIL_CHANCE = 0.18;
/** Simulates a merchant accidentally re-presenting a tag already stuck to a
 * different garment — the only way to reach §3.15 (a genuine business-logic
 * conflict, unlike §3.16) without a dev-only test affordance. Only ever
 * rolled once ≥1 tag has actually been assigned, and only on browsers
 * without real Web NFC (`!nfcSupported`) — on real hardware, §3.15 is
 * reached the honest way: `assignTagToNextPendingUnit` rejecting a `tagId`
 * that's genuinely already assigned, because she physically re-tapped a tag
 * already stuck to a different garment. */
const DUPLICATE_TAG_CHANCE = 0.12;
/** Real Web NFC (`NDEFReader`) is Chrome/Android-only as of this build —
 * resolved once, same shape as `BarcodeScanner.tsx`'s own
 * `'BarcodeDetector' in window` check. Everywhere else (iPhone Safari,
 * desktop, any browser without it) keeps today's simulated scan behavior
 * below, completely unchanged. */
const nfcSupported = typeof window !== 'undefined' && 'NDEFReader' in window;

type ScanFeedback = { kind: 'already-assigned' } | { kind: 'scan-failed' } | null;

/** AT-M1/AT-M2 fix-round shape — a frozen entry (the "Lo que registraste"
 * receipt) plus the frozen per-Product "M" denominator map, both lifted out
 * of this component and owned by the caller (`App.tsx`, alongside
 * `inventoryView`) so neither is lost across this component's own
 * unmount/remount on an ordinary "Terminar después" → "Continuar
 * etiquetando" defer/resume cycle. See each prop's own doc comment below. */
export interface AssignTagsEntryLine {
  productId: string;
  quantity: number;
}

/**
 * inventory.md §3.14/§3.15/§3.16 — Asignar tags, the active tagging queue.
 * Pure scan-driven: a successful scan assigns the tag to the next untagged
 * unit and advances automatically, no per-unit confirm tap (§3.14). Reads
 * `pendingTagBreakdown` live on every render — never a snapshot taken once
 * at mount — so a unit consumed elsewhere (sold via FIFO in buttons mode
 * while she'd deferred tagging, §3.17) silently drops out of the queue.
 *
 * **Real vs. simulated hardware, disclosed here rather than silently
 * assumed** — `inventory.md` doesn't claim any exact NFC hardware
 * mechanics, the same disclaimed-mechanics posture §3.8b already holds for
 * camera mechanics. On Chrome/Android (`nfcSupported`, the only browser that
 * implements Web NFC as of this build), `handleScan` below genuinely writes
 * the generated `tagId` onto whichever physical tag she taps, via the real
 * `NDEFReader.write()` API — this hangs until she actually taps a tag, then
 * proceeds through the same real `assignTagToNextPendingUnit` RPC either
 * way. Everywhere else (iPhone Safari, desktop, any browser without Web
 * NFC), scanning stays the pure client-side simulation this comment
 * previously described as the *only* mechanism — no physical tag is ever
 * written to on those browsers, `SCAN_FAIL_CHANCE`/`DUPLICATE_TAG_CHANCE`
 * stand in for what a real radio would otherwise report.
 */
export function AssignTags({
  onDefer,
  onComplete,
  entryBreakdown,
  segmentTotals,
  onSegmentTotalsChange,
}: {
  onDefer: () => void;
  onComplete: () => void;
  /** AT-M1 fix — the receipt of exactly what the specific `commitLot` call
   * that triggered *this* entry into Asignar Tags actually wrote, captured
   * once by the caller at that moment and handed down unchanged for the
   * life of this tagging session (including across a defer/resume cycle,
   * since resuming isn't itself a new commit). Previously this line was
   * recomputed from the live, business-wide pending queue, so an old
   * deferred Lot's own backlog and a brand-new, unrelated Lot's units read
   * as one undifferentiated "what you just registered" — misrepresenting
   * what she actually just entered. `null` when this screen is reached with
   * no commit known this app session (e.g. resuming right after a reload)
   * — the summary line is simply omitted then, never fabricated from the
   * live queue. */
  entryBreakdown: AssignTagsEntryLine[] | null;
  /** AT-M2 fix — the frozen per-Product "M" denominator ("Faltan N de M"),
   * owned by the caller instead of this component's own state, so it
   * survives this component unmounting when she taps "Terminar después"
   * and remounting when she taps "Continuar etiquetando." */
  segmentTotals: Record<string, number>;
  onSegmentTotalsChange: (updater: (totals: Record<string, number>) => Record<string, number>) => void;
}) {
  const { state, assignTagToNextPendingUnit } = useStore();
  const breakdown = pendingTagBreakdown(state);
  const current = breakdown[0] ?? null;

  const [feedback, setFeedback] = useState<ScanFeedback>(null);

  // Live-hardware correctness fix (2026-09-17) — `NFCScanPrompt`'s own
  // reactive `state`, real `useState` rather than a ref (see that
  // component's own top-of-file doc comment). **Write-flow specific
  // asymmetry, disclosed rather than silently assumed:** unlike `scan()`
  // (`Selling.tsx`/`MercanciaParaEsteEvento.tsx`), Web NFC's
  // `NDEFReader.write()` exposes no intermediate "permission granted,
  // now listening" signal separate from full completion — its one promise
  // spans the entire wait for a physical tap through the write itself, so
  // `'listening'` is set the moment `write()` is actually invoked (the
  // earliest observable point), not after some later resolution the API
  // simply doesn't expose. This is a genuine, narrow platform gap (a tap
  // landing in the sliver between invocation and an actual permission grant
  // on a browser's very first-ever request could still race Android's own
  // dispatch), not something this fix invents or can close further without
  // a browser API this codebase doesn't have. It's still a large, real
  // improvement over the previous always-on ring, which showed "ready,
  // listening" from mount regardless of whether `write()` had ever been
  // called at all. Also unlike `scan()`'s one long-lived multi-tag session,
  // every unit here needs its own fresh on-screen tap before each physical
  // tag (`write()`'s own gesture-per-call requirement) — a successful
  // commit resets back to `'idle'`, honestly requiring a new tap rather than
  // implying the ring is still listening for the next tag on its own.
  // Simulated (non-hardware) browsers have no real session to represent at
  // all, so `nfcState` there stays permanently `'listening'` — the original,
  // always-on look, unchanged, since there is no real dead-session hazard
  // (no real NFC radio) for it to misrepresent.
  const [nfcState, setNfcState] = useState<'idle' | 'listening' | 'error'>(nfcSupported ? 'idle' : 'listening');

  // Real-hardware write path only (`nfcSupported`) — the in-flight
  // `AbortController` for whichever `NDEFReader.write()` call is currently
  // hanging, waiting for her to physically tap a tag. Aborted on unmount so
  // a write that never resolves (she navigates away, e.g. "Terminar
  // después," mid-tap) doesn't keep the underlying NFC radio reserved or
  // resolve into an unmounted component later.
  const nfcAbortRef = useRef<AbortController | null>(null);
  useEffect(() => {
    return () => {
      nfcAbortRef.current?.abort();
    };
  }, []);

  // Live-hardware correctness fix (2026-09-17, visibility-hardening
  // follow-up) — checked for the identical dead-session-while-hidden
  // exposure `Selling.tsx`/`MercanciaParaEsteEvento.tsx`'s own sibling fix
  // (same pass) closes, and found genuinely exposed, **not** safe by
  // construction, despite this file's write-flow shape looking safer at
  // first glance (a fresh tap already required per physical tag, per this
  // file's own existing `nfcState` doc comment above).
  //
  // The reason it's exposed: `write()`'s one promise stays pending for
  // `nfcState`'s *entire* `'listening'` duration (unlike `scan()`, which
  // resolves once and then just keeps a session alive with no promise left
  // pending) — so today, with no visibility listener at all, backgrounding
  // mid-write leaves that promise hanging. Per the same Chromium-documented
  // behavior this pass is built on, Chrome doesn't reject it on its own
  // when the tab goes hidden — it silently drops the underlying reader-mode
  // session and leaves the JS promise pending indefinitely. Returning to
  // the tab then shows a `nfcState` still stuck at `'listening'` forever,
  // and `handleScan`'s own `if (nfcState === 'listening') return` guard
  // (below) makes a fresh on-screen tap a silent no-op too — no recovery
  // even by tapping again, a genuinely *worse* dead end than the sibling
  // `scan()` case, not merely an equally-stale ring.
  //
  // **Fixed the minimal way, reusing machinery that already exists rather
  // than duplicating the sibling fix's own manual idle-reset:** aborting
  // the in-flight `write()` here is sufficient on its own — `handleScan`'s
  // own `catch` block below already anticipates `AbortError` as a rejection
  // reason and already sets `feedback: scan-failed` / `nfcState: 'error'`
  // correctly, since (unlike the `scan()` case) there is always still a
  // genuinely pending promise for this abort to reject at the moment the
  // tab goes hidden. No separate "on visible again, reset to idle" branch
  // is needed here the way the sibling fix requires one.
  useEffect(() => {
    if (!nfcSupported) return;
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden' && nfcAbortRef.current) {
        nfcAbortRef.current.abort();
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // A stable string key of the live queue's own shape (product id + its
  // live count, front-to-back) — changes exactly when a scan lands or the
  // queue's composition genuinely changes, never merely because
  // `pendingTagBreakdown` returns a fresh array/object identity on every
  // render the way `breakdown` itself does.
  const breakdownKey = breakdown.map((row) => `${row.product.id}:${row.count}`).join('|');

  useEffect(() => {
    // §3.14's "Faltan N de M": M is fixed per Product segment while N (that
    // Product's own live remaining count) ticks down as she scans —
    // captured once per Product, the moment it first becomes (or already
    // is) part of the live queue, and never evicted while it's still
    // pending — so an ordinary defer/resume, which only unmounts/remounts
    // this component without changing the queue itself, hands the same M
    // straight back rather than re-capturing a smaller live remainder as a
    // new, wrong M (AT-M2). A segment's frozen total is only ever dropped
    // once it's fully tagged and genuinely disappears from the live queue —
    // exactly the moment a later, unrelated commitLot minting a fresh batch
    // of that same Product would need a brand-new M rather than reusing a
    // stale one. This also correctly leaves an *other*, still-pending
    // segment's own frozen total untouched when a new, unrelated Lot is
    // registered mid-queue (the AT-M1 scenario) — only the segment that
    // actually finished is ever reset, never the whole map at once.
    //
    // AT-M4 — this used to only ever *keep* an already-frozen total, never
    // *raise* it. "Registrar mercancía" stays reachable at all times while a
    // tagging queue is active (inventory.md §3.5) — registering more of a
    // Product that's still mid-queue (e.g. "Faltan 7 de 10" for Playeras)
    // grows that Product's live remaining count past its own frozen M
    // ("Faltan 12 de 10"), a denominator smaller than the count it's
    // supposed to bound, on the one screen whose entire job is a
    // trustworthy live count. Fixed by also raising a still-pending
    // segment's frozen total up to the live count whenever the live count
    // has grown past it — never only holding or shrinking. This is
    // idempotent by construction (it reacts to the live count actually
    // exceeding the frozen one, not to a remount or a resume event by
    // itself), so a plain "Terminar después" → "Continuar etiquetando"
    // cycle with no intervening growth still hands back the exact same M,
    // exactly as AT-M2 already guarantees.
    onSegmentTotalsChange((totals) => {
      const liveIds = new Set(breakdown.map((row) => row.product.id));
      let changed = false;
      const next: Record<string, number> = {};
      for (const row of breakdown) {
        const frozen = totals[row.product.id];
        if (frozen == null) {
          next[row.product.id] = row.count;
          changed = true;
        } else if (row.count > frozen) {
          next[row.product.id] = row.count;
          changed = true;
        } else {
          next[row.product.id] = frozen;
        }
      }
      for (const key of Object.keys(totals)) {
        if (!liveIds.has(key)) changed = true;
      }
      return changed ? next : totals;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakdownKey]);

  useEffect(() => {
    // inventory.md §2 step 4 — 0 pending units left: return to Catalog view
    // with the "lista para vender" confirmation (§3.13). A live check, so
    // this fires the instant the last scan lands, not on a separate poll.
    if (breakdown.length === 0) onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakdown.length]);

  if (!current) {
    // AT-MIN2 fix — the render right before `onComplete()`'s effect above
    // actually fires still shows the topbar shell rather than a bare
    // `null`, so leaving this screen doesn't flash a fully blank content
    // area under the nav bar for one frame.
    return (
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Asignar tags</span>
      </div>
    );
  }

  const total = segmentTotals[current.product.id] ?? current.count;

  const entrySummary =
    entryBreakdown && entryBreakdown.length > 0
      ? entryBreakdown
          .map(({ productId, quantity }) => {
            const product = state.products.find((p) => p.id === productId);
            return product ? `${product.name} (${quantity})` : null;
          })
          .filter((line): line is string => line != null)
          .join(' · ')
      : null;

  // Shared by both the real-hardware and simulated paths below — takes a
  // resolved `tagId` (however it was obtained) through the one real,
  // unchanged write: `assignTagToNextPendingUnit`'s own
  // `already-assigned`/`scan-failed` handling.
  async function commitTag(tagId: string) {
    // Stage 7 Backend Integration, Phase 1 — assignTagToNextPendingUnit is
    // now a real, awaitable Supabase RPC call.
    const result = await assignTagToNextPendingUnit(tagId);
    // Either branch below means the physical write() itself already
    // completed (real hardware genuinely wrote *something*, or the
    // simulated path picked its outcome) — this write cycle is over either
    // way, so a genuinely new on-screen tap is required before the *next*
    // physical tag (write()'s own gesture-per-call requirement, see this
    // file's own `nfcState` doc comment above). Never `'error'` here — a
    // business-logic rejection (already-assigned) or a platform hiccup
    // folded into existing copy is not "the session failed to start," the
    // one thing `NFCScanPrompt`'s own `'error'` ring means.
    if (nfcSupported) setNfcState('idle');
    if (!result.ok) {
      if (result.reason === 'already-assigned') {
        setFeedback({ kind: 'already-assigned' });
        return;
      }
      // `queue-empty` is defensively unreachable here — `current` above
      // already guarantees ≥1 pending unit this render. `platform-error`
      // (a genuine network/RPC failure, no designed §3.14-§3.16 state for
      // it) folds into the closest existing copy — "no se pudo leer el
      // tag, acércalo de nuevo" — the same "fold into an existing branch
      // rather than invent new merchant-facing copy" posture `verifyOtp`'s
      // own malformed-request outcomes already established.
      setFeedback({ kind: 'scan-failed' });
      return;
    }
    // A successful scan (or a different conflict) clears any prior message
    // automatically — no tap required to dismiss it (§3.15/§3.16).
    setFeedback(null);
  }

  async function handleScan() {
    if (nfcSupported) {
      if (nfcState === 'listening') {
        // A write() call is already in flight, hanging on her physical tap
        // — a second concurrent write() would just race the same tap.
        // Harmless no-op, mirrors `Selling.tsx`'s identical guard.
        return;
      }
      // Real Web NFC write path (Chrome/Android). The app stays in control
      // of the ID format regardless of hardware — `makeId('tag')` is
      // generated here exactly as the simulated path does, then physically
      // written onto whichever tag she taps. `setNfcState('listening')` here
      // (rather than after `write()` resolves) is this call site's own
      // disclosed asymmetry with `scan()` — see this file's own `nfcState`
      // doc comment for why write() exposes no earlier signal to wait for.
      setNfcState('listening');
      const tagId = makeId('tag');
      const controller = new AbortController();
      nfcAbortRef.current = controller;
      try {
        const ndef = new window.NDEFReader!();
        // Hangs until she physically taps a tag against the phone — that's
        // expected, not a bug.
        await ndef.write({ records: [{ recordType: 'text', data: tagId }] }, { signal: controller.signal });
      } catch {
        // Permission denied, no NFC hardware despite feature detection,
        // AbortError (unmounted mid-write), or any other rejection — a real
        // failure always means "show scan-failed, let her physically
        // retry," never a silent fall-back to the simulated random-tagId/
        // random-fail logic below, which would fabricate a tag assignment
        // that was never actually written to any physical object. The
        // session itself failed here — `NFCScanPrompt`'s own `'error'` ring,
        // not just this line's existing (deliberately non-alarming, AT-M3)
        // `scan-failed` copy.
        setFeedback({ kind: 'scan-failed' });
        setNfcState('error');
        return;
      } finally {
        nfcAbortRef.current = null;
      }
      await commitTag(tagId);
      return;
    }

    // Simulated path — every browser without Web NFC (iPhone Safari,
    // desktop, any browser lacking `NDEFReader`), unchanged.
    if (Math.random() < SCAN_FAIL_CHANCE) {
      // §3.16 — never touches the domain layer; queue state is unchanged.
      setFeedback({ kind: 'scan-failed' });
      return;
    }

    const assignedTagIds = state.units.map((u) => u.tagId).filter((id): id is string => id != null);
    const simulateDuplicate = assignedTagIds.length > 0 && Math.random() < DUPLICATE_TAG_CHANCE;
    const tagId = simulateDuplicate
      ? assignedTagIds[Math.floor(Math.random() * assignedTagIds.length)]
      : makeId('tag');

    await commitTag(tagId);
  }

  return (
    <>
      <div className={styles.topbar}>
        <span className={styles.wordmark}>Asignar tags</span>
      </div>
      <div className={styles.wrap}>
        {entrySummary && <p className={styles.summary}>Lo que registraste: {entrySummary}</p>}

        <p className={`${styles.errorLine} ${feedback ? '' : styles.errorLineHidden}`}>
          {feedback?.kind === 'already-assigned' && 'Este tag ya está asignado a otra prenda. Usa un tag nuevo.'}
          {feedback?.kind === 'scan-failed' && 'No se pudo leer el tag. Acércalo de nuevo a la prenda.'}
        </p>

        <div className={styles.progress}>
          <p className={styles.progressLabel}>Etiquetando: {current.product.name}</p>
          <p className={styles.progressCount}>
            Faltan {current.count} de {total}
          </p>
        </div>

        <NFCScanPrompt onTap={handleScan} state={nfcState} />
      </div>

      <div className={`${styles.footer} stitchTop`}>
        <Button variant="secondary" onClick={onDefer}>
          Terminar después
        </Button>
      </div>
    </>
  );
}
