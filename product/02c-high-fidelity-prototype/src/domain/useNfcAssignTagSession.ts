import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import { NFC_SIMULATION_ENABLED, nfcSupported } from './nfcSupport';

/**
 * The live Web NFC listening session behind `inventory.md` §3.14's Asignar
 * Tags queue — extracted out of `AssignTags.tsx` (2026-09-18 architecture
 * fix, `decision-log.md` D74/D75 follow-up) so it can be **started from a
 * click handler in a different component than the one that eventually
 * displays the listening ring.**
 *
 * **Why this had to move out of `AssignTags.tsx`'s own component state.**
 * Every real entry point into Asignar Tags via `inventory.md` §3.4's fifth
 * zone (toggle-ON auto-open) or sixth zone (the `[ N sin etiquetar ]` resume
 * tap) is a genuine user tap in `CatalogView.tsx` — a *different* component
 * — immediately followed by a React state update that unmounts `CatalogView`
 * and mounts `AssignTags` as a brand-new instance. Starting `scan()` from
 * `AssignTags`'s own mount effect (the previous shape, `28a4963`/D74)
 * inherits Chromium's transient-activation window rather than being called
 * inside the literal tap, and on a real device that inheritance was not
 * landing reliably — the Product Owner kept seeing the gray "Toca para
 * activar" idle state instead of an auto-started session. Per her own
 * explicit instruction: "the action that semantically starts the NFC
 * operation should start listening," full stop, no intermediate activation
 * UI, ever — matching how `Selling.tsx`'s "Leer con NFC" and
 * `MercanciaParaEsteEvento.tsx`'s scanner-open button already call their own
 * `handleScan()` directly inside the same `onClick`, no navigation, no new
 * component mount, no cross-component gap at all.
 *
 * This hook is called exactly once, at `App.tsx`'s own top level (alongside
 * `assignTagsEntry`/`assignTagsSegmentTotals`, the identical reason this
 * codebase already lifts those two out of `AssignTags.tsx` for the identical
 * "started/frozen in one place, consumed after navigating elsewhere"
 * reason) — so the live `NDEFReader` session, its `onreading`/
 * `onreadingerror` handlers, its `AbortController`, and the
 * `'idle' | 'listening' | 'error' | 'unsupported'` state describing it all
 * survive `CatalogView` unmounting and `AssignTags` mounting in its place.
 * `CatalogView.tsx` calls `startScan()` synchronously inside its own tap
 * handlers (the real fix); `AssignTags.tsx` reads the already-started (or
 * already-starting) session from this same object, and additionally keeps
 * its own mount-time `startScan()` call as a fallback for entry points that
 * don't originate in `CatalogView.tsx` (the Lot-scoped entry via
 * `RegisterMerchandise.tsx`'s post-save auto-entry) — see that mount effect's
 * own doc comment for why that one path still needs it. `scanStartedRef`
 * inside `startScan` below makes every one of these call sites — a genuine
 * new start, or a redundant one arriving after the session's already live —
 * safe to call unconditionally, without ever double-firing a second
 * concurrent `scan()`.
 *
 * **Web NFC mechanics themselves are unchanged from D74/D75** — this is a
 * relocation of *when and where* `scan()` is invoked and where its live
 * state lives, not a rewrite of the mechanics: `serialNumber`-keyed reads,
 * no `write()` (D74), continuous multi-tag scanning via one long-lived
 * session, and the `visibilitychange` hardening (D75) all carry over in
 * shape, just hosted here instead of duplicated per real-hardware NFC
 * surface. **Root cause 1 from D75 — Chromium resolves `scan()`'s success
 * promise before Android's reader mode has actually finished reconfiguring,
 * so the pink "listening" ring can never be a 100% guarantee against
 * Android's own generic tag dispatch — is a platform limitation, accepted
 * there, and unaffected by this relocation.**
 */

/** `inventory.md` §3.15/§3.16 feedback, shared by every consumer of this
 * session (today, only `AssignTags.tsx`) — lifted alongside the session
 * itself rather than left local, since the persistent `ndef.onreading`/
 * `onreadingerror` handlers below can fire (a scan-failed misread, an
 * already-assigned tag) during the brief window after `CatalogView.tsx`
 * starts a session but before `AssignTags` has mounted to consume it. */
export type NfcAssignScanFeedback = { kind: 'already-assigned' } | { kind: 'scan-failed' } | null;

export type NfcAssignSessionState = 'idle' | 'listening' | 'error' | 'unsupported';

export interface NfcAssignSession {
  /** `NFCScanPrompt`'s own reactive ring state. `'unsupported'` from mount
   * and stays there on a production build with no real Web NFC and no
   * simulation allowed (`nfcUnavailable`, `nfcSupport.ts`); permanently
   * `'listening'` on a dev/demo build without real Web NFC
   * (`NFC_SIMULATION_ENABLED`) — no real session exists there for any state
   * transition below to describe. */
  state: NfcAssignSessionState;
  feedback: NfcAssignScanFeedback;
  setFeedback: (feedback: NfcAssignScanFeedback) => void;
  /** Real Web NFC only (`nfcSupported`) — a no-op `Promise.resolve()`
   * everywhere else. Safe to call unconditionally, from any component, any
   * number of times: `scanStartedRef` (internal) guards the *dispatch*, so
   * a session already starting or already listening makes every call past
   * the first a harmless no-op — this is exactly what lets both
   * `CatalogView.tsx` (the real fix, called synchronously inside a tap
   * handler) and `AssignTags.tsx` (a mount-time fallback, see that
   * component's own doc comment) call this same function without ever
   * racing or double-firing a second concurrent `scan()`. */
  startScan: () => Promise<void>;
  /** Tears the live session down: aborts the in-flight/established
   * `scan()`, resets the internal dispatch guard so a later `startScan()`
   * call can genuinely start fresh, and (real hardware only) returns
   * `state` to `'idle'`. Called from `AssignTags.tsx`'s own unmount cleanup
   * effect — every "leaving Asignar Tags" transition (`Terminar después`,
   * a completed queue) unmounts `AssignTags`, `InventoryScreen.tsx`'s own
   * discriminated `InventoryView` branching — so that single cleanup site
   * covers every real teardown case, the same coverage the previous
   * component-scoped cleanup effect already had. */
  stopSession: () => void;
  /** Always reassigned, every render, to whichever mounted consumer's own
   * `commitTag` should resolve the next physical tag read — today, always
   * `AssignTags.tsx`'s. A harmless no-op while nothing is mounted to
   * consume it (the brief gap between `CatalogView.tsx` starting a session
   * and `AssignTags` mounting to take over) — see `AssignTags.tsx`'s own
   * reassignment for why a persistent `onreading` handler needs this
   * indirection at all rather than closing over a single fixed function. */
  handleTagResolvedRef: MutableRefObject<(tagId: string) => Promise<void>>;
}

export function useNfcAssignTagSession(): NfcAssignSession {
  const [state, setState] = useState<NfcAssignSessionState>(
    nfcSupported ? 'idle' : NFC_SIMULATION_ENABLED ? 'listening' : 'unsupported',
  );
  const [feedback, setFeedback] = useState<NfcAssignScanFeedback>(null);

  // Real Web NFC read path only (`nfcSupported`) — `scanStartedRef` guards
  // the *dispatch* (a ref, not state, so two call sites arriving before
  // React flushes can't fire a second concurrent `scan()`); `nfcAbortRef`
  // is the `AbortController` for that session's `scan()` call.
  const scanStartedRef = useRef(false);
  const nfcAbortRef = useRef<AbortController | null>(null);
  const handleTagResolvedRef = useRef<(tagId: string) => Promise<void>>(async () => {});

  // 2026-09-18 real-device fix, carried over from `AssignTags.tsx` unchanged
  // in shape — every mutation of `state`/the ref pair below first checks
  // `nfcAbortRef.current === controller`, i.e. "is this specific attempt
  // still the current one." A superseded attempt's own late-arriving
  // `AbortError` rejection (asynchronous, can settle after a fresher
  // `startScan()` call has already reset these refs and started a new
  // session) must never clobber whatever the current, live attempt has
  // already done.
  const startScan = useCallback((): Promise<void> => {
    if (!nfcSupported) return Promise.resolve();
    if (scanStartedRef.current) return Promise.resolve();
    scanStartedRef.current = true;
    // A genuine new start (not a redundant no-op call arriving after the
    // session's already live) — matches the previous per-mount
    // `useState<ScanFeedback>(null)` initializer's "fresh state every time
    // a new tagging session begins" semantics, now that `feedback` outlives
    // any one consumer's own mount.
    setFeedback(null);
    const controller = new AbortController();
    nfcAbortRef.current = controller;
    return (async () => {
      try {
        const ndef = new window.NDEFReader!();
        ndef.onreading = (event) => {
          if (nfcAbortRef.current !== controller) return;
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
          if (nfcAbortRef.current !== controller) return;
          // A single bad physical read — the session itself stays alive
          // and listening, so `state` is untouched here.
          setFeedback({ kind: 'scan-failed' });
        };
        // Hangs until this listening session is actually established —
        // resolves once, then `onreading` fires for every subsequent tap,
        // one commit per physical tag, no further on-screen tap needed.
        await ndef.scan({ signal: controller.signal });
        if (nfcAbortRef.current !== controller) return;
        // The browser has genuinely granted and begun the session now —
        // the one moment `NFCScanPrompt`'s pulsing "listening" ring is
        // actually honest.
        setState('listening');
      } catch {
        if (nfcAbortRef.current !== controller) return;
        // `scan()` itself rejected — permission denied, hardware
        // unavailable despite feature detection, or a genuinely expired/
        // never-granted transient-activation window. A failure of this
        // specific attempt, not a permanently wedged session: leave
        // `scanStartedRef` un-set so the next tap on the ring (or a fresh
        // `CatalogView.tsx` entry) retries starting the session from
        // scratch.
        scanStartedRef.current = false;
        nfcAbortRef.current = null;
        setState('error');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSession = useCallback(() => {
    nfcAbortRef.current?.abort();
    nfcAbortRef.current = null;
    scanStartedRef.current = false;
    // Never touches `state` on a browser with no real session to describe
    // (`'unsupported'` stays put; the simulated permanently-`'listening'`
    // look stays put too — no real dead-session hazard exists for it to
    // misrepresent).
    if (nfcSupported) setState('idle');
  }, []);

  // Live-hardware correctness fix (`decision-log.md` D75), carried over
  // unchanged in shape from `AssignTags.tsx` — now scoped to this hook's own
  // lifetime (in practice, the whole app's lifetime, since it's called once
  // at `App.tsx`'s top level) rather than reinstalled on every `AssignTags`
  // mount/unmount, since the session itself can now legitimately be alive
  // while `AssignTags` isn't mounted at all (the brief `CatalogView.tsx` →
  // `AssignTags` gap). Per Chromium's own documented behavior, Android's
  // real underlying reader-mode session is silently disabled the instant
  // this tab goes hidden (screen lock, app-switch), with no JS event this
  // code was listening for — and once past its first `scan()` resolution
  // (`state === 'listening'`), there's no pending promise left for that
  // silent death to reject, so without this listener the ring kept
  // honestly showing "ready, acerca el tag" over a browser-level session
  // Chrome had already killed in the background.
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
          // `'idle'`, not `'error'` — this isn't a failure, the session was
          // deliberately torn down because the tab is backgrounded, the
          // same "no active session, needs a fresh tap" semantics `'idle'`
          // already carries everywhere else.
          setState('idle');
        }
      } else if (wasSessionActiveBeforeHiddenRef.current) {
        wasSessionActiveBeforeHiddenRef.current = false;
        // Redundant with the `'hidden'` branch's own `setState('idle')`
        // above once that fix is in place — kept anyway as a harmless
        // no-op / defensive backstop in case some device fires `'visible'`
        // without a matching prior `'hidden'` having gone through this
        // exact code path.
        setState('idle');
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return { state, feedback, setFeedback, startScan, stopSession, handleTagResolvedRef };
}
