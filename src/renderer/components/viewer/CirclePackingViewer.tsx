import type { PstContent } from "@common/modules/pst-extractor/type";
import { isPstFolder } from "@common/modules/pst-extractor/type";
import type { Any } from "@common/utils/type";
import type { CirclePackingSvgProps } from "@nivo/circle-packing";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React, { useCallback, useEffect } from "react";

import { useTagManagerStore } from "../../../renderer/store/TagManagerStore";
import { ROOT } from "../../../renderer/utils/constants";
import { getPstComputeChildrenId } from "../../../renderer/utils/tag-manager";
import { usePSTStore } from "../../store/PSTStore";
import type { PstComputed } from "../../utils/pst-extractor";
import { findPstChildById, isToDeleteFolder } from "../../utils/pst-extractor";
import { Menu } from "../menu/Menu";

interface CirclePackingViewerProps {
    pstFile: PstContent | undefined;
}

interface Node {
    id: string;
}

type UpdatePstViewInterface = (node: Node) => void;

// Redeclare because ResponsiveCirclePackingProps is not exported.
type ResponsiveCirclePackingProps<TRawDatum> = Partial<
    Omit<CirclePackingSvgProps<TRawDatum>, "data" | "height" | "width">
> &
    Pick<CirclePackingSvgProps<TRawDatum>, "data">;

type CirclePackingCommonProps = Partial<
    ResponsiveCirclePackingProps<PstComputed>
> & {
    id: keyof PstContent;
    value: keyof PstContent;
};

const commonProperties: CirclePackingCommonProps = {
    colors: { scheme: "paired" },
    enableLabels: true,
    id: "id",
    label: (node) => node.data.name,
    labelsFilter: (label) => label.node.height === 0,
    labelsSkipRadius: 16,
    motionConfig: "slow",
    padding: 2,
    value: "size",
};

export const CirclePackingViewer: React.FC<CirclePackingViewerProps> = ({
    pstFile,
}) => {
    const { computedPst, updateComputedPst, setMainInfos, setDepth } =
        usePSTStore();

    const { setHoveredId, markedToDelete, addChildrenMarkedToDelete } =
        useTagManagerStore();

    const updatePstView = useCallback<UpdatePstViewInterface>(
        (node: Node) => {
            if (node.id === ROOT) return;

            const child = findPstChildById(pstFile, node.id);
            if (child && isPstFolder(child)) {
                updateComputedPst(child, node.id);
                setDepth((depth: number) => depth + 1);
            }
        },
        [pstFile, updateComputedPst, setDepth]
    );

    const updateMainInfos: NonNullable<
        CirclePackingCommonProps["onMouseEnter"]
    > = useCallback(
        (node) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            setMainInfos(node.data as Any);
            setHoveredId(node.id);
        },
        [setMainInfos, setHoveredId]
    );

    const emptyMaininfos = useCallback(() => {
        setMainInfos(undefined);
    }, [setMainInfos]);

    useEffect(() => {
        if (computedPst && isToDeleteFolder(computedPst.id, markedToDelete)) {
            addChildrenMarkedToDelete(
                getPstComputeChildrenId(computedPst.children)
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [computedPst]);

    if (!computedPst) return null;

    const borderColor = isToDeleteFolder(computedPst.id, markedToDelete)
        ? "red"
        : "transparent";

    return (
        <>
            <ResponsiveCirclePacking
                data={computedPst}
                onClick={updatePstView}
                onMouseEnter={updateMainInfos}
                onMouseLeave={emptyMaininfos}
                borderColor={borderColor}
                borderWidth={3}
                isInteractive={true}
                {...commonProperties}
            />

            <Menu />
        </>
    );
};
