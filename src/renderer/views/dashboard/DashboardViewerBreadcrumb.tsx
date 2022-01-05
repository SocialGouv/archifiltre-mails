import React from "react";

import { usePSTStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";

export const DashboardViewerBreadcrumb: React.FC = () => {
    const { depth } = usePSTStore();
    return (
        <div className={style.dashboard__viewer__breadcrumb}>
            <div className={style.dashboard__viewer__breadcrumb__item}>
                Niveau: {depth}
            </div>
        </div>
    );
};
