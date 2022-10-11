import type { App, Dialog, Shell } from "electron";
import { app, dialog, shell } from "electron";

import { IS_MAIN } from "../config";
import { ipcMain } from "../lib/ipc";
import { IsomorphicModule } from "./Module";

declare module "../lib/ipc/event" {
    interface AsyncIpcMapping {
        "dialog.showMessageBox": IpcConfig<
            Parameters<Dialog["showMessageBox"]>,
            ReturnType<Dialog["showMessageBox"]>
        >;
        "dialog.showOpenDialog": IpcConfig<
            Parameters<Dialog["showOpenDialog"]>,
            ReturnType<Dialog["showOpenDialog"]>
        >;
        "dialog.showSaveDialog": IpcConfig<
            Parameters<Dialog["showSaveDialog"]>,
            ReturnType<Dialog["showSaveDialog"]>
        >;
        "shell.openPath": IpcConfig<
            Parameters<Shell["openPath"]>,
            ReturnType<Shell["openPath"]>
        >;
        "shell.showItemInFolder": IpcConfig<
            Parameters<Shell["showItemInFolder"]>,
            ReturnType<Shell["showItemInFolder"]>
        >;
    }

    interface SyncIpcMapping {
        "app.getAppPath": IpcConfig<
            Parameters<App["getAppPath"]>,
            ReturnType<App["getAppPath"]>
        >;
        "app.getName": IpcConfig<
            Parameters<App["getName"]>,
            ReturnType<App["getName"]>
        >;
        "app.getPath": IpcConfig<
            Parameters<App["getPath"]>,
            ReturnType<App["getPath"]>
        >;
    }
}

/**
 * Exposes commonly used electron util functions to renderer process through IPC protocol.
 */
export class IpcModule extends IsomorphicModule {
    private inited = false;

    public async init(): pvoid {
        if (!IS_MAIN || this.inited) {
            return Promise.resolve();
        }

        ipcMain.on("app.getPath", (event, options) => {
            event.returnValue = app.getPath(options);
        });
        ipcMain.on("app.getName", (event) => {
            event.returnValue = app.getName();
        });
        ipcMain.on("app.getAppPath", (event) => {
            event.returnValue = app.getAppPath();
        });
        ipcMain.handle("dialog.showMessageBox", async (_event, options) =>
            dialog.showMessageBox(options)
        );
        ipcMain.handle("dialog.showOpenDialog", async (_event, options) =>
            dialog.showOpenDialog(options)
        );
        ipcMain.handle("dialog.showSaveDialog", async (_event, options) =>
            dialog.showSaveDialog(options)
        );
        ipcMain.handle("shell.openPath", async (_event, path) =>
            shell.openPath(path)
        );
        ipcMain.handle("shell.showItemInFolder", (_event, fullPath) => {
            shell.showItemInFolder(fullPath);
        });

        this.inited = true;
    }

    public async uninit(): pvoid {
        this.inited = false;
        return Promise.resolve();
    }
}
