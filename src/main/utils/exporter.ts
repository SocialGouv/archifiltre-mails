import type { PstExtractTables } from "@common/modules/pst-extractor/type";
import type { SimpleObject } from "@common/utils/type";
import { t } from "i18next";

/**
 * Format the given emails table into a "readable" JSON for exporters to use.
 */
export const formatEmailTable = (
    emailsTable: PstExtractTables["emails"]
): SimpleObject[] => {
    const tKeys = {
        attachmentCount: t("exporter.table.attachment-count"),
        attachmentsFilename: t("exporter.table.attachments.filename"),
        attachmentsFilesize: t("exporter.table.attachments.filesize"),
        bccEmail: t("exporter.table.bcc.email"),
        bccName: t("exporter.table.bcc.name"),
        ccEmail: t("exporter.table.cc.email"),
        ccName: t("exporter.table.cc.name"),
        contentText: t("exporter.table.content-text"),
        fromEmail: t("exporter.table.from.email"),
        fromName: t("exporter.table.from.name"),
        id: t("exporter.table.id"),
        receivedDate: t("exporter.table.received-date"),
        sentTime: t("exporter.table.send-time"),
        subject: t("exporter.table.subject"),
        toEmail: t("exporter.table.to.email"),
        toName: t("exporter.table.to.name"),
    };

    return [...emailsTable.values()].flat(1).map((email) => ({
        [tKeys.id]: email.id,
        [tKeys.receivedDate]: email.receivedDate,
        [tKeys.sentTime]: email.sentTime,
        [tKeys.fromName]: email.from.name,
        [tKeys.fromEmail]: email.from.email ?? "",
        [tKeys.toName]: email.to.map((to) => to.name).join(","),
        [tKeys.toEmail]: email.to.map((to) => to.email).join(","),
        [tKeys.ccName]: email.cc.map((cc) => cc.name).join(","),
        [tKeys.ccEmail]: email.cc.map((cc) => cc.email).join(","),
        [tKeys.bccName]: email.bcc.map((bcc) => bcc.name).join(","),
        [tKeys.bccEmail]: email.bcc.map((bcc) => bcc.email).join(","),
        [tKeys.subject]: email.subject,
        [tKeys.attachmentCount]: email.attachementCount,
        [tKeys.attachmentsFilesize]: email.attachements
            .map((attachement) => attachement.filesize)
            .join(","),
        [tKeys.attachmentsFilename]: email.attachements
            .map((attachement) => attachement.filename)
            .join(","),
        [tKeys.contentText]: email.contentText,
    }));
};
