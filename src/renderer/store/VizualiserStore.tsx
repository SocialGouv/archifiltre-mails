import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

export interface UseVizualiserInterface {
    current: unknown;
    setCurrent: (update: SetStateAction<unknown>) => void;
    previous: unknown;
    setPrevious: (update: SetStateAction<unknown>) => void;
    paths: string[];
    updatePaths: (path: string[], id: string) => void;
    depther: number;
    setDepther: (nb: number) => void;
}

const currentAtom = atom<unknown>([]);
const previousAtom = atom<unknown>([]);
const pathsAtom = atom<string[]>(["rootId"]);
const deptherAtom = atom<number>(1);

export const useVizualiserStore = (): UseVizualiserInterface => {
    const [current, setCurrent] = useAtom(currentAtom);
    const [previous, setPrevious] = useAtom(previousAtom);

    const [paths, setPaths] = useAtom(pathsAtom);

    const [depther, setDepther] = useAtom(deptherAtom);

    const removePaths = (path: string[]) => {
        const arr = path;
        arr.pop();
        setPaths(arr);
    };

    const addPaths = (path: string[], id: string) => {
        const arr = [...path, id];
        setPaths(arr);
    };

    const updatePaths = (path: string[], id: string): void => {
        if (path.includes(id)) {
            removePaths(path);
            return;
        }
        addPaths(path, id);
    };

    return {
        current,
        depther,
        paths,
        previous,
        setCurrent,
        setDepther,
        setPrevious,
        updatePaths,
    };
};
