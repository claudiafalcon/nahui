import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { pendingTagBreakdown } from '../../domain/selectors';
import { makeId } from '../../domain/id';
import { NFC_SIMULATION_ENABLED, nfcSupported, nfcUnavailable } from '../../domain/nfcSupport';
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
// `nfcSupported` / `NFC_SIMULATION_ENABLED` / `nfcUnavailable` — the shared
// capability + simulation switch (`src/domain/nfcSupport.ts`, Stage 7
// correctness fix 2026-09-17), replacing this file's own former
// `'NDEFReader' in window` constant. The simulated path below is now only
// reachable when `NFC_SIMULATION_ENABLED` (dev / explicit demo build) —
// a production build on a browser without Web NFC renders
// `NFCScanPrompt`'s `'unsupported'` state instead and never commits a
// fabricated tag id.

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
}) {
  const { state, assignTagToNextPendingUnit } = useStore();
  const breakdown = pendingTagBreakdown(state, scopeProductId);
  const current = breakdown[0] ?? null;

  const [feedback, setFeedback] = useState<ScanFeedback>(null);

  // Live-hardware correctness fix (2026-09-17), read-path rebuild
  // (`decision-log.md` D74, same day) — `NFCScanPrompt`'s own reactive
  // `state`, real `useState` rather than a ref (see that component's own
  // top-of-file doc comment). **Continuous scan, mirroring
  // `Selling.tsx`/`MercanciaParaEsteEvento.tsx`'s own long-lived `scan()`
  // session shape, not one `write()` call per physical tag.** D74 replaced
  // this file's real-hardware path from `NDEFReader.write()` (a fabricated
  // client-minted id, physically written onto the tag) to `NDEFReader.scan()`
  // (reading the tag's own factory-set hardware UID) — and `scan()`, unlike
  // `write()`, naturally supports many physical taps against one listening
  // session via `onreading` firing repeatedly, exactly the shape §3.14's own
  // "no per-unit confirm tap, advances automatically" flow already wants.
  // So this file now starts exactly one `scan()` session for the whole
  // tagging queue, same as its two siblings, rather than reopening a fresh
  // write-per-tag cycle: `'listening'` is set once `scan()` has genuinely
  // resolved (the browser has granted and begun the session), and a
  // successful or failed commit (`commitTag`, below) no longer resets
  // `nfcState` back to `'idle'` — the ring stays honestly listening for the
  // next physical tag exactly as it does mid-Session on `Selling.tsx`.
  // Simulated (non-hardware, dev/demo-build only) browsers have no real
  // session to represent at all, so `nfcState` there stays permanently
  // `'listening'` — the original, always-on look, unchanged, since there is
  // no real dead-session hazard (no real NFC radio) for it to misrepresent.
  // A production build on a browser without Web NFC is `'unsupported'`
  // from mount and stays there: nothing below ever transitions it.
  const [nfcState, setNfcState] = useState<'idle' | 'listening' | 'error' | 'unsupported'>(
    nfcSupported ? 'idle' : NFC_SIMULATION_ENABLED ? 'listening' : 'unsupported',
  );

  // Real Web NFC read path only (`nfcSupported`) — the same
  // `scanStartedRef`/`nfcAbortRef` trio `Selling.tsx`/
  // `MercanciaParaEsteEvento.tsx` already establish. `scanStartedRef` guards
  // the *dispatch* — exactly one in-flight `scan()` attempt at a time (a
  // ref, not state, so a second tap arriving before React flushes can't
  // fire a second concurrent `scan()` call); `nfcAbortRef` is the
  // `AbortController` for that session's `scan()` call, aborted on unmount
  // so a stale listener never fires into an unmounted component (she
  // navigates away, e.g. "Terminar después," mid-session).
  const scanStartedRef = useRef(false);
  const nfcAbortRef = useRef<AbortController | null>(null);
  // Always points at this render's own `commitTag` (defined below, after
  // this component's `if (!current)` early return) — declared here,
  // unconditionally, with this component's other hooks (Rules of Hooks);
  // reassigned every render further down, where `commitTag` itself is
  // defined. See that reassignment's own doc comment for why a persistent
  // `ndef.onreading` handler needs this indirection at all.
  const handleTagResolvedRef = useRef<(tagId: string) => Promise<void>>(async () => {});

  // Mount-time auto-start fix (2026-09-17, D74 follow-up — live-testing
  // friction: the Product Owner kept tapping a physical tag while this ring
  // was still gray, landing on Android's own generic NFC dispatch instead
  // of Nahui). Extracted out of `handleScan` below into its own stable
  // `useCallback` closing over nothing but the refs/setters declared above
  // (never `current`/`commitTag` directly, both of which are only
  // meaningful after this component's `if (!current)` early return below) —
  // so its identity never changes across renders, an empty dependency array
  // is correct, and it's safe to call from two places without ever racing:
  // the mount effect immediately below, and `handleScan`'s own
  // `nfcSupported` branch (the manual-tap retry path a failed mount-time
  // attempt falls back to). `scanStartedRef` is the one guard shared by
  // both call sites — a session already starting or started makes either
  // caller a harmless no-op, so the two can never double-fire a second
  // concurrent `scan()`.
  const startScan = useCallback(() => {
    if (scanStartedRef.current) return Promise.resolve();
    scanStartedRef.current = true;
    const controller = new AbortController();
    nfcAbortRef.current = controller;
    return (async () => {
      try {
        const ndef = new window.NDEFReader!();
        ndef.onreading = (event) => {
          // `decision-log.md` D74 — keyed on the tag's own hardware UID
          // (`serialNumber`), never `message.records`: a factory-blank tag
          // fires `reading` with an empty `message` and must still resolve
          // correctly (Nahui never writes to it). An empty `serialNumber`
          // (spec-legal — "may be unavailable") is a genuine read failure,
          // routed through the same §3.16 feedback a bad physical read
          // already gets, never committed as a tag identifier.
          if (!event.serialNumber) {
            setFeedback({ kind: 'scan-failed' });
            return;
          }
          void handleTagResolvedRef.current(event.serialNumber);
        };
        ndef.onreadingerror = () => {
          // A single bad physical read — the session itself stays alive
          // and listening, so `nfcState` is untouched here (mirrors
          // `Selling.tsx`'s identical distinction).
          setFeedback({ kind: 'scan-failed' });
        };
        // Hangs until this listening session is actually established —
        // resolves once, then `onreading` fires for every subsequent tap,
        // one commit per physical tag, no further on-screen tap needed.
        await ndef.scan({ signal: controller.signal });
        // The browser has genuinely granted and begun the session now —
        // the one moment `NFCScanPrompt`'s pulsing "listening" ring is
        // actually honest.
        setNfcState('listening');
      } catch {
        // `scan()` itself rejected — permission denied, hardware
        // unavailable despite feature detection, or (mount-time call only)
        // a genuinely expired transient-activation window by the time this
        // effect ran — a failure of this specific attempt, not a
        // permanently wedged session: leave `scanStartedRef` un-set so the
        // next tap on the ring retries starting the session from scratch,
        // the exact same graceful fallback a failed manual tap already had
        // before this fix. The session itself never started —
        // `NFCScanPrompt`'s own `'error'` ring communicates that directly;
        // no separate ambient `scan-failed` feedback line here (that copy
        // is reserved for a per-tag misread mid-session, above).
        scanStartedRef.current = false;
        nfcAbortRef.current = null;
        setNfcState('error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mount-time auto-start — every real entry point into `AssignTags` is
  // itself a genuine user click/tap in a *different* component
  // (`CatalogView.tsx`'s toggle-ON auto-open, its own "[ N sin etiquetar ]"
  // resume tap, `RegisterMerchandise.tsx`'s post-save auto-entry),
  // immediately followed by a React state update that mounts this
  // component as a new instance — never a stale, untouched page. Chromium's
  // Web NFC permission check is a genuine wall-clock budget, not "must be
  // the literal synchronous call inside the click handler": `scan()`
  // requests the "nfc" permission via `PermissionService`, and the browser
  // process grants it only if `RenderFrameHost::HasTransientUserActivation()`
  // is still true at that moment — a 5-second window from the original
  // gesture (`kActivationLifespan`,
  // `third_party/blink/public/common/frame/user_activation_state.h`),
  // explicitly sized, per that file's own comment, "long enough to allow
  // network round trips even in a very slow connection." Confirmed by
  // reading Chromium's own current source directly (`ndef_reader.cc`'s
  // `scan()` → `PermissionServiceImpl`'s
  // `HasTransientUserActivation()` read, evaluated at IPC-handling time,
  // not at the original click → `NfcPermissionContext::DecidePermission`'s
  // `user_gesture` check), not reasoned about abstractly — no live
  // Chrome/Android device was available to physically confirm this in
  // addition, a gap disclosed here rather than silently assumed closed. A
  // React passive effect firing after a click-triggered mount lands within
  // single-digit-to-low-double-digit milliseconds for the two
  // synchronous-state-flip entry points (both `CatalogView.tsx` paths),
  // comfortably inside the 5-second budget; `RegisterMerchandise.tsx`'s
  // post-save entry fires after an *awaited* `commitLot` RPC — the one
  // entry point where a genuinely slow network could still exhaust the
  // budget before this effect runs. That case is exactly what `startScan`'s
  // own `catch`, above, exists for: falls back to `nfcState: 'error'`
  // ("Toca para intentar de nuevo"), never a stuck state. Guarded by the
  // same `scanStartedRef` as the manual-tap retry path (`startScan` itself)
  // — this effect and a tap on the ring can never race or double-fire.
  useEffect(() => {
    if (!nfcSupported) return;
    void startScan();
  }, [startScan]);

  useEffect(() => {
    return () => {
      nfcAbortRef.current?.abort();
    };
  }, []);

  // Live-hardware correctness fix (2026-09-17, visibility-hardening
  // follow-up), carried over unchanged in shape from the write-flow version
  // of this same fix, now re-targeted at the `scan()` session D74
  // introduced — the identical dead-session-while-hidden exposure
  // `Selling.tsx`/`MercanciaParaEsteEvento.tsx`'s own sibling fix already
  // closes: per Chromium's own documented behavior, Android's real
  // underlying reader-mode session is silently disabled the instant this
  // tab goes hidden (screen lock, app-switch), with no JS event this code
  // was listening for — and once past its first `scan()` resolution
  // (`nfcState === 'listening'`, the steady state most of a tagging session
  // spends in), there's no pending promise left for that silent death to
  // reject, so without this listener the ring kept honestly showing "ready,
  // acerca el tag" over a browser-level session Chrome had already killed
  // in the background.
  const wasSessionActiveBeforeHiddenRef = useRef(false);
  useEffect(() => {
    if (!nfcSupported) return;
    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        if (scanStartedRef.current) {
          nfcAbortRef.current?.abort();
          nfcAbortRef.current = null;
          scanStartedRef.current = false;
          wasSessionActiveBeforeHiddenRef.current = true;
          // Live-hardware correctness fix (2026-09-17, staleness-window
          // follow-up) — the teardown above is real and synchronous (the
          // session is genuinely dead the instant the tab hides), but
          // leaving `nfcState` untouched here left the ring rendering
          // `'listening'` for the entire time the tab stayed hidden,
          // correcting only later, whenever (if ever) the matching
          // `'visible'` transition fired. `'idle'`, not `'error'` — this
          // isn't a failure, the session was deliberately torn down because
          // the tab is backgrounded, the same "no active session, needs a
          // fresh tap" semantics `'idle'` already carries everywhere else in
          // this file.
          setNfcState('idle');
        }
      } else if (wasSessionActiveBeforeHiddenRef.current) {
        wasSessionActiveBeforeHiddenRef.current = false;
        // Redundant with the `'hidden'` branch's own `setNfcState('idle')`
        // above once that fix is in place for the case where `'hidden'`
        // already ran — kept anyway as a harmless no-op / defensive
        // backstop in case some device fires `'visible'` without a matching
        // prior `'hidden'` having gone through this exact code path, safer
        // than assuming perfect event pairing on every device.
        setNfcState('idle');
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
