import type { Service } from "@common/modules/container/type";
import { containerModule } from "@common/modules/ContainerModule";

import type { AbstractPstCache } from "./cache/AbstractPstCache";
import { ElectronStorePstCache } from "./cache/ElectronStorePstCache";
import { InMemoryPstCache } from "./cache/InMemoryPstCache";
import { LevelPstCache } from "./cache/LevelPstCache";
import { MainModule } from "./MainModule";

interface CacheType {
    file: typeof ElectronStorePstCache;
    /** @deprecated */
    inmemory: typeof InMemoryPstCache;
    localdb: typeof LevelPstCache;
}

/**
 * Module responsible of handling and extracting datas from given PST files.
 *
 * It will load a worker to extract the PST without blocking the main thread.
 */
export class CacheModule extends MainModule {
    private static cacheService: PstCacheMainService | null = null;

    constructor() {
        super();
        containerModule.registerServices([
            "pstCacheMainService",
            CacheModule.getCacheService(),
        ]);
    }

    public static getCacheService(): PstCacheMainService {
        if (!this.cacheService) {
            const cacheType = process.env.CACHE_PROVIDER as keyof CacheType;

            this.cacheService = new (class
                extends (cacheType === "localdb"
                    ? LevelPstCache
                    : cacheType === "inmemory"
                    ? InMemoryPstCache
                    : ElectronStorePstCache)
                implements Service
            {
                public name = "PstCacheMainService";

                /** @override */
                public async init(this: PstCacheMainService): pvoid {
                    await this.close();
                }

                /** @override */
                public async uninit(this: PstCacheMainService): pvoid {
                    await this.close();
                }
            })() as PstCacheMainService;
        }
        return this.cacheService;
    }

    public async init(): pvoid {
        return Promise.resolve();
    }
}

export interface PstCacheMainService extends Service, AbstractPstCache {}
