import React from "react";

import { Card } from "../../components/common/card/Card";
import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";
import { DashboardActions } from "./DashboardActions";
import { DashboardImpact } from "./DashboardImpact";
import { DashboardInformations } from "./DashboardInformations";
import { DashboardRecap } from "./DashboardRecap";
import { DashboardViewer } from "./DashboardViewer";

export interface DashboardComponentProps {
    className?: string;
}

export const DashboardMailBody: React.FC<DashboardComponentProps> = ({
    className,
}) => {
    const { mainInfos } = usePstStore();

    return (
        <Card title="Mail" color="grey" className={className}>
            <div className={style.dashboardMail}>
                {mainInfos && mainInfos.email ? (
                    <div style={{ overflow: "scroll" }}>
                        {mainInfos.email.contentText}
                    </div>
                ) : (
                    <div>Empty</div>
                )}
            </div>
        </Card>
    );
};

export const Dashboard: React.FC = () => {
    return (
        <div className={style.dashboard}>
            <DashboardActions />
            <div className={style.dashboard__cards}>
                <DashboardViewer />
                <DashboardImpact />
                <div className={style.dashboardInfos}>
                    <DashboardRecap />
                    <DashboardInformations />
                    <DashboardMailBody />
                </div>
            </div>
        </div>
    );
};
