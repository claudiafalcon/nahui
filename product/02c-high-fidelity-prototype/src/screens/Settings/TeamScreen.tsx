import { useState } from 'react';
import { useStore } from '../../domain/store';
import { teamRows } from '../../domain/selectors';
import { Button } from '../../components/Button/Button';
import { Sheet } from '../../components/Sheet/Sheet';
import { WritingState } from './WritingState';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import type { ID } from '../../domain/types';
import styles from './TeamScreen.module.css';

type SubView =
  | { kind: 'main' }
  | { kind: 'invite' }
  | { kind: 'invite-saving' }
  | { kind: 'invite-error' }
  | { kind: 'remove-confirm'; membershipId: ID; phone: string }
  | { kind: 'remove-saving'; membershipId: ID; phone: string }
  | { kind: 'remove-error'; membershipId: ID; phone: string };

const SAVE_DELAY_MS = 260;

/**
 * settings.md §2.7/§3.11-§3.13 "Tu equipo" — invite a SELLER, view team
 * status, revoke an accepted SELLER's access. Reached only from the
 * Paid-tier vista principal's "Ver equipo" row (`SettingsScreen.tsx`) — this
 * component never checks `subscriptionTier` itself, the same "the caller
 * already gated this" posture every other sub-screen in this folder holds.
 */
export function TeamScreen({ onBack }: { onBack: () => void }) {
  const { state, createInvitation, revokeMembership } = useStore();
  const [subView, setSubView] = useState<SubView>({ kind: 'main' });
  const [phone, setPhone] = useState('');

  if (!state.business) return null; // defensive — unreachable, same posture as SettingsScreen's own guard

  const rows = teamRows(state, state.business.id);

  const trimmedPhone = phone.trim();
  const isValidDigits = /^\d{10}$/.test(trimmedPhone);
  const alreadyPending = state.invitations.some(
    (inv) => inv.businessId === state.business!.id && inv.phone === trimmedPhone && inv.status === 'pending',
  );
  const alreadyMember = state.memberships.some((m) => {
    const u = state.users.find((usr) => usr.id === m.userId);
    return m.businessId === state.business!.id && u?.phone === trimmedPhone;
  });
  const inlineMessage = !isValidDigits
    ? null
    : alreadyPending
      ? 'Ya invitaste a este número — está esperando a que acepte.'
      : alreadyMember
        ? 'Este número ya vende contigo.'
        : null;
  const canSend = isValidDigits && !inlineMessage;

  function handleSendInvitation() {
    if (!canSend) return;
    setSubView({ kind: 'invite-saving' });
    window.setTimeout(() => {
      createInvitation(trimmedPhone);
      setPhone('');
      setSubView({ kind: 'main' });
    }, SAVE_DELAY_MS);
  }

  function handleConfirmRemove(membershipId: ID, phoneLabel: string) {
    setSubView({ kind: 'remove-saving', membershipId, phone: phoneLabel });
    window.setTimeout(() => {
      revokeMembership(membershipId);
      setSubView({ kind: 'main' });
    }, SAVE_DELAY_MS);
  }

  if (subView.kind === 'invite-saving') {
    return (
      <ScreenTransition transitionKey="team-invite-saving">
        <WritingState label="Guardando…" />
      </ScreenTransition>
    );
  }
  if (subView.kind === 'invite-error') {
    // §3.9/§3.10's shared write-failure shape — never actually triggered in
    // this build (the local mock write never fails), same disclosed-not-
    // wired convention as every other write in this codebase.
    return (
      <ScreenTransition transitionKey="team-invite-error">
        <WritingState
          error
          errorLabel="No pudimos enviar la invitación. Intenta de nuevo."
          onRetry={handleSendInvitation}
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
          onRetry={() => handleConfirmRemove(subView.membershipId, subView.phone)}
        />
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
            <span className={styles.label}>Número celular</span>
            <div className={styles.inputRow}>
              <span className={styles.prefix}>+52</span>
              <input
                className={styles.input}
                type="tel"
                inputMode="numeric"
                autoFocus
                maxLength={10}
                placeholder="55 1234 5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            {inlineMessage && <p className={styles.error}>{inlineMessage}</p>}
          </div>
          <Button className={styles.cta} disabled={!canSend} onClick={handleSendInvitation}>
            Enviar invitación
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
              if (row.kind === 'pending') {
                return (
                  <div key={row.invitation.id} className={`${styles.row} stitchBottom`}>
                    <span className={styles.rowPhone}>{formatPhone(row.invitation.phone)}</span>
                    <span className={styles.rowStatus}>Invitación enviada</span>
                  </div>
                );
              }
              return (
                <div key={row.membership.id} className={`${styles.row} stitchBottom`}>
                  <span className={styles.rowPhone}>{formatPhone(row.phone)}</span>
                  {row.kind === 'active' ? (
                    <div className={styles.rowActiveLine}>
                      <span className={styles.rowStatus}>Vendiendo contigo</span>
                      <Button
                        variant="secondary"
                        inline
                        onClick={() => setSubView({ kind: 'remove-confirm', membershipId: row.membership.id, phone: row.phone })}
                      >
                        Quitar
                      </Button>
                    </div>
                  ) : (
                    <span className={styles.rowStatus}>Ya no vende contigo</span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <Button className={styles.cta} onClick={() => setSubView({ kind: 'invite' })}>
          Invitar a alguien
        </Button>
      </div>

      {subView.kind === 'remove-confirm' && (
        <Sheet onDismiss={() => setSubView({ kind: 'main' })}>
          <p className={styles.confirmTitle}>¿Quitar a {formatPhone(subView.phone)} de tu equipo?</p>
          <p className={styles.confirmBody}>
            Ya no va a poder abrir sesiones de venta ni registrar ventas desde su teléfono. Las ventas que ya
            registró siguen exactamente como están — no se pierde nada.
          </p>
          <div className={styles.confirmRow}>
            <Button variant="secondary" onClick={() => setSubView({ kind: 'main' })}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={() => handleConfirmRemove(subView.membershipId, subView.phone)}>
              Sí, quitar
            </Button>
          </div>
        </Sheet>
      )}
    </ScreenTransition>
  );
}

/** Plain "55 1234 5678" display grouping — `settings.md` §2.7's own named
 * gap ("no personal display-name field yet") means a phone number is the
 * only identifier this screen can show; grouped the same way `CodeStep.tsx`
 * already renders a confirmed phone back to her. */
function formatPhone(phone: string): string {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 2)} ${phone.slice(2, 6)} ${phone.slice(6)}`;
}
