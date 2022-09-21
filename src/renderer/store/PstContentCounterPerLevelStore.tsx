import { bytesToMegabytes } from "@common/utils";
import { useEffect, useRef, useState } from "react";
import create from "zustand";

import { useDymViewerNavigation } from "../hooks/useDymViewerNavigation";
import { getTotalCount } from "../utils/dashboard-viewer";
import { usePstStore } from "./PSTStore";

export interface PstContentCounterPerLevelStore {
    setPreviousTotal: () => void;
    setTotalArchiveSize: (totatArchiveSize: number) => void;
    setTotalAttachment: (totalAttachment: number) => void;
    setTotalFilesize: (filesize: number) => void;
    setTotalMail: (totalMail: number) => void;
    totalArchiveSize: number;
    totalAttachment: number[];
    totalFilesize: number[];
    totalMail: number[];
}

export const pstContentCounterPerLevelStore =
    create<PstContentCounterPerLevelStore>((set, get) => ({
        setPreviousTotal: () => {
            const { totalAttachment, totalMail, totalFilesize } = get();
            totalAttachment.pop();
            totalMail.pop();
            totalFilesize.pop();

            set({
                totalAttachment,
                totalFilesize,
                totalMail,
            });
        },
        setTotalArchiveSize: (_totalArchiveSize: number) => {
            set({ totalArchiveSize: bytesToMegabytes(_totalArchiveSize) });
        },
        setTotalAttachment: (_totalAttachment: number) => {
            set(({ totalAttachment }) => ({
                totalAttachment: [...totalAttachment, _totalAttachment],
            }));
        },
        setTotalFilesize: (_totalFilesize: number) => {
            set(({ totalFilesize }) => ({
                totalFilesize: [
                    ...totalFilesize,
                    bytesToMegabytes(_totalFilesize),
                ],
            }));
        },
        setTotalMail: (_totalMail: number) => {
            set(({ totalMail }) => ({ totalMail: [...totalMail, _totalMail] }));
        },
        totalArchiveSize: 0,
        totalAttachment: [],
        totalFilesize: [],
        totalMail: [],
    }));

export const usePstContentCounterPerLevel = (): void => {
    const [isReady, setIsReady] = useState(false);
    const { viewList, currentViewIndex } = useDymViewerNavigation();
    const { extractDatas } = usePstStore();
    const {
        setTotalMail,
        setTotalAttachment,
        setTotalFilesize,
        setPreviousTotal,
    } = pstContentCounterPerLevelStore();
    const currentIndex = useRef(-1);
    const currentView = viewList[currentViewIndex];

    useEffect(() => {
        if (currentView && extractDatas) {
            if (!isReady) {
                setIsReady(true);
                return;
            }

            if (currentIndex.current < currentViewIndex) {
                currentIndex.current++;

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
                                // const currentFilesize = currentAttachment[1].reduce(
                                //     (a, c) => a + c.filesize,
                                //     0
                                // );

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
            } else {
                currentIndex.current--;
                setPreviousTotal();
            }
        }
    }, [
        currentView,
        currentViewIndex,
        extractDatas,
        isReady,
        setPreviousTotal,
        setTotalAttachment,
        setTotalFilesize,
        setTotalMail,
    ]);
};
