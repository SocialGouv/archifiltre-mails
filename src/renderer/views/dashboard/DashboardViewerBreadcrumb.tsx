import React from "react";
import { useTranslation } from "react-i18next";

import {
    makeBreadcrumb,
    useBreadcrumbStore,
} from "../../store/BreadcrumbStore";
import style from "./Dashboard.module.scss";

export const DashboardViewerBreadcrumb: React.FC = () => {
    const { t } = useTranslation();
    const { breadcrumb } = useBreadcrumbStore({allowUpdate: true});

    return (
        <div className={style.dashboard__viewer__breadcrumb}>
            <div className={style.dashboard__viewer__breadcrumb__item}>
                <span
                    className={style.dashboard__viewer__breadcrumb__item__level}
                    style={{ fontWeight: 600 }}
                >
                    {t("dashboard.viewer.breadcrumb.level")}
                </span>
                &nbsp;
                {makeBreadcrumb(breadcrumb)}
            </div>
        </div>
    );
};
