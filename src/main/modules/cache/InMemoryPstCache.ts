import { logger } from "@common/logger";
import type {
    AdditionalDatas,
    GroupType,
    PstAttachment,
    PstAttachmentEntries,
    PstEmail,
    PstMailIndex,
    PstMailIndexEntries,
} from "@common/modules/pst-extractor/type";
import type { AnyFunction, MethodNames } from "@common/utils/type";

import {
    AbstractPstCache,
    ADDITIONNAL_DATAS_DB_PREFIX,
    ATTACHMENTS_KEY,
    GROUPS_DB_PREFIX,
    PST_FETCH_CACHE_PREFIX,
    ROOT_KEY,
} from "./AbstractPstCache";

type PstFileName = string;
type PstCacheKey = string;

// TODO make it work with shared memory between workers and main process
const cache: Map<PstFileName, Map<PstCacheKey, unknown>> = new Map();

const LogOp = <
    TProp extends MethodNames<InMemoryPstCache>,
    TMeth extends InMemoryPstCache[TProp],
    TParams extends Parameters<TMeth>
>(
    _proto: InMemoryPstCache,
    _property: TProp,
    descriptor: TypedPropertyDescriptor<TMeth>
) => {
    const originalMethod = _proto[_property];
    descriptor.value = async function (
        this: InMemoryPstCache,
        ...args: TParams
    ) {
        logger.log(`[InMemoryPstCache][LogOp][${_property}] before exec`, [
            ...(([...cache][0] ?? [])[1] ?? []),
        ]);
        const ret = await (originalMethod as AnyFunction).apply(this, args);
        logger.log(`[InMemoryPstCache][LogOp][${_property}] after exec`, {
            ret,
        });
        return ret;
    } as TMeth;
};

/**
 * @deprecated - has to be shared between worker and main before (with SharedArraybuffer maybe)
 */
export class InMemoryPstCache extends AbstractPstCache {
    @LogOp
    async getPstMailIndexes(): Promise<Map<string, PstMailIndex>> {
        const currentDb = this.getCurrentPstDb();
        const rawIndexes = currentDb.get(ROOT_KEY) as PstMailIndexEntries;
        return Promise.resolve(new Map(rawIndexes));
    }

    @LogOp
    async setPstMailIndexes(indexes: Map<string, PstMailIndex>): pvoid {
        const currentDb = this.getCurrentPstDb();
        currentDb.set(ROOT_KEY, [...indexes.entries()]);
        return Promise.resolve();
    }

    @LogOp
    async setAttachments(attachments: Map<string, PstAttachment[]>): pvoid {
        const currentDb = this.getCurrentPstDb();
        currentDb.set(ATTACHMENTS_KEY, [...attachments.entries()]);
        return Promise.resolve();
    }

    @LogOp
    async getAttachments(): Promise<Map<string, PstAttachment[]>> {
        const currentDb = this.getCurrentPstDb();
        const rawAttachments = currentDb.get(
            ATTACHMENTS_KEY
        ) as PstAttachmentEntries;
        return Promise.resolve(new Map(rawAttachments));
    }

    @LogOp
    async setGroup(name: GroupType, ids: Map<string, string[]>): pvoid {
        const currentDb = this.getCurrentPstDb();
        currentDb.set(`${GROUPS_DB_PREFIX}${name}`, [...ids.entries()]);
        return Promise.resolve();
    }

    @LogOp
    async getGroup(name: GroupType): Promise<Map<string, string[]>> {
        const currentDb = this.getCurrentPstDb();
        const rawIds = currentDb.get(`${GROUPS_DB_PREFIX}${name}`) as [
            string,
            string[]
        ][];
        return Promise.resolve(new Map(rawIds));
    }

    @LogOp
    async getAllGroups(): Promise<Record<GroupType, Map<string, string[]>>> {
        const currentDb = this.getCurrentPstDb();
        const entries = [...currentDb.entries()].filter(([key]) =>
            key.startsWith(GROUPS_DB_PREFIX)
        );

        return Promise.resolve(
            entries.reduce(
                (acc, [k, v]) => ({
                    ...acc,
                    [k]: new Map(v as [string, string[]][]),
                }),
                {}
            ) as Record<GroupType, Map<string, string[]>>
        );
    }

    @LogOp
    async setAddtionalDatas<T extends keyof AdditionalDatas>(
        name: T,
        addtionalDatas: AdditionalDatas[T]
    ): pvoid {
        const currentDb = this.getCurrentPstDb();
        currentDb.set(`${ADDITIONNAL_DATAS_DB_PREFIX}${name}`, addtionalDatas);
        return Promise.resolve();
    }

    @LogOp
    async getAddtionalDatas<T extends keyof AdditionalDatas>(
        name: T
    ): Promise<AdditionalDatas[T]> {
        const currentDb = this.getCurrentPstDb();
        return Promise.resolve(currentDb.get(name) as AdditionalDatas[T]);
    }

    @LogOp
    async getAllAddtionalData(): Promise<AdditionalDatas> {
        const currentDb = this.getCurrentPstDb();
        const entries = [...currentDb.entries()].filter(([key]) =>
            key.startsWith(ADDITIONNAL_DATAS_DB_PREFIX)
        );

        return Promise.resolve(
            entries.reduce(
                (acc, [k, v]) => ({
                    ...acc,
                    [k]: new Map(v as [string, unknown][]),
                }),
                {}
            ) as AdditionalDatas
        );
    }

    @LogOp
    async setTempEmails(cacheKey: string, emails: PstEmail[]): pvoid {
        const currentDb = this.getCurrentPstDb();
        currentDb.set(`${PST_FETCH_CACHE_PREFIX}${cacheKey}`, emails);
        return Promise.resolve();
    }

    @LogOp
    async getTempEmails(cacheKey: string): Promise<PstEmail[]> {
        const currentDb = this.getCurrentPstDb();
        const ret = (await currentDb.get(
            `${PST_FETCH_CACHE_PREFIX}${cacheKey}`
        )) as PstEmail[];
        currentDb.delete(`${PST_FETCH_CACHE_PREFIX}${cacheKey}`);
        return Promise.resolve(ret);
    }

    public async close(): pvoid {
        logger.log(`[InMemoryPstCache] close (useless)`);
        return Promise.resolve();
    }

    private getCurrentPstDb() {
        if (!this.currentPstID) throw new Error("No PST cache opened yet.");
        if (!cache.has(this.currentPstID)) {
            cache.set(this.currentPstID, new Map());
        }
        return cache.get(this.currentPstID)!;
    }
}
