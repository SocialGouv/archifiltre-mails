import React from "react";

import { CirclePacking } from "../../components/viewer/CirclePacking";
import style from "./Dashboard.module.scss";

export const DashboardViewerCircle: React.FC = () => (
    <div className={style.dashboard__vizualisation__circle}>
        <CirclePacking />
    </div>
);
