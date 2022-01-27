import type { ComputedDatum } from "@nivo/circle-packing";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import { debounce } from "lodash";
import React, { useEffect } from "react";

import { useDomainsYearsMails } from "../../hooks/useDomainsYearMails";
import { usePstStore } from "../../store/PSTStore";
import { useTagManagerStore } from "../../store/TagManagerStore";
import { COLORS } from "../../utils/constants";
import type { PstComputed, PstComputedChild } from "../../utils/pst-extractor";
import { isToDeleteFolder, isToKeepFolder } from "../../utils/pst-extractor";
import {
    getChildrenToDeleteIds,
    getChildrenToKeepIds,
    getUntagChildrenIds,
} from "../../utils/pst-viewer";
import { Menu } from "../menu/Menu";
import style from "./CirclePacking.module.scss";
import { commonProperties } from "./CirclePackingViewer";

const { BASE_COLOR, BASE_COLOR_LIGHT, DELETE_COLOR, KEEP_COLOR } = COLORS;

export const CirclePacking: React.FC = () => {
    const { currentView, computeNextView, restartView } =
        useDomainsYearsMails();

    const { setMainInfos } = usePstStore(); // TODO: remove PstStore ?

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

    const getTaggedFilesColor = (
        node: Omit<ComputedDatum<PstComputed>, "color" | "fill">
    ) => {
        if (node.depth === 0) return BASE_COLOR_LIGHT; // prefer to use equality over a '!node.depth' to understand that is a level

        if (isToDeleteFolder(node.id, markedToDelete)) {
            return DELETE_COLOR;
        }
        if (isToKeepFolder(node.id, markedToKeep)) {
            return KEEP_COLOR;
        }
        return BASE_COLOR;
    };

    const debouncedHover = debounce((node: ComputedDatum<PstComputed>) => {
        setMainInfos({ percentage: node.percentage, ...node.data });
        setHoveredId(node.id);
    }, 500);

    return (
        <>
            <div id="circle-packing" className={style["circle-packing"]}>
                <button onClick={restartView}>Restart</button>
                <ResponsiveCirclePacking
                    data={currentView.elements}
                    onClick={computeNextView}
                    onMouseEnter={debouncedHover}
                    colors={getTaggedFilesColor}
                    {...commonProperties}
                />
            </div>

            <Menu />
        </>
    );
};
