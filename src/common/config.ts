import { ipcMain, ipcRenderer } from "electron";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
export const IS_MAIN = (ipcMain && !ipcRenderer) as boolean;
export const IS_TEST = !!process.env.NODE_ENV?.startsWith("test");
export const IS_DEV = process.env.NODE_ENV !== "production" && !IS_TEST;
export const IS_E2E = !!process.env.E2E;
export const IS_MAC = process.platform === "darwin";
