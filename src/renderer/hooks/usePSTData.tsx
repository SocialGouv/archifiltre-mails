import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { getSpecificFolderTotalElements } from "../utils/pst-extractor";
import { usePSTExtractor } from "./usePSTExtractor";

interface UsePSTExtractor {
    pstData: number | undefined;
    setFolderName: Dispatch<SetStateAction<string>>;
}

export const usePSTData = (): UsePSTExtractor => {
    const [pstData, setPstData] = useState<number | undefined>();
    const [folderName, setFolderName] = useState<string>("");

    const { extractedFile } = usePSTExtractor();

    useEffect(() => {
        if (extractedFile && folderName) {
            const extractedPstData = getSpecificFolderTotalElements(
                extractedFile,
                folderName
            );

            setPstData(extractedPstData);
        }
    }, [extractedFile, folderName]);

    return { pstData, setFolderName };
};
