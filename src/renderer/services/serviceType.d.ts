import type { PstExporterService } from "./PstExporterService";
import type { PstExtractorService } from "./PstExtractorService";

// add "renderer-only" services for autocomplete
declare module "@common/modules/container/type" {
    interface ServicesKeyType {
        pstExporterService: PstExporterService;
        pstExtractorService: PstExtractorService;
    }
}
