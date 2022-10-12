import path from "path";
import { isMainThread, workerData } from "worker_threads";

import { name, version } from "./utils/package";

export const IS_WORKER = !isMainThread;
export const WORKER_CONFIG_TOKEN = "__config" as const;

// electron is not available in Worker side so we fake it.
const { app, ipcMain, ipcRenderer } = IS_WORKER
    ? // eslint-disable-next-line @typescript-eslint/consistent-type-imports -- deal with it
      ({} as typeof import("electron"))
    : // eslint-disable-next-line @typescript-eslint/no-require-imports -- yep, sad uh?
      require("electron");

export interface WorkerConfig {
    APP_CACHE: string;
    APP_DATA: string;
    IS_DEV: boolean;
    IS_DIST_MODE: boolean;
    IS_E2E: boolean;
    IS_MAC: boolean;
    IS_MAIN: boolean;
    IS_PACKAGED: boolean;
    IS_TEST: boolean;
    IS_WIN: boolean;
    PRODUCT_CHANNEL: "beta" | "next" | "stable";
    STATIC_PATH: string;
}

const localWorkerConfig: Partial<WorkerConfig> = IS_WORKER
    ? workerData[WORKER_CONFIG_TOKEN]
    : {};

export const PRODUCT_CHANNEL =
    localWorkerConfig.PRODUCT_CHANNEL ?? version.includes("beta")
        ? "beta"
        : version.includes("next")
        ? "next"
        : "stable";

export const IS_MAIN =
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    localWorkerConfig.IS_MAIN ?? ((ipcMain && !ipcRenderer) as boolean);
export const IS_TEST =
    localWorkerConfig.IS_TEST ?? !!process.env.NODE_ENV?.startsWith("test");
export const IS_DEV =
    localWorkerConfig.IS_DEV ??
    (process.env.NODE_ENV !== "production" && !IS_TEST);
export const IS_E2E = localWorkerConfig.IS_E2E ?? !!process.env.E2E;
export const IS_MAC = localWorkerConfig.IS_MAC ?? process.platform === "darwin";
export const IS_WIN = localWorkerConfig.IS_WIN ?? process.platform === "win32";
const IS_PACKAGE_EVENT = "config.IS_PACKAGED";
const APP_CACHE_EVENT = "config.APP_CACHE";
const APP_DATA_EVENT = "config.APP_DATA";
if (IS_MAIN && !IS_WORKER) {
    ipcMain.on(IS_PACKAGE_EVENT, (event) => {
        event.returnValue = app.isPackaged;
    });
    ipcMain.on(APP_CACHE_EVENT, (event) => {
        event.returnValue = APP_CACHE();
    });
    ipcMain.on(APP_DATA_EVENT, (event) => {
        event.returnValue = APP_DATA();
    });
}

if (IS_DEV && IS_MAIN && !IS_WORKER) {
    app.setName(`${name}-dev`);
    app.setPath("appData", path.resolve(__dirname, "../../electron/.appData/"));
    if (!IS_WIN) {
        app.setPath(
            "cache",
            path.resolve(__dirname, "../../electron/.appCache/")
        );
    }
}

export const IS_PACKAGED = (): boolean => {
    if (IS_WORKER) return localWorkerConfig.IS_PACKAGED!;
    if (IS_MAIN) {
        return app.isPackaged;
    } else return ipcRenderer.sendSync(IS_PACKAGE_EVENT) as boolean;
};

export const APP_CACHE = (): string => {
    if (IS_WORKER) return localWorkerConfig.APP_CACHE!;
    if (IS_MAIN) {
        return IS_WIN
            ? path.resolve(app.getPath("userData"), "Cache")
            : path.resolve(app.getPath("cache"), app.getName());
    } else return ipcRenderer.sendSync(APP_CACHE_EVENT) as string;
};

export const APP_DATA = (): string => {
    if (IS_WORKER) return localWorkerConfig.APP_DATA!;
    if (IS_MAIN) {
        return app.getPath("userData");
    } else return ipcRenderer.sendSync(APP_DATA_EVENT) as string;
};

export const IS_DIST_MODE =
    localWorkerConfig.IS_DIST_MODE ??
    (!IS_PACKAGED() && !process.env.ELECTRON_WEBPACK_WDS_PORT);

export const STATIC_PATH =
    localWorkerConfig.STATIC_PATH ?? IS_PACKAGED()
        ? __static // prod
        : !process.env.ELECTRON_WEBPACK_WDS_PORT
        ? path.resolve(__dirname, "../../static") // dist / e2e
        : __static; // dev

export const workerConfig: WorkerConfig = {
    APP_CACHE: APP_CACHE(),
    APP_DATA: APP_DATA(),
    IS_DEV,
    IS_DIST_MODE,
    IS_E2E,
    IS_MAC,
    IS_MAIN,
    IS_PACKAGED: IS_PACKAGED(),
    IS_TEST,
    IS_WIN,
    PRODUCT_CHANNEL,
    STATIC_PATH,
};
