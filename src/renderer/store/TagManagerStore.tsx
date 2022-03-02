import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";
import { useCallback } from "react";

export interface UseTagManagerStore {
    addChildrenMarkedToDelete: (idsToDelete: string[]) => void;
    addChildrenMarkedToKeep: (idsToKeep: string[]) => void;
    addMarkedToDelete: () => void;
    addMarkedToKeep: () => void;
    hoveredId: string;
    markedToDelete: string[];
    markedToKeep: string[];
    setHoveredId: (update: SetStateAction<string>) => void;
    setMarkedToDelete: (update: SetStateAction<string[]>) => void;
    setMarkedToKeep: (update: SetStateAction<string[]>) => void;
}

const markedToDeleteAtom = atom<string[]>([""]);
const markedToKeepAtom = atom<string[]>([""]);
const hoveredIdAtom = atom<string>("");

export const useTagManagerStore = (): UseTagManagerStore => {
    const [markedToDelete, setMarkedToDelete] = useAtom(markedToDeleteAtom);
    const [markedToKeep, setMarkedToKeep] = useAtom(markedToKeepAtom);
    const [hoveredId, setHoveredId] = useAtom(hoveredIdAtom);

    // DELETE LOGIC
    const addMarkedToDelete = useCallback(() => {
        if (markedToKeep.includes(hoveredId)) {
            const removeCurrentFromKeep = markedToKeep.filter(
                (element) => element !== hoveredId
            );
            setMarkedToKeep(removeCurrentFromKeep);
        }

        const updatedMarkedToDelete = [
            ...new Set([...markedToDelete, hoveredId]),
        ];
        setMarkedToDelete(updatedMarkedToDelete);
    }, [
        hoveredId,
        markedToDelete,
        markedToKeep,
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
        if (markedToDelete.includes(hoveredId)) {
            const removeCurrentFromDelete = markedToDelete.filter(
                (element) => element !== hoveredId
            );
            setMarkedToDelete(removeCurrentFromDelete);
        }

        const updatedMarkedToKeep = [...new Set([...markedToKeep, hoveredId])];
        setMarkedToKeep(updatedMarkedToKeep);
    }, [
        hoveredId,
        markedToDelete,
        markedToKeep,
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
        hoveredId,
        markedToDelete,
        markedToKeep,
        setHoveredId,
        setMarkedToDelete,
        setMarkedToKeep,
    };
};
