import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// Mirrors the path aliases from tsconfig.json. Order matters: the more specific
// prefixes must come before the catch-all `@/*` mapping.
const alias = [
  { find: /^@\/components\/(.*)$/, replacement: path.resolve(dirname, 'src/components/$1') },
  { find: /^@\/styles\/(.*)$/, replacement: path.resolve(dirname, 'src/styles/$1') },
  { find: /^@\/lib\/(.*)$/, replacement: path.resolve(dirname, 'src/lib/$1') },
  { find: /^@\/hooks\/(.*)$/, replacement: path.resolve(dirname, 'src/hooks/$1') },
  { find: /^@\/types\/(.*)$/, replacement: path.resolve(dirname, 'src/types/$1') },
  { find: /^@\/(.*)$/, replacement: path.resolve(dirname, '$1') },
];

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    projects: [
      {
        // Unit/integration tests (jsdom + React Testing Library).
        // vite 8 transforms JSX via oxc; enable the automatic React runtime so
        // `.tsx` test files compile without a separate Babel plugin.
        oxc: { jsx: { runtime: 'automatic' } },
        resolve: { alias },
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: [path.join(dirname, 'vitest.setup.ts')],
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
