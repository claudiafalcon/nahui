import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import { ChooseMethodStep } from './ChooseMethodStep';
import { PhoneStep } from './PhoneStep';
import { EmailStep } from './EmailStep';
import { LockedEmailStep } from './LockedEmailStep';
import { GoogleProgress, GoogleError } from './GoogleStep';
import { CodeStep } from './CodeStep';
import type { InvitationContext } from './InvitationContextLine';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';

type Channel = 'phone' | 'email';

type AuthStep =
  | { kind: 'choose' }
  | { kind: 'phone'; prefill?: string }
  | { kind: 'email'; prefill?: string }
  /** authentication.md §3.2g (RFC 0014/D70) — the Invitation-locked email
   * entry point, reached only when `lockedInvitationEmail` is set. See this
   * component's own doc comment below for the full reasoning. */
  | { kind: 'invitation-email' }
  | { kind: 'code'; channel: Channel; identifier: string }
  | { kind: 'google-redirecting' }
  | { kind: 'google-verifying' }
  | { kind: 'google-error' };

/**
 * §3.8's own extended resumability range — a device reopened mid-Google-
 * redirect (backgrounded, killed, or a genuine page reload while Google's
 * own UI, or the return trip from it, is in flight) needs to resume the
 * resolve attempt rather than silently restarting at §3.2a. Since navigating
 * to Google is a real full-page navigation, this app's own React state is
 * guaranteed gone on return — the only signal available is the URL itself:
 * Supabase's own OAuth redirect appends either a session in the hash
 * fragment (`#access_token=...`) or an error in the hash/query
 * (`#error=...` / `?error=...`) the moment it lands back here. Below this
 * document's abstraction level to specify further (`authentication.md`
 * §3.8's own text) — only the two merchant-visible outcomes this resolves
 * into (§3.2c success/cancel, or §3.2d error) matter to the spec.
 */
function computeInitialStep(prefill?: { channel: Channel; value: string }, lockedInvitationEmail?: string): AuthStep {
  if (prefill) return { kind: prefill.channel, prefill: prefill.value };
  // RFC 0014/D70 — an Invitation-acceptance attempt with a known
  // `targetHint` skips §3.2a's three-way choice (and, with it, the Google-
  // redirect resumability check below, which existed only to resume a
  // detour §3.2g never offers in the first place — Google is not reachable
  // from this entry point at all, per D70's own "the method, not just the
  // value, must be fixed to Email" ruling).
  if (lockedInvitationEmail) return { kind: 'invitation-email' };
  if (typeof window !== 'undefined') {
    const { hash, search } = window.location;
    if (hash.includes('access_token') || hash.includes('error') || search.includes('error')) {
      return { kind: 'google-verifying' };
    }
  }
  return { kind: 'choose' };
}

/**
 * authentication.md — the identity-verification gate that precedes
 * everything else in the Merchant Application (§0). Mounted by `AppRouter`
 * whenever this device holds no live verified session
 * (`state.currentUserId == null`).
 *
 * **Generalized 2026-09-13, `decision-log.md` D62/D63** — was a two-state
 * phone→code flow; now a full state machine covering all three independent
 * first-time methods (§3.2a "Elegir cómo entrar," the new default entry
 * point) — Google, Email, and phone/número celular, converging back into the
 * shared `CodeStep` for the two channels that use a code at all.
 *
 * §3.8 ("Retomar autenticación interrumpida") is a disclosed, narrower
 * simplification in this build for the phone/email typing steps, unchanged
 * from before: nothing is written to the persisted store before a code is
 * actually confirmed, so a typed-but-unsent value or a sent-but-unconfirmed
 * code lives only in this component's own local state — resets on
 * reload/tab-away, not on ordinary in-flow navigation (the same posture
 * `RegisterMerchandise.tsx`'s own in-progress draft already has). **The
 * Google channel is the one genuine exception** — because leaving for
 * Google's own UI is a real full-page navigation, its own resumability
 * (§3.2b/§3.2c) is reconstructed from the URL itself on mount
 * (`computeInitialStep`), not from in-memory state, which a real redirect
 * always destroys anyway.
 *
 * `initialPrefill` (Slice 12 `merchant-user-tester` defect fix, 2026-09-07,
 * `authentication.md` §3.7e; generalized 2026-09-13 to cover both typed
 * channels) — set by `AppRouter.tsx` only when it just mounted this
 * component fresh in response to "No, elegir otro" (`PhoneMismatchConfirm.tsx`),
 * so the just-typed, just-rejected value is preserved for editing rather
 * than retyped from scratch — the identical pre-fill behavior "← Cambiar
 * [número / correo]" (§3.6) already gives, applied to a second escape hatch
 * rather than a new one. `undefined` for an ordinary fresh open, a genuine
 * account sign-out, or a "No, elegir otro" reached via Google (which has
 * nothing to pre-fill — returns to §3.2a instead).
 *
 * `onGoogleResolved` — fires the instant a Google credential resolves
 * successfully, passing up the one human-readable display value
 * `authentication.md` §3.7e's confirm screen needs for the Google channel
 * specifically (read live from the OAuth session, never persisted — RFC
 * 0012 §1). Needed because `AppRouter.tsx` may swap this whole component out
 * for `PhoneMismatchConfirm` the very next render (the instant
 * `currentUserId` is set), which would otherwise lose this ephemeral value
 * along with every other piece of this component's own local state.
 *
 * `invitationContext` (RFC 0013, added 2026-09-14, closes `ux-critic` M1) —
 * threaded straight through to every step component below, unchanged, per
 * `InvitationContextLine.tsx`'s own doc comment. Set only by
 * `InvitationFlow.tsx`'s own "no session exists" branch (§2.0 step 4/§3.10)
 * when it mounts this component to carry a pre-auth Invitation token through
 * authentication — `undefined` for every other mounting of this component
 * (an ordinary fresh open, a `settings.md §2.5` sign-out re-verification, a
 * §3.7e "No, elegir otro" retry via `AppRouter.tsx`), which is the entire
 * reason this is a plain optional prop rather than a context/global — most
 * callers have nothing to thread.
 *
 * `lockedInvitationEmail` / `onDeclineInvitation` (RFC 0014/D70, added
 * 2026-09-15) — set only by `InvitationFlow.tsx`'s own "no session exists"
 * branch (§2.0 step 4/§3.10), the identical narrow condition that already
 * sets `invitationContext`, now further specialized. When set, this whole
 * component skips §3.2a's three-way choice entirely and mounts only §3.2g
 * (`LockedEmailStep`) → the shared `CodeStep`/§3.6 convergence — Google and
 * phone are structurally unreachable through this component while this
 * prop is set, per RFC 0014's own "the method must be fixed to Email"
 * ruling. `undefined` for every other mounting of this component (an
 * ordinary fresh open, a `settings.md §2.5` sign-out re-verification, a
 * §3.7e "No, elegir otro" retry via `AppRouter.tsx`), which is why both are
 * plain optional props rather than always-required ones — most callers
 * have nothing to thread here either.
 */
export function AuthenticationFlow({
  initialPrefill,
  onGoogleResolved,
  invitationContext,
  lockedInvitationEmail,
  onDeclineInvitation,
}: {
  initialPrefill?: { channel: Channel; value: string };
  onGoogleResolved?: (displayLabel: string | null) => void;
  invitationContext?: InvitationContext;
  lockedInvitationEmail?: string;
  onDeclineInvitation?: () => void;
} = {}) {
  const { startGoogleSignIn, resolveGoogleSignIn } = useStore();
  const [step, setStep] = useState<AuthStep>(() => computeInitialStep(initialPrefill, lockedInvitationEmail));

  useEffect(() => {
    if (step.kind !== 'google-verifying') return;
    let cancelled = false;
    resolveGoogleSignIn().then((result) => {
      if (cancelled) return;
      if (result.status === 'success') {
        onGoogleResolved?.(result.displayLabel);
        // AppRouter re-renders once `currentUserId` is set — nothing
        // further to do here, the identical "hands off silently" posture
        // `CodeStep.tsx`'s own `handleConfirm` already holds for phone/email.
        return;
      }
      if (result.status === 'error') {
        setStep({ kind: 'google-error' });
        return;
      }
      // §3.2c — a deliberate, stated distinction: cancellation is not an
      // error. Routes silently back to §3.2a, no message at all.
      setStep({ kind: 'choose' });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resolves
    // exactly once per mount into this step; re-running on every render, or
    // whenever `resolveGoogleSignIn`'s own function identity changes, would
    // replay the resolution unnecessarily.
  }, [step.kind]);

  async function handleGoogle() {
    setStep({ kind: 'google-redirecting' });
    const result = await startGoogleSignIn();
    if (!result.ok) {
      // A genuine send-time failure (§3.2d) — a real navigation never
      // started at all. A successful `startGoogleSignIn` means the browser
      // is already navigating away; nothing further renders here either way.
      setStep({ kind: 'google-error' });
    }
  }

  if (step.kind === 'choose') {
    return (
      <ScreenTransition transitionKey="choose">
        <ChooseMethodStep
          onGoogle={handleGoogle}
          onEmail={() => setStep({ kind: 'email' })}
          onPhone={() => setStep({ kind: 'phone' })}
          invitationContext={invitationContext}
        />
      </ScreenTransition>
    );
  }

  if (step.kind === 'google-redirecting' || step.kind === 'google-verifying') {
    return (
      <ScreenTransition transitionKey="google-progress">
        <GoogleProgress mode={step.kind === 'google-redirecting' ? 'redirecting' : 'verifying'} />
      </ScreenTransition>
    );
  }

  if (step.kind === 'google-error') {
    return (
      <ScreenTransition transitionKey="google-error">
        <GoogleError
          onRetry={handleGoogle}
          onChooseOther={() => setStep({ kind: 'choose' })}
          invitationContext={invitationContext}
        />
      </ScreenTransition>
    );
  }

  if (step.kind === 'invitation-email') {
    return (
      <ScreenTransition transitionKey="invitation-email-locked">
        <LockedEmailStep
          email={lockedInvitationEmail!}
          businessName={invitationContext?.businessName ?? ''}
          onCodeSent={() => setStep({ kind: 'code', channel: 'email', identifier: lockedInvitationEmail! })}
          onDecline={() => onDeclineInvitation?.()}
        />
      </ScreenTransition>
    );
  }

  if (step.kind === 'email') {
    return (
      <ScreenTransition transitionKey="email">
        <EmailStep
          initialValue={step.prefill}
          onBack={() => setStep({ kind: 'choose' })}
          onCodeSent={(email) => setStep({ kind: 'code', channel: 'email', identifier: email })}
          invitationContext={invitationContext}
        />
      </ScreenTransition>
    );
  }

  if (step.kind === 'code') {
    return (
      <ScreenTransition transitionKey="code">
        <CodeStep
          channel={step.channel}
          identifier={step.identifier}
          backLabelOverride={lockedInvitationEmail ? '← Atrás' : undefined}
          onBack={() =>
            setStep(
              lockedInvitationEmail
                ? { kind: 'invitation-email' }
                : step.channel === 'phone'
                  ? { kind: 'phone', prefill: step.identifier }
                  : { kind: 'email', prefill: step.identifier },
            )
          }
          invitationContext={invitationContext}
        />
      </ScreenTransition>
    );
  }

  // step.kind === 'phone'
  return (
    <ScreenTransition transitionKey="phone">
      <PhoneStep
        initialValue={step.prefill}
        onBack={() => setStep({ kind: 'choose' })}
        onCodeSent={(phone) => setStep({ kind: 'code', channel: 'phone', identifier: phone })}
        invitationContext={invitationContext}
      />
    </ScreenTransition>
  );
}
