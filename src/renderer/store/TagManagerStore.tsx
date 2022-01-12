import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";
import { useCallback } from "react";

export interface UseTagManagerInterface {
    markedToDelete: string[];
    setMarkedToDelete: (update: SetStateAction<string[]>) => void;
    markedToKeep: string[];
    setMarkedToKeep: (update: SetStateAction<string[]>) => void;
    hoveredId: string;
    setHoveredId: (update: SetStateAction<string>) => void;
    addMarkedToDelete: () => void;
    addChildrenMarkedToDelete: (idsToDelete: string[]) => void;
}

export const markedToDeleteAtom = atom<string[]>([""]);
export const markedToKeepAtom = atom<string[]>([""]);
export const hoveredIdAtom = atom<string>("");

export const useTagManagerStore = (): UseTagManagerInterface => {
    const [markedToDelete, setMarkedToDelete] = useAtom(markedToDeleteAtom);
    const [markedToKeep, setMarkedToKeep] = useAtom(markedToKeepAtom);
    const [hoveredId, setHoveredId] = useAtom(hoveredIdAtom);

    const addMarkedToDelete = useCallback(() => {
        const updatedMarkedToDelete = [
            ...new Set([...markedToDelete, hoveredId]),
        ];
        setMarkedToDelete(updatedMarkedToDelete);
    }, [hoveredId, markedToDelete, setMarkedToDelete]);

    const addChildrenMarkedToDelete = (idsToDelete: string[]) => {
        const updatedMarkedToDelete = [
            ...new Set([...markedToDelete, ...idsToDelete]),
        ];
        setMarkedToDelete(updatedMarkedToDelete);
    };

    return {
        addChildrenMarkedToDelete,
        addMarkedToDelete,
        hoveredId,
        markedToDelete,
        markedToKeep,
        setHoveredId,
        setMarkedToDelete,
        setMarkedToKeep,
    };
};
