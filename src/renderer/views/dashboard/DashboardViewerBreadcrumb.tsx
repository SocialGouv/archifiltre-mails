import React from "react";

import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";

export const DashboardViewerBreadcrumb: React.FC = () => {
    const { breadcrumb } = usePstStore();
    return (
        <div className={style.dashboard__viewer__breadcrumb}>
            <div
                data-i18n="TODO"
                className={style.dashboard__viewer__breadcrumb__item}
            >
                Niveau: {breadcrumb}
            </div>
        </div>
    );
};
