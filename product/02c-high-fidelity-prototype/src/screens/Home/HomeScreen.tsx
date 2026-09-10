import { useEffect, useState } from 'react';
import { useStore } from '../../domain/store';
import {
  hasAnyAvailableUnit,
  myActiveSession,
  activeEventsForBusiness,
  actingMembership,
  dayNumberForDate,
  findVenue,
  qualifyingEventsForMembership,
  scheduledEventsForBusiness,
  sessionsOpenedBy,
  todaySalesSummary,
  upcomingEventForBusiness,
  upcomingQualifyingEventForMembership,
} from '../../domain/selectors';
import { dateKey, todayKey } from '../../domain/dates';
import { ColdStart } from './ColdStart';
import { Idle } from './Idle';
import { EventResume } from './EventResume';
import { ElegirEvento } from './ElegirEvento';
import { MiActividadDeHoy } from './MiActividadDeHoy';
import { Selling } from './Selling';
import { ReceiptTicket } from '../../components/ReceiptTicket/ReceiptTicket';
import { CloseSummary } from './CloseSummary';
import { SettingsScreen } from '../Settings/SettingsScreen';
import { SellerAccountScreen } from './SellerAccountScreen';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';
import { setReceiptScreenActive } from '../DemoMode/receiptScreenSignal';
import { setHomeScreenMounted } from '../AccesoDM/homeScreenMountedSignal';
import type { Receipt } from '../../domain/store';

type HomeUiState =
  | { kind: 'resolved' }
  | { kind: 'receipt'; receipt: Receipt }
  | { kind: 'closed'; count: number; revenue: number; venueName?: string; dayNumber?: number; sessionId: string }
  | { kind: 'account' };

/**
 * home.md §2 — resolution/decision logic, evaluated automatically on every
 * open. Covers all four numbered steps plus Slice 12's role resolution and
 * D53 multi-Event split: an active Session (this device's own acting
 * Membership) outranks everything (step 1); otherwise, qualifying Event(s)
 * with no Session currently active for this Membership (step 2a/2b);
 * otherwise cold start vs. idle, gated on whether any `available`
 * InventoryUnit exists (step 3). **Step 0 (revoked Membership) is resolved
 * one level up, in `App.tsx`, before this component — or the tab shell at
 * all — ever mounts**, since `settings.md §3.14`'s own wireframe shows no
 * header/nav bar at all for that state, a stronger omission than anything
 * this component's own header-bearing states carry.
 */
export function HomeScreen({
  onNavigateToRegister,
  onNavigateToEvent,
  onNavigateToResultadosSession,
  onNavigateToAssignTags,
  onNavigateToInventarioViaSettingsTagsOn,
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
  /** settings.md §2.6 (`decision-log.md` D46 Addendum) — forwarded straight
   * through to `SettingsScreen`'s own `onSwitchedToTags`; this component
   * adds no logic of its own, it only carries the callback across the tab
   * boundary Configuración itself doesn't own. */
  onNavigateToInventarioViaSettingsTagsOn: () => void;
}) {
  const { state, startSession } = useStore();
  const [ui, setUi] = useState<HomeUiState>({ kind: 'resolved' });
  const [miActividadOpen, setMiActividadOpen] = useState(false);
  // home.md §3.6b — "selecting a row never opens a Session itself... the
  // Session only opens at that Event's own 'Continuar Día N' tap." Since
  // nothing is written to `AppState` at the moment of the row tap itself,
  // this screen needs its own local memory of which qualifying Event she
  // picked — found and fixed via live verification (`npm run dev`, a real
  // two-simultaneous-Event walkthrough): without this, tapping a row had
  // nothing to trigger a re-render *toward*, since §2's own resolution logic
  // is a pure function of `AppState` alone and nothing about tapping a row
  // changes that state yet. Cleared implicitly the moment a Session actually
  // opens (step 1 then wins outright, `qualifyingEvents`/this local pick are
  // never consulted again for the rest of that Session).
  const [pickedEventId, setPickedEventId] = useState<string | null>(null);

  // demo-mode.md §2.3 check 2 / §8 item 7 — reports this screen's own
  // `ui.kind === 'receipt'` fact to `receiptScreenSignal.ts`'s route-level
  // signal, the one thing the demo-only reminder banner's mounting wrapper
  // needs to suppress itself while `home.md §3.8f` is active. A no-op in a
  // real production build (nothing ever reads this signal there). Called
  // unconditionally, before any of this component's own early returns, to
  // keep hook order stable.
  useEffect(() => {
    setReceiptScreenActive(ui.kind === 'receipt');
    return () => setReceiptScreenActive(false);
  }, [ui.kind]);

  // acceso-dm.md §2.3 check 4 — reports "HomeScreen is currently mounted"
  // (i.e. the Hoy tab is active) to `homeScreenMountedSignal.ts`, the one
  // fact `ResultsGuidanceNudge.tsx` needs to render on Home only, never on
  // Inventario/Eventos/Resultados, without reaching into `App.tsx`'s own tab
  // shell. Same mount/unmount-reporting shape as the receipt signal above —
  // a no-op for every merchant not on the Acceso DM route, since nothing
  // else in this codebase subscribes to it.
  useEffect(() => {
    setHomeScreenMounted(true);
    return () => setHomeScreenMounted(false);
  }, []);

  if (!state.business) return null; // defensive — AppRouter only mounts this once onboarding is complete

  // §2's new Role-resolution sub-step, evaluated once per Home open,
  // immediately after step 0's revoked-Membership check (resolved one level
  // up, `App.tsx`) — drives which nav-tab set renders, what the header icon
  // does, which cold-start/§3.6a copy variant renders, and whether §3.9's
  // tile-tap dead-end message can offer an Inventario link. `membership`
  // is defensively guaranteed non-null here (`App.tsx` only mounts the tab
  // shell once a valid acting Membership resolves); the fallback exists
  // only to keep this component typesafe against that defensive edge.
  const membership = actingMembership(state);
  if (!membership) return null;
  const role = membership.role;
  const headerIcon = role === 'OWNER' ? '⚙' : '⊚';
  const openAccountSurface = () => setUi({ kind: 'account' });

  const session = myActiveSession(state, membership.id);

  if (ui.kind === 'receipt') {
    return (
      <ReceiptTicket
        total={ui.receipt.total}
        businessName={ui.receipt.businessName}
        businessLogo={ui.receipt.businessLogo}
        subscriptionTier={ui.receipt.subscriptionTier}
        claimToken={ui.receipt.claimToken}
        onExit={() => setUi({ kind: 'resolved' })}
      />
    );
  }

  if (ui.kind === 'closed') {
    return (
      <ScreenTransition transitionKey="closed">
        <CloseSummary
          count={ui.count}
          revenue={ui.revenue}
          venueName={ui.venueName}
          dayNumber={ui.dayNumber}
          // A SELLER has no standing reach into Resultados (home.md §3.16 —
          // the tab is never rendered at all for her); "Ver detalle" would
          // be exactly the dead link to an unreachable destination §3.6a's
          // own governing rule already forbids elsewhere in this document.
          // Not explicitly re-enumerated for this screen by the approved
          // spec (a disclosed extension of that same already-stated
          // principle, not an invented new behavior) — see this build's own
          // report for the full reasoning.
          onViewDetail={
            role === 'OWNER'
              ? () => {
                  const sessionId = ui.sessionId;
                  setUi({ kind: 'resolved' });
                  onNavigateToResultadosSession(sessionId);
                }
              : undefined
          }
          onContinue={() => setUi({ kind: 'resolved' })}
        />
      </ScreenTransition>
    );
  }

  if (ui.kind === 'account') {
    // settings.md — full Configuración for OWNER (Migration Workflow, D43);
    // home.md §3.15a's own minimal stand-in for SELLER, reached through the
    // identical header affordance (§3.15).
    return (
      <ScreenTransition transitionKey="account">
        {role === 'OWNER' ? (
          <SettingsScreen
            onBack={() => setUi({ kind: 'resolved' })}
            onSwitchedToTags={onNavigateToInventarioViaSettingsTagsOn}
          />
        ) : (
          <SellerAccountScreen onBack={() => setUi({ kind: 'resolved' })} />
        )}
      </ScreenTransition>
    );
  }

  if (session) {
    const eventForSession = session.eventId ? state.events.find((e) => e.id === session.eventId) : undefined;
    const venueName = eventForSession ? findVenue(state, eventForSession.venueId)?.displayName : undefined;
    const dayNumber = eventForSession ? dayNumberForDate(state, eventForSession.id, todayKey()) : undefined;
    const headerTitle = eventForSession && venueName ? `${venueName} · Día ${dayNumber}` : 'Venta rápida';
    if (miActividadOpen) {
      return (
        <MiActividadDeHoy
          membershipId={membership.id}
          eventId={session.eventId}
          headerTitle={headerTitle}
          onBack={() => setMiActividadOpen(false)}
        />
      );
    }
    return (
      <ScreenTransition transitionKey="selling">
        <Selling
          role={role}
          onSaleFinalized={(receipt) => setUi({ kind: 'receipt', receipt })}
          onSessionClosed={(summary, sessionId) => setUi({ kind: 'closed', ...summary, venueName, dayNumber, sessionId })}
          onOpenAccountSurface={openAccountSurface}
          onNavigateToAssignTags={onNavigateToAssignTags}
          onOpenMiActividad={() => setMiActividadOpen(true)}
        />
      </ScreenTransition>
    );
  }

  // §2 steps 2a/2b (`decision-log.md` D53, `product-decisions.md` Q24/Q25)
  // — simultaneous multi-Event operation is real now, so "an active Event"
  // is no longer assumed singular. **Role-scoped as of
  // `product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60**
  // (`qualifyingEventsForMembership`): unchanged Business-wide set for an
  // OWNER, narrowed to only her own `EventAssignment` rows for a SELLER.
  // `businessActiveEvents` stays the raw, unfiltered Business-wide set —
  // needed separately below for the new SELLER passive-awareness line
  // (§3.3/§3.4/§3.5), which must distinguish "nothing's happening" from
  // "something's happening, just not for you."
  const businessActiveEvents = activeEventsForBusiness(state);
  const qualifyingEvents = qualifyingEventsForMembership(state, membership);
  if (qualifyingEvents.length === 1) {
    return renderEventResume(qualifyingEvents[0].id);
  }
  if (qualifyingEvents.length > 1) {
    const today = todayKey();
    const qualifyingIds = new Set(qualifyingEvents.map((e) => e.id));
    const todaysOwnSessions = sessionsOpenedBy(state, membership.id)
      .filter((s) => s.eventId != null && qualifyingIds.has(s.eventId) && dateKey(s.openedAt) === today)
      .sort((a, b) => b.openedAt - a.openedAt);
    const signaledEventId = todaysOwnSessions[0]?.eventId ?? undefined;
    // §3.6b's own row tap (see `pickedEventId`'s doc comment above) — only
    // consulted once the "does today already have a signal" check above has
    // already come back empty, the same priority order §2 step 2b itself
    // specifies (signal first, picker only if genuinely nothing yet).
    const effectiveEventId = signaledEventId ?? (pickedEventId && qualifyingIds.has(pickedEventId) ? pickedEventId : undefined);
    if (effectiveEventId) {
      return renderEventResume(effectiveEventId);
    }
    return (
      <ScreenTransition transitionKey="elegir-evento">
        <ElegirEvento
          events={qualifyingEvents}
          headerIcon={headerIcon}
          onOpenAccountSurface={openAccountSurface}
          onSelect={(eventId) => setPickedEventId(eventId)}
        />
      </ScreenTransition>
    );
  }

  // §3.3/§3.4/§3.5's new SELLER passive-awareness line
  // (`product/99-rfc/0011-event-assignment.md`/`decision-log.md` D60) —
  // reached only here, where `qualifyingEvents.length === 0` is already
  // guaranteed by construction (both branches above returned otherwise).
  // True only when *this* SELLER's own role-scoped check just failed *and*
  // the Business has 1+ Event active elsewhere, Business-wide — "not you,"
  // never "nothing's happening" (that case is `businessActiveEvents.length
  // === 0`, which correctly renders nothing extra). Always `false` for an
  // OWNER, whose own qualifying set is the Business-wide set already, so the
  // two can never diverge for her.
  const sellerEventsElsewhere = role === 'SELLER' && businessActiveEvents.length > 0;

  // §2 step 3's card-rendering check, role-scoped (2026-09-10 amendment,
  // `merchant-user-tester`-found defect, `architect`-confirmed as completing
  // `product/99-rfc/0011-event-assignment.md`'s own SELLER-narrowing pattern
  // for the `scheduled` case — the identical shape step 2's
  // `qualifyingEventsForMembership` already established above). OWNER stays
  // Business-wide, unchanged (`upcomingEventForBusiness`); SELLER narrows to
  // the soonest `scheduled` Event she holds an `EventAssignment` for
  // (`upcomingQualifyingEventForMembership`), `undefined` when she holds
  // none. `businessScheduledEvents` is the raw, unfiltered Business-wide set
  // — needed separately, exactly like `businessActiveEvents` above, to
  // distinguish "nothing scheduled anywhere" from "something scheduled, just
  // not for you" for the new §3.4 passive line below. Resolved here, ahead of
  // both the cold-start and idle branches, since §3.3 can also carry this
  // line (see `sellerEventsScheduledElsewhere`, passed to `ColdStart` too).
  const businessScheduledEvents = scheduledEventsForBusiness(state);
  const upcomingEvent = role === 'OWNER' ? upcomingEventForBusiness(state) : upcomingQualifyingEventForMembership(state, membership);
  // §3.4/§3.5's new SELLER "scheduled elsewhere, not assigned" line — the
  // `scheduled`-case mirror of `sellerEventsElsewhere` above, one Event
  // lifecycle stage earlier. Mutually exclusive with `upcomingEvent` by
  // construction: `upcomingEvent` is `undefined` for a SELLER exactly when
  // her own `upcomingQualifyingEventForMembership` row count is zero, which
  // is this line's own precondition. Always `false` for an OWNER, whose own
  // upcoming-Event resolution is the Business-wide set already, so the two
  // can never diverge for her.
  const sellerEventsScheduledElsewhere = role === 'SELLER' && !upcomingEvent && businessScheduledEvents.length > 0;

  if (!hasAnyAvailableUnit(state)) {
    return (
      <ScreenTransition transitionKey="cold-start">
        <ColdStart
          role={role}
          onRegister={onNavigateToRegister}
          onOpenAccountSurface={openAccountSurface}
          headerIcon={headerIcon}
          sellerEventsElsewhere={sellerEventsElsewhere}
          sellerEventsScheduledElsewhere={sellerEventsScheduledElsewhere}
        />
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition transitionKey="idle">
      <Idle
        role={role}
        headerIcon={headerIcon}
        upcomingEventVenueName={upcomingEvent ? findVenue(state, upcomingEvent.venueId)?.displayName : undefined}
        upcomingEventStartDate={upcomingEvent?.startDate}
        onTapUpcomingEvent={upcomingEvent && role === 'OWNER' ? () => onNavigateToEvent(upcomingEvent.id) : undefined}
        todaySales={todaySalesSummary(state, null)}
        onStartSession={(overrideToNfc) => startSession(undefined, overrideToNfc)}
        onOpenAccountSurface={openAccountSurface}
        onOpenAssignTagsPlaceholder={onNavigateToAssignTags}
        sellerEventsElsewhere={sellerEventsElsewhere}
        sellerEventsScheduledElsewhere={sellerEventsScheduledElsewhere}
      />
    </ScreenTransition>
  );

  // Local helper, closed over `state`/`membership`/`role`/`headerIcon` —
  // §3.6's own screen, reached identically whether resolved straight
  // through (2a, or 2b's own same-day-signal skip) or via a tap on §3.6b's
  // list. Declared as a function (not a component) since it renders
  // directly, mid-body, from three different call sites above.
  function renderEventResume(eventId: string) {
    const event = state.events.find((e) => e.id === eventId);
    if (!event) return null; // defensive — every caller passes an id drawn from `state.events` itself
    const venueName = findVenue(state, event.venueId)?.displayName ?? '';
    const dayNumber = dayNumberForDate(state, event.id, todayKey());
    return (
      <ScreenTransition transitionKey={`event-resume:${eventId}`}>
        <EventResume
          role={role}
          headerIcon={headerIcon}
          venueName={venueName}
          dayNumber={dayNumber}
          todaySales={todaySalesSummary(state, eventId)}
          onContinue={(overrideToNfc) => startSession(eventId, overrideToNfc)}
          onOpenAccountSurface={openAccountSurface}
          onOpenAssignTagsPlaceholder={onNavigateToAssignTags}
        />
      </ScreenTransition>
    );
  }
}
