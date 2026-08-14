import { useState } from 'react';
import { NavBar, type TabKey } from './components/NavBar/NavBar';
import { Placeholder } from './components/Placeholder/Placeholder';
import { HomeScreen } from './screens/Home/HomeScreen';
import { InventoryScreen, type InventoryView } from './screens/Inventory/InventoryScreen';
import { EventsScreen, type EventsView } from './screens/Events/EventsScreen';
import styles from './App.module.css';

/**
 * information-architecture.md — frozen four-tab nav (Hoy · Inventario ·
 * Eventos · Resultados). This slice builds Hoy + Inventario + Eventos in
 * full (Eventos added per the Migration Workflow, D43); Resultados stays
 * reachable (nav is never blocked) but renders an honest "not built in this
 * slice" state — see Placeholder. Eventos' own "Ver resumen en Resultados"
 * hand-off (events.md §3.16) uses the identical Placeholder pattern, not a
 * new category of gap (see EventDetail.tsx).
 */
export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('hoy');
  const [inventoryView, setInventoryView] = useState<InventoryView>({ mode: 'catalog' });
  const [eventsView, setEventsView] = useState<EventsView>({ mode: 'list' });

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
          />
        )}
        {activeTab === 'resultados' && <Placeholder title="Resultados" onBack={() => setActiveTab('hoy')} />}
      </main>

      <NavBar active={activeTab} onChange={setActiveTab} />
    </>
  );
}
