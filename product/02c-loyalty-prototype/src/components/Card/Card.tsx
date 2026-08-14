import type { ReactNode } from 'react';
import styles from './Card.module.css';

/**
 * The one shared page shell every screen in this surface renders inside —
 * a single centered card on a soft background, mobile-first (she opens
 * this on her own phone, per §1). Deliberately not the Merchant
 * prototype's app-shell/nav-bar pattern: `customer-loyalty-registration.md`
 * §0/§3 is explicit there is no nav bar and nothing to navigate to here.
 */
export function Card({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>{children}</div>
    </div>
  );
}
