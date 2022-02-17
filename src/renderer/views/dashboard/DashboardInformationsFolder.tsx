import type { LocaleFileResources } from "@common/i18n/raw";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { Loader } from "../../components/common/loader";
import { useBreadcrumbStore } from "../../store/BreadcrumbStore";
import type { UsePstMainInfosStore } from "../../store/PstFMInfosStore";

export type InformationsId = {
    [K in keyof LocaleFileResources["translation"]]: K extends `dashboard.informations.id.${infer R}`
        ? R
        : never;
}[keyof LocaleFileResources["translation"]];

export const DashboardInformationsFolder: FC<{
    mainInfos: UsePstMainInfosStore["mainInfos"];
}> = ({ mainInfos }) => {
    const { t } = useTranslation();

    const {
        breadcrumb: { id: breadcrumbId },
    } = useBreadcrumbStore();

    const infosId = breadcrumbId as InformationsId;

    if (!mainInfos) return <Loader />;

    return (
        <>
            <div>
                <strong>{t("dashboard.informations.type")} </strong>
                {t(`dashboard.informations.id.${infosId}`)}
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
