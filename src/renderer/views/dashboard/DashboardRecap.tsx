import type { FC } from "react";
import React, { useCallback, useState } from "react";

import { Card } from "../../../renderer/components/common/card/Card";
import { usePSTStore } from "../../../renderer/store/PSTStore";
import {
    getPstMailsPercentage,
    getPstTotalContacts,
    getPstTotalDeletedMails,
    getPstTotalReceivedAttachments,
    getPstTotalReceivedMails,
    getPstTotalSentAttachments,
    getPstTotalSentMails,
} from "../../../renderer/utils/pst-extractor";
import style from "./Dashboard.module.scss";
import { DashboardRecapItem } from "./DashboardRecapItem";
import { DashboardRecapSelectFolder } from "./DashboardRecapSelectFolder";

// TODO: pas toujours de dossiers "supprimés" ou "envoyés"
export const DashboardRecap: FC = () => {
    const [isRecapReady, setIsRecapReady] = useState(false);

    const switchView = useCallback(() => {
        setIsRecapReady(true);
    }, []);
    const { pstFile, deletedFolder, extractTables } = usePSTStore();

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

    return (
        <Card title="Synthèse" color="blue">
            {isRecapReady ? (
                <div className={style.dashboard__recap}>
                    <DashboardRecapItem
                        title="Messages reçus"
                        mails={receivedMailsTotal}
                        attachements={receivedAttachmentsTotal}
                        percentage={receivedPercentageMails}
                    />
                    <DashboardRecapItem
                        title="Messages envoyés"
                        mails={sentMailsTotal}
                        attachements={sentAttachmentsTotal}
                        percentage={sentPercentageMails}
                    />
                    <DashboardRecapItem
                        title="Messages supprimés"
                        mails={deletedMailsTotal}
                        attachements={0}
                        percentage={"0"}
                    />
                    <DashboardRecapItem
                        title="Contacts"
                        contact={contactTotal}
                    />
                </div>
            ) : (
                <DashboardRecapSelectFolder switchView={switchView} />
            )}
        </Card>
    );
};
