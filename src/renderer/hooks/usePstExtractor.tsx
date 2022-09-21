import { useService } from "@common/modules/ContainerModule";
import type { PstProgressState } from "@common/modules/pst-extractor/type";
import { bytesToGigabytes } from "@common/utils";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { pstContentCounterPerLevelStore } from "../store/PstContentCounterPerLevelStore";
import { usePstStore } from "../store/PSTStore";
import {
    getInitialTotalAttachements,
    getInititalTotalFileSize,
} from "../utils/dashboard-viewer-dym";

interface UsePstExtractor {
    pstProgress: PstProgressState;
    setPstFilePath: Dispatch<SetStateAction<string>>;
}

const pstProgressInitialState: PstProgressState = {
    countAttachment: 0,
    countEmail: 0,
    countFolder: 0,
    countTotal: 0,
    elapsed: 0,
    progress: true,
};

/**
 * A hook that launch the extraction of the service and exposes PST extracted file and progress.
 *
 * @returns extracted file and progress
 */
export const usePstExtractor = (): UsePstExtractor => {
    const [pstFilePath, setPstFilePath] = useState<string>("");
    const [pstProgress, setPstProgress] = useState<PstProgressState>(
        pstProgressInitialState
    );
    const pstExtractorService = useService("pstExtractorService");
    const trackerService = useService("trackerService");

    const { setExtractDatas } = usePstStore();
    const { setTotalArchiveSize } = pstContentCounterPerLevelStore();

    useEffect(() => {
        if (pstFilePath && pstExtractorService && trackerService) {
            void (async () => {
                const beforeExtractTimestamp = Date.now();
                const extractDatas = await pstExtractorService.extract({
                    pstFilePath,
                });
                const loadTime = Date.now() - beforeExtractTimestamp;

                setExtractDatas(extractDatas);

                const totalMail = extractDatas.indexes.size;

                const totalAttachment = getInitialTotalAttachements(
                    extractDatas.attachments
                );

                const filesize = getInititalTotalFileSize(
                    extractDatas.attachments
                );

                setTotalArchiveSize(filesize);

                trackerService.getProvider().track("PST Dropped", {
                    attachmentCount: totalAttachment,
                    loadTime,
                    mailCount: totalMail,
                    size: bytesToGigabytes(filesize, 2),
                    sizeRaw: filesize,
                });
            })();
        }
    }, [
        pstExtractorService,
        pstFilePath,
        setExtractDatas,
        setTotalArchiveSize,
        trackerService,
    ]);

    useEffect(() => {
        pstExtractorService?.onProgress(setPstProgress);
    }, [pstExtractorService, setPstProgress]);

    return { pstProgress, setPstFilePath };
};
