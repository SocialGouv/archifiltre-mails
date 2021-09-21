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

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    collectCoverageFrom: ["<rootDir>/src/**/!(*.d).ts*"],
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/test/tsconfig.json",
        },
    },
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    moduleNameMapper,
    preset: "ts-jest",
    testMatch: ["<rootDir>/test/**/?(*.)(spec|test).(ts|tsx)"],
};
