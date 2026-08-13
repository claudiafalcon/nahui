import App from './App';
import { useStore } from './domain/store';
import { isOnboardingComplete } from './domain/onboardingResolution';
import { AuthenticationFlow } from './screens/Authentication/AuthenticationFlow';
import { OnboardingFlow } from './screens/Onboarding/OnboardingFlow';

/**
 * The top-level resolution layer, mounted above the existing tab-shell
 * `App.tsx` — `authentication.md` §2.1's device-session check first ("does
 * this device already hold a valid verified-phone session?"), then
 * `onboarding.md` §2.1's own resolution, falling through to the four-tab
 * shell only once both resolve complete.
 *
 * Both checks are pure functions of persisted `AppState`, re-evaluated on
 * every render (the same pattern `HomeScreen`'s own resolution logic
 * already uses) rather than a separate step-index in ephemeral state — this
 * is what makes the resume/never-ask-twice guarantees in both specs
 * (`authentication.md` §3.8, `onboarding.md` §3.7) come for free from
 * localStorage persistence, once a real write has happened. What genuinely
 * cannot come from persisted `AppState` — because nothing has been written
 * yet — is the pre-write UI state within each flow (a phone number typed
 * but not yet sent, a code sent but not yet confirmed, an Onboarding path
 * tapped but not yet confirmed): those live as local component state inside
 * `AuthenticationFlow`/`OnboardingFlow`, the same disclosed-simplification
 * shape `RegisterMerchandise.tsx`'s own in-progress draft already has
 * (README.md "Scope decisions") — reload or a tab switch away from the flow
 * resets to that flow's fresh entry point rather than the exact mid-typing
 * step. See README.md for the full disclosure.
 */
export function AppRouter() {
  const { state } = useStore();

  const authenticated = state.currentUser?.phoneVerifiedAt != null;
  if (!authenticated) {
    // authentication.md §2.2: a first-ever verification hands off silently
    // and directly into onboarding.md §3.3 — no interstitial "¡verificado!"
    // screen (§10). Nothing further to do here: once `verifyOtp` sets
    // `phoneVerifiedAt`, this component re-renders and falls through below.
    return <AuthenticationFlow />;
  }

  if (!isOnboardingComplete(state)) {
    return <OnboardingFlow />;
  }

  return <App />;
}
