import React from "react";

import style from "./Dashboard.module.scss";
import { DashboardActions } from "./DashboardActions";
import { DashboardViewer } from "./DashboardViewer";

export interface DashboardComponentProps {
    className?: string;
}

export const Dashboard: React.FC = () => {
    return (
        <div className={style.dashboard}>
            <div className={style.dashboard__header}>
                <DashboardActions />
                {/* <DashboardImpact /> */}
            </div>
            <div className={style.dashboard__cards}>
                <DashboardViewer />
                <div className={style.dashboardInfos}>
                    {/* <DashboardRecap /> */}
                    {/* <DashboardInformations /> */}
                </div>
            </div>
        </div>
    );
};
