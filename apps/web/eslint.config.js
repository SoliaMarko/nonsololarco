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

      // Code style — documented in CLAUDE.md, now enforced
      'no-nested-ternary': 'error',
      'no-var': 'error',
      'prefer-const': 'error',

      // JSX: always use ternary for conditional rendering, never &&
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],

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
      'typescript-sort-keys/interface': ['error', 'asc', { requiredFirst: true }],
      'typescript-sort-keys/string-enum': 'error',

      // Size & complexity limits — proxy metrics, warn to guide not block
      'max-lines': ['warn', { max: 250, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['warn', { max: 60, skipBlankLines: true, skipComments: true }],
      complexity: ['warn', 12],
      'max-depth': ['error', 3],
      'max-nested-callbacks': ['error', 3],
      'max-params': ['warn', 4],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: resolve(__dirname, './tsconfig.json'),
        },
      },
    },
  },
  {
    // Tests and stories are long by nature — that's fine.
    files: ['**/*.{test,spec}.{ts,tsx}', 'stories/**', '**/*.stories.tsx'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
    },
  },
  {
    // SVG components are pure markup — size limits don't apply.
    files: ['**/icons/**/*.tsx', '**/svg/**/*.tsx'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
];
