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

                const { totalAttachmentPerLevel, filesize } =
                    attachments.reduce(
                        (
                            accumulatedAttachment,
                            [mailId, currentAttachments]
                        ) => {
                            if (mailsIds.includes(mailId)) {
                                const currentFilesize =
                                    currentAttachments.reduce(
                                        (acc, attachment) =>
                                            acc + attachment.filesize,
                                        0
                                    );

                                accumulatedAttachment.filesize +=
                                    currentFilesize;
                                accumulatedAttachment.totalAttachmentPerLevel +=
                                    currentAttachments.length;
                            }

                            return accumulatedAttachment;
                        },
                        {
                            filesize: 0,
                            totalAttachmentPerLevel: 0,
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
