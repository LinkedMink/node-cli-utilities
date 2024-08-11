import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
const noUnusedVarsOptions = [
    "error",
    {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
    },
];
export const flatConfig = [
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
        files: ["test/**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: ["test/tsconfig.json"],
            },
        },
    },
];
//# sourceMappingURL=eslint-config.js.map