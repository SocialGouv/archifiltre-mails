import {
    PST_EXTRACT_EVENT,
    PST_PROGRESS_EVENT,
    PST_PROGRESS_SUBSCRIBE_EVENT,
    PST_STOP_EXTRACT_EVENT,
} from "@common/constant/event";
import { AppError } from "@common/lib/error/AppError";
import type { Service } from "@common/modules/container/type";
import { containerModule } from "@common/modules/ContainerModule";
import type {
    ExtractOptions,
    PstContent,
    PstExtractTables,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import type { UserConfigService } from "@common/modules/UserConfigModule";
import { ipcMain } from "electron";

import { TSWorker } from "../worker";
import { MainModule } from "./MainModule";
import type {
    PstWorkerData,
    PstWorkerMessageType,
} from "./pst-extractor/pst-extractor.worker";
import {
    PST_DONE_WORKER_EVENT,
    PST_PROGRESS_WORKER_EVENT,
} from "./pst-extractor/pst-extractor.worker";

export class PstExtractorError extends AppError {}

const REGEXP_PST = /\.pst$/i;

/**
 * Module responsible of handling and extracting datas from given PST files.
 *
 * It will load a worker to extract the PST without blocking the main thread.
 */
export class PstExtractorModule extends MainModule {
    private inited = false;

    private working = false;

    private pstWorker?: TSWorker;

    private lastProgressState!: PstProgressState;

    private manuallyStoped = false;

    private lastPstExtractTables?: PstExtractTables;

    private lastContent?: PstContent;

    private lastPath = "";

    private progressReply?: (
        channel: typeof PST_PROGRESS_EVENT,
        progressState: PstProgressState
    ) => void;

    constructor(private readonly userConfigService: UserConfigService) {
        super();
        containerModule.registerService(
            "pstExtractorMainService",
            this.service
        );
    }

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        ipcMain.on(PST_PROGRESS_SUBSCRIBE_EVENT, (event) => {
            this.progressReply = event.reply as typeof this.progressReply;
        });
        ipcMain.handle(
            PST_EXTRACT_EVENT,
            async (_event, ...args: [ExtractOptions]) => {
                return this.extract(args[0]);
            }
        );
        ipcMain.handle(PST_STOP_EXTRACT_EVENT, async () => {
            await this.stop();
        });

        this.inited = true;
        return Promise.resolve();
    }

    public async uninit(): Promise<void> {
        return Promise.resolve();
    }

    private async extract(
        options: ExtractOptions
    ): Promise<[PstContent, PstExtractTables]> {
        if (this.working) {
            throw new PstExtractorError("Extractor already working.");
        }
        if (!REGEXP_PST.test(options.pstFilePath)) {
            throw new PstExtractorError(
                `Cannot extract PST from an unknown path or file. Got "${options.pstFilePath}"`
            );
        }

        if (
            // TODO: change with hash (xxhash or md5, in stream mode)
            options.pstFilePath === this.lastPath &&
            this.lastContent &&
            this.lastPstExtractTables
        ) {
            return [this.lastContent, this.lastPstExtractTables];
        }

        this.working = true;

        delete this.lastPstExtractTables;
        this.lastPath = options.pstFilePath;

        const progressReply = options.noProgress ? void 0 : this.progressReply;

        console.info("Start extracting...");
        this.pstWorker = new TSWorker(
            "modules/pst-extractor/pst-extractor.worker.ts",
            {
                stderr: true,
                trackUnmanagedFds: true,
                workerData: {
                    ...options,
                    progressInterval: this.userConfigService.get(
                        "extractProgressDelay"
                    ),
                } as PstWorkerData,
            }
        );
        return new Promise<[PstContent, PstExtractTables]>(
            (resolve, reject) => {
                this.pstWorker?.on(
                    "message",
                    (message: PstWorkerMessageType) => {
                        switch (message.event) {
                            case PST_PROGRESS_WORKER_EVENT:
                                progressReply?.(
                                    PST_PROGRESS_EVENT,
                                    (this.lastProgressState = message.data)
                                );
                                break;
                            case PST_DONE_WORKER_EVENT:
                                progressReply?.(
                                    PST_PROGRESS_EVENT,
                                    (this.lastProgressState = {
                                        ...message.data.progressState,
                                        progress: false,
                                    })
                                );

                                this.working = false;
                                [this.lastContent, this.lastPstExtractTables] =
                                    [
                                        message.data.content,
                                        message.data.pstExtractTables,
                                    ];
                                resolve([
                                    this.lastContent,
                                    this.lastPstExtractTables,
                                ]);
                                console.info("Extract done.");
                                break;
                        }
                    }
                );

                this.pstWorker?.on("error", (error) => {
                    this.working = false;
                    reject(error);
                });

                this.pstWorker?.on("exit", (exitCode) => {
                    this.working = false;
                    if (exitCode === 1) {
                        if (this.manuallyStoped) {
                            this.manuallyStoped = false;
                            reject(
                                new PstExtractorError(
                                    "Manually stoped by user."
                                )
                            );
                        } else reject("Worker stoped for unknown reason.");
                    }
                });
            }
        );
    }

    private async stop(): Promise<void> {
        this.manuallyStoped = true;
        this.progressReply?.(
            PST_PROGRESS_EVENT,
            (this.lastProgressState = {
                ...this.lastProgressState,
                progress: false,
            })
        );
        await this.pstWorker?.terminate();
    }

    public get service(): PstExtractorMainService {
        return {
            extract: this.extract.bind(this),
            name: "PstExtractorMainService",
        };
    }
}

export interface PstExtractorMainService extends Service {
    extract: typeof PstExtractorModule.prototype["extract"];
}
