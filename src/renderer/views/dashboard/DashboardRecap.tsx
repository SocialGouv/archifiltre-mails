import { getPercentage } from "@common/utils";
import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import {
    ContactPicto,
    ExtremeDatePicto,
    FolderPicto,
    MailPicto,
    MailSentPicto,
    TrashPicto,
} from "../../components/common/pictos/picto";
import { OwnerFinder } from "../../components/owner-finder/OwnerFinder";
import { OwnerFinderLanding } from "../../components/owner-finder/OwnerFinderLanding";
import { usePstFileSizeStore } from "../../store/PstFileSizeStore";
import { usePstStore } from "../../store/PSTStore";
import { useSynthesisStore } from "../../store/SynthesisStore";
import {
    getDeletedMails,
    getDeletedMailsCount,
    getMailsAttachementCount,
    getMailsAttachementSize,
    getMailsByStatus,
    getPstListOfFolder,
} from "../../utils/dashboard-recap";
import { getExtremeMailsDates } from "../../utils/pst-extractor";
import style from "./Dashboard.module.scss";
import { DashboardRecapItem } from "./DashboardRecapItem";

export const DashboardRecap: FC = () => {
    const { t } = useTranslation();
    const [isRecapReady, setIsRecapReady] = useState(false);
    const [isFinder, setIsFinder] = useState(false);

    const { totalFileSize } = usePstFileSizeStore();
    const { extractDatas } = usePstStore();
    const { deletedFolderId, ownerId } = useSynthesisStore();

    const switchRecapOn = useCallback(() => {
        setIsRecapReady(true);
    }, []);

    const switchFinder = useCallback(() => {
        setIsFinder(!isFinder);
    }, [isFinder]);

    if (!extractDatas) return null;

    const sentMails = getMailsByStatus(ownerId, extractTables, "sent");
    const sentMailsCount = sentMails.length;
    const sentMailsAttachementCount = getMailsAttachementCount(sentMails);
    const sentMailsAttachementSize = getMailsAttachementSize(sentMails);
    const sentMailsAttachementPercentage = getPercentage(
        sentMailsAttachementSize,
        totalFileSize
    );

    const receivedMails = getMailsByStatus(ownerId, extractTables, "received");
    const receivedMailsCount = receivedMails.length;
    const receivedMailAttachmentCount = getMailsAttachementCount(receivedMails);
    const receivedMailsAttachementSize = getMailsAttachementSize(receivedMails);
    const receivedMailsAttachementPercentage = getPercentage(
        receivedMailsAttachementSize,
        totalFileSize
    );

    const deletedMails = getDeletedMails(pstFile, deletedFolderId);
    const {
        deletedMailsCount,
        deletedMailsAttachmentCount,
        deletedMailsAttachementSize,
    } = getDeletedMailsCount(deletedMails);
    const deletedMailsAttachementPercentage = getPercentage(
        deletedMailsAttachementSize,
        totalFileSize
    );

    const contactsCount = [...extractTables.contacts].flat().length;

    const totalFolderSize = getPstListOfFolder(pstFile.children).length;

    const { minDate, maxDate } = getExtremeMailsDates(extractTables);

    // TODO: move to default config (?)
    const extremeDateFormatParam: Intl.DateTimeFormatOptions = {
        dateStyle: "full",
    };
    return (
        <Card title={t("dashboard.recap.cardTitle")} color="blue">
            {isRecapReady ? (
                <div className={style.dashboard__recap}>
                    <DashboardRecapItem
                        title={t("dashboard.recap.receivedMessages")}
                        mails={receivedMailsCount}
                        attachements={receivedMailAttachmentCount}
                        percentage={receivedMailsAttachementPercentage}
                        picto={<MailPicto />}
                    />
                    <DashboardRecapItem
                        title={t("dashboard.recap.sentMessages")}
                        mails={sentMailsCount}
                        attachements={sentMailsAttachementCount}
                        percentage={sentMailsAttachementPercentage}
                        picto={<MailSentPicto />}
                    />
                    <DashboardRecapItem
                        title={t("dashboard.recap.deletedMessages")}
                        mails={deletedMailsCount}
                        attachements={deletedMailsAttachmentCount}
                        percentage={deletedMailsAttachementPercentage}
                        picto={<TrashPicto />}
                    />
                    <DashboardRecapItem
                        title={t("dashboard.recap.contactsTitle")}
                        contact={contactsCount}
                        picto={<ContactPicto />}
                    />
                    <div className={style.dashboard__recap__item}>
                        <div className={style.dashboard__recap__picto}>
                            <ExtremeDatePicto />
                        </div>

                        <div className={style.dashboard__recap__informations}>
                            <span
                                className={
                                    style.dashboard__recap__informations__item
                                }
                            >
                                {t("dashboard.recap.extremum")}
                            </span>
                            <span
                                className={
                                    style.dashboard__recap__informations__item
                                }
                            >
                                {t("dashboard.recap.extremum.minDate", {
                                    formatParams: {
                                        minDate: extremeDateFormatParam,
                                    },
                                    minDate,
                                })}
                            </span>
                            <span
                                className={
                                    style.dashboard__recap__informations__item
                                }
                            >
                                {t("dashboard.recap.extremum.maxDate", {
                                    formatParams: {
                                        maxDate: extremeDateFormatParam,
                                    },
                                    maxDate,
                                })}
                            </span>
                        </div>
                    </div>
                    <div className={style.dashboard__recap__item}>
                        <div className={style.dashboard__recap__picto}>
                            <FolderPicto />
                        </div>

                        <div className={style.dashboard__recap__informations}>
                            <span
                                className={
                                    style.dashboard__recap__informations__item
                                }
                            >
                                {t("dashboard.recap.folderLabel")}
                            </span>
                            <span
                                className={
                                    style.dashboard__recap__informations__item
                                }
                            >
                                {t("dashboard.recap.folder", {
                                    count: totalFolderSize,
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            ) : isFinder ? (
                <OwnerFinder switchFinder={switchRecapOn} />
            ) : (
                <OwnerFinderLanding switchView={switchFinder} />
            )}
        </Card>
    );
};
