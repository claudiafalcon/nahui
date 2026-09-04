import { useEffect, useRef, useState, type ReactNode } from 'react';
import { track } from '@vercel/analytics';
import { useStore } from '../../domain/store';
import { businessForCurrentUser } from '../../domain/onboardingResolution';
import { DEMO_BUSINESS_DESCRIPTION, DEMO_BUSINESS_NAME, DEMO_SEED_LINES } from '../../domain/demoSeed';
import { markAccesoDmActive } from './accesoDmStorage';
import { acknowledgeDemoMode } from '../DemoMode/demoModeStorage';
import { AccesoDmPreparing } from './AccesoDmPreparing';

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
 * acceso-dm.md §2.1 — the runtime URL-detection entry route. As of
 * `decision-log.md` D52 (relocation), this is mounted only inside
 * `DemoModeGate.tsx`'s demo-campaign (`VITE_DEMO_MODE === 'true'`) branch,
 * wrapping `<DemoModeGateActive />` as `children` — never in the real-build
 * branch, which is a bare `<AppRouter />` with no import path to anything
 * under this folder at all (proven unreachable and stripped by Vite/
 * Rollup's dead-code elimination, the same mechanism `DemoModeGate.tsx`'s
 * own doc comment already describes for its other branch). This mirrors,
 * rather than reuses, `DemoModeGate.tsx`'s own build-time gating pattern:
 * the marker check below is still a genuinely new, second-stage runtime
 * check, evaluated *inside* an already build-gated branch — it runs ahead
 * of `DemoModeGateActive`'s own resolution (its own `children` prop), not
 * nested inside that resolution's `pass-through` branch, so a fresh device
 * with `?acceso=dm` never sees `DemoModeGateActive`'s Welcome screen
 * (`resolveGateState()`'s own `isDemoModeAcknowledged()` check would
 * otherwise say "no" for a fresh device and render Welcome first).
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
 * below gates on. When `false` — either the marker is absent, or a Business
 * already exists on this device (a returning Acceso DM merchant, or an
 * unrelated real session) — this component renders `children`
 * (`<DemoModeGateActive />`) unchanged, letting its own, completely
 * unmodified resolution decide Welcome vs. pass-through. This is what makes
 * §2.1 check 2's "marker never overrides an existing session" guarantee
 * hold structurally, not just by convention.
 */
export function AccesoDmGate({ children }: { children: ReactNode }) {
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

  // Analytics instrumentation (Product Owner-authorized, count-only,
  // reusing `ReminderBanner.tsx`'s exact `demo_*` event pattern one folder
  // over) — `acceso_dm_opened` fires once, at the moment the `?acceso=dm`
  // marker is detected, regardless of whether the auto-sequence actually
  // runs (`active`) or is skipped because a Business already exists on this
  // device (§2.1 check 2) — a returning visit still counts as "opened."
  // Same one-shot mount-guard shape as `demo_pass_through_reached`'s own
  // `passThroughFiredRef` — a plain `useRef` guard survives StrictMode's
  // dev-only double-invoke of mount effects (main.tsx) without double-firing.
  const openedFiredRef = useRef(false);
  useEffect(() => {
    if (!urlHasMarker || openedFiredRef.current) return;
    openedFiredRef.current = true;
    track('acceso_dm_opened');
  }, [urlHasMarker]);

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
      // §2.3 — `nahui-acceso-dm-active` written the moment the auto-sequence
      // begins, i.e. right before its first real write. Also acknowledges
      // Demo Mode itself (`demoModeStorage.ts`'s `nahui-demo-mode-
      // acknowledged`) in the same write — the architect-confirmed fix for a
      // state combination this relocation newly makes reachable: "Business
      // exists, but device never acknowledged Welcome." Without this, an
      // Acceso-DM-created Business that later revisits this build with no
      // marker (or a bookmark) would incorrectly resurface
      // `DemoModeGateActive`'s Welcome screen, since `resolveGateState()`
      // only ever consults this flag, never `businessForCurrentUser`. Both
      // are best-effort, matching `demoModeStorage.ts`'s own device-flag
      // convention: a failure here never blocks the domain sequence itself.
      flagWrittenRef.current = true;
      try {
        markAccesoDmActive();
        acknowledgeDemoMode();
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
    // `children` (`<DemoModeGateActive />`) takes over. Because
    // `acknowledgeDemoMode()` was already written above,
    // `DemoModeGateActive`'s own `resolveGateState()` now reads
    // `'pass-through'` and renders `ReminderBanner` directly — landing on
    // `onboarding.md §3.6` Variant C (via the unmodified `<AppRouter />`
    // `ReminderBanner` composes) with zero taps of her own, never Welcome.
  }

  // acceso-dm.md §2.3 — `ResultsGuidanceNudge` (composed inside
  // `ReminderBanner.tsx`, not here — see that file) self-gates on its own
  // persisted flag/domain reads. Rendering `children` unconditionally here,
  // on both the `active` and `!active` paths, is what lets a second visit —
  // after a Business already exists, marker inert — still resolve through
  // `DemoModeGateActive`'s pass-through branch and show the nudge once its
  // own three conditions hold.
  return <>{children}</>;
}
