import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import { isMailMainInfos, usePstStore } from "../../store/PSTStore";
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
    const { t } = useTranslation();

    if (!mainInfos) return null; // TODO: loader

    return (
        <Card title="Mail" color="grey" className={className}>
            <div className={style.dashboardMail}>
                {isMailMainInfos(mainInfos) ? (
                    <div style={{ overflow: "scroll" }}>
                        {mainInfos.data.email.contentText}
                    </div>
                ) : (
                    <div>{t("dashboard.infos.mailEmpty")}</div>
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
