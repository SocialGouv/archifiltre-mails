import React, { useCallback, useState } from "react";

import type { VIZUALISATION } from "../../../renderer/utils/constants";
import { TitleH1 } from "../../components/common/title/Title";
import { CirclePacking } from "../../components/vizualisation/CirclePacking";
import style from "./Dashboard.module.scss";

export const DashboardVizualisation: React.FC = () => {
    const [vizualisation, setVizualisation] = useState<
        VIZUALISATION | undefined
    >(undefined);
    const IS_CIRCLE_PACKING = vizualisation === "vizualisation.circle-packing";

    const openCirclePackingVizualisation = useCallback(() => {
        setVizualisation("vizualisation.circle-packing");
    }, []);

    const closeVizualisation = useCallback(() => {
        setVizualisation(undefined);
    }, []);

    return (
        <div className={style.general}>
            <TitleH1 title="Visualiser mon archive" />
            {/* TODO: Add card or button to open data-viz. Next PR */}
            <button onClick={openCirclePackingVizualisation}>
                Open Circle Packing Vizualisation
            </button>{" "}
            {IS_CIRCLE_PACKING && <CirclePacking closer={closeVizualisation} />}
        </div>
    );
};
