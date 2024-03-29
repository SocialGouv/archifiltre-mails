import { IS_E2E, IS_MAC } from "@common/config";
import type { I18nService } from "@common/modules/I18nModule";
import type { TrackerService } from "@common/modules/TrackerModule";
import type { UserConfigService } from "@common/modules/UserConfigModule";
import { version } from "@common/utils/package";
import { dialog } from "electron";

import type { MainWindowRetriever } from "..";
import { isQuitingForUpdate, setupAutoUpdate } from "./app/autoUpdate";
import { MainModule } from "./MainModule";

/**
 * Module to handle almost all global app related stuff like closing, navigating.
 */
export class AppModule extends MainModule {
    constructor(
        private readonly mainWindowRetriever: MainWindowRetriever,
        private readonly i18nService: I18nService,
        private readonly userConfigService: UserConfigService,
        private readonly trackerService: TrackerService
    ) {
        super();
    }

    public async init(): pvoid {
        // can't await because mainWindow is created after this init
        void this.mainWindowRetriever().then(async (mainWindow) => {
            await this.userConfigService.wait();
            // on window or linux, fullscreen means "borderless" fullscreen (like F11)
            if (this.userConfigService.get("fullscreen")) {
                if (IS_MAC) mainWindow.setFullScreen(true);
                else mainWindow.maximize();
            }
            const onEnterFullScreen = () => {
                this.userConfigService.set("fullscreen", true);
            };
            const onLeaveFullScreen = () => {
                this.userConfigService.set("fullscreen", false);
            };
            if (IS_MAC) mainWindow.on("enter-full-screen", onEnterFullScreen);
            else mainWindow.on("maximize", onEnterFullScreen);
            if (IS_MAC) mainWindow.on("leave-full-screen", onLeaveFullScreen);
            else mainWindow.on("unmaximize", onLeaveFullScreen);

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

            await this.i18nService.wait();
            if (!IS_E2E) {
                const { t } = this.i18nService.i18next;
                // ask before leaving
                mainWindow.on("close", async (event) => {
                    if (isQuitingForUpdate()) return;
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

            setupAutoUpdate(this.trackerService, this.i18nService.i18next.t);
        });

        return Promise.resolve();
    }
}
