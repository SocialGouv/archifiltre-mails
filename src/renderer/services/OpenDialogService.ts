import {
    GET_SAVE_DESTINATION_PATH_EVENT,
    OPEN_SAVE_DIALOG_EVENT,
} from "@common/constant/event";
import type { Service } from "@common/modules/container/type";
import { ipcRenderer } from "electron";

import type { ExporterType } from "../exporters/Exporter";

export interface OpenDialogService extends Service {
    getSaveDestinationPath: (callback: GetSaveDestinationPathCallback) => void;
    openSaveDestinationWindow: (type: ExporterType) => void;
}

type GetSaveDestinationPathCallback = (path: string) => void;

/**
 * Front service connector for OpenDialogModule main-process module to get exporter destination file path.
 */
export const openDialogService: OpenDialogService = {
    getSaveDestinationPath(callback: GetSaveDestinationPathCallback) {
        return ipcRenderer.on(
            GET_SAVE_DESTINATION_PATH_EVENT,
            (_, path: string) => {
                callback(path);
            }
        );
    },
    name: "openDialogService",
    openSaveDestinationWindow(type: ExporterType) {
        ipcRenderer.send(OPEN_SAVE_DIALOG_EVENT, type);
    },
};
