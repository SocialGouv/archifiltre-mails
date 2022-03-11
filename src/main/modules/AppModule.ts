import { IS_E2E } from "@common/config";
import type { I18nService } from "@common/modules/I18nModule";
import type { TrackerService } from "@common/modules/TrackerModule";
import type { UserConfigService } from "@common/modules/UserConfigModule";
import { version } from "@common/utils/package";
import { dialog } from "electron";
import type { ProgressInfo, UpdateInfo } from "electron-updater";
import { autoUpdater } from "electron-updater";

import type { MainWindowRetriever } from "..";
import type { ConsoleToRendererService } from "../services/ConsoleToRendererService";
import { MainModule } from "./MainModule";

/**
 * Module to handle almost all global app related stuff like closing, navigating.
 */
export class AppModule extends MainModule {
    constructor(
        private readonly mainWindowRetriever: MainWindowRetriever,
        private readonly consoleToRendererService: ConsoleToRendererService,
        private readonly i18nService: I18nService,
        private readonly userConfigService: UserConfigService,
        private readonly trackerService: TrackerService
    ) {
        super();
    }

    public async init(): Promise<void> {
        // can't await because mainWindow is created after this init
        void this.mainWindowRetriever().then(async (mainWindow) => {
            await this.userConfigService.wait();
            mainWindow.setFullScreen(this.userConfigService.get("fullscreen"));
            mainWindow.on("enter-full-screen", () => {
                this.userConfigService.set("fullscreen", true);
            });
            mainWindow.on("leave-full-screen", () => {
                this.userConfigService.set("fullscreen", false);
            });
            // prevent navigation
            mainWindow.webContents.on("will-navigate", (event) => {
                event.preventDefault();
            });

            const firstOpened = this.userConfigService.get("_firstOpened");
            if (firstOpened) {
                this.trackerService.getProvider().track("App First Opened", {
                    arch: process.arch,
                    date: new Date(),
                    os: process.platform,
                    version,
                });
                this.userConfigService.set("_firstOpened", false);
            }

            this.trackerService.getProvider().track("App Opened", {
                date: new Date(),
                version,
            });

            if (!IS_E2E) {
                await this.i18nService.wait();
                const { t } = this.i18nService.i18next;
                // ask before leaving
                mainWindow.on("close", async (event) => {
                    event.preventDefault();
                    const answer = await dialog.showMessageBox(mainWindow, {
                        buttons: [
                            t("common:button.no"),
                            t("common:button.yes"),
                        ],
                        cancelId: 0,
                        defaultId: 0,
                        detail: t("app.quit.detail"),
                        message: t("app.quit.leave"),
                        title: t("app.quit.title"),
                        type: "warning",
                    });

                    if (answer.response === 1) {
                        mainWindow.destroy();
                    }
                });
            }

            // TODO: more interactive auto-update
            autoUpdater.on("checking-for-update", (evt) => {
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

            autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
                this.consoleToRendererService.log(
                    mainWindow,
                    "[UPDATE] Update downloaded",
                    info
                );
                this.trackerService.getProvider().track("App Updated", {
                    currentVersion: info.version,
                    oldVersion: version,
                });
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
