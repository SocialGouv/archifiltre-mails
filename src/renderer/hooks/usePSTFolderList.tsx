import { useEffect, useState } from "react";

import { usePSTStore } from "../store/PSTStore";
import { getPSTRootFolderList } from "../utils/pst-extractor";

interface UsePSTExtractor {
    folderList: string[];
}

export const usePSTFolderList = (): UsePSTExtractor => {
    const [folderList, setFolderList] = useState<string[]>([""]);

    const { pstFile } = usePSTStore();

    useEffect(() => {
        if (pstFile) {
            const extractedFolderList = getPSTRootFolderList(pstFile);
            setFolderList(extractedFolderList);
        }
    }, [pstFile]);

    return { folderList };
};
