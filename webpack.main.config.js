module.exports =
    /** @param {import("webpack").Configuration} config */ function (config) {
        if (config.resolve) {
            config.resolve.alias["@common"] = config.resolve.alias["common"];
        }

        return config;
    };
