import { IS_DEV, IS_E2E } from "@common/config";
import type { Module } from "@common/modules/Module";
import { dialog } from "electron";
import { autoUpdater } from "electron-updater";

import type { MainWindowRetriever } from "..";

/**
 * Module to handle almost all global app related stuff like closing, navigating.
 */
export class AppModule implements Module {
    constructor(private readonly mainWindowRetriever: MainWindowRetriever) {}

    async init(): Promise<void> {
        // can't await because mainWindow is created after this init
        void this.mainWindowRetriever().then(async (mainWindow) => {
            // prevent navigation
            mainWindow.webContents.on("will-navigate", (event) => {
                event.preventDefault();
            });

            if (!IS_DEV && !IS_E2E) {
                // ask before leaving
                mainWindow.on("close", async (event) => {
                    event.preventDefault();
                    const answer = await dialog.showMessageBox(mainWindow, {
                        buttons: ["No", "Yes"],
                        //TODO: i18n
                        cancelId: 0,
                        defaultId: 0,
                        detail: "Data not saved",
                        message: "Leave ?",
                        title: "Quit app",
                        type: "warning",
                    });

                    if (answer.response === 1) {
                        mainWindow.destroy();
                    }
                });

                await autoUpdater.checkForUpdatesAndNotify();
            }
        });

        return Promise.resolve();
    }
}
