# Slice 12 — Q24/Q25 first usable version (multi-staff concurrent selling)

Working file for the in-progress slice. Superseded by `README.md`'s own pass-archive entry once this slice is Approved and complete — delete or reduce to a pointer at that point, per this folder's own knowledge-architecture discipline.

## Scope — Product Owner's own stated priority, not the full Q24/Q25 capability surface

Her direction (verbatim, from the design-phase conversation): "Design the lifecycle and invariants properly, then implement incrementally. For the first usable version, prioritize what is actually required for this merchant to operate safely with multiple sellers at the same bazaar."

**In scope:**
1. Staff invite/SELLER accounts — `Invitation` creation (OWNER side, `settings.md` §2.7/§3.11-§3.13), acceptance (`authentication.md` §2.2/§2.2a/§3.10-§3.13a), revocation (`settings.md` §3.13/§3.14).
2. `Sale.performedByMembershipId` attribution, consumed by `home.md` §3.7c "Mi actividad de hoy".
3. Manual (quantity-based) Event allocation only — `events.md` §3.21's manual stepper path, §3.23 save states. **NOT** the NFC-scan composability (§3.22).
4. Concurrent-selling "lost the race" handling — `home.md` §3.8a extended, §3.8d-i/§3.8d-ii — the compare-and-swap on `EventAllocation.quantityRemaining`.
5. `home.md`'s SELLER-role experience: role resolution (§2), SELLER cold-start/§3.6a variants, role-scoped nav (§3.15/§3.16), "Acceso no disponible" (§3.17).
6. D53's own multi-Event resolution logic (`home.md` §2 steps 2a/2b, §3.6b "Elegir evento").

**Explicitly deferred, not this slice:** NFC-scan allocation (`events.md` §3.22), cross-Event reallocation UX (`events.md` §3.24, "Mover mercancía"), reconciliation at Event close (`events.md` §3.25), richer seller analytics beyond "Mi actividad de hoy," `AllocationMovement`'s own implementation (no UI surface until reallocation/reconciliation are built — `EventAllocation.quantityAllocated`/`quantityRemaining` alone serves this slice).

## Foundation grounding

- `product/99-rfc/0007-user-and-business-membership.md` (Accepted, D44) — `User`/`BusinessMembership`.
- `product/99-rfc/0008-membership-invitation-and-concurrent-selling.md` (Accepted, D56) — `Invitation`, the Invitation-acceptance invariant, the Membership authorization gate.
- `product/99-rfc/0009-event-scoped-inventory-allocation.md` (Accepted, D57) — `EventAllocation`, `AllocationMovement` (deferred), the physical-location-exclusivity invariant, the reallocation transaction (deferred).
- `decision-log.md` D55 (`BusinessMembership.status`/`revokedAt`), D58 (`Sale.performedByMembershipId`), D53 (D17 superseded — simultaneous multi-Event operation supported).

## Architecture Gap Analysis findings (`architect`, 2026-09-07)

**The one real blocker, underneath everything: `AppState.currentUser: User | null` is a single-slot field.** A correctly-scoped Slice 2 simplification ("at most one User ever relevant... only has real work to do once a second device/session exists") whose time has now come. `verifyOtp` resolves phone-match only against that one slot — a second phone verifying overwrites it, and re-verifying the first phone afterward wouldn't find its original `User` row, minting a duplicate and misrouting a returning OWNER back into fresh Onboarding. This blocks every in-scope item that needs more than one Membership exercised in one running instance (items 1, 4, 5) — which, given this prototype's single shared `localStorage` blob standing in for "all devices," is most of the slice.

**Fix, low-risk and mechanical:** replace `currentUser: User | null` with `users: User[]` + `currentUserId: ID | null` — the same array-shaped pattern `memberships`/`sessions` already use. `verifyOtp` looks up by `phone` across the array. Introduce a shared `actingMembership(state)` selector at the same time (`memberships.find(m => m.userId === currentUserId && m.businessId === business.id && m.status === 'active')`) — the one primitive items 1, 2, 5, 6's "this device's own acting Membership" language all resolve through (`architecture-principles.md` #1, "resolved once, upstream").

**D53's D17 overlap check is still live in code, actively blocking item 6.** `createEvent` (`store.tsx:709-755`) and `NuevoEvento.tsx:36-44` both still enforce the exact restriction `decision-log.md` D53 retired; `activeEventForBusiness` (`selectors.ts:310-312`) has a doc comment asserting singularity "by construction" that's now false. You cannot create two simultaneously-active Events in the current build at all — §3.6b is untestable until this is removed. Pure code-debt deletion, not new design work; `events.md`'s own status header already names this as owed.

**What already exists to build on:** Slice 2 gives a working `User`/`BusinessMembership`(OWNER)/`Business` atomic-creation write and a real phone+OTP mock. `Session`/`Sale`/`SaleItem`/`Event`/`Venue`/`PriceOverride` are real, written aggregates with FIFO/Price-resolution/NFC-Readiness already correct and reusable as-is. `BusinessMembership[]` is already array-shaped, so `status`/`revokedAt` is a pure additive field change. `settings.md`'s Paid-tier conditional-rendering pattern (`SettingsScreen.tsx`) is a direct precedent for "Tu equipo."

**`events.md` §3.21 is a shared screen** serving both in-scope (manual stepper, "Guardar cambios") and out-of-scope (NFC scan, "Mover a otro evento") affordances — build renders the in-scope controls only, omitting the scan affordance and "Mover a otro evento" entirely (never a dead link to an unbuilt destination), the same pattern the spec already uses for a Business without NFC capability.

## Recommended build sequence

1. **Foundational refactor** (unblocks everything else): `users[]`/`currentUserId` + `actingMembership` selector; remove the dead D17 overlap check from `createEvent`/`NuevoEvento.tsx`.
2. **Identity capability:** `Invitation` type + `createInvitation`/`acceptInvitation`/`revokeMembership` writes + `BusinessMembership.status`/`revokedAt` + `Sale.performedByMembershipId`; `authentication.md` §2.2/§2.2a/§3.10-§3.13a; `settings.md` §2.7/§3.11-§3.14.
3. **Home role experience + D53 Home resolution** (can run in parallel once step 2 lands): §2 step 0/role resolution/§3.15-§3.17; §2 step 2a/2b + §3.6b.
4. **EventAllocation (manual) + lost-the-race:** `EventAllocation` type/write path, `events.md` §3.21/§3.23; then `home.md` §3.8a extension/§3.8d-i/ii/§3.9's stock line, which depends directly on this step.

No new RFC needed — every domain concept is already Accepted.

## Status

Gap Analysis complete. Build not yet started.
