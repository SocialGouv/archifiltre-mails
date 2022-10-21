const webpackMain = require("electron-webpack/webpack.main.config");
const webpack = require("webpack");
const webpackCommonConfig = require("./webpack.common.config");
const { glob } = require("glob");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const workers = glob
    .sync("./src/main/**/*.worker.ts")
    .map((filePath) => {
        const name = path.basename(filePath, path.extname(filePath));
        return [name, path.dirname(filePath).split("src/main/")[1], filePath];
    })
    .reduce((acc, [name, directoryPath, filePath]) => {
        console.log({ directoryPath, filePath, name });
        acc[path.join(directoryPath, name)] = filePath;
        return acc;
    }, {});

module.exports = async (
    /** @type {import("electron-webpack/out/core").ConfigurationEnv} */ env = {}
) => {
    env.production = true;
    env.autoClean = false;
    const config = await webpackMain(env);
    if (!config) {
        throw new Error("No main config found for workers.");
    }

    config.mode = "production";

    for (const plugin of config.plugins) {
        if (plugin instanceof webpack.BannerPlugin) {
            plugin.options.exclude = /(\.worker)\.js$/i;
        }
        if (plugin instanceof HtmlWebpackPlugin) {
            plugin.options?.excludeChunks?.push(...Object.keys(workers));
        }
    }

    config.module.rules.push({
        loader: "string-replace-loader",
        options: {
            replace: `(() => {
const path = require("path");
const IS_PACKAGED = __dirname.indexOf(path.join("resources/workers/")) > -1;

return path.resolve(process.cwd(), IS_PACKAGED ? "resources/natives/" : "node_modules/", "classic-level/");
            })()`,
            search: "__dirname",
        },
        test: /node_modules\/classic-level\/binding\.js$/,
    });

    const shouldNotBeExternal = [
        "@lsagetlethias/tstrait",
        "@socialgouv/archimail-pst-extractor",
        "classic-level",
        "electron-log",
        "electron-store",
        "electron-util",
        "i18next",
        "lodash",
        "posthog-js",
        "posthog-node",
        "source-map-support",
        "tarn",
        "uuid",
    ];

    if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(
            (name) => !shouldNotBeExternal.includes(name)
        );
    }

    config.entry = workers;

    return webpackCommonConfig(config);
};

module.exports.workers = workers;
