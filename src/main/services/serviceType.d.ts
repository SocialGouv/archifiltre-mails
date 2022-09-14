import type { MainWindowRetriever } from "..";
import type {
    PstCacheMainService,
    PstExtractorMainService,
} from "../modules/PstExtractorModule";
import type { ConsoleToRendererService } from "./ConsoleToRendererService";

// add "main-only" services for autocomplete
declare module "@common/modules/container/type" {
    interface ServicesKeyType {
        consoleToRendererService: ConsoleToRendererService;
        mainWindowRetriever: MainWindowRetriever;
        pstCacheMainService: PstCacheMainService;
        pstExtractorMainService: PstExtractorMainService;
    }
}
