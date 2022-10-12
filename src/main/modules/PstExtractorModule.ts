import { AppError } from "@common/lib/error/AppError";
import { ipcMain } from "@common/lib/ipc";
import type { DualIpcConfigExtractReply } from "@common/lib/ipc/event";
import { logger } from "@common/logger";
import type { Service } from "@common/modules/container/type";
import { containerModule } from "@common/modules/ContainerModule";
import type {
    ExtractOptions,
    PstEmail,
    PstExtractDatas,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import type { UserConfigService } from "@common/modules/UserConfigModule";

import { WorkerClient } from "../workers/WorkerClient";
import type { PstCacheMainService } from "./CacheModule";
import { MainModule } from "./MainModule";
import type { FetchWorkerConfig } from "./pst-extractor/pst-email-fetcher.worker";
import type { ExtractorWorkerConfig } from "./pst-extractor/pst-extractor.worker";

export class PstExtractorError extends AppError {}

const REGEXP_PST = /\.pst$/i;

type ProgressReplyFunction =
    DualIpcConfigExtractReply<"pstExtractor.event.progressSuscribe">;

/**
 * Module responsible of handling and extracting datas from given PST files.
 *
 * It will load a worker to extract the PST without blocking the main thread.
 */
export class PstExtractorModule extends MainModule {
    private inited = false;

    private working = false;

    private lastProgressState!: PstProgressState;

    private lastPstExtractDatas?: PstExtractDatas;

    private lastPath = "";

    private readonly fetchWorker = new WorkerClient<FetchWorkerConfig>(
        "modules/pst-extractor/pst-email-fetcher.worker.ts"
    );

    private readonly extractorWorker = new WorkerClient<ExtractorWorkerConfig>(
        "modules/pst-extractor/pst-extractor.worker.ts"
    );

    private progressReply?: ProgressReplyFunction;

    constructor(
        private readonly userConfigService: UserConfigService,
        private readonly cacheService: PstCacheMainService
    ) {
        super();
        containerModule.registerServices([
            "pstExtractorMainService",
            this.extractorService,
        ]);
    }

    public async init(): pvoid {
        if (this.inited) {
            return;
        }

        ipcMain.on("pstExtractor.event.progressSuscribe", (event) => {
            this.progressReply = event.reply;
        });
        ipcMain.handle(
            "pstExtractor.event.extract",
            async (_event, options) => {
                return this.extract(options);
            }
        );
        ipcMain.handle(
            "pstExtractor.event.getEmails",
            async (_event, indexes) => {
                return this.getEmails(indexes);
            }
        );
        ipcMain.handle("pstExtractor.event.stopExtract", async () => {
            await this.stop();
        });

        this.extractorWorker.addEventListener("progress", (progressState) => {
            this.progressReply?.(
                "pstExtractor.event.progress",
                (this.lastProgressState = progressState)
            );
        });
        this.extractorWorker.addEventListener("done", (progressState) => {
            this.progressReply?.(
                "pstExtractor.event.progress",
                (this.lastProgressState = {
                    ...progressState,
                    progress: false,
                })
            );
        });
        this.extractorWorker.addEventListener("error", (error) => {
            logger.log("[PstExtractorModule] extractorWorker Error");
            logger.error(error); // TODO handle error
        });

        this.fetchWorker.addEventListener("error", (error) => {
            logger.log("[PstExtractorModule] fetchWorker Error");
            logger.error(error); // TODO handle error
        });

        this.fetchWorker.addEventListener("log", (message) => {
            logger.log(`[FROM FETCHWORKER] ${message}`);
        });

        this.inited = true;
        return Promise.resolve();
    }

    public async uninit(): pvoid {
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

        logger.info("Start extracting...");
        await Promise.all([
            this.fetchWorker.command("open", {
                pstFilePath: this.lastPath,
            }),
            this.extractorWorker.command("open", {
                pstFilePath: this.lastPath,
            }),
        ]);

        await this.extractorWorker.command("extract", {
            progressInterval: this.userConfigService.get(
                "extractProgressDelay"
            ),
            viewConfigs: this.userConfigService.get("viewConfigs"),
        });

        // TODO: hash instead
        this.cacheService.openForPst(this.lastPath);

        const attachments = await this.cacheService.getAttachments();
        const indexes = await this.cacheService.getPstMailIndexes();
        const groups = await this.cacheService.getAllGroups();
        const additionalDatas = await this.cacheService.getAllAddtionalData();
        logger.log({
            additionalDatas,
            attachments,
            groups,
            indexes,
        });
        this.lastPstExtractDatas = {
            additionalDatas,
            attachments,
            groups,
            indexes,
        };

        this.working = false;
        logger.info("Extract done.");
        return this.lastPstExtractDatas;
    }

    private async getEmails(emailIndexes: number[][]): Promise<PstEmail[]> {
        if (this.working) {
            throw new PstExtractorError("Extractor already working.");
        }
        logger.info("Start fetching emails...");
        const cacheKey = await this.fetchWorker.query("fetch", {
            emailIndexes,
        });

        const emails = await this.cacheService.getTempEmails(cacheKey);
        logger.log("Fetching done");
        if (!emails.length) {
            throw new Error("Emails not found from given indexes.");
        }
        return emails;
    }

    private async stop(): pvoid {
        this.progressReply?.(
            "pstExtractor.event.progress",
            (this.lastProgressState = {
                ...this.lastProgressState,
                progress: false,
            })
        );

        // TODO: this.extractorWorker.command("stop");
        // TODO: this.fetchWorker.command("stop");
        return Promise.resolve();
    }

    public get extractorService(): PstExtractorMainService {
        return {
            extract: this.extract.bind(this),
            getEmails: this.getEmails.bind(this),
            name: "PstExtractorMainService",
        };
    }
}

export interface PstExtractorMainService extends Service {
    extract: typeof PstExtractorModule.prototype["extract"];
    getEmails: typeof PstExtractorModule.prototype["getEmails"];
}
