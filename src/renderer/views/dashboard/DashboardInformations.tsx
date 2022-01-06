/* eslint-disable react/no-unescaped-entities */
import type { FC } from "react";
import React from "react";

import { Card } from "../../../renderer/components/common/card/Card";
import { usePSTStore } from "../../../renderer/store/PSTStore";
import style from "./Dashboard.module.scss";

export const DashboardInformations: FC = () => {
    const { mainInfos } = usePSTStore();

    return (
        <Card title="Informations" color="green">
            <div className={style.dashboard__informations}>
                {mainInfos ? (
                    <ul>
                        <li>
                            <span>Nom du dossier / mail : </span>
                            {mainInfos.name}
                        </li>
                        <li>
                            <span>Nombre de pj : </span>
                            {mainInfos.attachementCount}
                        </li>
                        <li>
                            <span>Nombre de mails : </span>
                            {/* {mainInfos.attachementCount} */}
                        </li>

                        <li>
                            <span>Date d'envoi : </span>
                            {JSON.stringify(mainInfos.sentTime)}
                        </li>
                        <li>
                            <span>Date de réception : </span>
                            {JSON.stringify(mainInfos.receivedDate)}
                        </li>
                        <li>
                            <span>Adresse mail : </span>
                            {JSON.stringify(mainInfos.from, null, 1)}
                            {/* {mainInfos.from.email ?? null} */}
                        </li>
                    </ul>
                ) : (
                    <p>
                        Passer le curseur sur le visualiseur pour afficher des
                        informations
                    </p>
                )}
            </div>
        </Card>
    );
};
