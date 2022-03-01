/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { ComputedDatum } from "@nivo/circle-packing";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import debounce from "lodash/debounce";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useDymViewerNavigation } from "../../hooks/useDymViewerNavigation";
import { usePstFMInfosStore } from "../../store/PstFMInfosStore";
import { useTagManagerStore } from "../../store/TagManagerStore";
import { COLORS, ROOT } from "../../utils/constants";
import type { CirclePackingCommonProps } from "../../utils/dashboard-viewer";
import {
    commonProperties,
    getTagColor,
    handleFocusItemBorderColor,
} from "../../utils/dashboard-viewer";
import type {
    MailViewerObject,
    ViewerObject,
} from "../../utils/dashboard-viewer-dym";
import { isMailViewerObject } from "../../utils/dashboard-viewer-dym";
import {
    getChildrenToDeleteIds,
    getChildrenToKeepIds,
    getUntagChildrenIds,
    isToDeleteFolder,
    isToKeepFolder,
} from "../../utils/tag-manager";
import { Menu } from "../menu/Menu";
import style from "./CirclePacking.module.scss";
import { CirclePackingCancellableFocusZone } from "./CirclePackingCancellableFocusZone";
import { CirclePackingTooltip } from "./CirclePackingTooltip";

const { BASE_COLOR, BASE_COLOR_LIGHT, DELETE_COLOR, KEEP_COLOR } = COLORS;

type TagNode = Omit<ComputedDatum<ViewerObject<string>>, "color" | "fill">;

const isMailTagNode = (
    node: TagNode
): node is Omit<ComputedDatum<MailViewerObject<string>>, "color" | "fill"> =>
    isMailViewerObject(node.data);

export const CirclePacking: React.FC = () => {
    const { t } = useTranslation();
    const { currentView, computeNextView, restartView, computePreviousView } =
        useDymViewerNavigation();

    const { setMainInfos, startFocus, isInfoFocus, mainInfos, cancelFocus } =
        usePstFMInfosStore();

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
                return getTagColor(node, "delete");
            }
            return DELETE_COLOR;
        }
        if (isToKeepFolder(node.id, markedToKeep)) {
            if (isMailTagNode(node)) {
                return getTagColor(node, "keep");
            }
            return KEEP_COLOR;
        }

        if (isMailTagNode(node)) {
            return getTagColor(node, "untag");
        }

        return BASE_COLOR;
    };

    const handleMouseEnter = debounce<
        NonNullable<CirclePackingCommonProps["onMouseEnter"]>
    >((node) => {
        if (isInfoFocus) return;

        if (node.data.name === ROOT) {
            setMainInfos((infos) => infos);
            return;
        }

        setMainInfos(node);
        setHoveredId(node.id);
    }, 500);

    const handleMouseLeave: CirclePackingCommonProps["onMouseLeave"] = () => {
        if (isInfoFocus) return;

        setMainInfos(undefined);
    };

    const handleClick: CirclePackingCommonProps["onClick"] = (node) => {
        if (isMailViewerObject(node.data)) startFocus();

        computeNextView(node);
    };

    const handleBorderColor: CirclePackingCommonProps["borderColor"] = (node) =>
        handleFocusItemBorderColor(node, mainInfos, isInfoFocus);

    const goToPreviousView = () => {
        computePreviousView();
    };

    const goToInitialView = () => {
        cancelFocus();
        restartView();
    };

    if (!currentView) return null;

    return (
        <>
            <div id="circle-packing" className={style["circle-packing"]}>
                <ResponsiveCirclePacking
                    data={currentView.elements}
                    onClick={handleClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    colors={getTaggedFilesColor}
                    borderColor={handleBorderColor}
                    tooltip={(node) => <CirclePackingTooltip node={node} />}
                    {...commonProperties}
                />
                <div className={style.circlePackingActionsButton}>
                    <button onClick={goToPreviousView}>
                        {t("dashboard.viewer.previous")}
                    </button>
                    <button onClick={goToInitialView}>
                        {t("dashboard.viewer.restart")}
                    </button>
                </div>
            </div>
            <CirclePackingCancellableFocusZone />
            <Menu />
        </>
    );
};
