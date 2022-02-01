/* eslint-disable react/no-unescaped-entities */
import type { Any } from "@common/utils/type";
import type { ComputedDatum } from "@nivo/circle-packing";
import type { FC } from "react";
import React from "react";
import type { MailViewerObject } from "src/renderer/utils/pst-extractor";

import { Card } from "../../components/common/card/Card";
import type { UsePstStore } from "../../store/PSTStore";
import { isMailMainInfos, usePstStore } from "../../store/PSTStore";
import { ROOT } from "../../utils/constants";
import { sanitizeMailDate } from "../../utils/pst-viewer";
import type { DashboardComponentProps } from "./Dashboard";
import style from "./Dashboard.module.scss";

export const DashboardInformationsFolder: FC<{
    mainInfos: NonNullable<UsePstStore["mainInfos"]>; // TODO: remove non null or handle loader
}> = ({ mainInfos }) => (
    <>
        <div>
            <strong>Type </strong>dossier
        </div>
        <div>
            <strong>Titre </strong>
            {mainInfos.data.name}
        </div>
        <div>
            <strong>Nombre de mails </strong>
            {mainInfos.data.size}
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
            {(mainInfos.data as Any).tag}
            {/* TODO */}
        </div>
    </>
);
export const DashboardInformationsMail: FC<{
    mainInfos: ComputedDatum<MailViewerObject<string>>;
}> = ({ mainInfos }) => (
    <>
        <div>
            <strong>Type </strong>mail
        </div>
        <div>
            <strong>Titre </strong>
            {mainInfos.data.name}
        </div>
        <div>
            <strong>Date d'envoi </strong>{" "}
            {sanitizeMailDate(mainInfos.data.email.sentTime!)}
        </div>
        <div>
            <strong>Date de réception </strong>{" "}
            {sanitizeMailDate(mainInfos.data.email.receivedDate!)}
        </div>
        <div>
            <strong>Nombre de PJ </strong>{" "}
            {mainInfos.data.email.attachementCount}
        </div>
        <div>
            <strong>Expéditeur</strong> {mainInfos.data.email.from.email}
        </div>
        <div>
            <strong>Destinataire(s)</strong>{" "}
            {mainInfos.data.email.to.map((to, index) => (
                <span key={index}>{to.email}</span>
            ))}
            {/* TODO: use length of return elts to show "0" or elts */}
        </div>
        <div>
            <strong>Cc</strong>{" "}
            {mainInfos.data.email.cc.map((cc, index) => (
                <span key={index}>{cc.email}</span>
            ))}
        </div>
        <div>
            <strong>Bcc</strong>{" "}
            {mainInfos.data.email.bcc.map((bcc, index) => (
                <span key={index}>{bcc.email}</span>
            ))}
        </div>
        <div>
            <strong>Représentation (en %) </strong>
            {mainInfos.percentage.toFixed(1)}
            <div>
                <strong>Etat </strong>
                {(mainInfos.data as Any).tag}
            </div>
        </div>
    </>
);

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
