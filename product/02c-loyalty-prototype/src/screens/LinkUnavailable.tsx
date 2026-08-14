import { Card } from '../components/Card/Card';
import shared from './shared.module.css';

/**
 * §3.3 — Enlace no disponible. Shared identical screen/copy for both the
 * malformed and the expired-token branches (§2 step 1, §10's own "she has
 * no actionable use for knowing which specific reason applies" ruling).
 * No "Reintentar" — retrying a resolution check won't change a fact about
 * the token itself. Calm, plain tone, not styled as an alarming failure —
 * nothing was entered, nothing is at risk (brand-guide.md's Error-usage
 * distinction, applied at the content/tone level per §3.3's own note). No
 * business identity shown — the token never resolved far enough to know
 * whose it was.
 */
export function LinkUnavailable() {
  return (
    <Card>
      <div className={shared.stack}>
        <h1 className={shared.heading}>Este enlace ya no está disponible.</h1>
        <p className={shared.body}>La próxima vez que compres, vas a poder intentarlo de nuevo.</p>
      </div>
    </Card>
  );
}
