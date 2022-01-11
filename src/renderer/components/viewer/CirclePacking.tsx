import React from "react";

import { usePSTStore } from "../../store/PSTStore";
import style from "./CirclePacking.module.scss";
import { CirclePackingViewer } from "./CirclePackingViewer";

export const CirclePacking: React.FC = () => {
    const { pstFile } = usePSTStore();
    const { updateComputedPst, setDepth } = usePSTStore();

    const restartViewer = () => {
        if (pstFile) {
            updateComputedPst(pstFile);
            setDepth(1);
        }
    };

    return (
        <div id="circle-packing" className={style["circle-packing"]}>
            <button onClick={restartViewer}>Restart</button>
            <CirclePackingViewer pstFile={pstFile} />
        </div>
    );
};