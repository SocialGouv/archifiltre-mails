import type { Any } from "@common/utils/type";
import type { ComputedDatum } from "@nivo/circle-packing";
import type { FC } from "react";
import React from "react";

import type { MailViewerObject } from "../../utils/pst-extractor";
import { sanitizeMailDate } from "../../utils/pst-viewer";

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
            {/* eslint-disable-next-line react/no-unescaped-entities */}
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
        <div>
            <div style={{ maxHeight: 200, overflow: "scroll" }}>
                <strong>Mail (cliquer pour focus)</strong>
                <p style={{ wordBreak: "break-word" }}>
                    {mainInfos.data.email.contentText}
                </p>
            </div>
        </div>
    </>
);
