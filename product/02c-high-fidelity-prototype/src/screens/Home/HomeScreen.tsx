import { useState } from 'react';
import { useStore } from '../../domain/store';
import { hasAnyAvailableUnit, activeSession } from '../../domain/selectors';
import { ColdStart } from './ColdStart';
import { Idle } from './Idle';
import { Selling } from './Selling';
import { ReceiptTicket } from '../../components/ReceiptTicket/ReceiptTicket';
import { CloseSummary } from './CloseSummary';
import { Placeholder } from '../../components/Placeholder/Placeholder';
import type { Receipt } from '../../domain/store';

type HomeUiState =
  | { kind: 'resolved' }
  | { kind: 'receipt'; receipt: Receipt }
  | { kind: 'closed'; count: number; revenue: number }
  | { kind: 'settings-placeholder' };

/**
 * home.md §2 — resolution/decision logic, evaluated automatically on every
 * open. This slice never reaches an Event-scheduled branch (Eventos is out
 * of scope), so only three of the four numbered steps are reachable here:
 * an active Session outranks everything (step 1); otherwise cold start vs.
 * idle, gated on whether any `available` InventoryUnit exists (step 3).
 */
export function HomeScreen({ onNavigateToRegister }: { onNavigateToRegister: () => void }) {
  const { state, startSession } = useStore();
  const [ui, setUi] = useState<HomeUiState>({ kind: 'resolved' });

  const session = activeSession(state);

  if (ui.kind === 'receipt') {
    return (
      <ReceiptTicket
        total={ui.receipt.total}
        businessName={ui.receipt.businessName}
        onExit={() => setUi({ kind: 'resolved' })}
      />
    );
  }

  if (ui.kind === 'closed') {
    return (
      <CloseSummary
        count={ui.count}
        revenue={ui.revenue}
        onContinue={() => setUi({ kind: 'resolved' })}
      />
    );
  }

  if (ui.kind === 'settings-placeholder') {
    return <Placeholder title="Configuración" onBack={() => setUi({ kind: 'resolved' })} />;
  }

  if (session) {
    return (
      <Selling
        onSaleFinalized={(receipt) => setUi({ kind: 'receipt', receipt })}
        onSessionClosed={(summary) => setUi({ kind: 'closed', ...summary })}
        onOpenSettingsPlaceholder={() => setUi({ kind: 'settings-placeholder' })}
      />
    );
  }

  if (!hasAnyAvailableUnit(state)) {
    return <ColdStart onRegister={onNavigateToRegister} />;
  }

  return (
    <Idle
      onStartSession={startSession}
      onOpenSettingsPlaceholder={() => setUi({ kind: 'settings-placeholder' })}
    />
  );
}
