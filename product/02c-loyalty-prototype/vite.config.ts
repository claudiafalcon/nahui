import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Nahui Loyalty — customer-facing Claim-registration prototype
// (product/02c-loyalty-prototype). A separate deploy target from the
// Merchant Application (product/02c-high-fidelity-prototype) — see this
// folder's own CLAUDE.md and product/02-ux-loyalty/customer-loyalty-
// registration.md §0 for the scope boundary. Never imports from the
// Merchant prototype's src/.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5184,
  },
});
