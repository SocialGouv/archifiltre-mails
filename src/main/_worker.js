"use strict";

module.hot?.reject();

require("source-map-support").install();

global.__static = ""; // ts-node equivalent of webpack.DefinePlugin

// bridge worker to call "real" workers in Typescript
const path = require("path");
const { workerData } = require("worker_threads");

require("ts-node").register({
    project: path.resolve(__dirname, "tsconfig.json"),
});

require(workerData._workerPath);
