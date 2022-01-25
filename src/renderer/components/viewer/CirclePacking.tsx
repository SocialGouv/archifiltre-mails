import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React from "react";

import { useDomainsYearsMails } from "../../hooks/useDomainsYearMails";
import { useTagManagerStore } from "../../store/TagManagerStore";
import { Menu } from "../menu/Menu";
import style from "./CirclePacking.module.scss";
import { commonProperties } from "./CirclePackingViewer";

export const CirclePacking: React.FC = () => {
    const { currentView, computeNextView, restartView } =
        useDomainsYearsMails();

    const { setHoveredId, markedToDelete, hoveredId } = useTagManagerStore();

    return (
        <div id="circle-packing" className={style["circle-packing"]}>
            <button onClick={restartView}>Restart</button>
            <ResponsiveCirclePacking
                data={currentView.elements}
                onClick={computeNextView}
                isInteractive={true}
                onMouseEnter={(node) => {
                    setHoveredId(node.id);
                }}
                {...commonProperties}
            />
            <Menu />
        </div>
    );
};
