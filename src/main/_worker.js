"use strict";

require("source-map-support").install();

// bridge worker to call "real" workers in Typescript
const path = require("path");
const { workerData } = require("worker_threads");

require("ts-node").register({
    project: path.resolve(__dirname, "tsconfig.json"),
});

require(workerData._workerPath);
