import { useState } from 'react';
import { NavBar, type TabKey } from './components/NavBar/NavBar';
import { HomeScreen } from './screens/Home/HomeScreen';
import { InventoryScreen, type InventoryView } from './screens/Inventory/InventoryScreen';
import { EventsScreen, type EventsView } from './screens/Events/EventsScreen';
import { ResultadosScreen, type ResultadosView } from './screens/Resultados/ResultadosScreen';
import styles from './App.module.css';

/**
 * information-architecture.md — frozen four-tab nav (Hoy · Inventario ·
 * Eventos · Resultados). All four tabs are real as of the Resultados pass
 * (Migration Workflow, D43) — Hoy/Inventario/Eventos already were; this pass
 * closes the last one.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('hoy');
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
        )}

        {activeTab === 'inventario' && (
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
        )}

        {activeTab === 'eventos' && (
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
        )}

        {activeTab === 'resultados' && (
          <ResultadosScreen
            view={resultadosView}
            onChangeView={setResultadosView}
            onNavigateToHoy={() => setActiveTab('hoy')}
            onNavigateToEventos={() => setActiveTab('eventos')}
          />
        )}
      </main>

      <NavBar active={activeTab} onChange={setActiveTab} />
    </>
  );
}
