import { Card } from '../components/Card/Card';
import shared from './shared.module.css';

/**
 * §3.4 — Esta compra ya fue registrada. Reached without ever asking for an
 * email (§2 step 2 — the already-claimed check runs before any identity
 * is requested, which is what lets this state be reached identically
 * regardless of who's asking, privacy-safe by construction). No button,
 * no Reintentar — nothing here changes on a retry, and there's no
 * interrupted action to recover.
 */
export function AlreadyClaimed() {
  return (
    <Card>
      <div className={shared.stack}>
        <h1 className={shared.heading}>Esta compra ya fue registrada.</h1>
        <p className={shared.body}>No hay nada más que hacer aquí.</p>
      </div>
    </Card>
  );
}
