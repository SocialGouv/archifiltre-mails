import type { PstContent } from "@common/modules/pst-extractor/type";
import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React, { useCallback, useState } from "react";
// import type { ResponsiveCirclePackingCanvas } from "@nivo/circle-packing";

interface CirclePackingVizualiserProps {
    extractedFile: PstContent;
}

interface Node {
    id: string;
}

type ZoomFunction = (node: Node) => void;

type CirclePackingCommonProps = Partial<
    Parameters<typeof ResponsiveCirclePacking>[0]
> & {
    id: keyof PstContent;
    value: keyof PstContent;
};

const commonProperties: CirclePackingCommonProps = {
    enableLabels: true,
    id: "id",
    labelsSkipRadius: 16,
    motionConfig: "slow",
    padding: 2,
    value: "size",
};

export const CirclePackingVizualiser: React.FC<
    CirclePackingVizualiserProps
> = ({ extractedFile }) => {
    const [zoomedId, setZoomedId] = useState<string>("");

    const zoom = useCallback<ZoomFunction>(
        (node: Node) => {
            setZoomedId(zoomedId === node.id ? "" : node.id);
        },
        [zoomedId]
    );
    return (
        <ResponsiveCirclePacking
            data={extractedFile}
            labelsFilter={(label) => label.node.height === 0}
            zoomedId={zoomedId}
            onClick={zoom}
            {...commonProperties}
        />
    );
};
