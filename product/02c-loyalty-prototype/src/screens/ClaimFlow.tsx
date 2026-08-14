import { useEffect, useRef, useState } from 'react';
import { useLoyaltyStore } from '../domain/store';
import type { Business, ID } from '../domain/types';
import { AlreadyClaimed } from './AlreadyClaimed';
import { Declined } from './Declined';
import { EmailEntry } from './EmailEntry';
import { LinkUnavailable } from './LinkUnavailable';
import { LoadError } from './LoadError';
import { OptionalDetails } from './OptionalDetails';
import { Resolving } from './Resolving';
import { SaveError } from './SaveError';
import { Saving } from './Saving';
import { SuccessNew } from './SuccessNew';
import { SuccessReturning } from './SuccessReturning';

interface ClaimContext {
  businessId: ID;
  saleId: ID;
  business: Business;
}

type PendingWrite =
  | { kind: 'email'; email: string }
  | { kind: 'details'; email: string; ageRange?: string; gender?: string };

type FlowState =
  | { step: 'resolving' }
  | { step: 'resolve-error' }
  | { step: 'invalid' }
  | { step: 'already-claimed' }
  | { step: 'email'; ctx: ClaimContext }
  | { step: 'details'; ctx: ClaimContext; email: string }
  | { step: 'declined' }
  | { step: 'saving'; ctx: ClaimContext; pending: PendingWrite }
  | { step: 'save-error'; ctx: ClaimContext; pending: PendingWrite }
  | { step: 'success-new'; ctx: ClaimContext }
  | { step: 'success-returning'; ctx: ClaimContext };

/**
 * The state machine driving `customer-loyalty-registration.md` §4's full
 * interaction graph for one resolved Claim Token. Every screen this
 * renders is a full-page swap (never an inline spinner) — including the
 * moment "Continuar"/"Listo" is tapped, which immediately swaps to the
 * shared Guardando… state (§3.7/§3.8). This is this build's own,
 * stronger-than-required implementation of the Gap Analysis §3 UI-debounce
 * instruction ("disable Continuar/Listo while a write is in flight") —
 * the button isn't merely disabled, it's off-screen the instant a write
 * starts, so a double-tap is structurally impossible.
 */
export function ClaimFlow({ token }: { token: string }) {
  const store = useLoyaltyStore();
  const [flow, setFlow] = useState<FlowState>({ step: 'resolving' });
  const [resolveAttempt, setResolveAttempt] = useState(0);
  const screenRef = useRef<HTMLDivElement>(null);

  // Fix round (ux-critic Minor) — every state transition here is a full
  // component swap with no router, so nothing previously told assistive
  // tech a new screen had appeared. Rather than editing each of the 14
  // screens individually, this single effect moves focus to the new
  // screen's main heading (an <h1>) or, for headingless screens, its first
  // meaningful text (the first <p>) every time `flow.step` changes — the
  // DOM-order fallback works because `PoweredByFooter`'s own <p> always
  // renders last in every screen that has one, so it's never picked over
  // the screen's real content. `WaitState`'s own slow-label already covers
  // itself via `role="status"` (left untouched) — at the moment this effect
  // runs for `resolving`/`saving`, only the aria-hidden skeleton exists yet,
  // so the selector finds nothing and this is a deliberate no-op there.
  useEffect(() => {
    const container = screenRef.current;
    if (!container) return;
    const target = container.querySelector<HTMLElement>('h1') ?? container.querySelector<HTMLElement>('p');
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  }, [flow.step]);

  useEffect(() => {
    let cancelled = false;
    setFlow({ step: 'resolving' });

    // Fix round (Main, live-tested) — React 18 StrictMode double-invokes
    // this effect on mount (mount → synchronous cleanup → mount again),
    // entirely within one synchronous commit, before any microtask runs.
    // Calling `store.resolveToken` directly from here made *both*
    // invocations race `shouldSimulateFailure('resolve')`'s one-shot flag
    // against each other, keyed only to whichever call's randomized
    // network delay happened to finish first — including the phantom,
    // already-cancelled first invocation, which could "use up" a
    // demo-armed `?flaky=resolve` failure for nothing, leaving the real
    // (surviving) invocation to succeed silently and `LoadError` never
    // shown. Deferring the actual call to a microtask fixes this
    // deterministically: `cancelled` for the phantom invocation is already
    // `true` by the time its microtask runs (StrictMode's cleanup is
    // synchronous and runs before any microtask), so it skips calling
    // `resolveToken` entirely — only the surviving invocation ever reaches
    // the store, exactly once, in both dev (StrictMode double-invoke) and
    // production (single invoke, `cancelled` still `false` when its own
    // microtask runs, so it proceeds exactly as before).
    queueMicrotask(() => {
      if (cancelled) return;
      store
        .resolveToken(token)
        .then((result) => {
          if (cancelled) return;
          if (result.kind === 'invalid') {
            setFlow({ step: 'invalid' });
          } else if (result.kind === 'fully-claimed') {
            setFlow({ step: 'already-claimed' });
          } else {
            setFlow({
              step: 'email',
              ctx: { businessId: result.businessId, saleId: result.saleId, business: result.business },
            });
          }
        })
        .catch(() => {
          if (!cancelled) setFlow({ step: 'resolve-error' });
        });
    });

    return () => {
      cancelled = true;
    };
    // token/resolveAttempt are the only inputs this resolution should
    // re-run for — `store`'s functions read fresh state internally on
    // every call and don't need to be a dependency here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, resolveAttempt]);

  function submitEmailStep(ctx: ClaimContext, email: string) {
    const pending: PendingWrite = { kind: 'email', email };
    setFlow({ step: 'saving', ctx, pending });
    store
      .submitEmail(ctx.saleId, ctx.businessId, email)
      .then((result) => {
        if (result.kind === 'existing-customer') {
          setFlow({ step: 'success-returning', ctx });
        } else {
          setFlow({ step: 'details', ctx, email });
        }
      })
      .catch(() => {
        setFlow({ step: 'save-error', ctx, pending });
      });
  }

  function submitDetailsStep(ctx: ClaimContext, email: string, ageRange: string | undefined, gender: string | undefined) {
    const pending: PendingWrite = { kind: 'details', email, ageRange, gender };
    setFlow({ step: 'saving', ctx, pending });
    store
      .submitDetails(ctx.saleId, ctx.businessId, email, ageRange, gender)
      .then(() => {
        setFlow({ step: 'success-new', ctx });
      })
      .catch(() => {
        setFlow({ step: 'save-error', ctx, pending });
      });
  }

  function retrySave(ctx: ClaimContext, pending: PendingWrite) {
    if (pending.kind === 'email') submitEmailStep(ctx, pending.email);
    else submitDetailsStep(ctx, pending.email, pending.ageRange, pending.gender);
  }

  function renderScreen() {
    switch (flow.step) {
      case 'resolving':
        return <Resolving />;
      case 'resolve-error':
        return <LoadError onRetry={() => setResolveAttempt((n) => n + 1)} />;
      case 'invalid':
        return <LinkUnavailable />;
      case 'already-claimed':
        return <AlreadyClaimed />;
      case 'email':
        return (
          <EmailEntry
            businessName={flow.ctx.business.name}
            businessLogo={flow.ctx.business.logo}
            submitting={false}
            onContinue={(email) => submitEmailStep(flow.ctx, email)}
            onDecline={() => setFlow({ step: 'declined' })}
          />
        );
      case 'details':
        return (
          <OptionalDetails
            businessName={flow.ctx.business.name}
            businessLogo={flow.ctx.business.logo}
            submitting={false}
            onListo={(ageRange, gender) => submitDetailsStep(flow.ctx, flow.email, ageRange, gender)}
            onDecline={() => setFlow({ step: 'declined' })}
          />
        );
      case 'declined':
        return <Declined />;
      case 'saving':
        return <Saving />;
      case 'save-error':
        return <SaveError onRetry={() => retrySave(flow.ctx, flow.pending)} />;
      case 'success-new':
        return <SuccessNew businessName={flow.ctx.business.name} businessLogo={flow.ctx.business.logo} />;
      case 'success-returning':
        return <SuccessReturning businessName={flow.ctx.business.name} businessLogo={flow.ctx.business.logo} />;
    }
  }

  // `display: contents` keeps this wrapper invisible to layout (Card's own
  // `.page` already sets its own `min-height: 100vh`) — it exists purely to
  // give the focus-management effect above a DOM node to query into.
  return (
    <div ref={screenRef} style={{ display: 'contents' }}>
      {renderScreen()}
    </div>
  );
}
