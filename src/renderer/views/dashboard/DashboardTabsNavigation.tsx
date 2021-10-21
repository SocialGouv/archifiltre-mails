/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from "react";

import {
    AUDIT,
    ENRICHMENT,
    GENERAL,
    REDUNDANCE,
} from "../../../common/constants";
import style from "./DashboardTabsNavigation.module.scss";

interface DashboardTabsNavigationProps {
    changeTab: (nextTab: string) => void;
}

const navItems = [GENERAL, ENRICHMENT, AUDIT, REDUNDANCE];

export const DashboardTabsNavigation: React.FC<DashboardTabsNavigationProps> =
    ({ changeTab }) => {
        return (
            <nav id={style["dashboard-nav"]}>
                {navItems.map((item, index) => (
                    <button
                        className={style["dashboard-nav-item"]}
                        onClick={() => {
                            changeTab(item);
                        }}
                        // style={{ background: colorTabsPalette[index] }}
                        // data-color={colorTabsPalette[index]}
                        key={index}
                    >
                        {item}
                    </button>
                ))}
            </nav>
        );
    };
