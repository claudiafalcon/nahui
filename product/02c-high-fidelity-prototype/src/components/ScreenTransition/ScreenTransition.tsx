import { type ReactNode } from 'react';
import styles from './ScreenTransition.module.css';

/**
 * A lightweight, restrained entrance transition for ordinary screen-to-
 * screen navigation — tab switches (App.tsx), forward/back moves within a
 * flow (Registrar Mercancía → Asignar Tags, Settings sub-screens, Eventos/
 * Resultados detail drill-downs, Onboarding/Authentication steps, etc.).
 * Visual-polish pass only, no new screen states or navigation behavior.
 *
 * Every screen-branch in this codebase already follows the same shape — a
 * component resolves an internal `mode`/`kind`/`step` and returns exactly
 * one child tree for it (`InventoryScreen`, `EventsScreen`,
 * `ResultadosScreen`, `SettingsScreen`, `HomeScreen`, `OnboardingFlow`,
 * `AuthenticationFlow`, `AppRouter`, `App` itself) — so this wraps that one
 * child tree, keyed by whatever value identifies "the thing being shown."
 * React remounts the wrapper (and therefore replays the animation) exactly
 * when that identity changes, never on an unrelated re-render of the same
 * screen.
 *
 * Entrance-only, deliberately: the outgoing screen already unmounts
 * instantly today (plain conditional branching, no transition library in
 * this codebase), so animating only the incoming screen is what keeps this
 * a same-render, dependency-free change rather than a bigger navigation-
 * architecture rework. A fast fade + small upward settle reads as "arriving"
 * without needing to choreograph an exit.
 *
 * Deliberately NOT used to wrap anything that already owns its own
 * screen-level entrance motion — `ReceiptTicket` (`swingIn`) is the one
 * case in this codebase today; callers keep that branch outside
 * `ScreenTransition` rather than layering a second, redundant animation on
 * top of a moment that's already deliberately choreographed.
 */
export function ScreenTransition({ transitionKey, children }: { transitionKey: string; children: ReactNode }) {
  return (
    <div key={transitionKey} className={styles.enter}>
      {children}
    </div>
  );
}
