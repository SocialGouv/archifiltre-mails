import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React, { useEffect } from "react";

import { useDomainsYearsMails } from "../../hooks/useDomainsYearMails";
import { useTagManagerStore } from "../../store/TagManagerStore";
import { BASE_COLOR, DELETE_COLOR, KEEP_COLOR } from "../../utils/constants";
import type { PstComputedChild } from "../../utils/pst-extractor";
import { isToDeleteFolder, isToKeepFolder } from "../../utils/pst-extractor";
import {
    getChildrenToDeleteIds,
    getChildrenToKeepIds,
    getUntagChildrenIds,
} from "../../utils/pst-viewer";
import { Menu } from "../menu/Menu";
import style from "./CirclePacking.module.scss";
import { commonProperties } from "./CirclePackingViewer";

export const CirclePacking: React.FC = () => {
    const { currentView, computeNextView, restartView } =
        useDomainsYearsMails();

    const {
        setHoveredId,
        addChildrenMarkedToKeep,
        addChildrenMarkedToDelete,
        markedToDelete,
        markedToKeep,
    } = useTagManagerStore();

    useEffect(() => {
        const children = currentView.elements.children as PstComputedChild[];

        if (
            isToDeleteFolder(currentView.elements.id as string, markedToDelete)
        ) {
            addChildrenMarkedToDelete([
                ...getChildrenToDeleteIds(children, markedToKeep),
                ...getUntagChildrenIds(children, markedToDelete, markedToKeep),
            ]);
        }
        if (isToKeepFolder(currentView.elements.id as string, markedToKeep)) {
            addChildrenMarkedToKeep([
                ...getChildrenToKeepIds(children, markedToDelete),
                ...getUntagChildrenIds(children, markedToKeep, markedToDelete),
            ]);
        }
    }, [currentView]);

    return (
        <>
            <div id="circle-packing" className={style["circle-packing"]}>
                <button onClick={restartView}>Restart</button>
                <ResponsiveCirclePacking
                    data={currentView.elements}
                    onClick={(node) => {
                        computeNextView(node);
                    }}
                    onMouseEnter={(node) => {
                        setHoveredId(node.id);
                    }}
                    isInteractive={true}
                    colors={(node) => {
                        if (isToDeleteFolder(node.id, markedToDelete)) {
                            return DELETE_COLOR as string;
                        }
                        if (isToKeepFolder(node.id, markedToKeep)) {
                            return KEEP_COLOR as string;
                        }
                        return BASE_COLOR;
                    }}
                    {...commonProperties}
                />
            </div>

            <Menu />
        </>
    );
};

// const getChildrenToDeleteIds = (
//     children: PstComputedChild[]
// ): string[] =>
//     children
//         .filter(
//             (child: PstComputedChild) =>
//                 !isToKeepFolder(child.id, markedToKeep)
//         )
//         .map((child) => child.id);

// const getChildrenToKeepIds = (children: PstComputedChild[]): string[] =>
//     children
//         .filter(
//             (child: PstComputedChild) =>
//                 !isToDeleteFolder(child.id, markedToDelete)
//         )
//         .map((child) => child.id);

// const getUntagChildrenIds = (children: PstComputedChild[]): string[] =>
//     children
//         .filter(
//             (child: PstComputedChild) =>
//                 !isToDeleteFolder(child.id, markedToDelete) &&
//                 !isToKeepFolder(child.id, markedToKeep)
//         )
//         .map((child) => child.id);
