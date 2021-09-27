const path = require("path");
const fs = require("fs");
const { pathsToModuleNameMapper } = require("ts-jest/utils");

const tsconfig = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "test", "tsconfig.json"), {
        encoding: "utf-8",
    })
);

const moduleNameMapper = {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
        prefix: "<rootDir>",
    }),
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
};

const collectCoverageFrom = ["<rootDir>/src/**/!(*.d).ts*"];

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
const defaultConfig = {
    collectCoverageFrom,
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/test/tsconfig.json",
        },
    },
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    moduleNameMapper,
    preset: "ts-jest",
};

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    collectCoverageFrom,
    projects: [
        {
            displayName: "integration",
            testMatch: [
                "<rootDir>/test/integration/**/?(*.)(spec|test).(ts|tsx)",
            ],
            ...defaultConfig,
        },
        {
            displayName: "components",
            testEnvironment: "jsdom",
            testMatch: [
                "<rootDir>/test/components/**/?(*.)(spec|test).(ts|tsx)",
            ],
            ...defaultConfig,
        },
        {
            displayName: "e2e",
            preset: "jest-playwright-preset",
            testMatch: ["<rootDir>/test/e2e/**/?(*.)(spec|test).(ts|tsx)"],
            transform: {
                "^.+\\.ts$": "ts-jest",
            },
            ...defaultConfig,
        },
        {
            displayName: "spectron",
            testMatch: ["<rootDir>/test/spectron/**/?(*.)(spec|test).(ts|tsx)"],
            ...defaultConfig,
        },
    ],
};
