import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { track } from '@vercel/analytics';
import { AppRouter } from '../../AppRouter';
import { useReceiptScreenActive } from './receiptScreenSignal';
import { Sheet } from '../../components/Sheet/Sheet';
import { Button } from '../../components/Button/Button';
import { RestartFailed } from './RestartFailed';
import { restartDemo } from './restartDemo';
import { useStore } from '../../domain/store';
import { businessForCurrentUser, pathFromCapabilities } from '../../domain/onboardingResolution';
import styles from './ReminderBanner.module.css';

const QUESTIONNAIRE_URL = 'https://forms.gle/ZZhtJEfee3viWY1h8';

type RestartState = 'idle' | 'confirming' | 'failed';

/**
 * demo-mode.md §2.3/§3.6 — the persistent, session-wide Form-reminder
 * banner: one full-width, always-tappable, non-dismissible primary row
 * (unchanged since 2026-08-18's first pass) plus a new slim, asymmetric
 * secondary line beneath it (same-day revision, `ux-critic` M1/M2) — never
 * a second full-width row — carrying, on its left side, the passive "Modo
 * demo" state label and the real questionnaire time estimate as one
 * continuous run of static text ("Modo demo · cuestionario: 8-12 min",
 * added 2026-08-19 — §2.3 check 4/§3.6) and, on its right, the "Reiniciar
 * demo" control (§2.4/§3.7/§3.8, added 2026-08-18) as a small, corner-
 * positioned tap target sharing that line. The label carries no styling of
 * its own that would set it apart from the time estimate beside it — both
 * are one static text node, never a separate bordered/pill-shaped element
 * (§3.6's explicit flag to `ui-designer`). On narrow viewports (and
 * occasionally default/wide ones too, now that the fuller text is longer),
 * this left-side text wraps naturally onto a second line within row 2's own
 * space — row 2 grows taller, never a new row — while "Reiniciar demo"
 * stays anchored at its fixed corner position. Both rows composite above
 * whichever Merchant Application screen the *unmodified* `<AppRouter />` is
 * currently resolving to, for the entire `pass-through` duration.
 *
 * Mounted as this component from `DemoModeGateActive.tsx`'s `pass-through`
 * branch — a sibling to `<AppRouter />`, never a change inside it
 * (Architecture Review §8 item 2's outer-wrapper shape, the same pattern
 * `DemoModeGateActive` itself already uses one layer up). This is the only
 * place in the whole feature that composes the banner with the real app;
 * `AppRouter.tsx` and every screen inside it stay untouched, save for the
 * one route-level signal call `HomeScreen.tsx` reports on its own already-
 * known `ui.kind` (`receiptScreenSignal.ts`, §8 item 7).
 *
 * §2.3 check 1 (only ever mounted once `pass-through` begins, never on
 * this document's own §3.1-§3.5 screens) is satisfied structurally: nothing
 * outside `DemoModeGateActive`'s `pass-through` branch ever renders this
 * component.
 *
 * §2.3 check 2's one named exception (`home.md §3.8f`, the full-viewport
 * digital receipt) is realized here: while `useReceiptScreenActive()` is
 * true, neither row renders *and* the space normally reserved for them
 * above `.app-shell` collapses back to zero — the receipt screen stays
 * exactly as header-less/full-viewport as `home.md` itself already
 * specifies, with no demo-only residue. The restart control inherits this
 * same exception automatically, since it's part of the same banner
 * component — no separate exception logic exists for it (§2.4 step 1).
 *
 * Row 1 has no dismiss control, no progressive/stateful visual change on tap
 * (§10) — tapping only opens the questionnaire in a new tab; its own render
 * output never changes as a result. Row 2's restart control always opens the
 * identical confirmation dialog (§3.7, below), never a stateful variant.
 *
 * §2.5.2's three build-authorized funnel events are also observed from this
 * component — the sole mount point, same "sibling, never inside" discipline
 * as everything else here. None of them edit a Merchant Application
 * component to add themselves:
 * - `demo_pass_through_reached` fires once, on this component's own first
 *   render — it covers both routes into `pass-through` (§2.1) without
 *   distinguishing which reached it, since neither route does anything but
 *   mount this same component.
 * - `demo_otp_completed` is an external observer of `state.currentUser?.
 *   phoneVerifiedAt` via `useStore()` — no edit to `CodeStep.tsx`/
 *   `AuthenticationFlow.tsx`. Guarded so it only fires on an actual
 *   null→set transition witnessed during this mount, never on a value
 *   already set when this component first mounted (a resumed/reloaded
 *   session that skips straight past OTP).
 * - `demo_onboarding_completed` is an external observer of
 *   `business.onboardingAcknowledged` via `useStore()` — no edit to
 *   `OnboardingFlow.tsx`/`TodoListo.tsx`. Same not-already-true-at-mount
 *   guard as above, plus its one payload property (`path`) derived through
 *   the existing `pathFromCapabilities` domain utility, never re-derived
 *   here.
 *
 * §2.5.3's two further events (added 2026-08-19, build-authorized) are
 * observed here too — same mount point, same external-observer discipline:
 * - `demo_sale_completed` is an external observer of `state.sales`, watching
 *   for any `Sale.status` transitioning to `'finalized'` (`finalizeSale()`,
 *   `store.tsx:887-945`). Unlike the four events above, this is not a
 *   one-shot session latch — a participant may finalize several Sales in one
 *   walkthrough, each a distinct engagement data point. A `Set` of already-
 *   counted Sale IDs is seeded, during this component's first render (not
 *   inside the effect, so the effect's own first run never double-counts
 *   whatever was already `'finalized'` before this component mounted — the
 *   same "not-already-true-at-mount" shape as the other four events, adapted
 *   from a one-shot boolean to a per-ID Set since this event is legitimately
 *   repeatable), with whatever Sale IDs are already `'finalized'` at that
 *   moment. Every later render then fires once for each Sale ID newly
 *   observed crossing into `'finalized'`.
 * - `demo_paid_plan_activated_midsession` is an external observer of
 *   `subscriptionTier`, resolved via `businessForCurrentUser` (the same
 *   resolution `demo_onboarding_completed` already uses, not `state.business`
 *   directly). The "saw non-paid" arming flag is deliberately never set on a
 *   `null` Business (the pre-Onboarding state) — only on a *resolved,
 *   non-null* Business whose `subscriptionTier !== 'paid'` — because
 *   `completeOnboarding()` writes `subscriptionTier: 'paid'` directly, with
 *   no intermediate free-tier Business, for both the Paid and "Ver un
 *   ejemplo" onboarding paths; arming on `null` would false-fire this event
 *   the instant either of those two routine paths completes Onboarding (a
 *   real edge case `reviewer` caught during design, corrected before build).
 *   Repeatable, same shape as `demo_sale_completed` — the arming flag resets
 *   after each observed paid transition.
 */
export function ReminderBanner() {
  const receiptActive = useReceiptScreenActive();
  const [restartState, setRestartState] = useState<RestartState>('idle');
  const shellRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const { state } = useStore();

  // §2.5.2 `demo_pass_through_reached` — fires once, on this component's own
  // first render. The `useRef` guard (rather than a bare empty-deps
  // `useEffect`) is what keeps this to exactly one call even under
  // StrictMode's dev-only double-invoke of mount effects (main.tsx) — the
  // ref survives that simulated remount because it's the same component
  // instance, so the second invocation's guard correctly no-ops.
  const passThroughFiredRef = useRef(false);
  useEffect(() => {
    if (passThroughFiredRef.current) return;
    passThroughFiredRef.current = true;
    track('demo_pass_through_reached');
  }, []);

  // §2.5.2 `demo_otp_completed` — external observer of `phoneVerifiedAt`,
  // read fresh from the shared store on every render; never written here.
  // `sawUnverifiedRef` only becomes true once this component has actually
  // observed the unverified (null) state, so a device that resumes straight
  // into an already-verified session never fires this — only a real
  // null→set transition witnessed live does.
  const sawUnverifiedRef = useRef(false);
  const otpFiredRef = useRef(false);
  useEffect(() => {
    const verifiedAt = state.currentUser?.phoneVerifiedAt ?? null;
    if (verifiedAt == null) {
      sawUnverifiedRef.current = true;
      return;
    }
    if (otpFiredRef.current || !sawUnverifiedRef.current) return;
    otpFiredRef.current = true;
    track('demo_otp_completed');
  }, [state.currentUser?.phoneVerifiedAt]);

  // §2.5.2 `demo_onboarding_completed` — external observer of
  // `business.onboardingAcknowledged`, resolved the same way `OnboardingFlow`
  // itself resolves "the" business (`businessForCurrentUser`, not
  // `state.business` directly — see that function's own doc comment).
  // Same not-already-true-at-mount guard as the OTP observer above.
  const sawUnacknowledgedRef = useRef(false);
  const onboardingFiredRef = useRef(false);
  useEffect(() => {
    const business = businessForCurrentUser(state);
    const acknowledged = business?.onboardingAcknowledged ?? false;
    if (!acknowledged) {
      sawUnacknowledgedRef.current = true;
      return;
    }
    if (onboardingFiredRef.current || !sawUnacknowledgedRef.current || !business) return;
    onboardingFiredRef.current = true;
    track('demo_onboarding_completed', { path: pathFromCapabilities(business) });
  }, [state]);

  // §2.5.3 `demo_sale_completed` — external observer of `state.sales`,
  // watching for any Sale crossing into `'finalized'`. Repeatable, not a
  // one-shot latch: a `Set` of already-counted Sale IDs, seeded once during
  // this component's own first render (lazy ref init — a deliberate
  // exception to "state only changes in effects," safe here because it's a
  // pure, synchronous read of whatever is already in `state.sales`, and it
  // runs identically under StrictMode's dev-only double-render since the
  // guard is "only seed if still `undefined`"). Seeding here, not inside the
  // effect below, is what keeps a mid-session reload from inflating the
  // count with Sales that were already `'finalized'` before this observer
  // ever mounted.
  const countedSaleIdsRef = useRef<Set<string>>();
  if (countedSaleIdsRef.current === undefined) {
    countedSaleIdsRef.current = new Set(
      state.sales.filter((sa) => sa.status === 'finalized').map((sa) => sa.id),
    );
  }
  useEffect(() => {
    const counted = countedSaleIdsRef.current!;
    for (const sale of state.sales) {
      if (sale.status === 'finalized' && !counted.has(sale.id)) {
        counted.add(sale.id);
        track('demo_sale_completed');
      }
    }
  }, [state.sales]);

  // §2.5.3 `demo_paid_plan_activated_midsession` — external observer of
  // `subscriptionTier`, resolved via `businessForCurrentUser` (same
  // resolution the onboarding observer above uses). The "saw free" arming
  // flag is set only when a resolved, non-null Business exists whose
  // `subscriptionTier !== 'paid'` — never on a `null` Business (pre-
  // Onboarding), which is what would otherwise false-fire this event the
  // instant either the Paid or "Ver un ejemplo" onboarding path completes
  // (both write `subscriptionTier: 'paid'` directly, with no intermediate
  // free-tier Business — the exact edge case `reviewer` caught in design).
  // A Business already `'paid'` at mount never arms this flag either, so a
  // resumed/reloaded already-paid session correctly never fires — the same
  // not-already-true-at-mount guarantee the other events give via an
  // explicit "already true" check. Repeatable: the flag resets after each
  // observed free→paid transition, same shape as `demo_sale_completed`.
  const sawFreeRef = useRef(false);
  useEffect(() => {
    const business = businessForCurrentUser(state);
    if (business == null) return; // never arm on a null Business
    if (business.subscriptionTier !== 'paid') {
      sawFreeRef.current = true;
      return;
    }
    if (!sawFreeRef.current) return; // no free→paid transition actually witnessed live
    sawFreeRef.current = false;
    track('demo_paid_plan_activated_midsession');
  }, [state]);

  // `.shell`'s own `--demo-banner-height` custom property (ReminderBanner
  // .module.css) previously carried a single hand-estimated constant
  // (84px). As of 2026-08-19, row 2's own left-side text ("Modo demo ·
  // cuestionario: 8-12 min") can wrap onto a second line — on narrow
  // viewports, and occasionally on default/wide ones too — which grows the
  // banner's real rendered height beyond that fixed estimate. Since
  // `.app-shell`'s reserved `padding-top` reads this same custom property
  // (`.withBanner :global(.app-shell)`), a stale constant would leave the
  // fixed-position banner overlapping the top of whatever screen is
  // underneath exactly when row 2 wraps — the same risk `demo-mode.md`
  // §3.6's own chrome-accounting paragraph flags for `ui-designer` to
  // verify, not assume fine. Measuring the banner's actual rendered height
  // and writing it back onto `.shell` keeps the reserved space correct in
  // every state (unwrapped, wrapped on narrow, wrapped on default/wide),
  // instead of hand-tuning a second constant for the wrapped case.
  useLayoutEffect(() => {
    const shellEl = shellRef.current;
    const bannerEl = bannerRef.current;
    if (!shellEl || !bannerEl) return;
    const observer = new ResizeObserver(([entry]) => {
      const height = Math.ceil(entry.contentRect.height);
      shellEl.style.setProperty('--demo-banner-height', `${height}px`);
    });
    observer.observe(bannerEl);
    return () => observer.disconnect();
  }, [receiptActive, restartState]);

  function attemptRestart() {
    try {
      // §2.4 step 3 — clears both storage keys, then forces a full reload;
      // control never returns here on success (the page is navigating away).
      restartDemo();
    } catch {
      // §2.4 step 4 — the clear operation itself failed outright. No reload
      // is attempted against a partially-cleared/unknown storage state.
      setRestartState('failed');
    }
  }

  if (restartState === 'failed') {
    // §3.8 — a full replacement of this component's own output, the same
    // "defensive fallback replaces the whole screen" shape §3.5's
    // `DemoLoadError` already uses one layer up. Nothing here is nested
    // inside `AppRouter`'s own `app-shell` wrapper, so this owns one itself.
    return (
      <div className="app-shell">
        <RestartFailed onRetry={attemptRestart} />
      </div>
    );
  }

  return (
    <div ref={shellRef} className={`${styles.shell} ${receiptActive ? '' : styles.withBanner}`}>
      {!receiptActive && (
        <div ref={bannerRef} className={styles.banner}>
          <button
            type="button"
            className={styles.row1}
            onClick={() => {
              // §13.5 fix — cheap, count-only click event on the existing
              // banner's questionnaire row, so the 96-views→3-responses
              // funnel can be split into "did she tap the CTA?" vs. "did
              // she bounce off the Form itself?" No personal data, no free
              // text, fired alongside (never blocking) the real navigation.
              track('demo_questionnaire_cta_click');
              window.open(QUESTIONNAIRE_URL, '_blank', 'noopener,noreferrer');
            }}
          >
            Cuéntanos tu opinión — cuestionario
          </button>
          <div className={styles.row2}>
            <span className={styles.demoStatus}>Modo demo · cuestionario: 8-12 min</span>
            <button
              type="button"
              className={styles.restartButton}
              onClick={() => setRestartState('confirming')}
            >
              Reiniciar demo
            </button>
          </div>
        </div>
      )}
      <AppRouter />

      {restartState === 'confirming' && (
        // §3.7 — dimmed sheet over whatever screen (banner included) was
        // showing when she tapped, reusing `home.md §3.11`'s/`settings.md
        // §3.8`'s already-Approved confirm-dialog convention (`Sheet`).
        // Wrapped in its own stacking-context layer (`.confirmLayer`) so it
        // renders above the banner's own `z-index: 500` — both this dialog
        // and the banner deliberately render at the true viewport, outside
        // `AppRouter`'s own `app-shell` device-frame containment, since the
        // dialog needs to dim the banner too, not just the screen beneath it.
        <div className={styles.confirmLayer}>
          <Sheet onDismiss={() => setRestartState('idle')}>
            <p className={styles.confirmTitle}>¿Reiniciar la demo?</p>
            <p className={styles.confirmBody}>
              Se borra todo lo que registraste — tu negocio, tus productos, tus eventos, tus
              ventas — y vuelves a la pantalla de bienvenida.
            </p>
            <div className={styles.confirmRow}>
              <Button variant="secondary" onClick={() => setRestartState('idle')}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={attemptRestart}>
                Sí, reiniciar
              </Button>
            </div>
          </Sheet>
        </div>
      )}
    </div>
  );
}
