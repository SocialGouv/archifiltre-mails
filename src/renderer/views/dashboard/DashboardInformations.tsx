import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import {
    isMailMainInfos,
    usePstFMInfosStore,
} from "../../store/PstFMInfosStore";
import type { DashboardComponentProps } from "./Dashboard";
import style from "./Dashboard.module.scss";
import { DashboardInformationsFolder } from "./DashboardInformationsFolder";
import { DashboardInformationsMail } from "./DashboardInformationsMail";

export const DashboardInformations: FC<DashboardComponentProps> = ({
    className,
}) => {
    const { t } = useTranslation();
    const { mainInfos } = usePstFMInfosStore();

    return (
        <Card
            title={t("dashboard.informations.cardTitle")}
            color="orange" // TODO: const
            className={className}
        >
            <div className={style.dashboard__informations}>
                <div className={style.dashboard__informations__wrapper}>
                    {mainInfos && isMailMainInfos(mainInfos) ? (
                        <DashboardInformationsMail mainInfos={mainInfos} />
                    ) : (
                        <DashboardInformationsFolder mainInfos={mainInfos} />
                    )}
                </div>
            </div>
        </Card>
    );
};
