import { useState } from 'react';
import { useStore } from '../../domain/store';
import { EventsColdStart } from './EventsColdStart';
import { EventsList, hasAnyVisibleEvent } from './EventsList';
import { NuevoEvento } from './NuevoEvento';
import { EventDetail } from './EventDetail';

export type EventsView =
  | { mode: 'list' }
  | { mode: 'new-event' }
  | { mode: 'detail'; eventId: string };

/**
 * events.md §2/§4 — Eventos tab resolution, following `InventoryScreen`'s
 * own `{mode, ...}` internal view-state pattern.
 *
 * **Cold-start test, a disclosed judgment call.** §3.3's literal text is "no
 * Event ever scheduled" — but a Business that scheduled and then cancelled
 * its only Event would, read literally, have `state.events.length > 0`
 * while every list section (§3.4/§3.5) is legitimately empty (§3.13: a
 * cancelled Event "simply no longer appears anywhere in this list"), a
 * combination the approved spec doesn't explicitly design for. This build
 * uses "nothing currently visible to show" (`hasAnyVisibleEvent`) as the
 * cold-start test instead of "an Event row was ever created" — the same
 * "show what's actually there, not a technical history" posture Home/
 * Inventario's own cold starts already apply — rather than rendering an
 * Events list with every section silently absent and no CTA-adjacent
 * explanation. Named here, not silently resolved (README.md's disclosure
 * section).
 */
export function EventsScreen({
  view,
  onChangeView,
  onNavigateToHoy,
}: {
  view: EventsView;
  onChangeView: (view: EventsView) => void;
  onNavigateToHoy: () => void;
}) {
  const { state } = useStore();
  const [ambientMessage, setAmbientMessage] = useState<string | null>(null);

  // Leaving 'list' mode always clears any pending ambient message first —
  // `EventsList` remounts fresh every time `view.mode` returns to 'list'
  // (a new component instance, per `view.mode === 'detail'/'new-event'`
  // rendering an entirely different component in between), so a stale
  // message from an earlier save/cancel must never survive to be shown a
  // second time on an unrelated return to the list.
  function go(next: EventsView) {
    if (next.mode !== 'list') setAmbientMessage(null);
    onChangeView(next);
  }

  if (view.mode === 'new-event') {
    return (
      <NuevoEvento
        onBack={() => go({ mode: 'list' })}
        onSaved={() => {
          setAmbientMessage('Evento agendado');
          go({ mode: 'list' });
        }}
      />
    );
  }

  if (view.mode === 'detail') {
    return (
      <EventDetail
        eventId={view.eventId}
        onBack={() => go({ mode: 'list' })}
        onNavigateToHoy={onNavigateToHoy}
        onCancelled={() => {
          setAmbientMessage('Evento cancelado');
          go({ mode: 'list' });
        }}
      />
    );
  }

  if (!hasAnyVisibleEvent(state)) {
    return <EventsColdStart onAgendar={() => go({ mode: 'new-event' })} />;
  }

  return (
    <EventsList
      onAgendar={() => go({ mode: 'new-event' })}
      onTapEvent={(eventId) => go({ mode: 'detail', eventId })}
      ambientMessage={ambientMessage}
    />
  );
}
