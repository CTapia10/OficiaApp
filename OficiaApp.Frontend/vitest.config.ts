import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Vitest config files run as plain ESM/Node, so `__dirname` isn't available
// (that's a CommonJS global). This is the standard Vite way to recover it.
const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  // Lets Vitest render JSX/TSX the same way Next.js does (via SWC-free Babel
  // transform from @vitejs/plugin-react). Without this, `.tsx` test files
  // and the components they import would fail to compile.
  plugins: [react()],
  test: {
    // 'jsdom' fakes a browser DOM (document, window, etc.) inside Node so
    // Testing Library can render React components and query them.
    environment: 'jsdom',
    // Runs once before the test files, to wire up extra `expect` matchers.
    setupFiles: ['./vitest.setup.ts'],
    // Allows importing files that pull in CSS (e.g. via Tailwind) without
    // Vitest trying to parse the CSS as JS.
    css: true,
  },
  resolve: {
    alias: {
      // Mirrors the "@/*": ["./*"] path mapping in tsconfig.json, so
      // `import { cn } from '@/presentation/lib/utils'` resolves in tests
      // exactly like it does for Next.js and your editor.
      '@': rootDir,
    },
  },
})
