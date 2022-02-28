import type { ComputedDatum } from "@nivo/circle-packing";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";
import { useCallback } from "react";

import type { ViewerObject } from "../utils/dashboard-viewer-dym";
import { useImpactStore } from "./ImpactStore";
import { usePstStore } from "./PSTStore";

type HoveredNode = ComputedDatum<ViewerObject<string>>;
export interface UseTagManagerStore {
    markedToDelete: string[];
    setMarkedToDelete: (update: SetStateAction<string[]>) => void;
    markedToKeep: string[];
    setMarkedToKeep: (update: SetStateAction<string[]>) => void;
    hoveredNode: HoveredNode | null;
    setHoveredNode: (update: SetStateAction<HoveredNode | null>) => void;
    addMarkedToDelete: () => void;
    addMarkedToKeep: () => void;
    addChildrenMarkedToDelete: (idsToDelete: string[]) => void;
    addChildrenMarkedToKeep: (idsToKeep: string[]) => void;
}

const markedToDeleteAtom = atom<string[]>([]);
const markedToKeepAtom = atom<string[]>([]);
const hoveredNodeAtom = atom<HoveredNode | null>(null);

export const useTagManagerStore = (): UseTagManagerStore => {
    const [markedToDelete, setMarkedToDelete] = useAtom(markedToDeleteAtom);
    const [markedToKeep, setMarkedToKeep] = useAtom(markedToKeepAtom);
    const [hoveredNode, setHoveredNode] = useAtom(hoveredNodeAtom);
    const { extractTables } = usePstStore();
    const { updateToDeleteImpact } = useImpactStore(
        extractTables?.attachements
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
    }, [
        hoveredNode,
        markedToDelete,
        markedToKeep,
        updateToDeleteImpact,
        setMarkedToDelete,
        setMarkedToKeep,
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
    }, [
        hoveredNode,
        markedToDelete,
        markedToKeep,
        updateToDeleteImpact,
        setMarkedToDelete,
        setMarkedToKeep,
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
