import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import swc from 'unplugin-swc';

export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  plugins: [
    tsconfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ] as any,
  test: {
    globals: true,
    root: './src',
    environment: 'node',
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: '../coverage',
      reporter: ['text', 'json-summary', 'lcov'],
      thresholds: {
        autoUpdate: true,
        lines: 10,
        branches: 10,
        functions: 10,
        statements: 10,
      },
    },
  },
});
