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
 * onboarding.md §2.1 case 1 — "does a Business already exist... with
 * Onboarding fully complete." A pure function of persisted `AppState`,
 * evaluated fresh on every render (the same pattern `HomeScreen`'s own
 * resolution logic already uses) rather than a parallel step-index — this
 * is what makes §2.1/§3.7's resume guarantees come from localStorage
 * persistence alone, with no separate tracking mechanism to keep in sync.
 */
export function isOnboardingComplete(state: AppState): boolean {
  const b = state.business;
  if (!b) return false;
  if (b.name === '') return false; // identity not yet captured, §2.2b
  if (state.products.length === 0) return false; // "Define lo que vendes" not yet done, §2.2a
  if (!b.onboardingAcknowledged) return false; // §3.6's milestone not yet dismissed
  return true;
}
