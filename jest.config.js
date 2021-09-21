const path = require("path");
const fs = require("fs");
const { pathsToModuleNameMapper } = require("ts-jest/utils");

const testFolderPath = path.resolve(__dirname, "./test/");
const tsconfig = JSON.parse(
    fs.readFileSync(path.resolve(testFolderPath, "tsconfig.json"), {
        encoding: "utf-8",
    })
);
const moduleNameMapper = {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
        prefix: "<rootDir>",
    }),
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
};

console.log(moduleNameMapper);

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    collectCoverageFrom: ["<rootDir>/src/**/!(*.d).ts*"],
    moduleFileExtensions: ["ts", "tsx", "js", "json"],
    moduleNameMapper,
    preset: "ts-jest",
    testMatch: ["<rootDir>/test/**/?(*.)(spec|test).(ts|tsx)"],
};
