const ACCESO_DM_ACTIVE_KEY = 'nahui-acceso-dm-active';
const ACCESO_DM_EXIT_CTA_DISMISSED_KEY = 'nahui-acceso-dm-exit-cta-dismissed';

/**
 * acceso-dm.md §2.3 — "did *this* route create this session," a fact the
 * domain layer is intentionally unable to answer on its own (a Business
 * created through Acceso DM is domain-indistinguishable from one created
 * through "Ver un ejemplo" — same `OnboardingPath = 'demo'`, same seed).
 * Same abstraction-level category `demoModeStorage.ts`'s own
 * `nahui-demo-mode-acknowledged` already establishes: a device/session-level
 * implementation detail, explicitly not a `Business`/`User`/`Session` field,
 * read only by the results-guidance nudge's own visibility check
 * (`ResultsGuidanceNudge.tsx`), never by anything else. Kept in a
 * distinctly-named `localStorage` key, deliberately separate from
 * `store.tsx`'s own `STORAGE_KEY` — same separation `demoModeStorage.ts`
 * already holds for the identical reason.
 *
 * §2.1 step 5's own note: this flag is not a second idempotency mechanism —
 * `businessForCurrentUser` (consulted once, at initial mount, before the
 * auto-sequence runs at all) still owns that. This flag is written once, the
 * moment the auto-sequence begins, and is never cleared — §2.3 check 3's own
 * reasoning: once `hasAnyClosedSession` flips true, the nudge stops
 * permanently regardless of whether this flag is still `true`, so clearing
 * it would add a second closing mechanism this document deliberately doesn't
 * need.
 */
export function markAccesoDmActive(): void {
  localStorage.setItem(ACCESO_DM_ACTIVE_KEY, 'true');
}

export function isAccesoDmActive(): boolean {
  try {
    return localStorage.getItem(ACCESO_DM_ACTIVE_KEY) === 'true';
  } catch {
    // Best-effort, read side — a storage read failing here just means the
    // nudge never shows on this device, not a crash (same defensive-read
    // posture as `demoModeStorage.ts`'s own `isDemoModeAcknowledged`, which
    // this mirrors, minus the throwing case since that one is invoked from
    // inside a try/catch at its own call site instead).
    return false;
  }
}

/**
 * acceso-dm.md §2.5 check 5 — the exit invitation's own "Ahora no" dismiss.
 * Same non-domain, device-level-flag category as `nahui-acceso-dm-active`
 * above, colocated in this same module rather than a second small file since
 * both flags share one owner (the exit invitation reads both this flag and
 * `isAccesoDmActive()` together — see `ResultsGuidanceNudge.tsx`) and one
 * abstraction level. Unlike `nahui-acceso-dm-active`, this flag is written
 * only on an explicit merchant tap, never automatically.
 */
export function markExitCtaDismissed(): void {
  localStorage.setItem(ACCESO_DM_EXIT_CTA_DISMISSED_KEY, 'true');
}

export function isExitCtaDismissed(): boolean {
  try {
    return localStorage.getItem(ACCESO_DM_EXIT_CTA_DISMISSED_KEY) === 'true';
  } catch {
    // Best-effort, read side — same defensive posture as `isAccesoDmActive`
    // above: a storage read failing here just means the CTA still shows on
    // this device (fails open to "not dismissed"), not a crash.
    return false;
  }
}
