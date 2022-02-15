import React from "react";
import { useTranslation } from "react-i18next";

import { useBreadcrumbStore } from "../../store/BreadcrumbStore";
import style from "./Dashboard.module.scss";

const convertHistory = (history: string[]) => ({
    correspondant: history[1]!,
    domain: history[0]!,
    year: history[2]!,
});

export const DashboardViewerBreadcrumb: React.FC = () => {
    const { t } = useTranslation();
    const { breadcrumb } = useBreadcrumbStore();
    return (
        <div className={style.dashboard__viewer__breadcrumb}>
            <div className={style.dashboard__viewer__breadcrumb__item}>
                {t("dashboard.viewer.breadcrumb.level")}:&nbsp;
                {t(`dashboard.viewer.breadcrumb.id.${breadcrumb.id}`, {
                    history: convertHistory(breadcrumb.history ?? []),
                })}
            </div>
        </div>
    );
};
