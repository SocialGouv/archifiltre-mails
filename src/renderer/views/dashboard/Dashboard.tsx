import { atom, useAtom } from "jotai";
import type { FC } from "react";
import React from "react";

import style from "./Dashboard.module.scss";
import { DashboardActions } from "./DashboardActions";
import { DashboardImpact } from "./DashboardImpact";
import { DashboardInformations } from "./DashboardInformations";
import { DashboardRecap } from "./DashboardRecap";
import { DashboardVizualisation } from "./DashboardVizualisation";

const atomValue = atom(1);

export const Dashboard: FC = () => {
    const [atom1] = useAtom(atomValue);
    console.log(atom1);

    return (
        <div className={style.dashboard}>
            <DashboardActions />
            <div className={style.dashboard__cards}>
                <DashboardVizualisation />

                <div className={style.dashboard__informations}>
                    <DashboardRecap />
                    <DashboardInformations />
                    <DashboardImpact />
                </div>
            </div>
        </div>
    );
};
