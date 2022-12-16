import { logger } from "@common/logger";
import type {
    AdditionalDatas,
    GroupType,
    PstAttachment,
    PstAttachmentEntries,
    PstEmail,
    PstMailIdsEntries,
    PstMailIndex,
    PstMailIndexEntries,
} from "@common/modules/pst-extractor/type";
import type { ViewType } from "@common/modules/views/setup";
import type { AnyFunction, MethodNames } from "@common/utils/type";
import { ClassicLevel as Level } from "classic-level";
import path from "path";

import {
    AbstractPstCache,
    ADDITIONNAL_DATAS_DB_PREFIX,
    ATTACHMENTS_KEY,
    GROUPS_DB_PREFIX,
    PST_FETCH_CACHE_PREFIX,
    ROOT_KEY,
} from "./AbstractPstCache";

const CACHE_FOLDER_NAME = "archimail-db";

const defaultDbOptions = {
    valueEncoding: "json",
};

const SoftLockDb = <
    TProp extends MethodNames<LevelPstCache>,
    TMeth extends LevelPstCache[TProp],
    TParams extends Parameters<TMeth>
>(
    _proto: LevelPstCache,
    _property: TProp,
    descriptor: TypedPropertyDescriptor<TMeth>
) => {
    const originalMethod = _proto[_property];
    descriptor.value = async function (this: LevelPstCache, ...args: TParams) {
        logger.debug(`[PstCache][SoftLockDb][${_property}] before open`);
        await this.db.open();
        logger.debug(
            `[PstCache][SoftLockDb][${_property}] after open`,
            this.db
        );
        const ret = await (originalMethod as AnyFunction).apply(this, args);
        logger.debug(`[PstCache][SoftLockDb][${_property}] after exec`, {
            ret,
        });
        await this.db.close();
        logger.debug(
            `[PstCache][SoftLockDb][${_property}] after close`,
            this.db
        );
        return ret;
    } as TMeth;
};

export class LevelPstCache extends AbstractPstCache {
    public readonly db: Level<string, unknown>;

    constructor(cachePath?: string) {
        super(cachePath);
        logger.debug("[PstCache] constructor", { cachePath });
        this.db = new Level(
            path.resolve(this.cachePath, CACHE_FOLDER_NAME),
            defaultDbOptions
        );
        logger.debug("[PstCache] DB", {
            db: this.db,
            status: this.db.status,
        });
    }

    @SoftLockDb
    public async setPstMailIndexes(indexes: Map<string, PstMailIndex>): pvoid {
        const currentDb = this.getCurrentPstDb();
        await currentDb.put(ROOT_KEY, [...indexes.entries()]);
    }

    @SoftLockDb
    public async getPstMailIndexes(): Promise<Map<string, PstMailIndex>> {
        const currentDb = this.getCurrentPstDb();
        const rawIndexes = (await currentDb.get(
            ROOT_KEY
        )) as PstMailIndexEntries;
        return new Map(rawIndexes);
    }

    @SoftLockDb
    public async setAttachments(
        attachments: Map<string, PstAttachment[]>
    ): pvoid {
        const currentDb = this.getCurrentPstDb();
        await currentDb.put(ATTACHMENTS_KEY, [...attachments.entries()]);
    }

    @SoftLockDb
    public async getAttachments(): Promise<Map<string, PstAttachment[]>> {
        const currentDb = this.getCurrentPstDb();
        const rawAttachments = (await currentDb.get(
            ATTACHMENTS_KEY
        )) as PstAttachmentEntries;
        return new Map(rawAttachments);
    }

    @SoftLockDb
    public async setGroup(name: GroupType, ids: Map<string, string[]>): pvoid {
        const currentGroupsDb = this.getCurrentGroupsDb();
        await currentGroupsDb.put(name, [...ids.entries()]);
    }

    @SoftLockDb
    public async getGroup(name: GroupType): Promise<Map<string, string[]>> {
        const currentGroupsDb = this.getCurrentGroupsDb();
        const rawIds = await currentGroupsDb.get(name);
        return new Map(rawIds);
    }

    @SoftLockDb
    public async getAllGroups(): Promise<
        Record<GroupType, Map<string, string[]>>
    > {
        const currentGroupsDb = this.getCurrentGroupsDb();
        const entries = await currentGroupsDb.iterator().all();
        return entries.reduce(
            (acc, [k, v]) => ({ ...acc, [k]: new Map(v) }),
            {} as Record<GroupType, Map<string, string[]>>
        );
    }

    @SoftLockDb
    public async setAddtionalDatas<T extends keyof AdditionalDatas>(
        name: T,
        addtionalDatas: AdditionalDatas[T]
    ): pvoid {
        const currentAdditionalDatasDb = this.getCurrentAdditionalDatasDb();
        await currentAdditionalDatasDb.put(name, addtionalDatas);
    }

    @SoftLockDb
    public async getAddtionalDatas<T extends keyof AdditionalDatas>(
        name: T
    ): Promise<AdditionalDatas[T]> {
        const currentAdditionalDatasDb = this.getCurrentAdditionalDatasDb<T>();
        return currentAdditionalDatasDb.get(name);
    }

    @SoftLockDb
    public async getAllAddtionalData(): Promise<AdditionalDatas> {
        const currentAdditionalDatasDb = this.getCurrentAdditionalDatasDb();
        const entries = await currentAdditionalDatasDb.iterator().all();
        return entries.reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v }),
            {} as AdditionalDatas
        );
    }

    @SoftLockDb
    public async setTempEmails(cacheKey: string, emails: PstEmail[]): pvoid {
        const currentPstFetchCacheDb = this.getCurrentPstFetchCacheDb();
        await currentPstFetchCacheDb.put(cacheKey, emails);
    }

    @SoftLockDb
    public async getTempEmails(cacheKey: string): Promise<PstEmail[]> {
        const currentPstFetchCacheDb = this.getCurrentPstFetchCacheDb();
        const ret = await currentPstFetchCacheDb.get(cacheKey);
        await currentPstFetchCacheDb.del(cacheKey);
        return ret;
    }

    public async close(): pvoid {
        return this.db.close();
    }

    private getCurrentPstDb() {
        if (!this.currentPstID) throw new Error("No PST cache opened yet.");
        return this.db.sublevel<string, unknown>(
            this.currentPstID,
            defaultDbOptions
        );
    }

    private getCurrentGroupsDb() {
        return this.getCurrentPstDb().sublevel<ViewType, PstMailIdsEntries>(
            GROUPS_DB_PREFIX,
            defaultDbOptions
        );
    }

    private getCurrentAdditionalDatasDb<T extends keyof AdditionalDatas>() {
        return this.getCurrentPstDb().sublevel<T, AdditionalDatas[T]>(
            ADDITIONNAL_DATAS_DB_PREFIX,
            defaultDbOptions
        );
    }

    private getCurrentPstFetchCacheDb() {
        return this.getCurrentPstDb().sublevel<string, PstEmail[]>(
            PST_FETCH_CACHE_PREFIX,
            defaultDbOptions
        );
    }
}
