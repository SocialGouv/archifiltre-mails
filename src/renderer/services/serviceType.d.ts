import type { PstExtractorService } from "./PstExtractorService";

// add "renderer-only" services for autocomplete
declare module "@common/modules/container/type" {
    interface ServicesKeyType {
        pstExtractorService: PstExtractorService;
    }
}
