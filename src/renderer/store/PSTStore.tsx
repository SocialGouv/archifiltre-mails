import type { PstExtractDatas } from "@common/modules/pst-extractor/type";
import create from "zustand";

export interface PstStore {
    deletedFolder: string;
    extractDatas?: PstExtractDatas;
    originalPath: string;
    setDeletedFolder: (deletedFolder: PstStore["deletedFolder"]) => void;
    setExtractDatas: (extractDatas: PstStore["extractDatas"]) => void;
    setOriginalPath: (originalPath: string) => void;
}

export const usePstStore = create<PstStore>((set) => ({
    deletedFolder: "",
    originalPath: "",
    setDeletedFolder(deletedFolder) {
        set({ deletedFolder });
    },
    setExtractDatas(extractDatas) {
        set({ extractDatas });
    },
    setOriginalPath(originalPath) {
        set({ originalPath });
    },
}));
