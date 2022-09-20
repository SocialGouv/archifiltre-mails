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
            attachments.forEach((attachment) => {
                if (deleteIds.includes(attachment[0])) {
                    attachment[1].forEach(
                        (attach) => (deleteSize.current += attach.filesize)
                    );
                }
            });

            setDeleteSize(deleteSize.current);

            // investigate (to use instead of forEach loop?): why this TS error => Function declared in a loop contains unsafe references to variable(s)
            //
            // for (const attachment of attachments) {
            //     if (deleteIds.includes(attachment[0])) {
            //         attachment[1].forEach(
            //             (attach) => (filesize += attach.filesize)
            //         );
            //     }
            // }
        }
    }, [deleteIds, extractDatas, setDeleteSize]);

    return { deleteSize: deleteSize.current };
};
