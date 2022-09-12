const path = require("path");
const glob = require("glob");
const { getDeclaredTypesNames } = require("./scripts/ts-ast");

const tsconfigPath = path.resolve(__dirname, "./tsconfig.json");
const tsconfigRendererPath = path.resolve(
    __dirname,
    "./src/renderer/tsconfig.json"
);
const tsconfigMainPath = path.resolve(__dirname, "./src/main/tsconfig.json");
const tsconfigCommonPath = path.resolve(
    __dirname,
    "./src/common/tsconfig.json"
);
const tsconfigScriptsPath = path.resolve(__dirname, "./scripts/tsconfig.json");

const typesFiles = glob.sync(path.resolve(__dirname, "./types/**/*.d.ts"));
const globalTypesNames = typesFiles
    .flatMap(getDeclaredTypesNames)
    .reduce((acc, name) => ({ ...acc, [name]: "readonly" }), {});

/** @type {import("eslint").Linter.Config} */
const typescriptConfig = {
    extends: "@socialgouv/eslint-config-typescript",
    globals: globalTypesNames,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: tsconfigPath,
        sourceType: "module",
    },
    plugins: ["typescript-sort-keys"],
    rules: {
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-invalid-void-type": ["off"],
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "import/default": "off",
        "no-console": "warn",
        "no-unused-vars": "off",
        "prefer-template": "warn",
        "typescript-sort-keys/interface": "error",
        "typescript-sort-keys/string-enum": "error",
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
            files: ["src/renderer/**/*.ts*"],
            parserOptions: {
                project: tsconfigRendererPath,
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project: tsconfigRendererPath,
                    },
                },
            },
        },
        {
            files: ["src/common/**/*.ts"],
            parserOptions: {
                project: tsconfigCommonPath,
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project: tsconfigCommonPath,
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
                project: tsconfigMainPath,
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project: tsconfigMainPath,
                    },
                },
            },
        },
        {
            files: "src/**/*.ts*",
            globals: {
                __static: "readonly",
            },
        },
        {
            files: "scripts/**/*.ts",
            parserOptions: {
                project: tsconfigScriptsPath,
            },
            settings: {
                "import/resolver": {
                    typescript: {
                        project: tsconfigScriptsPath,
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
