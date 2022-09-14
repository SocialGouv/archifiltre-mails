import { useService } from "@common/modules/ContainerModule";
import type { PstProgressState } from "@common/modules/pst-extractor/type";
import { bytesToGigabytes } from "@common/utils";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { setTotalAttachment } from "../store/PstAttachmentCountStore";
import { setTotalFileSize } from "../store/PstFileSizeStore";
import { setTotalMail } from "../store/PstMailCountStore";
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
                setTotalMail(totalMail);

                const totalAttachments = getInitialTotalAttachements(
                    extractDatas.attachments
                );
                setTotalAttachment(totalAttachments);

                const totalFileSize = getInititalTotalFileSize(
                    extractDatas.attachments
                );
                setTotalFileSize(totalFileSize);

                trackerService.getProvider().track("PST Dropped", {
                    attachmentCount: totalAttachments,
                    loadTime,
                    mailCount: totalMail,
                    size: bytesToGigabytes(totalFileSize, 2),
                    sizeRaw: totalFileSize,
                });
            })();
        }
    }, [pstExtractorService, pstFilePath, setExtractDatas, trackerService]);

    useEffect(() => {
        pstExtractorService?.onProgress(setPstProgress);
    }, [pstExtractorService, setPstProgress]);

    return { pstProgress, setPstFilePath };
};
