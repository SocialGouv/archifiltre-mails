import React from "react";

import { CirclePacking } from "../../../renderer/components/vizualisation/CirclePacking";
import style from "./Dashboard.module.scss";

export const DashboardVizualisationCircle: React.FC = () => (
    <div className={style.dashboard__vizualisation__circle}>
        <CirclePacking />
    </div>
);
