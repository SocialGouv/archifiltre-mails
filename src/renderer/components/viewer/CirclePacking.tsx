import type { ComputedDatum } from "@nivo/circle-packing";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import debounce from "lodash/debounce";
import React, { useEffect } from "react";

import { useDomainsYearsMails } from "../../hooks/useDomainsYearMails";
import { usePstStore } from "../../store/PSTStore";
import { useTagManagerStore } from "../../store/TagManagerStore";
import { COLORS, ROOT } from "../../utils/constants";
import type {
    DefaultViewerObject,
    MailViewerObject,
    ViewerObject,
} from "../../utils/pst-extractor";
import {
    isMailViewerObject,
    isToDeleteFolder,
    isToKeepFolder,
} from "../../utils/pst-extractor";
import {
    commonProperties,
    getChildrenToDeleteIds,
    getChildrenToKeepIds,
    getColorFromTrimester,
    getUntagChildrenIds,
} from "../../utils/pst-viewer";
import { Menu } from "../menu/Menu";
import style from "./CirclePacking.module.scss";
import { CirclePackingTooltip } from "./CirclePackingTooltip";

const { BASE_COLOR, BASE_COLOR_LIGHT, DELETE_COLOR, KEEP_COLOR } = COLORS;

type TagNode = Omit<ComputedDatum<ViewerObject<string>>, "color" | "fill">;

const isMailTagNode = (
    node: TagNode
): node is Omit<ComputedDatum<MailViewerObject<string>>, "color" | "fill"> =>
    isMailViewerObject(node.data);

export const CirclePacking: React.FC = () => {
    const { currentView, computeNextView, restartView } =
        useDomainsYearsMails();

    const { setMainInfos, isInfoFocusKnob, isInfoFocus } = usePstStore(); // TODO: remove PstStore ?

    const {
        setHoveredId,
        addChildrenMarkedToKeep,
        addChildrenMarkedToDelete,
        markedToDelete,
        markedToKeep,
    } = useTagManagerStore();

    useEffect(() => {
        if (!currentView) return;
        const children = currentView.elements.children;

        if (isToDeleteFolder(currentView.elements.id, markedToDelete)) {
            addChildrenMarkedToDelete([
                ...getChildrenToDeleteIds(children, markedToKeep),
                ...getUntagChildrenIds(children, markedToDelete, markedToKeep),
            ]);
        }
        if (isToKeepFolder(currentView.elements.id, markedToKeep)) {
            addChildrenMarkedToKeep([
                ...getChildrenToKeepIds(children, markedToDelete),
                ...getUntagChildrenIds(children, markedToKeep, markedToDelete),
            ]);
        }
    }, [currentView]); // TODO: Investigate

    const getTaggedFilesColor = (
        node: Omit<ComputedDatum<ViewerObject<string>>, "color" | "fill">
    ) => {
        if (node.depth === 0) return BASE_COLOR_LIGHT;

        if (isToDeleteFolder(node.id, markedToDelete)) {
            if (isMailTagNode(node)) {
                return `rgba(247, 94, 66, ${getColorFromTrimester(node)})`; // TODO: magic color
            }
            return DELETE_COLOR;
        }
        if (isToKeepFolder(node.id, markedToKeep)) {
            if (isMailTagNode(node)) {
                return `rgba(98, 188, 111, ${getColorFromTrimester(node)})`;
            }
            return KEEP_COLOR;
        }

        if (isMailTagNode(node)) {
            return `rgba(31, 120, 180, ${getColorFromTrimester(node)})`;
        }

        return BASE_COLOR;
    };

    const handleMouseEnter = debounce(
        (node: ComputedDatum<ViewerObject<string>>) => {
            if (node.data.name === ROOT) {
                setMainInfos((infos) => infos);
                return;
            }
            setMainInfos(node);
            setHoveredId(node.id);
        },
        500
    );

    const handleMouseLeave = () => {
        if (isInfoFocus) return;

        setMainInfos(undefined);
    };

    const handleClick = (node: ComputedDatum<DefaultViewerObject<string>>) => {
        computeNextView(node);

        if (isMailViewerObject(node.data)) isInfoFocusKnob();
    };

    if (!currentView) return null; // TODO: Loader

    return (
        <>
            <div id="circle-packing" className={style["circle-packing"]}>
                <button onClick={restartView}>Restart</button>
                <ResponsiveCirclePacking
                    data={currentView.elements}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    colors={getTaggedFilesColor}
                    tooltip={(node) => <CirclePackingTooltip node={node} />}
                    {...commonProperties}
                />
            </div>
            <Menu />
        </>
    );
};
