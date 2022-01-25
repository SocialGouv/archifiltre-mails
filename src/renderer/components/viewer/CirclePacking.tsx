import { ResponsiveCirclePacking } from "@nivo/circle-packing";
import React from "react";

import { useDomainsYearsMails } from "../../hooks/useDomainsYearMails";
import { useTagManagerStore } from "../../store/TagManagerStore";
import { DELETE_COLOR } from "../../utils/constants";
import { isToDeleteFolder } from "../../utils/pst-extractor";
import { Menu } from "../menu/Menu";
import style from "./CirclePacking.module.scss";
import { commonProperties } from "./CirclePackingViewer";

export const CirclePacking: React.FC = () => {
    const { currentView, computeNextView, restartView } =
        useDomainsYearsMails();

    const { setHoveredId, markedToDelete } = useTagManagerStore();

    // useEffect(() => {
    //     console.log("render");
    // }, [currentView]);

    return (
        <>
            <div id="circle-packing" className={style["circle-packing"]}>
                <button onClick={restartView}>Restart</button>
                <ResponsiveCirclePacking
                    data={currentView.elements}
                    onClick={(node) => {
                        computeNextView(node);
                    }}
                    onMouseEnter={(node) => {
                        setHoveredId(node.id);
                    }}
                    isInteractive={true}
                    colors={(node) => {
                        console.log("ici");
                        if (isToDeleteFolder(node.id, markedToDelete)) {
                            return DELETE_COLOR as string;
                        }
                        return DELETE_COLOR;
                    }}
                    {...commonProperties}
                />
            </div>
            <Menu />
        </>
    );
};
