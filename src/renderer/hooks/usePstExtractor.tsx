import { useService } from "@common/modules/ContainerModule";
import type { PstProgressState } from "@common/modules/pst-extractor/type";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { setAttachmentTotal } from "../store/PstAttachmentCountStore";
import { setTotalFileSize } from "../store/PstFileSizeStore";
import { setTotalMail } from "../store/PstMailCountStore";
import { usePstStore } from "../store/PSTStore";
import {
    getInitialTotalAttachements,
    getInitialTotalMail,
    getInititalTotalFileSize,
} from "../utils/dashboard-viewer-dym";

interface UsePstExtractor {
    pstProgress: PstProgressState;
    setPstFilePath: Dispatch<SetStateAction<string>>;
}

const pstProgressInitialState: PstProgressState = {
    countAttachement: 0,
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

    const { setPstFile, setExtractTables, setPstProgressState } = usePstStore();

    useEffect(() => {
        if (pstFilePath && pstExtractorService) {
            void (async () => {
                const [pstExtractedFile, extractTables] =
                    await pstExtractorService.extract({
                        pstFilePath,
                    });

                setPstFile(pstExtractedFile);
                setExtractTables(extractTables);

                const totalMail = getInitialTotalMail(extractTables);
                setTotalMail(totalMail);

                const totalAttachments =
                    getInitialTotalAttachements(extractTables);
                setAttachmentTotal(totalAttachments);

                const totalFileSize = getInititalTotalFileSize(extractTables);
                setTotalFileSize(totalFileSize);
            })();
        }
    }, [pstExtractorService, pstFilePath, setExtractTables, setPstFile]);

    // useEffect(() => {
    //     return () => {
    //         console.log("THE USE EFFECT", {
    //             nogo:
    //                 pstProgress.progress ||
    //                 totalMailRef.current === -1 ||
    //                 totalFileSizeRef.current === -1 ||
    //                 totalAttachmentsRef.current === -1 ||
    //                 !trackerService,
    //             nogoProgress: pstProgress.progress,
    //             nogoTotalAttachmentsRef: totalAttachmentsRef.current === -1,
    //             nogoTotalFileSizeRef: totalFileSizeRef.current === -1,
    //             nogoTotalMailRef: totalMailRef.current === -1,
    //             nogoTrackerService: !trackerService,
    //             progress: pstProgress.progress,
    //             totalAttachmentsRef,
    //             totalAttachmentsRefCurrent: totalAttachmentsRef.current,
    //             totalFileSizeRef,
    //             totalFileSizeRefCurrent: totalFileSizeRef.current,
    //             totalMailRef,
    //             totalMailRefCurrent: totalMailRef.current,
    //         });
    //         if (
    //             pstProgress.progress ||
    //             totalMailRef.current === -1 ||
    //             totalFileSizeRef.current === -1 ||
    //             totalAttachmentsRef.current === -1 ||
    //             !trackerService
    //         ) {
    //             return;
    //         }

    //         trackerService.getProvider().track("PST Dropped", {
    //             attachmentCount: totalAttachmentsRef.current,
    //             loadTime: pstProgress.elapsed,
    //             mailCount: totalMailRef.current,
    //             size: bytesToGigabytes(totalFileSizeRef.current),
    //         });
    //     };
    // }, [trackerService, pstProgress, totalMailRef]);

    useEffect(() => {
        pstExtractorService?.onProgress((p) => {
            setPstProgress(p);
            if (!p.progress) {
                setPstProgressState(p);
            }
        });
    }, [pstExtractorService, setPstProgress, setPstProgressState]);

    return { pstProgress, setPstFilePath };
};
