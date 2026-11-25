/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { highlightedFiles } from './scripts/highlight-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), highlightedFiles()],
  server: {
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
