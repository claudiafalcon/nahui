import { useEffect, useState } from 'react';
import { useStore, type OnboardingPath } from '../../domain/store';
import { pathFromCapabilities } from '../../domain/onboardingResolution';
import { DEMO_BUSINESS_DESCRIPTION, DEMO_BUSINESS_NAME, DEMO_SEED_LINES } from '../../domain/demoSeed';
import { Welcome } from './Welcome';
import { ConfirmPaid } from './ConfirmPaid';
import { ConfirmDemo } from './ConfirmDemo';
import { WritingState } from './WritingState';
import { BusinessIdentity } from './BusinessIdentity';
import { SellingGroups } from './SellingGroups';
import { TodoListo } from './TodoListo';

const CREATE_DELAY_MS = 260;

type PreWriteStep =
  | { kind: 'welcome' }
  | { kind: 'confirm-paid' }
  | { kind: 'confirm-demo' }
  | { kind: 'creating'; path: OnboardingPath }
  | { kind: 'creating-error'; path: OnboardingPath };

/**
 * onboarding.md — the first-run flow that establishes a Business, its
 * capabilities, its identity, and its initial Catalog. Mounted by
 * `AppRouter` once a device holds a verified session but Onboarding isn't
 * yet complete (`isOnboardingComplete`).
 *
 * Two distinct sources of truth compose this flow, deliberately:
 * - **Before any write happens** (§3.3's path choice, §3.4/§3.4c's
 *   confirmation) — nothing exists yet to persist, so this lives as local
 *   `preWrite` state. A reload before the first real write (§3.5) resets to
 *   §3.3 rather than resuming the exact confirm screen — a disclosed,
 *   low-cost simplification (README.md): per onboarding.md §2.1 case 5's
 *   own framing, "there's no typed data to preserve there, just a bare
 *   confirm tap not yet taken."
 * - **Once `state.business` exists** — every remaining step (identity,
 *   Selling Groups, the milestone) is resolved as a pure function of
 *   persisted `AppState`, exactly the pattern this pass's own design
 *   instruction calls for. This is what makes §2.1's resume guarantees
 *   (cases 2–4) come for free: a reload mid-identity-capture, mid-Selling-
 *   Groups, or with the milestone on screen all resume at the exact right
 *   step, because that step is recomputed from stored data, never a
 *   parallel tracker that could drift out of sync with it.
 */
export function OnboardingFlow() {
  const { state, completeOnboarding, setBusinessIdentity, createProducts, acknowledgeOnboarding, commitLot } =
    useStore();
  const [preWrite, setPreWrite] = useState<PreWriteStep>({ kind: 'welcome' });

  useEffect(() => {
    if (preWrite.kind !== 'creating') return;
    const t = window.setTimeout(() => {
      completeOnboarding(preWrite.path);
      if (preWrite.path === 'demo') {
        // onboarding.md §11 (narrowed per this pass's own scope decision —
        // see demoSeed.ts): identity + a real, stocked Catalog, no Event,
        // no Customer/Claim.
        setBusinessIdentity({ name: DEMO_BUSINESS_NAME, description: DEMO_BUSINESS_DESCRIPTION });
        commitLot(DEMO_SEED_LINES);
      }
      // No further transition needed here — once `state.business` exists,
      // the branch below takes over on the next render.
    }, CREATE_DELAY_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- store actions
    // are recreated every render; gating on `preWrite`'s own identity is
    // what actually controls when this effect re-runs, not those refs.
  }, [preWrite]);

  if (state.business) {
    const business = state.business;
    const path = pathFromCapabilities(business);

    if (business.name === '') {
      // §3.9/§3.9a/§3.10/§3.10a — real paths only; the demo path's seeded
      // identity is written atomically above and never leaves `name === ''`
      // on screen.
      return <BusinessIdentity onSaved={(fields) => setBusinessIdentity(fields)} />;
    }
    if (state.products.length === 0) {
      // §3.5b–§3.5e — real paths only; the demo path's seed always writes
      // ≥1 Product in the same batch as its Business, so this is never
      // reached there.
      return <SellingGroups onSaved={(lines) => createProducts(lines)} />;
    }
    if (!business.onboardingAcknowledged) {
      return <TodoListo path={path} onEnter={acknowledgeOnboarding} />;
    }
    // Fully complete — `AppRouter` will already be rendering `<App/>` by the
    // next tick; this branch only exists so the switch above is total.
    return null;
  }

  switch (preWrite.kind) {
    case 'welcome':
      return (
        <Welcome
          onChooseFree={() => setPreWrite({ kind: 'creating', path: 'free' })}
          onChoosePaid={() => setPreWrite({ kind: 'confirm-paid' })}
          onChooseDemo={() => setPreWrite({ kind: 'confirm-demo' })}
        />
      );
    case 'confirm-paid':
      return (
        <ConfirmPaid
          onConfirm={() => setPreWrite({ kind: 'creating', path: 'paid' })}
          onBack={() => setPreWrite({ kind: 'welcome' })}
        />
      );
    case 'confirm-demo':
      return (
        <ConfirmDemo
          onConfirm={() => setPreWrite({ kind: 'creating', path: 'demo' })}
          onBack={() => setPreWrite({ kind: 'welcome' })}
        />
      );
    case 'creating':
      // §3.5 — shared by all three paths, including the demo's seed
      // generation (§3.5's own reasoning: no separate "building your
      // example" sequence).
      return <WritingState label="Preparando todo…" />;
    case 'creating-error':
      // §3.5a — never actually reached in this build (this prototype's
      // local writes never fail), the same disclosed-not-wired convention
      // already established for this codebase's other sync-failure states.
      return (
        <WritingState
          error
          errorLabel="No pudimos crear tu negocio. Intenta de nuevo."
          onRetry={() => setPreWrite({ kind: 'creating', path: preWrite.path })}
        />
      );
  }
}
