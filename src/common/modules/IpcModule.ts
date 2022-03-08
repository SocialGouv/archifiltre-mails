import type { Dialog, Shell } from "electron";
import { dialog, shell } from "electron";

import { IS_MAIN } from "../config";
import { ipcMain } from "../lib/ipc";
import { IsomorphicModule } from "./Module";

declare module "../lib/ipc/event" {
    interface AsyncIpcMapping {
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
}

/**
 * Exposes commonly used electron util functions to renderer process through IPC protocol.
 */
export class IpcModule extends IsomorphicModule {
    private inited = false;

    public async init(): Promise<void> {
        if (!IS_MAIN || this.inited) {
            return Promise.resolve();
        }

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

    public async uninit(): Promise<void> {
        this.inited = false;
        return Promise.resolve();
    }
}
