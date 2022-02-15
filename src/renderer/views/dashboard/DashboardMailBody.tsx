import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import {
    isMailMainInfos,
    usePstFMInfosStore,
} from "../../store/PstFMInfosStore";
import type { DashboardComponentProps } from "./Dashboard";
import style from "./Dashboard.module.scss";

export const DashboardMailBody: React.FC<DashboardComponentProps> = ({
    className,
}) => {
    const { mainInfos } = usePstFMInfosStore();
    const { t } = useTranslation();

    if (!mainInfos) return null;

    return (
        <Card title="Mail" color="grey" className={className}>
            <div className={style.dashboardMail}>
                {isMailMainInfos(mainInfos) ? (
                    <div style={{ overflow: "scroll" }}>
                        {mainInfos.data.email.contentText}
                    </div>
                ) : (
                    <div>{t("dashboard.informations.mailEmpty")}</div>
                )}
            </div>
        </Card>
    );
};
