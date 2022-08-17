import path from "path";
import { isMainThread, workerData } from "worker_threads";

export const IS_WORKER = !isMainThread;
export const WORKER_CONFIG_TOKEN = "__config" as const;

const { app, ipcMain, ipcRenderer } = IS_WORKER
    ? // eslint-disable-next-line @typescript-eslint/consistent-type-imports -- deal with it
      ({} as typeof import("electron"))
    : // eslint-disable-next-line @typescript-eslint/no-require-imports -- yep, sad uh?
      require("electron");

export interface WorkerConfig {
    APP_CACHE: string;
    IS_DEV: boolean;
    IS_DIST_MODE: boolean;
    IS_E2E: boolean;
    IS_MAC: boolean;
    IS_MAIN: boolean;
    IS_PACKAGED: boolean;
    IS_TEST: boolean;
    STATIC_PATH: string;
}

const localWorkerConfig: Partial<WorkerConfig> = IS_WORKER
    ? workerData[WORKER_CONFIG_TOKEN]
    : {};

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
const IS_PACKAGE_EVENT = "config.IS_PACKAGED";
const APP_CACHE_EVENT = "config.APP_CACHE";
if (IS_MAIN) {
    ipcMain.on(IS_PACKAGE_EVENT, (event) => {
        event.returnValue = app.isPackaged;
    });
    ipcMain.on(APP_CACHE_EVENT, (event) => {
        event.returnValue = app.getPath("cache");
    });
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
        return app.getPath("cache");
    } else return ipcRenderer.sendSync(APP_CACHE_EVENT) as string;
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
    IS_DEV,
    IS_DIST_MODE,
    IS_E2E,
    IS_MAC,
    IS_MAIN,
    IS_PACKAGED: IS_PACKAGED(),
    IS_TEST,
    STATIC_PATH,
};
