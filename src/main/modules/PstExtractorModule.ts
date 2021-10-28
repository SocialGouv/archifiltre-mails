import {
    PST_EXTRACT_EVENT,
    PST_PROGRESS_EVENT,
    PST_PROGRESS_SUBSCRIBE_EVENT,
} from "@common/constant/event";
import type { Module } from "@common/modules/Module";
import type {
    PstContent,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { ipcMain } from "electron";
import path from "path";

import { TSWorker } from "../worker";
import type { PstWorkerMessage } from "./pst-extractor/worker";
import {
    PST_DONE_WORKER_EVENT,
    PST_PROGRESS_WORKER_EVENT,
} from "./pst-extractor/worker";

const REGEXP_PST = /\.pst$/i;

/**
 * Module responsible of handling and extracting datas from given PST files.
 *
 * It will load a worker to extract the PST without blocking the main thread.
 */
export class PstExtractorModule implements Module {
    private inited = false;

    private progressReply?: (
        channel: typeof PST_PROGRESS_EVENT,
        progressState: PstProgressState
    ) => void;

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        ipcMain.on(PST_PROGRESS_SUBSCRIBE_EVENT, (event) => {
            this.progressReply = event.reply as typeof this.progressReply;
        });
        ipcMain.handle(PST_EXTRACT_EVENT, async (_event, ...args: unknown[]) =>
            this.extract(args[0] as string)
        );

        this.inited = true;
        await Promise.resolve();
    }

    private async extract(pstFilePath?: string): Promise<PstContent> {
        if (!pstFilePath || !REGEXP_PST.test(pstFilePath)) {
            throw new Error(
                `[PstExtractorService] Cannot extract PST from an unknown path or file. Got "${pstFilePath}"`
            );
        }

        const pstWorker = new TSWorker(
            path.resolve(__dirname, "pst-extractor", "worker.ts"),
            {
                workerData: {
                    pstFilePath,
                },
            }
        );
        return new Promise<PstContent>((resolve) => {
            pstWorker.on("message", async (message: PstWorkerMessage) => {
                switch (message.event) {
                    case PST_PROGRESS_WORKER_EVENT:
                        this.progressReply?.(PST_PROGRESS_EVENT, message.data);
                        break;
                    case PST_DONE_WORKER_EVENT:
                        this.progressReply?.(PST_PROGRESS_EVENT, {
                            ...message.data.progressState,
                            progress: false,
                        });

                        resolve(message.data.content);
                        await pstWorker.terminate();
                        break;
                }
            });
        });
    }
}
