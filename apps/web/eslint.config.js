import storybook from "eslint-plugin-storybook";
import importPlugin from "eslint-plugin-import";
import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  ...storybook.configs["flat/recommended"],
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      // No console.log in production code
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // No unused variables
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // Import rules
      "import/no-unresolved": "error",
      "import/no-unused-modules": "warn",
      "import/first": "error",
      "import/newline-after-import": "error",
    },
  },
];
