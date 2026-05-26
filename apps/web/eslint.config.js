import { nextJsConfig } from '@repo/eslint-config/next-js';
import importPlugin from 'eslint-plugin-import';
import storybook from 'eslint-plugin-storybook';
import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  ...storybook.configs['flat/recommended'],
  {
    plugins: {
      import: importPlugin,
      'typescript-sort-keys': typescriptSortKeys,
    },
    rules: {
      semi: ['error', 'always'],

      // No console.log in production code
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // No unused variables
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // Import rules
      'import/no-unresolved': 'error',
      'import/no-unused-modules': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',

      // TypeScript interface key sorting
      'typescript-sort-keys/interface': 'error',
      'typescript-sort-keys/string-enum': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: resolve(__dirname, './tsconfig.json'),
        },
      },
    },
  },
];
