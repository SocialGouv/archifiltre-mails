import type { Dispatch } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import style from "./Dashboard.module.scss";

interface DashboardViewerSelectorProps {
    active: number;
    updateActive: Dispatch<number>;
}

export const DashboardViewerSelector: React.FC<
    DashboardViewerSelectorProps
> = ({ updateActive, active }) => {
    const { t } = useTranslation();
    return (
        <div className={style.dashboard__viewer__selector}>
            <button
                className={active === 0 ? `${style.active}` : ""}
                onClick={() => {
                    updateActive(0);
                }}
            >
                {t("dashboard.viewer.selector.packing")}
            </button>
            <button
                className={active === 1 ? `${style.active}` : ""}
                onClick={() => {
                    updateActive(1);
                }}
            >
                {t("dashboard.viewer.selector.hierarchy")}
            </button>
            <button
                className={active === 2 ? `${style.active}` : ""}
                onClick={() => {
                    updateActive(2);
                }}
            >
                {t("dashboard.viewer.selector.tree")}
            </button>
        </div>
    );
};
