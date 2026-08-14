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
          />
        )}

        {activeTab === 'inventario' && (
          <InventoryScreen
            view={inventoryView}
            onOpenRegister={(prefillProductId) => setInventoryView({ mode: 'register', prefillProductId })}
            onSaved={(lastProductId) => setInventoryView({ mode: 'catalog', justSaved: lastProductId })}
            onBackToCatalog={() => setInventoryView({ mode: 'catalog' })}
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
