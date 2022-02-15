import { useEffect, useState } from "react";

import { usePstStore } from "../store/PSTStore";
import { getPstFolderList } from "../utils/pst-extractor";

interface UsePstFolderList {
    folderList: string[];
}

export const usePstFolderList = (): UsePstFolderList => {
    const [folderList, setFolderList] = useState<string[]>([""]);

    const { pstFile } = usePstStore();

    useEffect(() => {
        if (pstFile) {
            const extractedFolderList = getPstFolderList(pstFile);
            setFolderList(extractedFolderList);
        }
    }, [pstFile]);

    return { folderList };
};
