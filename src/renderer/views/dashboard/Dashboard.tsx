import React from "react";

import style from "./Dashboard.module.scss";
import { DashboardActions } from "./DashboardActions";
import { DashboardImpact } from "./DashboardImpact";
import { DashboardInformations } from "./DashboardInformations";
import { DashboardRecap } from "./DashboardRecap";
import { DashboardViewer } from "./DashboardViewer";

export const Dashboard: React.FC = () => {
    return (
        <div className={style.dashboard}>
            <DashboardActions />
            <div className={style.dashboard__cards}>
                <DashboardViewer />

                <div className={style.dashboard__infos}>
                    <DashboardRecap />
                    <DashboardInformations />
                    <DashboardImpact />
                </div>
            </div>
        </div>
    );
};
