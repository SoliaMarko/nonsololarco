/** @type {import("prettier").Config} */
const config = {
  semi: false,
  singleQuote: true,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^react(.*)$",
    "^next(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@arco/(.*)$",
    "^@/(.*)$",
    "^[./]",
    "^.+\\.css$"
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default config;
