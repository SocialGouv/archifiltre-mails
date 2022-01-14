import React from "react";

import { ROOT } from "../../../renderer/utils/constants";
import { usePstStore } from "../../store/PSTStore";
import style from "./CirclePacking.module.scss";
import { CirclePackingViewer } from "./CirclePackingViewer";

export const CirclePacking: React.FC = () => {
    const { pstFile } = usePstStore();
    const { updateComputedPst, setDepth } = usePstStore();

    const restartViewer = () => {
        if (pstFile) {
            updateComputedPst(pstFile, ROOT);
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
