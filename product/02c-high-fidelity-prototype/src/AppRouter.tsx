import { useState } from 'react';
import App from './App';
import { useStore } from './domain/store';
import { currentUser, findMembership } from './domain/selectors';
import { isOnboardingComplete } from './domain/onboardingResolution';
import { phoneMismatchConfirmationTarget, mismatchDisplayValue } from './domain/authResolution';
import { AuthenticationFlow } from './screens/Authentication/AuthenticationFlow';
import { AuthResolving } from './screens/Authentication/AuthResolving';
import { InvitationFlow } from './screens/Authentication/InvitationFlow';
import { PhoneMismatchConfirm } from './screens/Authentication/PhoneMismatchConfirm';
import { OnboardingFlow } from './screens/Onboarding/OnboardingFlow';

/**
 * The top-level resolution layer, mounted above the existing tab-shell
 * `App.tsx` — `authentication.md` §2.1's device-session check first ("does
 * this device already hold a valid verified session?"), then
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
 * yet — is the pre-write UI state within each flow (a value typed but not
 * yet sent, a code sent but not yet confirmed, an Onboarding path tapped but
 * not yet confirmed): those live as local component state inside
 * `AuthenticationFlow`/`OnboardingFlow`, the same disclosed-simplification
 * shape `RegisterMerchandise.tsx`'s own in-progress draft already has
 * (docs/passes/slice-1-home-inventario.md "Scope decisions") — reload or a
 * tab switch away from the flow resets to that flow's fresh entry point
 * rather than the exact mid-typing step. See
 * docs/passes/slice-2-authentication-onboarding.md for the full disclosure.
 *
 * **RFC 0012/D62-63 (`decision-log.md`, 2026-09-13) — Google Sign-In and
 * Email activated as fully independent first-time sign-up methods,
 * alongside phone.** `authenticated` is now "does this device hold a live
 * session at all" (`state.currentUserId != null`), never phone-specific —
 * `User` no longer carries `phoneVerifiedAt`, or `phone`, directly (see
 * `AuthIdentity`'s own doc comment, `types.ts`). Every read that used to go
 * through `user.phone` now resolves through `phoneIdentifierFor` instead
 * (`''` for a Google/Email-only merchant — `needsPhoneMismatchConfirmation`'s
 * own display resolves per credential type, never assumes a phone exists,
 * `mismatchDisplayValue` below). **Superseded 2026-09-14, RFC 0013/D64:**
 * this paragraph previously also noted `Invitation` staying phone-scoped by
 * RFC 0012 §3 — no longer true; `Invitation` is token-keyed now, and every
 * one of the three authentication methods is equally available acceptance-
 * side, per `InvitationFlow.tsx`'s own doc comment.
 *
 * **Slice 12's `InvitationFlow` auto-offer mechanism (phone-match against
 * `Invitation.phone`, mounted here as a fourth stage between Authentication
 * and Onboarding) was retired outright, not merely superseded — RFC
 * 0013/`decision-log.md` D64.** `Invitation` no longer carries `phone` at
 * all (its canonical identity is now a `token`, resolvable only by
 * explicitly opening `/invite/<token>` — RFC 0013 §2 names this an explicit
 * structural simplification: "the new mechanism never auto-surfaces
 * anything... an Invitation is only ever seen by explicitly opening its
 * link").
 *
 * **`inviteToken` / `invitationGateActive` — the real token-based gate
 * (`authentication.md` §2.0/§2.2a's own `InvitationFlow.tsx`, rebuilt in
 * full 2026-09-14 against RFC 0013).** `inviteToken` is minimal path-based
 * routing (`architecture-principles.md` #5 restraint — a single
 * `window.location.pathname` read, captured once at initial mount, not a
 * routing library). `invitationGateActive` is what actually decides whether
 * `InvitationFlow` renders — derived once from `inviteToken` at mount, then
 * cleared (`false`) only by that component's own `onDone` callback, once
 * she's fully resolved the offer one way or another (accepted through to
 * "Ir a Hoy," declined, or landed on a defensive "no longer available"/
 * "already a member"/"access revoked" state and tapped through it). Kept
 * separate from `inviteToken` itself (rather than nulling that) so the two
 * concerns stay distinct: "was a token present at all" vs. "is the gate this
 * token opens still the thing in control of the screen right now." §2.0's
 * own "checked before every other check in §2" sequencing is what this
 * file's render below implements: while `invitationGateActive` is true,
 * every other branch below (authenticated, hydration, phone-mismatch,
 * seller, onboarding) is fully preempted — `InvitationFlow` is the sole
 * renderer, including through its own inline `AuthenticationFlow` mounting
 * for a session-less device (§2.0 step 4's "no session" branch) — never a
 * second, competing render path.
 *
 * `onDone` also clears the URL back to `/` (`window.history.replaceState`) —
 * without this, a reload after resolving the Invitation would re-derive the
 * identical `inviteToken` from `window.location.pathname` on the next mount
 * and re-open the same offer forever, since the path itself never changes
 * merely by resolving what it named. This is the concrete answer to this
 * file's own previously-open question ("confirm this actually still works
 * once you wire consumption, since the pathname itself doesn't change
 * during the flow") — it does, but only because `onDone` now actively
 * rewrites it, not because persistence alone would have been sufficient.
 */
export function AppRouter() {
  const { state, hydrationStatus, retryHydration, confirmPhoneMismatch, retractMistypedVerification } = useStore();
  // Stage 7 Backend Integration, this pass — see this component's own doc
  // comment above. Captured once, at mount, not re-derived on every render
  // (a client-side navigation away from `/invite/<token>` never happens in
  // this app — reload is the only way this path is ever left).
  const [inviteToken] = useState<string | null>(() => {
    const match = window.location.pathname.match(/^\/invite\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  });
  // See this component's own doc comment above — the real switch that
  // decides whether `InvitationFlow` (authentication.md §2.0/§2.2a) is the
  // sole renderer right now.
  const [invitationGateActive, setInvitationGateActive] = useState<boolean>(() => inviteToken != null);
  // authentication.md §3.7e (Slice 12 `merchant-user-tester` defect fix,
  // 2026-09-07; **generalized 2026-09-13, `decision-log.md` D62/D63** — was
  // phone-only, now covers whichever of the two typed channels "No, elegir
  // otro" was reached from). The just-rejected value, so the freshly-
  // remounted `AuthenticationFlow` below can pre-fill it rather than making
  // her retype it — `undefined` for Google (nothing to pre-fill — returns to
  // §3.2a fresh instead), an ordinary fresh open, or a genuine account
  // sign-out.
  const [retractedPrefill, setRetractedPrefill] = useState<{ channel: 'phone' | 'email'; value: string } | undefined>(
    undefined,
  );
  // §3.7e's own display value for the Google channel specifically — read
  // live from the OAuth session at the moment it resolved
  // (`AuthenticationFlow`'s own `onGoogleResolved` callback), never
  // persisted anywhere (RFC 0012 §1). If a reload happens in the narrow gap
  // between a Google credential resolving and this confirm screen's own tap
  // — this ephemeral value is genuinely lost, same as any other in-memory
  // React state in this app; `mismatchDisplayValue` below falls back to a
  // generic, still-true phrase rather than inventing or persisting a label.
  const [googleDisplayLabel, setGoogleDisplayLabel] = useState<string | null>(null);

  const user = currentUser(state);
  const authenticated = state.currentUserId != null;

  // authentication.md §2.2 case 1's device-history check / §3.7e (Slice 12
  // `merchant-user-tester` defect fix, 2026-09-07; generalized 2026-09-13).
  // **[Corrected 2026-09-13, `reviewer`-caught Important finding.]** This
  // branch is now checked BEFORE `pendingInvitation` in the JSX below,
  // reversing the prior ordering. §2.2's own case-0-before-case-1 rule
  // ("checked FIRST, before 1-3") only governs the moment immediately after
  // a *fresh* verification, where the two conditions are mutually exclusive
  // by construction (case 1's device-history sub-check only ever fires
  // after case 0 already said no) — so this reordering changes nothing for
  // that path. It matters for a separate, narrower window §2.1's own new
  // step 0 exists specifically to close: resuming the app while §3.7e sits
  // unconfirmed (backgrounded before tapping either button) must show §3.7e
  // first, "never falls through to [the ordinary valid-session logic]
  // below" (§2.1 step 0's own text) — and the Invitation check lives inside
  // that ordinary logic. The prior ordering let a pending Invitation that
  // appeared during that exact window win, letting her accept it without
  // ever passing the identity-confirmation gate the spec requires take
  // priority there.
  //
  // **Extracted to `domain/authResolution.ts` 2026-09-14 (`reviewer` Blocker
  // B1 fix)** — `InvitationFlow.tsx`'s own accept-time session test needs
  // this identical rule; see that module's own doc comment for the full
  // reasoning.
  const mismatchTarget = phoneMismatchConfirmationTarget(state);
  const needsPhoneMismatchConfirmation = mismatchTarget != null;
  const mismatchIdentity = mismatchTarget?.identity;

  // `onboarding.md` is an OWNER-only flow, structurally — a SELLER never
  // runs it (her membership arrives entirely through Invitation-acceptance,
  // `InvitationFlow.tsx`, above). `isOnboardingComplete` reads `businessForCurrentUser`,
  // which is deliberately OWNER-scoped (`onboardingResolution.ts`'s own doc
  // comment) and would therefore read `false` for a SELLER, incorrectly
  // routing her into Onboarding if left unguarded. A SELLER Membership (any
  // status — `active` or `revoked`; `home.md` §2 step 0's own
  // revoked-Membership gate lives one level deeper, inside `App.tsx`, not
  // here) skips straight past the Onboarding check.
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
  // (AuthenticationFlow's own first step, OnboardingFlow's "welcome" step,
  // App's "hoy" tab) — an outer wrap at this level meant that exact first
  // screen doubled up two nested, concurrently-running fade+rise animations
  // (opacity compounding multiplicatively, translateY compounding through
  // nested transforms) at the one moment nothing else in the app does this.
  // Letting each stage own its own single entrance is the correct fix, not
  // a second coarser-grained transition layered on top.
  return (
    <div className="app-shell">
      {invitationGateActive && inviteToken ? (
        // authentication.md §2.0 — "checked before every other check in
        // §2," including `!authenticated` itself: a pending Invitation-link
        // offer is shown before any of the ordinary branches below ever run,
        // regardless of whether this device already holds a session. See
        // `InvitationFlow.tsx`'s own doc comment for the full reasoning,
        // including why its own inline `AuthenticationFlow` mounting (for a
        // session-less device accepting the offer) never falls through to
        // any branch below either, until it calls `onDone`.
        <InvitationFlow
          token={inviteToken}
          onDone={() => {
            window.history.replaceState(null, '', '/');
            setInvitationGateActive(false);
          }}
        />
      ) : !authenticated ? (
        // authentication.md §2.2: a first-ever verification hands off
        // silently and directly into onboarding.md §3.3 — no interstitial
        // "¡verificado!" screen (§10). Nothing further to do here: once a
        // credential resolves, `currentUserId` is set, this component
        // re-renders and falls through below. `retractedPrefill` (Slice 12
        // defect fix) is only ever set immediately after "No, elegir otro"
        // below — an ordinary fresh open, a genuine account sign-out, or a
        // Google-channel rejection never sets it.
        <AuthenticationFlow initialPrefill={retractedPrefill} onGoogleResolved={setGoogleDisplayLabel} />
      ) : !state.business && hydrationStatus !== 'ready' ? (
        // Stage 7 Backend Integration — the second-device/cleared-browser
        // case this whole pass exists to fix: a live session exists, but
        // this device's own local mirror holds no Business yet, and the
        // real one (if any) hasn't finished resolving from the backend.
        // Checked before every other post-auth branch below — none of them
        // (PhoneMismatch, Onboarding-vs-App) can be answered honestly yet,
        // since all of them read `state.business`/`state.memberships`,
        // which may still be about to be wholesale-replaced by
        // `hydrateFromBackend`. (Invitation resolution no longer lives in
        // this chain at all, RFC 0013 — it's fully resolved, one way or
        // another, by the `invitationGateActive` branch above before this
        // point is ever reached.) See `AuthResolving.tsx` for the full
        // reasoning, including its own disclosed deviation from `home.md`
        // §3.1/§3.2/§3.14's nav-bar-present wireframes.
        <AuthResolving status={hydrationStatus === 'error' ? 'error' : 'loading'} onRetry={retryHydration} />
      ) : needsPhoneMismatchConfirmation && user && mismatchIdentity ? (
        // authentication.md §3.7e (Slice 12 `merchant-user-tester` defect
        // fix, 2026-09-07; generalized 2026-09-13) — see
        // `needsPhoneMismatchConfirmation`'s own derivation above for why
        // this now sits BEFORE `pendingInvitation` (corrected 2026-09-13):
        // a first-ever-anywhere credential must never reach
        // `onboarding.md §3.3` — and so never `onboarding.md §3.5`'s own
        // Business-creation write, nor an Invitation's own accept write —
        // while this device still remembers a different identity's prior
        // session, unconfirmed. `&& user && mismatchIdentity` here only
        // narrows the type for the JSX below — both are already guaranteed
        // whenever `needsPhoneMismatchConfirmation` is `true`.
        <PhoneMismatchConfirm
          channel={mismatchIdentity.type}
          displayValue={mismatchDisplayValue(mismatchIdentity, googleDisplayLabel)}
          onConfirm={() => confirmPhoneMismatch()}
          onCorrect={() => {
            // Preserve the just-typed value for the freshly-remounted
            // `AuthenticationFlow` above (phone/email only — Google has
            // nothing to preserve, returns to §3.2a fresh, §3.7e's own
            // text), then revert this User row's own verification —
            // `authenticated` flips false on the very next render, which is
            // what actually swaps this component out.
            if (mismatchIdentity.type === 'phone' || mismatchIdentity.type === 'email') {
              setRetractedPrefill({ channel: mismatchIdentity.type, value: mismatchIdentity.identifier });
            } else {
              setRetractedPrefill(undefined);
            }
            retractMistypedVerification();
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
