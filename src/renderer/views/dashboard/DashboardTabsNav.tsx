/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";

import { GENERAL, VIZUALISATION } from "../../utils/constants";
import style from "./DashboardTabsNav.module.scss";

interface DashboardTabsNavigationProps {
    changeTab: (nextTab: string) => void;
}

const labelTabs = [GENERAL, VIZUALISATION];

export const DashboardTabsNav: React.FC<DashboardTabsNavigationProps> = ({
    changeTab,
}) => {
    return (
        <nav id={style["dashboard-nav"]}>
            {labelTabs.map((labelTab, index) => (
                <button
                    className={style["dashboard-nav-item"]}
                    onClick={() => {
                        changeTab(labelTab);
                    }}
                    key={index}
                >
                    {labelTab}
                </button>
            ))}
        </nav>
    );
};
