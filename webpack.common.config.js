const path = require("path");
const webpack = require("webpack");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");
const packageJson = require("./package.json");
require("dotenv").config();

module.exports =
    /** @param {import("webpack").Configuration} config */ function (config) {
        const isProd = config.mode === "production";
        if (!config.resolve) {
            config.resolve = {};
        }
        config.resolve.alias["@common"] = config.resolve.alias["common"];
        config.resolve.alias["@event"] = path.resolve(
            config.resolve.alias["@common"],
            "event"
        );

        if (!config.plugins) {
            config.plugins = [];
        }
        const project = `${packageJson.name}${isProd ? "" : "-dev"}`;
        config.plugins.push(
            new webpack.EnvironmentPlugin([
                "TRACKER_MATOMO_ID_SITE",
                "TRACKER_MATOMO_URL",
                "TRACKER_PROVIDER",
                "TRACKER_POSTHOG_API_KEY",
                "TRACKER_POSTHOG_URL",
                "SENTRY_ORG",
                "SENTRY_DSN",
                "SENTRY_URL",
            ]),
            new webpack.DefinePlugin({
                "process.env.TRACKER_FAKE_HREF": JSON.stringify(
                    `https://${project}`
                ),
            })
        );

        if (isProd) {
            config.devtool = "source-map";
            // TODO: enable source association by adding (not legacy) github integration to Sentry
            config.plugins.push(
                new SentryWebpackPlugin({
                    authToken: process.env.SENTRY_AUTH_TOKEN,
                    include: ["dist/"],
                    project,
                    release: `${packageJson.name}@${packageJson.version}`,
                })
            );
        }

        return config;
    };
