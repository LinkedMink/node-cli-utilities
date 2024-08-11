// @ts-check

import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";

/** @type {import("eslint").Linter.RuleEntry} */
const noUnusedVarsOptions = [
  "error",
  {
    argsIgnorePattern: "^_",
    varsIgnorePattern: "^_",
    caughtErrorsIgnorePattern: "^_",
    destructuredArrayIgnorePattern: "^_",
  },
];

export default tsEslint.config(
  eslint.configs.recommended,
  ...tsEslint.configs.strictTypeChecked,
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    extends: [tsEslint.configs.disableTypeChecked],
    languageOptions: {
      ecmaVersion: 2022,
    },
    rules: {
      "no-unused-vars": noUnusedVarsOptions,
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      sourceType: "module",
    },
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["tsconfig.json"],
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": noUnusedVarsOptions,
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowAny: false,
          allowArray: false,
          allowBoolean: true,
          allowNever: false,
          allowNullish: true,
          allowNumber: true,
          allowRegExp: false,
        },
      ],
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["src/tsconfig.json"],
      },
    },
  },
  {
    files: ["tests/**/*.ts"],
    languageOptions: {
      parserOptions: {
        project: ["tests/tsconfig.json"],
      },
    },
  },
);
