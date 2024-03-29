import {
    bytesToKilobytes,
    getPercentage,
    toDecimalsFloat,
} from "@common/utils";
import type { ComputedDatum } from "@nivo/circle-packing";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";

import { pstContentCounterPerLevelStore } from "../../store/PstContentCounterPerLevelStore";
import { AVERAGE_MAIL_SIZE_IN_KO } from "../../utils/constants";
import { sanitizeMailDate } from "../../utils/dashboard-viewer";
import type { MailViewerObject } from "../../utils/dashboard-viewer-dym";
import { getFileSizeByMail } from "../../utils/dashboard-viewer-dym";
import style from "./Dashboard.module.scss";

export const DashboardInformationsMail: FC<{
    mainInfos: ComputedDatum<MailViewerObject<string>>;
    view?: "domain" | "list";
}> = ({ mainInfos, view }) => {
    const { t } = useTranslation();
    const { totalFilesize } = pstContentCounterPerLevelStore();

    const volumeTotal =
        bytesToKilobytes(getFileSizeByMail(mainInfos.data.email.attachments)) +
        AVERAGE_MAIL_SIZE_IN_KO;

    return (
        <div className={style.dashboard__informations__wrapper__mail}>
            <div>
                <strong>{t("dashboard.informations.type")} </strong>
                {t("dashboard.informations.mailCount")}
            </div>
            <div>
                <strong>{t("dashboard.informations.object")} </strong>
                {mainInfos.data.email.subject}
            </div>
            <div>
                <strong>{t("dashboard.informations.sentDate")} </strong>{" "}
                {/* TODO: change sanitize with i18n */}
                {sanitizeMailDate(new Date(mainInfos.data.email.sentTime))}
            </div>
            <div>
                <strong>{t("dashboard.informations.receivedDate")} </strong>{" "}
                {sanitizeMailDate(new Date(mainInfos.data.email.receivedTime))}
            </div>
            <div>
                <strong>{t("dashboard.informations.parentFolder")}</strong>
                {mainInfos.data.email.elementPath}
            </div>
            <div>
                <strong>{t("dashboard.informations.attachementCount")} </strong>{" "}
                {mainInfos.data.email.attachmentCount}
            </div>

            <div>
                <strong>
                    {t("dashboard.informations.attachementTitles")}{" "}
                </strong>{" "}
                {mainInfos.data.email.attachments.map(({ filename }, index) => (
                    <span key={index}>{filename}</span>
                ))}
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
            {mainInfos.data.email.bcc.length > 0 && (
                <div>
                    <strong>{t("dashboard.informations.bcc")}</strong>{" "}
                    {mainInfos.data.email.bcc.map((bcc, index) => (
                        <span key={index}>{bcc.email}</span>
                    ))}
                </div>
            )}
            <div>
                <strong>{t("dashboard.informations.percentage")} </strong>
                {toDecimalsFloat(volumeTotal, 2)}Ko
                {view === "list"
                    ? null
                    : `(${getPercentage(
                          volumeTotal,
                          totalFilesize.last() ?? 1,
                          3
                      )}%)`}
            </div>
            <div>
                <strong>{t("dashboard.informations.mailFocus")}</strong>
                <div style={{ maxHeight: 150, overflow: "scroll" }}>
                    <p style={{ wordBreak: "break-word" }}>
                        {mainInfos.data.email.contentText}
                    </p>
                </div>
            </div>
        </div>
    );
};
