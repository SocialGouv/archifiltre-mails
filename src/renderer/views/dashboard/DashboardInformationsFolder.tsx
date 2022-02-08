import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import type { UsePstStore } from "../../store/PSTStore";

export const DashboardInformationsFolder: FC<{
    mainInfos: NonNullable<UsePstStore["mainInfos"]>; // TODO: remove non null or handle loader
}> = ({ mainInfos }) => {
    const { t } = useTranslation();

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
