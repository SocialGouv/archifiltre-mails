import type { ComputedDatum } from "@nivo/circle-packing";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import debounce from "lodash/debounce";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import type { CustomContextMenuMouseEvent } from "../../hooks/useContextMenuEventAsClick";
import { useContextMenuEventAsClick } from "../../hooks/useContextMenuEventAsClick";
import { useDymViewerNavigation } from "../../hooks/useDymViewerNavigation";
import { usePstContentCounterPerLevel } from "../../store/PstContentCounterPerLevelStore";
import { usePstFMInfosStore } from "../../store/PstFMInfosStore";
import { tagManagerStore } from "../../store/TagManagerStore";
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
import { getNodeContainsIds } from "../../utils/tag-manager";
import { TagManagerMenu } from "../menu/TagManagerMenu";
import style from "./CirclePacking.module.scss";
import type { OnBlur } from "./CirclePackingCancellableFocusZone";
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
    const circlePackingRef = useRef<HTMLDivElement>(null);
    const {
        viewList,
        currentViewIndex,
        computeNextView,
        resetView,
        computePreviousView,
    } = useDymViewerNavigation();

    const { setMainInfos, startFocus, isInfoFocus, mainInfos, cancelFocus } =
        usePstFMInfosStore();
    const { setHoveredNode, keepIds, deleteIds } = tagManagerStore();

    useContextMenuEventAsClick(circlePackingRef.current);

    const [anchorX, setAnchorX] = useState(0);
    const [anchorY, setAnchorY] = useState(0);
    const [show, setShow] = useState(false);

    const currentView = viewList[currentViewIndex];

    usePstContentCounterPerLevel();

    const getTaggedFilesColor = (
        node: Omit<ComputedDatum<ViewerObject<string>>, "color" | "fill">
    ) => {
        if (isMailTagNode(node)) {
            return getTagColor(node, "untag");
        }

        if (node.depth === 0) return BASE_COLOR_LIGHT;

        const nodeDeletedIds = getNodeContainsIds(deleteIds, node.data.ids);
        const nodeKeepIds = getNodeContainsIds(keepIds, node.data.ids);

        const color =
            nodeDeletedIds.length >= nodeKeepIds.length
                ? DELETE_COLOR
                : KEEP_COLOR;

        if (nodeDeletedIds.length || nodeKeepIds.length) {
            return color;
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
    }, 500);

    const handleMouseLeave: CirclePackingCommonProps["onMouseLeave"] = () => {
        if (isInfoFocus) return;

        setMainInfos(undefined);
    };

    const handleClick: CirclePackingCommonProps["onClick"] = (node, event) => {
        const nativeEvent = event.nativeEvent as CustomContextMenuMouseEvent;

        const customData = nativeEvent._customData;

        if (customData?.contextMenu) {
            setAnchorX(event.clientX);
            setAnchorY(event.clientY);
            setShow(true);
            setHoveredNode(node);
        } else {
            if (isMailViewerObject(node.data)) {
                setMainInfos(node);
                startFocus();
                return;
            }

            computeNextView(node);
        }
    };

    const handleLostFocus = debounce<NonNullable<OnBlur["onBlur"]>>((evt) => {
        const elt = document.elementFromPoint(evt.clientX, evt.clientY);

        elt?.dispatchEvent(
            new MouseEvent(
                "click", // or "mousedown" if the canvas listens for such an event
                {
                    bubbles: true,
                    clientX: evt.clientX,
                    clientY: evt.clientY,
                }
            )
        );
    }, 200);

    const handleBorderColor: CirclePackingCommonProps["borderColor"] = (node) =>
        handleFocusItemBorderColor(node, mainInfos, isInfoFocus);

    const goToPreviousView = () => {
        computePreviousView();
    };

    const goToInitialView = () => {
        cancelFocus();
        resetView();
    };

    if (!currentView) return null;

    return (
        <>
            <div
                id="circle-packing"
                className={style["circle-packing"]}
                ref={circlePackingRef}
            >
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
            <CirclePackingCancellableFocusZone onBlur={handleLostFocus} />
            <TagManagerMenu
                anchorX={anchorX}
                anchorY={anchorY}
                show={show}
                setShow={setShow}
            />
        </>
    );
};
