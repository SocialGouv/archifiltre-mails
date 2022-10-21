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
import { Object } from "@common/utils/overload";
import type { SimpleObject } from "@common/utils/type";
import Store from "electron-store";

import {
    AbstractPstCache,
    ADDITIONNAL_DATAS_DB_PREFIX,
    ATTACHMENTS_KEY,
    GROUPS_DB_PREFIX,
    PST_FETCH_CACHE_PREFIX,
    ROOT_KEY,
} from "./AbstractPstCache";

type CacheStore = SimpleObject<SimpleObject>;

export class ElectronStorePstCache extends AbstractPstCache {
    private readonly store = new Store<CacheStore>({
        accessPropertiesByDotNotation: false,
        cwd: this.cachePath,
        name: "file-db",
    });

    constructor(cachePath?: string) {
        super(cachePath);

        logger.debug("[ElectronStorePstCache]", { store: this.store });
    }

    async setPstMailIndexes(indexes: Map<string, PstMailIndex>): pvoid {
        this.setValue(ROOT_KEY, [...indexes.entries()]);
        return Promise.resolve();
    }

    async getPstMailIndexes(): Promise<Map<string, PstMailIndex>> {
        const rawIndexes = this.getValue(ROOT_KEY) as PstMailIndexEntries;
        return Promise.resolve(new Map(rawIndexes));
    }

    async setAttachments(attachments: Map<string, PstAttachment[]>): pvoid {
        this.setValue(ATTACHMENTS_KEY, [...attachments.entries()]);
        return Promise.resolve();
    }

    async getAttachments(): Promise<Map<string, PstAttachment[]>> {
        const rawAttachments = this.getValue(
            ATTACHMENTS_KEY
        ) as PstAttachmentEntries;
        return Promise.resolve(new Map(rawAttachments));
    }

    async setGroup(name: GroupType, ids: Map<string, string[]>): pvoid {
        this.setValue(`${GROUPS_DB_PREFIX}${name}`, [...ids.entries()]);
        return Promise.resolve();
    }

    async getGroup(name: GroupType): Promise<Map<string, string[]>> {
        const rawIds = this.getValue(`${GROUPS_DB_PREFIX}${name}`) as [
            string,
            string[]
        ][];
        return Promise.resolve(new Map(rawIds));
    }

    async getAllGroups(): Promise<Record<GroupType, Map<string, string[]>>> {
        const currentDb = this.getCurrentPstDb();
        const entries = Object.entries(currentDb)
            .filter(([key]) => key.startsWith(GROUPS_DB_PREFIX))
            .map(([key, value]) => [
                key.replace(GROUPS_DB_PREFIX, ""),
                value,
            ]) as [string, unknown][];

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

    async setAddtionalDatas<T extends keyof AdditionalDatas>(
        name: T,
        addtionalDatas: AdditionalDatas[T]
    ): pvoid {
        this.setValue(`${ADDITIONNAL_DATAS_DB_PREFIX}${name}`, addtionalDatas);
        return Promise.resolve();
    }

    async getAddtionalDatas<T extends keyof AdditionalDatas>(
        name: T
    ): Promise<AdditionalDatas[T]> {
        return Promise.resolve(
            this.getValue(
                `${ADDITIONNAL_DATAS_DB_PREFIX}${name}`
            ) as AdditionalDatas[T]
        );
    }

    async getAllAddtionalData(): Promise<AdditionalDatas> {
        const currentDb = this.getCurrentPstDb();
        const entries = Object.entries(currentDb)
            .filter(([key]) => key.startsWith(ADDITIONNAL_DATAS_DB_PREFIX))
            .map(([key, value]) => [
                key.replace(ADDITIONNAL_DATAS_DB_PREFIX, ""),
                value,
            ]);

        return Promise.resolve(
            Object.fromEntries(entries) as unknown as AdditionalDatas
        );
    }

    async setTempEmails(cacheKey: string, emails: PstEmail[]): pvoid {
        this.setValue(`${PST_FETCH_CACHE_PREFIX}${cacheKey}`, emails);
        return Promise.resolve();
    }

    async getTempEmails(cacheKey: string): Promise<PstEmail[]> {
        const ret = this.getValue(
            `${PST_FETCH_CACHE_PREFIX}${cacheKey}`,
            true
        ) as PstEmail[];
        return Promise.resolve(ret);
    }

    public async close(): pvoid {
        logger.log(`[ElectronStorePstCache] close (useless)`);
        return Promise.resolve();
    }

    private getCurrentPstDb() {
        if (!this.currentPstID) throw new Error("No PST cache opened yet.");
        if (!this.store.has(this.currentPstID)) {
            this.store.set(this.currentPstID, {});
        }
        return this.store.get(this.currentPstID)!;
    }

    private getValue(key: string, deleteValue?: true) {
        const cache = this.getCurrentPstDb();
        const ret = cache[key];
        if (deleteValue) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete cache[key];
            this.store.set(this.currentPstID!, cache);
        }
        return ret;
    }

    private setValue(key: string, value: unknown) {
        const cache = this.getCurrentPstDb();
        cache[key] = value;
        this.store.set(this.currentPstID!, cache);
    }
}
