import { Card } from '../components/Card/Card';
import shared from './shared.module.css';

/**
 * §3.6b — No, gracias — confirmación. Reached identically whether she
 * declined from §3.5 or §3.6; nothing is ever written either way. A real,
 * honest acknowledgment rather than leaving her uncertain whether closing
 * the tab "did" anything.
 */
export function Declined() {
  return (
    <Card>
      <div className={shared.stack}>
        <p className={shared.body}>Entendido. Gracias por tu compra.</p>
      </div>
    </Card>
  );
}
