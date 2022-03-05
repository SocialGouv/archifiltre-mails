const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
require("dotenv").config();

module.exports =
    /** @param {import("webpack").Configuration} config */ function (config) {
        if (config.resolve) {
            config.resolve.alias["@common"] = config.resolve.alias["common"];
            config.resolve.alias["@event"] = path.resolve(
                config.resolve.alias["@common"],
                "event"
            );
        }

        const workers = glob
            .sync("./src/main/**/*.worker.ts")
            .map((filePath) => {
                const name = path.basename(filePath, path.extname(filePath));
                return [
                    name,
                    path.dirname(filePath).split("src/main/")[1],
                    filePath,
                ];
            })
            .reduce((acc, [name, directoryPath, filePath]) => {
                acc[path.join(directoryPath, name)] = filePath;
                return acc;
            }, {});

        if (!config.plugins) {
            config.plugins = [];
        }
        if (config.mode === "production") {
            for (const plugin of config.plugins) {
                if (plugin instanceof webpack.BannerPlugin) {
                    plugin.options.exclude = /\.worker\.js$/i;
                }
            }
        }
        config.plugins.push(
            new webpack.EnvironmentPlugin([
                "TRACKER_MATOMO_ID_SITE",
                "TRACKER_MATOMO_URL",
                "TRACKER_PROVIDER",
                "TRACKER_POSTHOG_API_KEY",
                "TRACKER_POSTHOG_URL",
            ])
        );

        if (config.entry) {
            config.entry = {
                ...config.entry,
                ...workers,
            };
        }

        return config;
    };
