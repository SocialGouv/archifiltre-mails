import type { PstShallowFolder } from "@common/modules/pst-extractor/type";
import React, { useMemo, useReducer } from "react";
import Tree from "react-d3-tree/lib/esm/index.js";

import { useCenteredTree } from "../../hooks/useCenteredTree";
import { usePstStore } from "../../store/PSTStore";
import style from "./Tree.module.scss";
import { TreeControls } from "./TreeControls";

type RenamedPstShallowFolder = PstShallowFolder & {
    children?: PstShallowFolder[];
};

export interface InitialTreeProps {
    initialDepth: number;
    nodeSize: {
        x: string;
        y: string;
    };
    orientation: string;
    pathFunc: string;
    separation: {
        nonSiblings: number;
        siblings: number;
    };
    shouldCollapseNeighborNodes: boolean;
    zoom: number;
}

const initalTreeProps: InitialTreeProps = {
    initialDepth: 1,
    nodeSize: {
        x: "750",
        y: "100",
    },
    orientation: "horizontal",
    pathFunc: "step",
    separation: {
        nonSiblings: 10,
        siblings: 5,
    },
    shouldCollapseNeighborNodes: true,
    zoom: 0.5,
};

const renameSubfoldersKeyRecursive = (
    folder: PstShallowFolder
): RenamedPstShallowFolder => {
    return {
        ...folder,
        children: Array.isArray(folder.subfolders)
            ? folder.subfolders.map(renameSubfoldersKeyRecursive)
            : undefined,
    };
};

export const TreeContainer: React.FC = () => {
    const { containerRef, translate } = useCenteredTree();
    const { extractDatas } = usePstStore();
    const folderStructure = extractDatas?.additionalDatas.folderStructure;

    const [tree, updateTree] = useReducer(
        (prev: InitialTreeProps, next: Partial<InitialTreeProps>) => ({
            ...prev,
            ...next,
        }),
        initalTreeProps
    );

    const data = useMemo(() => {
        if (folderStructure) {
            return renameSubfoldersKeyRecursive(folderStructure);
        }
    }, [folderStructure]);

    if (!data) return null;

    return (
        <div className={style.tree} ref={containerRef}>
            <Tree
                {...initalTreeProps}
                translate={translate}
                data={data}
                orientation={tree.orientation}
                nodeSize={tree.nodeSize}
            />
            <TreeControls updateTree={updateTree} tree={tree} />
        </div>
    );
};
