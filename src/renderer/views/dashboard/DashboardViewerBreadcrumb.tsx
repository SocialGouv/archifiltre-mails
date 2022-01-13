import React from "react";

import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";

export const DashboardViewerBreadcrumb: React.FC = () => {
    const { depth } = usePstStore();
    return (
        <div className={style.dashboard__viewer__breadcrumb}>
            <div className={style.dashboard__viewer__breadcrumb__item}>
                Niveau: {depth}
            </div>
        </div>
    );
};
