import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import {
    isMailMainInfos,
    usePstFMInfosStore,
} from "../../store/PstFMInfosStore";
import { ROOT } from "../../utils/constants";
import type { DashboardComponentProps } from "./Dashboard";
import style from "./Dashboard.module.scss";
import { DashboardInformationsFolder } from "./DashboardInformationsFolder";
import { DashboardInformationsLoader } from "./DashboardInformationsLoader";
import { DashboardInformationsMail } from "./DashboardInformationsMail";

export const DashboardInformations: FC<DashboardComponentProps> = ({
    className,
}) => {
    const { t } = useTranslation();
    const { mainInfos } = usePstFMInfosStore();

    if (!mainInfos || mainInfos.data.name === ROOT)
        return <DashboardInformationsLoader />;

    return (
        <Card
            title={t("dashboard.informations.cardTitle")}
            color="green" // TODO: const
            className={className}
        >
            <div className={style.dashboard__informations}>
                {mainInfos.data.name === ROOT ? (
                    <p>{t("dashboard.informations.emptyInfos")}</p>
                ) : (
                    <ul>
                        {isMailMainInfos(mainInfos) ? (
                            <DashboardInformationsMail mainInfos={mainInfos} />
                        ) : (
                            <DashboardInformationsFolder
                                mainInfos={mainInfos}
                            />
                        )}
                    </ul>
                )}
            </div>
        </Card>
    );
};
