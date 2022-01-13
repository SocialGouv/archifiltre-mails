import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";
import { useCallback } from "react";

export interface UseTagManagerStore {
    markedToDelete: string[];
    setMarkedToDelete: (update: SetStateAction<string[]>) => void;
    markedToKeep: string[];
    setMarkedToKeep: (update: SetStateAction<string[]>) => void;
    hoveredId: string;
    setHoveredId: (update: SetStateAction<string>) => void;
    addMarkedToDelete: () => void;
}

const markedToDeleteAtom = atom<string[]>([""]);
const markedToKeepAtom = atom<string[]>([""]);
const hoveredIdAtom = atom<string>("");

export const useTagManagerStore = (): UseTagManagerStore => {
    const [markedToDelete, setMarkedToDelete] = useAtom(markedToDeleteAtom);
    const [markedToKeep, setMarkedToKeep] = useAtom(markedToKeepAtom);
    const [hoveredId, setHoveredId] = useAtom(hoveredIdAtom);

    const addMarkedToDelete = useCallback(() => {
        const updatedMarkedToDelete = [
            ...new Set([...markedToDelete, hoveredId]),
        ];
        setMarkedToDelete(updatedMarkedToDelete);
    }, [hoveredId, markedToDelete, setMarkedToDelete]);

    return {
        addMarkedToDelete,
        hoveredId,
        markedToDelete,
        markedToKeep,
        setHoveredId,
        setMarkedToDelete,
        setMarkedToKeep,
    };
};
