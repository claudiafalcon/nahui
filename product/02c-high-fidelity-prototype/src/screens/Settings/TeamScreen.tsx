import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../domain/store';
import { teamRows, invitationDisplayStatus } from '../../domain/selectors';
import { dateKey, formatShortDate } from '../../domain/dates';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { WritingState } from './WritingState';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import type { ID, Invitation } from '../../domain/types';
import styles from './TeamScreen.module.css';

type SubView =
  | { kind: 'main' }
  | { kind: 'invite' }
  | { kind: 'invite-saving' }
  | { kind: 'invite-error' }
  | { kind: 'invite-ready'; invitationId: ID; token: string; expiresAt: number; targetHintEmail: string | null }
  | { kind: 'regenerate-saving'; invitationId: ID }
  | { kind: 'regenerate-error'; invitationId: ID }
  | { kind: 'cancel-confirm'; invitationId: ID }
  | { kind: 'cancel-saving'; invitationId: ID }
  | { kind: 'cancel-error'; invitationId: ID }
  /** settings.md §3.12e "Editar correo"/"Agregar correo" (RFC 0014/D70) —
   * same sheet either way, differing only in whether it opens pre-filled
   * (an already-set `targetHint`) or blank (a legacy, hint-less row). No
   * separate "saving" sub-state — this near-instant write shows no
   * intermediate visual at all while in flight, the identical convention
   * `SettingsScreen.tsx`'s "Tu nombre" sheet and `inventory.md` §3.4a's
   * price-edit sheet (`CatalogView.tsx`) already establish; only a failed
   * save has a visible consequence (an inline error, the sheet staying
   * open). */
  | { kind: 'edit-hint'; invitationId: ID }
  | { kind: 'remove-confirm'; membershipId: ID; phone: string; displayName: string | null }
  | { kind: 'remove-saving'; membershipId: ID; phone: string; displayName: string | null }
  | { kind: 'remove-error'; membershipId: ID; phone: string; displayName: string | null };

/** settings.md §3.11's own two row-meta shapes — corrected 2026-09-15
 * (RFC 0014/D70), no longer "with/without a `targetHint`" (every Invitation
 * created after RFC 0014 shipped always carries one) but "ordinary vs.
 * legacy, hint-less row," per §3.11's own corrected text. Shared by the
 * pending/expired/cancelled row kinds alike (§3.11's own wireframe uses the
 * plain "Creada el 8 sep" shape for a cancelled row too, which never
 * distinguishes legacy). */
function invitationMetaLine(invitation: Invitation): string {
  const created = formatShortDate(dateKey(invitation.createdAt));
  if (invitation.targetHint) return `Para ${invitation.targetHint.value} · creada el ${created}`;
  return `Creada el ${created}`;
}

/** Plain "55 1234 5678" display grouping — grouped the same way
 * `CodeStep.tsx` already renders a confirmed phone back to her. Empty for a
 * Google/Email-only SELLER (`phoneIdentifierFor`'s own documented `''`
 * fallback, `authentication.md` §8 item 12's named, not-yet-designed gap). */
function formatPhone(phone: string): string {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 2)} ${phone.slice(2, 6)} ${phone.slice(6)}`;
}

/** `decision-log.md` D69, `product-decisions.md` Q29 — settings.md §2.7's
 * own resolved, three-tier "Row display" order: `User.displayName` first,
 * then the pre-existing phone display, then the last-resort role-only
 * fallback for a `User` with neither (created cold via email or Google,
 * D63). Shared by an `active` and a `revoked` row alike — the identity
 * resolution itself never depends on which state the Membership is in. */
function memberIdentityLabel(displayName: string | null, phone: string): string {
  if (displayName) return displayName;
  if (phone) return formatPhone(phone);
  return 'Alguien de tu equipo';
}

/**
 * settings.md §2.7/§3.11-§3.14 "Tu equipo" — invite a SELLER by generating a
 * shareable link (RFC 0013/D64, token-based — no phone typed, no identity
 * assumed), view team status, cancel a still-pending invitation, regenerate
 * an expired one, revoke an accepted SELLER's access. Reached only from the
 * Paid-tier vista principal's "Ver equipo" row (`SettingsScreen.tsx`) — this
 * component never checks `subscriptionTier` itself, the same "the caller
 * already gated this" posture every other sub-screen in this folder holds.
 *
 * **Rebuilt 2026-09-14 against the reworked settings.md §2.7/§3.11-§3.14
 * (RFC 0013/D64, `decision-log.md`) — Migration Workflow rebuild, not a new
 * design.** The previous build collected and displayed a phone number
 * directly on `Invitation`; that field no longer exists (`Invitation` is now
 * token-keyed, `types.ts`). This rebuild reads `targetHint`/`expiresAt`/
 * `invitationDisplayStatus` instead, and adds the real one-time link
 * generation/display/copy/share flow (§3.12/§3.12c) the token model
 * requires.
 */
export function TeamScreen({ onBack }: { onBack: () => void }) {
  const {
    state,
    createInvitation,
    regenerateInvitation,
    cancelInvitation,
    updateInvitationTargetHint,
    revokeMembership,
  } = useStore();
  const [subView, setSubView] = useState<SubView>({ kind: 'main' });
  const [email, setEmail] = useState('');
  const [ackTapped, setAckTapped] = useState(false);
  // settings.md §3.12e — the "Editar correo"/"Agregar correo" sheet's own
  // draft state, mirroring `SettingsScreen.tsx`'s "Tu nombre" sheet shape
  // (`nameDraft`/`nameSaveError`) — a failed save leaves the sheet open
  // with her typed value intact, same convention §3.3b already uses.
  const [hintDraft, setHintDraft] = useState('');
  const [hintSaveError, setHintSaveError] = useState(false);
  const hintKeyRef = useRef<string | null>(null);
  // `knowledge-mentor` consultation fix, 2026-09-14 — a rejected
  // `navigator.clipboard.writeText` promise used to be silently swallowed,
  // giving her no signal either way on a secret that's gone forever once
  // this screen closes. Ambient, self-dismissing (the same `toast` mechanism
  // `EventsList.tsx`'s own "Evento cancelado ✓" already uses) — `'copied'`
  // on a genuine success, `'error'` on a genuine rejection; never set on
  // "Compartir...", which already has its own visible non-completion signal
  // (a dismissed native share sheet) the spec explicitly doesn't gate on.
  const [copyFeedback, setCopyFeedback] = useState<'copied' | 'error' | null>(null);
  // Reused across every retry of the *same* logical "Generar invitación"
  // attempt (`architecture-principles.md` #7, matching
  // `OnboardingFlow.tsx`'s own `sellingGroupsIdempotencyKeyRef` precedent) —
  // cleared once that attempt is genuinely settled (a real error the caller
  // has moved past, or a success), so the *next* tap starts a fresh one.
  const createKeyRef = useRef<string | null>(null);
  // Same persisted-across-retries convention as `createKeyRef` above — a
  // retry of the same logical "Cancelar" attempt must reuse the original
  // key, not mint a fresh one: `cancel_invitation`'s CAS consumes the
  // `pending` status on success, so a fresh key on a retry of an
  // already-succeeded-but-lost-response attempt would hit the CAS again
  // instead of the idempotency replay path and come back
  // `invitation_not_pending` even though the cancel already landed.
  const cancelKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!copyFeedback) return;
    const t = window.setTimeout(() => setCopyFeedback(null), 2400);
    return () => window.clearTimeout(t);
  }, [copyFeedback]);

  if (!state.business) return null; // defensive — unreachable, same posture as SettingsScreen's own guard

  const business = state.business;
  const rows = teamRows(state, business.id);

  const trimmedEmail = email.trim();
  const hasAtSign = trimmedEmail.includes('@');
  // Same deliberately loose structural check as `EmailStep.tsx`/
  // `authentication.md` §3.2e — catch the obviously-incomplete case, never
  // full validation. **Corrected 2026-09-15 (RFC 0014/D70, `decision-log.md`
  // D70)** — this field is now required, not optional: "Generar invitación"
  // stays disabled until `looksValidEmail` is true (below), reversing the
  // pre-D70 "never gated on the optional field" posture this file's own
  // JSX comment used to state.
  const looksValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const showFormatHint = trimmedEmail.length > 0 && hasAtSign && !looksValidEmail;
  const hasDuplicatePending =
    !showFormatHint &&
    looksValidEmail &&
    state.invitations.some(
      (inv) =>
        inv.businessId === business.id &&
        inv.targetHint?.value.toLowerCase() === trimmedEmail.toLowerCase() &&
        // `ux-critic` Minor MIN1 fix, 2026-09-14 — reads the same read-time
        // `'pending'`/`'expired'` derivation `teamRows` already uses one file
        // away (`selectors.ts`'s `invitationDisplayStatus`), rather than the
        // raw stored `inv.status`, which stays `'pending'` forever for a row
        // that expired without ever being explicitly cancelled — the exact
        // gap that let an already-expired Invitation be called "pendiente"
        // here.
        invitationDisplayStatus(inv) === 'pending',
    );

  // settings.md §3.12e — same loose structural check §3.12 itself already
  // uses; "Guardar" stays disabled until the typed value passes it.
  const hintTrimmed = hintDraft.trim();
  const hintHasAtSign = hintTrimmed.includes('@');
  const hintLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(hintTrimmed);
  const showHintFormatError = hintTrimmed.length > 0 && hintHasAtSign && !hintLooksValid;

  function openEditHint(invitationId: ID, currentValue: string | undefined) {
    setHintDraft(currentValue ?? '');
    setHintSaveError(false);
    // `hintKeyRef` is shared across every "Editar correo"/"Agregar correo"
    // row this screen ever opens, not scoped to one Invitation — reset here
    // on every fresh open so a stale key from an earlier, abandoned (failed
    // then cancelled, never retried) attempt on a *different* row can never
    // be replayed against this genuinely new one (`architecture-principles.md`
    // #7 — a client-supplied idempotency key must identify one logical
    // attempt, never be reused across two different ones). An in-sheet
    // retry after a failure (tapping "Guardar" again without closing the
    // sheet) still correctly reuses the same key — `handleSaveTargetHint`
    // only mints a fresh one when `hintKeyRef.current` is null, and this
    // reset is the only place that ever nulls it before a successful save
    // does.
    hintKeyRef.current = null;
    setSubView({ kind: 'edit-hint', invitationId });
  }

  function buildInviteLink(token: string): string {
    // `settings.md` §3.12c's own text: "the link display shown here is
    // illustrative — exact truncation width/format is `ui-designer`'s call
    // ... The route shape itself (`nahui.app/invite/<token>`) mirrors RFC
    // 0013 §2's own worked example." This build uses this app's own real
    // running origin rather than the illustrative "nahui.app" — a genuinely
    // working link a real Copiar/Compartir tap can act on, not a mockup
    // string, disclosed here rather than silently deviating from the
    // spec's own illustrative text.
    return `${window.location.origin}/invite/${token}`;
  }

  function markAcknowledged() {
    setAckTapped(true);
  }

  async function handleCopy(link: string) {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Clipboard access can genuinely fail (permissions, insecure context)
      // — a rejected promise here is *invisible* to her, unlike a dismissed
      // native share sheet in `handleShare` below, which is a *visible*
      // non-completion she chose herself (`knowledge-mentor` consultation,
      // 2026-09-14). Surfaced honestly rather than swallowed: she needs to
      // know to try "Compartir..." instead, or select the text manually, on
      // a secret that's gone forever after this screen closes.
      setCopyFeedback('error');
      return; // deliberately does NOT call markAcknowledged() — "Listo" must
      // not unlock on a failed copy as if it had succeeded.
    }
    setCopyFeedback('copied');
    markAcknowledged();
  }

  function handleShare(link: string) {
    // "Compartir..." opens the device's own native share mechanism — below
    // this document's own abstraction level to specify further (§3.12c's
    // own text, the same treatment `authentication.md` §2.3 already gives
    // OTP delivery mechanics). Disclosed simplification: `navigator.share`
    // isn't available in every environment this prototype runs in (e.g. a
    // desktop preview) — falls back to the identical copy mechanism rather
    // than rendering a dead button, since nothing in the Approved spec
    // designs a "share unavailable" state.
    if (navigator.share) {
      navigator.share({ url: link }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(link).catch(() => {});
    }
    // "no requirement to actually complete a share, only to have started
    // one" (§3.12c's own text) — acknowledged the instant she taps, not
    // gated on the native sheet actually resolving.
    markAcknowledged();
  }

  /** store.tsx's own `regenerateInvitation` doc comment: the real recovery
   * path both for an expired row's "Generar otra" (§3.11) *and* for a
   * `createInvitation` reply that came back with `token: null` (a replay of
   * an already-completed create whose original response was lost — see
   * `handleGenerate` below). Not a distinct screen state anywhere in
   * settings.md (a backend-only nuance, RFC 0013's own token-never-cached
   * guarantee) — handled transparently here via the same §3.12a/§3.12b
   * "Generando…" write states "Generar otra" already reuses, rather than
   * inventing a new, un-Approved UI state for it. */
  async function recoverToken(invitationId: ID) {
    setSubView({ kind: 'regenerate-saving', invitationId });
    const result = await regenerateInvitation(invitationId, crypto.randomUUID());
    if (result?.token) {
      setEmail('');
      setAckTapped(false);
      // `regenerate_invitation` never touches `target_hint` (RFC 0014's own
      // rule, `settings.md` §3.12e's own citation) — read the still-current
      // value straight from `state.invitations` rather than assuming one
      // exists. `null` only for a legacy row regenerated without ever being
      // separately opted in via "Agregar correo" — §3.12c's own copy below
      // branches for that honest case.
      const targetHintEmail = state.invitations.find((inv) => inv.id === invitationId)?.targetHint?.value ?? null;
      setSubView({ kind: 'invite-ready', invitationId, token: result.token, expiresAt: result.expiresAt, targetHintEmail });
    } else {
      setSubView({ kind: 'regenerate-error', invitationId });
    }
  }

  async function handleGenerate() {
    // RFC 0014/D70 — `looksValidEmail` now gates this button itself (see
    // §3.12's own JSX below); defensive guard kept here too, matching this
    // file's own "never trust a stale disabled-button state alone" posture.
    if (!looksValidEmail) return;
    if (!createKeyRef.current) createKeyRef.current = crypto.randomUUID();
    setSubView({ kind: 'invite-saving' });
    const targetHint = { type: 'email' as const, value: trimmedEmail };
    const result = await createInvitation(business.id, targetHint, createKeyRef.current);
    if (!result) {
      setSubView({ kind: 'invite-error' }); // §3.12b — Reintentar replays with the same key
      return;
    }
    createKeyRef.current = null; // this logical attempt is settled — a future tap starts a fresh one
    if (result.token) {
      setEmail('');
      setAckTapped(false);
      setSubView({
        kind: 'invite-ready',
        invitationId: result.invitationId,
        token: result.token,
        expiresAt: result.expiresAt,
        targetHintEmail: trimmedEmail,
      });
      return;
    }
    await recoverToken(result.invitationId);
  }

  async function handleConfirmCancel(invitationId: ID) {
    if (!cancelKeyRef.current) cancelKeyRef.current = crypto.randomUUID();
    setSubView({ kind: 'cancel-saving', invitationId });
    const result = await cancelInvitation(invitationId, cancelKeyRef.current);
    // Both a platform failure (`null`) and a lost CAS (`invitation_not_pending`
    // — already accepted/cancelled elsewhere) route into the same
    // §3.9/§3.10 shared write-failure shape; neither has a dedicated copy
    // in settings.md, and a retry is still the right recovery affordance
    // for either. Reintentar replays with the same key.
    if (!result || 'error' in result) {
      setSubView({ kind: 'cancel-error', invitationId });
      return;
    }
    cancelKeyRef.current = null; // this logical attempt is settled — a future tap starts a fresh one
    setSubView({ kind: 'main' });
  }

  async function handleConfirmRemove(membershipId: ID, phoneLabel: string, displayName: string | null) {
    setSubView({ kind: 'remove-saving', membershipId, phone: phoneLabel, displayName });
    const ok = await revokeMembership(membershipId);
    setSubView(ok ? { kind: 'main' } : { kind: 'remove-error', membershipId, phone: phoneLabel, displayName });
  }

  /** settings.md §3.12e "Editar correo"/"Agregar correo" (RFC 0014/D70) —
   * "Guardar" writes `Invitation.targetHint` directly on the same still-
   * `pending` row — no token regeneration, no `expiresAt` reset. */
  async function handleSaveTargetHint(invitationId: ID) {
    if (!hintLooksValid) return;
    if (!hintKeyRef.current) hintKeyRef.current = crypto.randomUUID();
    setHintSaveError(false);
    const result = await updateInvitationTargetHint(
      invitationId,
      { type: 'email', value: hintDraft.trim() },
      hintKeyRef.current,
    );
    if (!result || 'error' in result) {
      // A failed save leaves the sheet open with her typed value intact —
      // same convention §3.3b already uses (`SettingsScreen.tsx`'s "Tu
      // nombre" sheet).
      setHintSaveError(true);
      return;
    }
    hintKeyRef.current = null; // this logical attempt is settled — a future tap starts a fresh one
    setSubView({ kind: 'main' });
  }

  if (subView.kind === 'invite-saving') {
    return (
      <ScreenTransition transitionKey="team-invite-saving">
        <WritingState label="Generando…" />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'invite-error') {
    return (
      <ScreenTransition transitionKey="team-invite-error">
        <WritingState
          error
          errorLabel="No pudimos generar la invitación. Intenta de nuevo."
          onRetry={handleGenerate}
        />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'regenerate-saving') {
    return (
      <ScreenTransition transitionKey="team-regenerate-saving">
        <WritingState label="Generando…" />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'regenerate-error') {
    return (
      <ScreenTransition transitionKey="team-regenerate-error">
        <WritingState
          error
          errorLabel="No pudimos generar la invitación. Intenta de nuevo."
          onRetry={() => recoverToken(subView.invitationId)}
        />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'cancel-saving') {
    return (
      <ScreenTransition transitionKey="team-cancel-saving">
        <WritingState label="Guardando…" />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'cancel-error') {
    // §3.9/§3.10's shared write-failure shape — genuinely reachable now
    // that `cancelInvitation` calls the real `cancel_invitation` RPC (a
    // platform error, or a lost `status = 'pending'` CAS), the same
    // real-wiring fix `remove-error` below got for `revokeMembership`.
    return (
      <ScreenTransition transitionKey="team-cancel-error">
        <WritingState
          error
          errorLabel="No pudimos cancelar la invitación. Intenta de nuevo."
          onRetry={() => handleConfirmCancel(subView.invitationId)}
        />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'remove-saving') {
    return (
      <ScreenTransition transitionKey="team-remove-saving">
        <WritingState label="Guardando…" />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'remove-error') {
    return (
      <ScreenTransition transitionKey="team-remove-error">
        <WritingState
          error
          errorLabel="No pudimos quitar a esta persona de tu equipo. Intenta de nuevo."
          onRetry={() => handleConfirmRemove(subView.membershipId, subView.phone, subView.displayName)}
        />
      </ScreenTransition>
    );
  }

  if (subView.kind === 'invite-ready') {
    const link = buildInviteLink(subView.token);
    return (
      <ScreenTransition transitionKey="team-invite-ready">
        <div className={styles.wrap}>
          <button className={styles.back} onClick={() => setSubView({ kind: 'main' })}>
            ← Tu equipo
          </button>
          <h1 className={styles.heading}>Invitación lista</h1>
          <p className={styles.body}>
            Comparte este enlace con la persona que va a vender contigo.{' '}
            {/* `product/99-rfc/0014-invitation-target-hint-enforced.md`,
                `decision-log.md` D70 — supersedes the pre-D70 "funciona para
                cualquiera que lo abra" disclosure, which is no longer true
                (§3.12c's own corrected text): D70 requires the exact
                `targetHint` email to authenticate before acceptance
                succeeds. A legacy row regenerated without ever being opted
                in (`targetHintEmail === null`) has no email to state this
                guarantee against — the original, still-accurate-for-that-
                case disclosure is kept for that one branch only. */}
            {subView.targetHintEmail
              ? `Solo ${subView.targetHintEmail} va a poder aceptarlo, aunque alguien más llegue a tenerlo.`
              : 'El enlace funciona para cualquiera que lo abra — compártelo solo con la persona de tu confianza.'}
          </p>
          <p className={styles.linkBox}>{link}</p>
          <div className={styles.ctaStack}>
            <Button variant="secondary" onClick={() => handleCopy(link)}>
              Copiar enlace
            </Button>
            <Button variant="secondary" onClick={() => handleShare(link)}>
              Compartir...
            </Button>
          </div>
          {copyFeedback === 'copied' && <p className={styles.copyConfirmation}>Copiado ✓</p>}
          {copyFeedback === 'error' && (
            <p className={styles.copyError}>No pudimos copiar el enlace. Intenta "Compartir..." o selecciona el texto.</p>
          )}
          <p className={styles.hint}>
            Este es el único momento en que vas a poder ver este enlace — guárdalo o compártelo ahora. Deja de
            funcionar 24 horas después de creado.
          </p>
          <Button className={styles.cta} disabled={!ackTapped} onClick={() => setSubView({ kind: 'main' })}>
            Listo
          </Button>
        </div>
      </ScreenTransition>
    );
  }

  if (subView.kind === 'invite') {
    return (
      <ScreenTransition transitionKey="team-invite">
        <div className={styles.wrap}>
          <button className={styles.back} onClick={() => setSubView({ kind: 'main' })}>
            ← Tu equipo
          </button>
          <h1 className={styles.heading}>Nueva invitación</h1>
          <p className={styles.body}>
            Esta persona va a poder abrir sus propias sesiones de venta y registrar ventas desde su propio teléfono,
            usando tu mismo Catálogo y tus mismos precios.
          </p>
          <div className={styles.field}>
            <span className={styles.label}>Correo electrónico</span>
            <input
              className={styles.input}
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="ana@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {showFormatHint ? (
              <p className={styles.hint}>Verifica el correo — parece que le falta algo.</p>
            ) : hasDuplicatePending ? (
              <p className={styles.hint}>
                Ya tienes una invitación pendiente con este correo. Puedes crear otra invitación de todas formas si
                quieres.
              </p>
            ) : (
              // `product/99-rfc/0014-invitation-target-hint-enforced.md`,
              // `decision-log.md` D70 — corrected from the pre-D70 "es solo
              // para que tú recuerdes... no hace falta para crear la
              // invitación" line, which was true when this field was
              // optional and is no longer accurate now that it's required
              // and enforced at acceptance.
              <p className={styles.hint}>Para que solo esa persona pueda aceptarla, aunque alguien más llegue a tener el enlace.</p>
            )}
          </div>
          {/* `product/99-rfc/0014-invitation-target-hint-enforced.md`,
              `decision-log.md` D70 — the button is now gated on the field
              (reversing the pre-D70 "never gated on the optional field"
              posture), disabled until the typed value looks like a real
              email. */}
          <Button className={styles.cta} disabled={!looksValidEmail} onClick={handleGenerate}>
            Generar invitación
          </Button>
        </div>
      </ScreenTransition>
    );
  }

  // §3.11 — vista principal.
  return (
    <ScreenTransition transitionKey="team-main">
      <div className={styles.wrap}>
        <button className={styles.back} onClick={onBack}>
          ← Configuración
        </button>
        <h1 className={styles.heading}>Tu equipo</h1>

        {rows.length === 0 ? (
          <p className={styles.body}>
            Todavía nadie vende contigo. Invita a alguien de tu confianza para que registre ventas también, desde su
            propio teléfono.
          </p>
        ) : (
          <div className={styles.list}>
            {rows.map((row) => {
              if (row.kind === 'active' || row.kind === 'revoked') {
                // `decision-log.md` D69, `product-decisions.md` Q29 —
                // three-tier identity resolution (§2.7's own corrected
                // "Row display" order): `User.displayName` → phone → the
                // last-resort role-only fallback.
                const identity = memberIdentityLabel(row.displayName, row.phone);
                return (
                  <div key={row.membership.id} className={`${styles.row} stitchBottom`}>
                    <span className={styles.rowTitle}>{identity}</span>
                    {row.kind === 'active' ? (
                      <div className={styles.rowActiveLine}>
                        <span className={styles.rowStatus}>Vendiendo contigo</span>
                        <Button
                          variant="secondary"
                          inline
                          onClick={() =>
                            setSubView({
                              kind: 'remove-confirm',
                              membershipId: row.membership.id,
                              phone: row.phone,
                              displayName: row.displayName,
                            })
                          }
                        >
                          Quitar
                        </Button>
                      </div>
                    ) : (
                      <span className={styles.rowStatus}>Ya no vende contigo</span>
                    )}
                  </div>
                );
              }
              if (row.kind === 'cancelled') {
                return (
                  <div key={row.invitation.id} className={`${styles.row} stitchBottom`}>
                    <span className={styles.rowTitle}>Invitación cancelada</span>
                    <span className={styles.rowStatus}>{invitationMetaLine(row.invitation)}</span>
                  </div>
                );
              }
              // row.kind === 'pending' | 'expired'
              if (row.kind === 'pending') {
                // `product/99-rfc/0014-invitation-target-hint-enforced.md`,
                // `decision-log.md` D70 — distinguishes an ordinary
                // hint-bearing row (every Invitation created after D70
                // shipped) from a legacy, hint-less one (RFC 0014's own
                // backward-compatibility exemption), each with its own
                // honest copy and its own edit affordance
                // ("Editar correo"/"Agregar correo," same §3.12e sheet
                // either way).
                const hasHint = row.invitation.targetHint != null;
                return (
                  <div key={row.invitation.id} className={`${styles.row} stitchBottom`}>
                    <span className={styles.rowTitle}>Invitación pendiente</span>
                    <span className={styles.rowStatus}>
                      {hasHint
                        ? invitationMetaLine(row.invitation)
                        : `Creada el ${formatShortDate(dateKey(row.invitation.createdAt))} · sin correo asignado — cualquiera que abra el enlace puede aceptarla.`}
                    </span>
                    <div className={styles.rowActiveLine}>
                      <Button
                        variant="secondary"
                        inline
                        onClick={() => openEditHint(row.invitation.id, row.invitation.targetHint?.value)}
                      >
                        {hasHint ? 'Editar correo' : 'Agregar correo'}
                      </Button>
                      <Button
                        variant="secondary"
                        inline
                        onClick={() => setSubView({ kind: 'cancel-confirm', invitationId: row.invitation.id })}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                );
              }
              // row.kind === 'expired'
              return (
                <div key={row.invitation.id} className={`${styles.row} stitchBottom`}>
                  <span className={styles.rowTitle}>Invitación caducada</span>
                  <div className={styles.rowActiveLine}>
                    <span className={styles.rowStatus}>{invitationMetaLine(row.invitation)}</span>
                    <Button variant="secondary" inline onClick={() => recoverToken(row.invitation.id)}>
                      Generar otra
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button className={styles.cta} onClick={() => setSubView({ kind: 'invite' })}>
          Invitar a alguien
        </Button>
      </div>

      {subView.kind === 'cancel-confirm' && (
        <Sheet onDismiss={() => setSubView({ kind: 'main' })}>
          <p className={styles.confirmTitle}>¿Cancelar esta invitación?</p>
          <p className={styles.confirmBody}>Nadie va a poder usar este enlace después de esto.</p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setSubView({ kind: 'main' })}>
              No
            </Button>
            <Button variant="destructive" onClick={() => handleConfirmCancel(subView.invitationId)}>
              Sí, cancelar
            </Button>
          </div>
        </Sheet>
      )}

      {subView.kind === 'remove-confirm' && (
        <Sheet onDismiss={() => setSubView({ kind: 'main' })}>
          <p className={styles.confirmTitle}>
            ¿Quitar a {memberIdentityLabel(subView.displayName, subView.phone)} de tu equipo?
          </p>
          <p className={styles.confirmBody}>
            Ya no va a poder abrir sesiones de venta ni registrar ventas desde su teléfono. Las ventas que ya
            registró siguen exactamente como están — no se pierde nada.
          </p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setSubView({ kind: 'main' })}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleConfirmRemove(subView.membershipId, subView.phone, subView.displayName)}
            >
              Sí, quitar
            </Button>
          </div>
        </Sheet>
      )}

      {(subView.kind === 'edit-hint') && (
        <Sheet onDismiss={() => setSubView({ kind: 'main' })}>
          <p className={styles.confirmTitle}>Invitación pendiente</p>
          <div className={styles.field}>
            <span className={styles.label}>Correo electrónico</span>
            {/* Pre-filled with the invitation's current email hint when there
                is one, so it gets the same select-on-focus guard as every
                other "edit this existing value" field (see
                EditPriceSheet.tsx). No-op when the hint is unset. */}
            <input
              className={styles.input}
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              autoFocus
              onFocus={(e) => e.target.select()}
              placeholder="ana@correo.com"
              value={hintDraft}
              onChange={(e) => {
                setHintDraft(e.target.value);
                setHintSaveError(false);
              }}
            />
            {showHintFormatError && <p className={styles.error}>Verifica el correo — parece que le falta algo.</p>}
            {!showHintFormatError && (
              <p className={styles.hint}>Para que solo esa persona pueda aceptar la invitación.</p>
            )}
            {hintSaveError && <p className={styles.error}>No pudimos guardar el correo. Intenta de nuevo.</p>}
          </div>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setSubView({ kind: 'main' })}>
              Cancelar
            </Button>
            <Button disabled={!hintLooksValid} onClick={() => void handleSaveTargetHint(subView.invitationId)}>
              Guardar
            </Button>
          </div>
        </Sheet>
      )}
    </ScreenTransition>
  );
}
