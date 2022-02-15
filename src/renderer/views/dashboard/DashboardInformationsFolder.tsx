import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { Loader } from "../../components/common/loader";
import type { UsePstMainInfosStore } from "../../store/PstFMInfosStore";

export const DashboardInformationsFolder: FC<{
    mainInfos: UsePstMainInfosStore["mainInfos"];
}> = ({ mainInfos }) => {
    const { t } = useTranslation();
    if (!mainInfos) return <Loader />;

    return (
        <>
            <div>
                <strong>{t("dashboard.informations.type")} </strong>
                {t("dashboard.informations.folder")}
            </div>
            <div>
                <strong>{t("dashboard.informations.title")} </strong>
                {mainInfos.data.name}
            </div>
            <div>
                <strong>{t("dashboard.informations.mailCount")} </strong>
                {mainInfos.data.size}
            </div>
            <div>
                <strong>{t("dashboard.informations.attachedCount")} </strong>?
            </div>
            <div>
                <strong>{t("dashboard.informations.percentage")} </strong>
                {mainInfos.percentage.toFixed(1)}
            </div>
        </>
    );
};
