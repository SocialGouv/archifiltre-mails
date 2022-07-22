import type { PstExtractDatas } from "@common/modules/pst-extractor/type";
import create from "zustand";

export interface PstStore {
    deletedFolder: string;
    extractDatas?: PstExtractDatas;
    setDeletedFolder: (deletedFolder: PstStore["deletedFolder"]) => void;
    setExtractDatas: (extractDatas: PstStore["extractDatas"]) => void;
}

export const usePstStore = create<PstStore>((set) => ({
    deletedFolder: "",
    setDeletedFolder(deletedFolder) {
        set({ deletedFolder });
    },
    setExtractDatas(extractDatas) {
        set({ extractDatas });
    },
}));
