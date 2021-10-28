import { IS_MAIN } from "@common/config";
import { ipcMain, ipcRenderer } from "electron";
import path from "path";
import { Worker } from "worker_threads";

import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";
import type { PstContent } from "./pst-extractor/type";
import type { PstProgressState } from "./pst-extractor/worker";
import {
    PST_DONE_WORKER_EVENT,
    PST_PROGRESS_WORKER_EVENT,
} from "./pst-extractor/worker";

const REGEXP_PST = /\.pst$/i;
const PST_EXTRACT_EVENT = "pstExtractorService.extract";
const PST_PROGRESS_EVENT = "pstExtractorService.progress";
const PST_PROGRESS_SUBSCRIBE_EVENT = "pstExtractorService.progressSuscribe";

export type PstWorkerMessage =
    | {
          event: typeof PST_DONE_WORKER_EVENT;
          data: { content: PstContent; progressState: PstProgressState };
      }
    | {
          event: typeof PST_PROGRESS_WORKER_EVENT;
          data: PstProgressState;
      };

export class PstExtractorModule extends IsomorphicModule {
    public service = new InnerPstExtractorService();

    private inited = false;

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        this.inited = true;
        await Promise.resolve();
    }
}

export type PstExtractorService = InnerPstExtractorService;

class InnerPstExtractorService extends IsomorphicService {
    public inited = false;

    private progressReply?: (
        channel: typeof PST_PROGRESS_EVENT,
        progressState: PstProgressState
    ) => void;

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }
        if (IS_MAIN) {
            ipcMain.on(PST_PROGRESS_SUBSCRIBE_EVENT, (event) => {
                this.progressReply = event.reply as typeof this.progressReply;
            });
            ipcMain.handle(
                PST_EXTRACT_EVENT,
                async (_event, ...args: unknown[]) =>
                    this.extract(args[0] as string)
            );
        }
        await Promise.resolve();
        this.inited = true;
    }

    public async extract(pstFilePath?: string): Promise<PstContent> {
        if (!pstFilePath || !REGEXP_PST.test(pstFilePath)) {
            throw new Error(
                `[PstExtractorService] Cannot extract PST from an unknown path or file. Got "${pstFilePath}"`
            );
        }

        if (IS_MAIN) {
            const workerRunnerPath = path.resolve(__dirname, "../../worker.js");
            const workerPath = path.resolve(
                __dirname,
                "pst-extractor",
                "worker.ts"
            );
            const pstWorker = new Worker(workerRunnerPath, {
                workerData: {
                    _workerPath: workerPath,
                    pstFilePath,
                },
            });
            return new Promise<PstContent>((resolve) => {
                pstWorker.on("message", (message: PstWorkerMessage) => {
                    switch (message.event) {
                        case PST_PROGRESS_WORKER_EVENT:
                            this.progressReply?.(
                                PST_PROGRESS_EVENT,
                                message.data
                            );
                            break;
                        case PST_DONE_WORKER_EVENT:
                            this.progressReply?.(PST_PROGRESS_EVENT, {
                                ...message.data.progressState,
                                progress: false,
                            });

                            void pstWorker.terminate().then(() => {
                                resolve(message.data.content);
                            });
                            break;
                        default:
                            break;
                    }
                });
            });
        }

        return (await ipcRenderer.invoke(
            PST_EXTRACT_EVENT,
            pstFilePath
        )) as PstContent;
    }

    public onProgress(callback: (progressState: PstProgressState) => void) {
        ipcRenderer.on(
            PST_PROGRESS_EVENT,
            (_event, ...[progressState]: [PstProgressState]) => {
                callback(progressState);
            }
        );
        ipcRenderer.send(PST_PROGRESS_SUBSCRIBE_EVENT);
    }
}
