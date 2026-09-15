import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { phoneMismatchConfirmationTarget, mismatchDisplayValue } from '../../domain/authResolution';
import { Button } from '../../components/Button/Button';
import { BrandMark } from '../../components/BrandMark/BrandMark';
import { ResolvingState } from '../../components/ResolvingState/ResolvingState';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import { AuthenticationFlow } from './AuthenticationFlow';
import { PhoneMismatchConfirm } from './PhoneMismatchConfirm';
import styles from './InvitationFlow.module.css';

type Step =
  | { kind: 'resolving' }
  | { kind: 'resolve-error' }
  | { kind: 'not-available' }
  | { kind: 'offer'; businessName: string }
  | { kind: 'mismatch-confirm'; businessName: string }
  | {
      kind: 'authenticating';
      businessName: string;
      /** Set only when this step is (re)entered from `'mismatch-confirm'`'s
       * own "No, elegir otro" — the just-typed, just-rejected value
       * preserved for editing, the identical pre-fill courtesy
       * `AppRouter.tsx`'s own §3.7e mechanism already gives (`AuthenticationFlow`'s
       * own `initialPrefill` prop, threaded through unchanged). `undefined`
       * for every other way this step is entered. */
      prefill?: { channel: 'phone' | 'email'; value: string };
    }
  | { kind: 'accepting'; businessName: string }
  | { kind: 'accept-error'; businessName: string }
  | { kind: 'welcome'; businessName: string }
  | { kind: 'already-member'; businessName: string }
  | { kind: 'revoked'; businessName: string };

/**
 * `authentication.md` §3.8's own extended resumability range, mirrored from
 * `AuthenticationFlow.tsx`'s own `computeInitialStep` (`ux-critic` MAJ1 fix,
 * 2026-09-14) — the one signal available on a fresh mount that this is
 * actually a resumed Google-redirect return, not a genuinely fresh open.
 * Needed here specifically because `InvitationFlow` holds the *highest*
 * render precedence in `AppRouter.tsx` (`invitationGateActive`, checked
 * before `!authenticated`): on return from Google with `/invite/<token>`
 * still in the URL, this component remounts fresh — `AuthenticationFlow`'s
 * own hash-detection never gets a chance to run at all unless this
 * component's own `resolveToken` (below) explicitly routes into the
 * `'authenticating'` step for it, instead of defaulting to `'offer'`.
 */
function hasGoogleRedirectSignal(): boolean {
  if (typeof window === 'undefined') return false;
  const { hash, search } = window.location;
  return hash.includes('access_token') || hash.includes('error') || search.includes('error');
}

/**
 * authentication.md §2.0 / §2.2's new case 0 / §2.2a / §3.9a-§3.9b /
 * §3.10-§3.13a (RFC 0013, `decision-log.md` D64) — the full pre-auth
 * Invitation-link resolution and acceptance gate. Mounted by `AppRouter.tsx`
 * whenever the app was opened via `/invite/<token>`, **before** every other
 * check `AppRouter.tsx` otherwise runs (§2.0's own "checked before every
 * other check in §2" sequencing) — while this component is mounted, it is
 * the sole renderer; `AppRouter.tsx`'s own ordinary `authenticated`/
 * `needsPhoneMismatchConfirmation`/`isSeller`/`isOnboardingComplete` branches
 * never run until this component calls `onDone`.
 *
 * **Rebuilt in full 2026-09-14 — RFC 0013 rework of the entire Invitation-
 * acceptance surface (Migration Workflow).** The previous build
 * (`authentication.changelog.md#2026-09-06-invitation-acceptance` era)
 * discovered a pending Invitation implicitly, via a phone match at
 * OTP-confirm/session-resume, and was reached only from an
 * already-authenticated device. That mechanism no longer exists — RFC 0013
 * §2/§6 eliminates implicit phone-match discovery outright. This build
 * discovers the Invitation by explicit link only (`peekInvitation`, no
 * authentication required to see the offer at all) and, for a session-less
 * device, drives its own inline `AuthenticationFlow` instance to authenticate
 * *in service of* accepting — never handing off to `onboarding.md`'s
 * ordinary Business-creation flow, per §2.2's new case 0.
 *
 * **Why almost every branch below simply calls `onDone` rather than
 * resolving its own destination.** §3.10/§3.10d/§3.10e/§3.13a's own
 * "Behavior" text each independently resolve to either `onboarding.md
 * §2.1`'s ordinary session resolution or `authentication.md`'s own ordinary
 * §2.2 cases 1-3 — both of which `AppRouter.tsx`'s existing ordinary
 * branches (`needsPhoneMismatchConfirmation` / `isSeller` /
 * `isOnboardingComplete`) *already* correctly implement, unconditionally, off
 * whatever `AppState` looks like at the moment control returns to them. So
 * every one of those citations reduces to the identical mechanism here:
 * unmount this gate and let `AppRouter.tsx`'s already-correct ordinary
 * resolution run. This is deliberate reuse (this folder's own §4
 * shared-state discipline extended to code), not a simplification that
 * skips real branching the spec asks for.
 *
 * **§2.2 case 0's device-history/§3.7e bypass is structural, not a separate
 * check.** Case 0 is "checked FIRST... skip cases 1-3 entirely" — this
 * component's own `AuthenticationFlow` instance (mounted for the
 * `'authenticating'` step) is never swapped for `PhoneMismatchConfirm`
 * (`AppRouter.tsx`'s own §3.7e mechanism lives one level up, and this
 * component fully preempts that level while mounted) — so §3.7e provably
 * never fires while a token is being carried, exactly matching case 0's own
 * "never §3.7e" rule, with no extra flag or suppression logic needed.
 * `User.phoneMismatchConfirmationPending` may still get set by
 * `resolveAuthIdentity` on this same verification (a plain device-history
 * fact, true regardless of why she's authenticating) — left untouched here;
 * if this attempt's outcome is `invitation_not_available` (§2.2a's own
 * "falls through to §2.2's ordinary cases 1-3" instruction), `onDone`
 * hands off to `AppRouter.tsx`'s ordinary branches, which correctly
 * re-consult that same still-set flag and show §3.7e then, if warranted —
 * the exact "falls through to cases 1-3" behavior the spec asks for, for
 * free.
 *
 * **§2.0 step 4's own "(and §3.3-§3.7e, wherever this path reaches them)"
 * Invitation-context-copy citation is disclosed as partially inapplicable
 * here, not silently narrowed:** since case 0 structurally never reaches
 * §3.7e (previous paragraph), the Invitation-context line
 * (`InvitationContextLine`) is threaded through every §3.2a-§3.2f/§3.3-§3.7d
 * screen `AuthenticationFlow` renders while carrying `invitationContext`,
 * but never reaches a §3.7e render at all on this path — not a gap, a direct
 * consequence of case 0's own bypass.
 *
 * **`reviewer` Blocker B1 fix, 2026-09-14 — the `'mismatch-confirm'` step.**
 * The paragraph above is about *fresh* authentication started through this
 * gate (case 0, structurally never reaches §3.7e — unchanged, still true).
 * It says nothing about a device that *already* holds a valid session sitting
 * on an unconfirmed §3.7e gate the moment she opens `/invite/<token>` — §2.0
 * step 4's "does this device currently hold a valid, verified session?" test
 * explicitly means "§2.1 step 1's existing test," itself defined as holding a
 * session "with no §3.7e confirmation left pending" — never a bare
 * `state.currentUserId != null` check. `handleAccept` below now consults the
 * same `phoneMismatchConfirmationTarget` derivation `AppRouter.tsx` uses for
 * its own ordinary §3.7e branch (`domain/authResolution.ts`) before deciding
 * "valid session, run the write" vs. "no session, authenticate first" — a
 * third outcome, "session exists but sits on an unconfirmed §3.7e gate,"
 * routes into `'mismatch-confirm'` instead, reusing `PhoneMismatchConfirm.tsx`
 * inline (never handing off to `AppRouter.tsx`'s own §3.7e branch, which is
 * structurally unreachable while `invitationGateActive` is true anyway, and
 * would lose this screen's own Invitation context even if it weren't) —
 * threading the same `InvitationContextLine` M1 pattern through it via its
 * new `invitationContext` prop. Only once she confirms ("Sí, es mío/mía")
 * does the accept write actually run.
 */
export function InvitationFlow({ token, onDone }: { token: string; onDone: () => void }) {
  const { state, peekInvitation, acceptInvitation, retryHydration, confirmPhoneMismatch, retractMistypedVerification } =
    useStore();
  const [step, setStep] = useState<Step>({ kind: 'resolving' });
  // §3.7e's own display value for the Google channel specifically — read
  // live from the OAuth session at the moment it resolved (this component's
  // own inline `AuthenticationFlow`'s `onGoogleResolved` callback), never
  // persisted anywhere (RFC 0012 §1). Mirrors `AppRouter.tsx`'s own identical
  // state, needed here too now that this component can mount its own
  // `'mismatch-confirm'` step (Blocker B1 fix).
  const [googleDisplayLabel, setGoogleDisplayLabel] = useState<string | null>(null);
  // MAJ1 fix — captured once, at mount: whether this fresh mount is actually
  // a resumed Google-redirect return while `/invite/<token>` is still the
  // active URL. See `hasGoogleRedirectSignal`'s own doc comment above.
  const [resumedGoogleRedirect] = useState<boolean>(() => hasGoogleRedirectSignal());
  // Reused across every retry of the *same* logical "Aceptar y empezar a
  // vender" attempt (`architecture-principles.md` #7) — cleared once that
  // attempt is genuinely settled, so a later, distinct attempt (a fresh
  // "Aceptar" tap after landing back on the offer — not reachable in this
  // build, since a resolved outcome never returns to `'offer'`, but kept for
  // correctness) starts a fresh key.
  const acceptKeyRef = useRef<string | null>(null);

  // §2.0 steps 1-3 — resolve the token by itself, read-only, no
  // authentication of any kind (RFC 0013 §2 step 2).
  async function resolveToken() {
    setStep({ kind: 'resolving' });
    const result = await peekInvitation(token);
    if (!result) {
      setStep({ kind: 'resolve-error' }); // §3.9b — the read itself failed outright
      return;
    }
    if (result === 'not-found' || result.status !== 'pending') {
      // Not found, already accepted, revoked, or expired — this document
      // "has no reliable way to distinguish these cases and shouldn't
      // guess" (§2.0 step 2's own text).
      setStep({ kind: 'not-available' });
      return;
    }
    if (resumedGoogleRedirect && state.currentUserId == null) {
      // MAJ1 fix — she already tapped "Aceptar" and left for Google before
      // this remount; skip the offer screen outright and mount the inline
      // `AuthenticationFlow` directly, the same destination `handleAccept`
      // below would have produced. `AuthenticationFlow`'s own
      // `computeInitialStep` independently detects the identical hash signal
      // on its own mount and resumes straight into `'google-verifying'`,
      // consuming the credential without a second tap.
      setStep({ kind: 'authenticating', businessName: result.businessName });
      return;
    }
    setStep({ kind: 'offer', businessName: result.businessName });
  }

  useEffect(() => {
    void resolveToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resolves once
    // on mount, for this one token; a "Reintentar" tap (§3.9b) replays via
    // `resolveToken` directly, not by re-running this effect.
  }, []);

  /** §2.2a — the acceptance write itself, reached either directly from the
   * offer (an already-valid session) or the instant authentication
   * completes for a token carried through it (§2.2's new case 0). */
  async function runAccept(businessName: string) {
    setStep({ kind: 'accepting', businessName });
    if (!acceptKeyRef.current) acceptKeyRef.current = crypto.randomUUID();
    const result = await acceptInvitation(token, acceptKeyRef.current);
    if (!result) {
      setStep({ kind: 'accept-error', businessName }); // §3.10b — Reintentar replays with the same key
      return;
    }
    acceptKeyRef.current = null; // this logical attempt is settled
    if ('error' in result) {
      if (result.error === 'invitation_not_available') {
        setStep({ kind: 'not-available' }); // §3.13a, reused verbatim
      } else if (result.error === 'already_member') {
        void retryHydration(); // she may hold this Membership via a path this device never hydrated for yet
        setStep({ kind: 'already-member', businessName });
      } else {
        // membership_revoked — deliberately does not accept, no
        // `retryHydration` call: nothing new to load, she still has no
        // standing here.
        setStep({ kind: 'revoked', businessName });
      }
      return;
    }
    void retryHydration(); // populate state.business/memberships for the fresh SELLER Membership before "Ir a Hoy"
    setStep({ kind: 'welcome', businessName });
  }

  function handleAccept(businessName: string) {
    // §2.0 step 4 — "Does this device currently hold a valid, verified
    // session?" explicitly means "§2.1 step 1's existing test": a valid
    // session **with no §3.7e confirmation left pending** (Blocker B1 fix —
    // see this component's own doc comment above). Checked before the bare
    // `currentUserId` test below, since a device can hold a live session and
    // still owe this confirmation.
    if (phoneMismatchConfirmationTarget(state)) {
      setStep({ kind: 'mismatch-confirm', businessName });
      return;
    }
    if (state.currentUserId != null) {
      // YES → the write runs immediately, no authentication detour at all.
      void runAccept(businessName);
    } else {
      // NO → §3.2a-§3.2f, carrying the token forward.
      setStep({ kind: 'authenticating', businessName });
    }
  }

  // Once authentication completes for a token-carrying attempt, `AppRouter`'s
  // own store-level session resolves and `state.currentUserId` flips
  // non-null — proceed straight to §2.2a, never to `onboarding.md §3.3` or
  // any device-history confirmation (see this component's own doc comment,
  // above, for why §3.7e is structurally unreachable on this path).
  useEffect(() => {
    if (step.kind !== 'authenticating') return;
    if (state.currentUserId == null) return;
    void runAccept(step.businessName);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reacts to
    // `currentUserId` flipping non-null while `step.kind` is
    // 'authenticating'; `runAccept` immediately transitions `step` away from
    // 'authenticating', which is what actually guards against a repeat call.
  }, [step.kind, state.currentUserId]);

  if (step.kind === 'resolving') {
    // §3.9a — shares §3.1/§3.2's own near-instant/slow convention, cited not
    // redescribed.
    return <ResolvingState />;
  }

  if (step.kind === 'resolve-error') {
    return (
      <div className={styles.wrap}>
        <p className={styles.body}>No pudimos abrir esta invitación. Intenta de nuevo.</p>
        <Button className={styles.cta} onClick={() => void resolveToken()}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (step.kind === 'not-available') {
    return (
      <ScreenTransition transitionKey="invitation-not-available">
        <div className={styles.wrap}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Nahui</p>
            <h1 className={styles.heading}>Esta invitación ya no está disponible</h1>
            <p className={styles.body}>Si crees que esto es un error, habla con quien te invitó.</p>
          </div>
          <Button className={styles.cta} onClick={onDone}>
            Continuar
          </Button>
        </div>
      </ScreenTransition>
    );
  }

  if (step.kind === 'offer') {
    return (
      <ScreenTransition transitionKey="invitation-offer">
        <div className={styles.wrap}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Nahui</p>
            <h1 className={styles.heading}>Te invitaron a vender</h1>
            <p className={styles.body}>Te invitaron a vender con {step.businessName}.</p>
            <p className={styles.body}>
              Vas a poder abrir tus propias sesiones de venta y registrar ventas, usando su Catálogo y sus precios.
            </p>
          </div>
          <div className={styles.ctaStack}>
            <Button className={styles.cta} onClick={() => handleAccept(step.businessName)}>
              Aceptar y empezar a vender
            </Button>
            <Button className={styles.cta} variant="secondary" onClick={onDone}>
              Ahora no
            </Button>
          </div>
        </div>
      </ScreenTransition>
    );
  }

  if (step.kind === 'mismatch-confirm') {
    const target = phoneMismatchConfirmationTarget(state);
    if (!target) {
      // Defensive — unreachable through the real UI: only `onConfirm`/
      // `onCorrect` below ever leave this step, and both resolve the
      // condition themselves before doing so. Falls through to the accept
      // write rather than stalling, in case this is ever hit.
      void runAccept(step.businessName);
      return <ResolvingState />;
    }
    // Disclosed, deliberate reuse — `PhoneMismatchConfirm.tsx`'s own base
    // copy ("todavía no tiene un negocio en Nahui... empezamos tu negocio
    // aquí") is written for its ordinary Business-creation destination and
    // is reused here verbatim, per this fix's own explicit instruction
    // ("reusing PhoneMismatchConfirm.tsx"), stacking only the Invitation-
    // context line on top — the identical M1 composition every other screen
    // in this sub-flow already uses, never altering the base screen's own
    // wording per-caller. This exact composition (session-already-exists +
    // unconfirmed §3.7e + an Invitation in flight) isn't itself worked
    // through in `authentication.md` §3.7e's own wireframe text — a narrow,
    // rare edge case (backgrounded mid-verification, then opening an invite
    // link) `reviewer`'s Blocker B1 finding surfaced at the implementation
    // level, not something §3.7e's own copy was written against. Flagged
    // here rather than silently smoothed over with invented copy, which is
    // `ux-designer`/Main's call, not this layer's.
    return (
      <PhoneMismatchConfirm
        channel={target.identity.type}
        displayValue={mismatchDisplayValue(target.identity, googleDisplayLabel)}
        invitationContext={{ businessName: step.businessName }}
        onConfirm={() => {
          confirmPhoneMismatch();
          void runAccept(step.businessName);
        }}
        onCorrect={() => {
          // Same "No, elegir otro" mechanism `AppRouter.tsx`'s own §3.7e
          // branch uses — preserve the just-typed value for the
          // freshly-remounted `AuthenticationFlow` below (phone/email only,
          // §3.7e's own text), revert this User row's own verification, then
          // return to this flow's own `'authenticating'` step (never
          // `AppRouter.tsx`'s ordinary `!authenticated` branch, which would
          // lose this screen's Invitation context — `invitationGateActive`
          // keeps this component mounted throughout regardless).
          const businessName = step.businessName;
          if (target.identity.type === 'phone' || target.identity.type === 'email') {
            setStep({
              kind: 'authenticating',
              businessName,
              prefill: { channel: target.identity.type, value: target.identity.identifier },
            });
          } else {
            setStep({ kind: 'authenticating', businessName });
          }
          // `retractMistypedVerification` is now `Promise<void>` (`reviewer`
          // Blocker fix, 2026-09-14) — fire-and-forget is still correct
          // here: `setStep` above already moved this flow to
          // `'authenticating'` synchronously, so nothing here needs to wait
          // on the real Supabase sign-out completing before re-rendering.
          void retractMistypedVerification();
        }}
      />
    );
  }

  if (step.kind === 'authenticating') {
    return (
      <AuthenticationFlow
        invitationContext={{ businessName: step.businessName }}
        initialPrefill={step.prefill}
        onGoogleResolved={setGoogleDisplayLabel}
      />
    );
  }

  if (step.kind === 'accepting') {
    // §3.10a — near-instant convention, matching every other write in this
    // flow; the "slow" (>~1.5s) variant is architecturally unreached here,
    // same posture PhoneStep/CodeStep already establish for their own
    // synchronous mock/RPC writes.
    return <p className={styles.savingLine}>Uniéndote a {step.businessName}…</p>;
  }

  if (step.kind === 'accept-error') {
    return (
      <div className={styles.wrap}>
        <p className={styles.body}>No pudimos completar esto. Sigue aquí, intenta de nuevo.</p>
        <Button className={styles.cta} onClick={() => void runAccept(step.businessName)}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (step.kind === 'welcome') {
    return (
      <ScreenTransition transitionKey="invitation-welcome">
        <div className={styles.wrap}>
          <div className={styles.mark}>
            <BrandMark />
          </div>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Nahui</p>
            <h1 className={styles.heading}>Ya quedaste registrada</h1>
            <p className={styles.body}>Ya quedaste registrada con {step.businessName}.</p>
            <p className={styles.body}>Cuando quieras vender, abre tu sesión aquí.</p>
          </div>
          <Button className={styles.cta} onClick={onDone}>
            Ir a Hoy
          </Button>
        </div>
      </ScreenTransition>
    );
  }

  if (step.kind === 'already-member') {
    // §3.10d — reuses §3.10c's exact closing line and single confirming tap;
    // the destination is identical either way.
    return (
      <ScreenTransition transitionKey="invitation-already-member">
        <div className={styles.wrap}>
          <div className={styles.mark}>
            <BrandMark />
          </div>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>Nahui</p>
            <h1 className={styles.heading}>Ya formas parte del equipo</h1>
            <p className={styles.body}>Ya formas parte del equipo de {step.businessName}.</p>
            <p className={styles.body}>Cuando quieras vender, abre tu sesión aquí.</p>
          </div>
          <Button className={styles.cta} onClick={onDone}>
            Ir a Hoy
          </Button>
        </div>
      </ScreenTransition>
    );
  }

  // step.kind === 'revoked' — §3.10e
  return (
    <ScreenTransition transitionKey="invitation-revoked">
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Nahui</p>
          <h1 className={styles.heading}>Ya no tienes acceso</h1>
          <p className={styles.body}>Ya no tienes acceso para vender con {step.businessName}.</p>
          <p className={styles.body}>Si crees que esto es un error, habla con quien te invitó.</p>
        </div>
        <Button className={styles.cta} onClick={onDone}>
          Entendido
        </Button>
      </div>
    </ScreenTransition>
  );
}
