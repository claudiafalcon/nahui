const ACCESO_DM_ACTIVE_KEY = 'nahui-acceso-dm-active';

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
