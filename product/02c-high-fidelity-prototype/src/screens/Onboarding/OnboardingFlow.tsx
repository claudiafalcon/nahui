import { useEffect, useState } from 'react';
import { useStore, type OnboardingPath } from '../../domain/store';
import { businessForCurrentUser, pathFromCapabilities } from '../../domain/onboardingResolution';
import { DEMO_BUSINESS_DESCRIPTION, DEMO_BUSINESS_NAME, DEMO_SEED_LINES } from '../../domain/demoSeed';
import { Welcome } from './Welcome';
import { ConfirmPaid } from './ConfirmPaid';
import { ConfirmDemo } from './ConfirmDemo';
import { WritingState } from './WritingState';
import { BusinessIdentity } from './BusinessIdentity';
import { SellingGroups } from './SellingGroups';
import { TodoListo } from './TodoListo';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';

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
 *   low-cost simplification (docs/passes/slice-2-authentication-onboarding.md): per onboarding.md §2.1 case 5's
 *   own framing, "there's no typed data to preserve there, just a bare
 *   confirm tap not yet taken."
 * - **Once `state.business` exists *and belongs to `state.currentUser`***
 *   (`businessForCurrentUser` — an OWNER `BusinessMembership` actually joins
 *   the two, RFC 0007/D44) — every remaining step (identity, Selling
 *   Groups, the milestone) is resolved as a pure function of persisted
 *   `AppState`, exactly the pattern this pass's own design instruction
 *   calls for. This is what makes §2.1's resume guarantees (cases 2–4) come
 *   for free: a reload mid-identity-capture, mid-Selling-Groups, or with
 *   the milestone on screen all resume at the exact right step, because
 *   that step is recomputed from stored data, never a parallel tracker
 *   that could drift out of sync with it. The membership check specifically
 *   is what keeps a brand-new phone (`authentication.md` §2.2 case 1) from
 *   being silently resumed into a *different*, previously-onboarded
 *   phone's stale `state.business` on the same device — this is the same
 *   distinction `isOnboardingComplete` makes, and for the same reason (bug
 *   found by `merchant-user-tester`, fixed here — see
 *   docs/passes/slice-2-authentication-onboarding.md's fix disclosure).
 */
export function OnboardingFlow() {
  const { state, completeOnboarding, setBusinessIdentity, acknowledgeOnboarding, commitLot } = useStore();
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

  const business = businessForCurrentUser(state);
  if (business) {
    const path = pathFromCapabilities(business);

    if (business.name === '') {
      // §3.9/§3.9a/§3.10/§3.10a — real paths only; the demo path's seeded
      // identity is written atomically above and never leaves `name === ''`
      // on screen.
      return (
        <ScreenTransition transitionKey="identity">
          <BusinessIdentity onSaved={(fields) => setBusinessIdentity(fields)} />
        </ScreenTransition>
      );
    }
    if (state.products.length === 0) {
      // §3.5b–§3.5e — real paths only; the demo path's seed always writes
      // ≥1 Product in the same batch as its Business, so this is never
      // reached there.
      //
      // As of `product-decisions.md` Q20: every committed Selling Group is
      // unconditionally a to-be-minted Product (a first-run Catalog is
      // guaranteed empty, §3.5b) — so each line maps straight to a
      // `CommitLotLine` with `product.kind: 'new'`, and the whole batch
      // writes through `commitLot`, the identical atomic Product+Lot+
      // InventoryEntry+InventoryUnit mechanism `inventory.md`'s own
      // "Registrar mercancía" uses — never the old, Product-only
      // `createProducts` write, retired by this amendment.
      return (
        <ScreenTransition transitionKey="selling-groups">
          <SellingGroups
            onSaved={(lines) =>
              commitLot(
                lines.map((l) => ({
                  quantity: l.quantity,
                  product: { kind: 'new' as const, name: l.name, defaultPrice: l.defaultPrice },
                })),
              )
            }
          />
        </ScreenTransition>
      );
    }
    if (!business.onboardingAcknowledged) {
      return (
        <ScreenTransition transitionKey="todo-listo">
          <TodoListo path={path} onEnter={acknowledgeOnboarding} />
        </ScreenTransition>
      );
    }
    // Fully complete — `AppRouter` will already be rendering `<App/>` by the
    // next tick; this branch only exists so the switch above is total.
    return null;
  }

  switch (preWrite.kind) {
    case 'welcome':
      return (
        <ScreenTransition transitionKey="welcome">
          <Welcome
            onChooseFree={() => setPreWrite({ kind: 'creating', path: 'free' })}
            onChoosePaid={() => setPreWrite({ kind: 'confirm-paid' })}
            onChooseDemo={() => setPreWrite({ kind: 'confirm-demo' })}
          />
        </ScreenTransition>
      );
    case 'confirm-paid':
      return (
        <ScreenTransition transitionKey="confirm-paid">
          <ConfirmPaid
            onConfirm={() => setPreWrite({ kind: 'creating', path: 'paid' })}
            onBack={() => setPreWrite({ kind: 'welcome' })}
          />
        </ScreenTransition>
      );
    case 'confirm-demo':
      return (
        <ScreenTransition transitionKey="confirm-demo">
          <ConfirmDemo
            onConfirm={() => setPreWrite({ kind: 'creating', path: 'demo' })}
            onBack={() => setPreWrite({ kind: 'welcome' })}
          />
        </ScreenTransition>
      );
    case 'creating':
      // §3.5 — shared by all three paths, including the demo's seed
      // generation (§3.5's own reasoning: no separate "building your
      // example" sequence).
      return (
        <ScreenTransition transitionKey="creating">
          <WritingState label="Preparando todo…" />
        </ScreenTransition>
      );
    case 'creating-error':
      // §3.5a — never actually reached in this build (this prototype's
      // local writes never fail), the same disclosed-not-wired convention
      // already established for this codebase's other sync-failure states.
      return (
        <ScreenTransition transitionKey="creating-error">
          <WritingState
            error
            errorLabel="No pudimos crear tu negocio. Intenta de nuevo."
            onRetry={() => setPreWrite({ kind: 'creating', path: preWrite.path })}
          />
        </ScreenTransition>
      );
  }
}
