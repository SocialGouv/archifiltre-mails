import { PRODUCT_CHANNEL } from "@common/config";
import { ipcMain } from "@common/lib/ipc";
import { logger } from "@common/logger";
import type { AutoUpdateCheckIpcConfig } from "@common/modules/app/ipc";
import type { TrackerService } from "@common/modules/TrackerModule";
import { version } from "@common/utils/package";
import { dialog } from "electron";
import type { ProgressInfo, UpdateInfo } from "electron-updater";
import { autoUpdater } from "electron-updater";
import type { TFunction } from "i18next";

type Replier = <T extends AutoUpdateCheckIpcConfig["replyKey"]>(
    replyChannel: T,
    ...args: Extract<AutoUpdateCheckIpcConfig, { replyKey: T }>["returnValue"]
) => void;

let quitForUpdate = false;
export const isQuitingForUpdate = (): boolean => quitForUpdate;

let setup = false;
export const setupAutoUpdate = (
    trackerService: TrackerService,
    t: TFunction
): void => {
    if (setup) return;
    setup = true;
    autoUpdater.logger = logger;
    autoUpdater.autoDownload = false;
    autoUpdater.allowDowngrade = false;
    autoUpdater.autoInstallOnAppQuit = PRODUCT_CHANNEL !== "stable";

    const repliers: Replier[] = [];
    let updateAvailable = false;
    ipcMain.on("autoUpdate.check", async (evt) => {
        repliers.push(evt.reply);
        await autoUpdater.checkForUpdates();
    });
    ipcMain.on("autoUpdate.doUpdate", (evt) => {
        evt.returnValue = updateAvailable;
        if (updateAvailable) {
            quitForUpdate = true;
            autoUpdater.quitAndInstall();
            return;
        }
    });

    // setup auto updater events
    autoUpdater.on("checking-for-update", () => {
        logger.log("[UPDATE] Check for update");
    });

    autoUpdater.on("update-available", async (info: UpdateInfo) => {
        logger.log("[UPDATE] Update available", info);
        await autoUpdater.downloadUpdate();
    });

    autoUpdater.on("update-not-available", (info: UpdateInfo) => {
        logger.log("[UPDATE] Update NOT available", info);
        repliers.forEach((reply) => {
            reply("autoUpdate.onUpdateAvailable", false);
        });
    });

    autoUpdater.on("error", (err, reason) => {
        logger.error("[UPDATE] Error", reason, err);
        repliers.forEach((reply) => {
            reply("autoUpdate.onError", reason!);
        });
    });

    autoUpdater.on("download-progress", (progress: ProgressInfo) => {
        logger.log("[UPDATE] Progress...", progress);
    });

    autoUpdater.on("update-downloaded", async (info: UpdateInfo) => {
        logger.log("[UPDATE] Update downloaded", info);
        updateAvailable = true;
        trackerService.getProvider().track("App Updated", {
            currentVersion: info.version,
            oldVersion: version,
        });
        repliers.forEach((reply) => {
            reply("autoUpdate.onUpdateAvailable", info);
        });
        const messageBox = await dialog.showMessageBox({
            buttons: [t("app.autoUpdate.update"), t("common:button.cancel")],
            message: t("app.autoUpdate.message", info),
            type: "question",
        });

        if (messageBox.response === 0) {
            quitForUpdate = true;
            autoUpdater.quitAndInstall();
        }
    });

    logger.log(
        "Current version:",
        autoUpdater.currentVersion.raw,
        autoUpdater.currentVersion
    );
};
