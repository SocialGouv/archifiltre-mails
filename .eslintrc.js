const path = require("path");

const tsconfigPath = path.resolve(__dirname, "./tsconfig.json");

/** @type {import("eslint").Linter.Config} */
const typescriptConfig = {
    extends: "@socialgouv/eslint-config-typescript",
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: tsconfigPath,
        sourceType: "module",
    },
    rules: {
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "import/default": "off",
        "no-unused-vars": "off",
        "prefer-template": "warn",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                args: "after-used",
                argsIgnorePattern: "^_",
                vars: "all",
                varsIgnorePattern: "^_",
            },
        ],
    },
};

/** @type {import("eslint").Linter.Config} */
const defaultConfig = {
    ignorePatterns: ["!**/.*.js*", "node_modules"],
    overrides: [
        {
            files: ["**/*.ts"],
            ...typescriptConfig,
        },
        {
            files: ["**/*.tsx"],
            ...typescriptConfig,
            extends: [
                `${typescriptConfig.extends}`,
                "@socialgouv/eslint-config-react",
            ],
        },
        {
            extends: "@socialgouv/eslint-config-react",
            files: ["**/*.js*"],
        },
        {
            env: {
                browser: true,
                node: true,
            },
            files: ["src/renderer/**/*.ts*", "src/common/**/*.ts*"],
        },
        {
            files: ["src/renderer/**/*.ts"],
            parserOptions: {
                project: "./src/renderer/tsconfig.json",
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project: "./src/renderer/tsconfig.json",
                    },
                },
            },
        },
        {
            files: ["src/common/**/*.ts"],
            parserOptions: {
                project: "./src/common/tsconfig.json",
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project: "./src/common/tsconfig.json",
                    },
                },
            },
        },
        {
            env: {
                browser: false,
                node: true,
            },
            files: ["src/main/**/*.ts"],
            parserOptions: {
                project: "./src/main/tsconfig.json",
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project: "./src/main/tsconfig.json",
                    },
                },
            },
        },
        {
            files: "src/**/*.ts*",
            globals: {
                __static: true,
            },
        },
        {
            files: "scripts/**/*.ts",
            parserOptions: {
                project: "./scripts/tsconfig.json",
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project: "./scripts/tsconfig.json",
                    },
                },
            },
        },
    ],
    plugins: ["unused-imports"],
    reportUnusedDisableDirectives: true,
    root: true,
};

module.exports = defaultConfig;
