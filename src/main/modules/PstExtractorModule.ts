import {
    PST_EXTRACT_EVENT,
    PST_PROGRESS_EVENT,
    PST_PROGRESS_SUBSCRIBE_EVENT,
    PST_STOP_EXTRACT_EVENT,
} from "@common/constant/event";
import type { Module } from "@common/modules/Module";
import type {
    PstContent,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { ipcMain } from "electron";
import path from "path";

import { TSWorker } from "../worker";
import type {
    PstWorkerCommandType,
    PstWorkerData,
    PstWorkerMessageType,
} from "./pst-extractor/worker";
import {
    PST_DONE_WORKER_EVENT,
    PST_INTERUPTED_WORKER_EVENT,
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

    private pstWorker?: TSWorker<PstWorkerCommandType>;

    private lastProgressState!: PstProgressState;

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
        ipcMain.handle(PST_STOP_EXTRACT_EVENT, async () => {
            console.log("STOP RECEIVED");
            await this.stop();
        });

        this.inited = true;
        await Promise.resolve();
    }

    private async extract(pstFilePath?: string): Promise<PstContent> {
        if (!pstFilePath || !REGEXP_PST.test(pstFilePath)) {
            throw new Error(
                `[PstExtractorService] Cannot extract PST from an unknown path or file. Got "${pstFilePath}"`
            );
        }

        console.info("Start extracting...");
        this.pstWorker = new TSWorker(
            path.resolve(__dirname, "pst-extractor", "worker.ts"),
            {
                stderr: true,
                trackUnmanagedFds: true,
                workerData: {
                    progressInterval: 1500,
                    pstFilePath,
                } as PstWorkerData,
            }
        );
        return new Promise<PstContent>((resolve, reject) => {
            this.pstWorker?.on("message", (message: PstWorkerMessageType) => {
                switch (message.event) {
                    case PST_PROGRESS_WORKER_EVENT:
                        this.progressReply?.(
                            PST_PROGRESS_EVENT,
                            (this.lastProgressState = message.data)
                        );
                        break;
                    case PST_DONE_WORKER_EVENT:
                        this.progressReply?.(
                            PST_PROGRESS_EVENT,
                            (this.lastProgressState = {
                                ...message.data.progressState,
                                progress: false,
                            })
                        );

                        resolve(message.data.content);
                        console.info("Extract done.");
                        break;
                    case PST_INTERUPTED_WORKER_EVENT:
                        console.log("WORKER INTERUPTED");
                        reject(message.data.reason);
                        break;
                }
            });

            this.pstWorker?.on("error", (error) => {
                reject(error);
            });

            this.pstWorker?.on("exit", (exitCode) => {
                if (exitCode === 1) {
                    reject("EXIT CODE 1");
                }
            });
        });
    }

    private async stop(): Promise<void> {
        this.progressReply?.(
            PST_PROGRESS_EVENT,
            (this.lastProgressState = {
                ...this.lastProgressState,
                progress: false,
            })
        );
        await this.pstWorker?.terminate();
        // this.pstWorker?.postMessage({
        //     command: PST_STOP_EXTRACT_COMMAND,
        // });
        // return Promise.resolve();
    }
}
