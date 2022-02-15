import type { ComputedDatum } from "@nivo/circle-packing";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import type { MailViewerObject } from "../../utils/pst-extractor";
import { sanitizeMailDate } from "../../utils/pst-viewer";

export const DashboardInformationsMail: FC<{
    mainInfos: ComputedDatum<MailViewerObject<string>>;
}> = ({ mainInfos }) => {
    const { t } = useTranslation();

    return (
        <>
            <div>
                <strong>{t("dashboard.informations.type")} </strong>
                {t("dashboard.informations.mail")}
            </div>
            <div>
                <strong>{t("dashboard.informations.title")} </strong>
                {mainInfos.data.name}
            </div>
            <div>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <strong>{t("dashboard.informations.sentDate")} </strong>{" "}
                {sanitizeMailDate(mainInfos.data.email.sentTime!)}
            </div>
            <div>
                <strong>{t("dashboard.informations.receivedDate")} </strong>{" "}
                {sanitizeMailDate(mainInfos.data.email.receivedDate!)}
            </div>
            <div>
                <strong>{t("dashboard.informations.attachedCount")} </strong>{" "}
                {mainInfos.data.email.attachementCount}
            </div>
            <div>
                <strong>{t("dashboard.informations.to")}</strong>{" "}
                {mainInfos.data.email.from.email}
            </div>
            <div>
                <strong>{t("dashboard.informations.from")}</strong>{" "}
                {mainInfos.data.email.to.map((to, index) => (
                    <span key={index}>{to.email}</span>
                ))}
                {/* TODO: use length of return elts to show "0" or elts */}
            </div>
            <div>
                <strong>{t("dashboard.informations.cc")}</strong>{" "}
                {mainInfos.data.email.cc.map((cc, index) => (
                    <span key={index}>{cc.email}</span>
                ))}
            </div>
            <div>
                <strong>{t("dashboard.informations.bcc")}</strong>{" "}
                {mainInfos.data.email.bcc.map((bcc, index) => (
                    <span key={index}>{bcc.email}</span>
                ))}
            </div>
            <div>
                <strong>{t("dashboard.informations.percentage")} </strong>
                {mainInfos.percentage.toFixed(1)}
            </div>
            <div>
                <div style={{ maxHeight: 200, overflow: "scroll" }}>
                    <strong>{t("dashboard.informations.mailFocus")}</strong>
                    <p style={{ wordBreak: "break-word" }}>
                        {mainInfos.data.email.contentText}
                    </p>
                </div>
            </div>
        </>
    );
};
