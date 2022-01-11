import type {
    PstContent,
    PstEmail,
    PstExtractTables,
    PstFolder,
} from "@common/modules/pst-extractor/type";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";
import { useCallback } from "react";

import type { PstComputed } from "../utils/pst-extractor";
import { computedRoot } from "../utils/pst-extractor";

export interface UsePSTInterface {
    sentFolder: string;
    setSentFolder: (update: SetStateAction<string>) => void;
    deletedFolder: string;
    setDeletedFolder: (update: SetStateAction<string>) => void;
    rootPath: string;
    setRootPath: (update: SetStateAction<string>) => void;
    pstFile: PstContent | undefined;
    setPstFile: (update: SetStateAction<PstContent | undefined>) => void;
    computedPst: PstComputed | undefined;
    setComputedPst: (update: SetStateAction<PstComputed | undefined>) => void;
    updateComputedPst: (pst: PstFolder, nodeId: string) => void;
    extractTables: PstExtractTables | undefined;
    setExtractTables: (
        update: SetStateAction<PstExtractTables | undefined>
    ) => void;
    mainInfos: PstEmail | undefined;
    setMainInfos: (update: SetStateAction<PstEmail | undefined>) => void;
    depth: number | string;
    setDepth: (update: SetStateAction<number>) => void;
}

const sentFolderAtom = atom("");
const deletedFolderAtom = atom("");
const rootPathAtom = atom("");
const pstFileAtom = atom<PstContent | undefined>(undefined);
const computedPstAtom = atom<PstComputed | undefined>(undefined);
const pstExtractTablesAtom = atom<PstExtractTables | undefined>(undefined);
const pstMainInfosAtom = atom<PstEmail | undefined>(undefined);
const pstDepthAtom = atom<number>(0);

// const getterAtom = atom((get) => get(pstDepthAtom));
// const setterAtom = atom((set) => set(pstDepthAtom));

export const usePSTStore = (): UsePSTInterface => {
    const [sentFolder, setSentFolder] = useAtom(sentFolderAtom);
    const [deletedFolder, setDeletedFolder] = useAtom(deletedFolderAtom);
    const [rootPath, setRootPath] = useAtom(rootPathAtom);
    const [pstFile, setPstFile] = useAtom(pstFileAtom);
    const [computedPst, setComputedPst] = useAtom(computedPstAtom);
    const [extractTables, setExtractTables] = useAtom(pstExtractTablesAtom);
    const [mainInfos, setMainInfos] = useAtom(pstMainInfosAtom);
    const [depth, setDepth] = useAtom(pstDepthAtom);

    // const [depth] = useAtom(getterAtom);
    // const [, setDepth] = useAtom(setterAtom);

    const updateComputedPst = useCallback(
        (pst: PstFolder, nodeId: string): void => {
            const computed = computedRoot(pst, nodeId);
            setComputedPst(computed);
        },
        [setComputedPst]
    );

    return {
        computedPst,
        deletedFolder,
        depth,
        extractTables,
        mainInfos,
        pstFile,
        rootPath,
        sentFolder,
        setComputedPst,
        setDeletedFolder,
        setDepth,
        setExtractTables,
        setMainInfos,
        setPstFile,
        setRootPath,
        setSentFolder,
        updateComputedPst,
    };
};
