import { bytesToMegabytes } from "@common/utils";
import { useEffect } from "react";
import create from "zustand";

import { useDymViewerNavigation } from "../hooks/useDymViewerNavigation";
import { getTotalCount } from "../utils/dashboard-viewer";
import { usePstStore } from "./PSTStore";

export interface PstContentCounterPerLevelStore {
    setTotalArchiveSize: (totatArchiveSize: number) => void;
    setTotalAttachment: (totalAttachment: number) => void;
    setTotalFilesize: (filesize: number) => void;
    setTotalMail: (totalMail: number) => void;
    totalArchiveSize: number;
    totalAttachment: number;
    totalFilesize: number;
    totalMail: number;
}

export const pstContentCounterPerLevelStore =
    create<PstContentCounterPerLevelStore>((set) => ({
        setTotalArchiveSize: (_totalArchiveSize: number) => {
            const totalArchiveSize = bytesToMegabytes(_totalArchiveSize);
            set({ totalArchiveSize });
        },
        setTotalAttachment: (totalAttachment: number) => {
            set({ totalAttachment });
        },
        setTotalFilesize: (_totalFilesize: number) => {
            const totalFilesize = bytesToMegabytes(_totalFilesize);

            set({ totalFilesize });
        },
        setTotalMail: (totalMail: number) => {
            set({ totalMail });
        },
        totalArchiveSize: 0,
        totalAttachment: 0,
        totalFilesize: 0,
        totalMail: 0,
    }));

export const usePstContentCounterPerLevel = (): void => {
    const { viewList, currentViewIndex } = useDymViewerNavigation();
    const { extractDatas } = usePstStore();
    const { setTotalMail, setTotalAttachment, setTotalFilesize } =
        pstContentCounterPerLevelStore();
    const currentView = viewList[currentViewIndex];

    useEffect(() => {
        if (currentView && extractDatas) {
            const totalMailPerLevel = getTotalCount(
                currentView.elements.children
            );

            const attachments = [...extractDatas.attachments];
            const mailsIds = currentView.elements.children
                .map((child) => child.ids)
                .flat();

            let filesize = 0;

            const { total: totalAttachmentPerLevel, filesize: fs } =
                attachments.reduce(
                    (accumulatedAttachment, currentAttachment) => {
                        if (mailsIds.includes(currentAttachment[0])) {
                            currentAttachment[1].forEach(
                                (c) => (filesize += c.filesize)
                            );
                            // investigate: why update to 0 ?
                            const currentFilesize = currentAttachment[1].reduce(
                                (a, c) => a + c.filesize,
                                0
                            );

                            return {
                                filesize: 0, // should be `currentFilesize`, see line 88.
                                total:
                                    accumulatedAttachment.total +
                                    currentAttachment[1].length,
                            };
                        }

                        return accumulatedAttachment;
                    },
                    {
                        filesize: 0,
                        total: 0,
                    }
                );

            setTotalMail(totalMailPerLevel);
            setTotalAttachment(totalAttachmentPerLevel);
            setTotalFilesize(filesize);
        }
    }, [
        currentView,
        extractDatas,
        extractDatas?.attachments,
        setTotalAttachment,
        setTotalFilesize,
        setTotalMail,
    ]);
};
