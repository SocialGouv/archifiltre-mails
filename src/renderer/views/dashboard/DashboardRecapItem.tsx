import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import style from "./Dashboard.module.scss";

export interface DashboardRecapItemProps {
    picto?: React.ReactElement;
    title: string;
    mails?: number | undefined;
    attachements?: number;
    percentage?: string;
    contact?: number;
}

export const DashboardRecapItem: FC<DashboardRecapItemProps> = ({
    title,
    mails,
    attachements,
    percentage,
    contact,
    picto,
}) => {
    const { t } = useTranslation();

    return (
        <div className={style.dashboard__recap__item}>
            <div className={style.dashboard__recap__picto}>{picto}</div>
            {contact ? (
                <div className={style.dashboard__recap__informations}>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {title}
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {contact} {t("dashboard.recap.contacts")}
                    </span>
                </div>
            ) : (
                <div className={style.dashboard__recap__informations}>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {title}
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {percentage} %
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {mails ?? 0} {t("dashboard.recap.mails")}
                    </span>
                    <span
                        className={style.dashboard__recap__informations__item}
                    >
                        {attachements} {t("dashboard.recap.pc")}
                    </span>
                </div>
            )}
        </div>
    );
};
