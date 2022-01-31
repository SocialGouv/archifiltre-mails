/* eslint-disable react/no-unescaped-entities */
import type { Any } from "@common/utils/type";
import type { FC } from "react";
import React from "react";

import { Card } from "../../components/common/card/Card";
import { usePstStore } from "../../store/PSTStore";
import { markedTags, ROOT } from "../../utils/constants";
import type { DashboardComponentProps } from "./Dashboard";
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
        <div>
            <strong>Type </strong>dossier
        </div>
        <div>
            <strong>Titre </strong>
            {mainInfos.name}
        </div>
        <div>
            <strong>Nombre de mails </strong>
            {mainInfos.size}
        </div>
        <div>
            <strong>Nombre de PJ </strong>?
        </div>
        <div>
            <strong>Représentation (en %) </strong>
            {mainInfos.percentage.toFixed(1)}
        </div>
        <div>
            <strong>Etat </strong>
            {mainInfos.tag}
        </div>
    </>
);
export const DashboardInformationsMail: FC<{ mainInfos: Any }> = ({
    mainInfos,
}) => (
    <>
        <div>
            <strong>Type </strong>mail
        </div>
        <div>
            <strong>Titre </strong>
            {mainInfos.name}
        </div>
        <div>
            <strong>Date d'envoi </strong>{" "}
            {JSON.stringify(mainInfos.email.sentTime)}
        </div>
        <div>
            <strong>Date de réception </strong>{" "}
            {JSON.stringify(mainInfos.email.receivedDate)}
        </div>
        <div>
            <strong>Nombre de PJ </strong> {mainInfos.email.attachementCount}
        </div>
        <div>
            <strong>Expéditeur</strong> {mainInfos.email.from.email}
        </div>
        <div>
            <strong>Destinataire(s)</strong> {mainInfos.email.to.email}
        </div>
        <div>
            <strong>Cc</strong>{" "}
            {mainInfos.email.cc.map((cc: string, index: number) => (
                <span key={index}>{cc.email}</span>
            )) ?? 0}
        </div>
        <div>
            <strong>Bcc</strong>{" "}
            {mainInfos.email.bcc.map((bcc: string, index: number) => (
                <span key={index}>{bcc.email}</span>
            )) ?? 0}
        </div>
        <div>
            <strong>Représentation (en %) </strong>
            {mainInfos.percentage.toFixed(1)}
            <div>
                <strong>Etat </strong>
                {mainInfos.tag}
            </div>
        </div>
    </>
);

export const DashboardInformations: FC<DashboardComponentProps> = ({
    className,
}) => {
    const { mainInfos } = usePstStore();

    if (!mainInfos) return null;
    return (
        <Card title="Informations" color="green" className={className}>
            <div className={style.dashboard__informations}>
                {mainInfos && mainInfos.name === ROOT ? (
                    <p>
                        Passer le curseur sur le visualiseur pour afficher des
                        informations
                    </p>
                ) : (
                    <ul>
                        {mainInfos.email ? (
                            <DashboardInformationsMail mainInfos={mainInfos} />
                        ) : (
                            <DashboardInformationsFolder
                                mainInfos={mainInfos}
                            />
                        )}
                        {/* <DashboardInformationsTags tag={mainInfos.tag} /> */}
                    </ul>
                )}
            </div>
        </Card>
    );
};

{
    /* <li>
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
<li>
    <span>Etat </span>
    {mainInfos.tag}
</li>
</li> */
}
