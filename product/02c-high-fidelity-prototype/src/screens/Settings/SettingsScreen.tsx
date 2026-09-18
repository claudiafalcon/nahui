import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import type { Business } from '../../domain/types';
import { activeTeamCount, currentUser, phoneIdentifierFor } from '../../domain/selectors';
import { addDaysToKey, formatDateRange, formatShortDate, todayKey } from '../../domain/dates';
import { pluralize } from '../../domain/format';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { ActionConfirm } from './ActionConfirm';
import { WritingState } from './WritingState';
import { TeamScreen } from './TeamScreen';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import styles from './SettingsScreen.module.css';

/** settings.md §2.2 — the four real capability actions, each reachable
 * through the generic immediate-effect confirm screen (§3.4) except
 * `downgrade`, which uses the deferred-effect one (§3.5). `cancel-pending`
 * (§3.7) has no confirm *screen* of its own — only the Sheet — but shares
 * the same §3.9/§3.10 write/error states as every other action. */
type ConfirmAction = 'activate-paid' | 'tags-off' | 'downgrade' | 'nfc-per-product-on' | 'nfc-per-product-off';
type ActionKind = ConfirmAction | 'cancel-pending';

type SubView =
  | { kind: 'main' }
  | { kind: 'confirm'; action: ConfirmAction }
  | { kind: 'saving'; action: ActionKind }
  | { kind: 'saving-error'; action: ActionKind }
  /** settings.md §2.7 "Ver equipo" — its own self-contained sub-screen
   * (`TeamScreen.tsx`), not folded into this file's own generic
   * confirm/saving machinery, since it owns real internal navigation of its
   * own (main list → invite → remove-confirm). */
  | { kind: 'team' };

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
    case 'tags-off':
      return {
        title: 'Cambiar a vender con botones',
        body: [
          'Desde tu próxima sesión, vas a empezar vendiendo con botones. Ya no vas a poder volver a vender con tags para todo tu catálogo — pero puedes seguir vendiendo con NFC, producto por producto, activándolo en Configuración cuando quieras.',
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
    case 'nfc-per-product-on':
      return {
        title: 'Activar NFC',
        body: [
          'Vas a poder elegir, producto por producto, cuáles vender con tag NFC — solo en los que no tengan código de barras.',
          'Esto no cambia cómo vendes ahorita; nada se etiqueta todavía, tú decides cuáles en Inventario.',
        ],
        ctaLabel: 'Activar ahora',
      };
    case 'nfc-per-product-off':
      return {
        title: 'Desactivar NFC',
        body: [
          'Ya no vas a poder marcar más productos para vender con NFC, ni vas a ver la opción de leer tags NFC al vender con botones. La mercancía que ya etiquetaste sigue etiquetada y se puede seguir vendiendo con NFC sin problema.',
        ],
        ctaLabel: 'Desactivar ahora',
      };
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
export function SettingsScreen({
  onBack,
  onSwitchedToTags,
}: {
  onBack: () => void;
  /** settings.md §2.6 (`decision-log.md` D46, corrected per its own
   * Addendum — architect ruling). **Retired as a live call path, 2026-09-17
   * (`decision-log.md` D72)** — "Cambiar a vender con tags" (the only action
   * that ever invoked this) no longer exists (§2.2/§2.3), so this callback
   * is never called from this component any longer. Kept in the prop
   * signature (dead, unreachable) rather than unwound end-to-end through
   * `HomeScreen.tsx`/`App.tsx` in this pass — `inventory.md` §2 step 0's own
   * resolution logic this fed is itself explicitly left untouched by D72
   * (settings.md §2.6's own retirement note), so removing the plumbing here
   * only is deliberately deferred, not an oversight. */
  onSwitchedToTags: () => void;
}) {
  const {
    state,
    activatePaidPlan,
    requestDowngradeToFree,
    cancelPendingSubscriptionTierChange,
    changeDefaultSellingMode,
    changeNfcPerProductEnabled,
    reconcilePendingSubscriptionTier,
    signOut,
    setUserDisplayName,
  } = useStore();
  const business = state.business;
  // RFC 0012/D62-63 — `User.phone` no longer exists; resolved through
  // `AuthIdentity` instead (see `phoneIdentifierFor`'s own doc comment).
  // `''` for a Google/Email-only merchant — the already-flagged, not-yet-
  // designed `settings.md §8` item 12 gap, not invented or resolved here.
  const ownPhone = (() => {
    const u = currentUser(state);
    return u ? phoneIdentifierFor(state, u.id) : '';
  })();
  // `decision-log.md` D69, `product-decisions.md` Q29 — available
  // identically regardless of role or `subscriptionTier` (§2.5's own text),
  // the same unconditional treatment phone display/"Cerrar sesión" already
  // get.
  const ownDisplayName = currentUser(state)?.displayName ?? null;

  const [subView, setSubView] = useState<SubView>({ kind: 'main' });
  const [cancelPendingOpen, setCancelPendingOpen] = useState(false);
  const [signOutStep, setSignOutStep] = useState<'closed' | 'confirm' | 'saving' | 'error'>('closed');
  const [landed, setLanded] = useState<{ tier: 'free' | 'paid'; effectiveDate: string } | null>(null);
  // settings.md §3.3b "Editar tu nombre" — the sheet's own local
  // open/draft/save-error state, mirroring `inventory.md` §3.4a's price-edit
  // sheet shape (`CatalogView.tsx`) — no full-screen `WritingState`, a
  // failed save simply leaves the sheet open with her typed value intact.
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [nameSaveError, setNameSaveError] = useState(false);

  // settings.md §2.4 — "the first time Configuración's main view is opened
  // after a pending change's effective date has passed." Run exactly once
  // per mount (= one real "Configuración open"), not on every render or
  // every store-function identity change — see reconcilePendingSubscriptionTier's
  // own doc comment in store.tsx for the full two-phase reasoning.
  useEffect(() => {
    const result = reconcilePendingSubscriptionTier((landed) => {
      if (!landed) setLanded(null);
    });
    if (result.justLanded && result.tier && result.effectiveDate) {
      setLanded({ tier: result.tier, effectiveDate: result.effectiveDate });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- store actions are
    // recreated every render; this must run once per real mount, not on every
    // identity change of `reconcilePendingSubscriptionTier` itself.
  }, []);

  if (!business) return null; // defensive — HomeScreen only mounts this once onboarding is complete

  async function runWrite(action: ActionKind) {
    setSubView({ kind: 'saving', action });
    await new Promise((resolve) => window.setTimeout(resolve, SAVE_DELAY_MS));

    let ok: boolean;
    switch (action) {
      case 'activate-paid':
        ok = await activatePaidPlan();
        break;
      case 'tags-off':
        ok = await changeDefaultSellingMode('buttons');
        break;
      case 'nfc-per-product-on':
        ok = await changeNfcPerProductEnabled(true);
        break;
      case 'nfc-per-product-off':
        ok = await changeNfcPerProductEnabled(false);
        break;
      case 'downgrade':
        // Same deterministic rule `confirmCopy`'s own `downgrade` branch
        // just showed her — computed fresh here rather than threaded through
        // as component state, so the preview and the written value always
        // agree as long as both happen the same day (always true within one
        // interaction).
        ok = await requestDowngradeToFree(addDaysToKey(todayKey(), 30));
        break;
      case 'cancel-pending':
        ok = await cancelPendingSubscriptionTierChange();
        break;
    }

    if (!ok) {
      setSubView({ kind: 'saving-error', action });
      return;
    }

    // settings.md §2.6's own handoff (`decision-log.md` D46) is retired
    // along with "Cambiar a vender con tags" itself (`decision-log.md`
    // D72) — every remaining action returns to this screen's own vista
    // principal, no special-cased handoff branch needed any longer.
    setSubView({ kind: 'main' });
  }

  // settings.md §3.3b — opens pre-filled with the current `User.displayName`
  // if one is set, blank otherwise. Reused identically for both "Tu nombre"
  // row states (`[ Agregar tu nombre ]` and the already-set "Editar" row).
  function openEditName() {
    setNameDraft(ownDisplayName ?? '');
    setNameSaveError(false);
    setEditNameOpen(true);
  }

  function closeEditName() {
    setEditNameOpen(false);
    setNameSaveError(false);
  }

  async function handleSaveName() {
    setNameSaveError(false);
    // "Clearing the field to empty and tapping 'Guardar' removes the name"
    // (§3.3b's own text) — `setUserDisplayName` itself already trims and
    // treats an empty string as `null` (see its own doc comment), so no
    // separate "Quitar" control is needed here.
    const ok = await setUserDisplayName(nameDraft);
    if (ok) {
      closeEditName();
    } else {
      // A failed save leaves the sheet open with her typed value intact —
      // same convention `inventory.md` §3.4a's price-edit sheet already
      // uses (`CatalogView.tsx`).
      setNameSaveError(true);
    }
  }

  function handleSignOutConfirm() {
    setSignOutStep('saving');
    window.setTimeout(() => {
      // `signOut` is now `Promise<void>` (`reviewer` Blocker fix,
      // 2026-09-14) — fire-and-forget here is still correct, same reasoning
      // as `SellerAccountScreen.tsx`'s own identical call site.
      void signOut();
      // settings.md §2.5 / AppRouter.tsx — `AppRouter` falls back to
      // AuthenticationFlow automatically the instant `currentUserId` clears
      // (RFC 0012/D62-63 — was `phoneVerifiedAt`); no further navigation
      // call is needed here, and this component itself unmounts as part of
      // that same re-render.
    }, SAVE_DELAY_MS);
  }

  // §3.8a/§3.8b — sign-out's own write/error states, distinct copy from
  // §3.9/§3.10, take over the full screen ahead of everything else below.
  if (signOutStep === 'saving') {
    return (
      <ScreenTransition transitionKey="signout-saving">
        <WritingState label="Cerrando sesión…" />
      </ScreenTransition>
    );
  }
  if (signOutStep === 'error') {
    return (
      <ScreenTransition transitionKey="signout-error">
        <WritingState
          error
          errorLabel="No pudimos cerrar tu sesión. Intenta de nuevo."
          onRetry={handleSignOutConfirm}
        />
      </ScreenTransition>
    );
  }

  // §3.9/§3.10 — shared by every capability action's actual write
  // (§3.4/§3.5's confirms, and §3.7's "Sí, cancelar").
  if (subView.kind === 'saving') {
    return (
      <ScreenTransition transitionKey="saving">
        <WritingState label="Guardando…" />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'saving-error') {
    const action = subView.action;
    return (
      <ScreenTransition transitionKey="saving-error">
        <WritingState
          error
          errorLabel="No pudimos guardar tu cambio. Intenta de nuevo."
          onRetry={() => void runWrite(action)}
        />
      </ScreenTransition>
    );
  }

  // §3.4/§3.5 — the generic immediate/deferred-effect confirm screens.
  if (subView.kind === 'confirm') {
    const copy = confirmCopy(subView.action);
    return (
      <ScreenTransition transitionKey={`confirm:${subView.action}`}>
        <ActionConfirm
          title={copy.title}
          body={copy.body}
          ctaLabel={copy.ctaLabel}
          onConfirm={() => void runWrite(subView.action)}
          onBack={() => setSubView({ kind: 'main' })}
        />
      </ScreenTransition>
    );
  }

  // §2.7/§3.11-§3.13 — "Tu equipo," its own self-contained sub-screen.
  if (subView.kind === 'team') {
    return (
      <ScreenTransition transitionKey="team">
        <TeamScreen onBack={() => setSubView({ kind: 'main' })} />
      </ScreenTransition>
    );
  }

  // §3.3a/§3.6 — vista principal.
  return (
    <ScreenTransition transitionKey="main">
      <SettingsMain
        business={business}
        landed={landed}
        teamCount={activeTeamCount(state, business.id)}
        phone={ownPhone}
        displayName={ownDisplayName}
        editNameOpen={editNameOpen}
        nameDraft={nameDraft}
        nameSaveError={nameSaveError}
        onEditNameTap={openEditName}
        onNameDraftChange={setNameDraft}
        onEditNameCancel={closeEditName}
        onEditNameSave={() => void handleSaveName()}
        onBack={onBack}
        onActivatePaidTap={() => setSubView({ kind: 'confirm', action: 'activate-paid' })}
        onDowngradeTap={() => setSubView({ kind: 'confirm', action: 'downgrade' })}
        onModeChangeTap={(nextAction) => setSubView({ kind: 'confirm', action: nextAction })}
        onNfcPerProductTap={(nextAction) => setSubView({ kind: 'confirm', action: nextAction })}
        onViewTeamTap={() => setSubView({ kind: 'team' })}
        cancelPendingOpen={cancelPendingOpen}
        onCancelPendingTap={() => setCancelPendingOpen(true)}
        onCancelPendingDismiss={() => setCancelPendingOpen(false)}
        onCancelPendingConfirm={() => {
          setCancelPendingOpen(false);
          void runWrite('cancel-pending');
        }}
        signOutConfirmOpen={signOutStep === 'confirm'}
        onSignOutTap={() => setSignOutStep('confirm')}
        onSignOutDismiss={() => setSignOutStep('closed')}
        onSignOutConfirm={handleSignOutConfirm}
      />
    </ScreenTransition>
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
  teamCount,
  phone,
  displayName,
  editNameOpen,
  nameDraft,
  nameSaveError,
  onEditNameTap,
  onNameDraftChange,
  onEditNameCancel,
  onEditNameSave,
  onBack,
  onActivatePaidTap,
  onDowngradeTap,
  onModeChangeTap,
  onNfcPerProductTap,
  onViewTeamTap,
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
  /** settings.md §2.7/§3.3a — active-status SELLER count, Paid tier only. */
  teamCount: number;
  /** settings.md §2.5/§3.3a (Slice 12 `merchant-user-tester` defect fix,
   * 2026-09-07) — `User.phone` for whichever User currently holds this
   * device's verified session, read-only, shown in "Tu cuenta" above
   * "Cerrar sesión." `''` only in the defensive case no verified
   * `currentUser` resolves at all (unreachable through the real UI — this
   * screen only ever mounts once Onboarding is complete, which itself
   * requires a verified User). */
  phone: string;
  /** `decision-log.md` D69, `product-decisions.md` Q29 — `User.displayName`
   * for whichever User currently holds this device's own verified session.
   * `null` = not set yet, the "[ Agregar tu nombre ]" row state. */
  displayName: string | null;
  editNameOpen: boolean;
  nameDraft: string;
  nameSaveError: boolean;
  onEditNameTap: () => void;
  onNameDraftChange: (value: string) => void;
  onEditNameCancel: () => void;
  onEditNameSave: () => void;
  onBack: () => void;
  onActivatePaidTap: () => void;
  onDowngradeTap: () => void;
  /** settings.md §2.3 — `decision-log.md` D72 narrows this to a one-way
   * escape valve: only ever called with `'tags-off'`, only ever rendered
   * while `defaultSellingMode = 'nfc'` (grandfathered/demo Businesses).
   * `'tags-on'` no longer exists as a reachable action. */
  onModeChangeTap: (action: 'tags-off') => void;
  /** settings.md §2.8/§3.4 — "Activar NFC"/"Desactivar NFC" (`decision-log.md`
   * D71, renamed D72), same shape as `onModeChangeTap` above, kept as its
   * own prop rather than widening that one's action union — a distinct
   * capability (`nfcPerProductEnabled`), not a third direction of
   * `defaultSellingMode`. */
  onNfcPerProductTap: (action: 'nfc-per-product-on' | 'nfc-per-product-off') => void;
  onViewTeamTap: () => void;
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
  // distinct from a bare "pendingSubscriptionTier != null" check: once
  // `reconcilePendingSubscriptionTier`'s background `land_pending_subscription_tier`
  // RPC actually resolves, it clears the whole pending triple (including
  // `pendingSubscriptionTierAcknowledged`) in one atomic mirror, so this
  // `!acknowledged` condition and a bare non-null check agree from that
  // point on. The one honest gap this doesn't (and structurally can't)
  // close: on the very mount that detects landing, there's a brief window —
  // the RPC's own network round trip — where this row can still show
  // "Cancelar cambio" with a now-stale "(cambia a X el Y)" note until the
  // mirror lands a moment later. Acceptable for a once-per-billing-cycle
  // event with no real stakes attached to the flash itself.
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

      {/* Design-audit-2026-08-15 item #5 — read-only business identity
          strip, confirming whose business this is before anything else on
          the flattest, emptiest screen in the app. Non-interactive (no
          onClick, no chevron, no gating logic) — pure display of
          `Business.name`/`Business.logo`, the exact same fields/values
          `ReceiptTicket` already renders (`home.md` §3.8f), not a new data
          source. `settings.md` §3.3a's wireframe doesn't reserve this space
          for anything else (`ux-designer` sign-off, design-audit doc). */}
      <div className={`${styles.identity} stitchBottom`}>
        {business.logo && <img className={styles.identityLogo} src={business.logo} alt="" />}
        <span className={styles.identityName}>{business.name}</span>
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

        {/* settings.md §2.3 — defaultSellingMode row. `decision-log.md` D72:
            no longer a two-way picker for any Business. A `buttons`-mode
            Business (the normal case going forward) sees a plain,
            un-actioned line. Only an already-`nfc`-moded Business
            (grandfathered/demo) sees a real control here: the one-way
            "Cambiar a vender con botones" escape valve. Never conditioned on
            a pending subscriptionTier change (§2.2's own "no capability with
            a pending change offers a second, stacking action" applies only
            to the capability that actually has one). */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Cómo vendes normalmente:</p>
          {business.subscriptionTier === 'paid' ? (
            business.defaultSellingMode === 'nfc' ? (
              <>
                <p className={styles.modeValue}>Con tags</p>
                <Button variant="secondary" onClick={() => onModeChangeTap('tags-off')}>
                  Cambiar a vender con botones
                </Button>
              </>
            ) : (
              <p className={styles.modeValue}>Botones</p>
            )
          ) : (
            <p className={styles.modeValue}>
              Botones <span className={styles.modeNote}>(vender con tags requiere el plan de pago)</span>
            </p>
          )}

          {/* settings.md §2.8/§3.4 "Activar NFC" (`decision-log.md` D71,
              renamed D72, gate corrected D73) — offered whenever
              `nfc ∈ registrationMode` (`subscriptionTier === 'paid'`),
              regardless of `defaultSellingMode`. D73 drops the earlier
              `defaultSellingMode !== 'nfc'` clause: whole-Catalog `nfc` mode
              being moot for Selling-screen *composition* (nothing for
              "Leer con NFC" to overlay onto there) never made
              `nfcPerProductEnabled` itself unreachable for Inventario
              tagging-prep purposes, which don't care what Selling currently
              resolves to — an already-named, valid, reachable combination
              (settings.md §2.8). So this row now renders alongside the
              escape valve above, not in its place, whenever the Business is
              `nfc`-moded. The stored `nfcPerProductEnabled` value is
              untouched by any mode switch (never a side effect of one, per
              this section's own standing invariant). */}
          {business.subscriptionTier === 'paid' && (
            <>
              <p className={styles.modeValue}>NFC: {business.nfcPerProductEnabled ? 'Sí' : 'No'}</p>
              <Button
                variant="secondary"
                onClick={() =>
                  onNfcPerProductTap(business.nfcPerProductEnabled ? 'nfc-per-product-off' : 'nfc-per-product-on')
                }
              >
                {business.nfcPerProductEnabled ? 'Desactivar NFC' : 'Activar NFC'}
              </Button>
            </>
          )}
        </div>

        {/* settings.md §2.7 "Tu equipo" — Paid-tier only, structurally
            absent on Free (no row, no locked/disabled hint), the identical
            gating discipline this section already applies to Frequent
            Customers. Discoverable only via "Activar plan de pago"'s own
            copy. */}
        {business.subscriptionTier === 'paid' && (
          <div className={`${styles.section} stitchTop`}>
            <p className={styles.sectionLabel}>Tu equipo</p>
            <p className={styles.planLine}>
              {teamCount === 0
                ? 'Nadie más vendiendo contigo todavía'
                : `${teamCount} ${pluralize(teamCount, 'persona vendiendo', 'personas vendiendo')} contigo`}
            </p>
            <Button variant="secondary" onClick={onViewTeamTap}>
              Ver equipo
            </Button>
          </div>
        )}

        {/* settings.md §2.5 — "Tu cuenta," present identically regardless of
            subscriptionTier or pending-change state. Her own verified phone
            number (added 2026-09-07, Slice 12 `merchant-user-tester` defect
            fix) sits above "Cerrar sesión," read-only, plain text — the one
            place in the product she can always come back to and check which
            number this device is verified under. */}
        <div className={`${styles.accountSection} stitchTop`}>
          <p className={styles.sectionLabel}>Tu cuenta</p>

          {/* "Tu nombre" — new 2026-09-15, `decision-log.md` D69. Present
              identically wherever "Tu cuenta" is, regardless of role or
              `subscriptionTier` (§2.5's own text). Both states — not-yet-set
              and already-set — open the identical §3.3b sheet. */}
          <p className={styles.sectionLabel}>Tu nombre</p>
          {displayName ? (
            <div className={styles.nameRow}>
              <span className={styles.planLine}>{displayName}</span>
              <Button variant="secondary" inline onClick={onEditNameTap}>
                Editar
              </Button>
            </div>
          ) : (
            <Button variant="secondary" onClick={onEditNameTap}>
              Agregar tu nombre
            </Button>
          )}

          {phone && (
            <p className={styles.planLine}>
              +52 {phone.slice(0, 2)} {phone.slice(2, 6)} {phone.slice(6)}
            </p>
          )}
          <Button variant="secondary" onClick={onSignOutTap}>
            Cerrar sesión
          </Button>
        </div>
      </div>

      {editNameOpen && (
        <Sheet onDismiss={onEditNameCancel}>
          <p className={styles.confirmTitle}>Tu nombre</p>
          <div className={styles.field}>
            <input
              className={styles.input}
              type="text"
              autoFocus
              placeholder="Escribe tu nombre…"
              value={nameDraft}
              onChange={(e) => onNameDraftChange(e.target.value)}
            />
          </div>
          <p className={styles.hint}>Así te van a reconocer en Resultados y en Tu equipo.</p>
          {nameSaveError && <p className={styles.error}>No pudimos guardar tu nombre. Intenta de nuevo.</p>}
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={onEditNameCancel}>
              Cancelar
            </Button>
            <Button onClick={onEditNameSave}>Guardar</Button>
          </div>
        </Sheet>
      )}

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
