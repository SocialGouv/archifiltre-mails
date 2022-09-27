import { useEffect, useRef } from "react";
import create from "zustand";

import { usePstStore } from "./PSTStore";
import { tagManagerStore } from "./TagManagerStore";

export interface ImpactStore {
    deleteSize: number;
    setDeleteSize: (deleteSize: number) => void;
}

export const impactStore = create<ImpactStore>((set) => ({
    deleteSize: 0,
    setDeleteSize: (deleteSize: number) => {
        set({ deleteSize });
    },
}));

export const useImpactStore = (): { deleteSize: number } => {
    const { setDeleteSize } = impactStore();
    const { deleteIds } = tagManagerStore();
    const { extractDatas } = usePstStore();
    const deleteSize = useRef(0);

    useEffect(() => {
        if (extractDatas) {
            const attachments = [...extractDatas.attachments];
            // need to reset current delete size before update it.
            deleteSize.current = 0;
            for (const attachment of attachments) {
                if (deleteIds.includes(attachment[0])) {
                    for (const attach of attachment[1]) {
                        deleteSize.current += attach.filesize;
                    }
                }
            }

            setDeleteSize(deleteSize.current);
        }
    }, [deleteIds, extractDatas, setDeleteSize]);

    return { deleteSize: deleteSize.current };
};
