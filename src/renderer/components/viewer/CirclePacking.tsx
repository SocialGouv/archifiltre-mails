import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React from "react";

import { useDomainsYearsMails } from "../../hooks/useDomainsYearMails";
import style from "./CirclePacking.module.scss";
import { commonProperties } from "./CirclePackingViewer";

export const CirclePacking: React.FC = () => {
    const { currentView, computeNextView, restartView } =
        useDomainsYearsMails();

    return (
        <div id="circle-packing" className={style["circle-packing"]}>
            <button onClick={restartView}>Restart</button>
            <ResponsiveCirclePacking
                data={currentView.elements}
                onClick={computeNextView}
                isInteractive={true}
                {...commonProperties}
            />
        </div>
    );
};
