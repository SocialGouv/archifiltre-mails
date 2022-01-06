import type { PstContent } from "@common/modules/pst-extractor/type";
import type { ComputedDatum } from "@nivo/circle-packing";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React, { useCallback } from "react";

import { useTagManagerStore } from "../../../renderer/store/TagManagerStore";
import { usePSTStore } from "../../store/PSTStore";
import { findPstChildById } from "../../utils/pst-extractor";
import { Menu } from "../menu/Menu";

interface CirclePackingViewerProps {
    pstFile: PstContent | undefined;
}

interface Node {
    id: string;
}

type UpdatePstViewInterface = (node: Node) => void;

type CirclePackingCommonProps = Partial<
    Parameters<typeof ResponsiveCirclePacking>[0]
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

    const { setHoveredId } = useTagManagerStore();

    const updatePstView = useCallback<UpdatePstViewInterface>(
        (node: Node) => {
            if (node.id === "rootId") return;

            const child = findPstChildById(pstFile, node.id);
            updateComputedPst(child);
            setDepth((depth: number) => depth + 1);
        },
        [pstFile, updateComputedPst, setDepth]
    );

    const updateMainInfos = useCallback(
        (node: ComputedDatum<unknown>) => {
            setMainInfos(node.data);
            setHoveredId(node.id);
        },
        [setMainInfos, setHoveredId]
    );

    const emptyMaininfos = useCallback(() => {
        setMainInfos(undefined);
    }, [setMainInfos]);
    return (
        <>
            <ResponsiveCirclePacking
                data={computedPst}
                onClick={updatePstView}
                onMouseEnter={updateMainInfos}
                onMouseLeave={emptyMaininfos}
                isInteractive={true}
                {...commonProperties}
            />

            <Menu />
        </>
    );
};
