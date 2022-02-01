import type { ComputedDatum } from "@nivo/circle-packing";
import React from "react";
import type { PstComputed } from "src/renderer/utils/pst-extractor";

import style from "./CirclePacking.module.scss";

export const CirclePackingTooltip: React.FC<{
    node: ComputedDatum<PstComputed>;
}> = ({ node }) => {
    return (
        <div className={style.circlePackingTooltip}>
            <strong>{node.data.name}</strong>: {node.percentage.toFixed(2)}%
        </div>
    );
};
