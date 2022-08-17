import { useService } from "@common/modules/ContainerModule";
import type { TrackAppEventProps } from "@common/tracker/type";
import { bytesToMegabytes } from "@common/utils";
import type { ComputedDatum } from "@nivo/circle-packing";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";
import { useCallback } from "react";

import type { ViewerObject } from "../utils/dashboard-viewer-dym";
import { useImpactStore } from "./ImpactStore";
import { usePstStore } from "./PSTStore";

type HoveredNode = ComputedDatum<ViewerObject<string>>;
export interface UseTagManagerStore {
    addChildrenMarkedToDelete: (idsToDelete: string[]) => void;
    addChildrenMarkedToKeep: (idsToKeep: string[]) => void;
    addMarkedToDelete: () => void;
    addMarkedToKeep: () => void;
    hoveredNode: HoveredNode | null;
    markedToDelete: string[];
    markedToKeep: string[];
    setHoveredNode: (update: SetStateAction<HoveredNode | null>) => void;
    setMarkedToDelete: (update: SetStateAction<string[]>) => void;
    setMarkedToKeep: (update: SetStateAction<string[]>) => void;
}

const markedToDeleteAtom = atom<string[]>([]);
const markedToKeepAtom = atom<string[]>([]);
const hoveredNodeAtom = atom<HoveredNode | null>(null);

export const useTagManagerStore = (): UseTagManagerStore => {
    const [markedToDelete, setMarkedToDelete] = useAtom(markedToDeleteAtom);
    const [markedToKeep, setMarkedToKeep] = useAtom(markedToKeepAtom);
    const [hoveredNode, setHoveredNode] = useAtom(hoveredNodeAtom);
    const { extractDatas } = usePstStore();
    const { updateToDeleteImpact } = useImpactStore(extractDatas?.attachments);
    const tracker = useService("trackerService")?.getProvider();
    const trackTag = useCallback(
        (
            ids: string[],
            markType: TrackAppEventProps["Feat(5.0) Element Marked"]["markType"]
        ) => {
            let sizeRaw = 0;
            extractDatas?.attachments.forEach((attachments, emailUuid) => {
                if (ids.includes(emailUuid)) {
                    sizeRaw += attachments.reduce(
                        (acc, attachment) => acc + attachment.filesize,
                        0
                    );
                }
            });
            tracker?.track("Feat(5.0) Element Marked", {
                markType,
                size: bytesToMegabytes(sizeRaw),
                sizeRaw,
            });
        },
        [extractDatas?.attachments, tracker]
    );

    // DELETE LOGIC
    const addMarkedToDelete = useCallback(() => {
        if (!hoveredNode) return;
        if (markedToKeep.includes(hoveredNode.id)) {
            const removeCurrentFromKeep = markedToKeep.filter(
                (elementId) => elementId !== hoveredNode.id
            );
            setMarkedToKeep(removeCurrentFromKeep);
        }

        const updatedMarkedToDelete = [
            ...new Set([...markedToDelete, hoveredNode.id]),
        ];
        setMarkedToDelete(updatedMarkedToDelete);

        updateToDeleteImpact(hoveredNode.data.ids, "add");
        trackTag(hoveredNode.data.ids, "delete");
    }, [
        hoveredNode,
        markedToDelete,
        markedToKeep,
        updateToDeleteImpact,
        setMarkedToDelete,
        setMarkedToKeep,
        trackTag,
    ]);

    const addChildrenMarkedToDelete = (idsToDelete: string[]) => {
        const removeCurrentFromKeep = markedToKeep.filter(
            (element) => !idsToDelete.includes(element)
        );
        setMarkedToKeep(removeCurrentFromKeep);

        const updatedMarkedToDelete = [
            ...new Set([...markedToDelete, ...idsToDelete]),
        ];
        setMarkedToDelete(updatedMarkedToDelete);
    };

    // KEEP LOGIC
    const addMarkedToKeep = useCallback(() => {
        if (!hoveredNode) return;
        if (markedToDelete.includes(hoveredNode.id)) {
            const removeCurrentFromDelete = markedToDelete.filter(
                (element) => element !== hoveredNode.id
            );
            setMarkedToDelete(removeCurrentFromDelete);
        }

        const updatedMarkedToKeep = [
            ...new Set([...markedToKeep, hoveredNode.id]),
        ];
        setMarkedToKeep(updatedMarkedToKeep);
        updateToDeleteImpact(hoveredNode.data.ids, "delete");
        trackTag(hoveredNode.data.ids, "keep");
    }, [
        hoveredNode,
        markedToDelete,
        markedToKeep,
        updateToDeleteImpact,
        setMarkedToDelete,
        setMarkedToKeep,
        trackTag,
    ]);

    const addChildrenMarkedToKeep = (idsToKeep: string[]) => {
        const removeCurrentFromDelete = markedToDelete.filter(
            (element) => !idsToKeep.includes(element)
        );
        setMarkedToDelete(removeCurrentFromDelete);

        const updatedMarkedToKeep = [
            ...new Set([...markedToKeep, ...idsToKeep]),
        ];
        setMarkedToKeep(updatedMarkedToKeep);
    };

    return {
        addChildrenMarkedToDelete,
        addChildrenMarkedToKeep,
        addMarkedToDelete,
        addMarkedToKeep,
        hoveredNode,
        markedToDelete,
        markedToKeep,
        setHoveredNode,
        setMarkedToDelete,
        setMarkedToKeep,
    };
};
