import type { LocaleFileResources } from "@common/i18n/raw";
import { getPercentage } from "@common/utils";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { useBreadcrumbStore } from "../../store/BreadcrumbStore";
import { pstContentCounterPerLevelStore } from "../../store/PstContentCounterPerLevelStore";
import type { UsePstMainInfosStore } from "../../store/PstFMInfosStore";
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
    const { totalMail, totalAttachment, totalArchiveSize, totalFilesize } =
        pstContentCounterPerLevelStore();
    // const { fileSizePerLevel, totalFileSize } = usePstFileSizeStore();

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
                    <span>{t("dashboard.informations.mailCountTotal")} </span>
                    <span>{totalMail[totalMail.length - 1]}</span>
                </div>
                <div>
                    <span>{t("dashboard.informations.attachementCount")} </span>
                    <span>{totalAttachment[totalAttachment.length - 1]}</span>
                </div>
                <div>
                    <span>{t("dashboard.informations.percentage")} </span>
                    {totalFilesize[totalFilesize.length - 1]} Mo (
                    {getPercentage(
                        totalFilesize[totalFilesize.length - 1] ?? 1,
                        totalArchiveSize
                    )}
                    %)
                    {/* {fileSizePerLevel[fileSizePerLevel.length - 1]} Mo (
                    {getPercentage(
                        fileSizePerLevel[fileSizePerLevel.length - 1] ?? 0,
                        totalFileSize
                    )}
                    %) */}
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
                                {t("dashboard.informations.elementRollover")}
                            </strong>
                        </div>
                        <div>
                            <span>
                                {t(`dashboard.informations.id.${infosId}`)}{" "}
                            </span>
                            <span>{mainInfos.data.name}</span>
                        </div>
                        <div>
                            <span>
                                {t("dashboard.informations.mailCount")}{" "}
                            </span>
                            <span>{mainInfos.data.size} </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
