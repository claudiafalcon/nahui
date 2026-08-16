const DEMO_ACK_KEY = 'nahui-demo-mode-acknowledged';

/**
 * demo-mode.md §2.1 checks 2/3 + §8 item 2 (Architecture Review) — device
 * acknowledgment persistence, a single boolean read/written through a
 * distinctly-named `localStorage` key, deliberately separate from
 * `store.tsx`'s own `STORAGE_KEY` (`'nahui-hifi-prototype-v1'`) — the
 * domain-mirroring `AppState` blob. This flag is explicitly not domain data
 * (§1/§9 of the spec: no `Business`/`User`/`Session` field is ever touched
 * here) — keeping it in a structurally separate location is what makes the
 * "writes nothing to the domain model" claim true in practice, not just by
 * convention.
 *
 * §2.1's checks 2 ("already acknowledged") and 3 ("shown but not yet
 * acknowledged") collapse to this one boolean read, per the Architecture
 * Review's own implementation-guidance note — §3.4 already renders both
 * cases identically ("nothing to preserve"), so no third persisted state is
 * needed.
 */
export function isDemoModeAcknowledged(): boolean {
  return localStorage.getItem(DEMO_ACK_KEY) === 'true';
}

/**
 * §2.2 — tapping "Empezar demo" marks this device as having acknowledged
 * the screen. A boolean set, naturally idempotent by construction (§8 item
 * 2's precision correction to `architecture-principles.md` #7): setting
 * `true` twice is a no-op, unlike a keyed domain write where a blind retry
 * risks duplication — so this needs no dedup/keying logic of its own.
 */
export function acknowledgeDemoMode(): void {
  localStorage.setItem(DEMO_ACK_KEY, 'true');
}
