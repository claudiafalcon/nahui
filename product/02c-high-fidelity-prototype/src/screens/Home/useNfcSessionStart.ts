import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { nfcCapable, nfcReadiness } from '../../domain/selectors';

/**
 * home.md §3.6a — Session-start-moment NFC branching, shared by `Idle.tsx`
 * (§3.4/§3.5) and `EventResume.tsx` (§3.6) rather than duplicated: both
 * reach the identical folded-in sub-step §2 describes ("not a new top-level
 * branch of its own... Steps 2 and 3... are the only two points... where a
 * Session doesn't yet exist and one is about to open"), so one hook decides
 * the one shared question — which of the four §3.6a variants (if any)
 * applies right now — and each caller only supplies its own copy/wiring.
 *
 * `'none'` is the common case (§3.4/§3.5/§3.6's own "otherwise
 * pixel-identical" screen) — Ready & capable & matching `defaultSellingMode`,
 * or a `buttons` default with nothing to disagree with.
 */
export type NfcSessionStartVariant =
  | 'none'
  | 'limited-ready'
  | 'not-ready'
  | 'capability-revoked'
  | 'ready-buttons-nudge';

export interface NfcSessionStartState {
  variant: NfcSessionStartVariant;
  /** Limited Ready's own local override (§3.6a: "flips the mode locally
   * (before the Session itself opens)") — `false` on every fresh mount,
   * never persisted (§6's footnote: it's a per-tap choice, not stored
   * state). Meaningless for every other variant; callers only read it when
   * `variant === 'limited-ready'`. */
  overrideToNfc: boolean;
  toggleOverride: () => void;
}

export function useNfcSessionStart(): NfcSessionStartState {
  const { state, markNfcAvailabilityNudgeShown } = useStore();

  // Resolved once, at this hook's own mount — matching §2's "evaluated
  // ambiently, on every Home open" (a fresh Idle/EventResume mount *is* a
  // Home open, per this codebase's own routing: both unmount whenever
  // Configuración, Asignar Tags, or a Session takes over, and remount fresh
  // on return). Frozen via `useState`'s lazy initializer rather than
  // recomputed on every render — load-bearing for `ready-buttons-nudge`
  // specifically: `markNfcAvailabilityNudgeShown()` below writes the exact
  // flag this variant's own condition reads, and without freezing the
  // initial read, that write's own resulting re-render would make the
  // mention disappear before Ana can read it. This is the same "capture the
  // moment, don't re-derive off a live flag the same action just flipped"
  // technique `reconcilePendingSubscriptionTier`'s own `landed` local state
  // (`SettingsScreen.tsx`) already established for an analogous
  // one-time-acknowledgment case. Freezing all four variants (not just this
  // one) keeps the rule uniform and matches "shown once per occurrence of
  // this Session-start moment" for the other three as well — an occurrence
  // is exactly one mount-to-unmount visit to this screen.
  const [variant] = useState<NfcSessionStartVariant>(() => {
    const business = state.business;
    if (!business) return 'none';
    const capable = nfcCapable(state);
    const readiness = nfcReadiness(state);

    if (business.defaultSellingMode === 'nfc') {
      if (!capable) return 'capability-revoked';
      if (readiness === 'not-ready') return 'not-ready';
      if (readiness === 'limited') return 'limited-ready';
      return 'none'; // Ready, capability intact, matching default — silent
    }
    // defaultSellingMode === 'buttons'
    if (capable && readiness === 'ready' && !business.nfcAvailabilityNudgeShown) {
      return 'ready-buttons-nudge';
    }
    return 'none';
  });

  const [overrideToNfc, setOverrideToNfc] = useState(false);

  // §3.6a's "shown once ever" mutator — fires exactly once, the render this
  // variant is first frozen as `'ready-buttons-nudge'` above. Empty deps:
  // one real mount, not every re-render or every identity change of the
  // store action itself (same convention `SettingsScreen.tsx`'s own
  // `reconcilePendingSubscriptionTier` effect already documents).
  useEffect(() => {
    if (variant === 'ready-buttons-nudge') markNfcAvailabilityNudgeShown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    variant,
    overrideToNfc,
    toggleOverride: () => setOverrideToNfc((v) => !v),
  };
}
