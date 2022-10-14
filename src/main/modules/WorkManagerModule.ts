import { ipcMain } from "@common/lib/ipc";
import type { FileExporterService } from "@common/modules/FileExporterModule";
import { FileExporterError } from "@common/modules/FileExporterModule";
import type { I18nService } from "@common/modules/I18nModule";
import type { GroupType } from "@common/modules/pst-extractor/type";
import type {
    LoadWorkFunction,
    SaveWorkFunction,
} from "@common/modules/work-manager/ipc";
import {
    WORK_MANAGER_LOAD_EVENT,
    WORK_MANAGER_SAVE_EVENT,
} from "@common/modules/work-manager/ipc";
import type { WorkFile } from "@common/modules/work-manager/type";
import { ensureIncrementalFileName } from "@common/utils/fs";
import { Object } from "@common/utils/overload";
import { readFile } from "fs/promises";
import path from "path";

import { MainModule } from "./MainModule";
import type {
    PstCacheMainService,
    PstExtractorMainService,
} from "./PstExtractorModule";

export class WorkManagerModule extends MainModule {
    private inited = false;

    constructor(
        private readonly fileExporterService: FileExporterService,
        private readonly i18nService: I18nService,
        private readonly pstCacheService: PstCacheMainService,
        private readonly pstExtractorMainService: PstExtractorMainService
    ) {
        super();
    }

    public async init(): pvoid {
        if (this.inited) {
            return;
        }

        await this.i18nService.wait();
        await this.fileExporterService.wait();

        ipcMain.handle(WORK_MANAGER_LOAD_EVENT, async (_, options) => {
            return this.load(options);
        });

        ipcMain.handle(WORK_MANAGER_SAVE_EVENT, async (_, options) => {
            return this.save(options);
        });

        this.inited = true;
        return Promise.resolve();
    }

    private readonly save: SaveWorkFunction = async ({
        dest,
        uncachedAdditionalDatas,
    }) => {
        if (!this.inited) {
            // TODO change error type
            throw new FileExporterError(
                "Can't save work as the module is not inited."
            );
        }

        const destPath = await ensureIncrementalFileName(dest);

        const indexes = await this.pstCacheService.getPstMailIndexes();
        const attachments = await this.pstCacheService.getAttachments();
        const groups = await this.pstCacheService.getAllGroups();
        const additionalDatas =
            await this.pstCacheService.getAllAddtionalData();
        const obj: WorkFile = {
            additionalDatas,
            attachments: [...attachments],
            groups: Object.entries(groups).reduce(
                (acc, [key, value]) => ({ ...acc, [key]: [...value] }),
                {}
            ) as Record<GroupType, [string, string[]][]>,
            indexes: [...indexes],
            uncachedAdditionalDatas,
        };

        await this.fileExporterService.export("json", obj, destPath);
    };

    private readonly load: LoadWorkFunction = async ({ from }) => {
        if (!this.inited) {
            // TODO change error type
            throw new FileExporterError(
                "Can't load work as the module is not inited."
            );
        }

        try {
            const fileContent = await readFile(from, { encoding: "utf-8" });
            const workFile: WorkFile = JSON.parse(fileContent);
            // TODO check file content, with sha1 and version verification

            const indexes = new Map(workFile.indexes);
            const attachments = new Map(workFile.attachments);
            const groups = {} as Record<GroupType, Map<string, string[]>>;

            // TODO check that pst file exists and turn into downgraded mode if not
            const pstFilePath = path.format({
                dir: path.dirname(from),
                ext: ".pst",
                name: workFile.additionalDatas.pstFilename,
            });
            this.pstCacheService.openForPst(pstFilePath);
            // not in downgraded mode
            await this.pstExtractorMainService.openPstInWorkers({
                fetcherOnly: true,
                pstFilePath,
            });

            await this.pstCacheService.setPstMailIndexes(indexes);
            await this.pstCacheService.setAttachments(attachments);

            for (const [key, value] of Object.entries(workFile.groups)) {
                const group = new Map(value);
                groups[key] = group;
                await this.pstCacheService.setGroup(key, group);
            }

            for (const [key, value] of Object.entries(
                workFile.additionalDatas
            )) {
                await this.pstCacheService.setAddtionalDatas(key, value);
            }

            return {
                additionalDatas: workFile.additionalDatas,
                attachments,
                groups,
                indexes,
                uncachedAdditionalDatas: workFile.uncachedAdditionalDatas,
            };
        } catch (error: unknown) {
            console.error("What the actual F?");
            console.error(error);
            throw new Error(`Something went wrong during work loading.`);
        }
    };
}
