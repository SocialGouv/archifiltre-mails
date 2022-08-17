import { APP_CACHE } from "@common/config";
import type { Service } from "@common/modules/container/type";
import type {
    AdditionalDataItem,
    PstAttachment,
    PstAttachmentEntries,
    PstMailIdsEntries,
    PstMailIndex,
    PstMailIndexEntries,
} from "@common/modules/pst-extractor/type";
import type {
    AnyFunction,
    MethodNames,
    UnknownMapping,
} from "@common/utils/type";
import { Level } from "level";

const ROOT_KEY = "_index_";
const ATTACHMENTS_KEY = "_attachments_";
const GROUPS_DB_PREFIX = "_groups_";
const ADDITIONNAL_DATES_DB_PREFIX = "_additionalDatas_";

export const knownGroups = ["domain", "year", "recipient"] as const;
export type KnownGroup = typeof knownGroups[number];
export type AdditionalDatasType = "folderList";

const defaultDbOptions = {
    valueEncoding: "json",
};

const SoftLockDb = <
    TProp extends MethodNames<PstCacheService>,
    TMeth extends PstCacheService[TProp],
    TParams extends Parameters<TMeth>
>(
    target: PstCacheService,
    _property: TProp,
    descriptor: TypedPropertyDescriptor<TMeth>
) => {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
        return descriptor;
    }
    descriptor.value = (async (...args: TParams) => {
        await target.db.open();
        const ret = await (originalMethod as AnyFunction)(...args);
        try {
            return ret;
        } finally {
            await target.db.close();
        }
    }) as TMeth;

    return descriptor;
};

// eslint-disable-next-line @typescript-eslint/naming-convention -- Private
class _PstCacheService implements Service {
    public name = this.constructor.name;

    public readonly db: Level<string, unknown>;

    private currrentPstID?: string;

    constructor(private readonly cachePath = APP_CACHE()) {
        this.db = new Level(this.cachePath, defaultDbOptions);
    }

    @SoftLockDb
    public async setPstMailIndexes(indexes: Map<string, PstMailIndex>) {
        const currentDb = this.getCurrentPstDb();
        await currentDb.put(ROOT_KEY, [...indexes.entries()]);
    }

    @SoftLockDb
    public async getPstMailIndexes() {
        const currentDb = this.getCurrentPstDb();
        const rawIndexes = (await currentDb.get(
            ROOT_KEY
        )) as PstMailIndexEntries;
        return new Map(rawIndexes);
    }

    @SoftLockDb
    public async setAttachments(attachments: Map<string, PstAttachment[]>) {
        const currentDb = this.getCurrentPstDb();
        await currentDb.put(ATTACHMENTS_KEY, [...attachments.entries()]);
    }

    @SoftLockDb
    public async getAttachments() {
        const currentDb = this.getCurrentPstDb();
        const rawAttachments = (await currentDb.get(
            ATTACHMENTS_KEY
        )) as PstAttachmentEntries;
        return new Map(rawAttachments);
    }

    @SoftLockDb
    public async setGroup<T extends KnownGroup | UnknownMapping>(
        name: KnownGroup | T,
        ids: Map<string, string[]>
    ) {
        const currentGroupsDb = this.getCurrentGroupsDb();
        await currentGroupsDb.put(name, [...ids.entries()]);
    }

    @SoftLockDb
    public async getGroup<T extends KnownGroup | UnknownMapping>(
        name: KnownGroup | T
    ) {
        const currentGroupsDb = this.getCurrentGroupsDb();
        const rawIds = await currentGroupsDb.get(name);
        return new Map(rawIds);
    }

    @SoftLockDb
    public async getAllGroups() {
        const currentGroupsDb = this.getCurrentGroupsDb();
        const entries = await currentGroupsDb.iterator().all();
        return entries.reduce(
            (acc, [k, v]) => ({ ...acc, [k]: new Map(v) }),
            {} as Record<KnownGroup | UnknownMapping, Map<string, string[]>>
        );
    }

    @SoftLockDb
    public async setAddtionalDatas(
        name: AdditionalDatasType,
        addtionalDatas: AdditionalDataItem[]
    ) {
        const currentAdditionalDatasDb = this.getCurrentAdditionalDatasDb();
        await currentAdditionalDatasDb.put(name, addtionalDatas);
    }

    @SoftLockDb
    public async getAddtionalDatas(name: AdditionalDatasType) {
        const currentAdditionalDatasDb = this.getCurrentAdditionalDatasDb();
        return currentAdditionalDatasDb.get(name);
    }

    @SoftLockDb
    public async getAllAddtionalData() {
        const currentAdditionalDatasDb = this.getCurrentAdditionalDatasDb();
        const entries = await currentAdditionalDatasDb.iterator().all();
        return entries.reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v }),
            {} as Record<AdditionalDatasType, AdditionalDataItem[]>
        );
    }

    /** @override */
    public async init(): Promise<void> {
        await this.db.close();
    }

    public openForPst(pstId: string) {
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
        return this.getCurrentPstDb().sublevel<
            KnownGroup | UnknownMapping,
            PstMailIdsEntries
        >(GROUPS_DB_PREFIX, defaultDbOptions);
    }

    private getCurrentAdditionalDatasDb() {
        return this.getCurrentPstDb().sublevel<string, AdditionalDataItem[]>(
            ADDITIONNAL_DATES_DB_PREFIX,
            defaultDbOptions
        );
    }
}

export const pstCacheService = new _PstCacheService();
export type PstCacheService = _PstCacheService;
