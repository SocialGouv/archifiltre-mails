import { IS_DEV, IS_E2E } from "@common/config";
import type { Module } from "@common/modules/Module";
import { dialog } from "electron";
import type { ProgressInfo, UpdateInfo } from "electron-updater";
import { autoUpdater } from "electron-updater";

import type { MainWindowRetriever } from "..";
import type { ConsoleToRendererService } from "../services/ConsoleToRendererService";

/**
 * Module to handle almost all global app related stuff like closing, navigating.
 */
export class AppModule implements Module {
    constructor(
        private readonly mainWindowRetriever: MainWindowRetriever,
        private readonly consoleToRendererService: ConsoleToRendererService
    ) {}

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
            }

            autoUpdater.on("check-for-update", (evt) => {
                this.consoleToRendererService.log(
                    mainWindow,
                    "[UPDATE] Check for update",
                    evt
                );
            });

            autoUpdater.on("update-available", (info: UpdateInfo) => {
                this.consoleToRendererService.log(
                    mainWindow,
                    "[UPDATE] Update available",
                    info
                );
            });

            autoUpdater.on("update-not-available", (info: UpdateInfo) => {
                this.consoleToRendererService.log(
                    mainWindow,
                    "[UPDATE] Update NOT available",
                    info
                );
            });

            autoUpdater.on("error", (err) => {
                this.consoleToRendererService.log(
                    mainWindow,
                    "[UPDATE] Error",
                    err
                );
            });

            autoUpdater.on("download-progress", (progress: ProgressInfo) => {
                this.consoleToRendererService.log(
                    mainWindow,
                    "[UPDATE] Progress...",
                    progress
                );
            });

            const log = this.consoleToRendererService.log.bind(
                this.consoleToRendererService,
                mainWindow
            );
            autoUpdater.logger = {
                debug: log,
                error: log,
                info: log,
                warn: log,
            };
            this.consoleToRendererService.log(
                mainWindow,
                "Current version:",
                autoUpdater.currentVersion.raw,
                autoUpdater.currentVersion
            );
            autoUpdater.allowDowngrade = false;
            await autoUpdater.checkForUpdatesAndNotify();
        });

        return Promise.resolve();
    }
}
