const path = require("path");
const replace = require("replace");
const packageJson = require("../package.json");

const packageJsonPath = path.resolve(__dirname, "../package.json");
const productName = packageJson.build.productName;
const channel = packageJson.version.includes("beta")
    ? "beta"
    : packageJson.version.includes("next")
    ? "next"
    : "stable";

replace({
    paths: [packageJsonPath],
    recursive: false,
    regex: `"productName": "${productName}"`,
    replacement: `"productName": "${productName}${
        channel === "stable" ? "" : ` (${channel})`
    }"`,
    silent: false,
});

replace({
    paths: [packageJsonPath],
    recursive: false,
    regex: `"icon": "./electron/build/icon.png"`,
    replacement: `"icon": "./electron/build/icon${
        channel === "stable" ? "" : `${channel}`
    }.png"`,
    silent: false,
});

replace({
    paths: [packageJsonPath],
    recursive: false,
    regex: `"icon": "./electron/build/icon.icns"`,
    replacement: `"icon": "./electron/build/icon${
        channel === "stable" ? "" : `${channel}`
    }.icns"`,
    silent: false,
});
