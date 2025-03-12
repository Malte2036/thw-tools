module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  ignorePatterns: ["node_modules", "dist", "build", ".svelte-kit", ".next"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
  },
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  rules: {
    // Common rules for all projects
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
  overrides: [
    // TypeScript specific rules
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_" },
        ],
      },
    },
    // Svelte specific rules
    {
      files: ["**/*.svelte"],
      processor: "svelte3/svelte3",
      plugins: ["svelte3", "@typescript-eslint"],
      extends: ["plugin:svelte/recommended"],
      settings: {
        "svelte3/typescript": true,
      },
    },
  ],
};
