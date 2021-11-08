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
    /**
     * Extract the content of a PST.
     *
     * The work is done in a worker thread in the main process.
     *
     * @param options List of extract options
     * @param options.pstFilePath The pst file path. Must be absolute!
     * @param options.depth The folder depth where the extract should stop
     * @returns The content of the PST
     */
    extract: (options: {
        pstFilePath: string;
        depth?: number;
    }) => Promise<PstContent>;
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
    async extract({ pstFilePath, depth }): Promise<PstContent> {
        return ipcRenderer.invoke(
            PST_EXTRACT_EVENT,
            pstFilePath,
            depth
        ) as Promise<PstContent>;
    },

    name: "PstExtractorService",

    onProgress(callback: ProgressCallback) {
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
