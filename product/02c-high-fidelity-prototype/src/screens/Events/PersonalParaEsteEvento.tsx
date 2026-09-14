import { useState } from 'react';
import { useStore } from '../../domain/store';
import { findVenue, hasSchedulingConflict, phoneIdentifierFor } from '../../domain/selectors';
import { formatShortDateRange } from '../../domain/dates';
import { Button } from '../../components/Button/Button';
import type { AppState, BusinessMembership, Event, ID } from '../../domain/types';
import styles from './PersonalParaEsteEvento.module.css';

const SLOW_THRESHOLD_MS = 1500; // events.md §3.9's own "slow (>~1.5s)" boundary, per-row
const SETTLE_HIGHLIGHT_MS = 1100; // "briefly stays visually distinguished for a moment" (EVT-MIN1)

type RowAction = 'assign' | 'unassign';
type RowSaveState = { kind: 'idle' } | { kind: 'saving'; action: RowAction } | { kind: 'error'; action: RowAction };

/**
 * events.md §3.26 "Personal para este evento" — the shared screen both
 * "Asignar personal" (§3.11, `scheduled`) and "Ver personal de este evento"
 * (§3.14/§3.15, `active`) land on, unchanged between them (this document's
 * own §4 shared-state convention — identical prop shape to
 * `MercanciaParaEsteEvento.tsx`, this feature's own closest sibling). The
 * OWNER-side half of `product/99-rfc/0011-event-assignment.md`/
 * `decision-log.md` D60. OWNER-only, per `product-decisions.md` Q24/Q25's
 * settled permission table — the same gate the caller (`EventDetail.tsx`)
 * already applies to every other secondary action on this screen family.
 *
 * **Resolving states (§3.26's own near-instant/slow pair) are architecturally
 * inapplicable in this build, the identical disclosed reasoning
 * `MiActividadDeHoy.tsx` already states for its own §3.7c pair** — every
 * read this screen needs (the active-SELLER roster, current
 * `EventAssignment` rows, the live scheduling-conflict check, pending
 * `Invitation` existence) resolves synchronously from already-held
 * `AppState`, with no async boundary for a loading state to occupy
 * (`BACKLOG.md` §A, "Eventos: Resolving/load-error... deferred to backend
 * integration, Stage 7 — no earlier slice").
 */
export function PersonalParaEsteEvento({
  eventId,
  venueName,
  onBack,
}: {
  eventId: string;
  venueName: string;
  onBack: () => void;
}) {
  const { state, createEventAssignment, removeEventAssignment } = useStore();
  const [rowStates, setRowStates] = useState<Record<ID, RowSaveState>>({});
  const [slowIds, setSlowIds] = useState<Set<ID>>(new Set());
  const [settledIds, setSettledIds] = useState<Set<ID>>(new Set());

  if (!state.business) return null; // defensive — unreachable, same posture as sibling screens' own guard
  const businessId = state.business.id;

  // §3.26 — "one row per active `BusinessMembership` with `role = SELLER`,"
  // ordered by `createdAt`. A pending or revoked Membership is never shown —
  // deliberate narrowing from `settings.md`'s own fuller "Tu equipo" roster.
  const activeSellers = state.memberships
    .filter((m) => m.businessId === businessId && m.role === 'SELLER' && m.status === 'active')
    .sort((a, b) => a.createdAt - b.createdAt);

  const assignedMembershipIds = new Set(
    state.eventAssignments.filter((a) => a.eventId === eventId).map((a) => a.membershipId),
  );
  const asignadas = activeSellers.filter((m) => assignedMembershipIds.has(m.id));
  const sinAsignar = activeSellers.filter((m) => !assignedMembershipIds.has(m.id));

  function phoneFor(membership: BusinessMembership): string {
    return phoneIdentifierFor(state, membership.userId);
  }

  function rowState(membershipId: ID): RowSaveState {
    return rowStates[membershipId] ?? { kind: 'idle' };
  }

  function markSettled(membershipId: ID) {
    setSettledIds((prev) => new Set(prev).add(membershipId));
    window.setTimeout(() => {
      setSettledIds((prev) => {
        const next = new Set(prev);
        next.delete(membershipId);
        return next;
      });
    }, SETTLE_HIGHLIGHT_MS);
  }

  // §3.26's own per-row save/slow/error shape, per-row grain — each row's
  // tap is independent, so she may assign/unassign several rows in one
  // visit without waiting on any other row's write.
  //
  // **Idempotency:** `createEventAssignment`/`removeEventAssignment`
  // (`store.tsx`) are both idempotent by construction already — a real,
  // network-backed call to `assign_to_event`/`unassign_from_event`
  // (Stage 7 Backend Integration, Phase 2c), each naturally idempotent
  // server-side (upsert-shaped find-or-no-op for the former, a no-op delete
  // for the latter) — the same guarantee `architecture-principles.md` #7
  // asks for, achieved by the write's own shape rather than a separately
  // generated request key. A retried "Reintentar" tap can never
  // double-create or double-remove the same `EventAssignment` row.
  function runWrite(membershipId: ID, action: RowAction, commit: () => Promise<boolean>) {
    setRowStates((prev) => ({ ...prev, [membershipId]: { kind: 'saving', action } }));
    const slowTimer = window.setTimeout(() => {
      setSlowIds((prev) => new Set(prev).add(membershipId));
    }, SLOW_THRESHOLD_MS);
    void commit().then((ok) => {
      window.clearTimeout(slowTimer);
      setSlowIds((prev) => {
        const next = new Set(prev);
        next.delete(membershipId);
        return next;
      });
      if (ok) {
        setRowStates((prev) => ({ ...prev, [membershipId]: { kind: 'idle' } }));
        markSettled(membershipId);
      } else {
        console.error(`[PersonalParaEsteEvento] ${action} failed for membership`, membershipId);
        setRowStates((prev) => ({ ...prev, [membershipId]: { kind: 'error', action } }));
      }
    });
  }

  function handleAssign(membershipId: ID) {
    runWrite(membershipId, 'assign', () => createEventAssignment(businessId, eventId, membershipId));
  }

  function handleUnassign(membershipId: ID) {
    runWrite(membershipId, 'unassign', () => removeEventAssignment(businessId, eventId, membershipId));
  }

  // Zero-active-SELLER-Membership branches (EVT-M5) — checked only once,
  // ahead of the two-group roster below, since neither variant renders a
  // roster at all.
  if (activeSellers.length === 0) {
    const hasPendingInvitation = state.invitations.some(
      (inv) => inv.businessId === businessId && inv.status === 'pending',
    );
    return (
      <>
        <div className={styles.topbar}>
          <button className={styles.back} onClick={onBack}>
            ← {venueName}
          </button>
        </div>
        <h1 className={styles.heading}>Personal para este evento</h1>
        {hasPendingInvitation ? (
          <p className={styles.empty}>
            Ya invitaste a alguien, pero todavía no acepta la invitación. En cuanto acepte, va a aparecer aquí para
            que la asignes a este evento.
          </p>
        ) : (
          <p className={styles.empty}>
            Todavía no tienes a nadie en tu equipo. Invita a alguien de tu confianza desde Configuración, luego
            regresa aquí para asignarla a este evento.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      <div className={styles.topbar}>
        <button className={styles.back} onClick={onBack}>
          ← {venueName}
        </button>
      </div>
      <h1 className={styles.heading}>Personal para este evento</h1>
      <p className={styles.intro}>
        Elige quién más va a vender en este evento — tú siempre puedes vender aquí, sin asignarte. Cualquiera puede
        estar asignada a más de un evento a la vez.
      </p>

      <div className={styles.list}>
        {asignadas.length > 0 && (
          <div className={styles.group}>
            <p className={styles.groupLabel}>Asignadas</p>
            {asignadas.map((membership) => (
              <PersonalRow
                key={membership.id}
                state={state}
                membership={membership}
                eventId={eventId}
                phone={phoneFor(membership)}
                assigned
                saveState={rowState(membership.id)}
                slow={slowIds.has(membership.id)}
                settled={settledIds.has(membership.id)}
                onAssign={() => handleAssign(membership.id)}
                onUnassign={() => handleUnassign(membership.id)}
              />
            ))}
          </div>
        )}

        {sinAsignar.length > 0 && (
          <div className={styles.group}>
            <p className={styles.groupLabel}>Sin asignar</p>
            {sinAsignar.map((membership) => (
              <PersonalRow
                key={membership.id}
                state={state}
                membership={membership}
                eventId={eventId}
                phone={phoneFor(membership)}
                assigned={false}
                saveState={rowState(membership.id)}
                slow={slowIds.has(membership.id)}
                settled={settledIds.has(membership.id)}
                onAssign={() => handleAssign(membership.id)}
                onUnassign={() => handleUnassign(membership.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * One roster row — identical shape whether it currently renders inside
 * "Asignadas" or "Sin asignar" (only the status line + action button
 * differ). The scheduling-conflict line (§3.26, RFC 0011 Open Item 3,
 * EVT-M4) is computed live here, unconditionally, on every render, for
 * every row regardless of `assigned` — never gated behind a tap.
 */
function PersonalRow({
  state,
  membership,
  eventId,
  phone,
  assigned,
  saveState,
  slow,
  settled,
  onAssign,
  onUnassign,
}: {
  state: AppState;
  membership: BusinessMembership;
  eventId: string;
  phone: string;
  assigned: boolean;
  saveState: RowSaveState;
  slow: boolean;
  settled: boolean;
  onAssign: () => void;
  onUnassign: () => void;
}) {
  const conflicts = hasSchedulingConflict(state, membership.id, eventId);
  const conflictLine = buildConflictLine(state, conflicts);
  const saving = saveState.kind === 'saving';
  const error = saveState.kind === 'error';
  const retry = saveState.kind === 'error' && saveState.action === 'assign' ? onAssign : onUnassign;

  const rowClassName = [styles.row, saving && !slow ? styles.rowSaving : '', settled ? styles.rowSettled : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`${rowClassName} stitchBottom`}>
      <div className={styles.rowTopLine}>
        <span className={styles.rowPhone}>{formatPhone(phone)}</span>
      </div>
      {assigned && <p className={styles.rowStatus}>Vendiendo en este evento</p>}
      {conflictLine && <p className={styles.conflictLine}>{conflictLine}</p>}

      {saving && slow && <p className={styles.savingLabel}>Guardando…</p>}

      {!saving && !error && (
        <div className={styles.rowActions}>
          {assigned ? (
            <Button variant="secondary" inline onClick={onUnassign}>
              Quitar
            </Button>
          ) : (
            <Button inline onClick={onAssign}>
              Asignar
            </Button>
          )}
        </div>
      )}

      {/* §3.26's own per-row write-failure branch — Stage 7 Backend
          Integration, Phase 2c: `createEventAssignment`/
          `removeEventAssignment` are now real, network-backed RPC calls
          that can genuinely fail (a network drop, a platform error), so
          this branch is real and reachable, no longer disclosed-not-wired
          (`MercanciaParaEsteEvento.tsx`'s own equivalent branch stays
          disclosed-not-wired until its own backend phase, 2b). */}
      {error && (
        <div className={styles.errorActions}>
          <p className={styles.errorLine}>
            {saveState.action === 'assign'
              ? 'No pudimos asignar a esta persona. Intenta de nuevo.'
              : 'No pudimos quitarla de este evento. Intenta de nuevo.'}
          </p>
          <Button inline onClick={retry}>
            Reintentar
          </Button>
        </div>
      )}
    </div>
  );
}

/** §3.26's own conflict-copy rule — names every conflicting Event by
 * `Venue.displayName` + date range, joined with "y" (correct Spanish list
 * join for 3+), with the correct singular/plural verb. */
function buildConflictLine(state: AppState, conflicts: Event[]): string | null {
  if (conflicts.length === 0) return null;
  const parts = conflicts.map((e) => {
    const venue = findVenue(state, e.venueId);
    return `${venue?.displayName ?? ''} (${formatShortDateRange(e.startDate, e.endDate)})`;
  });
  const verb = conflicts.length > 1 ? 'se cruzan' : 'se cruza';
  return `También va a vender en ${joinSpanishList(parts)}, que ${verb} con estas fechas.`;
}

function joinSpanishList(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? '';
  if (parts.length === 2) return `${parts[0]} y ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')} y ${parts[parts.length - 1]}`;
}

/** Same phone-grouping display as `TeamScreen.tsx`'s own `formatPhone` — a
 * local copy per this folder's own convention (§3.26's own "no display-name
 * field exists on `User` yet" annotation, the identical gap `settings.md`
 * §2.7 already flags, not solved a second time here). */
function formatPhone(phone: string): string {
  if (phone.length !== 10) return phone;
  return `${phone.slice(0, 2)} ${phone.slice(2, 6)} ${phone.slice(6)}`;
}
