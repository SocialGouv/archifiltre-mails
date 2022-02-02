import type {
    PstContent,
    PstExtractTables,
} from "@common/modules/pst-extractor/type";
import type { ComputedDatum } from "@nivo/circle-packing";
import { atom, useAtom } from "jotai/index";
import type { SetStateAction } from "react";

import type { MailViewerObject, ViewerObject } from "../utils/pst-extractor";
import { isMailViewerObject } from "../utils/pst-extractor";

export type MainInfos = ComputedDatum<ViewerObject<string>>;

export const isMailMainInfos = (
    mainInfos: MainInfos
): mainInfos is ComputedDatum<MailViewerObject<string>> =>
    isMailViewerObject(mainInfos.data);

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
    mainInfos: MainInfos | undefined;
    setMainInfos: (update?: SetStateAction<MainInfos | undefined>) => void;

    isInfoFocusKnob: () => void;
    isInfoFocus: boolean;
}

const sentFolderAtom = atom("");
const deletedFolderAtom = atom("");
const pstFileAtom = atom<PstContent | undefined>(void 0);
const pstExtractTablesAtom = atom<PstExtractTables | undefined>(undefined);
const pstMainInfosAtom = atom<MainInfos | undefined>(undefined);

const breadcrumbAtom = atom<string>("domaine"); // TODO: i18n

const isInfoFocusAtom = atom<boolean>(false);

export const usePstStore = (): UsePstStore => {
    const [sentFolder, setSentFolder] = useAtom(sentFolderAtom);
    const [deletedFolder, setDeletedFolder] = useAtom(deletedFolderAtom);
    const [pstFile, setPstFile] = useAtom(pstFileAtom);
    const [extractTables, setExtractTables] = useAtom(pstExtractTablesAtom);
    const [mainInfos, setMainInfos] = useAtom(pstMainInfosAtom);
    const [breadcrumb, setBreadcrumb] = useAtom(breadcrumbAtom);
    const [isInfoFocus, setIsInfoFocus] = useAtom(isInfoFocusAtom);

    const isInfoFocusKnob = () => {
        setIsInfoFocus((focus) => !focus);
    };

    return {
        breadcrumb,
        deletedFolder,
        extractTables,
        isInfoFocus,
        isInfoFocusKnob,
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
