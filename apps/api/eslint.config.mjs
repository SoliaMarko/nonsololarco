// @ts-check
import { nestJsConfig } from '@repo/eslint-config/nest';

export default [
  ...nestJsConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ['eslint.config.mjs'],
  },
];
