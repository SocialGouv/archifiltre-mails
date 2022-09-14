import { useEffect, useState } from "react";

import { usePstStore } from "../store/PSTStore";

interface UsePstFolderList {
    folderList: string[];
}

export const usePstFolderList = (): UsePstFolderList => {
    const [folderList, setFolderList] = useState<string[]>([""]);

    const { extractDatas } = usePstStore();

    useEffect(() => {
        if (extractDatas) {
            setFolderList(
                extractDatas.additionalDatas.folderList.map(
                    (folder) => folder.name
                )
            );
        }
    }, [extractDatas]);

    return { folderList };
};
