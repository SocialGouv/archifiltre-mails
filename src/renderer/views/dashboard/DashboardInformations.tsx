/* eslint-disable react/no-unescaped-entities */
import type { Any } from "@common/utils/type";
import type { FC } from "react";
import React from "react";

import { Card } from "../../components/common/card/Card";
import { usePstStore } from "../../store/PSTStore";
import style from "./Dashboard.module.scss";

export const DashboardInformationsFolder: FC<{ mainInfos: Any }> = ({
    mainInfos,
}) => (
    <>
        <li>
            <span>Type: </span>dossier
        </li>
        <li>
            <span>Titre: </span>
            {mainInfos.name}
        </li>
        <li>
            <span>Nombre de mails: </span>
            {mainInfos.size}
        </li>
        <li>
            <span>Nombre de PJ: </span>?
        </li>
        <li>
            <span>Représentation (en %): </span>
            {mainInfos.percentage.toFixed(1)}
        </li>
    </>
);
export const DashboardInformationsMail: FC<{ mainInfos: Any }> = ({
    mainInfos,
}) => (
    <>
        <li>
            <span>Type: </span>mail
        </li>
        <li>
            <span>Titre: </span>
            {mainInfos.name}
        </li>
        <li>
            <span>Nombre de PJ: </span> {mainInfos.email.attachementCount}
        </li>
        <li>
            <span>De:</span> {mainInfos.email.from.name}
        </li>
        <li>
            <span>Cc:</span>{" "}
            {mainInfos.email.cc.map((cc: string, index: number) => (
                <p key={index}>{cc.email}</p>
            )) ?? 0}
        </li>
        <li>
            <span>Bcc:</span>{" "}
            {mainInfos.email.bcc.map((bcc: string, index: number) => (
                <p key={index}>{bcc.email}</p>
            )) ?? 0}
        </li>
        <li>
            <span>Représentation (en %): </span>
            {mainInfos.percentage.toFixed(1)}
        </li>
    </>
);

export const DashboardInformations: FC = () => {
    const { mainInfos } = usePstStore();

    return (
        <Card title="Informations" color="green">
            <div className={style.dashboard__informations}>
                {mainInfos ? (
                    <ul>
                        {mainInfos.email ? (
                            <DashboardInformationsMail mainInfos={mainInfos} />
                        ) : (
                            <DashboardInformationsFolder
                                mainInfos={mainInfos}
                            />
                        )}
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

// <ul>
// <li>
//     <span>Nom du dossier / mail : </span>
//     {mainInfos.name}
// </li>
// <li>
//     <span>Nombre de pj : </span>
//     {mainInfos.attachementCount}
// </li>
// <li>
//     <span>Nombre de mails : </span>
// </li>

// <li>
//     <span>Date d'envoi : </span>
//     {JSON.stringify(mainInfos.sentTime)}
// </li>
// <li>
//     <span>Date de réception : </span>
//     {JSON.stringify(mainInfos.receivedDate)}
// </li>
// <li>
//     <span>Adresse mail : </span>
//     {JSON.stringify(mainInfos.from, null, 1)}
// </li>
// </ul>
