import {
    PST_EXTRACT_EVENT,
    PST_GET_EMAIL_EVENT,
    PST_PROGRESS_EVENT,
    PST_PROGRESS_SUBSCRIBE_EVENT,
    PST_STOP_EXTRACT_EVENT,
} from "@common/constant/event";
import type { Service } from "@common/modules/container/type";
import type {
    ExtractOptions,
    PstEmail,
    PstExtractDatas,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { ipcRenderer } from "electron";

type ProgressCallback = (progressState: PstProgressState) => void;

export interface PstExtractorService extends Service {
    /**
     * Extract the content of a PST.
     *
     * The work is done in a worker thread in the main process.
     */
    extract: (options: ExtractOptions) => Promise<PstExtractDatas>;
    getEmail: (emailIndex: number[]) => Promise<PstEmail>;
    /**
     * Trigger a callback on each progress tick. (a tick is based on the progress interval)
     *
     * @param callback The callback to trigger
     */
    onProgress: (callback: ProgressCallback) => void;
    /**
     * Stop the extract.
     */
    stop: () => Promise<void>;
}

/**
 * Simple front service that communicate with the PstExtractor "main-process" module to extract a given PST file.
 */
export const pstExtractorService: PstExtractorService = {
    async extract(options) {
        return ipcRenderer.invoke(
            PST_EXTRACT_EVENT,
            options
        ) as Promise<PstExtractDatas>;
    },

    async getEmail(emailIndex) {
        return ipcRenderer.invoke(
            PST_GET_EMAIL_EVENT,
            emailIndex
        ) as Promise<PstEmail>;
    },

    name: "PstExtractorService",

    onProgress(callback: ProgressCallback) {
        ipcRenderer.removeAllListeners(PST_PROGRESS_EVENT);
        ipcRenderer.on(
            PST_PROGRESS_EVENT,
            (_event, ...[progressState]: [PstProgressState]) => {
                callback(progressState);
            }
        );
        ipcRenderer.send(PST_PROGRESS_SUBSCRIBE_EVENT);
    },

    async stop(): Promise<void> {
        return ipcRenderer.invoke(PST_STOP_EXTRACT_EVENT) as Promise<void>;
    },
};
