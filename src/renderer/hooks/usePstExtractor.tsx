import { useService } from "@common/modules/ContainerModule";
import type {
    PstExtractDatas,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { bytesToGigabytes } from "@common/utils";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { pstContentCounterPerLevelStore } from "../store/PstContentCounterPerLevelStore";
import { usePstStore } from "../store/PSTStore";
import { setDeletedFolderId, setMailBoxOwnerId } from "../store/SynthesisStore";
import { tagManagerStore } from "../store/TagManagerStore";
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
    const workManagerService = useService("workManagerService");
    const trackerService = useService("trackerService");

    const { setExtractDatas } = usePstStore();
    const { setTotalArchiveSize } = pstContentCounterPerLevelStore();
    const { setTaggedNodesFromWorkLoading } = tagManagerStore();

    useEffect(() => {
        if (
            pstFilePath &&
            workManagerService &&
            pstExtractorService &&
            trackerService
        ) {
            void (async () => {
                const beforeExtractTimestamp = Date.now();
                let extractDatas = {} as PstExtractDatas;
                console.log("DROP", pstFilePath);
                if (pstFilePath.endsWith(".json")) {
                    const { uncachedAdditionalDatas, ...rest } =
                        await workManagerService.load({
                            from: pstFilePath,
                        });

                    setMailBoxOwnerId(uncachedAdditionalDatas.ownerId);
                    setDeletedFolderId(uncachedAdditionalDatas.deletedFolderId);
                    setTaggedNodesFromWorkLoading({
                        deleteIds: uncachedAdditionalDatas.deleteIds,
                        keepIds: uncachedAdditionalDatas.keepIds,
                    });

                    extractDatas = rest;
                } else {
                    extractDatas = await pstExtractorService.extract({
                        pstFilePath,
                    });
                }
                console.log("extractDatas", extractDatas);

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
        setTaggedNodesFromWorkLoading,
        setTotalArchiveSize,
        trackerService,
        workManagerService,
    ]);

    useEffect(() => {
        pstExtractorService?.onProgress(setPstProgress);
    }, [pstExtractorService, setPstProgress]);

    return { pstProgress, setPstFilePath };
};
