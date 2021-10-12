import { app } from "electron";

export * from "../common/core/config";

export const IS_PACKAGED = app.isPackaged;
