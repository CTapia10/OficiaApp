// Runs before every test file (wired via `test.setupFiles` in vitest.config.ts).
//
// This import has a side effect only: it extends Vitest's `expect(...)` with
// DOM-aware matchers like `toBeInTheDocument()`, `toHaveTextContent()`,
// `toBeDisabled()`, etc. Without it, those matchers don't exist and
// TypeScript won't even recognize them on `expect(...)`.
import '@testing-library/jest-dom/vitest'
