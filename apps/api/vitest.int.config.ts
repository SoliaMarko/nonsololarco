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
    include: ['**/*.int-spec.ts'],
    testTimeout: 60_000,
    hookTimeout: 120_000,
    pool: 'forks',
    poolOptions: {
      forks: { singleFork: true },
    },
  },
});
