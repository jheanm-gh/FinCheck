import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';

/**
 * Mirrors the `@/*` path alias from tsconfig.json so tests can import modules that
 * use it. Without this, anything importing `@/config/adviser` fails to resolve.
 */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: { environment: 'node' },
});
