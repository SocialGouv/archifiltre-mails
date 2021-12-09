import { useService } from "@common/modules/ContainerModule";
import type {
    PstContent,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { useEffect, useState } from "react";

import { usePathContext } from "../context/PathContext";

interface UsePSTExtractor {
    extractedFile: PstContent | undefined;
    pstProgress: PstProgressState;
}

const pstProgressInitialState: PstProgressState = {
    countAttachement: 0,
    countEmail: 0,
    countFolder: 0,
    countTotal: 0,
    elapsed: 0,
    progress: false,
};

/**
 * A hook that launch the extraction of the service and exposes PST extracted file and progress.
 *
 * @returns extracted file and progress
 */
export const usePSTExtractor = (): UsePSTExtractor => {
    const [extractedFile, setExtractedFile] = useState<PstContent>();
    const [pstProgress, setPstProgress] = useState<PstProgressState>(
        pstProgressInitialState
    );
    const { path: pstFilePath } = usePathContext();
    const pstExtractorService = useService("pstExtractorService");

    useEffect(() => {
        if (pstFilePath && pstExtractorService) {
            void (async () => {
                const [pstExtractedFile, _extractTables] =
                    await pstExtractorService.extract({
                        pstFilePath,
                    });
                setExtractedFile(pstExtractedFile);
            })();
        }
    }, [pstExtractorService, pstFilePath]);

    pstExtractorService?.onProgress(setPstProgress);

    return { extractedFile, pstProgress };
};
