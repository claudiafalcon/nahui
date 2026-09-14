import type { AppState, AuthIdentity, User } from './types';
import { currentUser } from './selectors';
import { businessForCurrentUser } from './onboardingResolution';

/**
 * `authentication.md` §2.1 step 0 / §2.2 case 1's device-history check /
 * §3.7e (Slice 12 `merchant-user-tester` defect fix, 2026-09-07; generalized
 * 2026-09-13, `decision-log.md` D62/D63) — the one shared "does this
 * device's current session sit on an unconfirmed §3.7e gate" test.
 *
 * **Extracted 2026-09-14 (`reviewer` Blocker B1 fix, RFC 0013 rebuild
 * follow-up).** Previously computed inline, once, only inside
 * `AppRouter.tsx`. `InvitationFlow.tsx`'s own accept-time session test
 * (§2.0 step 4 — which explicitly means "§2.1 step 1's existing test," itself
 * defined as holding a valid session "with no §3.7e confirmation left
 * pending") needs the identical rule: a device sitting on an unconfirmed
 * §3.7e screen (backgrounded mid-verification) that then opens an
 * `/invite/<token>` link must not be allowed to tap "Aceptar y empezar a
 * vender" straight through to a real `acceptInvitation` write — that's
 * exactly what let an unconfirmed identity mint a real `BusinessMembership`
 * before this fix. Pulling the test out here, once, is what makes it
 * structurally impossible for the two call sites (`AppRouter.tsx`,
 * `InvitationFlow.tsx`) to drift into two independently-typed copies of the
 * same rule — which is exactly how this defect happened in the first place.
 *
 * Returns the `{ user, identity }` pair `PhoneMismatchConfirm.tsx` needs to
 * render when the gate is showing, `undefined` otherwise.
 * `user.phoneMismatchConfirmationPending` alone would already be correct by
 * construction (`resolveAuthIdentity`'s own invariant — it can only ever be
 * `true` for a User with zero Membership/Business anywhere) — the explicit
 * zero-Membership/zero-Business guards below are kept anyway, for the same
 * defensive-redundancy style `AppRouter.tsx`'s own pre-extraction version
 * already held.
 */
export function phoneMismatchConfirmationTarget(
  state: AppState,
): { user: User; identity: AuthIdentity } | undefined {
  const user = currentUser(state);
  if (!user || !user.phoneMismatchConfirmationPending) return undefined;
  const hasAnyMembership = state.memberships.some((m) => m.userId === user.id);
  if (hasAnyMembership) return undefined;
  const hasOwnBusiness = businessForCurrentUser(state) != null;
  if (hasOwnBusiness) return undefined;
  // §3.7e's own display copy needs to know *which* credential type just
  // verified — by construction, a User this fires for holds exactly one
  // `AuthIdentity` row (the one just minted, `resolveAuthIdentity`'s own
  // `'new-user'` branch — nothing else could have been linked yet, since zero
  // Membership/Business also means this User has never gotten far enough to
  // link a second method through any built UI).
  const identity = state.authIdentities.find((a) => a.userId === user.id);
  if (!identity) return undefined; // defensive — unreachable given the invariant above
  return { user, identity };
}

/**
 * `authentication.md` §3.7e's own display copy — resolves the one
 * human-readable value reflected back to her for whichever credential type
 * just verified (a formatted phone number, a lowercased email, or, for
 * Google, whatever human-readable label the OAuth session itself returned,
 * read live and never persisted — RFC 0012 §1). **Extracted alongside
 * `phoneMismatchConfirmationTarget` above (Blocker B1 fix)** so
 * `AppRouter.tsx`'s own §3.7e render and `InvitationFlow.tsx`'s own inline
 * one never drift into two independently-formatted copies of the same rule.
 */
export function mismatchDisplayValue(identity: AuthIdentity, googleDisplayLabel: string | null): string {
  if (identity.type === 'phone') {
    const p = identity.identifier;
    return `+52 ${p.slice(0, 2)} ${p.slice(2, 6)} ${p.slice(6)}`;
  }
  if (identity.type === 'email') return identity.identifier;
  if (identity.type === 'google') return googleDisplayLabel ?? 'tu cuenta de Google';
  return identity.identifier; // 'apple' — schema-modeled, not activated, defensively unreachable
}
