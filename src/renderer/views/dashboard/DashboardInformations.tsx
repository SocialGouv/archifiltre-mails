/* eslint-disable react/no-unescaped-entities */
import type { Any } from "@common/utils/type";
import type { FC } from "react";
import React from "react";

import { Card } from "../../components/common/card/Card";
import { usePstStore } from "../../store/PSTStore";
import { markedTags } from "../../utils/constants";
import style from "./Dashboard.module.scss";

export const DashboardInformationsTags: FC<{ tag: Any }> = ({ tag }) => {
    const isToDeleteTag = tag === markedTags.TO_DELETE;
    const isToKeepTag = tag === markedTags.TO_KEEP;
    const isUntag = tag === markedTags.UNTAG;

    return (
        <div className={style.dashboard__informations__tag}>
            <div
                className={style.dashboard__informations__tag__item}
                data-tag={isToDeleteTag}
            >
                Supprimer
            </div>
            <div
                className={style.dashboard__informations__tag__item}
                data-tag={isUntag}
            >
                Non marqué
            </div>
            <div
                className={style.dashboard__informations__tag__item}
                data-tag={isToKeepTag}
            >
                Conserver
            </div>
        </div>
    );
};

export const DashboardInformationsFolder: FC<{ mainInfos: Any }> = ({
    mainInfos,
}) => (
    <>
        <li>
            <span>Type </span>dossier
        </li>
        <li>
            <span>Titre </span>
            {mainInfos.name}
        </li>
        <li>
            <span>Nombre de mails </span>
            {mainInfos.size}
        </li>
        <li>
            <span>Nombre de PJ </span>?
        </li>
        <li>
            <span>Représentation (en %) </span>
            {mainInfos.percentage.toFixed(1)}
        </li>
        <li>
            <span>Etat </span>
            {mainInfos.tag}
        </li>
    </>
);
export const DashboardInformationsMail: FC<{ mainInfos: Any }> = ({
    mainInfos,
}) => (
    <>
        <li>
            <span>Type </span>mail
        </li>
        <li>
            <span>Titre </span>
            {mainInfos.name}
        </li>
        <li>
            <span>Nombre de PJ </span> {mainInfos.email.attachementCount}
        </li>
        <li>
            <span>Expéditeur</span> {mainInfos.email.from.email}
        </li>
        <li>
            <span>Destinataire(s)</span> {mainInfos.email.to.email}
        </li>
        <li>
            <span>Cc</span>{" "}
            {mainInfos.email.cc.map((cc: string, index: number) => (
                <p key={index}>{cc.email}</p>
            )) ?? 0}
        </li>
        <li>
            <span>Bcc</span>{" "}
            {mainInfos.email.bcc.map((bcc: string, index: number) => (
                <p key={index}>{bcc.email}</p>
            )) ?? 0}
        </li>
        <li>
            <span>Représentation (en %) </span>
            {mainInfos.percentage.toFixed(1)}
        </li>
        <li>
            <span>Etat </span>
            {mainInfos.tag}
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
                        <DashboardInformationsTags tag={mainInfos.tag} />
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
