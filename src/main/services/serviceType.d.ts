import type { MainWindowRetriever } from "..";
import type { PstCacheMainService } from "../modules/CacheModule";
import type { PstExtractorMainService } from "../modules/PstExtractorModule";

// add "main-only" services for autocomplete
declare module "@common/modules/container/type" {
    interface ServicesKeyType {
        mainWindowRetriever: MainWindowRetriever;
        pstCacheMainService: PstCacheMainService;
        pstExtractorMainService: PstExtractorMainService;
    }
}
