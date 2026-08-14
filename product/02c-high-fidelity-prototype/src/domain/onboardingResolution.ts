import type { AppState, Business } from './types';
import type { OnboardingPath } from './store';

/**
 * `onboarding.md` §2.2's capability table is injective — the three paths
 * produce three distinct `(subscriptionTier, defaultSellingMode)` pairs, so
 * the path a Business took is fully recoverable from its stored
 * capabilities alone. No separate `path` field needs to be persisted
 * anywhere — one more fact the router gets "for free" from data that
 * already has to exist, per this pass's own design instruction.
 */
export function pathFromCapabilities(business: Business): OnboardingPath {
  if (business.subscriptionTier === 'free') return 'free';
  return business.defaultSellingMode === 'nfc' ? 'demo' : 'paid';
}

/**
 * RFC 0007/D44's own structural invariant — "no Business row can exist
 * without a corresponding OWNER Membership" — reused here exactly as
 * `completeOnboarding` (store.tsx) already applies it for its own
 * idempotency guard (`existingMembership`). `state.business` being merely
 * *present* is not the same fact as `state.business` belonging to
 * `state.currentUser`: on a device that has already onboarded one phone,
 * `state.business` stays populated even after a *different*, brand-new
 * phone verifies (`verifyOtp` correctly mints a distinct `User` row for
 * it, per `authentication.md` §2.2 case 1) — that new `User` holds no
 * `BusinessMembership` on it at all yet. Both `isOnboardingComplete` and
 * `OnboardingFlow`'s own resume-step logic must ask this question, not
 * merely "does a Business exist" — bug found by `merchant-user-tester`,
 * fixed here (see README.md's pass history).
 */
export function businessForCurrentUser(state: AppState): Business | null {
  const { business, currentUser, memberships } = state;
  if (!business || !currentUser) return null;
  const owns = memberships.some(
    (m) => m.userId === currentUser.id && m.businessId === business.id && m.role === 'OWNER',
  );
  return owns ? business : null;
}

/**
 * onboarding.md §2.1 case 1 — "does a Business already exist... with
 * Onboarding fully complete." A pure function of persisted `AppState`,
 * evaluated fresh on every render (the same pattern `HomeScreen`'s own
 * resolution logic already uses) rather than a parallel step-index — this
 * is what makes §2.1/§3.7's resume guarantees come from localStorage
 * persistence alone, with no separate tracking mechanism to keep in sync.
 *
 * Resolves against `businessForCurrentUser`, not `state.business` directly
 * — see that function's own doc comment for why the distinction matters.
 * An already-onboarded returning User (`authentication.md` §2.2 case 2,
 * same phone re-verifying on this device) is unaffected: `verifyOtp`
 * resolves back to the *same* `User` row for that phone, so the OWNER
 * `BusinessMembership` created at their own `completeOnboarding` time still
 * matches, and this still resolves straight through to their own Business.
 */
export function isOnboardingComplete(state: AppState): boolean {
  const b = businessForCurrentUser(state);
  if (!b) return false;
  if (b.name === '') return false; // identity not yet captured, §2.2b
  if (state.products.length === 0) return false; // "Define lo que vendes" not yet done, §2.2a
  if (!b.onboardingAcknowledged) return false; // §3.6's milestone not yet dismissed
  return true;
}
