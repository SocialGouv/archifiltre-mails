import {
    GET_SAVE_DESTINATION_PATH_EVENT,
    OPEN_SAVE_DIALOG_EVENT,
} from "@common/constant/event";
import type { Module } from "@common/modules/Module";
import type { IpcMainEvent } from "electron";
import { dialog, ipcMain } from "electron";

import type { ExporterType } from "./../exporters/Exporter";

/**
 * Module responsible of handling open dialog for renderer.
 *
 * It will send a destination path to renderer method.
 */
export class OpenDialogModule implements Module {
    private inited = false;

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }
        ipcMain.on(
            OPEN_SAVE_DIALOG_EVENT,
            async (event, args: ExporterType) => {
                await this.getSaveDestinationPath(event, args);
            }
        );

        this.inited = true;

        return Promise.resolve();
    }

    private async getSaveDestinationPath(
        event: IpcMainEvent,
        type: ExporterType
    ): Promise<void> {
        const options = {
            filters: [{ extensions: [type], name: `${type} File` }],
            message: "Enregistrer votre export",
            nameFieldLabel: "👉",
            showsTagField: false,
            title: `Save ${type} export`,
        };

        const dialogPath = await dialog.showSaveDialog(options);

        if (dialogPath.canceled || !dialogPath.filePath) {
            return;
        }

        event.sender.send(GET_SAVE_DESTINATION_PATH_EVENT, dialogPath.filePath);

        return Promise.resolve();
    }
}
