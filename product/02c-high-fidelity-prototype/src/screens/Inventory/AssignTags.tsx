import { useEffect, useLayoutEffect } from 'react';
import { useStore } from '../../domain/store';
import { pendingTagBreakdown } from '../../domain/selectors';
import { makeId } from '../../domain/id';
import { nfcSupported, nfcUnavailable } from '../../domain/nfcSupport';
import type { NfcAssignSession } from '../../domain/useNfcAssignTagSession';
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
 * genuine `onreadingerror` (or an unavailable `serialNumber`,
 * `decision-log.md` D74), not this random chance. */
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
// `nfcSupported` / `nfcUnavailable` — the shared capability + simulation
// switch (`src/domain/nfcSupport.ts`, Stage 7 correctness fix 2026-09-17),
// replacing this file's own former `'NDEFReader' in window` constant. The
// simulated path below is now only reachable when Web NFC isn't real and
// simulation is allowed (`NFC_SIMULATION_ENABLED`, read inside
// `nfcUnavailable`'s own definition and inside `nfcSession`'s own
// `'listening'`-by-default initial state, `useNfcAssignTagSession.ts`) — a
// production build on a browser without Web NFC renders `NFCScanPrompt`'s
// `'unsupported'` state instead and never commits a fabricated tag id.

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
 * while she'd deferred tagging, per "Terminar después," §3.14's own note —
 * §3.17 retired 2026-09-17, folded into §3.4's per-row resume indicator)
 * silently drops out of the queue.
 *
 * **Real vs. simulated hardware, disclosed here rather than silently
 * assumed** — `inventory.md` doesn't claim any exact NFC hardware
 * mechanics, the same disclaimed-mechanics posture §3.8b already holds for
 * camera mechanics. On Chrome/Android (`nfcSupported`, the only browser that
 * implements Web NFC as of this build), `handleScan` below starts a real,
 * persistent `NDEFReader.scan()` listening session and reads each physical
 * tag's own factory-set hardware UID (`event.serialNumber`,
 * `decision-log.md` D74) — Nahui never writes anything onto a tag; a blank
 * factory tag is fully usable as-is. Every UID read resolves through the
 * same real `assignTagToNextPendingUnit` RPC either way. Everywhere else
 * (iPhone Safari, desktop, any browser without Web NFC), scanning stays the
 * pure client-side simulation this comment previously described as the
 * *only* mechanism — no physical tag is ever touched on those browsers,
 * `SCAN_FAIL_CHANCE`/`DUPLICATE_TAG_CHANCE` stand in for what a real radio
 * would otherwise report.
 */
export function AssignTags({
  onDefer,
  onComplete,
  entryBreakdown,
  segmentTotals,
  onSegmentTotalsChange,
  scopeProductId,
  nfcSession,
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
   * live queue. **Also always `null` for a Product-scoped entry
   * (`scopeProductId` set, below)** — `inventory.md` §3.14's own wireframe
   * variant for this entry point drops "Lo que registraste" outright, since
   * it implies units just received, which isn't necessarily true for a
   * resumed or toggle-triggered Product-scoped queue; the caller
   * (`InventoryScreen.tsx`) enforces this, never this component itself. */
  entryBreakdown: AssignTagsEntryLine[] | null;
  /** AT-M2 fix — the frozen per-Product "M" denominator ("Faltan N de M"),
   * owned by the caller instead of this component's own state, so it
   * survives this component unmounting when she taps "Terminar después"
   * and remounting when she taps "Continuar etiquetando." */
  segmentTotals: Record<string, number>;
  onSegmentTotalsChange: (updater: (totals: Record<string, number>) => Record<string, number>) => void;
  /** `inventory.md` §3.14's entry point 3 (2026-09-17 live pass) — Asignar
   * Tags entered via §3.4's fifth zone (toggle-ON auto-open, when ≥1
   * eligible unit already exists) or sixth zone (the `[ N sin etiquetar ]`
   * resume indicator). `undefined` is the existing, completely unchanged
   * Lot-scoped shape (entry point 1, `inventory.md` §2 step 3) — the whole-
   * Catalog live queue, exactly as before this amendment. Set, it narrows
   * every live read below (`breakdown`, and therefore `current`,
   * `breakdownKey`, and the completion check) to only this one Product's own
   * pending units, via `pendingTagBreakdown`'s own additive `productId`
   * filter (`selectors.ts`) — never some *other* Product's units surfacing
   * mid-queue while she's working through one specific Product's stack. */
  scopeProductId?: string;
  /** 2026-09-18 architecture fix (`decision-log.md` D74/D75 follow-up) —
   * the live Web NFC session itself, lifted out of this component's own
   * state and owned by `App.tsx` (`useNfcAssignTagSession`, alongside
   * `assignTagsEntry`/`assignTagsSegmentTotals`, the identical reason those
   * two are already lifted there) so it can be started from a click handler
   * in `CatalogView.tsx` — a different component — and survive the
   * navigation into this one. See that hook's own top-of-file doc comment
   * for the full "why this moved" reasoning. */
  nfcSession: NfcAssignSession;
}) {
  const { state, assignTagToNextPendingUnit } = useStore();
  const breakdown = pendingTagBreakdown(state, scopeProductId);
  const current = breakdown[0] ?? null;

  const { state: nfcState, feedback, setFeedback, startScan, stopSession, handleTagResolvedRef } = nfcSession;

  // 2026-09-18 architecture fix (`decision-log.md` D74/D75 follow-up) — the
  // real `scan()` session mechanics (the `'idle'|'listening'|'error'|
  // 'unsupported'` state itself, `scanStartedRef`/`nfcAbortRef`, the
  // persistent `onreading`/`onreadingerror` handlers, the D75
  // `visibilitychange` hardening) all moved out of this component's own
  // state into `nfcSession` (`useNfcAssignTagSession`, owned by `App.tsx`)
  // — see that hook's own top-of-file doc comment for the full mechanics
  // and the "why this moved" reasoning. `startScan`/`stopSession`
  // destructured above are that hook's own functions, unchanged in
  // behavior, just no longer local to this component.
  //
  // Mount-time auto-start — kept here as a fallback for the one entry point
  // that doesn't originate in `CatalogView.tsx` and so can't call
  // `startScan()` from its own click handler ahead of time:
  // `RegisterMerchandise.tsx`'s post-save auto-entry (Lot-scoped, entry
  // point 1). For the two `CatalogView.tsx`-originated entry points
  // (toggle-ON auto-open, the "[ N sin etiquetar ]" resume tap), `startScan`
  // has already been called synchronously (or as the first step of the
  // resolved-RPC continuation) inside that component's own tap handler by
  // the time this effect runs — `nfcSession`'s own internal
  // `scanStartedRef` guard makes this call a harmless no-op then, never a
  // second concurrent `scan()`. `useLayoutEffect`, not `useEffect`
  // (2026-09-18 real-device fix) — fires synchronously after this
  // component's DOM mutations commit, strictly earlier than a passive
  // effect, narrowing the gap between `RegisterMerchandise.tsx`'s own
  // `await commitLot(...)` and this attempt's own `scan()` call as much as
  // a mount-triggered effect still can. In every case where Chromium's
  // 5-second transient-activation budget (`kActivationLifespan`,
  // `third_party/blink/public/common/frame/user_activation_state.h`) is
  // genuinely exhausted by the time this effect runs, `startScan`'s own
  // `catch` (inside `nfcSession`) falls back to `state: 'error'` ("Toca
  // para intentar de nuevo"), never a stuck state.
  //
  // Best-effort diagnostic, 2026-09-18 — `navigator.permissions.query` for
  // `'nfc'` isn't implemented by every browser (and isn't in this
  // codebase's own TS lib types), so this is wrapped defensively and never
  // gates `startScan()` itself. Logged only, to tell a future real-device
  // session whether the browser already considers this origin
  // NFC-permission-granted before this attempt starts.
  useLayoutEffect(() => {
    if (!nfcSupported) return;
    (async () => {
      try {
        const permissions = navigator.permissions as
          | { query: (descriptor: { name: string }) => Promise<{ state: string }> }
          | undefined;
        const status = await permissions?.query({ name: 'nfc' });
        if (status) console.info('[AssignTags] navigator.permissions "nfc" state at mount:', status.state);
      } catch {
        console.info('[AssignTags] navigator.permissions "nfc" query unsupported on this browser.');
      }
    })();
    void startScan();
  }, [startScan]);

  // Tears the live session down on every genuine "leaving Asignar Tags"
  // transition ("Terminar después," a completed queue routing back to
  // Catalog view) — every one of those unmounts this component
  // (`InventoryScreen.tsx`'s own discriminated `InventoryView` branching),
  // so this single cleanup site covers all of them, the same coverage the
  // previous component-scoped cleanup effect already had, now delegated to
  // `nfcSession.stopSession` (shared with `App.tsx`, see that function's
  // own doc comment). Also closes the identical React 18 `<StrictMode>`
  // double-invoke hazard the previous local version fixed (2026-09-18,
  // `main.tsx`'s dev-only double-invoke of every effect on initial mount):
  // `stopSession` resets `nfcSession`'s own dispatch guard on both a
  // genuine unmount and StrictMode's synthetic one, so a synthetic
  // remount's second `startScan()` call is never silently guarded away by
  // a stale "already started" flag left over from the aborted first
  // attempt. **Disclosed extension, 2026-09-18** — this now also applies,
  // dev-only, to a session `CatalogView.tsx` already started before this
  // component ever mounted: StrictMode's synthetic cleanup will abort that
  // real, live session and `startScan`'s own mount-effect retry immediately
  // restarts it, a harmless extra `scan()` round-trip that only ever
  // happens under `vite dev`'s double-invoke, never in a production build
  // (which doesn't run `<StrictMode>` at all) and never observably to her —
  // the ring settles into the correct final state either way.
  useEffect(() => {
    return stopSession;
  }, [stopSession]);

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
  // resolved `tagId` (however it was obtained: a real UID read, or the
  // simulated random pick) through the one real, unchanged write:
  // `assignTagToNextPendingUnit`'s own `already-assigned`/`scan-failed`
  // handling. Reassigned into `handleTagResolvedRef` on every render (see
  // below), the identical mechanism `Selling.tsx`'s own `resolveTag` already
  // establishes — the persistent `ndef.onreading` handler is set up only
  // once, whenever the session actually starts (`startScan`, above — now
  // typically the mount effect, occasionally a manual retry tap if that
  // attempt's activation window had lapsed), so it must always dispatch
  // through this render's current closure rather than a stale one captured
  // back when the scan session was first started.
  async function commitTag(tagId: string) {
    // Stage 7 Backend Integration, Phase 1 — assignTagToNextPendingUnit is
    // now a real, awaitable Supabase RPC call.
    const result = await assignTagToNextPendingUnit(tagId);
    // Unlike the retired `write()`-per-tag shape, a commit (successful or
    // not) no longer resets `nfcState` back to `'idle'` — the underlying
    // `scan()` session stays genuinely alive and listening for the next
    // physical tap (`decision-log.md` D74), exactly as `Selling.tsx`'s own
    // continuous scan session already behaves. Never `'error'` here — a
    // business-logic rejection (already-assigned) or a platform hiccup
    // folded into existing copy is not "the session failed to start," the
    // one thing `NFCScanPrompt`'s own `'error'` ring means.
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
  // Always points at this render's own `commitTag` (above) — see that
  // function's own doc comment for why. Plain assignment, not a hook call —
  // `handleTagResolvedRef` itself is declared with the rest of this
  // component's hooks, above the `if (!current)` early return (Rules of
  // Hooks); this reassignment is safe to sit after it, same as `handleScan`
  // below already does.
  handleTagResolvedRef.current = commitTag;

  async function handleScan() {
    if (nfcUnavailable) {
      // Stage 7 correctness fix (2026-09-17) — no Web NFC and no simulation
      // allowed in this build. `NFCScanPrompt`'s `'unsupported'` state
      // already renders nothing tappable, so this is a belt-and-braces
      // guard: whatever reaches here must never mint a `makeId('tag')` and
      // push it through the real `assign_tag_to_next_pending_unit` RPC.
      return;
    }
    if (nfcSupported) {
      // The mount effect above already attempted this the instant the
      // queue became ready. A manual tap reaching here is either the
      // fallback retry after that attempt's inherited transient-activation
      // window genuinely lapsed (`nfcState === 'error'`), or — while a
      // session is already listening — `startScan`'s own `scanStartedRef`
      // guard making this a harmless no-op, mirroring `Selling.tsx`'s
      // identical "already listening, just hold the tag near the phone"
      // no-op.
      await startScan();
      return;
    }

    // Simulated path — a browser without Web NFC (iPhone Safari, desktop,
    // any browser lacking `NDEFReader`) **in a dev or explicit demo build
    // only** (`NFC_SIMULATION_ENABLED`); the `nfcUnavailable` guard above
    // makes this unreachable in a production build. Unchanged otherwise.
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
