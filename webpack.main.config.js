const path = require("path");
const glob = require("glob");
const webpack = require("webpack");

module.exports =
    /** @param {import("webpack").Configuration} config */ function (config) {
        if (config.resolve) {
            config.resolve.alias["@common"] = config.resolve.alias["common"];
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

        if (config.mode === "production" && config.plugins) {
            for (const plugin of config.plugins) {
                if (plugin instanceof webpack.BannerPlugin) {
                    plugin.options.exclude = /\.worker\.js$/i;
                }
            }
        }

        if (config.entry) {
            config.entry = {
                ...config.entry,
                ...workers,
            };
        }

        return config;
    };
