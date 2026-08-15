import { useStore } from '../../domain/store';
import { findEvent, findVenue, hasAnyClosedSession } from '../../domain/selectors';
import type { ID } from '../../domain/types';
import { ResultadosColdStart } from './ResultadosColdStart';
import { ResultadosMain } from './ResultadosMain';
import { SessionDetail } from './SessionDetail';
import { ResultadosEventDetail } from './ResultadosEventDetail';
import { RendimientoPorBazar } from './RendimientoPorBazar';
import { VenueDetail } from './VenueDetail';
import { TusClientes } from './TusClientes';
import { ScreenTransition } from '../../components/ScreenTransition/ScreenTransition';

/** reports.md §3.8's own "back navigation follows whatever path she
 * actually took to arrive" rule — Event detail's parent is either the main
 * view's own Historial (label "← Resultados") or a "Rendimiento por bazar"
 * venue drill-down (§3.11, label "← Rendimiento por bazar", returning to
 * that same Venue). Carried as data rather than derived, since both are
 * genuinely reachable parents for the identical destination screen (§3.8:
 * "same destination every time, never a duplicated or divergent detail
 * screen per entry point"). */
export type EventDetailReturnTo = { mode: 'main' } | { mode: 'venue-detail'; venueId: ID };

/** Same idea one level deeper for Session detail (§3.7) — reachable from the
 * main view directly (En curso / Historial rows), from Event detail's own
 * Día rows (§3.8, whichever parent *that* Event detail itself has), or from
 * Home's "Ver detalle" hand-off (`home.md` §3.12, always `{mode:'main'}` —
 * "never routes through the cold start or the list first," §2 step 3, but
 * backing out of the detail screen it lands on has to go *somewhere*, and
 * the main view is the only defined ancestor for that entry point). */
export type SessionDetailReturnTo = { mode: 'main' } | { mode: 'event-detail'; eventId: ID; returnTo: EventDetailReturnTo };

export type ResultadosView =
  | { mode: 'main' }
  | { mode: 'session-detail'; sessionId: ID; returnTo: SessionDetailReturnTo }
  | { mode: 'event-detail'; eventId: ID; returnTo: EventDetailReturnTo }
  | { mode: 'venue-detail'; venueId: ID }
  | { mode: 'rendimiento' }
  | { mode: 'tus-clientes' };

/**
 * reports.md §2/§4 — Resultados tab resolution, following
 * `InventoryScreen`/`EventsScreen`'s own `{mode, ...}` internal view-state
 * pattern, lifted to `App.tsx` the same way `inventoryView`/`eventsView`
 * already are (Gap Analysis's own recommended shape).
 *
 * Two cross-tab hand-offs land here pre-set, skipping the main list
 * entirely (§2 step 3): Home's "Ver detalle" (`home.md` §3.12) arrives as
 * `{mode:'session-detail', ..., returnTo:{mode:'main'}}`; Eventos' "Ver
 * resumen en Resultados" (`events.md` §3.16) arrives as
 * `{mode:'event-detail', ..., returnTo:{mode:'main'}}` — both wired in
 * `App.tsx`, not here.
 */
export function ResultadosScreen({
  view,
  onChangeView,
  onNavigateToHoy,
  onNavigateToEventos,
}: {
  view: ResultadosView;
  onChangeView: (view: ResultadosView) => void;
  onNavigateToHoy: () => void;
  onNavigateToEventos: () => void;
}) {
  const { state } = useStore();

  // §2 step 4 / §3.6 — "rendimiento"/"venue-detail"/"tus-clientes" are
  // Paid-tier-only subviews. `ResultadosMain`'s own teaser buttons already
  // gate *entry* to them (`subscriptionTier === 'paid'`), but that alone
  // isn't enough: a Paid merchant already sitting on one of these screens
  // can have a pending downgrade reconcile while Resultados stays mounted
  // (`SettingsScreen`'s reconciliation-on-mount, no reload needed) and land
  // back here as a now-Free merchant. Data shown would still be accurate,
  // just no longer entitled — re-checked on every render, not only at the
  // entry point, so this is never reachable as a stale-entitlement leak.
  if (
    (view.mode === 'rendimiento' || view.mode === 'venue-detail' || view.mode === 'tus-clientes') &&
    state.business?.subscriptionTier !== 'paid'
  ) {
    view = { mode: 'main' };
  }

  if (view.mode === 'session-detail') {
    const { returnTo } = view;
    // The back label always has to name where the button actually goes —
    // "← Resultados" is only correct when the parent really is the main
    // view; returning into an Event detail instead is labeled with that
    // Event's own Venue name, the same "name the specific parent, not a
    // generic verb" convention `EventDetailReturnTo`'s own "← Rendimiento
    // por bazar" label already establishes.
    const backLabel =
      returnTo.mode === 'main' ? '← Resultados' : `← ${findVenue(state, findEvent(state, returnTo.eventId)?.venueId ?? '')?.displayName ?? 'Resultados'}`;
    return (
      <ScreenTransition transitionKey={`session-detail:${view.sessionId}`}>
        <SessionDetail
          sessionId={view.sessionId}
          backLabel={backLabel}
          onBack={() =>
            onChangeView(
              returnTo.mode === 'main'
                ? { mode: 'main' }
                : { mode: 'event-detail', eventId: returnTo.eventId, returnTo: returnTo.returnTo },
            )
          }
        />
      </ScreenTransition>
    );
  }

  if (view.mode === 'event-detail') {
    const { returnTo } = view;
    return (
      <ScreenTransition transitionKey={`event-detail:${view.eventId}`}>
        <ResultadosEventDetail
          eventId={view.eventId}
          backLabel={returnTo.mode === 'main' ? '← Resultados' : '← Rendimiento por bazar'}
          onBack={() =>
            onChangeView(returnTo.mode === 'main' ? { mode: 'main' } : { mode: 'venue-detail', venueId: returnTo.venueId })
          }
          onTapDay={(sessionId) =>
            onChangeView({ mode: 'session-detail', sessionId, returnTo: { mode: 'event-detail', eventId: view.eventId, returnTo } })
          }
        />
      </ScreenTransition>
    );
  }

  if (view.mode === 'venue-detail') {
    return (
      <ScreenTransition transitionKey={`venue-detail:${view.venueId}`}>
        <VenueDetail
          venueId={view.venueId}
          onBack={() => onChangeView({ mode: 'rendimiento' })}
          onTapEvent={(eventId) =>
            onChangeView({ mode: 'event-detail', eventId, returnTo: { mode: 'venue-detail', venueId: view.venueId } })
          }
        />
      </ScreenTransition>
    );
  }

  if (view.mode === 'rendimiento') {
    return (
      <ScreenTransition transitionKey="rendimiento">
        <RendimientoPorBazar
          onBack={() => onChangeView({ mode: 'main' })}
          onNavigateToEventos={onNavigateToEventos}
          onTapVenue={(venueId) => onChangeView({ mode: 'venue-detail', venueId })}
        />
      </ScreenTransition>
    );
  }

  if (view.mode === 'tus-clientes') {
    return (
      <ScreenTransition transitionKey="tus-clientes">
        <TusClientes onBack={() => onChangeView({ mode: 'main' })} />
      </ScreenTransition>
    );
  }

  if (!hasAnyClosedSession(state)) {
    return (
      <ScreenTransition transitionKey="cold-start">
        <ResultadosColdStart onNavigateToHoy={onNavigateToHoy} />
      </ScreenTransition>
    );
  }

  return (
    <ScreenTransition transitionKey="main">
      <ResultadosMain
        onTapSession={(sessionId) => onChangeView({ mode: 'session-detail', sessionId, returnTo: { mode: 'main' } })}
        onTapEvent={(eventId) => onChangeView({ mode: 'event-detail', eventId, returnTo: { mode: 'main' } })}
        onOpenRendimiento={() => onChangeView({ mode: 'rendimiento' })}
        onOpenTusClientes={() => onChangeView({ mode: 'tus-clientes' })}
      />
    </ScreenTransition>
  );
}
