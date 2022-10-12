import { APP_CACHE } from "@common/config";
import { logger } from "@common/logger";
import type {
    AdditionalDatas,
    GroupType,
    PstAttachment,
    PstEmail,
    PstMailIndex,
} from "@common/modules/pst-extractor/type";

export const ROOT_KEY = "_index_";
export const ATTACHMENTS_KEY = "_attachments_";
export const GROUPS_DB_PREFIX = "_groups_";
export const ADDITIONNAL_DATAS_DB_PREFIX = "_additionalDatas_";
export const PST_FETCH_CACHE_PREFIX = "_pstFetchCache_";

export abstract class AbstractPstCache {
    protected currentPstID?: string;

    constructor(protected readonly cachePath = APP_CACHE()) {
        logger.log(`[${this.constructor.name}] constructor`);
    }

    public openForPst(pstId: string): void {
        this.currentPstID = pstId;
    }

    abstract close(): pvoid;

    abstract getAddtionalDatas<T extends keyof AdditionalDatas>(
        name: T
    ): Promise<AdditionalDatas[T]>;

    abstract getAllAddtionalData(): Promise<AdditionalDatas>;

    abstract getAllGroups(): Promise<Record<GroupType, Map<string, string[]>>>;

    abstract getAttachments(): Promise<Map<string, PstAttachment[]>>;

    abstract getGroup(name: GroupType): Promise<Map<string, string[]>>;

    abstract getPstMailIndexes(): Promise<Map<string, PstMailIndex>>;

    abstract getTempEmails(cacheKey: string): Promise<PstEmail[]>;

    abstract setAddtionalDatas<T extends keyof AdditionalDatas>(
        name: T,
        addtionalDatas: AdditionalDatas[T]
    ): pvoid;

    abstract setAttachments(attachments: Map<string, PstAttachment[]>): pvoid;

    abstract setGroup(name: GroupType, ids: Map<string, string[]>): pvoid;

    abstract setPstMailIndexes(indexes: Map<string, PstMailIndex>): pvoid;

    abstract setTempEmails(cacheKey: string, emails: PstEmail[]): pvoid;
}
