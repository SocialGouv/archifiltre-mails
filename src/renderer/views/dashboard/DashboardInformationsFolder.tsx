import type { LocaleFileResources } from "@common/i18n/raw";
import { getPercentage } from "@common/utils";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { useBreadcrumbStore } from "../../store/BreadcrumbStore";
import { useAttachmentCountStore } from "../../store/PstAttachmentCountStore";
import { usePstFileSizeStore } from "../../store/PstFileSizeStore";
import type { UsePstMainInfosStore } from "../../store/PstFMInfosStore";
import { useMailCountStore } from "../../store/PstMailCountStore";
import style from "./Dashboard.module.scss";
import { DashboardInformationsLoader } from "./DashboardInformationsLoader";

export type InformationsId = {
    [K in keyof LocaleFileResources["translation"]]: K extends `dashboard.informations.id.${infer R}`
        ? R
        : never;
}[keyof LocaleFileResources["translation"]];

export const DashboardInformationsFolder: FC<{
    mainInfos: UsePstMainInfosStore["mainInfos"];
}> = ({ mainInfos }) => {
    const { t } = useTranslation();

    const { attachmentPerLevel } = useAttachmentCountStore();
    const { totalMailPerLevel } = useMailCountStore();
    const { fileSizePerLevel, totalFileSize } = usePstFileSizeStore();

    const {
        breadcrumb: { id: breadcrumbId, history },
    } = useBreadcrumbStore();

    const infosId = breadcrumbId as InformationsId;
    const currentElementTitle =
        history?.[history.length - 1] ?? t("dashboard.informations.allDomains");

    return (
        <div className={style.dashboard__informations__wrapper__folder}>
            <div
                className={style.dashboard__informations__wrapper__folder__item}
            >
                <div style={{ margin: "0 0 1rem" }}>
                    <strong>
                        {t("dashboard.informations.infosOf")}{" "}
                        {currentElementTitle}
                    </strong>
                </div>
                <div>
                    <span>{t("dashboard.informations.mailCountTotal")} : </span>
                    <span>
                        {totalMailPerLevel[totalMailPerLevel.length - 1]}
                    </span>
                </div>
                <div>
                    <span>{t("dashboard.informations.attachedCount")} : </span>
                    <span>
                        {attachmentPerLevel[attachmentPerLevel.length - 1]}
                    </span>
                </div>
                <div>
                    <span>{t("dashboard.informations.percentage")} : </span>
                    {fileSizePerLevel[fileSizePerLevel.length - 1]} Mo (
                    {getPercentage(
                        fileSizePerLevel[fileSizePerLevel.length - 1] ?? 0,
                        totalFileSize
                    ).toFixed(2)}
                    %)
                </div>
            </div>
            <div
                className={style.dashboard__informations__wrapper__folder__item}
            >
                {!mainInfos ? (
                    <DashboardInformationsLoader />
                ) : (
                    <>
                        <div style={{ margin: "0 0 1rem" }}>
                            <strong>
                                {t("dashboard.informations.elementRollover")} :
                            </strong>
                        </div>
                        <div>
                            <span>
                                {t(`dashboard.informations.id.${infosId}`)} :{" "}
                            </span>
                            <span>{mainInfos.data.name}</span>
                        </div>
                        <div>
                            <span>
                                {t("dashboard.informations.mailCount")} :{" "}
                            </span>
                            <span>{mainInfos.data.size} </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
