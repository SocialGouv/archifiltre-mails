import type { PstExporterService } from "./PstExporterService";
import type { PstExtractorService } from "./PstExtractorService";
import type { WorkManagerService } from "./WorkManagerService";

// add "renderer-only" services for autocomplete
declare module "@common/modules/container/type" {
    interface ServicesKeyType {
        pstExporterService: PstExporterService;
        pstExtractorService: PstExtractorService;
        workManagerService: WorkManagerService;
    }
}
