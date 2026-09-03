import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig } from 'vitest/config'

import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'happy-dom',
      globals: true,
      root: fileURLToPath(new URL('./', import.meta.url)),
      include: ['src/**/__tests__/**/*.spec.ts'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        // Views are covered indirectly through their components; the design
        // reference and config files are not application code.
        exclude: ['src/**/views/**', 'src/main.ts', '**/*.d.ts'],
      },
    },
  }),
)
