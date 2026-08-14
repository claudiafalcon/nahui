import { BusinessBadge } from '../components/BusinessBadge/BusinessBadge';
import { Card } from '../components/Card/Card';
import { PoweredByFooter } from '../components/PoweredByFooter/PoweredByFooter';
import shared from './shared.module.css';

/**
 * §3.11 — Compra confirmada, cliente que regresa. Content-identical in
 * spirit to §3.10 but without "quedaste registrada" (she already is) —
 * the deliberately lighter confirmation this task's brief asks for. Same
 * absence of transactional detail or numeric progress.
 */
export function SuccessReturning({ businessName, businessLogo }: { businessName: string; businessLogo?: string }) {
  return (
    <Card>
      <BusinessBadge name={businessName} logo={businessLogo} />
      <div className={shared.stack}>
        <p className={shared.heading}>¡Gracias! Ya contamos esta compra.</p>
      </div>
      <PoweredByFooter />
    </Card>
  );
}
