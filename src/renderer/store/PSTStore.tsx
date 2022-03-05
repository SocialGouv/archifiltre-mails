import type {
    PstContent,
    PstExtractTables,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

export interface UsePstStore {
    deletedFolder: string;
    extractTables: PstExtractTables | undefined;
    pstFile: PstContent | undefined;
    pstProgressState: PstProgressState | undefined;
    setDeletedFolder: (update: SetStateAction<string>) => void;
    setExtractTables: (
        update: SetStateAction<PstExtractTables | undefined>
    ) => void;
    setPstFile: (update: SetStateAction<PstContent | undefined>) => void;
    setPstProgressState: (
        update: SetStateAction<PstProgressState | undefined>
    ) => void;
}

const deletedFolderAtom = atom("");
const pstFileAtom = atom<PstContent | undefined>(void 0);
const pstExtractTablesAtom = atom<PstExtractTables | undefined>(undefined);
const pstProgressStateAtom = atom<PstProgressState | undefined>(undefined);

export const usePstStore = (): UsePstStore => {
    const [deletedFolder, setDeletedFolder] = useAtom(deletedFolderAtom);
    const [pstFile, setPstFile] = useAtom(pstFileAtom);
    const [extractTables, setExtractTables] = useAtom(pstExtractTablesAtom);
    const [pstProgressState, setPstProgressState] =
        useAtom(pstProgressStateAtom);

    return {
        deletedFolder,
        extractTables,
        pstFile,
        pstProgressState,
        setDeletedFolder,
        setExtractTables,
        setPstFile,
        setPstProgressState,
    };
};
