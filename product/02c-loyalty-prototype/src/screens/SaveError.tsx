import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import shared from './shared.module.css';

/**
 * §3.9 — No pudimos guardar. Unlike §3.12's passive load failure, this is
 * a write/save that failed with entered data genuinely at risk — the
 * brand-guide.md Error-usage rule that reserves Error red for exactly
 * this class of failure applies here. Whatever she typed is preserved and
 * replayed on retry (`ClaimFlow`'s own pending-write state), never
 * re-asked — architecture-principles.md #7.
 */
export function SaveError({ onRetry }: { onRetry: () => void }) {
  return (
    <Card>
      <div className={shared.stack}>
        <p className={shared.bodyError}>No pudimos guardar. Sigue aquí, intenta de nuevo.</p>
      </div>
      <Button variant="primary" onClick={onRetry}>
        Reintentar
      </Button>
    </Card>
  );
}
