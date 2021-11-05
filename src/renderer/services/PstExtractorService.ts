import {
    PST_EXTRACT_EVENT,
    PST_PROGRESS_EVENT,
    PST_PROGRESS_SUBSCRIBE_EVENT,
    PST_STOP_EXTRACT_EVENT,
} from "@common/constant/event";
import type { Service } from "@common/modules/container/type";
import type {
    PstContent,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { ipcRenderer } from "electron";

type ProgressCallback = (progressState: PstProgressState) => void;

export interface PstExtractorService extends Service {
    extract: (pstFilePath?: string) => Promise<PstContent>;
    onProgress: (callback: ProgressCallback) => void;
    stop: () => Promise<void>;
}

/**
 * Simple front service that communicate with the PstExtractor "main-process" module to extract a given PST file.
 */
export const pstExtractorService: PstExtractorService = {
    /**
     * Extract the content of a PST.
     *
     * The work is done in a worker thread in the main process.
     *
     * @param pstFilePath The pst file path. Must be absolute!
     * @returns The content of the PST
     */
    async extract(pstFilePath?: string): Promise<PstContent> {
        return ipcRenderer.invoke(
            PST_EXTRACT_EVENT,
            pstFilePath
        ) as Promise<PstContent>;
    },

    name: "PstExtractorService",

    /**
     * Trigger a callback on each progress tick. (a tick is when an email is extracted)
     *
     * @param callback The callback to trigger
     */
    onProgress(callback: ProgressCallback) {
        ipcRenderer.on(
            PST_PROGRESS_EVENT,
            (_event, ...[progressState]: [PstProgressState]) => {
                callback(progressState);
            }
        );
        ipcRenderer.send(PST_PROGRESS_SUBSCRIBE_EVENT);
    },

    /**
     * Stop the extract.
     */
    async stop(): Promise<void> {
        return ipcRenderer.invoke(PST_STOP_EXTRACT_EVENT) as Promise<void>;
    },
};
