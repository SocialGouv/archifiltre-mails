import { APP_CACHE } from "@common/config";
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
import { Level } from "level";
import path from "path";

const ROOT_KEY = "_index_";
const ATTACHMENTS_KEY = "_attachments_";
const GROUPS_DB_PREFIX = "_groups_";
const ADDITIONNAL_DATES_DB_PREFIX = "_additionalDatas_";
const PST_FETCH_CACHE_PREFIX = "_pstFetchCache_";
const CACHE_FOLDER_NAME = "archimail-db";

const defaultDbOptions = {
    valueEncoding: "json",
};

const SoftLockDb = <
    TProp extends MethodNames<PstCache>,
    TMeth extends PstCache[TProp],
    TParams extends Parameters<TMeth>
>(
    _proto: PstCache,
    _property: TProp,
    descriptor: TypedPropertyDescriptor<TMeth>
) => {
    const originalMethod = _proto[_property];
    descriptor.value = async function (this: PstCache, ...args: TParams) {
        await this.db.open();
        const ret = await (originalMethod as AnyFunction).apply(this, args);
        await this.db.close();
        return ret;
    } as TMeth;
};

export class PstCache {
    public readonly db: Level<string, unknown>;

    private currrentPstID?: string;

    constructor(
        private readonly cachePath = path.resolve(
            APP_CACHE(),
            CACHE_FOLDER_NAME
        )
    ) {
        this.db = new Level(this.cachePath, defaultDbOptions);
        // if (IS_DEV) {
        //     void this.db.clear();
        // }
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

    public openForPst(pstId: string): void {
        this.currrentPstID = pstId;
    }

    private getCurrentPstDb() {
        if (!this.currrentPstID) throw new Error("No PST cache opened yet.");
        return this.db.sublevel<string, unknown>(
            this.currrentPstID,
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
            ADDITIONNAL_DATES_DB_PREFIX,
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
