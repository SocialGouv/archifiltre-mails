import { ipcRenderer } from "@common/lib/ipc";
import type { Service } from "@common/modules/container/type";
import type {
    ExtractOptions,
    PstEmail,
    PstExtractDatas,
    PstProgressState,
} from "@common/modules/pst-extractor/type";

type ProgressCallback = (progressState: PstProgressState) => void;

export interface PstExtractorService extends Service {
    /**
     * Extract the content of a PST.
     *
     * The work is done in a worker thread in the main process.
     */
    extract: (options: ExtractOptions) => Promise<PstExtractDatas>;
    getEmails: (emailIndexes: number[][]) => Promise<PstEmail[]>;
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
        return ipcRenderer.invoke("pstExtractor.event.extract", options);
    },

    async getEmails(emailIndexes) {
        return ipcRenderer.invoke("pstExtractor.event.getEmails", emailIndexes);
    },

    name: "PstExtractorService",

    onProgress(callback: ProgressCallback) {
        ipcRenderer.removeAllListeners("pstExtractor.event.progress");
        ipcRenderer.on(
            "pstExtractor.event.progress",
            (_event, progressState) => {
                callback(progressState);
            }
        );
        ipcRenderer.send("pstExtractor.event.progressSuscribe");
    },

    async stop(): Promise<void> {
        return ipcRenderer.invoke("pstExtractor.event.stopExtract");
    },
};
