import type {
    PstContent,
    PstEmail,
    PstExtractTables,
} from "@common/modules/pst-extractor/type";
import type { ComputedDatum } from "@nivo/circle-packing";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

import type { PstComputed } from "../utils/pst-extractor";

export interface UsePstStore {
    sentFolder: string;
    setSentFolder: (update: SetStateAction<string>) => void;
    breadcrumb: string;
    setBreadcrumb: (update: SetStateAction<string>) => void;
    deletedFolder: string;
    setDeletedFolder: (update: SetStateAction<string>) => void;
    pstFile: PstContent | undefined;
    setPstFile: (update: SetStateAction<PstContent | undefined>) => void;
    extractTables: PstExtractTables | undefined;
    setExtractTables: (
        update: SetStateAction<PstExtractTables | undefined>
    ) => void;
    mainInfos: PstEmail | undefined;
    setMainInfos: (
        update?: SetStateAction<ComputedDatum<PstComputed> | PstEmail>
    ) => void;
}

const sentFolderAtom = atom("");
const deletedFolderAtom = atom("");
const pstFileAtom = atom<PstContent | undefined>(void 0);
const pstExtractTablesAtom = atom<PstExtractTables | undefined>(undefined);
const pstMainInfosAtom = atom<
    ComputedDatum<PstComputed | PstEmail> | undefined
>(undefined);
const breadcrumbAtom = atom<string>("domaine");

export const usePstStore = (): UsePstStore => {
    const [sentFolder, setSentFolder] = useAtom(sentFolderAtom);
    const [deletedFolder, setDeletedFolder] = useAtom(deletedFolderAtom);
    const [pstFile, setPstFile] = useAtom(pstFileAtom);
    const [extractTables, setExtractTables] = useAtom(pstExtractTablesAtom);
    const [mainInfos, setMainInfos] = useAtom(pstMainInfosAtom);
    const [breadcrumb, setBreadcrumb] = useAtom(breadcrumbAtom);

    return {
        breadcrumb,
        deletedFolder,
        extractTables,
        mainInfos,
        pstFile,
        sentFolder,
        setBreadcrumb,
        setDeletedFolder,
        setExtractTables,
        setMainInfos,
        setPstFile,
        setSentFolder,
    };
};
