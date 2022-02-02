import type { FC } from "react";
import React from "react";

import { Card } from "../../components/common/card/Card";
import { isMailMainInfos, usePstStore } from "../../store/PSTStore";
import { ROOT } from "../../utils/constants";
import type { DashboardComponentProps } from "./Dashboard";
import style from "./Dashboard.module.scss";
import { DashboardInformationsFolder } from "./DashboardInformationsFolder";
import { DashboardInformationsMail } from "./DashboardInformationsMail";

export const DashboardInformations: FC<DashboardComponentProps> = ({
    className,
}) => {
    const { mainInfos } = usePstStore();
    if (!mainInfos) return null; // TODO: loader
    return (
        <Card title="Informations" color="green" className={className}>
            <div className={style.dashboard__informations}>
                {mainInfos.data.name === ROOT ? (
                    <p>
                        Passer le curseur sur le visualiseur pour afficher des
                        informations
                    </p>
                ) : (
                    <ul>
                        {isMailMainInfos(mainInfos) ? (
                            <DashboardInformationsMail mainInfos={mainInfos} />
                        ) : (
                            <DashboardInformationsFolder
                                mainInfos={mainInfos}
                            />
                        )}
                    </ul>
                )}
            </div>
        </Card>
    );
};
