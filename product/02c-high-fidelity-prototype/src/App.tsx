import { useState } from 'react';
import { NavBar, type TabKey } from './components/NavBar/NavBar';
import { Placeholder } from './components/Placeholder/Placeholder';
import { HomeScreen } from './screens/Home/HomeScreen';
import { InventoryScreen, type InventoryView } from './screens/Inventory/InventoryScreen';
import styles from './App.module.css';

/**
 * information-architecture.md — frozen four-tab nav (Hoy · Inventario ·
 * Eventos · Resultados). This slice builds Hoy + Inventario in full;
 * Eventos/Resultados stay reachable (nav is never blocked) but render an
 * honest "not built in this slice" state — see Placeholder.
 */
export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('hoy');
  const [inventoryView, setInventoryView] = useState<InventoryView>({ mode: 'catalog' });

  return (
    <div className="app-shell">
      <main className={styles.main}>
        {activeTab === 'hoy' && (
          <HomeScreen
            onNavigateToRegister={() => {
              // inventory.md §10: Home's cold-start CTA routes directly into
              // Registrar Mercancía, not Inventario's own cold-start screen.
              setInventoryView({ mode: 'register' });
              setActiveTab('inventario');
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

        {activeTab === 'eventos' && <Placeholder title="Eventos" onBack={() => setActiveTab('hoy')} />}
        {activeTab === 'resultados' && <Placeholder title="Resultados" onBack={() => setActiveTab('hoy')} />}
      </main>

      <NavBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
