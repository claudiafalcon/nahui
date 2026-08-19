import { useState } from 'react';
import { track } from '@vercel/analytics';
import { AppRouter } from '../../AppRouter';
import { useReceiptScreenActive } from './receiptScreenSignal';
import { Sheet } from '../../components/Sheet/Sheet';
import { Button } from '../../components/Button/Button';
import { RestartFailed } from './RestartFailed';
import { restartDemo } from './restartDemo';
import styles from './ReminderBanner.module.css';

const QUESTIONNAIRE_URL = 'https://forms.gle/ZZhtJEfee3viWY1h8';

type RestartState = 'idle' | 'confirming' | 'failed';

/**
 * demo-mode.md §2.3/§3.6 — the persistent, session-wide Form-reminder
 * banner: one full-width, always-tappable, non-dismissible primary row
 * (unchanged since 2026-08-18's first pass) plus a new slim, asymmetric
 * secondary line beneath it (same-day revision, `ux-critic` M1/M2) — never
 * a second full-width row — carrying the real questionnaire time estimate
 * as passive text and the "Reiniciar demo" control (§2.4/§3.7/§3.8, added
 * 2026-08-18) as a small, corner-positioned tap target sharing that line.
 * Both rows composite above whichever Merchant Application screen the
 * *unmodified* `<AppRouter />` is currently resolving to, for the entire
 * `pass-through` duration.
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
 */
export function ReminderBanner() {
  const receiptActive = useReceiptScreenActive();
  const [restartState, setRestartState] = useState<RestartState>('idle');

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
    <div className={`${styles.shell} ${receiptActive ? '' : styles.withBanner}`}>
      {!receiptActive && (
        <div className={styles.banner}>
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
            <span className={styles.timeEstimate}>(8-12 min)</span>
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
