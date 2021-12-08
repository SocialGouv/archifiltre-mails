const path = require("path");
const glob = require("glob");

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

        console.log(workers);

        if (config.entry) {
            config.entry = {
                ...config.entry,
                ...workers,
            };
        }

        return config;
    };
