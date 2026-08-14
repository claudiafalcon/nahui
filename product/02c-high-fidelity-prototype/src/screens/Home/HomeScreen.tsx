import { useState } from 'react';
import { useStore } from '../../domain/store';
import {
  hasAnyAvailableUnit,
  activeSession,
  activeEventForBusiness,
  dayNumberForDate,
  findVenue,
  todaySalesSummary,
  upcomingEventForBusiness,
} from '../../domain/selectors';
import { todayKey } from '../../domain/dates';
import { ColdStart } from './ColdStart';
import { Idle } from './Idle';
import { EventResume } from './EventResume';
import { Selling } from './Selling';
import { ReceiptTicket } from '../../components/ReceiptTicket/ReceiptTicket';
import { CloseSummary } from './CloseSummary';
import { SettingsScreen } from '../Settings/SettingsScreen';
import type { Receipt } from '../../domain/store';

type HomeUiState =
  | { kind: 'resolved' }
  | { kind: 'receipt'; receipt: Receipt }
  | { kind: 'closed'; count: number; revenue: number; venueName?: string; dayNumber?: number; sessionId: string }
  | { kind: 'settings' };

/**
 * home.md §2 — resolution/decision logic, evaluated automatically on every
 * open. Now covers all four numbered steps, per the Eventos pass (D43): an
 * active Session outranks everything (step 1); otherwise, an active Event
 * with no Session currently active (step 2 — see `EventResume.tsx`'s own
 * comment for the corrected reading applied here); otherwise cold start vs.
 * idle, gated on whether any `available` InventoryUnit exists (step 3).
 */
export function HomeScreen({
  onNavigateToRegister,
  onNavigateToEvent,
  onNavigateToResultadosSession,
  onNavigateToAssignTags,
}: {
  onNavigateToRegister: () => void;
  onNavigateToEvent: (eventId: string) => void;
  /** reports.md §2 step 3 / `home.md` §3.12's "Ver detalle" hand-off
   * (Resultados pass, D43, closing the exact wiring gap the Gap Analysis
   * named) — lands directly on Resultados' Session detail for this
   * Session, skipping the main list entirely. */
  onNavigateToResultadosSession: (sessionId: string) => void;
  /** §3.6a's "Asignar tags" link (Idle/EventResume, both instances) —
   * routes into Inventario's real Asignar Tags queue (inventory.md §3.14,
   * Asignar Tags pass, D43), replacing the earlier honest Placeholder stub. */
  onNavigateToAssignTags: () => void;
}) {
  const { state, startSession } = useStore();
  const [ui, setUi] = useState<HomeUiState>({ kind: 'resolved' });

  const session = activeSession(state);

  if (!state.business) return null; // defensive — AppRouter only mounts this once onboarding is complete

  if (ui.kind === 'receipt') {
    return (
      <ReceiptTicket
        total={ui.receipt.total}
        businessName={ui.receipt.businessName}
        businessLogo={ui.receipt.businessLogo}
        onExit={() => setUi({ kind: 'resolved' })}
      />
    );
  }

  if (ui.kind === 'closed') {
    return (
      <CloseSummary
        count={ui.count}
        revenue={ui.revenue}
        venueName={ui.venueName}
        dayNumber={ui.dayNumber}
        onViewDetail={() => {
          const sessionId = ui.sessionId;
          setUi({ kind: 'resolved' });
          onNavigateToResultadosSession(sessionId);
        }}
        onContinue={() => setUi({ kind: 'resolved' })}
      />
    );
  }

  if (ui.kind === 'settings') {
    // settings.md — the real Configuración flow (Migration Workflow, D43),
    // replacing this branch's earlier honest Placeholder.
    return <SettingsScreen onBack={() => setUi({ kind: 'resolved' })} />;
  }

  if (session) {
    const eventForSession = session.eventId ? state.events.find((e) => e.id === session.eventId) : undefined;
    const venueName = eventForSession ? findVenue(state, eventForSession.venueId)?.displayName : undefined;
    const dayNumber = eventForSession
      ? dayNumberForDate(state, eventForSession.id, todayKey())
      : undefined;
    return (
      <Selling
        onSaleFinalized={(receipt) => setUi({ kind: 'receipt', receipt })}
        onSessionClosed={(summary, sessionId) => setUi({ kind: 'closed', ...summary, venueName, dayNumber, sessionId })}
        onOpenSettings={() => setUi({ kind: 'settings' })}
      />
    );
  }

  const activeEvent = activeEventForBusiness(state);
  if (activeEvent) {
    const venueName = findVenue(state, activeEvent.venueId)?.displayName ?? '';
    const dayNumber = dayNumberForDate(state, activeEvent.id, todayKey());
    return (
      <EventResume
        venueName={venueName}
        dayNumber={dayNumber}
        defaultSellingMode={state.business.defaultSellingMode}
        todaySales={todaySalesSummary(state, activeEvent.id)}
        onContinue={() => startSession(activeEvent.id)}
        onOpenSettings={() => setUi({ kind: 'settings' })}
        onOpenAssignTagsPlaceholder={onNavigateToAssignTags}
      />
    );
  }

  if (!hasAnyAvailableUnit(state)) {
    return <ColdStart onRegister={onNavigateToRegister} onOpenSettings={() => setUi({ kind: 'settings' })} />;
  }

  const upcomingEvent = upcomingEventForBusiness(state);

  return (
    <Idle
      defaultSellingMode={state.business.defaultSellingMode}
      upcomingEventVenueName={upcomingEvent ? findVenue(state, upcomingEvent.venueId)?.displayName : undefined}
      upcomingEventStartDate={upcomingEvent?.startDate}
      onTapUpcomingEvent={upcomingEvent ? () => onNavigateToEvent(upcomingEvent.id) : undefined}
      todaySales={todaySalesSummary(state, null)}
      onStartSession={() => startSession()}
      onOpenSettings={() => setUi({ kind: 'settings' })}
      onOpenAssignTagsPlaceholder={onNavigateToAssignTags}
    />
  );
}
