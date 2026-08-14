import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import type { Business } from '../../domain/types';
import { addDaysToKey, formatDateRange, formatShortDate, todayKey } from '../../domain/dates';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { ActionConfirm } from './ActionConfirm';
import { WritingState } from './WritingState';
import styles from './SettingsScreen.module.css';

/** settings.md §2.2 — the four real capability actions, each reachable
 * through the generic immediate-effect confirm screen (§3.4) except
 * `downgrade`, which uses the deferred-effect one (§3.5). `cancel-pending`
 * (§3.7) has no confirm *screen* of its own — only the Sheet — but shares
 * the same §3.9/§3.10 write/error states as every other action. */
type ConfirmAction = 'activate-paid' | 'tags-on' | 'tags-off' | 'downgrade';
type ActionKind = ConfirmAction | 'cancel-pending';

type SubView =
  | { kind: 'main' }
  | { kind: 'confirm'; action: ConfirmAction }
  | { kind: 'saving'; action: ActionKind }
  | { kind: 'saving-error'; action: ActionKind };

const SAVE_DELAY_MS = 260; // this codebase's own near-instant convention (RegisterMerchandise, SellingGroups, OnboardingFlow)

/** settings.md §3.4/§3.5's exact copy per action — `downgrade`'s illustrative
 * effective date (Q11 open) is computed fresh from today, the same
 * deterministic rule `requestDowngradeToFree` itself applies at write time,
 * so the preview shown here and the value actually written always agree as
 * long as both happen the same day (always true within one interaction). */
function confirmCopy(action: ConfirmAction): { title: string; body: string[]; ctaLabel: string } {
  switch (action) {
    case 'activate-paid':
      return {
        title: 'Activar plan de pago',
        body: [
          'Vas a poder vender con tags, además de botones. También vas a poder ver cómo te va por cada bazar, y la sección de tus clientas frecuentes y ocasionales en Resultados — esta última te va a mostrar datos reales en cuanto tengas compras registradas.',
          'Esto se activa confirmando tu pago fuera de la app — no se te cobra nada aquí. Si ya lo arreglaste, confirma abajo.',
        ],
        ctaLabel: 'Confirmar y activar',
      };
    case 'tags-on':
      return {
        title: 'Cambiar a vender con tags',
        body: [
          'Desde tu próxima sesión, vas a empezar vendiendo con tags, siempre que tengas mercancía etiquetada lista. Si no tienes tags listos ese día, vendes con botones sin problema.',
        ],
        ctaLabel: 'Cambiar ahora',
      };
    case 'tags-off':
      return {
        title: 'Cambiar a vender con botones',
        body: [
          'Desde tu próxima sesión, vas a empezar vendiendo con botones. Puedes volver a cambiarlo cuando quieras.',
        ],
        ctaLabel: 'Cambiar ahora',
      };
    case 'downgrade': {
      const effectiveDate = addDaysToKey(todayKey(), 30);
      return {
        title: 'Volver al plan gratis',
        body: [
          `Tu plan de pago sigue activo hasta el final de tu periodo actual, el ${formatDateRange(effectiveDate, effectiveDate)}. Después de esa fecha ya no vas a poder vender con tags — vas a vender con botones —, dejas de ver cómo te va por cada bazar, y clientes frecuentes deja de estar disponible: no se junta información nueva de tus clientas ni se muestra en Resultados. No perdemos tu historial.`,
        ],
        ctaLabel: 'Confirmar cambio',
      };
    }
  }
}

/**
 * settings.md — Configuración, the merchant-facing surface for
 * `subscriptionTier`/`defaultSellingMode` (§2.2) plus the account-level
 * "Cerrar sesión" action (§2.5). §3.1/§3.2 (Resolving, near-instant/slow)
 * are architecturally inapplicable in this build — state loads synchronously
 * from `localStorage`, the identical posture already established for every
 * other tab's own resolving/defensive-fallback states — see `BACKLOG.md`'s
 * migration inventory, section (A), for the full consolidated disclosure.
 */
export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const {
    state,
    activatePaidPlan,
    requestDowngradeToFree,
    cancelPendingSubscriptionTierChange,
    changeDefaultSellingMode,
    reconcilePendingSubscriptionTier,
    signOut,
  } = useStore();
  const business = state.business;

  const [subView, setSubView] = useState<SubView>({ kind: 'main' });
  const [cancelPendingOpen, setCancelPendingOpen] = useState(false);
  const [signOutStep, setSignOutStep] = useState<'closed' | 'confirm' | 'saving' | 'error'>('closed');
  const [landed, setLanded] = useState<{ tier: 'free' | 'paid'; effectiveDate: string } | null>(null);

  // settings.md §2.4 — "the first time Configuración's main view is opened
  // after a pending change's effective date has passed." Run exactly once
  // per mount (= one real "Configuración open"), not on every render or
  // every store-function identity change — see reconcilePendingSubscriptionTier's
  // own doc comment in store.tsx for the full two-phase reasoning.
  useEffect(() => {
    const result = reconcilePendingSubscriptionTier();
    if (result.justLanded && result.tier && result.effectiveDate) {
      setLanded({ tier: result.tier, effectiveDate: result.effectiveDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- store actions are
    // recreated every render; this must run once per real mount, not on every
    // identity change of `reconcilePendingSubscriptionTier` itself.
  }, []);

  if (!business) return null; // defensive — HomeScreen only mounts this once onboarding is complete

  function runWrite(action: ActionKind) {
    setSubView({ kind: 'saving', action });
    window.setTimeout(() => {
      switch (action) {
        case 'activate-paid':
          activatePaidPlan();
          break;
        case 'tags-on':
          changeDefaultSellingMode('nfc');
          break;
        case 'tags-off':
          changeDefaultSellingMode('buttons');
          break;
        case 'downgrade':
          requestDowngradeToFree();
          break;
        case 'cancel-pending':
          cancelPendingSubscriptionTierChange();
          break;
      }
      setSubView({ kind: 'main' });
    }, SAVE_DELAY_MS);
  }

  function handleSignOutConfirm() {
    setSignOutStep('saving');
    window.setTimeout(() => {
      signOut();
      // settings.md §2.5 / AppRouter.tsx — `AppRouter` falls back to
      // AuthenticationFlow automatically the instant `phoneVerifiedAt`
      // clears; no further navigation call is needed here, and this
      // component itself unmounts as part of that same re-render.
    }, SAVE_DELAY_MS);
  }

  // §3.8a/§3.8b — sign-out's own write/error states, distinct copy from
  // §3.9/§3.10, take over the full screen ahead of everything else below.
  if (signOutStep === 'saving') return <WritingState label="Cerrando sesión…" />;
  if (signOutStep === 'error') {
    return (
      <WritingState
        error
        errorLabel="No pudimos cerrar tu sesión. Intenta de nuevo."
        onRetry={handleSignOutConfirm}
      />
    );
  }

  // §3.9/§3.10 — shared by every capability action's actual write
  // (§3.4/§3.5's confirms, and §3.7's "Sí, cancelar").
  if (subView.kind === 'saving') return <WritingState label="Guardando…" />;
  if (subView.kind === 'saving-error') {
    const action = subView.action;
    return (
      <WritingState
        error
        errorLabel="No pudimos guardar tu cambio. Intenta de nuevo."
        onRetry={() => runWrite(action)}
      />
    );
  }

  // §3.4/§3.5 — the generic immediate/deferred-effect confirm screens.
  if (subView.kind === 'confirm') {
    const copy = confirmCopy(subView.action);
    return (
      <ActionConfirm
        title={copy.title}
        body={copy.body}
        ctaLabel={copy.ctaLabel}
        onConfirm={() => runWrite(subView.action)}
        onBack={() => setSubView({ kind: 'main' })}
      />
    );
  }

  // §3.3a/§3.6 — vista principal.
  return (
    <SettingsMain
      business={business}
      landed={landed}
      onBack={onBack}
      onActivatePaidTap={() => setSubView({ kind: 'confirm', action: 'activate-paid' })}
      onDowngradeTap={() => setSubView({ kind: 'confirm', action: 'downgrade' })}
      onModeChangeTap={(nextAction) => setSubView({ kind: 'confirm', action: nextAction })}
      cancelPendingOpen={cancelPendingOpen}
      onCancelPendingTap={() => setCancelPendingOpen(true)}
      onCancelPendingDismiss={() => setCancelPendingOpen(false)}
      onCancelPendingConfirm={() => {
        setCancelPendingOpen(false);
        runWrite('cancel-pending');
      }}
      signOutConfirmOpen={signOutStep === 'confirm'}
      onSignOutTap={() => setSignOutStep('confirm')}
      onSignOutDismiss={() => setSignOutStep('closed')}
      onSignOutConfirm={handleSignOutConfirm}
    />
  );
}

/** settings.md §3.3a/§3.6 — vista principal, kept as a top-level component
 * (not nested inside `SettingsScreen`'s own render body — a nested function
 * component would re-declare, with a fresh identity, on every render, the
 * same discipline `EventDetail.tsx`'s own `ActiveOrClosedBody` split already
 * follows for the identical reason). */
function SettingsMain({
  business,
  landed,
  onBack,
  onActivatePaidTap,
  onDowngradeTap,
  onModeChangeTap,
  cancelPendingOpen,
  onCancelPendingTap,
  onCancelPendingDismiss,
  onCancelPendingConfirm,
  signOutConfirmOpen,
  onSignOutTap,
  onSignOutDismiss,
  onSignOutConfirm,
}: {
  business: Business;
  landed: { tier: 'free' | 'paid'; effectiveDate: string } | null;
  onBack: () => void;
  onActivatePaidTap: () => void;
  onDowngradeTap: () => void;
  onModeChangeTap: (action: 'tags-on' | 'tags-off') => void;
  cancelPendingOpen: boolean;
  onCancelPendingTap: () => void;
  onCancelPendingDismiss: () => void;
  onCancelPendingConfirm: () => void;
  signOutConfirmOpen: boolean;
  onSignOutTap: () => void;
  onSignOutDismiss: () => void;
  onSignOutConfirm: () => void;
}) {
  const tierLabel = business.subscriptionTier === 'paid' ? 'Pago' : 'Gratis';
  // A genuinely *active* pending change — not yet acknowledged. Deliberately
  // distinct from a bare "pendingSubscriptionTier != null" check: the moment
  // `reconcilePendingSubscriptionTier` lands a change, it flips the tier and
  // marks `pendingSubscriptionTierAcknowledged = true` but keeps the triple's
  // other two fields around for exactly one more render, so the ack line
  // above can still read the landed value/date. Without this `!acknowledged`
  // gate, that same render would incorrectly keep showing "Cancelar cambio"
  // and a stale "(cambia a X el Y)" note for a change that already landed —
  // a real bug caught during this pass's own verification walkthrough (a
  // simulated already-past effective date), fixed here rather than shipped.
  const pending =
    business.pendingSubscriptionTier != null &&
    business.pendingSubscriptionTierEffectiveDate != null &&
    !business.pendingSubscriptionTierAcknowledged;
  const pendingTierLabel = pending ? (business.pendingSubscriptionTier === 'free' ? 'Gratis' : 'Pago') : null;

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← Hoy
        </button>
      </div>

      <div className={styles.scroll}>
        <h1 className={styles.heading}>Configuración</h1>

        {landed && (
          <p className={styles.ackLine}>
            Tu plan cambió a {landed.tier === 'paid' ? 'Pago' : 'Gratis'} el{' '}
            {formatDateRange(landed.effectiveDate, landed.effectiveDate)}.
          </p>
        )}

        {/* settings.md §2.2 — subscriptionTier row. */}
        <div className={styles.section}>
          <p className={styles.planLine}>
            Tu plan: <strong>{tierLabel}</strong>
            {pending && (
              <span className={styles.pendingNote}>
                {' '}
                (cambia a {pendingTierLabel} el {formatShortDate(business.pendingSubscriptionTierEffectiveDate!)})
              </span>
            )}
          </p>
          {pending ? (
            <Button variant="secondary" onClick={onCancelPendingTap}>
              Cancelar cambio
            </Button>
          ) : business.subscriptionTier === 'free' ? (
            <Button onClick={onActivatePaidTap}>Activar plan de pago</Button>
          ) : (
            <Button variant="secondary" onClick={onDowngradeTap}>
              Volver al plan gratis
            </Button>
          )}
        </div>

        {/* settings.md §2.3 — defaultSellingMode row. Never conditioned on a
            pending subscriptionTier change (§2.2's own "no capability with a
            pending change offers a second, stacking action" applies only to
            the capability that actually has one). */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Cómo vendes normalmente:</p>
          {business.subscriptionTier === 'paid' ? (
            <>
              <p className={styles.modeValue}>{business.defaultSellingMode === 'nfc' ? 'Con tags' : 'Botones'}</p>
              <Button
                variant="secondary"
                onClick={() => onModeChangeTap(business.defaultSellingMode === 'nfc' ? 'tags-off' : 'tags-on')}
              >
                {business.defaultSellingMode === 'nfc' ? 'Cambiar a vender con botones' : 'Cambiar a vender con tags'}
              </Button>
            </>
          ) : (
            <p className={styles.modeValue}>
              Botones <span className={styles.modeNote}>(vender con tags requiere el plan de pago)</span>
            </p>
          )}
        </div>

        {/* settings.md §2.5 — "Tu cuenta," present identically regardless of
            subscriptionTier or pending-change state. */}
        <div className={`${styles.accountSection} stitchTop`}>
          <p className={styles.sectionLabel}>Tu cuenta</p>
          <Button variant="secondary" onClick={onSignOutTap}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {cancelPendingOpen && (
        <Sheet onDismiss={onCancelPendingDismiss}>
          <p className={styles.confirmTitle}>¿Cancelar el cambio a plan gratis? Tu plan de pago sigue como está.</p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={onCancelPendingDismiss}>
              No
            </Button>
            <Button onClick={onCancelPendingConfirm}>Sí, cancelar</Button>
          </div>
        </Sheet>
      )}

      {signOutConfirmOpen && (
        <Sheet onDismiss={onSignOutDismiss}>
          <p className={styles.confirmTitle}>¿Cerrar tu sesión?</p>
          <p className={styles.confirmBody}>
            La próxima vez que abras Nahui aquí, te vamos a pedir tu número otra vez. Tu negocio, tu inventario y tus
            ventas siguen exactamente como están — no se pierde nada.
          </p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={onSignOutDismiss}>
              Cancelar
            </Button>
            <Button onClick={onSignOutConfirm}>Sí, cerrar sesión</Button>
          </div>
        </Sheet>
      )}
    </>
  );
}
