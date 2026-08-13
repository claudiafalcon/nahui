import styles from './NavBar.module.css';

export type TabKey = 'hoy' | 'inventario' | 'eventos' | 'resultados';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'hoy', label: 'Hoy' },
  { key: 'inventario', label: 'Inventario' },
  { key: 'eventos', label: 'Eventos' },
  { key: 'resultados', label: 'Resultados' },
];

function TabIcon({ tab, active }: { tab: TabKey; active: boolean }) {
  const stroke = 1.8;
  const color = active ? 'var(--color-tezontle-dark)' : '#8A8177';
  switch (tab) {
    case 'hoy':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 21V11.5a1 1 0 0 1 .38-.78l7-5.6a1 1 0 0 1 1.24 0l7 5.6a1 1 0 0 1 .38.78V21"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M9.5 21v-6.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V21" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'inventario':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z" stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
          <path d="M4 8.5V16l8 4.5 8-4.5V8.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 13v7.5" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      );
    case 'eventos':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="5.5" width="16" height="14" rx="3" stroke={color} strokeWidth={stroke} />
          <path d="M8 3.5v4M16 3.5v4M4 10.5h16" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      );
    case 'resultados':
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M5 20V13M12 20V6M19 20v-9" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
          <path d="M3 20h18" stroke={color} strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      );
  }
}

export function NavBar({ active, onChange }: { active: TabKey; onChange: (tab: TabKey) => void }) {
  return (
    <nav className={`${styles.bar} tearTop tearSm`} aria-label="Navegación principal">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(tab.key)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={styles.iconWrap}>
              <TabIcon tab={tab.key} active={isActive} />
            </span>
            <span className={styles.label}>{tab.label}</span>
            <span className={styles.pip} aria-hidden="true" />
          </button>
        );
      })}
    </nav>
  );
}
