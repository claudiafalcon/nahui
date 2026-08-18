import { AppRouter } from '../../AppRouter';
import { useReceiptScreenActive } from './receiptScreenSignal';
import styles from './ReminderBanner.module.css';

const QUESTIONNAIRE_URL = 'https://forms.gle/ZZhtJEfee3viWY1h8';

/**
 * demo-mode.md §2.3/§3.6 — the persistent, session-wide Form-reminder
 * banner: a full-width, always-tappable, non-dismissible strip composited
 * above whichever Merchant Application screen the *unmodified* `<AppRouter
 * />` is currently resolving to, for the entire `pass-through` duration.
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
 * true, the strip itself doesn't render *and* the space normally reserved
 * for it above `.app-shell` collapses back to zero — the receipt screen
 * stays exactly as header-less/full-viewport as `home.md` itself already
 * specifies, with no demo-only residue.
 *
 * No dismiss control, no progressive/stateful visual change on tap (§10) —
 * tapping only opens the questionnaire in a new tab; this component's own
 * render output never changes as a result.
 */
export function ReminderBanner() {
  const receiptActive = useReceiptScreenActive();

  return (
    <div className={`${styles.shell} ${receiptActive ? '' : styles.withBanner}`}>
      {!receiptActive && (
        <button
          type="button"
          className={styles.banner}
          onClick={() => window.open(QUESTIONNAIRE_URL, '_blank', 'noopener,noreferrer')}
        >
          Cuéntanos tu opinión — cuestionario
        </button>
      )}
      <AppRouter />
    </div>
  );
}
