import React from "react";

import style from "./Dashboard.module.scss";

export const DashboardVizualisationBreadcrumb: React.FC = () => (
    <div className={style.dashboard__vizualisation__breadcrumb}>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Home
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 1
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 2
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 3
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 4
        </div>
        <div className={style.dashboard__vizualisation__breadcrumb__item}>
            Niveau 5
        </div>
    </div>
);
