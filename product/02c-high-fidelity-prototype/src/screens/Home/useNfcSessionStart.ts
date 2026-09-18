import { useState } from 'react';
import { useStore } from '../../domain/store';
import { nfcCapable, nfcReadiness } from '../../domain/selectors';

/**
 * home.md §3.6a — Session-start-moment NFC branching, shared by `Idle.tsx`
 * (§3.4/§3.5) and `EventResume.tsx` (§3.6) rather than duplicated: both
 * reach the identical folded-in sub-step §2 describes ("not a new top-level
 * branch of its own... Steps 2 and 3... are the only two points... where a
 * Session doesn't yet exist and one is about to open"), so one hook decides
 * the one shared question — which of the three §3.6a variants (if any)
 * applies right now — and each caller only supplies its own copy/wiring.
 *
 * `'none'` is the common case (§3.4/§3.5/§3.6's own "otherwise
 * pixel-identical" screen) — Ready & capable & matching `defaultSellingMode`,
 * or a `buttons` default with nothing to disagree with.
 *
 * **A former fourth variant, `'ready-buttons-nudge'`, is retired
 * (2026-09-17, `decision-log.md` D72)** — it used to nudge a `buttons`-mode
 * Paid merchant, once her tagged inventory cleared NFC Readiness, toward
 * `settings.md`'s "Cambiar a vender con tags." D72 retires that action
 * outright (whole-catalog `nfc` mode is no longer self-service-enterable),
 * so this branch has nowhere left to route her — removed rather than
 * repointed, since its own trigger condition can no longer arise for a
 * merchant who hasn't already turned `Business.nfcPerProductEnabled` on
 * (tagging any unit at all requires that field to already be true,
 * `decision-log.md` D71). `Business.nfcAvailabilityNudgeShown`
 * (`decision-log.md` D29) is a dead field as of this change — kept in the
 * schema (never delete historical data), no longer read or written here.
 */
export type NfcSessionStartVariant = 'none' | 'limited-ready' | 'not-ready' | 'capability-revoked';

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
  const { state } = useStore();

  // Resolved once, at this hook's own mount — matching §2's "evaluated
  // ambiently, on every Home open" (a fresh Idle/EventResume mount *is* a
  // Home open, per this codebase's own routing: both unmount whenever
  // Configuración, Asignar Tags, or a Session takes over, and remount fresh
  // on return). Frozen via `useState`'s lazy initializer rather than
  // recomputed on every render — matches "shown once per occurrence of this
  // Session-start moment" for all three variants: an occurrence is exactly
  // one mount-to-unmount visit to this screen.
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
    // defaultSellingMode === 'buttons' — always 'none' now (`decision-log.md`
    // D72 retires the former fourth, ready-buttons-nudge variant this branch
    // used to sometimes resolve to; see this file's own top-of-file comment).
    return 'none';
  });

  const [overrideToNfc, setOverrideToNfc] = useState(false);

  return {
    variant,
    overrideToNfc,
    toggleOverride: () => setOverrideToNfc((v) => !v),
  };
}
