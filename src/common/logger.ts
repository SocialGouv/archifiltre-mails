/* eslint-disable no-console */

import { create } from "electron-log";
import path from "path";

import { APP_DATA, IS_DEV, IS_MAIN, IS_TEST, IS_WORKER } from "./config";
import { name } from "./utils/package";

const logger = create(name);
if (!IS_TEST) {
    logger.transports.file.resolvePath = ({ fileName }) =>
        path.resolve(APP_DATA(), "logs", fileName ?? "default.log");

    if (!IS_MAIN && !IS_WORKER) {
        // renderer only config
        if (logger.transports.ipc) logger.transports.ipc.level = false;
    }

    if (IS_DEV) {
        logger.transports.file.level = false;
    }

    if (IS_MAIN && !IS_WORKER) {
        // main only config
    }
}

export { logger };
