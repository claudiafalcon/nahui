import { useEffect, useState } from 'react';
import App from './App';
import { useStore } from './domain/store';
import { currentUser, findMembership, pendingInvitationsForPhone } from './domain/selectors';
import { businessForCurrentUser, isOnboardingComplete } from './domain/onboardingResolution';
import { AuthenticationFlow } from './screens/Authentication/AuthenticationFlow';
import { InvitationFlow } from './screens/Authentication/InvitationFlow';
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
 * (docs/passes/slice-1-home-inventario.md "Scope decisions") — reload or a
 * tab switch away from the flow resets to that flow's fresh entry point
 * rather than the exact mid-typing step. See
 * docs/passes/slice-2-authentication-onboarding.md for the full disclosure.
 *
 * **Slice 12 addition — `authentication.md` §2.2 case 0 / §2.2a
 * (`product-decisions.md` Q24/Q25): a fourth stage, `InvitationFlow`,
 * mounted between Authentication and Onboarding.** The spec's own literal
 * gate is "has this phone never been verified before, anywhere" — a fact
 * only known transiently, at the exact moment `verifyOtp` resolves, and
 * therefore not honestly re-derivable from persisted `AppState` alone on a
 * later render/reload the way every other check on this page already is.
 * **Disclosed, reasoned approximation, not the literal spec text:** this
 * build instead shows the offer to any authenticated User who holds *no*
 * Membership anywhere and has not (yet) created her own Business, exactly
 * as long as a pending Invitation for her phone exists. Functionally
 * identical to the spec's own condition for every case that matters at
 * pilot scale; the one theoretical divergence — a phone that verified once
 * long ago, never finished Onboarding, and is invited only *afterward* —
 * would, per the literal spec text, skip this offer (case 2, an
 * in-progress Onboarding resume); this build shows the offer instead,
 * which this pass judges a better outcome for her, not a worse one, given
 * nothing in the Foundation tracks "already resolved this exact offer."
 * "Ahora no" (declining) touches no persisted fact on the `Invitation`
 * record itself (§2.2a step 4 — "does not touch the Invitation at all"),
 * but §2.2a step 4 / §10 makes a stronger, explicit promise than this file's
 * general "pre-write UI state resets on reload" posture covers: "declining
 * never re-surfaces the same offer on the next open" — a completed
 * decision, not in-progress typing, and one a realistic phone-lock/
 * backgrounding interruption would otherwise violate outright (ux-critic
 * fix round, Slice 12). `derivedPendingInvitation` below therefore checks
 * `user.declinedInvitationIds` — a small, durable, local-only UI marker on
 * the `User` row itself (`declineInvitation`, `store.tsx`), the same
 * "shown once ever" persisted-flag shape `Business.nfcAvailabilityNudgeShown`
 * already uses — rather than a transient local-state flag that a reload
 * would silently clear.
 *
 * **`lockedInvitation` — a second, load-bearing piece of local state, found
 * and fixed via live verification (`npm run dev`, a real accept
 * walkthrough), not merely reasoned about in the abstract.** Accepting
 * (§2.2a step 3) writes the SELLER `BusinessMembership` atomically — the
 * exact same write `pendingInvitation`'s own derivation below watches to
 * decide "is she still in case 0's territory." Without this latch, the
 * Membership write itself flips that derivation false on the very next
 * render, so this component would stop rendering `InvitationFlow` (and
 * silently fall through to `home.md §2`) *before* that child's own
 * `'accepting'`/`'welcome'` steps (§3.10a/§3.10c) ever had a chance to
 * render — the write would succeed, but she'd never see the confirmation
 * she just earned. Latching the invitation into local state the moment it's
 * first offered (`useEffect` below) means this component keeps rendering
 * `InvitationFlow` for the rest of that screen's own lifecycle regardless
 * of what the write does to `state.memberships` — only `onAccepted`
 * (§3.10c's own "Ir a Hoy" tap) or `onDeclined` ever clears it.
 */
export function AppRouter() {
  const { state, declineInvitation } = useStore();
  const [lockedInvitation, setLockedInvitation] = useState<ReturnType<typeof pendingInvitationsForPhone>[number] | null>(
    null,
  );

  const user = currentUser(state);
  const authenticated = user?.phoneVerifiedAt != null;

  let derivedPendingInvitation = undefined as ReturnType<typeof pendingInvitationsForPhone>[number] | undefined;
  if (authenticated && user) {
    const hasAnyMembership = state.memberships.some((m) => m.userId === user.id);
    const hasOwnBusiness = businessForCurrentUser(state) != null;
    if (!hasAnyMembership && !hasOwnBusiness) {
      const candidate = pendingInvitationsForPhone(state, user.phone)[0];
      if (candidate && !user.declinedInvitationIds.includes(candidate.id)) {
        derivedPendingInvitation = candidate;
      }
    }
  }
  // See this component's own doc comment for why a live derivation alone
  // isn't enough here — `onAccepted`'s own eventual tap is what actually
  // clears `lockedInvitation` (below), not a re-derivation.
  const pendingInvitation = lockedInvitation ?? derivedPendingInvitation;
  useEffect(() => {
    if (derivedPendingInvitation && !lockedInvitation) setLockedInvitation(derivedPendingInvitation);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only needs to
    // latch once, the first render `derivedPendingInvitation` is truthy;
    // re-running on every subsequent identity change of that value would
    // defeat the whole point of latching it.
  }, [derivedPendingInvitation]);

  // This prototype models exactly one `Business` per running instance
  // (`types.ts`'s own "the whole AppState is implicitly one Business"
  // convention) — the only Business an Invitation could ever reference.
  const invitationBusinessName = state.business?.name ?? '';

  // `onboarding.md` is an OWNER-only flow, structurally — a SELLER never
  // runs it (her membership arrives entirely through `InvitationFlow`
  // above). `isOnboardingComplete` reads `businessForCurrentUser`, which is
  // deliberately OWNER-scoped (`onboardingResolution.ts`'s own doc comment)
  // and would therefore read `false` for a SELLER, incorrectly routing her
  // into Onboarding if left unguarded. A SELLER Membership (any status —
  // `active` or `revoked`; `home.md` §2 step 0's own revoked-Membership gate
  // lives one level deeper, inside `App.tsx`, not here) skips straight past
  // both the Invitation-offer and Onboarding checks.
  const membershipForThisBusiness =
    user && state.business ? findMembership(state, user.id, state.business.id) : undefined;
  const isSeller = membershipForThisBusiness?.role === 'SELLER';

  // `.app-shell` (global.css) is the device-frame/desktop-preview treatment
  // shared by every screen this product renders, regardless of auth state —
  // owned here, at the true top-level component, rather than inside `App`,
  // so Authentication/Onboarding get the identical frame `App`'s own tabs
  // always have (previously a real gap: those two flows rendered flat,
  // edge-to-edge, with no card/shadow on desktop widths — caught in review,
  // see docs/passes/slice-2-authentication-onboarding.md).
  // No stage-level `ScreenTransition` wrap here (removed — ux-critic Minor
  // finding, screen-transitions pass): each of the three stages below
  // already wraps its own first-rendered screen in its own `ScreenTransition`
  // (AuthenticationFlow's "phone" step, OnboardingFlow's "welcome" step,
  // App's "hoy" tab) — an outer wrap at this level meant that exact first
  // screen doubled up two nested, concurrently-running fade+rise animations
  // (opacity compounding multiplicatively, translateY compounding through
  // nested transforms) at the one moment nothing else in the app does this.
  // Letting each stage own its own single entrance is the correct fix, not
  // a second coarser-grained transition layered on top.
  return (
    <div className="app-shell">
      {!authenticated ? (
        // authentication.md §2.2: a first-ever verification hands off
        // silently and directly into onboarding.md §3.3 — no interstitial
        // "¡verificado!" screen (§10). Nothing further to do here: once
        // `verifyOtp` sets `phoneVerifiedAt`, this component re-renders and
        // falls through below.
        <AuthenticationFlow />
      ) : pendingInvitation ? (
        <InvitationFlow
          invitation={pendingInvitation}
          businessName={invitationBusinessName}
          onDeclined={() => {
            declineInvitation(pendingInvitation.id);
            setLockedInvitation(null);
          }}
          onAccepted={() => {
            // §3.10c "Ir a Hoy" — clears the latch (see this component's own
            // doc comment); the freshly-created SELLER Membership means the
            // render below now falls straight through to `home.md §2`'s own
            // resolution inside `<App />`. `isOnboardingComplete` is
            // irrelevant to a SELLER — she never runs Onboarding at all.
            setLockedInvitation(null);
          }}
        />
      ) : isSeller ? (
        <App />
      ) : !isOnboardingComplete(state) ? (
        <OnboardingFlow />
      ) : (
        <App />
      )}
    </div>
  );
}
