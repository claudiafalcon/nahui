import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Nahui — High-Fidelity living prototype (product/02c-high-fidelity-prototype)
// See README.md for scope, design plan, and how to run.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5183,
  },
})
