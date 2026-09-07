import { useState } from 'react';
import { useStore } from './domain/store';
import { currentUser, findMembership } from './domain/selectors';
import { NavBar, type TabKey } from './components/NavBar/NavBar';
import { HomeScreen } from './screens/Home/HomeScreen';
import { InventoryScreen, type InventoryView } from './screens/Inventory/InventoryScreen';
import { EventsScreen, type EventsView } from './screens/Events/EventsScreen';
import { ResultadosScreen, type ResultadosView } from './screens/Resultados/ResultadosScreen';
import { AccesoRevocado } from './screens/Settings/AccesoRevocado';
import { AccesoNoDisponible } from './screens/Home/AccesoNoDisponible';
import { ScreenTransition } from './components/ScreenTransition/ScreenTransition';
import styles from './App.module.css';

/**
 * information-architecture.md — frozen four-tab nav (Hoy · Inventario ·
 * Eventos · Resultados). All four tabs are real as of the Resultados pass
 * (Migration Workflow, D43) — Hoy/Inventario/Eventos already were; this pass
 * closes the last one.
 *
 * **Slice 12 additions (`product-decisions.md` Q24/Q25) — role-scoped
 * rendering at the tab-shell level.** `home.md` §2 step 0 (a revoked acting
 * Membership) is resolved here, one level above the nav bar/tab content —
 * `settings.md` §3.14's own wireframe shows no header, no bottom nav at
 * all for that state, a stronger omission than any state `HomeScreen.tsx`
 * itself renders. `home.md` §3.16 (role-scoped nav) is applied here too:
 * a SELLER's `NavBar` renders only "Hoy," and — as a defensive backstop
 * matching §3.17's own reachability note ("a stale link, a browser-back
 * artifact, or any other path...never reachable by tapping anything this
 * document or its siblings actually offer her") — this component never
 * renders the real Inventario/Eventos/Resultados content for her even if
 * `activeTab` somehow ends up pointed at one, since nothing in this
 * codebase's own SELLER-facing screens ever fires a callback that would.
 */
export default function App() {
  const { state } = useStore();
  const [activeTab, setActiveTab] = useState<TabKey>('hoy');

  const user = currentUser(state);
  const membership = user && state.business ? findMembership(state, user.id, state.business.id) : undefined;

  if (membership?.status === 'revoked') {
    return <AccesoRevocado />;
  }
  const role = membership?.role ?? 'OWNER';
  const [inventoryView, setInventoryView] = useState<InventoryView>({ mode: 'catalog' });
  const [eventsView, setEventsView] = useState<EventsView>({ mode: 'list' });
  const [resultadosView, setResultadosView] = useState<ResultadosView>({ mode: 'main' });
  // AT-M1/AT-M2 fix round (`AssignTags.tsx`) — both owned here, alongside
  // `inventoryView`, rather than inside `AssignTags` itself, so a plain
  // "Terminar después" → "Continuar etiquetando" defer/resume — which
  // unmounts/remounts `<AssignTags>` (`InventoryScreen.tsx` swaps it out
  // whenever `inventoryView.mode` leaves `'assign-tags'`) — never loses
  // either. `assignTagsEntry` is replaced only when a fresh `commitLot`
  // actually triggers a new entry (AT-M1); `assignTagsSegmentTotals` is
  // updated by `AssignTags` itself, per-Product, as its own doc comment
  // describes (AT-M2).
  const [assignTagsEntry, setAssignTagsEntry] = useState<{ productId: string; quantity: number }[] | null>(null);
  const [assignTagsSegmentTotals, setAssignTagsSegmentTotals] = useState<Record<string, number>>({});

  return (
    <>
      <main className={styles.main}>
        {activeTab === 'hoy' && (
          <ScreenTransition transitionKey="hoy">
            <HomeScreen
              onNavigateToRegister={() => {
                // inventory.md §10: Home's cold-start CTA routes directly into
                // Registrar Mercancía, not Inventario's own cold-start screen.
                setInventoryView({ mode: 'register' });
                setActiveTab('inventario');
              }}
              onNavigateToEvent={(eventId) => {
                // home.md §3.5: the upcoming-Event card routes into Eventos'
                // own scheduled-detail screen for that specific Event
                // (events.md §3.11) — not a new destination invented for this
                // entry point.
                setEventsView({ mode: 'detail', eventId });
                setActiveTab('eventos');
              }}
              onNavigateToResultadosSession={(sessionId) => {
                // home.md §3.12 "Ver detalle" (reports.md §2 step 3) — lands
                // directly on Resultados' Session detail, skipping the main
                // list entirely, regardless of Resultados' own tab state.
                setResultadosView({ mode: 'session-detail', sessionId, returnTo: { mode: 'main' } });
                setActiveTab('resultados');
              }}
              onNavigateToAssignTags={() => {
                // home.md §3.6a's "Asignar tags" link — routes into
                // Inventario's own Asignar Tags queue (inventory.md §3.14),
                // same destination §3.5/§3.17's "Continuar etiquetando"
                // resumes, not a Home-local stub.
                setInventoryView({ mode: 'assign-tags' });
                setActiveTab('inventario');
              }}
              onNavigateToInventarioViaSettingsTagsOn={() => {
                // settings.md §2.6 (`decision-log.md` D46 Addendum) — the
                // instant "Cambiar a vender con tags" writes
                // `defaultSellingMode`, hand off into Inventario carrying only
                // a bare entry marker; `InventoryScreen`'s own step 0 (D46
                // Addendum) decides what she actually sees from there — this
                // callback never reads any Inventory-owned fact itself.
                setInventoryView({ mode: 'catalog', enteredViaSettingsTagsOn: true });
                setActiveTab('inventario');
              }}
            />
          </ScreenTransition>
        )}

        {activeTab === 'inventario' && role === 'OWNER' && (
          <ScreenTransition transitionKey="inventario">
            <InventoryScreen
              view={inventoryView}
              onOpenRegister={(prefillProductId) => setInventoryView({ mode: 'register', prefillProductId })}
              onSaved={(lastProductId) => setInventoryView({ mode: 'catalog', justSaved: lastProductId })}
              onOpenAssignTags={(entryBreakdown) => {
                // AT-M1 — only a fresh `commitLot` (RegisterMerchandise's own
                // save, threading its breakdown through) replaces the frozen
                // receipt; resuming via "Continuar etiquetando" or Home's
                // "Asignar tags" link calls this with no argument, so the
                // receipt from whichever commit is still the live session's
                // own stays exactly as it was.
                if (entryBreakdown) setAssignTagsEntry(entryBreakdown);
                setInventoryView({ mode: 'assign-tags' });
              }}
              onTagsComplete={() => {
                // Tagging queue reached zero — nothing left to freeze a
                // receipt or a denominator against until a future commitLot
                // starts a genuinely new session.
                setAssignTagsEntry(null);
                setAssignTagsSegmentTotals({});
                setInventoryView({ mode: 'catalog', tagsComplete: true });
              }}
              onBackToCatalog={() => setInventoryView({ mode: 'catalog' })}
              onSettingsTagsOnMarkerHandled={() =>
                setInventoryView((v) => (v.mode === 'catalog' ? { ...v, enteredViaSettingsTagsOn: false } : v))
              }
              assignTagsEntry={assignTagsEntry}
              assignTagsSegmentTotals={assignTagsSegmentTotals}
              onAssignTagsSegmentTotalsChange={setAssignTagsSegmentTotals}
            />
          </ScreenTransition>
        )}

        {activeTab === 'eventos' && role === 'OWNER' && (
          <ScreenTransition transitionKey="eventos">
            <EventsScreen
              view={eventsView}
              onChangeView={setEventsView}
              onNavigateToHoy={() => {
                // events.md §4: "Continuar Día N" / "Vendiendo ahora" → Hoy,
                // resumes/starts selling — identical mechanism to home.md
                // §2/§3.6, not a second selling surface.
                setActiveTab('hoy');
              }}
              onNavigateToResultados={(eventId) => {
                // events.md §3.16 "Ver resumen en Resultados" (reports.md §2
                // step 3) — lands directly on Resultados' Event detail for
                // that specific Event, skipping the main list entirely.
                setResultadosView({ mode: 'event-detail', eventId, returnTo: { mode: 'main' } });
                setActiveTab('resultados');
              }}
            />
          </ScreenTransition>
        )}

        {activeTab === 'resultados' && role === 'OWNER' && (
          <ScreenTransition transitionKey="resultados">
            <ResultadosScreen
              view={resultadosView}
              onChangeView={setResultadosView}
              onNavigateToHoy={() => setActiveTab('hoy')}
              onNavigateToEventos={() => setActiveTab('eventos')}
            />
          </ScreenTransition>
        )}

        {/* home.md §3.17 — defensive backstop only (see this component's
            own top-of-file doc comment); never reached by tapping anything
            this codebase's SELLER-facing screens actually offer. */}
        {activeTab !== 'hoy' && role !== 'OWNER' && (
          <ScreenTransition transitionKey="acceso-no-disponible">
            <AccesoNoDisponible onBack={() => setActiveTab('hoy')} onOpenAccount={() => setActiveTab('hoy')} />
          </ScreenTransition>
        )}
      </main>

      <NavBar active={activeTab} onChange={setActiveTab} visibleTabs={role === 'OWNER' ? undefined : ['hoy']} />
    </>
  );
}
