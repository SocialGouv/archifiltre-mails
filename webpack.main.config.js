const webpack = require("webpack");
const webpackCommonConfig = require("./webpack.common.config");
const { workers } = require("./webpack.workers.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
require("dotenv").config();

module.exports =
    /** @param {import("webpack").Configuration} config */ function (config) {
        if (config.mode === "production") {
            for (const plugin of config.plugins) {
                if (plugin instanceof webpack.BannerPlugin) {
                    plugin.options.exclude = /preload\.js$/i;
                }
            }
        } else {
            // add workers in dev
            for (const plugin of config.plugins) {
                if (plugin instanceof HtmlWebpackPlugin) {
                    plugin.options?.excludeChunks?.push(...Object.keys(workers));
                }
            }

            if (config.entry) {
                config.entry = {
                    ...config.entry,
                    ...workers,
                };
            }
        }

        return webpackCommonConfig(config);
    };
