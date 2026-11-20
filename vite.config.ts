/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Pin to IPv4 loopback: on Node 17+ "localhost" can resolve to ::1 only,
    // so Vite listens on IPv6 while CI wait-on probes hit 127.0.0.1 and get
    // refused. strictPort fails loudly instead of drifting to 5174.
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Scoped to src so `vitest run` never picks up the Playwright specs in
    // e2e/, which use the same *.spec.ts naming convention.
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
