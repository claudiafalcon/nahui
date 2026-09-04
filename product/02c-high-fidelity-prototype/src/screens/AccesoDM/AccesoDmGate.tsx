import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { businessForCurrentUser } from '../../domain/onboardingResolution';
import { DEMO_BUSINESS_DESCRIPTION, DEMO_BUSINESS_NAME, DEMO_SEED_LINES } from '../../domain/demoSeed';
import { markAccesoDmActive } from './accesoDmStorage';
import { AccesoDmPreparing } from './AccesoDmPreparing';
import { ResultsGuidanceNudge } from './ResultsGuidanceNudge';

/**
 * acceso-dm.md — illustrative, format-valid fixed credential (§2.1's own
 * note: `ui-designer` to finalize the literal value; format matches
 * `authentication.md §3.3`'s own 10-digit phone field, the only constraint
 * that exists at this fidelity). `_code` is intentionally unused by
 * `verifyOtp` (any 6-digit value already works, per its existing mock-
 * verification design) — kept as a real 6-digit literal anyway so this
 * reads as a genuine credential pair, not a placeholder.
 */
const ACCESO_DM_FIXED_PHONE = '5500000001';
const ACCESO_DM_FIXED_CODE = '000000';

type Step = 'verify' | 'onboard' | 'seed' | null;

/**
 * acceso-dm.md §2.1 — the runtime URL-detection entry route. Mounted by
 * `DemoModeGate.tsx` in place of the bare `<AppRouter />` it previously
 * rendered in a real (non-`VITE_DEMO_MODE`) build — deliberately not a reuse
 * of that file's own build-time gating pattern, since this route must exist
 * in the one real production build (§2.1's own framing, §7).
 *
 * Two checks, both evaluated exactly once, on this component's own initial
 * mount (lazy `useState` initializers, the same "no re-render before first
 * paint could see a different answer" shape `DemoModeGateActive.tsx`'s own
 * `resolveGateState()` already uses):
 * - `urlHasMarker` — the first runtime URL read anywhere in this codebase
 *   (§2.1's own framing).
 * - `businessExistedAtMount` — `businessForCurrentUser`, read once before
 *   the auto-sequence could ever run. Captured once, not re-derived every
 *   render: the auto-sequence's own `completeOnboarding` call legitimately
 *   changes what `businessForCurrentUser` returns, and that must never
 *   retroactively flip this gate mid-sequence (§2.1 check 2's own "not a new
 *   idempotency mechanism" framing).
 *
 * `active` (marker present AND no pre-existing Business) is what everything
 * below gates on. When `false` — the overwhelmingly common case, always —
 * this component does nothing but render `<AppRouter />` (plus the nudge,
 * which self-gates on its own persisted flag, see `ResultsGuidanceNudge.tsx`)
 * and `authentication.md §2.1`/`onboarding.md §2.1` resolve exactly as they
 * already do today.
 */
export function AccesoDmGate() {
  const { state, verifyOtp, completeOnboarding, setBusinessIdentity, commitLot } = useStore();

  const [urlHasMarker] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('acceso') === 'dm';
    } catch {
      return false;
    }
  });
  const [businessExistedAtMount] = useState(() => businessForCurrentUser(state) != null);
  const active = urlHasMarker && !businessExistedAtMount;

  const [failed, setFailed] = useState(false);

  // Guards against firing the same domain write twice against the same
  // (stale, pre-re-render) state snapshot — the same class of double-fire
  // React's `<StrictMode>` (main.tsx) causes for a plain mount effect that
  // `ReminderBanner.tsx`'s own `passThroughFiredRef` already guards against
  // one folder over. `lastDispatchedStepRef` is signature-based rather than
  // a one-shot boolean, since this effect legitimately needs to fire again
  // — for a genuinely new step — on every subsequent render as the sequence
  // progresses; it only ever suppresses a second call for the exact same
  // step against a state that hasn't actually advanced yet.
  const lastDispatchedStepRef = useRef<Step>(null);
  const flagWrittenRef = useRef(false);

  useEffect(() => {
    if (!active || failed) return;

    // §2.1 step 3 — resolved fresh from current `AppState` every render,
    // the same pure-function-of-state discipline `OnboardingFlow.tsx`'s own
    // resolution logic already uses. This is what makes §2.1 step 5's
    // retry-safety guard fall out for free: re-entering this effect after
    // `Reintentar` (§3.2) re-derives `step` from whatever's actually true in
    // `state` right now, so a step already completed before a throw is
    // never re-dispatched — steps c/d specifically are only ever reached
    // together, and only when `state.products.length === 0`, exactly §2.1
    // step 5 / §8 item 2's own fix (`commitLot` carries no idempotency
    // guard of its own, unlike `completeOnboarding`).
    const verified = state.currentUser?.phoneVerifiedAt != null;
    const business = businessForCurrentUser(state);
    let step: Step = null;
    if (!verified) step = 'verify';
    else if (!business) step = 'onboard';
    else if (state.products.length === 0) step = 'seed';

    if (step === null) return; // sequence already complete — render falls through to <AppRouter /> below
    if (lastDispatchedStepRef.current === step) return; // already dispatched this exact step against this state
    lastDispatchedStepRef.current = step;

    if (!flagWrittenRef.current) {
      // §2.3 — written the moment the auto-sequence begins, i.e. right
      // before its first real write. Best-effort, matching
      // `demoModeStorage.ts`'s own device-flag convention: a failure here
      // never blocks the domain sequence itself, it only means the
      // results-guidance nudge never shows on this device.
      flagWrittenRef.current = true;
      try {
        markAccesoDmActive();
      } catch {
        // best-effort — see comment above
      }
    }

    try {
      if (step === 'verify') {
        verifyOtp(ACCESO_DM_FIXED_PHONE, ACCESO_DM_FIXED_CODE);
      } else if (step === 'onboard') {
        completeOnboarding('demo');
      } else {
        // step === 'seed' — c and d always run together, gated as one unit
        // on `state.products.length === 0` above (§2.1 step 5's own
        // resolved reading: `setBusinessIdentity` is harmless to re-run,
        // only `commitLot` actually needs the guard, so both are gated by
        // the same check rather than two separate ones).
        setBusinessIdentity({ name: DEMO_BUSINESS_NAME, description: DEMO_BUSINESS_DESCRIPTION });
        commitLot(DEMO_SEED_LINES);
      }
    } catch {
      // §2.1 step 5 / §3.2 — defensive fallback. Never actually reached in
      // this build (none of the four writes can throw here: all are
      // synchronous in-memory `setState` calls; the one real failure class
      // this guards against, a `localStorage` write failing in a
      // restrictive browsing context, is already caught one layer up inside
      // `StoreProvider`'s own persistence effect, which never re-throws) —
      // the same disclosed-not-wired convention already established for
      // this codebase's other sync-failure states.
      lastDispatchedStepRef.current = null; // allow Reintentar to re-dispatch this same step
      setFailed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- store actions
    // are recreated every render; gating on `state`/`active`/`failed` is
    // what actually controls when this effect needs to re-run.
  }, [active, failed, state]);

  if (active && failed) {
    return (
      <AccesoDmPreparing
        error
        onRetry={() => {
          setFailed(false);
        }}
      />
    );
  }

  if (active) {
    const verified = state.currentUser?.phoneVerifiedAt != null;
    const business = businessForCurrentUser(state);
    const sequenceComplete = verified && business != null && state.products.length > 0;
    if (!sequenceComplete) {
      return <AccesoDmPreparing />;
    }
    // §2.2 — falls through below, identical to the `!active` branch: once
    // the sequence is done, this component's own responsibility ends and
    // `<AppRouter />`'s completely unmodified resolution takes over,
    // landing on `onboarding.md §3.6` Variant C with zero taps of her own.
  }

  // acceso-dm.md §2.3 — `ResultsGuidanceNudge` self-gates on its own
  // persisted flag/domain reads and renders `<AppRouter />` internally as
  // its own sibling-wrapped child (mirroring `ReminderBanner.tsx`'s own
  // shape one folder over); mounting it unconditionally here, on both the
  // `active` and `!active` paths, is what lets a second visit — after a
  // Business already exists, marker inert — still show the nudge once its
  // own three conditions hold.
  return <ResultsGuidanceNudge />;
}
