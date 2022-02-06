import type { OpenDialogService } from "./OpenDialogService";
import type { PstExtractorService } from "./PstExtractorService";

// add "renderer-only" services for autocomplete
declare module "@common/modules/container/type" {
    export interface ServicesKeyType {
        pstExtractorService: PstExtractorService;
        openDialogService: OpenDialogService;
    }
}
