import React from "react";

import { usePSTExtractor } from "../../../renderer/hooks/usePSTExtractor";
import { usePathContext } from "../../context/PathContext";
import style from "./CirclePacking.module.scss";
import { CirclePackingLoading } from "./CirclePackingLoading";
import { CirclePackingVizualiser } from "./CirclePackingVizualiser";

export const CirclePacking: React.FC = () => {
    const { pstProgress, extractedFile } = usePSTExtractor();

    // testing purpose
    const { changePath } = usePathContext();
    const updatePath = () => {
        changePath("/Users/mehdi/Documents/PST/sample-m-.pst");
    };
    //

    return (
        <div className={style["circle-packing"]}>
            {extractedFile ? (
                <CirclePackingVizualiser extractedFile={extractedFile} />
            ) : (
                <CirclePackingLoading {...pstProgress} />
            )}

            <button
                style={{ position: "absolute", right: 0, top: 0 }}
                onClick={updatePath}
            >
                Update path
            </button>
        </div>
    );
};
