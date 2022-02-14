import React from "react";

import { useBreadcrumbStore } from "../../store/BreadcrumbStore";
import style from "./Dashboard.module.scss";

export const DashboardViewerBreadcrumb: React.FC = () => {
    const { breadcrumb } = useBreadcrumbStore();
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
