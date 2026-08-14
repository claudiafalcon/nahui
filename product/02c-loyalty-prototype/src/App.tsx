import { LoyaltyStoreProvider } from './domain/store';
import { useClaimTokenRoute } from './hooks/useClaimTokenRoute';
import { ClaimFlow } from './screens/ClaimFlow';
import { DemoIndex } from './screens/DemoIndex';

/**
 * Root of the Loyalty-claim customer-facing surface. Routes purely on
 * `/c/:token` (the shape of the QR URL the Merchant prototype already
 * generates, `https://loyalty.nahui.mx/c/<claimToken>`) — a token match
 * renders the real, spec-defined flow (`ClaimFlow`); anything else
 * renders this build's own dev-only `DemoIndex`, never a spec state.
 */
export function App() {
  const token = useClaimTokenRoute();
  return <LoyaltyStoreProvider>{token ? <ClaimFlow token={token} /> : <DemoIndex />}</LoyaltyStoreProvider>;
}
