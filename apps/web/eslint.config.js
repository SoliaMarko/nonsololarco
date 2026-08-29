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

      // Size & complexity limits — proxy metrics, warn to guide not block.
      // The 60-line budget is calibrated for imperative code: hooks, utils,
      // event handlers. See the *.tsx block below for why components differ.
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
    // Components get a larger line budget than logic, on purpose.
    //
    // Line count is a proxy for cognitive load, and that proxy holds for
    // imperative code — 60 lines of branching really is hard to follow. JSX is
    // declarative: a form with eight fields, each with a label, control and
    // error slot, runs past 120 lines at a cyclomatic complexity of 1. It is
    // long, not complex.
    //
    // Forcing such a component under 60 lines means extracting sub-components
    // that exist only to satisfy the counter — and under our one-component-per-
    // folder convention every extraction costs a directory plus a barrel, and
    // adds prop threading that was not there before. The rule would be
    // optimising the metric against the goal.
    //
    // What actually hurts readability in JSX is nesting depth, so that is
    // capped instead. `max-depth` above covers statement nesting; jsx-max-depth
    // covers the markup tree. Five allows the usual page > card > row > content
    // stack plus one conditional wrapper; past that a feature component is
    // usually doing someone else's layout as well as its own.
    files: ['**/*.tsx'],
    rules: {
      'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
      'react/jsx-max-depth': ['warn', { max: 5 }],
    },
  },
  {
    // Design-system primitives wrap Radix, and Radix dictates its own tree:
    // Root > Portal > Content > Viewport > Group > Item is four levels before
    // any of our markup begins. Depth here measures the library, not a decision
    // we made, and it cannot be flattened without breaking the component. The
    // rule stays on for feature components, where depth is a real signal.
    files: ['src/components/ui/**/*.tsx', 'src/components/form/**/*.tsx'],
    rules: {
      'react/jsx-max-depth': 'off',
    },
  },
  {
    // Tests and stories are long by nature — that's fine.
    files: ['**/*.{test,spec}.{ts,tsx}', 'stories/**', '**/*.stories.tsx'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
      'react/jsx-max-depth': 'off',
      'no-restricted-properties': [
        'error',
        { object: 'it', property: 'skip', message: 'Skipped test = broken test. Fix or remove.' },
        { object: 'describe', property: 'skip', message: 'Skipped suite = broken test.' },
        { object: 'it', property: 'only', message: '.only must not be committed.' },
        { object: 'describe', property: 'only', message: '.only must not be committed.' },
      ],
    },
  },
  {
    // SVG components are pure markup — size limits don't apply.
    files: ['**/icons/**/*.tsx', '**/svg/**/*.tsx', '**/illustrations/**/*.tsx'],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'react/jsx-max-depth': 'off',
    },
  },
];
