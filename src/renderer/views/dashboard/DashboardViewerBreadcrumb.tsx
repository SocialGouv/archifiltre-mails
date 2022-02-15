import React from "react";
import { useTranslation } from "react-i18next";

import { useBreadcrumbStore } from "../../store/BreadcrumbStore";
import style from "./Dashboard.module.scss";

export const DashboardViewerBreadcrumb: React.FC = () => {
    const { t } = useTranslation();
    const { breadcrumb } = useBreadcrumbStore();
    return (
        <div className={style.dashboard__viewer__breadcrumb}>
            <div className={style.dashboard__viewer__breadcrumb__item}>
                {t("dashboard.viewer.breadcrumb.level")}: {breadcrumb}
            </div>
        </div>
    );
};
