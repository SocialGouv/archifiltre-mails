const path = require("path");
const webpack = require("webpack");
require("dotenv").config();

module.exports =
    /** @param {import("webpack").Configuration} config */ function (config) {
        const styleRules = config.module.rules.filter((rule) =>
            rule.test.toString().match(/css|less|s\(\[ac\]\)ss/)
        );

        styleRules.forEach((rule) => {
            const uses = rule.use;
            if (!Array.isArray(uses)) {
                return;
            }

            const cssLoader = uses.find((use) => use.loader === "css-loader");
            if (typeof cssLoader === "object") {
                cssLoader.options = {
                    ...cssLoader.options,
                    esModule: true,
                    localsConvention: "camelCase",
                    modules: {
                        localIdentName: "[local]___[hash:base64:5]",
                        mode: "local",
                    },
                    sourceMap: true,
                };
            }
        });

        if (config.resolve) {
            config.resolve.alias["@common"] = config.resolve.alias["common"];
            config.resolve.alias["@event"] = path.resolve(
                config.resolve.alias["@common"],
                "event"
            );
        }
        if (!config.plugins) {
            config.plugins = [];
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

        return config;
    };
