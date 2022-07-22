import {
    PST_EXTRACT_EVENT,
    PST_GET_EMAIL_EVENT,
    PST_PROGRESS_EVENT,
    PST_PROGRESS_SUBSCRIBE_EVENT,
    PST_STOP_EXTRACT_EVENT,
} from "@common/constant/event";
import { AppError } from "@common/lib/error/AppError";
import type { Service } from "@common/modules/container/type";
import { containerModule } from "@common/modules/ContainerModule";
import type {
    ExtractOptions,
    PstAttachmentEntries,
    PstEmail,
    PstExtractDatas,
    PstMailIdsEntries,
    PstMailIndexEntries,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import type { UserConfigService } from "@common/modules/UserConfigModule";
import { app, BrowserWindow, ipcMain } from "electron";
import { Level } from "level";

import type { ConsoleToRendererService } from "../services/ConsoleToRendererService";
import { TSWorker } from "../worker";
import { MainModule } from "./MainModule";
import type {
    PstEmailWorkerData,
    PstEmailWorkerMessageType,
} from "./pst-extractor/pst-email-fetcher.worker";
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

    private pstEmailWorker?: TSWorker;

    private lastProgressState!: PstProgressState;

    private manuallyStoped = false;

    private lastPstExtractDatas?: PstExtractDatas;

    private lastPath = "";

    private progressReply?: (
        channel: typeof PST_PROGRESS_EVENT,
        progressState: PstProgressState
    ) => void;

    constructor(
        private readonly userConfigService: UserConfigService,
        private readonly consoleToRendererService: ConsoleToRendererService
    ) {
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
        ipcMain.handle(
            PST_GET_EMAIL_EVENT,
            async (_event, ...args: [number[]]) => {
                return this.getEmail(args[0]);
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

    private async extract(options: ExtractOptions): Promise<PstExtractDatas> {
        if (this.working) {
            throw new PstExtractorError("Extractor already working.");
        }

        if (!REGEXP_PST.test(options.pstFilePath)) {
            throw new PstExtractorError(
                `Cannot extract PST from an unknown path or file. Got "${options.pstFilePath}"`
            );
        }

        if (options.pstFilePath === this.lastPath && this.lastPstExtractDatas) {
            return this.lastPstExtractDatas;
        }

        this.working = true;

        delete this.lastPstExtractDatas;
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
                    cachePath: app.getPath("cache"),
                    progressInterval: this.userConfigService.get(
                        "extractProgressDelay"
                    ),
                } as PstWorkerData,
            }
        );
        return new Promise<PstExtractDatas>((resolve, reject) => {
            this.pstWorker?.on("message", (message: PstWorkerMessageType) => {
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

                        void (async () => {
                            const db = new Level<string, PstMailIndexEntries>(
                                "/Users/lsagetlethias/source/SocialGouv/archimail/db",
                                { valueEncoding: "json" }
                            );

                            const idDb = db.sublevel<string, PstMailIdsEntries>(
                                "ids",
                                {
                                    valueEncoding: "json",
                                }
                            );
                            const attachmentDb = db.sublevel<
                                string,
                                PstAttachmentEntries
                            >("attachment", {
                                valueEncoding: "json",
                            });
                            const baseRawData = await db.get("index");
                            const domainRawData = await idDb.get("domain");
                            const yearRawData = await idDb.get("year");
                            const recipientRawData = await idDb.get(
                                "recipient"
                            );
                            const attachmentRawData = await attachmentDb.get(
                                "_"
                            );
                            this.consoleToRendererService.log(
                                BrowserWindow.getAllWindows()[0]!,
                                {
                                    attachmentRawData,
                                    baseRawData,
                                    domainRawData,
                                    recipientRawData,
                                    yearRawData,
                                }
                            );
                            this.lastPstExtractDatas = {
                                attachments: new Map(attachmentRawData),
                                domain: new Map(domainRawData),
                                indexes: new Map(baseRawData),
                                recipient: new Map(recipientRawData),
                                year: new Map(yearRawData),
                            };
                            await db.close();
                            this.working = false;
                            resolve(this.lastPstExtractDatas);
                            console.info("Extract done.");
                        })();

                        break;
                }
            });

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
                            new PstExtractorError("Manually stoped by user.")
                        );
                    } else reject("Worker stoped for unknown reason.");
                }
            });
        });
    }

    private async getEmail(emailIndex: number[]): Promise<PstEmail> {
        if (this.working) {
            throw new PstExtractorError("Extractor already working.");
        }
        console.info("Start fetching email...");
        this.pstEmailWorker = new TSWorker(
            "modules/pst-extractor/pst-email-fetcher.worker.ts",
            {
                stderr: true,
                trackUnmanagedFds: true,
                workerData: {
                    emailIndex,
                    pstFilePath: this.lastPath,
                } as PstEmailWorkerData,
            }
        );

        return new Promise<PstEmail>((resolve, reject) => {
            this.pstEmailWorker?.on(
                "message",
                (message: PstEmailWorkerMessageType) => {
                    this.working = false;
                    resolve(message.data.email);
                    console.log("Fetching done");
                }
            );

            this.pstWorker?.on("error", (error) => {
                this.working = false;
                reject(error);
            });

            this.pstWorker?.on("exit", (exitCode) => {
                this.working = false;
                if (exitCode === 1) {
                    reject("Worker stoped for unknown reason.");
                }
            });
        });
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
            getEmail: this.getEmail.bind(this),
            name: "PstExtractorMainService",
        };
    }
}

export interface PstExtractorMainService extends Service {
    extract: typeof PstExtractorModule.prototype["extract"];
    getEmail: typeof PstExtractorModule.prototype["getEmail"];
}
