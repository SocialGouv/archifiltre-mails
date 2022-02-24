import type { FC } from "react";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "../../components/common/card/Card";
import {
    ContactPicto,
    FolderPicto,
    MailPicto,
    MailSentPicto,
    TrashPicto,
} from "../../components/common/pictos/picto";
import { usePstStore } from "../../store/PSTStore";
import {
    getPstListOfFolder,
    getPstMailsPercentage,
    getPstTotalContacts,
    getPstTotalDeletedMails,
    getPstTotalReceivedAttachments,
    getPstTotalReceivedMails,
    getPstTotalSentAttachments,
    getPstTotalSentMails,
} from "../../utils/dashboard-recap";
import style from "./Dashboard.module.scss";
import { DashboardRecapItem } from "./DashboardRecapItem";
import { DashboardRecapSelectFolder } from "./DashboardRecapSelectFolder";

// TODO: pas toujours de dossiers "supprimés" ou "envoyés" // Will be done in the associate PR
export const DashboardRecap: FC = () => {
    const { t } = useTranslation();
    const [isRecapReady, setIsRecapReady] = useState(false);

    const switchView = useCallback(() => {
        setIsRecapReady(true);
    }, []);

    const { pstFile, deletedFolder, extractTables } = usePstStore();

    // mails received
    const receivedMailsTotal = getPstTotalReceivedMails(extractTables);
    const receivedAttachmentsTotal =
        getPstTotalReceivedAttachments(extractTables);
    const receivedPercentageMails = getPstMailsPercentage(
        receivedMailsTotal,
        extractTables?.emails
    );

    // mails sent
    const sentMailsTotal = getPstTotalSentMails(extractTables);
    const sentAttachmentsTotal = getPstTotalSentAttachments(extractTables);
    const sentPercentageMails = getPstMailsPercentage(
        sentMailsTotal,
        extractTables?.emails
    );

    // mails deleted
    const deletedMailsTotal =
        pstFile && getPstTotalDeletedMails(pstFile, deletedFolder);

    // contact
    const contactTotal = getPstTotalContacts(extractTables?.contacts);

    if (!pstFile) return null;

    const totalFolderSize = getPstListOfFolder(pstFile.children).length;

    return (
        <Card title={t("dashboard.recap.cardTitle")} color="blue">
            {isRecapReady ? (
                <div className={style.dashboard__recap}>
                    <DashboardRecapItem
                        title={t("dashboard.recap.receivedMessages")}
                        mails={receivedMailsTotal}
                        attachements={receivedAttachmentsTotal}
                        percentage={receivedPercentageMails}
                        picto={<MailPicto />}
                    />
                    <DashboardRecapItem
                        title={t("dashboard.recap.sentMessages")}
                        mails={sentMailsTotal}
                        attachements={sentAttachmentsTotal}
                        percentage={sentPercentageMails}
                        picto={<MailSentPicto />}
                    />
                    <DashboardRecapItem
                        title={t("dashboard.recap.deletedMessages")}
                        mails={deletedMailsTotal}
                        attachements={0}
                        percentage={"0"}
                        picto={<TrashPicto />}
                    />
                    <DashboardRecapItem
                        title={t("dashboard.recap.contacts")}
                        contact={contactTotal}
                        picto={<ContactPicto />}
                    />
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
                                {t("dashboard.recap.folder")}
                            </span>
                            <span
                                className={
                                    style.dashboard__recap__informations__item
                                }
                            >
                                {totalFolderSize} {t("dashboard.recap.folder")}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <DashboardRecapSelectFolder switchView={switchView} />
            )}
        </Card>
    );
};
