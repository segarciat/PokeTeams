import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
// Allow using absolute paths. See: https://vitest.dev/guide/common-errors.html#cannot-find-module-relative-path
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    /* Ensures cleanup() runs after each test: https://testing-library.com/docs/svelte-testing-library/setup/#vitest*/
    globals: true,
    environment: 'jsdom',
    setupFiles: ['vitest-setup.ts'],
    include: ['app/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      include: ["app/ui/pokesearch/*"],
    }
  },
})
