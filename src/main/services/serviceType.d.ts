import type { PstExtractorMainService } from "../modules/PstExtractorModule";
import type { ConsoleToRenderService } from "./ConsoleToRenderService";

// add "main-only" services for autocomplete
declare module "@common/modules/container/type" {
    export interface ServicesKeyType {
        consoleToRenderService: ConsoleToRenderService;
        pstExtractorMainService: PstExtractorMainService;
    }
}
