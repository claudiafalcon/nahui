import { useState } from 'react';
import { AppRouter } from '../../AppRouter';
import { DemoWelcome } from './DemoWelcome';
import { DemoLoadError } from './DemoLoadError';
import { acknowledgeDemoMode, isDemoModeAcknowledged } from './demoModeStorage';

type GateState = 'pass-through' | 'welcome' | 'error';

function resolveGateState(): GateState {
  try {
    return isDemoModeAcknowledged() ? 'pass-through' : 'welcome';
  } catch {
    // demo-mode.md §2.1 check 4 — the device-acknowledgment check itself
    // fails outright (e.g. storage access throwing in a restrictive
    // browsing context).
    return 'error';
  }
}

/**
 * demo-mode.md §2.1's device-level check, realized only once
 * `DemoModeGate.tsx`'s own compile-time branch has already confirmed this
 * is a Demo Mode build. Mounted as an outer wrapper around the existing,
 * unmodified `<AppRouter />` (Architecture Review §8 item 2's "Integration-
 * shape recommendation") rather than a new branch inside `AppRouter`'s own
 * resolution logic — keeps `authentication.md`'s already-Approved logic
 * untouched at the code level, matching the spec's own "hands off
 * directly... this document's job ends here" framing literally.
 *
 * §3.1/§3.2 (Resolving, near-instant/slow) are architecturally inapplicable
 * in this build, not omitted — the identical structural reason already
 * established, verbatim, for every other tab's own missing §3.1/§3.2
 * states (`docs/passes/slice-3-eventos.md`'s Eventos-pass disclosure):
 * state loads synchronously from `localStorage`, with no observable async
 * boundary to represent a "resolving" phase. `resolveGateState()` runs
 * inside `useState`'s lazy initializer, before first paint, so there is no
 * frame in which either wireframe could ever actually render.
 */
export function DemoModeGateActive() {
  const [gate, setGate] = useState<GateState>(resolveGateState);

  if (gate === 'pass-through') {
    // §2.1 check 2's silent pass-through (already acknowledged), and §2.2's
    // own hand-off once "Empezar demo" is tapped — both land here, on the
    // real, unmodified AppRouter, identically.
    return <AppRouter />;
  }

  if (gate === 'error') {
    return (
      <div className="app-shell">
        <DemoLoadError onRetry={() => setGate(resolveGateState())} />
      </div>
    );
  }

  // §2.1 checks 2/3 collapse to this one 'welcome' branch — §3.3 (fresh) and
  // §3.4 (resumed) render pixel-identically, per the spec's own text.
  return (
    <div className="app-shell">
      <DemoWelcome
        onStart={() => {
          try {
            acknowledgeDemoMode();
          } catch {
            // Best-effort local flag (§1/§9 — not a domain write): if the
            // write itself fails, the worst case is this screen showing
            // again next launch on this device. Nothing to roll back or
            // retry — §2.2 defines no failure-handling for this write.
          }
          setGate('pass-through');
        }}
      />
    </div>
  );
}
