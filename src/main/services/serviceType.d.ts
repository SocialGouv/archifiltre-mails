import type { MainWindowRetriever } from "..";
import type { PstExtractorMainService } from "../modules/PstExtractorModule";
import type { ConsoleToRendererService } from "./ConsoleToRendererService";

// add "main-only" services for autocomplete
declare module "@common/modules/container/type" {
    export interface ServicesKeyType {
        consoleToRendererService: ConsoleToRendererService;
        pstExtractorMainService: PstExtractorMainService;
        mainWindowRetriever: MainWindowRetriever;
    }
}
