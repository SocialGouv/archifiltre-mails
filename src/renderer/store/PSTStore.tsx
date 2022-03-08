import type {
    PstContent,
    PstExtractTables,
} from "@common/modules/pst-extractor/type";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

export interface UsePstStore {
    deletedFolder: string;
    extractTables: PstExtractTables | undefined;
    pstFile: PstContent | undefined;
    setDeletedFolder: (update: SetStateAction<string>) => void;
    setExtractTables: (
        update: SetStateAction<PstExtractTables | undefined>
    ) => void;
    setPstFile: (update: SetStateAction<PstContent | undefined>) => void;
}

const deletedFolderAtom = atom("");
const pstFileAtom = atom<PstContent | undefined>(void 0);
const pstExtractTablesAtom = atom<PstExtractTables | undefined>(undefined);

export const usePstStore = (): UsePstStore => {
    const [deletedFolder, setDeletedFolder] = useAtom(deletedFolderAtom);
    const [pstFile, setPstFile] = useAtom(pstFileAtom);
    const [extractTables, setExtractTables] = useAtom(pstExtractTablesAtom);

    return {
        deletedFolder,
        extractTables,
        pstFile,
        setDeletedFolder,
        setExtractTables,
        setPstFile,
    };
};
